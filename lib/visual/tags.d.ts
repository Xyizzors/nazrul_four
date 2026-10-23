export interface TagField {
  n: number;
  list: string;
  index: number;
  key: string;
  kind: "text" | "image";
}
export interface TagRef {
  pageHash: number;
  n: number;
}
export const BLANK: string;
export function hash24(name: string): number;
export function kindOf(list: string, key: string, value: unknown): "text" | "image" | null;
export function fields(data: Record<string, Record<string, string | number>[]>): TagField[];
export function tagData<T>(page: string, data: T): T;
export function encodeText(page: string, n: number): string;
export function readTextTags(text: string): TagRef[];
export function readImageTag(src: string): TagRef | null;
export function stripText(text: string): string;
export function stripImage(src: string): string;
