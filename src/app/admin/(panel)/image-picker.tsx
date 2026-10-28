"use client";

import Image from "@/components/site-image";
import { useState } from "react";
import type { MediaItem } from "@/lib/media";

// Works uncontrolled inside a form (with `name`) or controlled (with `value` + `onChange`).
export function ImagePicker({
  name,
  images,
  defaultValue,
  value: controlled,
  onChange,
}: {
  name?: string;
  images: MediaItem[];
  defaultValue?: string;
  value?: string;
  onChange?: (src: string) => void;
}) {
  const [internal, setInternal] = useState(defaultValue ?? "");
  const value = controlled ?? internal;
  const setValue = (src: string) => {
    setInternal(src);
    onChange?.(src);
  };
  const [open, setOpen] = useState(!(controlled ?? defaultValue));

  return (
    <div>
      {name && <input type="hidden" name={name} value={value} />}
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200">
          {value ? (
            <Image src={value} alt="Selected image" fill sizes="144px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-slate-400">No image</span>
          )}
        </div>
        <button type="button" onClick={() => setOpen((v) => !v)} className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-semibold text-slate-700 hover:border-brand hover:text-brand">
          {open ? "Hide images" : "Change image"}
        </button>
      </div>

      {open && (
        <div role="radiogroup" aria-label="Choose an image" className="mt-4 grid max-h-80 grid-cols-3 gap-3 overflow-y-auto rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200 sm:grid-cols-4 lg:grid-cols-6">
          {images.map((img) => {
            const selected = img.src === value;
            return (
              <button
                key={img.src}
                type="button"
                role="radio"
                aria-checked={selected}
                title={img.name}
                onClick={() => {
                  setValue(img.src);
                  setOpen(false);
                }}
                className={`relative aspect-[4/3] overflow-hidden rounded-lg ring-2 ${selected ? "ring-brand" : "ring-transparent hover:ring-slate-300"}`}
              >
                <Image src={img.src} alt={img.name} fill sizes="160px" className="object-cover" />
                {!img.builtIn && (
                  <span className="absolute left-1 top-1 rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">Uploaded</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
