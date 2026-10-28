"use client";

import { useActionState } from "react";
import { importJobsAction, type ImportState } from "@/app/admin/import-actions";

export function ImportForm() {
  const [state, action, pending] = useActionState<ImportState, FormData>(importJobsAction, { ok: false, message: "" });

  return (
    <div className="space-y-6">
      <form action={action} className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <div>
          <label htmlFor="file" className="text-sm font-medium">CSV file</label>
          <input
            id="file"
            name="file"
            type="file"
            accept=".csv,text/csv"
            required
            className="mt-1 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-brand/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            name="mode"
            value="check"
            disabled={pending}
            className="rounded-full border border-brand px-6 py-2 text-sm font-semibold text-brand hover:bg-brand/5 disabled:opacity-60"
          >
            {pending ? "Working…" : "Check file"}
          </button>
          <button
            type="submit"
            name="mode"
            value="import"
            disabled={pending}
            className="rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {pending ? "Working…" : "Import"}
          </button>
        </div>
      </form>

      {state.message && (
        <div
          role="status"
          className={`rounded-2xl p-5 text-sm ring-1 ${state.ok ? "bg-emerald-50 text-emerald-900 ring-emerald-200" : "bg-red-50 text-red-900 ring-red-200"}`}
        >
          <p className="font-semibold">{state.message}</p>
          {state.errors && state.errors.length > 0 && (
            <ul className="mt-3 max-h-80 space-y-1 overflow-y-auto">
              {state.errors.map((e) => (
                <li key={e.row}>
                  <span className="font-semibold">Row {e.row}:</span> {e.messages.join("; ")}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
