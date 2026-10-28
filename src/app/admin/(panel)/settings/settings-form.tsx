"use client";

import { useActionState, useState, useTransition } from "react";
import type { ActionState } from "@/app/admin/actions";
import { saveSettingsAction, testSettingsAction } from "@/app/admin/settings-actions";
import type { SettingField } from "@/lib/settings";

export type FieldState = { value: string; source: "admin" | "env" | "none"; unreadable: boolean };

const input =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

function SourceBadge({ state, secret }: { state: FieldState; secret?: boolean }) {
  if (state.unreadable) return <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-700">Can&apos;t be read — re-enter it</span>;
  if (state.source === "admin") return <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">{secret ? "Saved (hidden)" : "Saved"}</span>;
  if (state.source === "env") return <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-800">From .env file</span>;
  return <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">Not set</span>;
}

export function SettingsForm({
  sectionId,
  fields,
  states,
  testable,
}: {
  sectionId: string;
  fields: SettingField[];
  states: Record<string, FieldState>;
  testable: boolean;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveSettingsAction, { ok: false, message: "" });
  const [test, setTest] = useState<ActionState | null>(null);
  const [testing, startTest] = useTransition();
  const err = (k: string) => (state.errors?.[k] ? <p className="mt-1 text-xs text-red-600">{state.errors[k]}</p> : null);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="section" value={sectionId} />
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => {
          const st = states[f.key];
          const id = `${sectionId}-${f.key}`;
          return (
            <div key={f.key}>
              <div className="flex items-center justify-between gap-2">
                <label htmlFor={id} className="text-sm font-medium text-slate-800">{f.label}</label>
                <SourceBadge state={st} secret={f.secret} />
              </div>
              {f.options ? (
                <select id={id} name={f.key} defaultValue={st.value} className={input}>
                  {f.options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : f.secret ? (
                <input
                  id={id}
                  name={f.key}
                  type="password"
                  autoComplete="new-password"
                  placeholder={st.source === "admin" ? "•••••••• (leave empty to keep)" : st.source === "env" ? "Set in .env (enter a value to override)" : "Not set"}
                  className={input}
                />
              ) : (
                <input id={id} name={f.key} defaultValue={st.value} placeholder={f.placeholder} className={input} />
              )}
              {f.help && <p className="mt-1 text-xs text-slate-500">{f.help}</p>}
              {f.secret && st.source === "admin" && (
                <label className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                  <input type="checkbox" name="clear" value={f.key} className="h-3.5 w-3.5" /> Remove saved value
                </label>
              )}
              {err(f.key)}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
        <button type="submit" disabled={pending} className="rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
          {pending ? "Saving…" : "Save"}
        </button>
        {testable && (
          <button
            type="button"
            disabled={testing}
            onClick={() => startTest(async () => setTest(await testSettingsAction(sectionId)))}
            className="rounded-full border border-brand px-5 py-2 text-sm font-semibold text-brand hover:bg-brand/5 disabled:opacity-60"
          >
            {testing ? "Testing…" : "Test"}
          </button>
        )}
        {state.message && (
          <span role="status" className={`text-sm font-medium ${state.ok ? "text-emerald-700" : "text-red-600"}`}>{state.message}</span>
        )}
      </div>
      {test && (
        <p role="status" className={`rounded-lg p-3 text-sm ${test.ok ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-800"}`}>{test.message}</p>
      )}
    </form>
  );
}
