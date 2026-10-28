"use client";

import { useActionState, useState } from "react";
import type { ActionState } from "@/app/admin/actions";
import { savePricingAction } from "@/app/admin/form-actions";
import { feesTotal, type Pricing } from "@/lib/pricing";
import { input, Status } from "../fields-editor";

let nextRow = 0;
const row = <T extends object>(x: T) => ({ ...x, row: nextRow++ });

const routeTiers = [
  { key: "sameCountry", label: "Within one country" },
  { key: "sameContinent", label: "Within one continent" },
  { key: "europeNorthAmerica", label: "Between Europe and North America" },
  { key: "other", label: "Any other international route" },
] as const;

export function PricingEditor({ pricing }: { pricing: Pricing }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(savePricingAction, { ok: false, message: "" });
  const [visaFees, setVisaFees] = useState(() => pricing.visaFees.map((f) => row({ label: f.label, amount: String(f.amount) })));
  const [routeFees, setRouteFees] = useState(() => Object.fromEntries(routeTiers.map((t) => [t.key, String(pricing.routeFees[t.key])])));
  const [cvDownloadFee, setCvDownloadFee] = useState(String(pricing.cvDownloadFee));
  const [processingTime, setProcessingTime] = useState(pricing.processingTime);
  const [methods, setMethods] = useState(() => pricing.paymentMethods.map(row));
  const [instructions, setInstructions] = useState(pricing.paymentInstructions);
  const err = (k: string) => (state.errors?.[k] ? <p className="mt-2 text-xs text-red-600">{state.errors[k]}</p> : null);

  const payload = JSON.stringify({
    visaFees: visaFees.map(({ label, amount }) => ({ label, amount })),
    routeFees,
    cvDownloadFee,
    processingTime,
    paymentMethods: methods.map(({ id, label, note, mark }) => ({ id, label, note, mark })),
    paymentInstructions: instructions,
  });
  const visaTotal = feesTotal(visaFees.map((f) => ({ label: f.label, amount: Number(f.amount) || 0 })));

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="pricing" value={payload} />

      <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <h2 className="font-bold text-brand-dark">Visa application fees</h2>
        <p className="mt-1 text-sm text-slate-500">Fixed fees in USD on every visa application. The air ticket booking fee for the route is added on top.</p>
        <div className="mt-4 space-y-2">
          {visaFees.map((f) => (
            <div key={f.row} className="flex gap-2">
              <input
                aria-label="Fee name"
                value={f.label}
                onChange={(e) => setVisaFees((all) => all.map((x) => (x.row === f.row ? { ...x, label: e.target.value } : x)))}
                placeholder="e.g. Processing fee"
                className={input}
              />
              <input
                aria-label="Amount in USD"
                type="number"
                min="0"
                step="0.01"
                value={f.amount}
                onChange={(e) => setVisaFees((all) => all.map((x) => (x.row === f.row ? { ...x, amount: e.target.value } : x)))}
                placeholder="USD"
                className={`${input} w-32 shrink-0`}
              />
              <button type="button" onClick={() => setVisaFees((all) => all.filter((x) => x.row !== f.row))} className="shrink-0 rounded-md px-2 text-sm font-medium text-red-600 hover:bg-red-50">
                Remove
              </button>
            </div>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => setVisaFees((all) => [...all, row({ label: "", amount: "" })])}
              className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand ring-1 ring-brand hover:bg-brand hover:text-white"
            >
              + Add fee
            </button>
            <p className="text-sm font-semibold text-brand-dark">Visa fees total: USD {visaTotal.toFixed(2)}</p>
          </div>
          {err("visaFees")}
        </div>
        <label className="mt-5 block text-sm font-medium">
          Typical processing time
          <input value={processingTime} onChange={(e) => setProcessingTime(e.target.value)} placeholder="e.g. 15 – 20 business days" className={`${input} mt-1`} />
        </label>
      </section>

      <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <h2 className="font-bold text-brand-dark">Air ticket booking fees</h2>
        <p className="mt-1 text-sm text-slate-500">Service fee in USD by route, quoted on the air ticket form and added to visa applications. The airline fare is quoted separately.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {routeTiers.map((t) => (
            <label key={t.key} className="text-sm font-medium">
              {t.label}
              <input
                type="number"
                min="0"
                step="0.01"
                value={routeFees[t.key]}
                onChange={(e) => setRouteFees((all) => ({ ...all, [t.key]: e.target.value }))}
                className={`${input} mt-1`}
              />
            </label>
          ))}
        </div>
        {err("routeFees")}
      </section>

      <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <h2 className="font-bold text-brand-dark">CV maker</h2>
        <label className="mt-3 block max-w-xs text-sm font-medium">
          PDF download price (USD)
          <input type="number" min="0" step="0.01" value={cvDownloadFee} onChange={(e) => setCvDownloadFee(e.target.value)} className={`${input} mt-1`} />
        </label>
        {err("cvDownloadFee")}
      </section>

      <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <h2 className="font-bold text-brand-dark">Payment methods</h2>
        <p className="mt-1 text-sm text-slate-500">The choices applicants pick from on the visa form, CV download and your own forms.</p>
        <div className="mt-4 space-y-2">
          {methods.map((m) => (
            <div key={m.row} className="grid gap-2 sm:grid-cols-[1fr_1fr_160px_auto]">
              <input
                aria-label="Name"
                value={m.label}
                onChange={(e) => setMethods((all) => all.map((x) => (x.row === m.row ? { ...x, label: e.target.value } : x)))}
                placeholder="Name, e.g. Bank transfer"
                className={input}
              />
              <input
                aria-label="Note"
                value={m.note}
                onChange={(e) => setMethods((all) => all.map((x) => (x.row === m.row ? { ...x, note: e.target.value } : x)))}
                placeholder="Note (optional)"
                className={input}
              />
              <input
                aria-label="Badge"
                value={m.mark}
                onChange={(e) => setMethods((all) => all.map((x) => (x.row === m.row ? { ...x, mark: e.target.value } : x)))}
                placeholder="Badge, e.g. SWIFT"
                className={input}
              />
              <button type="button" onClick={() => setMethods((all) => all.filter((x) => x.row !== m.row))} className="rounded-md px-2 text-sm font-medium text-red-600 hover:bg-red-50">
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setMethods((all) => [...all, row({ id: "", label: "", note: "", mark: "" })])}
            className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand ring-1 ring-brand hover:bg-brand hover:text-white"
          >
            + Add payment method
          </button>
          {err("paymentMethods")}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <h2 className="font-bold text-brand-dark">Payment instructions</h2>
        <p className="mt-1 text-sm text-slate-500">
          Shown on the visa payment step, the air ticket form, the CV download and your own forms (unless a form has its own). For example bank details or how payment links work. Leave empty to hide.
        </p>
        <textarea
          rows={6}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder={"After we review your application we'll email you a secure payment link.\nBank transfer: Bridge Careers Global, account 0000000, reference = your full name."}
          className={`${input} mt-3`}
        />
      </section>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="rounded-full bg-brand px-8 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
          {pending ? "Saving…" : "Save pricing"}
        </button>
        <Status state={state} />
      </div>
    </form>
  );
}
