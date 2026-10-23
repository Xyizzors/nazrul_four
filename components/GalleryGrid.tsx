"use client";

import { useCallback, useEffect, useState } from "react";

export interface GalleryPhoto {
  photo: string;
  caption_en?: string;
  caption_bn?: string;
}

/** Thumbnail grid with a keyboard-friendly full-screen viewer. */
export default function GalleryGrid({ photos, label }: { photos: GalleryPhoto[]; label: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  const current = open === null ? null : photos[open];

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.map((p, i) => (
          <button
            key={p.photo}
            type="button"
            onClick={() => setOpen(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-sm bg-cream-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-900"
            aria-label={`${label} ${i + 1}`}
          >
            <img
              src={p.photo}
              alt={p.caption_en || `${label} ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {current && open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={label}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 h-10 w-10 rounded-full bg-white/10 text-2xl leading-none text-white hover:bg-white/20"
            aria-label="Close"
          >
            ×
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            className="absolute left-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-white/10 text-2xl text-white hover:bg-white/20"
            aria-label="Previous photo"
          >
            ‹
          </button>
          <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={current.photo}
              alt={current.caption_en || `${label} ${open + 1}`}
              className="mx-auto max-h-[82vh] w-auto max-w-full object-contain"
            />
            <figcaption className="mt-3 text-center text-sm text-white/80">
              {current.caption_en || current.caption_bn ? (
                <>
                  <span className="lang-en">{current.caption_en}</span>
                  <span className="lang-bn">{current.caption_bn}</span>
                </>
              ) : null}
              <span className="ml-2 text-white/50">
                {open + 1} / {photos.length}
              </span>
            </figcaption>
          </figure>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            className="absolute right-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-white/10 text-2xl text-white hover:bg-white/20"
            aria-label="Next photo"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
