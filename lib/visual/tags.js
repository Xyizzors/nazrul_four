/**
 * Shared by the dev-only visual editor and its JSON loader (plain CommonJS so both can require it).
 *
 * While the editor is running, every editable value in data/*.json is given an invisible tag that says
 * exactly where it came from (file, field number). The editor reads the tag back from the rendered page,
 * so a click on any text or photo maps to the right place in the data, even when the same words appear many times.
 *   - text values:   "Poetry" + invisible characters at the end
 *   - photo values:  "/assets/img/x.jpg#nz=<code>"  (a URL fragment is never sent to the server)
 */
const ZERO = "\u200b"; // bit 0
const ONE = "\u2060"; // bit 1
const OPEN = "\u2063";
const CLOSE = "\u2064";
const BITS = 40;

const SKIP_LISTS = new Set(["meta", "sections", "social"]);
const TEXT_KEY = /^(en|bn|text)$|_(en|bn)$/;
const TEXT_KEYS_EXTRA = new Set(["date", "year", "auth", "class", "capacity", "est"]);
const NOT_TEXT = new Set(["group_en", "group_bn"]); // the page groups items by these values, so they must stay identical
const IMAGE_KEY = /(^|_)(src|image|img|photo|cover|thumbnail)$/i;
/** A 1x1 transparent GIF used so that an empty photo slot still renders an element the editor can click. */
const BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

function hash24(name) {
  let h = 0x811c9dc5;
  for (let i = 0; i < name.length; i++) {
    h ^= name.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h & 0xffffff;
}

/** "text" | "image" | null: what kind of editable value is this field? */
function kindOf(list, key, value) {
  if (SKIP_LISTS.has(list) || typeof value !== "string") return null;
  if (IMAGE_KEY.test(key)) return value || list === "images" ? "image" : null;
  if (!value.trim() || NOT_TEXT.has(key) || key === "id" || key.startsWith("_")) return null;
  return TEXT_KEY.test(key) || TEXT_KEYS_EXTRA.has(key) ? "text" : null;
}

/** Every taggable field of one page file, in a stable order: [{ n, list, index, key, kind }]. */
function fields(data) {
  const out = [];
  for (const list of Object.keys(data)) {
    const items = data[list];
    if (!Array.isArray(items)) continue;
    items.forEach((item, index) => {
      for (const key of Object.keys(item)) {
        const kind = kindOf(list, key, item[key]);
        if (kind) out.push({ n: out.length, list, index, key, kind });
      }
    });
  }
  return out;
}

function code(page, n) {
  return (BigInt(hash24(page)) << 16n) | BigInt(n);
}

function encodeText(page, n) {
  const v = code(page, n);
  let s = OPEN;
  for (let i = BITS - 1; i >= 0; i--) s += (v >> BigInt(i)) & 1n ? ONE : ZERO;
  return s + CLOSE;
}

const TEXT_TAG = new RegExp(`${OPEN}([${ZERO}${ONE}]{${BITS}})${CLOSE}`, "g");
const IMG_TAG = /#nz=([0-9a-f]+)$/;

function decodeBits(bits) {
  let v = 0n;
  for (const ch of bits) v = (v << 1n) | (ch === ONE ? 1n : 0n);
  return { pageHash: Number(v >> 16n), n: Number(v & 0xffffn) };
}

/** Tag every taggable field of a page file (used by the loader). */
function tagData(page, data) {
  for (const f of fields(data)) {
    const item = data[f.list][f.index];
    if (f.kind === "text") item[f.key] += encodeText(page, f.n);
    else item[f.key] = (item[f.key] || BLANK) + "#nz=" + code(page, f.n).toString(16);
  }
  return data;
}

/** All tags found in a piece of text: [{ pageHash, n }] (text values may be concatenated). */
function readTextTags(text) {
  const found = [];
  for (const m of text.matchAll(TEXT_TAG)) found.push(decodeBits(m[1]));
  return found;
}

function readImageTag(src) {
  const m = IMG_TAG.exec(src || "");
  if (!m) return null;
  const v = BigInt("0x" + m[1]);
  return { pageHash: Number(v >> 16n), n: Number(v & 0xffffn) };
}

const stripText = (text) => text.replace(TEXT_TAG, "");
const stripImage = (src) => (src || "").replace(IMG_TAG, "");

module.exports = { hash24, kindOf, fields, tagData, readTextTags, readImageTag, stripText, stripImage, encodeText, BLANK };
