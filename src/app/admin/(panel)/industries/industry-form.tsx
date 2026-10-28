"use client";

import { useActionState } from "react";
import type { ActionState } from "@/app/admin/actions";
import { saveIndustryAction } from "@/app/admin/industry-actions";
import type { StoredIndustry } from "@/lib/industries-repo";
import type { MediaItem } from "@/lib/media";
import { ImagePicker } from "../image-picker";

const input =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export function IndustryForm({ industry, images, nextOrder }: { industry?: StoredIndustry; images: MediaItem[]; nextOrder: number }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveIndustryAction, { ok: false, message: "" });
  const err = (k: string) => (state.errors?.[k] ? <p className="mt-1 text-xs text-red-600">{state.errors[k]}</p> : null);

  return (
    <form action={action} className="space-y-6">
      {industry?.id && <input type="hidden" name="id" value={industry.id} />}

      <section className="grid gap-5 rounded-2xl bg-white p-6 ring-1 ring-slate-200 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium">Name *</label>
          <input id="name" name="name" defaultValue={industry?.name} className={input} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="slug" className="text-sm font-medium">URL slug</label>
          <div className="mt-1 flex items-center rounded-lg border border-slate-300 bg-slate-50 text-sm focus-within:border-brand">
            <span className="pl-3 text-slate-500">/employers/industries/</span>
            <input id="slug" name="slug" defaultValue={industry?.slug} placeholder="from the name" className="min-w-0 flex-1 bg-transparent px-1 py-2 focus:outline-none" />
          </div>
          <p className="mt-1 text-xs text-slate-500">Jobs are linked to industries by this slug, so avoid changing it once jobs use it.</p>
          {err("slug")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className="text-sm font-medium">Description *</label>
          <textarea id="description" name="description" rows={2} defaultValue={industry?.description} className={input} />
          {err("description")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="roles" className="text-sm font-medium">Typical roles</label>
          <textarea id="roles" name="roles" rows={5} defaultValue={industry?.roles.join("\n")} className={input} />
          <p className="mt-1 text-xs text-slate-500">One per line. Shown on the industry page.</p>
        </div>
        <div>
          <label htmlFor="order" className="text-sm font-medium">Display order</label>
          <input id="order" name="order" type="number" defaultValue={industry?.order ?? nextOrder} className={input} />
        </div>
        <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium">
          <input type="checkbox" name="published" defaultChecked={industry?.published ?? true} className="h-4 w-4 accent-[var(--brand)]" />
          Published (visible on the website)
        </label>
      </section>

      <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <p className="text-sm font-medium">Image *</p>
        <p className="text-xs text-slate-500">Used on the industry card and as the page hero.</p>
        <div className="mt-2">
          <ImagePicker name="image" images={images} defaultValue={industry?.image} />
        </div>
        {err("image")}
      </section>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="rounded-full bg-brand px-8 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
          {pending ? "Saving…" : industry?.id ? "Save changes" : "Create industry"}
        </button>
        {state.message && !state.ok && <p role="alert" className="text-sm font-medium text-red-600">{state.message}</p>}
      </div>
    </form>
  );
}
