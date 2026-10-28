"use client";

import { useActionState } from "react";
import { saveHeroAction, type ActionState } from "@/app/admin/actions";
import type { Hero } from "@/lib/heroes";
import type { MediaItem } from "@/lib/media";
import { ImagePicker } from "../image-picker";

const input =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export function HeroForm({ id, hero, images, noImage }: { id: string; hero: Hero; images: MediaItem[]; noImage?: boolean }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveHeroAction, { ok: false, message: "" });
  const err = (k: string) => (state.errors?.[k] ? <p className="mt-1 text-xs text-red-600">{state.errors[k]}</p> : null);

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="id" value={id} />

      {!noImage && (
        <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
          <p className="text-sm font-medium">Background image *</p>
          <div className="mt-2">
            <ImagePicker name="image" images={images} defaultValue={hero.image} />
          </div>
          {err("image")}
        </section>
      )}

      <section className="space-y-5 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <div>
          <label htmlFor="eyebrow" className="text-sm font-medium">Small label above the heading</label>
          <input id="eyebrow" name="eyebrow" defaultValue={hero.eyebrow} className={input} />
        </div>
        <div>
          <label htmlFor="title" className="text-sm font-medium">Heading *</label>
          <input id="title" name="title" defaultValue={hero.title} className={input} />
          {err("title")}
        </div>
        <div>
          <label htmlFor="text" className="text-sm font-medium">Text</label>
          <textarea id="text" name="text" rows={3} defaultValue={hero.text} className={input} />
        </div>
      </section>

      {!noImage && (
        <section className="grid gap-5 rounded-2xl bg-white p-6 ring-1 ring-slate-200 sm:grid-cols-2">
          <p className="text-sm font-semibold text-slate-700 sm:col-span-2">Buttons (optional)</p>
          <div>
            <label htmlFor="ctaLabel" className="text-sm font-medium">Main button text</label>
            <input id="ctaLabel" name="ctaLabel" defaultValue={hero.ctaLabel} className={input} />
            {err("ctaLabel")}
          </div>
          <div>
            <label htmlFor="ctaHref" className="text-sm font-medium">Main button link</label>
            <input id="ctaHref" name="ctaHref" defaultValue={hero.ctaHref} placeholder="/jobs" className={input} />
            {err("ctaHref")}
          </div>
          <div>
            <label htmlFor="secondaryLabel" className="text-sm font-medium">Second button text</label>
            <input id="secondaryLabel" name="secondaryLabel" defaultValue={hero.secondaryLabel} className={input} />
            {err("secondaryLabel")}
          </div>
          <div>
            <label htmlFor="secondaryHref" className="text-sm font-medium">Second button link</label>
            <input id="secondaryHref" name="secondaryHref" defaultValue={hero.secondaryHref} placeholder="/cv-maker" className={input} />
            {err("secondaryHref")}
          </div>
        </section>
      )}

      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="rounded-full bg-brand px-8 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
          {pending ? "Saving…" : "Save changes"}
        </button>
        {state.message && (
          <p role="status" className={`text-sm font-medium ${state.ok ? "text-emerald-700" : "text-red-600"}`}>{state.message}</p>
        )}
      </div>
    </form>
  );
}
