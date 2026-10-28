"use client";

import { useActionState } from "react";
import type { ActionState } from "@/app/admin/actions";
import { saveLegalAction } from "@/app/admin/legal-actions";
import { bodyToText } from "@/lib/articles";
import type { LegalContent } from "@/lib/legal-repo";

const input =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export function LegalForm({ slug, page }: { slug: string; page: LegalContent }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveLegalAction, { ok: false, message: "" });
  const err = (k: string) => (state.errors?.[k] ? <p className="mt-1 text-xs text-red-600">{state.errors[k]}</p> : null);

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="slug" value={slug} />
      <section className="space-y-5 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <div>
          <label htmlFor="title" className="text-sm font-medium">Title *</label>
          <input id="title" name="title" defaultValue={page.title} className={input} />
          {err("title")}
        </div>
        <div>
          <label htmlFor="summary" className="text-sm font-medium">Summary</label>
          <input id="summary" name="summary" defaultValue={page.summary} className={input} />
        </div>
        <div>
          <label htmlFor="body" className="text-sm font-medium">Page text *</label>
          <textarea id="body" name="body" rows={24} defaultValue={bodyToText(page.body)} className={`${input} font-mono`} />
          <p className="mt-1 text-xs text-slate-500">
            Start a line with <code className="rounded bg-slate-100 px-1">## </code> for a section heading. Leave a blank line between paragraphs.
          </p>
          {err("body")}
        </div>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" name="reviewed" defaultChecked={page.reviewed} className="mt-0.5 h-4 w-4 accent-[var(--brand)]" />
          <span>
            <span className="font-medium">Reviewed and approved by a lawyer.</span> Removes the &ldquo;draft&rdquo; notice from the public page.
          </span>
        </label>
      </section>
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
