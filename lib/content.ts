/** Lookups for editable text and image slots stored in data/<page>.json. Missing ids render as empty rather than crashing. */
export interface TextBlock {
  id: string;
  en?: string;
  bn?: string;
  text?: string;
}
export interface Text {
  en: string;
  bn: string;
  text: string;
}
export interface ImageSlot {
  id: string;
  src?: string;
  alt?: string;
}

const EMPTY_TEXT: Text = { en: "", bn: "", text: "" };
const EMPTY_SLOT = { src: "", alt: "" };

function lookup<T>(entries: Record<string, T>, empty: T): Record<string, T> {
  return new Proxy(entries, { get: (target, key) => (typeof key === "string" ? (target[key] ?? empty) : undefined) });
}

export function textMap(blocks: readonly TextBlock[]): Record<string, Text> {
  return lookup(
    Object.fromEntries(blocks.map((b) => [b.id, { en: b.en ?? "", bn: b.bn ?? "", text: b.text ?? "" }])),
    EMPTY_TEXT,
  );
}

export function slotMap(slots: readonly ImageSlot[]): Record<string, { src: string; alt: string }> {
  return lookup(Object.fromEntries(slots.map((s) => [s.id, { src: s.src ?? "", alt: s.alt ?? "" }])), EMPTY_SLOT);
}

export type EventItem = { en: string; bn: string; date: string; photo: string };
export type NoticeItem = { en: string; bn: string; date: string };
