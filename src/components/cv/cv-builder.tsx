"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { redeemCvUnlockCode, requestCvDownload, submitCv, type FormState } from "@/app/actions";
import { AiAssist, DictateButton } from "@/components/cv/assist";
import { CvLabelsProvider, labelFn } from "@/components/cv/cv-labels";
import { CvPreview } from "@/components/cv/cv-preview";
import type { CvLabels } from "@/lib/cv-strings";
import {
  cvAccents,
  cvTemplates,
  emptyCv,
  exampleCv,
  languageLevels,
  newId,
  type Certification,
  type CvData,
  type Education,
  type Experience,
  type Language,
} from "@/lib/cv";
import type { Pricing } from "@/lib/pricing";

const STORAGE_KEY = "bridge-cv-draft";
const UNLOCK_KEY = "bridge-cv-unlock";

const tabs = [
  { id: "personal", label: "Personal" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "extras", label: "Languages & certificates" },
  { id: "design", label: "Design" },
] as const;
type Tab = (typeof tabs)[number]["id"];

const input =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";
const label = "block text-xs font-semibold text-slate-700";

function loadDraft(): CvData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...emptyCv, ...JSON.parse(raw) };
  } catch {
    // Storage unavailable or corrupt: start fresh.
  }
  return emptyCv;
}

function loadUnlock() {
  try {
    return localStorage.getItem(UNLOCK_KEY) ?? "";
  } catch {
    return "";
  }
}

function Field({
  id,
  text,
  value,
  onChange,
  type = "text",
  placeholder,
  textarea,
  hint,
}: {
  id: string;
  text: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={label}>{text}</label>
      {textarea ? (
        <textarea id={id} rows={4} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={input} />
      ) : (
        <input id={id} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={input} />
      )}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function ItemCard({
  L,
  title,
  onRemove,
  onUp,
  onDown,
  children,
}: {
  title: string;
  onRemove: () => void;
  onUp?: () => void;
  onDown?: () => void;
  children: React.ReactNode;
  L: ReturnType<typeof labelFn>;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="truncate text-sm font-bold text-brand-dark">{title}</p>
        <div className="flex shrink-0 gap-1 text-xs">
          {onUp && <button type="button" onClick={onUp} className="rounded px-2 py-1 text-slate-600 hover:bg-slate-100" aria-label={L("Move up")}>↑</button>}
          {onDown && <button type="button" onClick={onDown} className="rounded px-2 py-1 text-slate-600 hover:bg-slate-100" aria-label={L("Move down")}>↓</button>}
          <button type="button" onClick={onRemove} className="rounded px-2 py-1 font-semibold text-red-600 hover:bg-red-50">{L("Remove")}</button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function move<T>(list: T[], index: number, delta: number) {
  const next = [...list];
  const target = index + delta;
  if (target < 0 || target >= next.length) return list;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function CvBuilder({
  aiEnabled = false,
  labels = {},
  pricing,
}: {
  aiEnabled?: boolean;
  labels?: CvLabels;
  pricing: Pick<Pricing, "cvDownloadFee" | "paymentMethods" | "paymentInstructions">;
}) {
  const L = labelFn(labels);
  const price = `USD ${pricing.cvDownloadFee}`;
  const paymentMethods = pricing.paymentMethods;
  const [cv, setCv] = useState<CvData>(loadDraft);
  const [tab, setTab] = useState<Tab>("personal");
  const [skillDraft, setSkillDraft] = useState("");
  const [consent, setConsent] = useState(false);
  const [sendState, setSendState] = useState<FormState | null>(null);
  const [sending, startSending] = useTransition();
  const [mobilePreview, setMobilePreview] = useState(false);
  const [unlocked, setUnlocked] = useState(() => !!loadUnlock());
  const [buyEmail, setBuyEmail] = useState<string | null>(null);
  const [buyMethod, setBuyMethod] = useState(paymentMethods[0]?.id ?? "");
  const [buyState, setBuyState] = useState<FormState | null>(null);
  const [code, setCode] = useState("");
  const [codeState, setCodeState] = useState<FormState | null>(null);
  const [paying, startPaying] = useTransition();
  const [redeeming, startRedeeming] = useTransition();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cv));
    } catch {
      // Ignore: draft just won't persist.
    }
  }, [cv]);

  const setPersonal = (key: keyof CvData["personal"]) => (value: string) =>
    setCv((c) => ({ ...c, personal: { ...c.personal, [key]: value } }));

  function updateList<K extends "experience" | "education" | "languages" | "certifications">(
    key: K,
    updater: (list: CvData[K]) => CvData[K],
  ) {
    setCv((c) => ({ ...c, [key]: updater(c[key]) }));
  }

  function patch<T extends { id: string }>(list: T[], id: string, values: Partial<T>) {
    return list.map((item) => (item.id === id ? { ...item, ...values } : item));
  }

  function addSkill() {
    const s = skillDraft.trim();
    if (s && !cv.skills.includes(s)) setCv((c) => ({ ...c, skills: [...c.skills, s] }));
    setSkillDraft("");
  }

  function requestDownload() {
    setBuyState(null);
    startPaying(async () => {
      setBuyState(await requestCvDownload(cv, buyEmail ?? cv.personal.email, buyMethod));
    });
  }

  function redeem() {
    setCodeState(null);
    startRedeeming(async () => {
      const result = await redeemCvUnlockCode(code);
      setCodeState(result);
      if (!result.ok) return;
      try {
        localStorage.setItem(UNLOCK_KEY, code.trim());
      } catch {
        // Ignore: the download stays unlocked until the page is reloaded.
      }
      setUnlocked(true);
    });
  }

  function send() {
    setSendState(null);
    startSending(async () => {
      setSendState(await submitCv(cv, consent));
    });
  }

  return (
    <CvLabelsProvider value={labels}>
    <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:px-8 print:block print:p-0">
      {/* Editor */}
      <div className={`print:hidden ${mobilePreview ? "hidden lg:block" : ""}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-brand-dark">{L("CV maker")}</h1>
          <div className="flex gap-2 text-sm">
            <button type="button" onClick={() => setCv(exampleCv)} className="rounded-full border border-slate-300 px-4 py-1.5 font-semibold text-slate-700 hover:border-brand hover:text-brand">
              {L("Load example")}
            </button>
            <button type="button" onClick={() => setCv(emptyCv)} className="rounded-full border border-slate-300 px-4 py-1.5 font-semibold text-slate-700 hover:border-red-400 hover:text-red-600">
              {L("Clear")}
            </button>
          </div>
        </div>
        <p className="mt-1 text-sm text-slate-500">{L("Your draft saves automatically in this browser.")}</p>

        <div role="tablist" aria-label={L("CV sections")} className="mt-6 flex gap-1 overflow-x-auto border-b border-slate-200">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
                tab === t.id ? "border-brand text-brand" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {L(t.label)}
            </button>
          ))}
        </div>

        <div role="tabpanel" className="mt-6 space-y-4">
          {tab === "personal" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="name" text={L("Full name")} value={cv.personal.name} onChange={setPersonal("name")} />
              <Field id="title" text={L("Job title")} value={cv.personal.title} onChange={setPersonal("title")} placeholder={L("e.g. Registered Nurse")} />
              <Field id="email" text={L("Email")} type="email" value={cv.personal.email} onChange={setPersonal("email")} />
              <Field id="phone" text={L("Phone")} type="tel" value={cv.personal.phone} onChange={setPersonal("phone")} />
              <Field id="location" text={L("Location")} value={cv.personal.location} onChange={setPersonal("location")} placeholder={L("City, country")} />
              <Field id="website" text={L("LinkedIn or website")} value={cv.personal.website} onChange={setPersonal("website")} />
              <div className="sm:col-span-2">
                <Field
                  id="summary"
                  text={L("Profile summary")}
                  textarea
                  value={cv.personal.summary}
                  onChange={setPersonal("summary")}
                  hint={L("Two or three sentences about who you are, your strengths and what you're looking for.")}
                />
                <div className="mt-2 flex flex-wrap items-start gap-2">
                  <DictateButton onText={(t) => setPersonal("summary")(`${cv.personal.summary} ${t}`.trim())} />
                  {aiEnabled && (
                    <AiAssist
                      kind="summary"
                      label={L(cv.personal.summary ? "Improve with AI" : "Write it for me")}
                      input={{
                        text: cv.personal.summary,
                        title: cv.personal.title,
                        skills: cv.skills,
                        roles: cv.experience.map((x) => [x.role, x.company].filter(Boolean).join(" at ")),
                      }}
                      onAccept={setPersonal("summary")}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === "experience" && (
            <>
              {cv.experience.map((e, i) => {
                const set = (values: Partial<Experience>) => updateList("experience", (l) => patch(l, e.id, values));
                return (
                  <ItemCard
                    L={L}
                    key={e.id}
                    title={e.role || L("New position")}
                    onRemove={() => updateList("experience", (l) => l.filter((x) => x.id !== e.id))}
                    onUp={i > 0 ? () => updateList("experience", (l) => move(l, i, -1)) : undefined}
                    onDown={i < cv.experience.length - 1 ? () => updateList("experience", (l) => move(l, i, 1)) : undefined}
                  >
                    <Field id={`role-${e.id}`} text={L("Job title")} value={e.role} onChange={(v) => set({ role: v })} />
                    <Field id={`company-${e.id}`} text={L("Employer")} value={e.company} onChange={(v) => set({ company: v })} />
                    <Field id={`eloc-${e.id}`} text={L("Location")} value={e.location} onChange={(v) => set({ location: v })} />
                    <div className="grid grid-cols-2 gap-3">
                      <Field id={`es-${e.id}`} text={L("Start")} value={e.start} onChange={(v) => set({ start: v })} placeholder="2021" />
                      <Field id={`ee-${e.id}`} text={L("End")} value={e.current ? "" : e.end} onChange={(v) => set({ end: v })} placeholder={e.current ? L("Present") : "2023"} />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2">
                      <input type="checkbox" checked={e.current} onChange={(ev) => set({ current: ev.target.checked })} className="h-4 w-4 accent-[var(--brand)]" />
                      {L("I currently work here")}
                    </label>
                    <div className="sm:col-span-2">
                      <Field
                        id={`ed-${e.id}`}
                        text={L("Achievements and responsibilities")}
                        textarea
                        value={e.description}
                        onChange={(v) => set({ description: v })}
                        hint={L("One point per line. Start with an action word and include numbers where you can.")}
                      />
                      <div className="mt-2 flex flex-wrap items-start gap-2">
                        <DictateButton onText={(t) => set({ description: e.description ? `${e.description}\n${t}` : t })} />
                        {aiEnabled && (
                          <AiAssist
                            kind="bullets"
                            input={{ text: e.description, role: e.role }}
                            onAccept={(t) => set({ description: t })}
                          />
                        )}
                      </div>
                    </div>
                  </ItemCard>
                );
              })}
              <button
                type="button"
                onClick={() =>
                  updateList("experience", (l) => [
                    ...l,
                    { id: newId(), role: "", company: "", location: "", start: "", end: "", current: false, description: "" },
                  ])
                }
                className="w-full rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-brand hover:border-brand"
              >
                {L("+ Add position")}
              </button>
            </>
          )}

          {tab === "education" && (
            <>
              {cv.education.map((d, i) => {
                const set = (values: Partial<Education>) => updateList("education", (l) => patch(l, d.id, values));
                return (
                  <ItemCard
                    L={L}
                    key={d.id}
                    title={d.qualification || L("New qualification")}
                    onRemove={() => updateList("education", (l) => l.filter((x) => x.id !== d.id))}
                    onUp={i > 0 ? () => updateList("education", (l) => move(l, i, -1)) : undefined}
                    onDown={i < cv.education.length - 1 ? () => updateList("education", (l) => move(l, i, 1)) : undefined}
                  >
                    <Field id={`q-${d.id}`} text={L("Qualification")} value={d.qualification} onChange={(v) => set({ qualification: v })} />
                    <Field id={`s-${d.id}`} text={L("School or college")} value={d.school} onChange={(v) => set({ school: v })} />
                    <Field id={`dl-${d.id}`} text={L("Location")} value={d.location} onChange={(v) => set({ location: v })} />
                    <div className="grid grid-cols-2 gap-3">
                      <Field id={`ds-${d.id}`} text={L("Start")} value={d.start} onChange={(v) => set({ start: v })} />
                      <Field id={`de-${d.id}`} text={L("End")} value={d.end} onChange={(v) => set({ end: v })} />
                    </div>
                    <div className="sm:col-span-2">
                      <Field id={`dd-${d.id}`} text={L("Details (optional)")} textarea value={d.details} onChange={(v) => set({ details: v })} />
                    </div>
                  </ItemCard>
                );
              })}
              <button
                type="button"
                onClick={() =>
                  updateList("education", (l) => [
                    ...l,
                    { id: newId(), qualification: "", school: "", location: "", start: "", end: "", details: "" },
                  ])
                }
                className="w-full rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-brand hover:border-brand"
              >
                {L("+ Add qualification")}
              </button>
            </>
          )}

          {tab === "skills" && (
            <div>
              <label htmlFor="skill" className={label}>{L("Add a skill")}</label>
              <div className="mt-1 flex gap-2">
                <input
                  id="skill"
                  value={skillDraft}
                  onChange={(e) => setSkillDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder={L("e.g. Customer service")}
                  className={`${input} mt-0`}
                />
                <button type="button" onClick={addSkill} className="rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-dark">
                  {L("Add")}
                </button>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {cv.skills.map((s) => (
                  <li key={s} className="flex items-center gap-1 rounded-full bg-brand/10 py-1 pl-3 pr-1 text-sm font-medium text-brand-dark">
                    {s}
                    <button
                      type="button"
                      aria-label={L("Remove {name}", { name: s })}
                      onClick={() => setCv((c) => ({ ...c, skills: c.skills.filter((x) => x !== s) }))}
                      className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-brand/20"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
              {cv.skills.length === 0 && <p className="mt-3 text-sm text-slate-500">{L("Add 5–10 skills that match the jobs you want.")}</p>}
            </div>
          )}

          {tab === "extras" && (
            <div className="space-y-8">
              <div className="space-y-3">
                <h2 className="font-bold text-brand-dark">{L("Languages")}</h2>
                {cv.languages.map((l) => {
                  const set = (values: Partial<Language>) => updateList("languages", (list) => patch(list, l.id, values));
                  return (
                    <div key={l.id} className="flex items-end gap-2">
                      <div className="flex-1">
                        <Field id={`ln-${l.id}`} text={L("Language")} value={l.name} onChange={(v) => set({ name: v })} />
                      </div>
                      <div className="w-36">
                        <label htmlFor={`ll-${l.id}`} className={label}>{L("Level")}</label>
                        <select id={`ll-${l.id}`} value={l.level} onChange={(e) => set({ level: e.target.value })} className={input}>
                          {languageLevels.map((lvl) => (
                            <option key={lvl} value={lvl}>{L(lvl)}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        aria-label={L("Remove language")}
                        onClick={() => updateList("languages", (list) => list.filter((x) => x.id !== l.id))}
                        className="mb-1 rounded px-2 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={() => updateList("languages", (l) => [...l, { id: newId(), name: "", level: "Fluent" }])}
                  className="text-sm font-semibold text-brand hover:underline"
                >
                  {L("+ Add language")}
                </button>
              </div>

              <div className="space-y-3">
                <h2 className="font-bold text-brand-dark">{L("Certifications")}</h2>
                {cv.certifications.map((c) => {
                  const set = (values: Partial<Certification>) => updateList("certifications", (list) => patch(list, c.id, values));
                  return (
                    <ItemCard L={L} key={c.id} title={c.name || L("New certification")} onRemove={() => updateList("certifications", (list) => list.filter((x) => x.id !== c.id))}>
                      <Field id={`cn-${c.id}`} text={L("Name")} value={c.name} onChange={(v) => set({ name: v })} />
                      <Field id={`ci-${c.id}`} text={L("Issued by")} value={c.issuer} onChange={(v) => set({ issuer: v })} />
                      <Field id={`cy-${c.id}`} text={L("Year")} value={c.year} onChange={(v) => set({ year: v })} />
                    </ItemCard>
                  );
                })}
                <button
                  type="button"
                  onClick={() => updateList("certifications", (l) => [...l, { id: newId(), name: "", issuer: "", year: "" }])}
                  className="text-sm font-semibold text-brand hover:underline"
                >
                  {L("+ Add certification")}
                </button>
              </div>
            </div>
          )}

          {tab === "design" && (
            <div className="space-y-6">
              <fieldset>
                <legend className={label}>{L("Template")}</legend>
                <div className="mt-2 grid grid-cols-3 gap-3">
                  {cvTemplates.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      aria-pressed={cv.template === t.id}
                      onClick={() => setCv((c) => ({ ...c, template: t.id }))}
                      className={`rounded-xl border-2 p-3 text-sm font-semibold ${
                        cv.template === t.id ? "border-brand bg-brand/5 text-brand" : "border-slate-200 text-slate-700 hover:border-slate-400"
                      }`}
                    >
                      {L(t.name)}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className={label}>{L("Accent colour")}</legend>
                <div className="mt-2 flex gap-3">
                  {cvAccents.map((a) => (
                    <button
                      key={a}
                      type="button"
                      aria-label={`Accent ${a}`}
                      aria-pressed={cv.accent === a}
                      onClick={() => setCv((c) => ({ ...c, accent: a }))}
                      className={`h-9 w-9 rounded-full ring-offset-2 ${cv.accent === a ? "ring-2 ring-slate-900" : ""}`}
                      style={{ background: a }}
                    />
                  ))}
                </div>
              </fieldset>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-10 rounded-2xl bg-muted p-6">
          <h2 className="font-bold text-brand-dark">{L("Finished?")}</h2>
          {unlocked ? (
            <>
              <p className="mt-1 text-sm text-slate-600">
                {L("Download your CV as a PDF (choose “Save as PDF” in the print dialog), or send it straight to our consultants.")}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" onClick={() => window.print()} className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-dark">
                  {L("Download PDF")}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="mt-1 text-sm text-slate-600">
                {L("Building your CV is free. Downloading it as a PDF costs {price}, or you can send it to our consultants for free.", { price })}
              </p>
              <div className="mt-4 rounded-xl bg-white p-4 ring-1 ring-slate-200">
                <p className="text-sm font-bold text-brand-dark">{L("Buy the PDF download")}</p>
                <div className="mt-3">
                  <Field
                    id="cv-buy-email"
                    type="email"
                    text={L("Email for the payment link")}
                    value={buyEmail ?? cv.personal.email}
                    onChange={setBuyEmail}
                    placeholder="name@example.com"
                  />
                </div>
                <fieldset className="mt-3">
                  <legend className={label}>{L("Payment method")}</legend>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {paymentMethods.map((m) => (
                      <label
                        key={m.id}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm ring-1 focus-within:ring-2 focus-within:ring-brand ${
                          buyMethod === m.id ? "bg-brand/5 font-semibold text-brand-dark ring-brand" : "ring-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="cv-buy-method"
                          value={m.id}
                          checked={buyMethod === m.id}
                          onChange={() => setBuyMethod(m.id)}
                          className="h-4 w-4 accent-[var(--brand)]"
                        />
                        {L(m.label)}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <button
                  type="button"
                  onClick={requestDownload}
                  disabled={paying}
                  className="mt-4 rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60"
                >
                  {paying ? L("Sending…") : L("Get my CV for {price}", { price })}
                </button>
                {buyState && (
                  <p role="status" className={`mt-3 text-sm font-medium ${buyState.ok ? "text-emerald-700" : "text-red-600"}`}>
                    {buyState.message}
                  </p>
                )}
                <p className="mt-3 text-xs text-slate-500">
                  {L("No payment is taken here. We'll email you a secure payment link, then an unlock code once payment is confirmed.")}
                </p>
                {pricing.paymentInstructions.trim() && (
                  <div className="mt-3 rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-bold text-brand-dark">{L("Payment instructions")}</p>
                    <p className="mt-1 whitespace-pre-line text-xs text-slate-700">{L(pricing.paymentInstructions)}</p>
                  </div>
                )}
              </div>
              <form
                className="mt-4 flex flex-wrap items-end gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  redeem();
                }}
              >
                <div className="min-w-0 flex-1">
                  <Field id="cv-unlock-code" text={L("Already paid? Enter your unlock code")} value={code} onChange={setCode} placeholder="XXXX-XXXX-XXXX" />
                </div>
                <button
                  type="submit"
                  disabled={redeeming || !code.trim()}
                  className="rounded-full border-2 border-brand px-5 py-2 text-sm font-bold text-brand hover:bg-brand hover:text-white disabled:opacity-60"
                >
                  {redeeming ? L("Checking…") : L("Unlock download")}
                </button>
              </form>
              {codeState && !codeState.ok && (
                <p role="alert" className="mt-2 text-sm font-medium text-red-600">{codeState.message}</p>
              )}
            </>
          )}
          <div className="mt-6 border-t border-slate-200 pt-6">
            <label className="flex items-start gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--brand)]" />
              <span>
                {L("I agree to share my CV with Bridge Careers Global so consultants can contact me about suitable jobs, as described in the")}{" "}
                <Link href="/privacy-policy" target="_blank" className="font-semibold text-brand underline">{L("privacy policy")}</Link>.
              </span>
            </label>
            <button
              type="button"
              onClick={send}
              disabled={sending}
              className="mt-4 rounded-full border-2 border-brand px-6 py-2 text-sm font-bold text-brand hover:bg-brand hover:text-white disabled:opacity-60"
            >
              {sending ? L("Sending…") : L("Send my CV to Bridge")}
            </button>
            {sendState && (
              <p role="status" className={`mt-3 text-sm font-medium ${sendState.ok ? "text-emerald-700" : "text-red-600"}`}>
                {sendState.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className={`${mobilePreview ? "" : "hidden lg:block"} ${unlocked ? "print:block" : "print:hidden"}`}>
        <div className="sticky top-32 print:static">
          <div className="cv-scale-wrap overflow-hidden rounded-lg shadow-2xl ring-1 ring-slate-200 print:overflow-visible print:rounded-none print:shadow-none print:ring-0">
            <CvPreview cv={cv} labels={labels} />
          </div>
        </div>
      </div>

      {!unlocked && (
        <p className="hidden p-12 text-center text-lg print:block">
          {L("Downloading your CV costs {price}. Use “Get my CV” in the CV maker to buy the PDF download.", { price })}
        </p>
      )}

      <button
        type="button"
        onClick={() => setMobilePreview((v) => !v)}
        className="fixed bottom-5 right-5 z-40 rounded-full bg-brand-dark px-5 py-3 text-sm font-bold text-white shadow-xl lg:hidden print:hidden"
      >
        {mobilePreview ? L("Back to editing") : L("Preview CV")}
      </button>
    </div>
    </CvLabelsProvider>
  );
}
