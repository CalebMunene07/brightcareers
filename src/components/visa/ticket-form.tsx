"use client";

import { startTransition, useActionState, useState } from "react";
import { submitTicketRequest, type FormState } from "@/app/actions";
import { Icon } from "@/components/icon";
import { CardHeading, CustomFields, Field, FileBox, makeL, PaymentInstructions, Select, shrinkImage, SummaryRow, TextArea, TextInput } from "@/components/visa/form-parts";
import { countryNames } from "@/lib/countries";
import { CUSTOM_FILE_TYPES, isRequired, shown, type FormLayout } from "@/lib/forms";
import { routeFee, type Pricing } from "@/lib/pricing";
import { DOC_ACCEPT, DOC_TYPES, MAX_UPLOAD_BYTES, travelClasses, usd } from "@/lib/visa";

const today = () => new Date().toISOString().slice(0, 10);

export function TicketForm({ labels, layout, pricing }: { labels: Record<string, string>; layout: FormLayout; pricing: Pricing }) {
  const L = makeL(labels);
  const [state, formAction, pending] = useActionState<FormState, FormData>(submitTicketRequest, { ok: false, message: "" });
  const [v, setV] = useState<Record<string, string>>(() => ({
    from: "",
    to: "",
    departDate: "",
    returnDate: "",
    passengers: "1",
    travelClass: travelClasses[0],
    email: "",
    notes: "",
    ...Object.fromEntries(layout.custom.map((c) => [c.key, ""])),
  }));
  // Uploads: the passport ("passportFile") and any custom file fields.
  const [files, setFiles] = useState<Record<string, File | undefined>>({});
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});
  const set = (key: string) => (value: string) => setV((s) => ({ ...s, [key]: value }));
  const errors: Record<string, string> = { ...state.errors, ...fileErrors };
  const show = (key: string) => shown(layout, key);
  const req = (key: string) => isRequired(layout, key);

  async function pickFile(key: string, file: File | undefined, types: string[], typeError: string) {
    setFileErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
    if (!file) return setFiles((f) => ({ ...f, [key]: undefined }));
    if (!types.includes(file.type)) return setFileErrors((e) => ({ ...e, [key]: L(typeError) }));
    const small = await shrinkImage(file);
    if (small.size > MAX_UPLOAD_BYTES) return setFileErrors((e) => ({ ...e, [key]: L("Please upload a file under 4 MB.") }));
    setFiles((f) => ({ ...f, [key]: small }));
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const missing: Record<string, string> = {};
    if (req("passportFile") && !files.passportFile) missing.passportFile = L("Please upload this document.");
    for (const c of layout.custom) if (c.type === "file" && c.required && !files[c.key]) missing[c.key] = L("Please upload this document.");
    const size = Object.values(files).reduce((sum, f) => sum + (f?.size ?? 0), 0);
    const first = Object.keys(missing)[0];
    if (first) {
      setFileErrors((e) => ({ ...e, ...missing }));
      document.getElementById(first)?.focus();
      return;
    }
    if (size > MAX_UPLOAD_BYTES) {
      const key = Object.keys(files).find((k) => files[k]) ?? "passportFile";
      setFileErrors((e) => ({ ...e, [key]: L("Your files are too large together. Please upload files under 4 MB in total.") }));
      return;
    }
    const fd = new FormData(e.currentTarget);
    for (const [k, f] of Object.entries(files)) if (f) fd.set(k, f);
    startTransition(() => formAction(fd));
  }
  const fee = routeFee(pricing.routeFees, v.from, v.to);
  const countryOptions = countryNames.map((c) => ({ value: c, label: L(c) }));

  if (state.ok) {
    return (
      <div role="status" className="rounded-2xl bg-white p-8 text-center ring-1 ring-slate-200 sm:p-12">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <Icon name="check" className="h-8 w-8" />
        </span>
        <h2 className="mt-5 text-2xl font-bold text-brand-dark">{L("Request received")}</h2>
        <p className="mt-3 text-slate-600">{state.message}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
      <form onSubmit={submit} noValidate className="min-w-0 rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-8">
        <CardHeading
          icon={<Icon name="plane" className="h-5 w-5" />}
          title={L("Tell us about your journey")}
          text={L("We will use these details to prepare a booking request.")}
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field id="from" label={L("Departure country")} required={req("from")} error={errors.from}>
            <Select id="from" value={v.from} onChange={set("from")} error={errors.from} placeholder={L("Select departure country")} options={countryOptions} />
          </Field>
          <Field id="to" label={L("Destination")} required={req("to")} error={errors.to}>
            <Select id="to" value={v.to} onChange={set("to")} error={errors.to} placeholder={L("Select destination")} options={countryOptions} />
          </Field>
          {show("departDate") && (
            <Field id="departDate" label={L("Departure date")} required={req("departDate")} error={errors.departDate}>
              <TextInput id="departDate" type="date" min={today()} value={v.departDate} onChange={set("departDate")} error={errors.departDate} />
            </Field>
          )}
          {show("returnDate") && (
            <Field id="returnDate" label={L("Return date")} required={req("returnDate")} error={errors.returnDate} hint={req("returnDate") ? undefined : L("Leave empty for a one-way ticket.")}>
              <TextInput id="returnDate" type="date" min={v.departDate || today()} value={v.returnDate} onChange={set("returnDate")} error={errors.returnDate} />
            </Field>
          )}
          {show("passengers") && (
            <Field id="passengers" label={L("Passengers")} required={req("passengers")} error={errors.passengers}>
              <Select id="passengers" value={v.passengers} onChange={set("passengers")} error={errors.passengers} options={["1", "2", "3", "4", "5", "6", "7", "8", "9"]} />
            </Field>
          )}
          {show("travelClass") && (
            <Field id="travelClass" label={L("Travel class")} required={req("travelClass")} error={errors.travelClass}>
              <Select
                id="travelClass"
                value={v.travelClass}
                onChange={set("travelClass")}
                error={errors.travelClass}
                options={travelClasses.map((c) => ({ value: c, label: L(c) }))}
              />
            </Field>
          )}
          {show("email") && (
            <Field id="email" label={L("Email address")} required={req("email")} error={errors.email} className="sm:col-span-2">
              <TextInput id="email" type="email" value={v.email} onChange={set("email")} error={errors.email} placeholder="name@example.com" autoComplete="email" />
            </Field>
          )}
          {show("passportFile") && (
            <FileBox
              id="passportFile"
              label={L("Travelling passport (bio page)")}
              required={req("passportFile")}
              file={files.passportFile}
              error={errors.passportFile}
              accept={DOC_ACCEPT}
              onPick={(f) => void pickFile("passportFile", f, DOC_TYPES, "Upload a PDF, JPG, PNG or WebP file.")}
              L={L}
            />
          )}
          {show("notes") && (
            <Field id="notes" label={L("Additional notes")} required={req("notes")} error={errors.notes} className="sm:col-span-2">
              <TextArea id="notes" value={v.notes} onChange={set("notes")} placeholder={L("Preferred airlines, flexible dates, baggage needs…")} />
            </Field>
          )}
        </div>

        {layout.custom.length > 0 && (
          <div className="mt-4">
            <CustomFields
              fields={layout.custom}
              values={v}
              onChange={set}
              files={files}
              onFile={(key, f) => void pickFile(key, f, CUSTOM_FILE_TYPES, "Upload a PDF, Word, JPG, PNG or WebP file.")}
              errors={errors}
              L={L}
            />
          </div>
        )}

        {state.message && !state.ok && (
          <p role="alert" className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {state.message}
          </p>
        )}

        <div className="mt-8 border-t border-slate-100 pt-6">
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-brand px-8 py-3 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60 sm:w-auto"
          >
            {pending ? L("Sending…") : L("Request flight options")} →
          </button>
        </div>
      </form>

      <aside className="space-y-4 lg:sticky lg:top-28">
        <div className="rounded-2xl border-t-4 border-brand bg-white p-6 ring-1 ring-slate-200">
          <h2 className="flex items-center gap-2 font-bold text-brand-dark">
            <Icon name="search" className="h-5 w-5 text-brand" />
            {L("Booking estimate")}
          </h2>
          <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-y border-slate-100 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{L("From")}</p>
              <p className="mt-1 font-semibold text-brand-dark">{v.from ? L(v.from) : L("Select origin")}</p>
            </div>
            <span aria-hidden="true" className="text-slate-400">→</span>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{L("To")}</p>
              <p className="mt-1 font-semibold text-brand-dark">{v.to ? L(v.to) : L("Select destination")}</p>
            </div>
          </div>
          <dl className="mt-2 divide-y divide-slate-100">
            {show("passengers") && <SummaryRow label={L("Passengers")} value={v.passengers} />}
            {show("travelClass") && <SummaryRow label={L("Travel class")} value={L(v.travelClass)} />}
            {show("returnDate") && <SummaryRow label={L("Trip")} value={v.returnDate ? L("Return") : L("One way")} />}
            <SummaryRow label={L("Booking service fee")} value={fee ? usd(fee) : "—"} strong />
          </dl>
          <p className="mt-4 text-xs text-slate-500">
            {L("Airline fare, taxes, baggage, seat charges and any applicable booking fees will be quoted after we review your route and travel preferences.")}
          </p>
        </div>
        {pricing.paymentInstructions.trim() && (
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 [&>div]:ring-0">
            <PaymentInstructions text={pricing.paymentInstructions} L={L} />
          </div>
        )}
        <div className="rounded-2xl bg-brand-dark p-6 text-white">
          <h2 className="font-bold">{L("What happens next?")}</h2>
          <p className="mt-1 text-sm text-white/80">
            {L("We review your request, compare available options and contact you before any ticket purchase is made.")}
          </p>
        </div>
      </aside>
    </div>
  );
}
