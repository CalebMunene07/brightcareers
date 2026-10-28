"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useMemo, useRef, useState } from "react";
import { submitVisaApplication, type FormState } from "@/app/actions";
import { Icon } from "@/components/icon";
import {
  CardHeading,
  CustomFields,
  PaymentInstructions,
  Field,
  formatBytes,
  makeL,
  Select,
  shrinkImage,
  SummaryRow,
  TextInput,
} from "@/components/visa/form-parts";
import { countryNames, dialOptions, findCountry } from "@/lib/countries";
import { CUSTOM_FILE_TYPES, customIn, getFormDef, isRequired, shown, type FormLayout } from "@/lib/forms";
import { feesTotal, routeFee, ROUTE_FEES_NOTE, routeFeesVars, type Pricing } from "@/lib/pricing";
import {
  applicantCounts,
  asksEmployment,
  DOC_ACCEPT,
  DOC_TYPES,
  destinationNames,
  destinations,
  employmentFields,
  employmentStatuses,
  genders,
  MAX_UPLOAD_BYTES,
  usd,
  visaDocuments,
  visaTypes,
} from "@/lib/visa";

const STORAGE_KEY = "bcg-visa-application";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Values = Record<string, string>;
type DocKey = (typeof visaDocuments)[number]["key"];

// Each step's fields come from the visa form's sections in Admin → Forms; payment has no section.
const steps = [
  { label: "Personal information", icon: "user", section: "personal" },
  // Employment is skipped for a student visa (see asksEmployment).
  { label: "Travel information", icon: "plane", section: "travel" },
  { label: "Supporting documents", icon: "upload", section: "documents" },
  { label: "Review application", icon: "file", section: "review" },
  { label: "Payment", icon: "card", section: undefined },
] as const;

const builtIn = getFormDef("visa")!.fields;
const stepFields = steps.map((s) => builtIn.filter((f) => f.section === s.section).map((f) => f.key));

function emptyValues(country: string, job: string, layout: FormLayout, paymentMethod: string): Values {
  const v: Values = { visaType: visaTypes[0], applicants: "1", paymentMethod, country, job, phoneCountry: "" };
  for (const f of builtIn) if (!f.key.startsWith("doc_") && !(f.key in v)) v[f.key] = "";
  for (const c of layout.custom) if (c.type !== "file") v[c.key] = "";
  return v;
}

function stepOf(field: string, layout: FormLayout) {
  if (field === "phoneCountry") return 0;
  const section = builtIn.find((f) => f.key === field)?.section ?? layout.custom.find((c) => c.key === field)?.section;
  const i = steps.findIndex((s) => s.section === section);
  return i >= 0 ? i : 0;
}

const today = () => new Date().toISOString().slice(0, 10);

export function VisaForm({
  labels,
  layout,
  pricing,
  initialCountry,
  initialRole,
}: {
  labels: Record<string, string>;
  layout: FormLayout;
  pricing: Pricing;
  initialCountry?: string;
  initialRole?: string;
}) {
  const L = makeL(labels);
  const startCountry = initialCountry && destinations[initialCountry] ? initialCountry : destinationNames[0];
  const startJob = initialRole && destinations[startCountry].includes(initialRole) ? initialRole : destinations[startCountry][0];

  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(() => emptyValues(startCountry, startJob, layout, pricing.paymentMethods[0]?.id ?? ""));
  const [docs, setDocs] = useState<Partial<Record<DocKey, File>>>({});
  const [extraFiles, setExtraFiles] = useState<Record<string, File | undefined>>({});
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const [state, formAction, pending] = useActionState<FormState, FormData>(submitVisaApplication, { ok: false, message: "" });
  const topRef = useRef<HTMLDivElement>(null);

  // Restore progress saved with "Save & exit" (documents are never saved in the browser).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as Values;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser storage after hydration
      setValues((v) => {
        const next = { ...v };
        for (const k of Object.keys(v)) if (typeof parsed[k] === "string") next[k] = parsed[k];
        if (!destinations[next.country]) next.country = v.country;
        if (!destinations[next.country].includes(next.job)) next.job = destinations[next.country][0];
        // A link to a specific destination or role wins over the saved choice.
        if (initialCountry && destinations[initialCountry]) next.country = startCountry;
        if (initialRole) next.job = startJob;
        return next;
      });
      setNotice(L("We restored the details you saved earlier."));
    } catch {
      // Storage unavailable or corrupted: start fresh.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  // Jump to the first step with a problem when the server rejects the application.
  const serverErrors = useMemo(() => state.errors ?? {}, [state.errors]);
  useEffect(() => {
    const fields = Object.keys(serverErrors);
    if (fields.length === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reacting to the server's answer
    setStep(Math.min(...fields.map((f) => stepOf(f, layout))));
  }, [serverErrors, layout]);

  useEffect(() => {
    if (!state.ok) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, [state.ok]);

  const errors = { ...serverErrors, ...clientErrors };
  const docSize = [...Object.values(docs), ...Object.values(extraFiles)].reduce((sum, f) => sum + (f?.size ?? 0), 0);
  const roles = destinations[values.country] ?? [];
  const visaFeesTotal = feesTotal(pricing.visaFees);
  const ticketFee = routeFee(pricing.routeFees, values.originCountry, values.country);
  const total = ticketFee ? visaFeesTotal + ticketFee : null;

  const show = (key: string) => shown(layout, key);
  const req = (key: string) => isRequired(layout, key);
  const employed = asksEmployment(values.visaType);

  const set = (key: string) => (value: string) => {
    setValues((v) => (key === "country" ? { ...v, country: value, job: destinations[value]?.[0] ?? "" } : { ...v, [key]: value }));
    setClientErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const countryOptions = countryNames.map((c) => ({ value: c, label: L(c) }));
  const tr = (list: string[]) => list.map((o) => ({ value: o, label: L(o) }));

  function check(i: number) {
    const e: Record<string, string> = {};
    for (const k of stepFields[i]) {
      if (!req(k) || (!employed && employmentFields.includes(k))) continue;
      if (k.startsWith("doc_")) {
        if (!docs[k.slice(4) as DocKey]) e[k] = L("Please upload this document.");
      } else if (!values[k]?.trim() || (k === "phone" && !values.phoneCountry)) {
        e[k] = L("This field is required.");
      }
    }
    for (const c of customIn(layout, steps[i].section)) {
      if (c.type === "file" ? !extraFiles[c.key] : !values[c.key]?.trim()) {
        if (c.required) e[c.key] = L(c.type === "file" ? "Please upload this document." : "This field is required.");
      } else if (c.type === "email" && !EMAIL_RE.test(values[c.key])) {
        e[c.key] = L("Enter a valid email address.");
      }
    }
    if (i === 0) {
      if (values.email && !EMAIL_RE.test(values.email)) e.email = L("Enter a valid email address.");
      if (values.expiryDate && values.expiryDate <= today()) e.expiryDate = L("Your passport has expired.");
      else if (values.issueDate && values.expiryDate && values.expiryDate <= values.issueDate) {
        e.expiryDate = L("The expiry date must be after the issue date.");
      }
    }
    if (i === 2 && docSize > MAX_UPLOAD_BYTES) {
      const key = [...visaDocuments.map((d) => `doc_${d.key}`), ...customIn(layout, "documents").map((c) => c.key)].find(show) ?? "doc_passport";
      e[key] ??= L("Your documents are too large together. Please upload files under 4 MB in total.");
    }
    setClientErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      // Bring the first problem into view once the error messages have rendered.
      requestAnimationFrame(() => {
        const el = document.getElementById(first);
        el?.focus({ preventScroll: true });
        (el?.closest("li, div") ?? el)?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
    return !first;
  }

  function go(i: number) {
    setStep(i);
    setNotice("");
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function next() {
    if (!check(step)) return;
    if (step < steps.length - 1) return go(step + 1);
    for (let i = 0; i < steps.length - 1; i++) {
      if (!check(i)) return go(i);
    }
    const fd = new FormData();
    for (const [k, v] of Object.entries(values)) {
      if (!employed && employmentFields.includes(k)) continue;
      if (!show(k === "phoneCountry" ? "phone" : k)) continue;
      fd.set(k, v);
    }
    for (const [k, f] of Object.entries(docs)) if (f && show(`doc_${k}`)) fd.set(`doc_${k}`, f);
    for (const [k, f] of Object.entries(extraFiles)) if (f) fd.set(k, f);
    startTransition(() => formAction(fd));
  }

  function saveAndExit() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      setNotice(L("Your progress has been saved in this browser. Documents need to be added again when you return."));
    } catch {
      setNotice(L("We couldn't save your progress in this browser."));
    }
  }

  async function pickDoc(key: DocKey, file: File | undefined) {
    const field = `doc_${key}`;
    setClientErrors((e) => {
      const next = { ...e };
      delete next[field];
      return next;
    });
    if (!file) {
      setDocs((d) => ({ ...d, [key]: undefined }));
      return;
    }
    if (!DOC_TYPES.includes(file.type)) {
      setClientErrors((e) => ({ ...e, [field]: L("Upload a PDF, JPG, PNG or WebP file.") }));
      return;
    }
    const small = await shrinkImage(file);
    setDocs((d) => ({ ...d, [key]: small }));
  }

  async function pickExtra(key: string, file: File | undefined) {
    setClientErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
    if (file && !CUSTOM_FILE_TYPES.includes(file.type)) {
      setClientErrors((e) => ({ ...e, [key]: L("Upload a PDF, Word, JPG, PNG or WebP file.") }));
      return;
    }
    const small = file ? await shrinkImage(file) : undefined;
    setExtraFiles((f) => ({ ...f, [key]: small }));
  }

  /** Review rows for the custom fields of one section. */
  const customRows = (section: string) =>
    customIn(layout, section)
      .filter((c) => c.type !== "section")
      .map((c) => (
      <SummaryRow
        key={c.key}
        label={L(c.label)}
        value={(c.type === "file" ? extraFiles[c.key]?.name : c.type === "select" ? L(values[c.key]) : values[c.key]) || L("Not provided")}
      />
    ));

  const customFor = (section: string) => (
    <CustomFields
      fields={customIn(layout, section)}
      values={values}
      onChange={set}
      files={extraFiles}
      onFile={(key, f) => void pickExtra(key, f)}
      errors={errors}
      L={L}
    />
  );

  if (state.ok) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div role="status" className="rounded-3xl bg-white p-8 text-center ring-1 ring-slate-200 sm:p-12">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Icon name="check" className="h-8 w-8" />
          </span>
          <h2 className="mt-5 text-2xl font-bold text-brand-dark">{L("Application received")}</h2>
          <p className="mt-3 text-slate-600">{state.message}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/jobs" className="rounded-full bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark">
              {L("Explore more roles")}
            </Link>
            <Link href="/air-ticket-booking" className="rounded-full px-6 py-3 font-semibold text-brand ring-1 ring-brand hover:bg-brand/5">
              {L("Book your air ticket")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={topRef} className="mx-auto max-w-7xl scroll-mt-28 px-4 pb-16 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4 pt-10 sm:pt-14">
        <div>
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-brand">
            <span className="h-px w-8 bg-brand" aria-hidden="true" />
            {L("Your next move")}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-brand-dark sm:text-5xl">{L("Visa application")}</h1>
          <p className="mt-3 text-slate-600">{L("Fill in your details and build your application with confidence.")}</p>
        </div>
        <button
          type="button"
          onClick={saveAndExit}
          className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-brand-dark ring-1 ring-slate-300 hover:ring-brand"
        >
          <Icon name="file" className="h-4 w-4" />
          {L("Save & exit")}
        </button>
      </div>

      {notice && (
        <p role="status" className="mt-4 rounded-lg bg-brand/5 px-4 py-3 text-sm text-brand-dark ring-1 ring-brand/20">
          {notice}
        </p>
      )}

      <ol className="mt-8 grid grid-cols-5 gap-2 rounded-2xl bg-white p-4 ring-1 ring-slate-200 sm:p-6">
        {steps.map((s, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <li key={s.label} className="relative flex flex-col items-center text-center">
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className={`absolute right-1/2 top-4 h-0.5 w-full -translate-y-1/2 sm:top-5 ${i <= step ? "bg-brand" : "bg-slate-200"}`}
                />
              )}
              <button
                type="button"
                disabled={!done}
                onClick={() => go(i)}
                aria-current={current ? "step" : undefined}
                aria-label={`${i + 1}. ${L(s.label)}`}
                className={`relative flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white sm:h-10 sm:w-10 ${
                  current ? "bg-brand text-white" : done ? "bg-brand/10 text-brand hover:bg-brand/20" : "bg-slate-100 text-slate-400"
                }`}
              >
                <Icon name={done ? "check" : s.icon} className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <span className={`mt-2 hidden text-xs sm:block ${current ? "font-semibold text-brand-dark" : "text-slate-500"}`}>
                {i + 1}. {L(s.label)}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-center text-sm font-semibold text-brand-dark sm:hidden">
        {L("Step {n} of {total}: {label}", { n: step + 1, total: steps.length, label: L(steps[step].label) })}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            next();
          }}
          className="min-w-0 rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-8"
        >
          {step === 0 && (
            <div className="space-y-8">
              <CardHeading
                icon={<Icon name="user" className="h-5 w-5" />}
                title={L("Personal information")}
                text={L("Please provide your details as they appear on your passport.")}
              />
              <fieldset>
                <legend className="text-sm font-bold text-brand-dark">{L("Full name")}</legend>
                <div className="mt-3 grid gap-4 sm:grid-cols-3">
                  <F id="firstName" label={L("First name")} errors={errors} layout={layout}>
                    <TextInput id="firstName" value={values.firstName} onChange={set("firstName")} error={errors.firstName} placeholder={L("First name")} autoComplete="given-name" />
                  </F>
                  <F id="middleName" label={L("Middle name")} errors={errors} layout={layout}>
                    <TextInput id="middleName" value={values.middleName} onChange={set("middleName")} placeholder={L("Middle name")} autoComplete="additional-name" />
                  </F>
                  <F id="lastName" label={L("Last name")} errors={errors} layout={layout}>
                    <TextInput id="lastName" value={values.lastName} onChange={set("lastName")} error={errors.lastName} placeholder={L("Last name")} autoComplete="family-name" />
                  </F>
                </div>
              </fieldset>
              <div className="grid gap-4 sm:grid-cols-3">
                <F id="birthDate" label={L("Date of birth")} errors={errors} layout={layout}>
                  <TextInput id="birthDate" type="date" max={today()} value={values.birthDate} onChange={set("birthDate")} error={errors.birthDate} autoComplete="bday" />
                </F>
                <F id="gender" label={L("Gender")} errors={errors} layout={layout}>
                  <Select id="gender" value={values.gender} onChange={set("gender")} error={errors.gender} placeholder={L("Select gender")} options={tr(genders)} />
                </F>
                <F id="nationality" label={L("Nationality")} errors={errors} layout={layout}>
                  <Select id="nationality" value={values.nationality} onChange={set("nationality")} error={errors.nationality} placeholder={L("Select nationality")} options={countryOptions} />
                </F>
                <F id="passport" label={L("Passport number")} errors={errors} layout={layout}>
                  <TextInput id="passport" value={values.passport} onChange={set("passport")} error={errors.passport} placeholder={L("Enter passport number")} />
                </F>
                <F id="issueDate" label={L("Date of issue")} errors={errors} layout={layout}>
                  <TextInput id="issueDate" type="date" max={today()} value={values.issueDate} onChange={set("issueDate")} error={errors.issueDate} />
                </F>
                <F id="expiryDate" label={L("Date of expiry")} errors={errors} layout={layout}>
                  <TextInput id="expiryDate" type="date" value={values.expiryDate} onChange={set("expiryDate")} error={errors.expiryDate} />
                </F>
                <F id="issuePlace" label={L("Place of issue")} errors={errors} layout={layout}>
                  <TextInput id="issuePlace" value={values.issuePlace} onChange={set("issuePlace")} error={errors.issuePlace} placeholder={L("City or country")} />
                </F>
                <F id="authority" label={L("Issuing authority")} errors={errors} layout={layout} className="sm:col-span-2">
                  <TextInput id="authority" value={values.authority} onChange={set("authority")} error={errors.authority} placeholder={L("e.g. Department of Immigration")} />
                </F>
              </div>

              <fieldset>
                <legend className="text-sm font-bold text-brand-dark">{L("Contact details")}</legend>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <F id="email" label={L("Email address")} errors={errors} layout={layout}>
                    <TextInput id="email" type="email" value={values.email} onChange={set("email")} error={errors.email} placeholder="name@example.com" autoComplete="email" />
                  </F>
                  {show("phone") && (
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {L("Phone number")}
                      {req("phone") && <span className="text-brand"> *</span>}
                    </p>
                    <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-2">
                      <label htmlFor="phoneCountry" className="sr-only">{L("Country code")}</label>
                      <Select id="phoneCountry" value={values.phoneCountry} onChange={set("phoneCountry")} error={errors.phoneCountry} placeholder={L("Code")} options={dialOptions} />
                      <label htmlFor="phone" className="sr-only">{L("Phone number")}</label>
                      <TextInput id="phone" type="tel" value={values.phone} onChange={set("phone")} error={errors.phone} placeholder={L("Enter phone number")} autoComplete="tel-national" />
                    </div>
                    {(errors.phoneCountry || errors.phone) && (
                      <p className="mt-1.5 text-sm text-red-600">{errors.phoneCountry || errors.phone}</p>
                    )}
                  </div>
                  )}
                </div>
              </fieldset>

              {["address1", "address2", "city", "province", "postal", "homeCountry"].some(show) && (
              <fieldset>
                <legend className="text-sm font-bold text-brand-dark">{L("Current address")}</legend>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <F id="address1" label={L("Address line 1")} errors={errors} layout={layout}>
                    <TextInput id="address1" value={values.address1} onChange={set("address1")} error={errors.address1} autoComplete="address-line1" />
                  </F>
                  <F id="address2" label={L("Address line 2")} errors={errors} layout={layout}>
                    <TextInput id="address2" value={values.address2} onChange={set("address2")} autoComplete="address-line2" />
                  </F>
                  <F id="city" label={L("City")} errors={errors} layout={layout}>
                    <TextInput id="city" value={values.city} onChange={set("city")} error={errors.city} autoComplete="address-level2" />
                  </F>
                  <F id="province" label={L("State / Province")} errors={errors} layout={layout}>
                    <TextInput id="province" value={values.province} onChange={set("province")} error={errors.province} autoComplete="address-level1" />
                  </F>
                  <F id="postal" label={L("Postal / Zip code")} errors={errors} layout={layout}>
                    <TextInput id="postal" value={values.postal} onChange={set("postal")} error={errors.postal} autoComplete="postal-code" />
                  </F>
                  <F id="homeCountry" label={L("Country")} errors={errors} layout={layout}>
                    <Select id="homeCountry" value={values.homeCountry} onChange={set("homeCountry")} error={errors.homeCountry} placeholder={L("Select country")} options={countryOptions} />
                  </F>
                </div>
              </fieldset>
              )}
              {customFor("personal")}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <CardHeading
                icon={<Icon name="plane" className="h-5 w-5" />}
                title={L("Travel information")}
                text={L("Tell us where you want to go and the role you’re moving toward.")}
              />
              <div className="rounded-xl bg-muted p-4 text-sm">
                <p className="font-semibold text-brand-dark">{L("Choose a destination and role")}</p>
                <p className="mt-1 text-slate-600">{L("Your available roles update automatically based on the destination you select.")}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <F id="originCountry" label={L("Departure country")} errors={errors} layout={layout}>
                  <Select id="originCountry" value={values.originCountry} onChange={set("originCountry")} error={errors.originCountry} placeholder={L("Select departure country")} options={countryOptions} />
                </F>
                <F id="country" label={L("Destination country")} errors={errors} layout={layout}>
                  <Select id="country" value={values.country} onChange={set("country")} error={errors.country} options={tr(destinationNames)} />
                </F>
                <F id="job" label={L("Available job role")} errors={errors} layout={layout}>
                  <Select id="job" value={values.job} onChange={set("job")} error={errors.job} options={tr(roles)} />
                </F>
                <F id="visaType" label={L("Visa type")} errors={errors} layout={layout}>
                  <Select id="visaType" value={values.visaType} onChange={set("visaType")} error={errors.visaType} options={tr(visaTypes)} />
                </F>
                <F id="startDate" label={L("Preferred start date")} errors={errors} layout={layout}>
                  <TextInput id="startDate" type="date" min={today()} value={values.startDate} onChange={set("startDate")} error={errors.startDate} />
                </F>
                <F id="applicants" label={L("Number of applicants")} errors={errors} layout={layout}>
                  <Select id="applicants" value={values.applicants} onChange={set("applicants")} error={errors.applicants} options={applicantCounts} />
                </F>
              </div>

              {employed && employmentFields.some(show) && (
                <fieldset>
                  <legend className="text-sm font-bold text-brand-dark">{L("Employment information")}</legend>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <F id="employment" label={L("Current employment status")} errors={errors} layout={layout}>
                      <Select id="employment" value={values.employment} onChange={set("employment")} error={errors.employment} placeholder={L("Select employment status")} options={tr(employmentStatuses)} />
                    </F>
                    <F id="occupation" label={L("Occupation")} errors={errors} layout={layout}>
                      <TextInput id="occupation" value={values.occupation} onChange={set("occupation")} error={errors.occupation} placeholder={L("Enter your occupation")} />
                    </F>
                    <F id="employer" label={L("Employer / Company name")} errors={errors} layout={layout}>
                      <TextInput id="employer" value={values.employer} onChange={set("employer")} placeholder={L("Enter employer name")} autoComplete="organization" />
                    </F>
                    <F id="income" label={L("Monthly income (USD)")} errors={errors} layout={layout}>
                      <TextInput id="income" type="number" min="0" value={values.income} onChange={set("income")} placeholder={L("Enter monthly income")} />
                    </F>
                  </div>
                </fieldset>
              )}
              {customFor("travel")}

              <div className="rounded-xl border border-accent/60 bg-accent/10 p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">{L("Air ticket booking fee")}</span>
                  <strong className="text-lg text-brand-dark">{ticketFee ? usd(ticketFee) : L("Select an origin")}</strong>
                </div>
                <p className="mt-2 text-sm text-slate-700">
                  {L(
                    "This route-based booking service fee is for {from} to {to}. It excludes the airline ticket price and updates when either country changes.",
                    { from: values.originCountry ? L(values.originCountry) : L("your departure country"), to: L(values.country) },
                  )}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {L(ROUTE_FEES_NOTE, routeFeesVars(pricing.routeFees))}
                </p>
              </div>

              <dl className="grid gap-3 rounded-xl ring-1 ring-slate-200 sm:grid-cols-3">
                {[
                  [L("Selected destination"), L(values.country)],
                  [L("Selected role"), L(values.job)],
                  [L("Typical processing"), L(pricing.processingTime)],
                ].map(([k, v]) => (
                  <div key={k} className="p-4">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">{k}</dt>
                    <dd className="mt-1 font-semibold text-brand-dark">{v}</dd>
                  </div>
                ))}
              </dl>

              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-brand-dark">
                  <Icon name="briefcase" className="h-4 w-4 text-brand" />
                  {L("Roles available in {country}", { country: L(values.country) })}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {roles.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => set("job")(r)}
                      aria-pressed={values.job === r}
                      className={`rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 ${
                        values.job === r ? "bg-brand text-white ring-brand" : "bg-white text-slate-700 ring-slate-200 hover:ring-brand"
                      }`}
                    >
                      {L(r)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <CardHeading
                icon={<Icon name="upload" className="h-5 w-5" />}
                title={L("Supporting documents")}
                text={L("Upload clear copies so our team can review your route with confidence.")}
              />
              <ul className="grid gap-4 sm:grid-cols-2">
                {visaDocuments.filter((d) => show(`doc_${d.key}`)).map((d) => {
                  const id = `doc_${d.key}`;
                  const file = docs[d.key];
                  const error = errors[id];
                  return (
                    <li
                      key={d.key}
                      className={`rounded-xl border-2 border-dashed p-5 ${error ? "border-red-300 bg-red-50/40" : file ? "border-brand/40 bg-brand/5" : "border-slate-200"}`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon name={file ? "check" : "file"} className={`h-6 w-6 shrink-0 ${file ? "text-brand" : "text-slate-400"}`} />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-brand-dark">
                            {L(d.label)}
                            {req(id) ? <span className="text-brand"> *</span> : <span className="font-normal text-slate-500"> ({L("optional")})</span>}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-slate-500">
                            {file ? `${file.name} · ${formatBytes(file.size)}` : L("PDF, JPG or PNG")}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <label
                          htmlFor={id}
                          className="cursor-pointer rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-brand ring-1 ring-brand/40 focus-within:ring-2 focus-within:ring-brand hover:bg-brand/5"
                        >
                          {file ? L("Replace file") : L("Choose file")}
                          <input
                            id={id}
                            type="file"
                            accept={DOC_ACCEPT}
                            className="sr-only"
                            aria-invalid={error ? true : undefined}
                            aria-describedby={error ? `${id}-error` : undefined}
                            onChange={(e) => {
                              void pickDoc(d.key, e.target.files?.[0]);
                              e.target.value = "";
                            }}
                          />
                        </label>
                        {file && (
                          <button type="button" onClick={() => pickDoc(d.key, undefined)} className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:text-red-600">
                            {L("Remove")}
                          </button>
                        )}
                      </div>
                      {error && (
                        <p id={`${id}-error`} className="mt-2 text-sm text-red-600">
                          {error}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
              {customFor("documents")}
              <p className="flex items-start gap-2 text-sm text-slate-600">
                <Icon name="shield" className="h-5 w-5 shrink-0 text-brand" />
                <span>
                  {L("Files are stored securely and only used to prepare your application.")}{" "}
                  {L("Photos are resized automatically. Total size: {size} of 4 MB.", { size: formatBytes(docSize) })}
                </span>
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <CardHeading
                icon={<Icon name="file" className="h-5 w-5" />}
                title={L("Review application")}
                text={L("Check the details below before moving to payment.")}
              />
              <ReviewBlock title={L("Applicant details")} onEdit={() => go(0)} editLabel={L("Edit")}>
                <SummaryRow label={L("Full name")} value={[values.firstName, values.middleName, values.lastName].filter(Boolean).join(" ")} />
                {show("birthDate") && <SummaryRow label={L("Date of birth")} value={values.birthDate} />}
                {show("nationality") && <SummaryRow label={L("Nationality")} value={L(values.nationality)} />}
                {show("passport") && <SummaryRow label={L("Passport number")} value={values.passport} />}
                {show("expiryDate") && <SummaryRow label={L("Passport expires")} value={values.expiryDate} />}
                {show("email") && <SummaryRow label={L("Email address")} value={values.email} />}
                {show("phone") && <SummaryRow label={L("Phone number")} value={`${findCountry(values.phoneCountry)?.dial ?? ""} ${values.phone}`} />}
                {employed && show("employment") && <SummaryRow label={L("Employment status")} value={L(values.employment)} />}
                {employed && show("occupation") && <SummaryRow label={L("Occupation")} value={values.occupation} />}
                {customRows("personal")}
              </ReviewBlock>
              <ReviewBlock title={L("Travel plan")} onEdit={() => go(1)} editLabel={L("Edit")}>
                <SummaryRow label={L("From")} value={L(values.originCountry)} />
                <SummaryRow label={L("Destination")} value={L(values.country)} />
                <SummaryRow label={L("Role")} value={L(values.job)} />
                <SummaryRow label={L("Visa type")} value={L(values.visaType)} />
                {show("startDate") && <SummaryRow label={L("Preferred start date")} value={values.startDate || L("Not provided")} />}
                {show("applicants") && <SummaryRow label={L("Applicants")} value={values.applicants} />}
                {customRows("travel")}
              </ReviewBlock>
              <ReviewBlock title={L("Documents")} onEdit={() => go(2)} editLabel={L("Edit")}>
                {visaDocuments.filter((d) => show(`doc_${d.key}`)).map((d) => (
                  <SummaryRow key={d.key} label={L(d.label)} value={docs[d.key]?.name ?? L("Not provided")} />
                ))}
                {customRows("documents")}
              </ReviewBlock>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <CardHeading
                icon={<Icon name="card" className="h-5 w-5" />}
                title={L("Payment")}
                text={L("Choose how you'd like to pay your visa application and air ticket booking fees.")}
              />
              <fieldset>
                <legend className="sr-only">{L("Payment method")}</legend>
                <div className="grid gap-3">
                  {pricing.paymentMethods.map((m) => {
                    const selected = values.paymentMethod === m.id;
                    return (
                      <label
                        key={m.id}
                        className={`flex cursor-pointer items-center gap-4 rounded-xl p-4 ring-1 focus-within:ring-2 focus-within:ring-brand ${
                          selected ? "bg-brand/5 ring-brand" : "bg-white ring-slate-200 hover:ring-brand/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={m.id}
                          checked={selected}
                          onChange={() => set("paymentMethod")(m.id)}
                          className="h-4 w-4 accent-[var(--brand)]"
                        />
                        <span className="flex-1">
                          <span className="block font-semibold text-brand-dark">{L(m.label)}</span>
                          {m.note && <span className="block text-sm text-slate-500">{L(m.note)}</span>}
                        </span>
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold tracking-wider text-slate-600">{m.mark}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <div className="flex items-start gap-3 rounded-xl bg-muted p-4 text-sm text-slate-700">
                <Icon name="shield" className="h-5 w-5 shrink-0 text-brand" />
                <p>
                  {L(
                    "No payment is taken on this page. After our team reviews your application, we'll email you a secure link to pay {total} with your chosen method.",
                    { total: total ? usd(total) : "" },
                  )}
                </p>
              </div>
              <PaymentInstructions text={pricing.paymentInstructions} L={L} />
            </div>
          )}

          {state.message && !state.ok && (
            <p role="alert" className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {state.message}
            </p>
          )}

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={() => go(step - 1)}
              disabled={step === 0}
              className="rounded-full px-5 py-2.5 font-semibold text-slate-700 ring-1 ring-slate-300 hover:ring-brand disabled:invisible"
            >
              ← {L("Back")}
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
            >
              {pending
                ? L("Sending…")
                : step === steps.length - 1
                  ? L("Submit application")
                  : step === steps.length - 2
                    ? L("Continue to payment")
                    : L("Save & continue")}{" "}
              →
            </button>
          </div>
        </form>

        <aside className="space-y-4 lg:sticky lg:top-28">
          <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
            <h2 className="flex items-center gap-2 font-bold text-brand-dark">
              <Icon name="file" className="h-5 w-5 text-brand" />
              {L("Application summary")}
            </h2>
            <dl className="mt-3 divide-y divide-slate-100">
              <SummaryRow label={L("Visa type")} value={L(values.visaType)} />
              <SummaryRow label={L("Destination country")} value={L(values.country)} />
              <SummaryRow label={L("Preferred role")} value={L(values.job)} />
              <SummaryRow label={L("Processing time")} value={L(pricing.processingTime)} />
              {show("applicants") && <SummaryRow label={L("Number of applicants")} value={values.applicants} />}
            </dl>
            <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500">{L("Fee breakdown")}</p>
            <dl className="mt-1 divide-y divide-slate-100">
              {pricing.visaFees.map((f) => (
                <SummaryRow key={f.label} label={L(f.label)} value={usd(f.amount)} />
              ))}
              <SummaryRow label={L("Air ticket booking fee")} value={ticketFee ? usd(ticketFee) : L("Select origin")} />
              <SummaryRow label={L("Total amount")} value={total ? usd(total) : L("Select origin")} strong />
            </dl>
            <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <Icon name="shield" className="h-4 w-4 text-brand" />
              {L("Paid later via a secure link from our team")}
            </p>
          </div>
          <div className="rounded-2xl bg-brand-dark p-6 text-white">
            <h2 className="font-bold">{L("Need a hand?")}</h2>
            <p className="mt-1 text-sm text-white/80">{L("Our team can help you prepare the right documents.")}</p>
            <Link href="/contact-us" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
              {L("Talk to an advisor")} →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

/** A built-in field, hidden or required as set in Admin → Forms. */
function F({
  id,
  label,
  errors,
  layout,
  className,
  children,
}: {
  id: string;
  label: string;
  errors: Record<string, string>;
  layout: FormLayout;
  className?: string;
  children: React.ReactNode;
}) {
  if (!shown(layout, id)) return null;
  return (
    <Field id={id} label={label} required={isRequired(layout, id)} error={errors[id]} className={className}>
      {children}
    </Field>
  );
}

function ReviewBlock({ title, onEdit, editLabel, children }: { title: string; onEdit: () => void; editLabel: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl p-5 ring-1 ring-slate-200">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-bold text-brand-dark">{title}</h3>
        <button type="button" onClick={onEdit} className="text-sm font-semibold text-brand hover:underline">
          {editLabel}
        </button>
      </div>
      <dl className="mt-2 divide-y divide-slate-100">{children}</dl>
    </section>
  );
}
