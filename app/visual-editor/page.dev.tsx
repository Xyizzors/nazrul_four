import type { Metadata } from "next";
import VisualEditor from "@/components/admin/VisualEditor";

export const metadata: Metadata = { title: "Visual Editor", robots: { index: false, follow: false } };

export default function VisualEditorPage() {
  return <VisualEditor />;
}
