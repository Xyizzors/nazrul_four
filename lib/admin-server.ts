import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import type { Data, PageData } from "@/lib/admin-schema";

/** Server-side helpers for the control panel API. Only used by development-only route files. */
const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const BACKUP_DIR = path.join(DATA_DIR, ".backups");
const PUBLIC_DIR = path.join(ROOT, "public");
const IMG_DIR = path.join(PUBLIC_DIR, "assets", "img");
const UPLOAD_DIR = path.join(IMG_DIR, "uploads");
const NEXT_BIN = path.join(ROOT, "node_modules", "next", "dist", "bin", "next");
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);

export const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

/** Rejects anything that is not a same-origin request to a development server on this computer. */
export function guard(request: Request): Response | null {
  if (process.env.NODE_ENV !== "development") return json({ error: "Not found." }, 404);
  const local = /^(localhost|127\.0\.0\.1)(:\d+)?$/;
  const host = request.headers.get("host") ?? "";
  const origin = request.headers.get("origin");
  if (!local.test(host) || (origin && !local.test(new URL(origin).host))) return json({ error: "Forbidden." }, 403);
  return null;
}

async function pageNames(): Promise<string[]> {
  return (await fs.readdir(DATA_DIR)).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5)).sort();
}

export async function readAll(): Promise<Data> {
  const entries = await Promise.all(
    (await pageNames()).map(async (name) => [name, JSON.parse(await fs.readFile(path.join(DATA_DIR, `${name}.json`), "utf8"))] as const),
  );
  return Object.fromEntries(entries);
}

/** Every list must hold flat objects of strings and numbers, which is the shape the page templates expect. */
export function validate(data: unknown): string | null {
  if (!data || typeof data !== "object" || Array.isArray(data)) return "Data must be an object of lists.";
  for (const [key, list] of Object.entries(data)) {
    if (!Array.isArray(list)) return `"${key}" must be a list.`;
    for (const item of list) {
      if (!item || typeof item !== "object" || Array.isArray(item)) return `"${key}" contains an invalid item.`;
      if (!Object.values(item).every((v) => typeof v === "string" || typeof v === "number")) return `"${key}" contains an unsupported value.`;
    }
  }
  return null;
}

export async function writePage(name: string, data: PageData): Promise<"saved" | "unknown"> {
  if (!(await pageNames()).includes(name)) return "unknown";
  const file = path.join(DATA_DIR, `${name}.json`);
  await fs.mkdir(BACKUP_DIR, { recursive: true });
  await fs.copyFile(file, path.join(BACKUP_DIR, `${name}-${new Date().toISOString().replace(/[:.]/g, "-")}.json`));
  const stale = (await fs.readdir(BACKUP_DIR)).filter((f) => f.startsWith(`${name}-`)).sort().slice(0, -30);
  await Promise.all(stale.map((f) => fs.unlink(path.join(BACKUP_DIR, f))));
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2) + "\n", "utf8");
  await fs.rename(tmp, file);
  return "saved";
}

async function walk(dir: string, out: string[] = []): Promise<string[]> {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) out.push("/" + path.relative(PUBLIC_DIR, full).split(path.sep).join("/"));
  }
  return out;
}

export async function listImages(): Promise<string[]> {
  return (await walk(IMG_DIR)).sort();
}

export async function saveUpload(originalName: string, bytes: Uint8Array): Promise<{ path: string } | { error: string }> {
  const base = path.basename(originalName);
  const ext = path.extname(base).toLowerCase();
  if (!IMAGE_EXT.has(ext)) return { error: "Only jpg, png, webp, gif or svg images can be uploaded." };
  if (!bytes.length) return { error: "Empty file." };
  if (bytes.length > MAX_IMAGE_BYTES) return { error: "Image is larger than 10 MB." };
  const stem = path.basename(base, ext).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "image";
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  let name = `${stem}${ext}`;
  if (await fs.stat(path.join(UPLOAD_DIR, name)).then(() => true, () => false)) name = `${stem}-${Date.now()}${ext}`;
  await fs.writeFile(path.join(UPLOAD_DIR, name), bytes);
  return { path: `/assets/img/uploads/${name}` };
}

/** Runs the production build, which writes the finished static site to out/. */
export function runBuild(): Promise<{ ok: boolean; log: string }> {
  const tail = (text: string) => text.trim().split("\n").slice(-25).join("\n");
  return new Promise((resolve) => {
    execFile(
      process.execPath,
      [NEXT_BIN, "build"],
      { cwd: ROOT, timeout: 300_000, maxBuffer: 20 * 1024 * 1024, env: { ...process.env, NODE_ENV: "production" } },
      (err, stdout, stderr) => resolve(err ? { ok: false, log: tail(stderr || stdout || err.message) } : { ok: true, log: tail(stdout) }),
    );
  });
}
