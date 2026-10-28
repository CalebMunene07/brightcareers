"use server";

import { randomInt } from "node:crypto";
import { cookies } from "next/headers";
import { after } from "next/server";
import { storeCv, storeFile } from "@/lib/cv-storage";
import { countryNames, findCountry } from "@/lib/countries";
import { collections, DatabaseNotConfiguredError, getDb } from "@/lib/db";
import { CUSTOM_FILE_TYPES, getFormDef, isRequired, shown, type FormId, type FormLayout } from "@/lib/forms";
import { getFormLayout } from "@/lib/forms-repo";
import { feesTotal as sumFees, routeFee } from "@/lib/pricing";
import { getPricing } from "@/lib/pricing-repo";
import { feesTotal, getPublishedCustomForm } from "@/lib/custom-forms-repo";
import { isLocale, LOCALE_COOKIE } from "@/lib/i18n";
import { getPublishedJob } from "@/lib/jobs-repo";
import { notifyNewSubmission } from "@/lib/notify";
import { getT } from "@/lib/translate";
import {
  applicantCounts,
  asksEmployment,
  destinations,
  DOC_TYPES,
  employmentFields,
  MAX_UPLOAD_BYTES,
  travelClasses,
  visaDocuments,
  visaTypes,
  usd,
} from "@/lib/visa";

// Form handlers: validate input, then store each submission in MongoDB.

export type FormState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_CV_BYTES = 4 * 1024 * 1024;
const CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim().slice(0, 5000) : "";
}

function fields(formData: FormData, keys: string[]) {
  return Object.fromEntries(keys.map((k) => [k, text(formData, k)]));
}

function validate(formData: FormData, required: string[]) {
  const errors: Record<string, string> = {};
  for (const key of required) {
    if (!text(formData, key)) errors[key] = "This field is required.";
  }
  const email = text(formData, "email");
  if (email && !EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";
  return errors;
}

function invalid(errors: Record<string, string>): FormState {
  return { ok: false, message: "Please fix the highlighted fields.", errors };
}

/* ---------------- Admin-controlled fields (Admin → Forms) ---------------- */

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TOO_LARGE = "Your files are too large together. Please upload files under 4 MB in total.";

/** The built-in text fields of a form that are shown and required. */
function requiredFields(layout: FormLayout, id: FormId, except: string[] = []) {
  return getFormDef(id)!.fields.map((f) => f.key).filter((k) => !except.includes(k) && isRequired(layout, k));
}

type Custom = { answers: { key: string; label: string; value: string }[]; files: { key: string; label: string; file: File }[]; bytes: number };

/** Validates the custom fields added in Admin → Forms. */
function readCustom(layout: FormLayout, formData: FormData, errors: Record<string, string>): Custom {
  const result: Custom = { answers: [], files: [], bytes: 0 };
  for (const c of layout.custom) {
    if (c.type === "section") continue;
    if (c.type === "file") {
      const file = formData.get(c.key);
      if (!(file instanceof File) || file.size === 0) {
        if (c.required) errors[c.key] = "Please upload this document.";
      } else if (!CUSTOM_FILE_TYPES.includes(file.type)) {
        errors[c.key] = "Upload a PDF, Word, JPG, PNG or WebP file.";
      } else {
        result.files.push({ key: c.key, label: c.label, file });
        result.bytes += file.size;
      }
      continue;
    }
    const value = text(formData, c.key);
    if (!value) {
      if (c.required) errors[c.key] = "This field is required.";
    } else if (c.type === "email" && !EMAIL_RE.test(value)) {
      errors[c.key] = "Enter a valid email address.";
    } else if (c.type === "number" && !Number.isFinite(Number(value))) {
      errors[c.key] = "Enter a number.";
    } else if (c.type === "date" && (!DATE_RE.test(value) || Number.isNaN(Date.parse(value)))) {
      errors[c.key] = "Enter a valid date.";
    } else if (c.type === "select" && !c.options.includes(value)) {
      errors[c.key] = "Choose an option from the list.";
    } else {
      result.answers.push({ key: c.key, label: c.label, value });
    }
  }
  return result;
}

/** Stores custom uploads. Answers keep their label so old submissions still read well after a field changes. */
async function customDoc(custom: Custom, folder: string) {
  const extraFiles = [];
  for (const f of custom.files) extraFiles.push({ key: f.key, label: f.label, file: await storeFile(f.file, folder) });
  return {
    ...(custom.answers.length > 0 ? { answers: custom.answers } : {}),
    ...(extraFiles.length > 0 ? { extraFiles } : {}),
  };
}

function customAlert(custom: Custom): [string, string][] {
  return [...custom.answers.map((a): [string, string] => [a.label, a.value]), ...custom.files.map((f): [string, string] => [f.label, f.file.name])];
}

const UPLOAD_FAILED = "We couldn't upload your files. Please try again in a moment.";

type Alert = { kind: string; inbox: string; fields: [string, string][] };

async function save(collection: string, doc: Record<string, unknown>, success: string, alert?: Alert): Promise<FormState> {
  try {
    const db = await getDb();
    const { insertedId } = await db.collection(collection).insertOne({ ...doc, status: "new", createdAt: new Date() });
    // Email the team after the response has been sent, so visitors never wait on SMTP.
    if (alert) after(() => notifyNewSubmission(alert.kind, alert.fields, `/admin/inbox/${alert.inbox}/${insertedId}`));
    return { ok: true, message: success };
  } catch (error) {
    console.error(`Failed to save to ${collection}`, error);
    if (error instanceof DatabaseNotConfiguredError) {
      return { ok: false, message: "The form isn't connected to the database yet (MONGODB_URI is missing)." };
    }
    return { ok: false, message: "Something went wrong sending your form. Please try again in a moment." };
  }
}

async function submitApplicationImpl(_prev: FormState, formData: FormData): Promise<FormState> {
  const layout = await getFormLayout("application");
  const errors = validate(formData, requiredFields(layout, "application", ["cv"]));

  const upload = formData.get("cv");
  const cv = shown(layout, "cv") && upload instanceof File && upload.size > 0 ? upload : null;
  if (!cv) {
    if (isRequired(layout, "cv")) errors.cv = "Please attach your CV.";
  } else if (cv.size > MAX_CV_BYTES) {
    errors.cv = "Your CV must be smaller than 4 MB.";
  } else if (!CV_TYPES.includes(cv.type)) {
    errors.cv = "Upload a PDF or Word document.";
  }
  const custom = readCustom(layout, formData, errors);
  if (Object.keys(errors).length > 0) return invalid(errors);
  if ((cv?.size ?? 0) + custom.bytes > MAX_UPLOAD_BYTES) return { ok: false, message: TOO_LARGE };

  // Only accept applications for jobs that are live and haven't closed.
  const jobSlug = text(formData, "job");
  if (jobSlug) {
    try {
      if (!(await getPublishedJob(jobSlug))) {
        return { ok: false, message: "Sorry, this job is no longer accepting applications." };
      }
    } catch (error) {
      console.error("Couldn't check job status", error);
    }
  }

  let files;
  try {
    files = { ...(cv ? { cv: await storeCv(cv) } : {}), ...(await customDoc(custom, "cvs")) };
  } catch (error) {
    console.error("Couldn't store application files", error);
    return { ok: false, message: UPLOAD_FAILED };
  }
  return save(
    collections.applications,
    {
      ...fields(formData, ["job", "name", "email", "phone", "location", "message"]),
      ...files,
    },
    "Thanks for applying! A consultant will review your CV and get back to you within 3 working days.",
    {
      kind: "job application",
      inbox: "applications",
      fields: [
        ["Job", jobSlug || "General application"],
        ["Name", text(formData, "name")],
        ["Email", text(formData, "email")],
        ["Phone", text(formData, "phone")],
        ...customAlert(custom),
      ],
    },
  );
}

/** Custom fields on the simpler forms: validate, check the upload size and store any files. */
async function simpleCustom(
  layout: FormLayout,
  formData: FormData,
  errors: Record<string, string>,
  folder: string,
): Promise<{ state: FormState } | { custom: Custom; doc: Record<string, unknown> }> {
  const custom = readCustom(layout, formData, errors);
  if (Object.keys(errors).length > 0) return { state: invalid(errors) };
  if (custom.bytes > MAX_UPLOAD_BYTES) return { state: { ok: false, message: TOO_LARGE } };
  try {
    return { custom, doc: await customDoc(custom, folder) };
  } catch (error) {
    console.error(`Couldn't store ${folder} files`, error);
    return { state: { ok: false, message: UPLOAD_FAILED } };
  }
}

async function submitStaffRequestImpl(_prev: FormState, formData: FormData): Promise<FormState> {
  const layout = await getFormLayout("staff");
  const errors = validate(formData, requiredFields(layout, "staff"));
  const extra = await simpleCustom(layout, formData, errors, "requests");
  if ("state" in extra) return extra.state;

  return save(
    collections.staffRequests,
    {
      ...fields(formData, ["name", "company", "email", "phone", "service", "industry", "role", "headcount", "start", "details"]),
      ...extra.doc,
    },
    "Thanks! Our team will contact you within one working day to discuss your needs.",
    {
      kind: "staff request",
      inbox: "requests",
      fields: [
        ["Company", text(formData, "company")],
        ["Role(s)", text(formData, "role")],
        ["Contact", `${text(formData, "name")} <${text(formData, "email")}>`],
        ["Details", text(formData, "details")],
        ...customAlert(extra.custom),
      ],
    },
  );
}

async function submitContactImpl(_prev: FormState, formData: FormData): Promise<FormState> {
  const layout = await getFormLayout("contact");
  const errors = validate(formData, requiredFields(layout, "contact"));
  const extra = await simpleCustom(layout, formData, errors, "messages");
  if ("state" in extra) return extra.state;

  return save(
    collections.contacts,
    { ...fields(formData, ["name", "email", "phone", "country", "topic", "message"]), ...extra.doc },
    "Thanks for getting in touch. We'll reply as soon as possible.",
    {
      kind: "contact message",
      inbox: "messages",
      fields: [
        ["From", `${text(formData, "name")} <${text(formData, "email")}>`],
        ["Topic", text(formData, "topic")],
        ["Country", text(formData, "country")],
        ["Message", text(formData, "message")],
        ...customAlert(extra.custom),
      ],
    },
  );
}

async function subscribeNewsletterImpl(_prev: FormState, formData: FormData): Promise<FormState> {
  const errors = validate(formData, ["email"]);
  if (Object.keys(errors).length > 0) return invalid(errors);
  return save(collections.newsletter, fields(formData, ["email"]), "You're subscribed. Thanks!");
}

async function submitCvImpl(cv: unknown, consent: boolean): Promise<FormState> {
  if (!consent) return { ok: false, message: "Please agree to share your CV with Bridge Careers Global." };
  if (typeof cv !== "object" || cv === null) return { ok: false, message: "Your CV is empty." };

  const personal = (cv as { personal?: { name?: unknown; email?: unknown } }).personal;
  const name = typeof personal?.name === "string" ? personal.name.trim() : "";
  const email = typeof personal?.email === "string" ? personal.email.trim() : "";
  if (!name || !EMAIL_RE.test(email)) {
    return { ok: false, message: "Add your full name and a valid email address before sending." };
  }
  if (JSON.stringify(cv).length > 200_000) {
    return { ok: false, message: "Your CV is too long to send. Please shorten it and try again." };
  }

  return save(
    collections.cvs,
    { name, email, cv },
    "Your CV has been sent. A consultant will be in touch about suitable roles.",
    { kind: "CV from the CV maker", inbox: "cvs", fields: [["Name", name], ["Email", email]] },
  );
}

/* ---------------- Paid CV downloads ---------------- */

// Unlock codes avoid look-alike characters. 12 characters from 32 is 2^60 combinations, too many to guess.
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function newUnlockCode() {
  const raw = Array.from({ length: 12 }, () => CODE_CHARS[randomInt(CODE_CHARS.length)]).join("");
  return raw.match(/.{4}/g)!.join("-");
}

/** Formats whatever the visitor typed as XXXX-XXXX-XXXX, or "" when it can't be a code. */
function normalizeUnlockCode(input: string) {
  const raw = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return raw.length === 12 ? raw.match(/.{4}/g)!.join("-") : "";
}

async function requestCvDownloadImpl(cv: unknown, email: string, paymentMethod: string): Promise<FormState> {
  if (typeof cv !== "object" || cv === null) return { ok: false, message: "Your CV is empty." };
  const name = (cv as { personal?: { name?: unknown } }).personal?.name;
  const fullName = typeof name === "string" ? name.trim().slice(0, 200) : "";
  const to = email.trim().slice(0, 320);
  if (!fullName) return { ok: false, message: "Add your full name to your CV first." };
  if (!EMAIL_RE.test(to)) return { ok: false, message: "Enter a valid email address." };
  const pricing = await getPricing();
  if (!pricing.paymentMethods.some((m) => m.id === paymentMethod)) return { ok: false, message: "Choose a payment method." };
  if (JSON.stringify(cv).length > 200_000) {
    return { ok: false, message: "Your CV is too long to send. Please shorten it and try again." };
  }

  const fee = usd(pricing.cvDownloadFee);
  return save(
    collections.cvDownloads,
    { name: fullName, email: to, paymentMethod, fee, unlockCode: newUnlockCode(), cv },
    "Request received. We'll email you a secure payment link, then send your unlock code once payment is confirmed.",
    {
      kind: "CV download purchase",
      inbox: "cv-downloads",
      fields: [
        ["Name", fullName],
        ["Email", to],
        ["Amount", fee],
        ["Preferred payment", paymentMethod],
      ],
    },
  );
}

async function redeemCvUnlockCodeImpl(input: string): Promise<FormState> {
  const code = normalizeUnlockCode(input);
  if (!code) return { ok: false, message: "That unlock code isn't valid. Check it and try again." };
  try {
    const col = (await getDb()).collection(collections.cvDownloads);
    const found = await col.findOne({ unlockCode: code }, { projection: { redeemedAt: 1 } });
    if (!found) return { ok: false, message: "That unlock code isn't valid. Check it and try again." };
    await col.updateOne(
      { _id: found._id },
      { $inc: { redemptions: 1 }, ...(found.redeemedAt ? {} : { $set: { redeemedAt: new Date() } }) },
    );
    return { ok: true, message: "Download unlocked. Thank you!" };
  } catch (error) {
    console.error("Couldn't check CV unlock code", error);
    return { ok: false, message: "Something went wrong. Please try again in a moment." };
  }
}

/* ---------------- Visa applications and air ticket requests ---------------- */

function checkDates(formData: FormData, errors: Record<string, string>, keys: string[]) {
  for (const key of keys) {
    const value = text(formData, key);
    if (value && (!DATE_RE.test(value) || Number.isNaN(Date.parse(value)))) errors[key] = "Enter a valid date.";
  }
}

function checkCountry(formData: FormData, errors: Record<string, string>, key: string, allowed: string[]) {
  const value = text(formData, key);
  if (value && !allowed.includes(value)) errors[key] = "Choose a country from the list.";
}

async function submitVisaApplicationImpl(_prev: FormState, formData: FormData): Promise<FormState> {
  const [layout, pricing] = await Promise.all([getFormLayout("visa"), getPricing()]);
  const employed = asksEmployment(text(formData, "visaType"));
  const docKeys = visaDocuments.map((d) => `doc_${d.key}`);
  const errors = validate(formData, [
    ...requiredFields(layout, "visa", [...docKeys, ...(employed ? [] : employmentFields)]),
    // The phone field is a country code plus the number.
    ...(isRequired(layout, "phone") ? ["phoneCountry"] : []),
  ]);
  checkDates(formData, errors, ["birthDate", "issueDate", "expiryDate", "startDate"]);
  for (const key of ["nationality", "homeCountry", "originCountry", "phoneCountry"]) checkCountry(formData, errors, key, countryNames);

  const issue = text(formData, "issueDate");
  const expiry = text(formData, "expiryDate");
  if (!errors.expiryDate && expiry && expiry <= new Date().toISOString().slice(0, 10)) errors.expiryDate = "Your passport has expired.";
  if (!errors.expiryDate && issue && expiry && expiry <= issue) errors.expiryDate = "The expiry date must be after the issue date.";

  const country = text(formData, "country");
  const job = text(formData, "job");
  if (country && !destinations[country]) errors.country = "Choose a destination from the list.";
  else if (job && !destinations[country]?.includes(job)) errors.job = "Choose a role available in this destination.";
  if (text(formData, "visaType") && !visaTypes.includes(text(formData, "visaType"))) errors.visaType = "Choose a visa type.";
  if (text(formData, "applicants") && !applicantCounts.includes(text(formData, "applicants"))) errors.applicants = "Choose the number of applicants.";
  if (text(formData, "paymentMethod") && !pricing.paymentMethods.some((m) => m.id === text(formData, "paymentMethod"))) {
    errors.paymentMethod = "Choose a payment method.";
  }

  const files: Partial<Record<string, File>> = {};
  let total = 0;
  for (const doc of visaDocuments) {
    const key = `doc_${doc.key}`;
    if (!shown(layout, key)) continue;
    const file = formData.get(key);
    if (!(file instanceof File) || file.size === 0) {
      if (isRequired(layout, key)) errors[key] = "Please upload this document.";
    } else if (!DOC_TYPES.includes(file.type)) {
      errors[key] = "Upload a PDF, JPG, PNG or WebP file.";
    } else {
      files[doc.key] = file;
      total += file.size;
    }
  }
  const custom = readCustom(layout, formData, errors);
  if (Object.keys(errors).length > 0) return invalid(errors);
  if (total + custom.bytes > MAX_UPLOAD_BYTES) {
    return { ok: false, message: "Your documents are too large together. Please upload files under 4 MB in total." };
  }

  const origin = text(formData, "originCountry");
  const ticketFee = routeFee(pricing.routeFees, origin, country);
  const visaFeesTotal = sumFees(pricing.visaFees);
  const name = [text(formData, "firstName"), text(formData, "middleName"), text(formData, "lastName")].filter(Boolean).join(" ");
  const phone = `${findCountry(text(formData, "phoneCountry"))?.dial ?? ""} ${text(formData, "phone")}`.trim();
  const address = [
    text(formData, "address1"),
    text(formData, "address2"),
    [text(formData, "city"), text(formData, "province"), text(formData, "postal")].filter(Boolean).join(", "),
    text(formData, "homeCountry"),
  ]
    .filter(Boolean)
    .join("\n");
  const fees = [
    ...pricing.visaFees.map((f) => `${f.label}: ${usd(f.amount)}`),
    `Air ticket booking fee (${origin} → ${country}): ${usd(ticketFee)}`,
    `Total: ${usd(visaFeesTotal + ticketFee)}`,
  ].join("\n");

  const documents: Record<string, unknown> = {};
  let extra;
  try {
    for (const [key, file] of Object.entries(files)) if (file) documents[key] = await storeFile(file, "visa");
    extra = await customDoc(custom, "visa");
  } catch (error) {
    console.error("Couldn't store visa documents", error);
    return { ok: false, message: "We couldn't upload your documents. Please try again in a moment." };
  }

  return save(
    collections.visaApplications,
    {
      ...fields(formData, [
        "firstName", "middleName", "lastName", "birthDate", "gender", "nationality",
        "passport", "issueDate", "expiryDate", "issuePlace", "authority", "email",
        ...(employed ? employmentFields : []),
        "originCountry", "country", "job", "visaType", "startDate", "applicants", "paymentMethod",
      ]),
      name,
      phone,
      address,
      fees,
      totalUsd: visaFeesTotal + ticketFee,
      documents,
      ...extra,
    },
    "Thanks! Your visa application has been received. We'll email you a secure payment link and next steps within 2 working days.",
    {
      kind: "visa application",
      inbox: "visa",
      fields: [
        ["Name", name],
        ["Email", text(formData, "email")],
        ["Phone", phone],
        ["Route", `${origin} → ${country}`],
        ["Role", job],
        ["Visa type", text(formData, "visaType")],
        ["Total quoted", usd(visaFeesTotal + ticketFee)],
        ["Preferred payment", text(formData, "paymentMethod")],
        ...customAlert(custom),
      ],
    },
  );
}

async function submitTicketRequestImpl(_prev: FormState, formData: FormData): Promise<FormState> {
  const [layout, pricing] = await Promise.all([getFormLayout("ticket"), getPricing()]);
  const errors = validate(formData, requiredFields(layout, "ticket", ["passportFile"]));
  checkDates(formData, errors, ["departDate", "returnDate"]);
  checkCountry(formData, errors, "from", countryNames);
  checkCountry(formData, errors, "to", countryNames);
  const depart = text(formData, "departDate");
  const ret = text(formData, "returnDate");
  if (!errors.departDate && depart && depart < new Date().toISOString().slice(0, 10)) errors.departDate = "Choose a date in the future.";
  if (!errors.returnDate && ret && depart && ret < depart) errors.returnDate = "The return date must be after departure.";
  const passengers = Number(text(formData, "passengers"));
  if (text(formData, "passengers") && !(Number.isInteger(passengers) && passengers >= 1 && passengers <= 9)) {
    errors.passengers = "Choose between 1 and 9 passengers.";
  }
  if (text(formData, "travelClass") && !travelClasses.includes(text(formData, "travelClass"))) errors.travelClass = "Choose a travel class.";
  const upload = formData.get("passportFile");
  const passport = shown(layout, "passportFile") && upload instanceof File && upload.size > 0 ? upload : null;
  if (!passport) {
    if (isRequired(layout, "passportFile")) errors.passportFile = "Please upload this document.";
  } else if (!DOC_TYPES.includes(passport.type)) errors.passportFile = "Upload a PDF, JPG, PNG or WebP file.";
  else if (passport.size > MAX_UPLOAD_BYTES) errors.passportFile = "Please upload a file under 4 MB.";
  const custom = readCustom(layout, formData, errors);
  if (Object.keys(errors).length > 0) return invalid(errors);
  if ((passport?.size ?? 0) + custom.bytes > MAX_UPLOAD_BYTES) return { ok: false, message: TOO_LARGE };

  let stored: Record<string, unknown>;
  try {
    stored = { ...(passport ? { documents: { passport: await storeFile(passport, "tickets") } } : {}), ...(await customDoc(custom, "tickets")) };
  } catch (error) {
    console.error("Couldn't store files for ticket request", error);
    return { ok: false, message: UPLOAD_FAILED };
  }

  const from = text(formData, "from");
  const to = text(formData, "to");
  const fee = usd(routeFee(pricing.routeFees, from, to));
  return save(
    collections.ticketRequests,
    {
      ...fields(formData, ["from", "to", "departDate", "returnDate", "passengers", "travelClass", "email", "notes"]),
      route: `${from} → ${to}`,
      bookingFee: fee,
      ...stored,
    },
    "Booking request received. Our travel team will confirm availability and fare options by email.",
    {
      kind: "air ticket request",
      inbox: "tickets",
      fields: [
        ["Route", `${from} → ${to}`],
        ["Departure", depart],
        ["Return", ret || "One way"],
        ["Passengers", text(formData, "passengers")],
        ["Class", text(formData, "travelClass")],
        ["Email", text(formData, "email")],
        ["Booking fee quoted", fee],
        ["Notes", text(formData, "notes")],
        ...customAlert(custom),
      ],
    },
  );
}

/* ---------------- Forms created in Admin → Forms ---------------- */

async function submitCustomFormImpl(_prev: FormState, formData: FormData): Promise<FormState> {
  const [form, pricing] = await Promise.all([getPublishedCustomForm(text(formData, "form")), getPricing()]);
  if (!form) return { ok: false, message: "Sorry, this form is no longer available." };

  const total = feesTotal(form);
  const askPayment = form.askPayment && form.fees.length > 0;
  const errors = validate(formData, [
    ...(form.nameRequired ? ["name"] : []),
    ...(form.emailRequired ? ["email"] : []),
    ...(askPayment ? ["paymentMethod"] : []),
  ]);
  const method = text(formData, "paymentMethod");
  if (askPayment && method && !pricing.paymentMethods.some((m) => m.id === method)) errors.paymentMethod = "Choose a payment method.";
  const extra = await simpleCustom({ fields: {}, custom: form.fields }, formData, errors, "forms");
  if ("state" in extra) return extra.state;

  const fees = form.fees.length > 0 ? [...form.fees.map((f) => `${f.label}: ${usd(f.amount)}`), `Total: ${usd(total)}`].join("\n") : "";
  return save(
    collections.formSubmissions,
    {
      form: form.slug,
      formTitle: form.title,
      ...fields(formData, ["name", "email"]),
      ...(fees ? { fees, totalUsd: total } : {}),
      ...(askPayment ? { paymentMethod: method } : {}),
      ...extra.doc,
    },
    form.success || "Thanks! Your application has been received. We'll be in touch by email within 2 working days.",
    {
      kind: form.title,
      inbox: "forms",
      fields: [
        ["Name", text(formData, "name")],
        ["Email", text(formData, "email")],
        ...customAlert(extra.custom),
        ...(fees ? ([["Total quoted", usd(total)]] as [string, string][]) : []),
        ...(askPayment ? ([["Preferred payment", method]] as [string, string][]) : []),
      ],
    },
  );
}

/* ---------------- Public actions (results translated to the visitor's language) ---------------- */

export async function submitCustomForm(prev: FormState, formData: FormData) {
  return localize(await submitCustomFormImpl(prev, formData));
}

export async function submitVisaApplication(prev: FormState, formData: FormData) {
  return localize(await submitVisaApplicationImpl(prev, formData));
}

export async function submitTicketRequest(prev: FormState, formData: FormData) {
  return localize(await submitTicketRequestImpl(prev, formData));
}

async function localize(state: FormState): Promise<FormState> {
  const t = await getT();
  return {
    ...state,
    message: state.message ? t(state.message) : state.message,
    errors: state.errors ? Object.fromEntries(Object.entries(state.errors).map(([k, v]) => [k, t(v)])) : undefined,
  };
}

export async function submitApplication(prev: FormState, formData: FormData) {
  return localize(await submitApplicationImpl(prev, formData));
}

export async function submitStaffRequest(prev: FormState, formData: FormData) {
  return localize(await submitStaffRequestImpl(prev, formData));
}

export async function submitContact(prev: FormState, formData: FormData) {
  return localize(await submitContactImpl(prev, formData));
}

export async function subscribeNewsletter(prev: FormState, formData: FormData) {
  return localize(await subscribeNewsletterImpl(prev, formData));
}

export async function submitCv(cv: unknown, consent: boolean) {
  return localize(await submitCvImpl(cv, consent));
}

export async function requestCvDownload(cv: unknown, email: string, paymentMethod: string) {
  return localize(await requestCvDownloadImpl(cv, email, paymentMethod));
}

export async function redeemCvUnlockCode(code: string) {
  return localize(await redeemCvUnlockCodeImpl(code));
}

export async function setLocale(locale: string) {
  if (!isLocale(locale)) return;
  (await cookies()).set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
