"use client";

import { useActionState, useState } from "react";
import type { ActionState } from "@/app/admin/actions";
import { saveFormSettingsAction } from "@/app/admin/form-actions";
import { contactFields, resolveLayout, type FormDef, type FormSettings } from "@/lib/forms";
import { FieldsEditor, Status } from "./fields-editor";

/** Show/hide and required/optional for a built-in form's fields, plus its custom fields. */
export function BuiltInFormEditor({ def, settings }: { def: FormDef; settings: FormSettings }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveFormSettingsAction, { ok: false, message: "" });
  const [fields, setFields] = useState(() => resolveLayout(def, settings).fields);
  const [custom, setCustom] = useState(settings.custom);

  const groups = [
    ...(def.sections ?? [{ id: "", label: "Fields" }]).map((s) => ({ ...s, fields: def.fields.filter((f) => (f.section ?? "") === s.id) })),
    ...(def.sections ? [{ id: "other", label: "Other", fields: def.fields.filter((f) => !f.section) }] : []),
  ].filter((g) => g.fields.length > 0);

  const payload = JSON.stringify({
    fields: Object.fromEntries(Object.entries(fields).map(([k, f]) => [k, { hidden: !f.shown, required: f.required }])),
    custom,
  });

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="form" value={def.id} />
      <input type="hidden" name="settings" value={payload} />

      {groups.map((g) => (
        <section key={g.id} className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
          <h2 className="font-bold text-brand-dark">{g.label}</h2>
          <table className="mt-3 w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="py-2 font-semibold">Field</th>
                <th className="w-24 py-2 text-center font-semibold">On form</th>
                <th className="w-24 py-2 text-center font-semibold">Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {g.fields.map((f) => {
                const s = fields[f.key];
                return (
                  <tr key={f.key}>
                    <td className="py-2.5 pr-3 text-slate-800">
                      {f.label}
                      {f.core && <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-500">Can’t be removed</span>}
                      {contactFields.includes(f.key) && !(s.shown && s.required) && (
                        <span className="mt-0.5 block text-xs text-amber-700">
                          {f.key === "email"
                            ? "Without an email you can’t reply, and privacy requests can’t find this person’s data."
                            : "Submissions may arrive without a name."}
                        </span>
                      )}
                    </td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        aria-label={`Show ${f.label}`}
                        checked={s.shown}
                        disabled={f.core}
                        onChange={(e) => setFields((all) => ({ ...all, [f.key]: { ...s, shown: e.target.checked } }))}
                        className="h-4 w-4 accent-[var(--brand)] disabled:opacity-40"
                      />
                    </td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        aria-label={`${f.label} is required`}
                        checked={s.shown && s.required}
                        disabled={!s.shown}
                        onChange={(e) => setFields((all) => ({ ...all, [f.key]: { ...s, required: e.target.checked } }))}
                        className="h-4 w-4 accent-[var(--brand)] disabled:opacity-40"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      ))}

      <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <h2 className="font-bold text-brand-dark">Extra fields</h2>
        <p className="mt-1 text-sm text-slate-500">
          Your own questions, added {def.sections ? "at the end of the step you choose" : "at the end of the form"}. Answers show in the inbox and the email alert.
        </p>
        <div className="mt-4">
          <FieldsEditor fields={custom} onChange={setCustom} sections={def.sections} />
        </div>
      </section>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="rounded-full bg-brand px-8 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
          {pending ? "Saving…" : "Save form"}
        </button>
        <Status state={state} />
      </div>
    </form>
  );
}
