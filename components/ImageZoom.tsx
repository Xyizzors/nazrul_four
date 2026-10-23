"use client";

import { useCallback, useEffect, useState } from "react";

interface Shot {
  src: string;
  alt: string;
  caption: string;
}

const SELECTOR = "[data-zoom] img";

/** Reads every zoomable image currently on the page, in document order. */
function collect(): { imgs: HTMLImageElement[]; shots: Shot[] } {
  const imgs = Array.from(document.querySelectorAll<HTMLImageElement>(SELECTOR));
  const shots = imgs.map((el) => ({
    src: el.currentSrc || el.src,
    alt: el.alt,
    // innerText skips the hidden language, so only the active caption is read
    caption: el.closest("figure")?.querySelector("figcaption")?.innerText.trim() ?? "",
  }));
  return { imgs, shots };
}

/**
 * Click-to-expand viewer. Mark any container with `data-zoom` and every <img> inside it
 * opens full-size in an overlay (Esc / click outside to close, arrow keys to browse).
 */
export default function ImageZoom() {
  const [shots, setShots] = useState<Shot[]>([]);
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (d: number) =>
      setIndex((i) => (i === null || !shots.length ? i : (i + d + shots.length) % shots.length)),
    [shots.length],
  );

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = (e.target as Element | null)?.closest<HTMLImageElement>(SELECTOR);
      if (!target) return;
      const { imgs, shots: all } = collect();
      const i = imgs.indexOf(target);
      if (i < 0) return;
      setShots(all);
      setIndex(i);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [index, close, step]);

  if (index === null || !shots[index]) return null;
  const shot = shots[index];
  const many = shots.length > 1;
  const btn =
    "absolute text-white/90 hover:text-white bg-black/40 hover:bg-black/60 rounded-full w-11 h-11 flex items-center justify-center text-2xl leading-none";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={shot.alt || "Enlarged photo"}
      className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4 sm:p-8"
      onClick={close}
    >
      <button type="button" aria-label="Close" className={`${btn} top-4 right-4`} onClick={close}>
        ×
      </button>
      {many && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            className={`${btn} left-3 top-1/2 -translate-y-1/2`}
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next photo"
            className={`${btn} right-3 top-1/2 -translate-y-1/2`}
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
          >
            ›
          </button>
        </>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={shot.src}
        alt={shot.alt}
        className="max-w-full max-h-[80vh] object-contain rounded-sm"
        onClick={(e) => e.stopPropagation()}
      />
      {shot.caption && (
        <p
          className="mt-4 max-w-3xl text-center text-sm text-white/85 leading-relaxed max-h-[12vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {shot.caption}
        </p>
      )}
      {many && <p className="mt-2 text-xs text-white/50">{index + 1} / {shots.length}</p>}
    </div>
  );
}
