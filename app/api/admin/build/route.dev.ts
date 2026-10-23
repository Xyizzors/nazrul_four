import { guard, json, runBuild } from "@/lib/admin-server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return guard(request) ?? json(await runBuild());
}
