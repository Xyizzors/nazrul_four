import { guard, json, readAll } from "@/lib/admin-server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return guard(request) ?? json({ data: await readAll() });
}
