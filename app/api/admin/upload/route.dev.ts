import { guard, json, saveUpload } from "@/lib/admin-server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const denied = guard(request);
  if (denied) return denied;
  const name = new URL(request.url).searchParams.get("name") ?? "";
  const result = await saveUpload(name, new Uint8Array(await request.arrayBuffer()));
  return "error" in result ? json(result, 400) : json(result);
}
