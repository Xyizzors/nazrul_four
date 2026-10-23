"use client";

import { useEffect, useState } from "react";

/** Modal grid of every image already in the project. */
export default function ImagePicker({
  onPick,
  onClose,
}: {
  onPick: (path: string) => void;
  onClose: () => void;
}) {
  const [images, setImages] = useState<string[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/images/")
      .then((r) => r.json())
      .then((body: { images?: string[]; error?: string }) =>
        body.images
          ? setImages(body.images)
          : setError(body.error ?? "Could not load images."),
      )
      .catch(() => setError("Could not load images."));
  }, []);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-charcoal-900/60 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-4xl overflow-auto rounded-sm bg-white p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <strong>Choose an image</strong>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm border border-green-900 px-3 py-1 text-sm text-green-900"
          >
            Close
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        {!images && !error && (
          <p className="mt-3 text-sm text-charcoal-500">Loading…</p>
        )}
        <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-2.5">
          {images?.map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => onPick(src)}
              className="break-all rounded-sm border border-charcoal-900/15 bg-white p-1 text-[10px] hover:border-gold-500"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                loading="lazy"
                className="mb-1 block h-20 w-full object-cover"
              />
              {src.replace("/assets/img/", "")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
