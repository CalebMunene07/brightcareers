"use client";

import { inputClass, SectionHeading } from "@/components/form";
import { Icon } from "@/components/icon";
import { CUSTOM_FILE_ACCEPT, type CustomField } from "@/lib/forms";

// Small building blocks shared by the visa application and air ticket booking forms.

export type L = (s: string, vars?: Record<string, string | number>) => string;

export function makeL(labels: Record<string, string>): L {
  return (s, vars) => {
    const text = labels[s] ?? s;
    return vars ? text.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : text;
  };
}

export type Option = string | { value: string; label: string };

export function Field({
  id,
  label,
  required,
  error,
  hint,
  className = "",
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-medium text-slate-800">
        {label}
        {required && <span className="text-brand"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

type Common = { id: string; value: string; onChange: (value: string) => void; error?: string };

function a11y(id: string, error?: string) {
  return {
    id,
    name: id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
    className: `${inputClass} ${error ? "border-red-500" : ""}`,
  };
}

export function TextInput({
  type = "text",
  placeholder,
  autoComplete,
  min,
  max,
  ...p
}: Common & { type?: string; placeholder?: string; autoComplete?: string; min?: string; max?: string }) {
  return (
    <input
      {...a11y(p.id, p.error)}
      type={type}
      value={p.value}
      placeholder={placeholder}
      autoComplete={autoComplete}
      min={min}
      max={max}
      onChange={(e) => p.onChange(e.target.value)}
    />
  );
}

export function Select({ options, placeholder, ...p }: Common & { options: Option[]; placeholder?: string }) {
  return (
    <select {...a11y(p.id, p.error)} value={p.value} onChange={(e) => p.onChange(e.target.value)}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((o) => {
        const opt = typeof o === "string" ? { value: o, label: o } : o;
        return (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        );
      })}
    </select>
  );
}

export function TextArea(p: Common & { placeholder?: string }) {
  return (
    <textarea {...a11y(p.id, p.error)} rows={4} value={p.value} placeholder={p.placeholder} onChange={(e) => p.onChange(e.target.value)} />
  );
}

export function CardHeading({ icon, title, text }: { icon: React.ReactNode; title: string; text?: string }) {
  return (
    <div className="flex items-start gap-4 border-b border-slate-100 pb-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">{icon}</span>
      <div>
        <h2 className="text-xl font-bold text-brand-dark">{title}</h2>
        {text && <p className="mt-1 text-sm text-slate-600">{text}</p>}
      </div>
    </div>
  );
}

export function SummaryRow({ label, value, strong }: { label: string; value: React.ReactNode; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2 text-sm">
      <dt className="text-slate-500">{label}</dt>
      <dd className={`text-right ${strong ? "text-base font-bold text-brand-dark" : "font-semibold text-slate-800"}`}>{value}</dd>
    </div>
  );
}

/** Shrinks a photo so several documents fit in one upload. PDFs and small files pass through unchanged. */
export async function shrinkImage(file: File, maxSide = 2000, quality = 0.85): Promise<File> {
  if (!file.type.startsWith("image/") || file.size < 600 * 1024) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export function formatBytes(n: number) {
  return n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;
}

/** A single document upload with its file name, size and Replace/Choose button. */
export function FileBox({
  id,
  label,
  required,
  file,
  error,
  hint,
  accept,
  onPick,
  L,
}: {
  id: string;
  label: string;
  required?: boolean;
  file?: File;
  error?: string;
  hint?: string;
  accept: string;
  onPick: (file: File | undefined) => void;
  L: L;
}) {
  return (
    <div className="sm:col-span-2">
      <p className="text-sm font-medium text-slate-800">
        {label}
        {required && <span className="text-brand"> *</span>}
      </p>
      <div
        className={`mt-1.5 flex flex-wrap items-center gap-3 rounded-xl border-2 border-dashed p-4 ${
          error ? "border-red-300 bg-red-50/40" : file ? "border-brand/40 bg-brand/5" : "border-slate-200"
        }`}
      >
        <Icon name={file ? "check" : "file"} className={`h-6 w-6 shrink-0 ${file ? "text-brand" : "text-slate-400"}`} />
        <p className="min-w-0 flex-1 truncate text-sm text-slate-600">{file ? `${file.name} · ${formatBytes(file.size)}` : hint || L("PDF, JPG or PNG")}</p>
        {file && !required && (
          <button type="button" onClick={() => onPick(undefined)} className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:text-red-600">
            {L("Remove")}
          </button>
        )}
        <label
          htmlFor={id}
          className="cursor-pointer rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-brand ring-1 ring-brand/40 focus-within:ring-2 focus-within:ring-brand hover:bg-brand/5"
        >
          {file ? L("Replace file") : L("Choose file")}
          <input
            id={id}
            type="file"
            accept={accept}
            className="sr-only"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={(e) => {
              onPick(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/** Fields added in Admin → Forms. Text values live in `values`, uploads in `files`, both keyed by field key. */
export function CustomFields({
  fields,
  values,
  onChange,
  files,
  onFile,
  errors,
  L,
}: {
  fields: CustomField[];
  values: Record<string, string>;
  onChange: (key: string) => (value: string) => void;
  files: Record<string, File | undefined>;
  onFile: (key: string, file: File | undefined) => void;
  errors: Record<string, string>;
  L: L;
}) {
  if (fields.length === 0) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((c) => {
        const hint = c.hint ? L(c.hint) : undefined;
        if (c.type === "section") return <SectionHeading key={c.key} title={L(c.label)} text={hint} />;
        if (c.type === "file") {
          return (
            <FileBox
              key={c.key}
              id={c.key}
              label={L(c.label)}
              required={c.required}
              file={files[c.key]}
              error={errors[c.key]}
              hint={hint}
              accept={CUSTOM_FILE_ACCEPT}
              onPick={(f) => onFile(c.key, f)}
              L={L}
            />
          );
        }
        const common = { id: c.key, value: values[c.key] ?? "", onChange: onChange(c.key), error: errors[c.key] };
        return (
          <Field key={c.key} id={c.key} label={L(c.label)} required={c.required} error={errors[c.key]} hint={hint} className={c.type === "textarea" ? "sm:col-span-2" : ""}>
            {c.type === "select" ? (
              <Select {...common} placeholder={L("Select…")} options={c.options.map((o) => ({ value: o, label: L(o) }))} />
            ) : c.type === "textarea" ? (
              <TextArea {...common} />
            ) : (
              <TextInput {...common} type={c.type} />
            )}
          </Field>
        );
      })}
    </div>
  );
}

/** Payment instructions written in Admin → Forms → Pricing & payment. */
export function PaymentInstructions({ text, L }: { text: string; L: (s: string) => string }) {
  if (!text.trim()) return null;
  return (
    <div className="rounded-xl p-4 ring-1 ring-slate-200">
      <p className="text-sm font-bold text-brand-dark">{L("Payment instructions")}</p>
      <p className="mt-1 whitespace-pre-line text-sm text-slate-700">{L(text)}</p>
    </div>
  );
}
