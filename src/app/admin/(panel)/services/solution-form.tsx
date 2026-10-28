"use client";

import { useActionState } from "react";
import { saveSolutionAction, type ActionState } from "@/app/admin/actions";
import { Icon } from "@/components/icon";
import { iconNames, type IconName } from "@/lib/content";
import type { MediaItem } from "@/lib/media";
import type { StoredSolution } from "@/lib/solutions-repo";
import { ImagePicker } from "../image-picker";

const input =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

function IconSelect({ name, defaultValue, id }: { name: string; defaultValue?: IconName; id: string }) {
  return (
    <select id={id} name={name} defaultValue={defaultValue ?? "check"} className={input}>
      {iconNames.map((n) => (
        <option key={n} value={n}>{n}</option>
      ))}
    </select>
  );
}

export function SolutionForm({ solution, images, nextOrder }: { solution?: StoredSolution; images: MediaItem[]; nextOrder: number }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveSolutionAction, { ok: false, message: "" });
  const err = (k: string) => (state.errors?.[k] ? <p className="mt-1 text-xs text-red-600">{state.errors[k]}</p> : null);
  const features = [...(solution?.features ?? [])];
  while (features.length < 6) features.push({ icon: "check", title: "", text: "" });

  return (
    <form action={action} className="space-y-6">
      {solution?.id && <input type="hidden" name="id" value={solution.id} />}

      <section className="grid gap-5 rounded-2xl bg-white p-6 ring-1 ring-slate-200 sm:grid-cols-2">
        <h2 className="font-bold text-brand-dark sm:col-span-2">Service card</h2>
        <div>
          <label htmlFor="title" className="text-sm font-medium">Name *</label>
          <input id="title" name="title" defaultValue={solution?.title} className={input} />
          {err("title")}
        </div>
        <div>
          <label htmlFor="slug" className="text-sm font-medium">URL slug</label>
          <div className="mt-1 flex items-center rounded-lg border border-slate-300 bg-slate-50 text-sm focus-within:border-brand">
            <span className="pl-3 text-slate-500">/employers/solutions/</span>
            <input id="slug" name="slug" defaultValue={solution?.slug} placeholder="from the name" className="min-w-0 flex-1 bg-transparent px-1 py-2 focus:outline-none" />
          </div>
          {err("slug")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="text" className="text-sm font-medium">Card description *</label>
          <input id="text" name="text" defaultValue={solution?.text} className={input} />
          {err("text")}
        </div>
        <div>
          <label htmlFor="icon" className="text-sm font-medium">Icon *</label>
          <div className="flex items-center gap-3">
            <IconSelect id="icon" name="icon" defaultValue={solution?.icon} />
            {solution?.icon && <Icon name={solution.icon} className="mt-1 h-6 w-6 shrink-0 text-brand" />}
          </div>
          {err("icon")}
        </div>
        <fieldset className="grid gap-3 sm:col-span-2 sm:grid-cols-3">
          <legend className="mb-1 text-sm font-medium">Name in other languages (optional, used in the footer)</legend>
          {[
            ["title_fr", "French", solution?.translations?.fr],
            ["title_pt", "Portuguese", solution?.translations?.pt],
            ["title_sw", "Swahili", solution?.translations?.sw],
          ].map(([name, label, value]) => (
            <div key={name}>
              <label htmlFor={name} className="text-xs text-slate-600">{label}</label>
              <input id={name} name={name} defaultValue={value} className={input} />
            </div>
          ))}
        </fieldset>
        <div>
          <label htmlFor="order" className="text-sm font-medium">Display order</label>
          <input id="order" name="order" type="number" defaultValue={solution?.order ?? nextOrder} className={input} />
        </div>
      </section>

      <section className="space-y-5 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <h2 className="font-bold text-brand-dark">Page hero</h2>
        <div>
          <p className="text-sm font-medium">Image *</p>
          <div className="mt-2">
            <ImagePicker name="image" images={images} defaultValue={solution?.image} />
          </div>
          {err("image")}
        </div>
        <div>
          <label htmlFor="heroTitle" className="text-sm font-medium">Heading *</label>
          <input id="heroTitle" name="heroTitle" defaultValue={solution?.heroTitle} className={input} />
          {err("heroTitle")}
        </div>
        <div>
          <label htmlFor="heroText" className="text-sm font-medium">Text *</label>
          <textarea id="heroText" name="heroText" rows={2} defaultValue={solution?.heroText} className={input} />
          {err("heroText")}
        </div>
      </section>

      <section className="space-y-5 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <h2 className="font-bold text-brand-dark">Page content</h2>
        <div>
          <label htmlFor="intro" className="text-sm font-medium">Introduction *</label>
          <textarea id="intro" name="intro" rows={3} defaultValue={solution?.intro} className={input} />
          {err("intro")}
        </div>
        <div>
          <p className="text-sm font-medium">Features (up to 6; leave rows empty to skip)</p>
          {err("features")}
          <div className="mt-2 space-y-3">
            {features.map((f, i) => (
              <div key={i} className="grid gap-3 rounded-xl bg-slate-50 p-3 sm:grid-cols-[150px_1fr_2fr]">
                <div>
                  <label htmlFor={`f${i}-icon`} className="sr-only">Feature {i + 1} icon</label>
                  <IconSelect id={`f${i}-icon`} name={`f${i}-icon`} defaultValue={f.icon} />
                </div>
                <div>
                  <label htmlFor={`f${i}-title`} className="sr-only">Feature {i + 1} title</label>
                  <input id={`f${i}-title`} name={`f${i}-title`} defaultValue={f.title} placeholder="Title" className={input} />
                </div>
                <div>
                  <label htmlFor={`f${i}-text`} className="sr-only">Feature {i + 1} text</label>
                  <input id={`f${i}-text`} name={`f${i}-text`} defaultValue={f.text} placeholder="Short description" className={input} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="useCases" className="text-sm font-medium">“Is this right for you?” list</label>
          <textarea id="useCases" name="useCases" rows={6} defaultValue={solution?.useCases.join("\n")} className={input} />
          <p className="mt-1 text-xs text-slate-500">One point per line.</p>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="published" defaultChecked={solution?.published ?? true} className="h-4 w-4 accent-[var(--brand)]" />
          Published (visible on the website)
        </label>
      </section>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="rounded-full bg-brand px-8 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
          {pending ? "Saving…" : solution?.id ? "Save changes" : "Create service"}
        </button>
        {state.message && !state.ok && <p role="alert" className="text-sm font-medium text-red-600">{state.message}</p>}
      </div>
    </form>
  );
}
