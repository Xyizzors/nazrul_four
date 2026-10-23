import type { ReactNode } from "react";

export interface HeroProps {
  eyebrow_en: string;
  eyebrow_bn: string;
  title_en: string;
  title_bn: string;
  desc_en?: string;
  desc_bn?: string;
  showEyebrow?: boolean;
}
export const ICON = {
  search: (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  ),
  menu: (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  ),
  close: (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
  chevron: (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  arrow: (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  download: (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
    </svg>
  ),
  pin: (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.3" />
    </svg>
  ),
  phone: (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .3 2 .6 2.9a2 2 0 01-.5 2.1L8 9.9a16 16 0 006 6l1.2-1.2a2 2 0 012.1-.5c.9.3 1.9.5 2.9.6a2 2 0 011.8 2z" />
    </svg>
  ),
  mail: (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
  fb: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.25-1.5 1.55-1.5H16.7V3.7C16.4 3.66 15.4 3.58 14.2 3.58c-2.5 0-4.2 1.5-4.2 4.3v2H7.3v3.1h2.7v8h3.5z" />
    </svg>
  ),
  yt: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M22 12s0-3.2-.4-4.7a2.9 2.9 0 00-2-2C17.9 5 12 5 12 5s-5.9 0-7.6.3a2.9 2.9 0 00-2 2C2 8.8 2 12 2 12s0 3.2.4 4.7a2.9 2.9 0 002 2C6.1 19 12 19 12 19s5.9 0 7.6-.3a2.9 2.9 0 002-2C22 15.2 22 12 22 12z" />
      <path d="M10 15.2V8.8L15.8 12z" fill="#0F241E" />
    </svg>
  ),
  ig: (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" />
    </svg>
  ),
  image: (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.6" />
      <path d="M21 15l-5-5-11 11" />
    </svg>
  ),
  quote: (
    <svg viewBox="0 0 32 24" width="30" height="22" fill="currentColor">
      <path d="M0 24V14.4C0 6.4 4.8 1.1 12.6 0l1.6 3.6C9 5 6.8 8 6.5 12h6.1v12H0zm18 0V14.4C18 6.4 22.8 1.1 30.6 0l1.6 3.6C27 5 24.8 8 24.5 12h6.1v12H18z" />
    </svg>
  ),
};

export function ph(label: string, ratioClass = "aspect-[4/3]", extra = "") {
  return (
    <div className={`ph ${ratioClass} rounded-sm ${extra}`}>
      <div className="flex flex-col items-center gap-2">
        {ICON.image}
        <span className="ph-label">{label}</span>
      </div>
    </div>
  );
}

export function img(
  src: string,
  alt: string,
  ratioClass = "aspect-[4/3]",
  extra = "",
) {
  return (
    <div className={`ph ph-photo ${ratioClass} rounded-sm ${extra}`}>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}

export function bilingual(en: ReactNode, bn: ReactNode, tagClass = "") {
  return (
    <>
      <span className={`lang-en ${tagClass}`}>{en}</span>
      <span className={`lang-bn ${tagClass}`}>{bn}</span>
    </>
  );
}

export function innerHero({
  eyebrow_en,
  eyebrow_bn,
  title_en,
  title_bn,
  desc_en,
  desc_bn,
  showEyebrow = false,
}: HeroProps) {
  return (
    <section className="bg-green-950 text-cream-50 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `radial-gradient(circle at 15% 30%, #D7B36A 0, transparent 40%)`,
        }}
      ></div>
      <div className="wrap py-16 sm:py-20 relative">
        {showEyebrow && (
          <span className="eyebrow text-gold-300">
            {bilingual(eyebrow_en, eyebrow_bn)}
          </span>
        )}
        <h1 className="font-display text-4xl sm:text-5xl mt-4 font-medium max-w-2xl">
          {bilingual(title_en, title_bn)}
        </h1>
        {desc_en ? (
          <p className="mt-5 max-w-xl text-cream-100/78 leading-relaxed">
            {bilingual(desc_en, desc_bn)}
          </p>
        ) : (
          ""
        )}
      </div>
      <div className="motif-divider on-dark"></div>
    </section>
  );
}

/** A real photo when one has been chosen in the control panel, otherwise the grey placeholder. */
export function photo(
  slot: { src?: string; alt?: string } | undefined,
  label: string,
  ratioClass = "aspect-[4/3]",
  extra = "",
) {
  return slot?.src
    ? img(slot.src, slot.alt || label, ratioClass, extra)
    : ph(label, ratioClass, extra);
}
