export type Lang = "en" | "bn";

const STORAGE_KEY = "nazrul-academy-lang";
const listeners = new Set<() => void>();

/** Inline script run in <head> so the stored language is applied before first paint. */
export const LANG_INIT_SCRIPT = `try{var l=sessionStorage.getItem("${STORAGE_KEY}");if(l==="bn"||l==="en"){var d=document.documentElement;d.setAttribute("data-lang-active",l);d.setAttribute("lang",l)}}catch(e){}`;

export function getLang(): Lang {
  return document.documentElement.getAttribute("data-lang-active") === "bn" ? "bn" : "en";
}

export const getServerLang = (): Lang => "en";

export function setLang(lang: Lang): void {
  document.documentElement.setAttribute("data-lang-active", lang);
  document.documentElement.setAttribute("lang", lang);
  try {
    sessionStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* storage unavailable: the choice just won't persist */
  }
  listeners.forEach((notify) => notify());
}

export function subscribeLang(notify: () => void): () => void {
  listeners.add(notify);
  return () => listeners.delete(notify);
}
