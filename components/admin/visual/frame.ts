import type { Data, Item } from "@/lib/admin-schema";
import {
  BLANK,
  encodeText,
  fields,
  hash24,
  readImageTag,
  readTextTags,
  stripImage,
  stripText,
  type TagField,
  type TagRef,
} from "@/lib/visual/tags";

/**
 * DOM side of the visual editor. Everything here works on the Document of the preview frame and never touches React.
 * Tags (see lib/visual/tags.js) tell us which data field every piece of text / photo on the page came from.
 */
export interface Ref {
  file: string;
  list: string;
  index: number;
  key: string;
  n: number;
}

export interface Index {
  byHash: Map<number, string>;
  fields: Map<string, TagField[]>;
  /** Two page files share a tag hash (practically impossible): the editor refuses to run. */
  collision: boolean;
}

/** Numbers the editable fields exactly as the page was rendered, so tags stay valid until the next reload. */
export function buildIndex(data: Data): Index {
  const byHash = new Map<number, string>();
  const map = new Map<string, TagField[]>();
  let collision = false;
  for (const file of Object.keys(data)) {
    const h = hash24(file);
    if (byHash.has(h)) collision = true;
    byHash.set(h, file);
    map.set(file, fields(data[file]));
  }
  return { byHash, fields: map, collision };
}

function resolve(idx: Index, t: TagRef): Ref | null {
  const file = idx.byHash.get(t.pageHash);
  const f = file ? idx.fields.get(file)?.[t.n] : undefined;
  return file && f ? { file, list: f.list, index: f.index, key: f.key, n: f.n } : null;
}

/** The data field behind a text node, or null when the node carries no tag (or several). */
export function textRef(idx: Index, node: Text): Ref | null {
  const tags = readTextTags(node.data);
  return tags.length === 1 ? resolve(idx, tags[0]) : null;
}

export function imageRef(idx: Index, img: Element): Ref | null {
  const t = readImageTag(img.getAttribute("src") ?? "");
  return t ? resolve(idx, t) : null;
}

const NO_INLINE = new Set(["OPTION", "SELECT", "TEXTAREA", "TITLE", "SCRIPT", "STYLE", "NOSCRIPT"]);
const SHOW_TEXT = 4;

const isVisible = (el: Element | null) => !!el && el.getClientRects().length > 0;
export const canEditInline = (node: Text) => !!node.parentElement && !NO_INLINE.has(node.parentElement.tagName);

function textNodes(root: Node, doc: Document): Text[] {
  const out: Text[] = [];
  const w = doc.createTreeWalker(root, SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) out.push(n as Text);
  return out;
}

function caretNode(doc: Document, x: number, y: number): Node | null {
  const d = doc as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node } | null;
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
  };
  return d.caretPositionFromPoint?.(x, y)?.offsetNode ?? d.caretRangeFromPoint?.(x, y)?.startContainer ?? null;
}

export type Hit =
  | { kind: "text"; node: Text }
  | { kind: "image"; el: Element }
  | { kind: "placeholder"; el: Element }
  | null;

/** What did the pointer land on? (x and y are only needed for clicks, where they pick the exact word.) */
export function hitTest(doc: Document, idx: Index, target: EventTarget | null, x?: number, y?: number): Hit {
  const node = target as Node | null;
  const el = node && node.nodeType === 1 ? (node as Element) : (node?.parentElement ?? null);
  if (!el || el.closest("[data-nz-add]")) return null;

  const img = el.tagName === "IMG" ? el : el.closest(".ph-photo")?.querySelector("img");
  if (img && imageRef(idx, img)) return { kind: "image", el: img };

  const ph = el.closest(".ph:not(.ph-photo)");
  if (ph) return { kind: "placeholder", el: ph };

  const ok = (n: Node | null): n is Text =>
    !!n && n.nodeType === 3 && !!textRef(idx, n as Text) && isVisible((n as Text).parentElement) && el.contains(n);
  if (x !== undefined && y !== undefined) {
    const hit = caretNode(doc, x, y);
    if (ok(hit)) return { kind: "text", node: hit };
  }
  const own = Array.from(el.childNodes).find(ok);
  if (own) return { kind: "text", node: own as Text };
  const inner = textNodes(el, doc).find(ok);
  return inner ? { kind: "text", node: inner } : null;
}

/** First data field found in the text of a grey placeholder (its label contains the item's name). */
export function placeholderRef(doc: Document, idx: Index, ph: Element): Ref | null {
  for (const n of textNodes(ph, doc)) {
    const r = textRef(idx, n);
    if (r) return r;
  }
  return null;
}

export interface EditHooks {
  /** Called with the new text; return false to reject (the old text is restored). */
  commit: (next: string, orig: string) => boolean;
}

/**
 * Edit a piece of text in place. The text node is wrapped in a temporary contenteditable span and put back
 * (with its tag) when editing ends, so the page's own markup is left exactly as the page rendered it.
 */
export function beginEdit(doc: Document, node: Text, hooks: EditHooks): void {
  const tag = node.data.match(/\u2063[\u200b\u2060]+\u2064/)?.[0] ?? "";
  const orig = stripText(node.data);
  const span = doc.createElement("span");
  span.setAttribute("data-nz-edit", "1");
  node.replaceWith(span);
  span.appendChild(node);
  node.data = orig;
  span.contentEditable = "true";
  span.spellcheck = false;
  span.closest("a")?.setAttribute("draggable", "false");

  let done = false;
  const finish = (save: boolean) => {
    if (done) return;
    done = true;
    let text = orig;
    if (save) {
      const next = (span.textContent ?? "").replace(/\s*\n\s*/g, " ").trim();
      if (next !== orig && hooks.commit(next, orig)) text = next;
    }
    node.data = text + tag;
    span.replaceWith(node);
  };

  span.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      span.blur();
    } else if (e.key === "Escape") {
      e.preventDefault();
      finish(false);
    }
  });
  span.addEventListener("paste", (e) => {
    e.preventDefault();
    doc.execCommand("insertText", false, e.clipboardData?.getData("text/plain") ?? "");
  });
  span.addEventListener("blur", () => finish(true));

  span.focus();
  const sel = doc.defaultView?.getSelection();
  if (sel) {
    const range = doc.createRange();
    range.selectNodeContents(span);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

/** Commits and closes any text edit that is open. */
export function finishEdit(doc: Document): void {
  (doc.querySelector("[data-nz-edit]") as HTMLElement | null)?.blur();
}

/** After a value changed in the model, show it everywhere it appears on the page (the same field can appear several times). */
export function syncField(doc: Document, ref: Ref, oldValue: string, value: string): void {
  const tag = encodeText(ref.file, ref.n);
  for (const n of textNodes(doc.body, doc))
    if (n.data.includes(oldValue + tag)) n.data = n.data.replace(oldValue + tag, () => value + tag);
}

/** The element that visually holds one list item (the smallest element containing all of that item's tagged text and photos). */
export function cardOf(doc: Document, idx: Index, file: string, list: string, index: number): Element | null {
  const els: Element[] = [];
  const mine = (r: Ref | null) => !!r && r.file === file && r.list === list && r.index === index;
  for (const n of textNodes(doc.body, doc))
    if (n.parentElement && isVisible(n.parentElement) && mine(textRef(idx, n))) els.push(n.parentElement);
  for (const img of Array.from(doc.querySelectorAll("img")))
    if (mine(imageRef(idx, img))) els.push(img);
  if (!els.length) return null;
  let common: Element | null = els[0];
  while (common && !els.every((e) => common!.contains(e))) common = common.parentElement;
  if (!common) return null;
  return els.length === 1 ? (common.closest("figure, li, article, tr") ?? common) : common;
}

/** Marks empty photo slots so the page can show "click to add". */
export function markBlankPhotos(doc: Document): void {
  for (const img of Array.from(doc.querySelectorAll("img")))
    if (stripImage(img.getAttribute("src") ?? "") === BLANK) img.setAttribute("data-nz-blank", "1");
}

/**
 * Adds a small "+ Add photo here" strip at every place a page can show added photos. The pages mark those places
 * themselves (see ExtraImages), so the position always matches the "after" number saved with the photo.
 */
export function injectGaps(doc: Document): void {
  doc.querySelectorAll(".nz-gap").forEach((g) => g.remove());
  doc.querySelectorAll("[data-nz-after]").forEach((slot) => {
    const gap = doc.createElement("div");
    gap.className = "nz-gap";
    const b = doc.createElement("button");
    b.type = "button";
    b.setAttribute("data-nz-add", slot.getAttribute("data-nz-after") ?? "0");
    b.textContent = "＋ Add photo here";
    gap.appendChild(b);
    slot.appendChild(gap);
  });
}

export const EDITOR_CSS = `
[data-nz-hover]{outline:2px dashed #B98A2E !important;outline-offset:2px;cursor:pointer}
[data-nz-hover]:not(img):not(.ph){cursor:text}
.nz-sel{outline:2px solid #2A5F4F !important;outline-offset:5px}
[data-nz-edit]{outline:2px solid #B98A2E;background:rgba(215,179,106,.25);border-radius:2px;min-width:1ch;cursor:text}
img[data-nz-blank]{background:repeating-linear-gradient(45deg,#efe4c8,#efe4c8 10px,#f6efdd 10px,#f6efdd 20px)}
.ph-photo{position:relative}
.ph-photo:has(> img[data-nz-blank])::after{content:"＋ Click to add photo";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#4A443C;font:600 14px system-ui,sans-serif;pointer-events:none}
.ph:not(.ph-photo){cursor:pointer;outline:2px dashed rgba(185,138,46,.55);outline-offset:-6px}
.nz-gap{position:relative;height:0;z-index:20}
.nz-gap::before{content:"";position:absolute;left:0;right:0;top:-16px;height:32px}
.nz-gap button{position:absolute;left:50%;top:-15px;transform:translateX(-50%);opacity:0;transition:opacity .12s;background:#16302A;color:#fff;border:0;border-radius:999px;padding:6px 16px;font:600 13px system-ui,sans-serif;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.3)}
.nz-gap:hover button{opacity:1}
`;

export type { Item };
