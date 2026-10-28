"use client";

import { customFieldTypes, type CustomField, type CustomFieldType } from "@/lib/forms";

export const input =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";
const iconButton = "rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 hover:text-brand-dark disabled:opacity-30";

function newKey() {
  return `custom_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Add, edit, reorder and delete custom fields. */
export function FieldsEditor({
  fields,
  onChange,
  sections,
}: {
  fields: CustomField[];
  onChange: (fields: CustomField[]) => void;
  sections?: { id: string; label: string }[];
}) {
  const update = (key: string, change: Partial<CustomField>) => onChange(fields.map((f) => (f.key === key ? { ...f, ...change } : f)));

  function move(index: number, by: number) {
    const next = [...fields];
    [next[index], next[index + by]] = [next[index + by], next[index]];
    onChange(next);
  }

  function add(type: CustomFieldType = "text") {
    onChange([...fields, { key: newKey(), label: "", type, required: false, options: [], hint: "", section: sections?.[0]?.id ?? "" }]);
  }

  return (
    <div className="space-y-3">
      {fields.length === 0 && <p className="text-sm text-slate-500">No custom fields yet.</p>}
      {fields.map((f, i) => (
        <div key={f.key} className={`rounded-xl p-4 ring-1 ${f.type === "section" ? "border-l-4 border-brand bg-brand/5 ring-brand/20" : "bg-slate-50 ring-slate-200"}`}>
          <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
            <label className="text-xs font-medium text-slate-600">
              {f.type === "section" ? "Heading" : "Label"}
              <input
                value={f.label}
                onChange={(e) => update(f.key, { label: e.target.value })}
                placeholder={f.type === "section" ? "e.g. Travel details" : "e.g. Purpose of visit"}
                className={`${input} mt-1 ${f.type === "section" ? "font-semibold" : ""}`}
              />
            </label>
            <label className="text-xs font-medium text-slate-600">
              Type
              <select value={f.type} onChange={(e) => update(f.key, { type: e.target.value as CustomFieldType })} className={`${input} mt-1`}>
                {customFieldTypes.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </label>
            {f.type === "select" && (
              <label className="text-xs font-medium text-slate-600 sm:col-span-2">
                Choices (one per line)
                <textarea
                  rows={3}
                  value={f.options.join("\n")}
                  onChange={(e) => update(f.key, { options: e.target.value.split("\n") })}
                  placeholder={"Tourism\nVisiting family\nBusiness"}
                  className={`${input} mt-1`}
                />
              </label>
            )}
            <label className="text-xs font-medium text-slate-600">
              {f.type === "section" ? "Description (optional)" : "Help text (optional)"}
              <input
                value={f.hint}
                onChange={(e) => update(f.key, { hint: e.target.value })}
                placeholder={f.type === "section" ? "Shown under the heading" : "Shown under the field"}
                className={`${input} mt-1`}
              />
            </label>
            {sections && (
              <label className="text-xs font-medium text-slate-600">
                Place in
                <select value={f.section} onChange={(e) => update(f.key, { section: e.target.value })} className={`${input} mt-1`}>
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </label>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {f.type === "section" ? (
              <span className="mr-auto text-xs text-slate-500">Groups the fields below it under this heading.</span>
            ) : (
              <label className="mr-auto inline-flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={f.required} onChange={(e) => update(f.key, { required: e.target.checked })} className="h-4 w-4 accent-[var(--brand)]" />
                Required
              </label>
            )}
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className={iconButton} aria-label="Move up">↑</button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === fields.length - 1} className={iconButton} aria-label="Move down">↓</button>
            <button type="button" onClick={() => onChange(fields.filter((x) => x.key !== f.key))} className="rounded-md px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-50">
              Delete
            </button>
          </div>
        </div>
      ))}
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => add()}
          className="rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-600 hover:border-brand hover:text-brand"
        >
          + Add field
        </button>
        <button
          type="button"
          onClick={() => add("section")}
          className="rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-600 hover:border-brand hover:text-brand"
        >
          + Add section
        </button>
      </div>
    </div>
  );
}

export function Status({ state }: { state: { ok: boolean; message: string } }) {
  if (!state.message) return null;
  return <p role="status" className={`text-sm font-medium ${state.ok ? "text-emerald-700" : "text-red-600"}`}>{state.message}</p>;
}
