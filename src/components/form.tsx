"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/actions";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "date" | "file" | "textarea" | "select" | "section";
  required?: boolean;
  options?: (string | { value: string; label: string })[];
  placeholder?: string;
  accept?: string;
  defaultValue?: string;
  hint?: string;
  full?: boolean; // span both columns
};

export const inputClass =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export function Form({
  action,
  fields,
  submitLabel,
  hidden,
  ui = { submitted: "Submitted", sending: "Sending…", select: "Select…" },
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  fields: Field[];
  submitLabel: string;
  hidden?: Record<string, string>;
  ui?: { submitted: string; sending: string; select: string };
}) {
  const [state, formAction, pending] = useActionState(action, { ok: false, message: "" });

  if (state.ok) {
    return (
      <div role="status" className="rounded-2xl bg-emerald-50 p-8 text-emerald-900 ring-1 ring-emerald-200">
        <p className="text-lg font-semibold">{ui.submitted}</p>
        <p className="mt-2">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-5 sm:grid-cols-2" noValidate>
      {hidden &&
        Object.entries(hidden).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}

      {fields.map((field) => {
        if (field.type === "section") return <SectionHeading key={field.name} title={field.label} text={field.hint} />;
        const id = `f-${field.name}`;
        const error = state.errors?.[field.name];
        const common = {
          id,
          name: field.name,
          required: field.required,
          placeholder: field.placeholder,
          defaultValue: field.defaultValue,
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? `${id}-error` : field.hint ? `${id}-hint` : undefined,
          className: `${inputClass} ${error ? "border-red-500" : ""}`,
        };

        return (
          <div key={field.name} className={field.full || field.type === "textarea" ? "sm:col-span-2" : ""}>
            <label htmlFor={id} className="text-sm font-medium text-slate-800">
              {field.label}
              {field.required && <span className="text-red-600"> *</span>}
            </label>
            {field.type === "textarea" ? (
              <textarea rows={5} {...common} />
            ) : field.type === "select" ? (
              <select {...common}>
                <option value="">{ui.select}</option>
                {field.options?.map((o) => {
                  const opt = typeof o === "string" ? { value: o, label: o } : o;
                  return (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  );
                })}
              </select>
            ) : field.type === "file" ? (
              <input
                {...common}
                defaultValue={undefined}
                type="file"
                accept={field.accept}
                className={`${common.className} file:mr-3 file:rounded-md file:border-0 file:bg-brand/10 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-brand`}
              />
            ) : (
              <input type={field.type ?? "text"} {...common} />
            )}
            {field.hint && !error && (
              <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500">
                {field.hint}
              </p>
            )}
            {error && (
              <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
        );
      })}

      <div className="sm:col-span-2">
        {state.message && !state.ok && (
          <p role="alert" className="mb-4 text-sm font-medium text-red-600">
            {state.message}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-brand px-8 py-3 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60 sm:w-auto"
        >
          {pending ? ui.sending : submitLabel}
        </button>
      </div>
    </form>
  );
}

/** A heading that starts a new group of fields. */
export function SectionHeading({ title, text }: { title: string; text?: string }) {
  return (
    <div className="border-b border-slate-200 pb-2 pt-3 sm:col-span-2">
      <h3 className="text-lg font-bold text-brand-dark">{title}</h3>
      {text && <p className="mt-1 text-sm text-slate-600">{text}</p>}
    </div>
  );
}
