"use client";

import { useState } from "react";
import {
  fieldLabel,
  isBangla,
  isHint,
  isImage,
  summaryOf,
  type Item,
  type Value,
} from "@/lib/admin-schema";
import ImagePicker from "@/components/admin/ImagePicker";

const SMALL_BTN =
  "rounded-sm border px-2 py-0.5 text-xs font-semibold disabled:opacity-40";
const INPUT =
  "w-full rounded-sm border border-charcoal-900/25 bg-white px-2.5 py-2 text-sm text-charcoal-900 focus:border-gold-500 focus:outline focus:outline-2 focus:outline-gold-300";

interface Props {
  index: number;
  count: number;
  item: Item;
  open: boolean;
  fixed: boolean;
  onToggle: (open: boolean) => void;
  onChange: (key: string, value: Value) => void;
  onMove: (delta: -1 | 1) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onError: (message: string) => void;
}

function ImageField({
  value,
  onChange,
  onError,
}: {
  value: string;
  onChange: (v: string) => void;
  onError: (m: string) => void;
}) {
  const [picking, setPicking] = useState(false);

  async function upload(file: File) {
    const res = await fetch(
      `/api/admin/upload/?name=${encodeURIComponent(file.name)}`,
      { method: "POST", body: file },
    );
    const body: { path?: string; error?: string } = await res
      .json()
      .catch(() => ({}));
    if (body.path) onChange(body.path);
    else onError(body.error ?? "Upload failed.");
  }

  return (
    <div className="flex items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {value ? (
        <img
          src={value}
          alt=""
          className="h-14 w-14 rounded-sm border border-charcoal-900/15 bg-cream-100 object-cover"
        />
      ) : (
        <span className="h-14 w-14 rounded-sm border border-dashed border-charcoal-900/25" />
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT}
      />
      <label
        className={`${SMALL_BTN} cursor-pointer border-green-900 text-green-900`}
      >
        Upload
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
        />
      </label>
      <button
        type="button"
        className={`${SMALL_BTN} border-green-900 text-green-900`}
        onClick={() => setPicking(true)}
      >
        Browse
      </button>
      {picking && (
        <ImagePicker
          onClose={() => setPicking(false)}
          onPick={(p) => {
            onChange(p);
            setPicking(false);
          }}
        />
      )}
    </div>
  );
}

export default function ItemCard({
  index,
  count,
  item,
  open,
  fixed,
  onToggle,
  onChange,
  onMove,
  onDuplicate,
  onDelete,
  onError,
}: Props) {
  const { key: summaryKey, text } = summaryOf(item);

  return (
    <details
      open={open}
      onToggle={(e) => onToggle(e.currentTarget.open)}
      className="mb-2.5 rounded-sm border border-charcoal-900/10 bg-white"
    >
      <summary className="flex cursor-pointer list-none items-center gap-2.5 px-3.5 py-2.5">
        <span className="min-w-7 text-xs text-charcoal-500">#{index + 1}</span>
        <span
          className={`min-w-0 flex-1 truncate font-semibold ${isBangla(summaryKey) ? "font-bn" : ""}`}
        >
          {text}
        </span>
        {!fixed && (
          <span className="flex gap-1" onClick={(e) => e.preventDefault()}>
            <button
              type="button"
              title="Move up"
              disabled={index === 0}
              onClick={() => onMove(-1)}
              className={`${SMALL_BTN} border-charcoal-900/25`}
            >
              ↑
            </button>
            <button
              type="button"
              title="Move down"
              disabled={index === count - 1}
              onClick={() => onMove(1)}
              className={`${SMALL_BTN} border-charcoal-900/25`}
            >
              ↓
            </button>
            <button
              type="button"
              title="Duplicate"
              onClick={onDuplicate}
              className={`${SMALL_BTN} border-charcoal-900/25`}
            >
              Copy
            </button>
            <button
              type="button"
              title="Delete"
              onClick={() => window.confirm("Delete this item?") && onDelete()}
              className={`${SMALL_BTN} border-red-700 text-red-700`}
            >
              Delete
            </button>
          </span>
        )}
      </summary>
      <div className="grid gap-3 border-t border-charcoal-900/10 px-3.5 pb-3.5 pt-1 md:grid-cols-2">
        {Object.entries(item)
          .filter(
            ([key]) =>
              isHint(key) &&
              key.startsWith("_") &&
              key !== "_title" &&
              key !== "_n",
          )
          .map(([key, value]) => (
            <p
              key={key}
              className="mt-2.5 text-xs text-charcoal-500 md:col-span-2"
            >
              {String(value)}
            </p>
          ))}
        {Object.entries(item)
          .filter(([key]) => !isHint(key))
          .map(([key, value]) => {
            const image = isImage(key);
            const long =
              typeof value === "string" &&
              (value.length > 70 || value.includes("\n"));
            return (
              <div key={key} className={image || long ? "md:col-span-2" : ""}>
                <label className="mb-1 mt-2.5 block text-xs font-semibold text-charcoal-500">
                  {fieldLabel(key)}
                </label>
                {image ? (
                  <ImageField
                    value={String(value)}
                    onChange={(v) => onChange(key, v)}
                    onError={onError}
                  />
                ) : typeof value === "number" ? (
                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      onChange(
                        key,
                        e.target.value === "" ? 0 : Number(e.target.value),
                      )
                    }
                    className={INPUT}
                  />
                ) : long ? (
                  <textarea
                    value={value}
                    rows={3}
                    onChange={(e) => onChange(key, e.target.value)}
                    className={`${INPUT} ${isBangla(key) ? "font-bn" : ""}`}
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(key, e.target.value)}
                    className={`${INPUT} ${isBangla(key) ? "font-bn" : ""}`}
                  />
                )}
              </div>
            );
          })}
      </div>
    </details>
  );
}
