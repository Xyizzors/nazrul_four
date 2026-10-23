"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ItemCard from "@/components/admin/ItemCard";
import {
  FIXED_LISTS,
  GROUPS,
  LISTS,
  LIST_HELP,
  NEWEST_FIRST,
  TEMPLATES,
  blankLike,
  pageLabel,
  pretty,
  type Data,
  type Item,
  type PageData,
  type Value,
} from "@/lib/admin-schema";

interface Row {
  id: number;
  item: Item;
}
type Rows = Record<string, Record<string, Row[]>>;
interface Toast {
  text: string;
  error: boolean;
}

const BTN =
  "rounded-sm border border-green-900 bg-white px-3.5 py-2 text-sm font-semibold text-green-900 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50";
const BTN_PRIMARY =
  "rounded-sm border border-green-900 bg-green-900 px-3.5 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50";

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const body = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(
      (body as { error?: string }).error ?? `Request failed (${res.status})`,
    );
  return body as T;
}

export default function ControlPanel() {
  const nextId = useRef(0);
  const [rows, setRows] = useState<Rows | null>(null);
  const [failed, setFailed] = useState(false);
  const [page, setPage] = useState<string | null>(null);
  const [list, setList] = useState<string | null>(null);
  const [dirty, setDirty] = useState<ReadonlySet<string>>(new Set());
  const [open, setOpen] = useState<ReadonlyMap<number, boolean>>(new Map());
  const [filter, setFilter] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const say = useCallback((text: string, error = false) => {
    setToast({ text, error });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), error ? 9000 : 3500);
  }, []);

  useEffect(() => {
    api<{ data: Data }>("/api/admin/data/")
      .then(({ data }) =>
        setRows(
          Object.fromEntries(
            Object.entries(data).map(([p, lists]) => [
              p,
              Object.fromEntries(
                Object.entries(lists).map(([l, items]) => [
                  l,
                  items.map((item) => ({ id: nextId.current++, item })),
                ]),
              ),
            ]),
          ),
        ),
      )
      .catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    if (!dirty.size) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const markDirty = (p: string) => setDirty((d) => new Set(d).add(p));

  /** Applies `fn` to the current list's rows. */
  function update(fn: (list: Row[]) => Row[]) {
    if (!page || !list) return;
    setRows(
      (r) => r && { ...r, [page]: { ...r[page], [list]: fn(r[page][list]) } },
    );
    markDirty(page);
  }

  const select = (p: string, current: Rows) => {
    setPage(p);
    setList(Object.keys(current[p])[0] ?? null);
    setFilter("");
  };

  async function save(build: boolean) {
    if (!rows || !page) return;
    const p = page;
    const payload: PageData = Object.fromEntries(
      Object.entries(rows[p]).map(([l, rs]) => [l, rs.map((r) => r.item)]),
    );
    setBusy(true);
    try {
      await api(`/api/admin/data/${p}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setDirty((d) => {
        const n = new Set(d);
        n.delete(p);
        return n;
      });
      if (build) {
        const result = await api<{ ok: boolean; log: string }>(
          "/api/admin/build/",
          { method: "POST" },
        );
        if (!result.ok)
          throw new Error(`Saved, but the site build failed:\n${result.log}`);
        say(
          "Saved and built. Upload the contents of the “out” folder to your host.",
        );
      } else say("Saved. The site preview updates automatically.");
    } catch (err) {
      markDirty(p);
      say(err instanceof Error ? err.message : "Save failed.", true);
    } finally {
      setBusy(false);
    }
  }

  if (failed)
    return (
      <div className="wrap py-16">
        Could not load the content. Make sure the site is running with{" "}
        <code>npm run dev</code>.
      </div>
    );
  if (!rows)
    return <div className="wrap py-16 text-charcoal-500">Loading…</div>;

  const known = new Set(Object.values(GROUPS).flatMap(Object.keys));
  const groups: [string, string[]][] = [
    ...Object.entries(GROUPS).map(([g, pages]): [string, string[]] => [
      g,
      Object.keys(pages),
    ]),
    ["Other", Object.keys(rows).filter((p) => !known.has(p))],
  ];

  const current = page && list ? rows[page][list] : null;
  const query = filter.trim().toLowerCase();
  const visible = current
    ?.map((row, index) => ({ row, index }))
    .filter(
      ({ row }) =>
        !query || JSON.stringify(row.item).toLowerCase().includes(query),
    );
  const isDirty = page ? dirty.has(page) : false;
  const fixed = list ? FIXED_LISTS.has(list) : false;

  const addItem = () => {
    if (!current || !list) return;
    const template = current[current.length - 1]?.item ?? TEMPLATES[list];
    if (!template)
      return say(
        "This list has no existing items to copy the layout from.",
        true,
      );
    const row: Row = { id: nextId.current++, item: blankLike(template) };
    update((rs) => (NEWEST_FIRST.has(list) ? [row, ...rs] : [...rs, row]));
    setOpen((o) => new Map(o).set(row.id, true));
    setFilter("");
  };

  return (
    <div className="wrap grid gap-8 py-8 lg:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-auto">
        <h1 className="font-display text-xl text-green-900">Control Panel</h1>
        <p className="mb-3 text-xs text-charcoal-500">
          Only visible while running on your computer.
        </p>
        {groups.map(([group, pages]) => {
          const present = pages.filter((p) => rows[p]);
          return present.length ? (
            <div key={group}>
              <h2 className="mb-1 mt-4 text-[11px] font-semibold uppercase tracking-wider text-gold-500">
                {group}
              </h2>
              {present.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => select(p, rows)}
                  className={`block w-full border-l-[3px] px-3 py-1.5 text-left text-sm ${p === page ? "border-gold-500 bg-green-100 font-semibold text-green-900" : "border-transparent text-charcoal-700 hover:bg-cream-100"}`}
                >
                  {pageLabel(p)}
                  {dirty.has(p) && (
                    <span
                      className="ml-1.5 inline-block h-2 w-2 rounded-full bg-gold-500"
                      title="Unsaved changes"
                    />
                  )}
                </button>
              ))}
            </div>
          ) : null;
        })}
      </aside>

      <section className="min-w-0">
        {!page || !list || !current || !visible ? (
          <div className="rounded-sm border border-dashed border-charcoal-900/20 bg-white p-10 text-center text-charcoal-500">
            Choose a page on the left to start editing.
          </div>
        ) : (
          <>
            <div className="sticky top-[76px] z-10 flex flex-wrap items-center justify-between gap-3 bg-cream-50 pb-3 pt-1">
              <h2 className="font-display text-2xl text-green-900">
                {pageLabel(page)}
              </h2>
              <div className="flex flex-wrap gap-2">
                <a
                  className={BTN}
                  href={page === "home" ? "/" : `/${page}/`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View page ↗
                </a>
                <button
                  type="button"
                  className={BTN}
                  disabled={!isDirty || busy}
                  onClick={() => save(false)}
                >
                  Save
                </button>
                <button
                  type="button"
                  className={BTN_PRIMARY}
                  disabled={busy}
                  onClick={() => save(true)}
                >
                  {busy ? "Working…" : "Save & build for upload"}
                </button>
              </div>
            </div>

            {Object.keys(rows[page]).length > 1 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {Object.entries(rows[page]).map(([l, rs]) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => {
                      setList(l);
                      setFilter("");
                    }}
                    className={`rounded-full border px-3.5 py-1 text-sm ${l === list ? "border-green-900 bg-green-900 text-white" : "border-charcoal-900/15 bg-white"}`}
                  >
                    {LISTS[l] ?? pretty(l)} ({rs.length})
                  </button>
                ))}
              </div>
            )}

            <div className="mb-3 flex flex-wrap items-center gap-2.5">
              <input
                type="text"
                placeholder="Search this list…"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="min-w-44 flex-1 rounded-sm border border-charcoal-900/25 bg-white px-2.5 py-2 text-sm"
              />
              <button
                type="button"
                className={BTN}
                onClick={() =>
                  setOpen(new Map(visible.map(({ row }) => [row.id, true])))
                }
              >
                Expand all
              </button>
              <button
                type="button"
                className={BTN}
                onClick={() =>
                  setOpen(new Map(visible.map(({ row }) => [row.id, false])))
                }
              >
                Collapse all
              </button>
              {!fixed && (
                <button type="button" className={BTN_PRIMARY} onClick={addItem}>
                  + Add new
                </button>
              )}
            </div>

            {LIST_HELP[list] && (
              <p className="mb-3 rounded-sm bg-cream-100 px-3 py-2 text-sm text-charcoal-700">
                {LIST_HELP[list]}
              </p>
            )}

            {visible.length === 0 ? (
              <div className="rounded-sm border border-dashed border-charcoal-900/20 bg-white p-10 text-center text-charcoal-500">
                {current.length ? "No matching items." : "Nothing here yet."}
              </div>
            ) : (
              visible.map(({ row, index }) => (
                <ItemCard
                  key={row.id}
                  index={index}
                  count={current.length}
                  item={row.item}
                  fixed={fixed}
                  open={
                    open.get(row.id) ??
                    (current.length <= 3 && list !== "sections")
                  }
                  onToggle={(isOpen) =>
                    setOpen((o) => new Map(o).set(row.id, isOpen))
                  }
                  onChange={(key: string, value: Value) =>
                    update((rs) =>
                      rs.map((r) =>
                        r.id === row.id
                          ? { ...r, item: { ...r.item, [key]: value } }
                          : r,
                      ),
                    )
                  }
                  onMove={(delta) =>
                    update((rs) => {
                      const j = index + delta;
                      if (j < 0 || j >= rs.length) return rs;
                      const copy = [...rs];
                      [copy[index], copy[j]] = [copy[j], copy[index]];
                      return copy;
                    })
                  }
                  onDuplicate={() => {
                    const copy: Row = {
                      id: nextId.current++,
                      item: { ...row.item },
                    };
                    update((rs) => [
                      ...rs.slice(0, index + 1),
                      copy,
                      ...rs.slice(index + 1),
                    ]);
                  }}
                  onDelete={() =>
                    update((rs) => rs.filter((r) => r.id !== row.id))
                  }
                  onError={(m) => say(m, true)}
                />
              ))
            )}
          </>
        )}
      </section>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[90] max-w-md whitespace-pre-wrap rounded-sm px-4 py-3 text-sm text-white shadow-xl ${toast.error ? "bg-red-700" : "bg-green-900"}`}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}
