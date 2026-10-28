"use client";

import { useState, useTransition } from "react";
import { saveContentAction, type ActionState } from "@/app/admin/actions";
import { Icon } from "@/components/icon";
import { iconNames, type IconName } from "@/lib/content";
import type { MediaItem } from "@/lib/media";
import type { ContentField } from "@/lib/site-content";
import { ImagePicker } from "../image-picker";

type Item = Record<string, string | string[]>;

const input =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

function emptyItem(fields: ContentField[]): Item {
  return Object.fromEntries(fields.map((f) => [f.name, f.type === "lines" ? [] : ""]));
}

function FieldInput({
  field,
  value,
  onChange,
  id,
  images,
}: {
  field: ContentField;
  value: string | string[] | undefined;
  onChange: (v: string | string[]) => void;
  id: string;
  images: MediaItem[];
}) {
  if (field.type === "icon") {
    const current = String(value || "check") as IconName;
    return (
      <div className="flex items-center gap-3">
        <select id={id} className={input} value={current} onChange={(e) => onChange(e.target.value)}>
          {iconNames.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <Icon name={current} className="mt-1 h-6 w-6 shrink-0 text-brand" />
      </div>
    );
  }
  if (field.type === "image") {
    return (
      <div className="mt-1">
        <ImagePicker images={images} value={String(value ?? "")} onChange={(src) => onChange(src)} />
      </div>
    );
  }
  if (field.type === "lines") {
    return (
      <textarea
        id={id}
        rows={4}
        className={input}
        value={Array.isArray(value) ? value.join("\n") : String(value ?? "")}
        onChange={(e) => onChange(e.target.value.split("\n"))}
      />
    );
  }
  if (field.type === "textarea") {
    return <textarea id={id} rows={3} className={input} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />;
  }
  return <input id={id} className={input} placeholder={field.placeholder} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />;
}

export function ContentEditor({
  contentKey,
  kind,
  itemLabel = "Item",
  fields,
  initial,
  images = [],
}: {
  contentKey: string;
  kind: "list" | "object";
  itemLabel?: string;
  fields: ContentField[];
  initial: unknown;
  images?: MediaItem[];
}) {
  const [items, setItems] = useState<Item[]>(() =>
    kind === "list" ? ((initial as Item[]) ?? []).map((i) => ({ ...i })) : [{ ...(initial as Item) }],
  );
  const [dirty, setDirty] = useState(false);
  const [result, setResult] = useState<ActionState | null>(null);
  const [pending, startTransition] = useTransition();

  function update(next: Item[]) {
    setItems(next);
    setDirty(true);
    setResult(null);
  }

  function setField(index: number, name: string, value: string | string[]) {
    update(items.map((it, i) => (i === index ? { ...it, [name]: value } : it)));
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    update(next);
  }

  function save() {
    startTransition(async () => {
      const value = kind === "list" ? items : items[0];
      const res = await saveContentAction(contentKey, value);
      setResult(res);
      if (res.ok) setDirty(false);
    });
  }

  return (
    <div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            {kind === "list" && (
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-bold text-brand-dark">
                  {itemLabel} {index + 1}
                </p>
                <div className="flex gap-1 text-sm">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="rounded px-2 py-1 text-slate-600 hover:bg-slate-100 disabled:opacity-30" aria-label="Move up">↑</button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} className="rounded px-2 py-1 text-slate-600 hover:bg-slate-100 disabled:opacity-30" aria-label="Move down">↓</button>
                  <button type="button" onClick={() => update(items.filter((_, i) => i !== index))} className="rounded px-2 py-1 font-semibold text-red-600 hover:bg-red-50">Remove</button>
                </div>
              </div>
            )}
            <div className={`grid gap-4 ${fields.length > 1 && fields.every((f) => !f.type || f.type === "text") ? "sm:grid-cols-2" : ""}`}>
              {fields.map((f) => {
                const id = `${contentKey}-${index}-${f.name}`;
                return (
                  <div key={f.name}>
                    <label htmlFor={id} className="text-xs font-semibold text-slate-700">{f.label}</label>
                    <FieldInput id={id} field={f} images={images} value={item[f.name]} onChange={(v) => setField(index, f.name, v)} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {kind === "list" && (
        <button
          type="button"
          onClick={() => update([...items, emptyItem(fields)])}
          className="mt-4 w-full rounded-2xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-brand hover:border-brand"
        >
          + Add {itemLabel.toLowerCase()}
        </button>
      )}

      <div className="sticky bottom-0 mt-6 flex flex-wrap items-center gap-4 border-t border-slate-200 bg-slate-50/95 py-4 backdrop-blur">
        <button
          type="button"
          onClick={save}
          disabled={pending || !dirty}
          className="rounded-full bg-brand px-8 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
        {dirty && !pending && <span className="text-sm text-amber-700">Unsaved changes</span>}
        {result && (
          <span role="status" className={`text-sm font-medium ${result.ok ? "text-emerald-700" : "text-red-600"}`}>
            {result.message}
          </span>
        )}
      </div>
    </div>
  );
}
