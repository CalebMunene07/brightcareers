"use client";

import { useActionState, useState } from "react";
import type { ActionState } from "@/app/admin/actions";
import { saveCustomFormAction } from "@/app/admin/form-actions";
import type { CustomForm } from "@/lib/custom-forms-repo";
import { FieldsEditor, input, Status } from "./fields-editor";

type FeeRow = { id: number; label: string; amount: string };
let nextFee = 0;

/** Title, address, fees and fields of a form created by an admin. */
export function CustomFormEditor({ form }: { form?: CustomForm }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveCustomFormAction, { ok: false, message: "" });
  const [v, setV] = useState({
    title: form?.title ?? "",
    slug: form?.slug ?? "",
    intro: form?.intro ?? "",
    success: form?.success ?? "",
    published: form?.published ?? false,
    askPayment: form?.askPayment ?? true,
    paymentInstructions: form?.paymentInstructions ?? "",
    nameRequired: form?.nameRequired ?? true,
    emailRequired: form?.emailRequired ?? true,
    order: String(form?.order ?? 0),
  });
  const [fees, setFees] = useState<FeeRow[]>(() => (form?.fees ?? []).map((f) => ({ id: nextFee++, label: f.label, amount: String(f.amount) })));
  const [fields, setFields] = useState(form?.fields ?? []);
  const err = (k: string) => (state.errors?.[k] ? <p className="mt-1 text-xs text-red-600">{state.errors[k]}</p> : null);
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setV((s) => ({ ...s, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));
  const total = fees.reduce((sum, f) => sum + (Number(f.amount) || 0), 0);

  const payload = JSON.stringify({
    id: form?.id,
    ...v,
    fees: fees.map(({ label, amount }) => ({ label, amount })),
    fields,
  });

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="form" value={payload} />

      <section className="grid gap-4 rounded-2xl bg-white p-6 ring-1 ring-slate-200 sm:grid-cols-2">
        <label className="text-sm font-medium sm:col-span-2">
          Form title *
          <input value={v.title} onChange={set("title")} placeholder="e.g. Tourist visa application" className={`${input} mt-1`} />
          {err("title")}
        </label>
        <div className="sm:col-span-2">
          <label htmlFor="slug" className="text-sm font-medium">Web address</label>
          <div className="mt-1 flex items-center rounded-lg border border-slate-300 bg-slate-50 text-sm focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
            <span className="pl-3 text-slate-500">/apply/</span>
            <input id="slug" value={v.slug} onChange={set("slug")} placeholder="generated from the title" className="min-w-0 flex-1 bg-transparent px-1 py-2 focus:outline-none" />
          </div>
          {err("slug")}
        </div>
        <label className="text-sm font-medium sm:col-span-2">
          Introduction
          <textarea rows={3} value={v.intro} onChange={set("intro")} placeholder="Shown at the top of the form, e.g. what the visa covers and how long it takes." className={`${input} mt-1`} />
        </label>
        <label className="text-sm font-medium sm:col-span-2">
          Message after sending
          <input value={v.success} onChange={set("success")} placeholder="Thanks! We'll email you a secure payment link and next steps within 2 working days." className={`${input} mt-1`} />
        </label>
        <label className="text-sm font-medium">
          Order on the forms list
          <input type="number" value={v.order} onChange={set("order")} className={`${input} mt-1`} />
        </label>
        <label className="inline-flex items-center gap-2 self-end pb-2 text-sm font-medium">
          <input type="checkbox" checked={v.published} onChange={set("published")} className="h-4 w-4 accent-[var(--brand)]" />
          Published (visible on the site)
        </label>
      </section>

      <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <h2 className="font-bold text-brand-dark">Pricing</h2>
        <p className="mt-1 text-sm text-slate-500">Fees in USD shown to the applicant with a total. Leave empty for a free form. No payment is taken on the site; your team sends a payment link.</p>
        <div className="mt-4 space-y-2">
          {fees.map((f) => (
            <div key={f.id} className="flex gap-2">
              <input
                aria-label="Fee name"
                value={f.label}
                onChange={(e) => setFees((all) => all.map((x) => (x.id === f.id ? { ...x, label: e.target.value } : x)))}
                placeholder="e.g. Processing fee"
                className={input}
              />
              <input
                aria-label="Amount in USD"
                type="number"
                min="0"
                step="0.01"
                value={f.amount}
                onChange={(e) => setFees((all) => all.map((x) => (x.id === f.id ? { ...x, amount: e.target.value } : x)))}
                placeholder="USD"
                className={`${input} w-32 shrink-0`}
              />
              <button type="button" onClick={() => setFees((all) => all.filter((x) => x.id !== f.id))} className="shrink-0 rounded-md px-2 text-sm font-medium text-red-600 hover:bg-red-50">
                Remove
              </button>
            </div>
          ))}
          {err("fees")}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => setFees((all) => [...all, { id: nextFee++, label: "", amount: "" }])}
              className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand ring-1 ring-brand hover:bg-brand hover:text-white"
            >
              + Add fee
            </button>
            <p className="text-sm font-semibold text-brand-dark">Total: USD {total.toFixed(2)}</p>
          </div>
          {fees.length > 0 && (
            <label className="mt-2 inline-flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={v.askPayment} onChange={set("askPayment")} className="h-4 w-4 accent-[var(--brand)]" />
              Ask for a preferred payment method (the methods in Pricing & payment)
            </label>
          )}
          {fees.length > 0 && (
            <label className="mt-3 block text-sm font-medium">
              Payment instructions for this form
              <textarea
                rows={4}
                value={v.paymentInstructions}
                onChange={set("paymentInstructions")}
                placeholder="Leave empty to use the instructions from Pricing & payment."
                className={`${input} mt-1`}
              />
            </label>
          )}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <h2 className="font-bold text-brand-dark">Fields</h2>
        <p className="mt-1 text-sm text-slate-500">Full name and email are always asked first. Add everything else below.</p>
        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 rounded-xl bg-slate-50 p-4 text-sm ring-1 ring-slate-200">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={v.nameRequired} onChange={set("nameRequired")} className="h-4 w-4 accent-[var(--brand)]" />
            Full name is required
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={v.emailRequired} onChange={set("emailRequired")} className="h-4 w-4 accent-[var(--brand)]" />
            Email is required
          </label>
          {!v.emailRequired && (
            <p className="w-full text-xs text-amber-700">Without an email you can’t reply, and privacy requests can’t find this person’s data.</p>
          )}
        </div>
        <div className="mt-4">
          <FieldsEditor fields={fields} onChange={setFields} />
        </div>
        {err("fields")}
      </section>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="rounded-full bg-brand px-8 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
          {pending ? "Saving…" : form ? "Save form" : "Create form"}
        </button>
        <Status state={state} />
      </div>
    </form>
  );
}
