import { guard, json, validate, writePage } from "@/lib/admin-server";
import type { PageData } from "@/lib/admin-schema";

export const dynamic = "force-dynamic";

export async function PUT(request: Request, { params }: { params: Promise<{ page: string }> }) {
  const denied = guard(request);
  if (denied) return denied;
  const { page } = await params;
  if (!/^[\w-]+$/.test(page)) return json({ error: "Unknown page." }, 404);
  const body: unknown = await request.json().catch(() => null);
  const problem = validate(body);
  if (problem) return json({ error: problem }, 400);
  return (await writePage(page, body as PageData)) === "saved" ? json({ ok: true }) : json({ error: "Unknown page." }, 404);
}
