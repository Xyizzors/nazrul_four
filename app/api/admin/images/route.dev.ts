import { guard, json, listImages } from "@/lib/admin-server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return guard(request) ?? json({ images: await listImages() });
}
