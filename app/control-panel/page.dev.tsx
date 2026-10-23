import type { Metadata } from "next";
import ControlPanel from "@/components/admin/ControlPanel";

export const metadata: Metadata = { title: "Control Panel", robots: { index: false, follow: false } };

export default function ControlPanelPage() {
  return <ControlPanel />;
}
