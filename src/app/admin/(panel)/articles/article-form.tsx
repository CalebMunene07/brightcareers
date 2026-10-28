"use client";

import { useActionState } from "react";
import { saveArticleAction, type ActionState } from "@/app/admin/actions";
import { bodyToText, getAudience, type Article, type Audience } from "@/lib/articles";
import type { MediaItem } from "@/lib/media";
import { ImagePicker } from "../image-picker";

const input =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export function ArticleForm({ audience, article, images }: { audience: Audience; article?: Article; images: MediaItem[] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveArticleAction, { ok: false, message: "" });
  const err = (k: string) => (state.errors?.[k] ? <p className="mt-1 text-xs text-red-600">{state.errors[k]}</p> : null);
  const a = getAudience(audience);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="audience" value={audience} />
      {article?.id && <input type="hidden" name="id" value={article.id} />}

      <section className="grid gap-5 rounded-2xl bg-white p-6 ring-1 ring-slate-200 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className="text-sm font-medium">Title *</label>
          <input id="title" name="title" defaultValue={article?.title} className={input} />
          {err("title")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="slug" className="text-sm font-medium">URL slug</label>
          <div className="mt-1 flex items-center rounded-lg border border-slate-300 bg-slate-50 text-sm focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
            <span className="pl-3 text-slate-500">{a.basePath}/</span>
            <input id="slug" name="slug" defaultValue={article?.slug} placeholder="generated from the title" className="min-w-0 flex-1 bg-transparent px-1 py-2 focus:outline-none" />
          </div>
          {err("slug")}
        </div>
        <div>
          <label htmlFor="category" className="text-sm font-medium">Category *</label>
          <input id="category" name="category" list="categories" defaultValue={article?.category ?? a.categories[0]} className={input} />
          <datalist id="categories">
            {a.categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          {err("category")}
        </div>
        <div>
          <label htmlFor="date" className="text-sm font-medium">Date *</label>
          <input id="date" name="date" type="date" defaultValue={article?.date ?? today} className={input} />
          {err("date")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="excerpt" className="text-sm font-medium">Short summary *</label>
          <textarea id="excerpt" name="excerpt" rows={2} defaultValue={article?.excerpt} className={input} />
          <p className="mt-1 text-xs text-slate-500">Shown on article cards.</p>
          {err("excerpt")}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <p className="text-sm font-medium">Image *</p>
        <div className="mt-2">
          <ImagePicker name="image" images={images} defaultValue={article?.image} />
        </div>
        {err("image")}
      </section>

      <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <label htmlFor="body" className="text-sm font-medium">Article *</label>
        <textarea id="body" name="body" rows={18} defaultValue={article ? bodyToText(article.body) : ""} className={`${input} font-mono`} />
        <p className="mt-1 text-xs text-slate-500">
          Start a line with <code className="rounded bg-slate-100 px-1">## </code> to add a heading. Leave a blank line between paragraphs.
        </p>
        {err("body")}
        <label className="mt-5 flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="published" defaultChecked={article?.published ?? true} className="h-4 w-4 accent-[var(--brand)]" />
          Published (visible on the website)
        </label>
      </section>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="rounded-full bg-brand px-8 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
          {pending ? "Saving…" : article ? "Save changes" : "Create article"}
        </button>
        {state.message && !state.ok && <p role="alert" className="text-sm font-medium text-red-600">{state.message}</p>}
      </div>
    </form>
  );
}
