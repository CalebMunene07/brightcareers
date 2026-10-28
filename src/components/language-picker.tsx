"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { setLocale } from "@/app/actions";
import { Icon } from "@/components/icon";
import { locales, type Locale } from "@/lib/i18n";

export function LanguagePicker({
  locale,
  label,
  region,
  align = "right",
}: {
  locale: Locale;
  label: string;
  region: string;
  align?: "left" | "right";
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function choose(code: Locale) {
    setOpen(false);
    startTransition(async () => {
      await setLocale(code);
      router.refresh();
    });
  }

  const current = locales.find((l) => l.code === locale) ?? locales[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${current.label}`}
        aria-busy={pending}
        className={`flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-brand sm:text-sm ${pending ? "opacity-60" : ""}`}
      >
        <Icon name="globe" className="h-4 w-4" />
        {region} ({current.label})
        <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className={`absolute z-50 mt-2 w-44 overflow-hidden rounded-xl bg-white py-1 text-sm text-slate-800 shadow-xl ring-1 ring-slate-200 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {locales.map((l) => (
            <li key={l.code} role="option" aria-selected={l.code === locale}>
              <button
                type="button"
                lang={l.code}
                onClick={() => choose(l.code)}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-muted ${
                  l.code === locale ? "font-semibold text-brand" : ""
                }`}
              >
                {l.label}
                <span className="text-xs uppercase text-slate-400">{l.code}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
