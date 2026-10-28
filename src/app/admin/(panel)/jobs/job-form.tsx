"use client";

import { useActionState } from "react";
import { saveJobAction, type ActionState } from "@/app/admin/actions";
import { jobCountry, jobTypes, type Job } from "@/lib/jobs";
import { REMOTE } from "@/lib/locations";

const input =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export function JobForm({
  job,
  industries,
  countries,
}: {
  job?: Job;
  industries: { slug: string; name: string }[];
  countries: string[];
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveJobAction, { ok: false, message: "" });
  const err = (k: string) =>
    state.errors?.[k] ? <p className="mt-1 text-xs text-red-600">{state.errors[k]}</p> : null;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="space-y-6">
      {job && <input type="hidden" name="originalSlug" value={job.slug} />}

      <section className="grid gap-5 rounded-2xl bg-white p-6 ring-1 ring-slate-200 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className="text-sm font-medium">Job title *</label>
          <input id="title" name="title" defaultValue={job?.title} className={input} />
          {err("title")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="slug" className="text-sm font-medium">URL slug</label>
          <div className="mt-1 flex items-center rounded-lg border border-slate-300 bg-slate-50 text-sm focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
            <span className="pl-3 text-slate-500">/jobs/</span>
            <input id="slug" name="slug" defaultValue={job?.slug} placeholder="generated from the title and location" className="min-w-0 flex-1 bg-transparent px-1 py-2 focus:outline-none" />
          </div>
          {err("slug")}
        </div>
        <div>
          <label htmlFor="company" className="text-sm font-medium">Company / client description *</label>
          <input id="company" name="company" defaultValue={job?.company} placeholder="e.g. Private hospital group" className={input} />
          {err("company")}
        </div>
        <div>
          <label htmlFor="country" className="text-sm font-medium">Country *</label>
          <select id="country" name="country" defaultValue={job ? jobCountry(job) : ""} className={input}>
            <option value="">Select…</option>
            <option value={REMOTE}>Remote (work from anywhere)</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {err("country")}
        </div>
        <div>
          <label htmlFor="city" className="text-sm font-medium">City</label>
          <input id="city" name="city" defaultValue={job?.city ?? (job && !job.country ? job.location.split(",")[0].trim() : "")} placeholder="e.g. Lusaka" className={input} />
          <p className="mt-1 text-xs text-slate-500">Leave empty for remote jobs.</p>
        </div>
        <div>
          <label htmlFor="type" className="text-sm font-medium">Job type *</label>
          <select id="type" name="type" defaultValue={job?.type ?? ""} className={input}>
            <option value="">Select…</option>
            {jobTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          {err("type")}
        </div>
        <div>
          <label htmlFor="industry" className="text-sm font-medium">Industry *</label>
          <select id="industry" name="industry" defaultValue={job?.industry ?? ""} className={input}>
            <option value="">Select…</option>
            {industries.map((i) => (
              <option key={i.slug} value={i.slug}>{i.name}</option>
            ))}
          </select>
          {err("industry")}
        </div>
        <div>
          <label htmlFor="salary" className="text-sm font-medium">Salary *</label>
          <input id="salary" name="salary" defaultValue={job?.salary} placeholder="e.g. Competitive + benefits" className={input} />
          {err("salary")}
        </div>
        <div>
          <label htmlFor="posted" className="text-sm font-medium">Posted date *</label>
          <input id="posted" name="posted" type="date" defaultValue={job?.posted ?? today} className={input} />
          {err("posted")}
        </div>
        <div>
          <label htmlFor="closes" className="text-sm font-medium">Closing date</label>
          <input id="closes" name="closes" type="date" defaultValue={job?.closes ?? ""} min={job?.posted ?? today} className={input} />
          <p className="mt-1 text-xs text-slate-500">Optional. The job is hidden from search after this day.</p>
          {err("closes")}
        </div>
      </section>

      <section className="space-y-5 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <div>
          <label htmlFor="summary" className="text-sm font-medium">Summary *</label>
          <textarea id="summary" name="summary" rows={2} defaultValue={job?.summary} className={input} />
          {err("summary")}
        </div>
        <div>
          <label htmlFor="responsibilities" className="text-sm font-medium">Responsibilities</label>
          <textarea id="responsibilities" name="responsibilities" rows={5} defaultValue={job?.responsibilities.join("\n")} className={input} />
          <p className="mt-1 text-xs text-slate-500">One per line.</p>
        </div>
        <div>
          <label htmlFor="requirements" className="text-sm font-medium">Requirements</label>
          <textarea id="requirements" name="requirements" rows={5} defaultValue={job?.requirements.join("\n")} className={input} />
          <p className="mt-1 text-xs text-slate-500">One per line.</p>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="published" defaultChecked={job?.published ?? true} className="h-4 w-4 accent-[var(--brand)]" />
          Published (visible on the website)
        </label>
      </section>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="rounded-full bg-brand px-8 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
          {pending ? "Saving…" : job ? "Save changes" : "Create job"}
        </button>
        {state.message && !state.ok && <p role="alert" className="text-sm font-medium text-red-600">{state.message}</p>}
      </div>
    </form>
  );
}
