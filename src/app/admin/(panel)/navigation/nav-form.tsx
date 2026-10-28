"use client";

import { useActionState } from "react";
import type { ActionState } from "@/app/admin/actions";
import { saveNavAction } from "@/app/admin/nav-actions";

const input =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export type NavGroup = { title: string; rows: { field: string; defaultLabel: string; hint: string; value: string }[] };

export function NavForm({ locale, groups }: { locale: string; groups: NavGroup[] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveNavAction, { ok: false, message: "" });

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="locale" value={locale} />
      {groups.map((g) => (
        <section key={g.title} className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
          <h2 className="font-bold text-brand-dark">{g.title}</h2>
          <div className="mt-4 space-y-3">
            {g.rows.map((r) => (
              <div key={r.field} className="grid items-center gap-2 sm:grid-cols-[220px_1fr]">
                <label htmlFor={r.field} className="text-sm">
                  <span className="font-medium text-slate-800">{r.defaultLabel}</span>
                  <span className="block text-xs text-slate-400">{r.hint}</span>
                </label>
                <input id={r.field} name={r.field} defaultValue={r.value} placeholder={r.defaultLabel} className={input} />
              </div>
            ))}
          </div>
        </section>
      ))}
      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="rounded-full bg-brand px-8 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
          {pending ? "Saving…" : "Save labels"}
        </button>
        {state.message && (
          <p role="status" className={`text-sm font-medium ${state.ok ? "text-emerald-700" : "text-red-600"}`}>{state.message}</p>
        )}
      </div>
    </form>
  );
}
