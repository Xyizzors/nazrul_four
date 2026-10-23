"use client";

import { useCallback, useEffect, useReducer, useRef, useState, type ReactNode } from "react";
import {
  FIXED_LISTS,
  GROUPS,
  LISTS,
  fieldLabel,
  isBangla,
  isHint,
  isImage,
  pageLabel,
  pretty,
  type Data,
  type PageData,
} from "@/lib/admin-schema";
import { stripImage } from "@/lib/visual/tags";
import {
  EDITOR_CSS,
  beginEdit,
  buildIndex,
  canEditInline,
  cardOf,
  finishEdit,
  hitTest,
  imageRef,
  injectGaps,
  markBlankPhotos,
  placeholderRef,
  syncField,
  textRef,
  type Index,
  type Ref,
} from "@/components/admin/visual/frame";

/**
 * Click-to-edit visual editor (development only, started with `npm run edit`).
 * The site is shown in a frame; click any text to type over it, click a photo to replace it, and use the side panel
 * to add, copy, move or delete list items. Everything is saved into the same data/*.json files as the control panel.
 */
const LANG_KEY = "nazrul-academy-lang";
type Lang = "en" | "bn";
interface Sel {
  file: string;
  list: string;
  index: number;
  key?: string;
}
interface Toast {
  text: string;
  error?: boolean;
}

const BTN =
  "rounded-sm border border-green-900 bg-white px-3 py-1.5 text-sm font-semibold text-green-900 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-40";
const BTN_PRIMARY =
  "rounded-sm border border-green-900 bg-green-900 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50";
const FIELD = "w-full rounded-sm border border-charcoal-900/25 bg-white px-2.5 py-1.5 text-sm text-charcoal-900";

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((body as { error?: string }).error ?? `Request failed (${res.status})`);
  return body as T;
}

const routeOf = (file: string) => (file === "home" ? "/" : `/${file}/`);

export default function VisualEditor() {
  const [, bump] = useReducer((n: number) => n + 1, 0);
  const dataRef = useRef<Data | null>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const idxRef = useRef<Index | null>(null);
  const modeRef = useRef(true);
  const langRef = useRef<Lang>("en");
  const undo = useRef<{ file: string; snap: string }[]>([]);
  const redo = useRef<{ file: string; snap: string }[]>([]);
  const lastEdit = useRef<{ key: string; t: number } | null>(null);
  const scrollY = useRef(0);
  const selRef = useRef<Sel | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [failed, setFailed] = useState("");
  const [file, setFile] = useState("home");
  const [lang, setLangState] = useState<Lang>("en");
  const [editing, setEditing] = useState(true);
  const [dirty, setDirty] = useState<ReadonlySet<string>>(new Set());
  const [busy, setBusy] = useState("");
  const [sel, setSelState] = useState<Sel | null>(null);
  const [picker, setPicker] = useState<{ pick: (path: string) => void } | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [log, setLog] = useState<string | null>(null);

  const say = useCallback((text: string, error = false) => {
    setToast({ text, error });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), error ? 7000 : 2500);
  }, []);

  /* ------------------------------------------------------------------ model */
  const mutate = useCallback((f: string, fn: (p: PageData) => void, coalesce?: string) => {
    const d = dataRef.current;
    if (!d) return;
    const now = Date.now();
    const last = lastEdit.current;
    if (!(coalesce && last && last.key === coalesce && now - last.t < 1500)) {
      undo.current.push({ file: f, snap: JSON.stringify(d[f]) });
      if (undo.current.length > 100) undo.current.shift();
    }
    lastEdit.current = coalesce ? { key: coalesce, t: now } : null;
    redo.current = [];
    fn(d[f]);
    setDirty((s) => new Set(s).add(f));
    bump();
  }, []);

  const saveAll = useCallback(async (): Promise<boolean> => {
    const d = dataRef.current;
    if (!d) return false;
    let ok = true;
    setBusy("Saving…");
    for (const f of Array.from(dirtyRef.current)) {
      try {
        await api(`/api/admin/data/${f}/`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(d[f]),
        });
        setDirty((s) => {
          const n = new Set(s);
          n.delete(f);
          return n;
        });
      } catch (e) {
        ok = false;
        say(`Could not save ${pageLabel(f)}: ${(e as Error).message}`, true);
      }
    }
    setBusy("");
    return ok;
  }, [say]);

  const dirtyRef = useRef<ReadonlySet<string>>(dirty);
  dirtyRef.current = dirty;

  const reloadFrame = useCallback(() => {
    const w = frameRef.current?.contentWindow;
    if (!w) return;
    scrollY.current = w.scrollY;
    // Give the dev server a moment to notice the file change.
    setTimeout(() => w.location.reload(), 450);
  }, []);

  /** Changes that alter the page's structure (add / delete / move / photos) are saved at once and the preview reloads. */
  const structural = useCallback(
    async (f: string, fn: (p: PageData) => void) => {
      mutate(f, fn);
      if (await saveAll()) reloadFrame();
    },
    [mutate, saveAll, reloadFrame],
  );

  const setField = useCallback(
    (ref: Pick<Sel, "file" | "list" | "index"> & { key: string }, value: string | number) => {
      const d = dataRef.current;
      const item = d?.[ref.file]?.[ref.list]?.[ref.index];
      if (!d || !item) return;
      const old = item[ref.key];
      if (old === value) return;
      if (isImage(ref.key)) {
        void structural(ref.file, (p) => {
          p[ref.list][ref.index][ref.key] = value;
        });
        return;
      }
      mutate(
        ref.file,
        (p) => {
          p[ref.list][ref.index][ref.key] = value;
        },
        `${ref.file}:${ref.list}:${ref.index}:${ref.key}`,
      );
      const doc = frameRef.current?.contentDocument;
      const idx = idxRef.current;
      const f = idx?.fields.get(ref.file)?.find((x) => x.list === ref.list && x.index === ref.index && x.key === ref.key);
      if (doc && f && typeof old === "string")
        syncField(doc, { file: ref.file, list: ref.list, index: ref.index, key: ref.key, n: f.n }, old, String(value));
    },
    [mutate, structural],
  );

  const doUndo = useCallback(
    async (back: boolean) => {
      const from = back ? undo.current : redo.current;
      const to = back ? redo.current : undo.current;
      const step = from.pop();
      const d = dataRef.current;
      if (!step || !d) return say(back ? "Nothing to undo." : "Nothing to redo.");
      to.push({ file: step.file, snap: JSON.stringify(d[step.file]) });
      d[step.file] = JSON.parse(step.snap) as PageData;
      lastEdit.current = null;
      setDirty((s) => new Set(s).add(step.file));
      bump();
      if (await saveAll()) reloadFrame();
    },
    [reloadFrame, saveAll, say],
  );

  /* -------------------------------------------------------------- selection */
  const highlight = useCallback((s: Sel | null) => {
    const doc = frameRef.current?.contentDocument;
    const idx = idxRef.current;
    if (!doc || !idx) return;
    doc.querySelectorAll(".nz-sel").forEach((e) => e.classList.remove("nz-sel"));
    if (s) cardOf(doc, idx, s.file, s.list, s.index)?.classList.add("nz-sel");
  }, []);

  const select = useCallback(
    (s: Sel | null) => {
      selRef.current = s;
      setSelState(s);
      highlight(s);
    },
    [highlight],
  );

  const openPicker = useCallback((pick: (path: string) => void) => setPicker({ pick }), []);

  const pickFor = useCallback(
    (s: Sel & { key: string }) =>
      openPicker((path) => {
        setPicker(null);
        setField(s, path);
      }),
    [openPicker, setField],
  );

  const addImageAt = useCallback(
    (after: number) =>
      openPicker((path) => {
        setPicker(null);
        const f = fileRef.current;
        void structural(f, (p) => {
          const list = (p.extras ??= []);
          list.push({ after, src: path, alt: "", caption_en: "", caption_bn: "" });
        });
      }),
    [openPicker, structural],
  );

  const fileRef = useRef(file);
  fileRef.current = file;

  /* ------------------------------------------------------------ the preview */
  // Latest callbacks for listeners that are installed once per loaded page.
  const live = useRef({ select, pickFor, addImageAt, saveAll, doUndo, say });
  live.current = { select, pickFor, addImageAt, saveAll, doUndo, say };

  const applyLang = useCallback((doc: Document, l: Lang) => {
    doc.documentElement.setAttribute("data-lang-active", l);
    doc.documentElement.setAttribute("lang", l);
  }, []);

  const install = useCallback((doc: Document) => {
    let hovered: Element | null = null;
    const clearHover = () => {
      hovered?.removeAttribute("data-nz-hover");
      hovered = null;
    };

    doc.addEventListener(
      "mouseover",
      (e) => {
        const idx = idxRef.current;
        if (!modeRef.current || !idx) return;
        clearHover();
        if ((e.target as Element).closest?.("[data-nz-edit]")) return;
        const hit = hitTest(doc, idx, e.target);
        const el = hit?.kind === "text" ? hit.node.parentElement : hit ? hit.el : null;
        if (el) {
          el.setAttribute("data-nz-hover", "1");
          hovered = el;
        }
      },
      true,
    );

    doc.addEventListener(
      "click",
      (e) => {
        const idx = idxRef.current;
        if (!modeRef.current || !idx) return;
        const target = e.target as Element;
        if (target.closest?.("[data-nz-edit]")) return e.preventDefault();
        e.preventDefault();
        e.stopPropagation();
        const add = target.closest?.("[data-nz-add]");
        if (add) return live.current.addImageAt(Number(add.getAttribute("data-nz-add")));
        clearHover();
        const hit = hitTest(doc, idx, target, e.clientX, e.clientY);
        if (!hit) return live.current.select(null);

        if (hit.kind === "image") {
          const r = imageRef(idx, hit.el);
          if (r) live.current.select({ file: r.file, list: r.list, index: r.index, key: r.key });
        } else if (hit.kind === "placeholder") {
          const r = placeholderRef(doc, idx, hit.el);
          if (!r) return live.current.select(null);
          const item = dataRef.current?.[r.file]?.[r.list]?.[r.index];
          const key = item && Object.keys(item).find((k) => isImage(k));
          live.current.select({ file: r.file, list: r.list, index: r.index, key });
          if (key) live.current.pickFor({ file: r.file, list: r.list, index: r.index, key });
        } else {
          const r = textRef(idx, hit.node);
          if (!r) return;
          live.current.select({ file: r.file, list: r.list, index: r.index, key: r.key });
          if (!canEditInline(hit.node)) return;
          beginEdit(doc, hit.node, {
            commit: (next, orig) => {
              const cur = dataRef.current?.[r.file]?.[r.list]?.[r.index]?.[r.key];
              if (cur !== orig) {
                live.current.say("The preview is out of date, so that change was not applied. Reloading…", true);
                reloadRef.current();
                return false;
              }
              mutateRef.current(r.file, (p) => {
                p[r.list][r.index][r.key] = next;
              });
              syncField(doc, r, orig, next);
              return true;
            },
          });
        }
      },
      true,
    );

    doc.addEventListener(
      "dblclick",
      (e) => {
        const idx = idxRef.current;
        if (!modeRef.current || !idx) return;
        const hit = hitTest(doc, idx, e.target);
        if (hit?.kind !== "image") return;
        const r = imageRef(idx, hit.el);
        if (r) live.current.pickFor({ file: r.file, list: r.list, index: r.index, key: r.key });
      },
      true,
    );

    doc.addEventListener("submit", (e) => modeRef.current && e.preventDefault(), true);
    doc.addEventListener(
      "keydown",
      (e) => {
        const mod = e.ctrlKey || e.metaKey;
        if (!mod) return;
        const k = e.key.toLowerCase();
        const typing = !!(e.target as Element).closest?.("[data-nz-edit]");
        if (k === "s") {
          e.preventDefault();
          finishEdit(doc);
          void live.current.saveAll();
        } else if (!typing && (k === "z" || k === "y")) {
          e.preventDefault();
          void live.current.doUndo(k === "z" && !e.shiftKey);
        }
      },
      true,
    );
  }, []);

  const mutateRef = useRef(mutate);
  mutateRef.current = mutate;
  const reloadRef = useRef(reloadFrame);
  reloadRef.current = reloadFrame;

  const onFrameLoad = useCallback(() => {
    const frame = frameRef.current;
    const w = frame?.contentWindow;
    const doc = frame?.contentDocument;
    const d = dataRef.current;
    if (!w || !doc || !d) return;
    try {
      w.sessionStorage.setItem(LANG_KEY, langRef.current);
    } catch {
      /* the language then simply resets on reload */
    }
    applyLang(doc, langRef.current);
    idxRef.current = buildIndex(d);
    const name = w.location.pathname.replace(/^\/|\/$/g, "") || "home";
    if (d[name]) setFile(name);
    install(doc);
    // Wait until the page has finished hydrating before adding anything to it.
    setTimeout(() => {
      const idx = idxRef.current;
      if (!idx || frame.contentDocument !== doc) return;
      const style = doc.createElement("style");
      style.textContent = EDITOR_CSS;
      doc.head.appendChild(style);
      markBlankPhotos(doc);
      if (modeRef.current) injectGaps(doc);
      const s = selRef.current;
      if (s && d[s.file]?.[s.list]?.[s.index]) highlight(s);
      else if (s) select(null);
      if (scrollY.current) w.scrollTo(0, scrollY.current);
    }, 1500);
  }, [applyLang, highlight, install, select]);

  /* ----------------------------------------------------------- page chrome */
  useEffect(() => {
    api<{ data: Data }>("/api/admin/data/")
      .then(({ data }) => {
        dataRef.current = data;
        bump();
      })
      .catch((e: Error) => setFailed(e.message));
  }, []);

  useEffect(() => {
    modeRef.current = editing;
    const doc = frameRef.current?.contentDocument;
    const idx = idxRef.current;
    if (!doc || !idx) return;
    finishEdit(doc);
    doc.querySelectorAll("[data-nz-hover]").forEach((e) => e.removeAttribute("data-nz-hover"));
    if (editing) injectGaps(doc);
    else doc.querySelectorAll(".nz-gap").forEach((g) => g.remove());
  }, [editing]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      const k = e.key.toLowerCase();
      const field = (e.target as Element).closest?.("input, textarea");
      if (k === "s") {
        e.preventDefault();
        void saveAll();
      } else if (!field && (k === "z" || k === "y")) {
        e.preventDefault();
        void doUndo(k === "z" && !e.shiftKey);
      }
    };
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current.size) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", beforeUnload);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, [doUndo, saveAll]);

  function setLang(l: Lang) {
    langRef.current = l;
    setLangState(l);
    const frame = frameRef.current;
    const doc = frame?.contentDocument;
    if (!doc) return;
    finishEdit(doc);
    applyLang(doc, l);
    try {
      frame.contentWindow?.sessionStorage.setItem(LANG_KEY, l);
    } catch {
      /* ignore */
    }
    // The selected card may have a different size in the other language.
    highlight(selRef.current);
  }

  function goTo(name: string) {
    const frame = frameRef.current;
    if (!frame?.contentWindow) return;
    scrollY.current = 0;
    select(null);
    frame.contentWindow.location.assign(routeOf(name));
  }

  async function build() {
    if (dirty.size && !(await saveAll())) return;
    setBusy("Building the site… this can take a minute");
    try {
      const r = await api<{ ok: boolean; log: string }>("/api/admin/build/", { method: "POST" });
      setLog(r.ok ? `Done. Upload everything inside the “out” folder to your host.\n\n${r.log}` : `The build failed.\n\n${r.log}`);
    } catch (e) {
      say((e as Error).message, true);
    }
    setBusy("");
  }

  /* ------------------------------------------------------------------ view */
  const data = dataRef.current;
  if (failed)
    return (
      <Shell>
        <p className="m-8 text-red-700">Could not load the site data: {failed}. Run this with <code>npm run edit</code> on your own computer.</p>
      </Shell>
    );
  if (!data) return <Shell><p className="m-8 text-charcoal-700">Loading…</p></Shell>;

  const pages = Object.entries(GROUPS)
    .map(([group, names]) => [group, Object.keys(names).filter((n) => n !== "site" && data[n])] as const)
    .filter(([, names]) => names.length);
  const unsaved = dirty.size;

  return (
    <Shell>
      <header className="flex flex-wrap items-center gap-2 border-b border-charcoal-900/15 bg-cream-100 px-3 py-2">
        <strong className="mr-1 font-display text-green-900">Visual editor</strong>
        <select value={file} onChange={(e) => goTo(e.target.value)} className={`${FIELD} !w-auto`} aria-label="Page">
          {pages.map(([group, names]) => (
            <optgroup key={group} label={group}>
              {names.map((n) => (
                <option key={n} value={n}>
                  {pageLabel(n)}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <div className="flex overflow-hidden rounded-sm border border-green-900" role="group" aria-label="Language">
          {(["en", "bn"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`px-3 py-1.5 text-sm font-semibold ${lang === l ? "bg-green-900 text-white" : "bg-white text-green-900"}`}
            >
              {l === "en" ? "English" : "বাংলা"}
            </button>
          ))}
        </div>
        <button type="button" className={BTN} onClick={() => setEditing((v) => !v)}>
          {editing ? "👁 Preview" : "✎ Edit"}
        </button>
        <button type="button" className={BTN} onClick={() => select({ file, list: "meta", index: 0 })} disabled={!data[file]?.meta?.length}>
          Page title
        </button>
        <button type="button" className={BTN} onClick={() => void doUndo(true)} disabled={!undo.current.length} title="Undo (Ctrl+Z)">
          ↶
        </button>
        <button type="button" className={BTN} onClick={() => void doUndo(false)} disabled={!redo.current.length} title="Redo (Ctrl+Shift+Z)">
          ↷
        </button>
        <span className="ml-auto text-sm text-charcoal-700" aria-live="polite">
          {busy || (unsaved ? `${unsaved} page${unsaved > 1 ? "s" : ""} with unsaved changes` : "All changes saved")}
        </span>
        <button type="button" className={BTN_PRIMARY} onClick={() => void saveAll().then((ok) => ok && (reloadFrame(), say("Saved.")))} disabled={!unsaved || !!busy}>
          Save
        </button>
        <button type="button" className={BTN} onClick={() => void build()} disabled={!!busy}>
          Save &amp; build for upload
        </button>
        <a className="text-sm text-green-900 underline" href="/control-panel/" target="_blank" rel="noreferrer">
          List editor
        </a>
      </header>

      <div className="flex min-h-0 flex-1">
        <iframe ref={frameRef} src="/" onLoad={onFrameLoad} title="Site preview" className="min-w-0 flex-1 border-0 bg-white" />
        <aside className="w-[340px] shrink-0 overflow-y-auto border-l border-charcoal-900/15 bg-cream-50 p-3">
          {sel && data[sel.file]?.[sel.list]?.[sel.index] ? (
            <Inspector
              data={data}
              sel={sel}
              onField={(k, v) => setField({ ...sel, key: k }, v)}
              onPick={(k) => pickFor({ ...sel, key: k })}
              onList={(fn) => void structural(sel.file, fn)}
              onSelect={select}
            />
          ) : (
            <Help />
          )}
        </aside>
      </div>

      {picker && <Picker onPick={picker.pick} onClose={() => setPicker(null)} onError={(m) => say(m, true)} />}
      {log !== null && (
        <Modal onClose={() => setLog(null)} title="Build">
          <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap text-xs">{log}</pre>
        </Modal>
      )}
      {toast && (
        <div role="status" className={`fixed bottom-4 left-1/2 z-[120] -translate-x-1/2 rounded-sm px-4 py-2 text-sm text-white shadow-lg ${toast.error ? "bg-red-700" : "bg-green-900"}`}>
          {toast.text}
        </div>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: ReactNode }) {
  // Covers the site's own header and footer: this page is only the editor.
  return <div className="fixed inset-0 z-[100] flex flex-col bg-white">{children}</div>;
}

function Help() {
  return (
    <div className="space-y-3 text-sm text-charcoal-700">
      <h2 className="font-display text-lg text-green-900">How to edit</h2>
      <p><b>Text:</b> click it and type. Press Enter to finish, Esc to cancel.</p>
      <p><b>Photos:</b> click one to select it, double-click to replace it. Grey “placeholder” boxes: click to choose a photo.</p>
      <p><b>Add a photo anywhere:</b> hover between two sections and press “＋ Add photo here”.</p>
      <p><b>Add, copy, move or delete an entry</b> (a notice, event, person, photo…): click it, then use the buttons here.</p>
      <p><b>বাংলা / English:</b> switch language at the top to edit the other version of each text.</p>
      <p>Press <b>Save</b> (Ctrl+S) to write your changes. Adding, deleting, moving and photo changes save automatically.</p>
    </div>
  );
}

function Inspector({
  data,
  sel,
  onField,
  onPick,
  onList,
  onSelect,
}: {
  data: Data;
  sel: Sel;
  onField: (key: string, value: string | number) => void;
  onPick: (key: string) => void;
  onList: (fn: (p: PageData) => void) => void;
  onSelect: (s: Sel | null) => void;
}) {
  const { file, list, index } = sel;
  const items = data[file][list];
  const item = items[index];
  const fixed = FIXED_LISTS.has(list);
  const where = `${pageLabel(file)} › ${LISTS[list] ?? pretty(list)}${fixed ? "" : ` #${index + 1}`}`;

  const move = (to: number) => {
    onList((p) => {
      const [it] = p[list].splice(index, 1);
      p[list].splice(to, 0, it);
    });
    onSelect({ ...sel, index: to });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-display text-base leading-tight text-green-900">{where}</h2>
        <button type="button" className="text-sm text-charcoal-500 hover:text-charcoal-900" onClick={() => onSelect(null)} aria-label="Close">
          ✕
        </button>
      </div>

      {!fixed && (
        <div className="flex flex-wrap gap-1.5">
          <button type="button" className={BTN} disabled={index === 0} onClick={() => move(index - 1)}>↑ Up</button>
          <button type="button" className={BTN} disabled={index === items.length - 1} onClick={() => move(index + 1)}>↓ Down</button>
          <button
            type="button"
            className={BTN}
            onClick={() => {
              onList((p) => p[list].splice(index + 1, 0, { ...p[list][index] }));
              onSelect({ ...sel, index: index + 1 });
            }}
          >
            ⧉ Add another like this
          </button>
          <button
            type="button"
            className={`${BTN} !border-red-700 !text-red-700 hover:!bg-red-700/10`}
            onClick={() => {
              if (!window.confirm("Delete this entry from the page?")) return;
              onList((p) => p[list].splice(index, 1));
              onSelect(null);
            }}
          >
            🗑 Delete
          </button>
        </div>
      )}

      {Object.entries(item)
        .filter(([k]) => !isHint(k))
        .map(([k, v]) => (
          <label key={k} className="block">
            <span className={`mb-1 block text-xs font-semibold ${sel.key === k ? "text-gold-500" : "text-charcoal-700"}`}>{fieldLabel(k)}</span>
            {isImage(k) ? (
              <ImageField value={String(v)} onPick={() => onPick(k)} onClear={() => onField(k, "")} />
            ) : typeof v === "number" ? (
              <input type="number" className={FIELD} value={v} onChange={(e) => onField(k, Number(e.target.value))} />
            ) : String(v).length > 70 || /^(desc|text)/.test(k) || k === "description" ? (
              <textarea rows={4} lang={isBangla(k) ? "bn" : undefined} className={FIELD} value={String(v)} onChange={(e) => onField(k, e.target.value)} />
            ) : (
              <input lang={isBangla(k) ? "bn" : undefined} className={FIELD} value={String(v)} onChange={(e) => onField(k, e.target.value)} />
            )}
          </label>
        ))}
    </div>
  );
}

function ImageField({ value, onPick, onClear }: { value: string; onPick: () => void; onClear: () => void }) {
  return (
    <span className="flex items-center gap-2">
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={stripImage(value)} alt="" className="h-16 w-16 rounded-sm border border-charcoal-900/15 object-cover" />
      ) : (
        <span className="flex h-16 w-16 items-center justify-center rounded-sm border border-dashed border-charcoal-900/30 text-[10px] text-charcoal-500">none</span>
      )}
      <span className="flex flex-col gap-1">
        <button type="button" className={BTN} onClick={onPick}>{value ? "Replace…" : "Choose…"}</button>
        {value && <button type="button" className={`${BTN} !py-1`} onClick={onClear}>Remove</button>}
      </span>
    </span>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-charcoal-900/60 p-4" onClick={onClose}>
      <div className="max-h-[85vh] w-full max-w-4xl overflow-auto rounded-sm bg-white p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <strong>{title}</strong>
          <button type="button" className={BTN} onClick={onClose}>Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Picker({ onPick, onClose, onError }: { onPick: (path: string) => void; onClose: () => void; onError: (m: string) => void }) {
  const [images, setImages] = useState<string[] | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    api<{ images: string[] }>("/api/admin/images/")
      .then((b) => setImages(b.images))
      .catch((e: Error) => onError(e.message));
  }, [onError]);

  async function upload(file: File) {
    try {
      const b = await api<{ path: string }>(`/api/admin/upload/?name=${encodeURIComponent(file.name)}`, { method: "POST", body: file });
      onPick(b.path);
    } catch (e) {
      onError((e as Error).message);
    }
  }

  const shown = images?.filter((s) => s.toLowerCase().includes(q.toLowerCase()));
  return (
    <Modal title="Choose a photo" onClose={onClose}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label className={`${BTN_PRIMARY} cursor-pointer`}>
          ⬆ Upload a new photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void upload(f);
            }}
          />
        </label>
        <input className={`${FIELD} !w-56`} placeholder="Search by file name" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {!images && <p className="text-sm text-charcoal-500">Loading…</p>}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-2.5">
        {shown?.map((src) => (
          <button key={src} type="button" onClick={() => onPick(src)} className="break-all rounded-sm border border-charcoal-900/15 bg-white p-1 text-[10px] hover:border-gold-500">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading="lazy" className="mb-1 block h-20 w-full object-cover" />
            {src.replace("/assets/img/", "")}
          </button>
        ))}
      </div>
    </Modal>
  );
}

