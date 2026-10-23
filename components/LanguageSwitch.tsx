"use client";

import { useSyncExternalStore } from "react";
import {
  getLang,
  getServerLang,
  setLang,
  subscribeLang,
  type Lang,
} from "@/lib/lang";

export default function LanguageSwitch({
  className = "",
}: {
  className?: string;
}) {
  const lang = useSyncExternalStore(subscribeLang, getLang, getServerLang);
  const btn = (value: Lang, label: string) => (
    <button
      type="button"
      aria-pressed={lang === value}
      onClick={() => setLang(value)}
      className={className ? "flex-1" : undefined}
    >
      {label}
    </button>
  );
  return (
    <div
      className={`lang-switch ${className}`.trim()}
      role="group"
      aria-label="Language"
    >
      {btn("bn", "বাংলা")}
      {btn("en", "English")}
    </div>
  );
}
