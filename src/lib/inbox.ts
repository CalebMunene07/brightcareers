// Configuration for the admin inbox: one entry per form-submission collection.

import type { StoredCv } from "@/lib/cv-storage";
import { collections } from "@/lib/db";
import { visaDocuments } from "@/lib/visa";

export const statuses = [
  { id: "new", label: "New" },
  { id: "in_progress", label: "In progress" },
  { id: "closed", label: "Closed" },
] as const;
export type Status = (typeof statuses)[number]["id"];

export function isStatus(value: string): value is Status {
  return statuses.some((s) => s.id === value);
}

export type InboxType = {
  key: string;
  label: string;
  singular: string;
  collection: string;
  columns: { field: string; label: string }[];
  detail: { field: string; label: string; long?: boolean }[];
  /** Uploaded files kept on each submission, by dotted path (e.g. "cv" or "documents.passport"). */
  files?: { path: string; label: string }[];
};

export const inboxTypes: InboxType[] = [
  {
    key: "applications",
    label: "Job applications",
    singular: "Application",
    collection: collections.applications,
    columns: [
      { field: "name", label: "Name" },
      { field: "job", label: "Job" },
      { field: "email", label: "Email" },
    ],
    detail: [
      { field: "name", label: "Name" },
      { field: "email", label: "Email" },
      { field: "phone", label: "Phone" },
      { field: "location", label: "Location" },
      { field: "job", label: "Job" },
      { field: "message", label: "Cover note", long: true },
    ],
    files: [{ path: "cv", label: "CV" }],
  },
  {
    key: "visa",
    label: "Visa applications",
    singular: "Visa application",
    collection: collections.visaApplications,
    columns: [
      { field: "name", label: "Name" },
      { field: "country", label: "Destination" },
      { field: "job", label: "Role" },
    ],
    detail: [
      { field: "name", label: "Full name" },
      { field: "email", label: "Email" },
      { field: "phone", label: "Phone" },
      { field: "birthDate", label: "Date of birth" },
      { field: "gender", label: "Gender" },
      { field: "nationality", label: "Nationality" },
      { field: "passport", label: "Passport number" },
      { field: "issueDate", label: "Passport issued" },
      { field: "expiryDate", label: "Passport expires" },
      { field: "issuePlace", label: "Place of issue" },
      { field: "authority", label: "Issuing authority" },
      { field: "address", label: "Current address", long: true },
      { field: "employment", label: "Employment status" },
      { field: "occupation", label: "Occupation" },
      { field: "employer", label: "Employer" },
      { field: "income", label: "Monthly income (USD)" },
      { field: "originCountry", label: "Departure country" },
      { field: "country", label: "Destination" },
      { field: "job", label: "Role" },
      { field: "visaType", label: "Visa type" },
      { field: "startDate", label: "Preferred start date" },
      { field: "applicants", label: "Number of applicants" },
      { field: "fees", label: "Fees quoted", long: true },
      { field: "paymentMethod", label: "Preferred payment method" },
    ],
    files: visaDocuments.map((d) => ({ path: `documents.${d.key}`, label: d.label })),
  },
  {
    key: "tickets",
    label: "Air ticket requests",
    singular: "Air ticket request",
    collection: collections.ticketRequests,
    columns: [
      { field: "email", label: "Email" },
      { field: "route", label: "Route" },
      { field: "departDate", label: "Departure" },
    ],
    detail: [
      { field: "email", label: "Email" },
      { field: "from", label: "Departure country" },
      { field: "to", label: "Destination" },
      { field: "departDate", label: "Departure date" },
      { field: "returnDate", label: "Return date" },
      { field: "passengers", label: "Passengers" },
      { field: "travelClass", label: "Travel class" },
      { field: "bookingFee", label: "Booking fee quoted" },
      { field: "notes", label: "Additional notes", long: true },
    ],
    files: [{ path: "documents.passport", label: "Travelling passport" }],
  },
  {
    key: "forms",
    label: "Other applications",
    singular: "Application",
    collection: collections.formSubmissions,
    columns: [
      { field: "name", label: "Name" },
      { field: "formTitle", label: "Form" },
      { field: "email", label: "Email" },
    ],
    detail: [
      { field: "formTitle", label: "Form" },
      { field: "name", label: "Full name" },
      { field: "email", label: "Email" },
      { field: "fees", label: "Fees quoted", long: true },
      { field: "paymentMethod", label: "Preferred payment method" },
    ],
  },
  {
    key: "requests",
    label: "Staff requests",
    singular: "Staff request",
    collection: collections.staffRequests,
    columns: [
      { field: "company", label: "Company" },
      { field: "role", label: "Role" },
      { field: "name", label: "Contact" },
    ],
    detail: [
      { field: "name", label: "Name" },
      { field: "company", label: "Company" },
      { field: "email", label: "Email" },
      { field: "phone", label: "Phone" },
      { field: "service", label: "Service" },
      { field: "industry", label: "Industry" },
      { field: "role", label: "Role(s)" },
      { field: "headcount", label: "Number of people" },
      { field: "start", label: "Start date" },
      { field: "details", label: "Details", long: true },
    ],
  },
  {
    key: "messages",
    label: "Contact messages",
    singular: "Message",
    collection: collections.contacts,
    columns: [
      { field: "name", label: "Name" },
      { field: "topic", label: "Topic" },
      { field: "country", label: "Country" },
    ],
    detail: [
      { field: "name", label: "Name" },
      { field: "email", label: "Email" },
      { field: "phone", label: "Phone" },
      { field: "country", label: "Country" },
      { field: "topic", label: "Topic" },
      { field: "message", label: "Message", long: true },
    ],
  },
  {
    key: "cvs",
    label: "CVs from CV maker",
    singular: "CV",
    collection: collections.cvs,
    columns: [
      { field: "name", label: "Name" },
      { field: "email", label: "Email" },
    ],
    detail: [
      { field: "name", label: "Name" },
      { field: "email", label: "Email" },
    ],
  },
  {
    key: "cv-downloads",
    label: "CV download purchases",
    singular: "CV download purchase",
    collection: collections.cvDownloads,
    columns: [
      { field: "name", label: "Name" },
      { field: "email", label: "Email" },
      { field: "paymentMethod", label: "Payment" },
    ],
    detail: [
      { field: "name", label: "Name" },
      { field: "email", label: "Email" },
      { field: "paymentMethod", label: "Preferred payment method" },
      { field: "fee", label: "Amount to collect" },
      { field: "unlockCode", label: "Unlock code (send only after payment)" },
      { field: "redeemedAt", label: "First unlocked" },
    ],
  },
  {
    key: "subscribers",
    label: "Newsletter subscribers",
    singular: "Subscriber",
    collection: collections.newsletter,
    columns: [{ field: "email", label: "Email" }],
    detail: [{ field: "email", label: "Email" }],
  },
];

export function getInboxType(key: string) {
  return inboxTypes.find((t) => t.key === key);
}

/** Reads a dotted path such as "documents.passport" from a submission. */
export function getPath(doc: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((v, k) => (v && typeof v === "object" ? (v as Record<string, unknown>)[k] : undefined), doc);
}

/** Answers to custom fields added in Admin → Forms, stored with the label shown at the time. */
export type CustomAnswer = { key: string; label: string; value: string };
export type CustomFile = { key: string; label: string; file: StoredCv };

export function customFiles(doc: Record<string, unknown>) {
  return Array.isArray(doc.extraFiles) ? (doc.extraFiles as CustomFile[]) : [];
}

/** The uploaded files on a submission, for deleting them alongside it. */
export function storedFiles(inbox: Pick<InboxType, "files">, doc: Record<string, unknown> | null | undefined) {
  if (!doc) return [];
  return [
    ...(inbox.files ?? []).map((f) => getPath(doc, f.path) as StoredCv | undefined),
    ...customFiles(doc).map((f) => f.file),
  ].filter((f): f is StoredCv => !!f);
}

/** Projection that loads a submission's file details without the file bytes. */
export function withoutFileData(inbox: Pick<InboxType, "files">) {
  return { ...Object.fromEntries((inbox.files ?? []).map((f) => [`${f.path}.data`, 0])), "extraFiles.file.data": 0 };
}

/** Projection that leaves out uploaded files entirely (for lists). */
export function withoutFiles(inbox: Pick<InboxType, "files">) {
  return { ...Object.fromEntries((inbox.files ?? []).map((f) => [f.path.split(".")[0], 0])), extraFiles: 0 };
}
