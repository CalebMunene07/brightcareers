// Public forms whose fields admins control in Admin → Forms: hide built-in fields, make them required or optional,
// and add custom fields. Core fields are what the form is built around (the visa destination drives the role list,
// the ticket route drives the fee), so they can be made optional but not removed.
// Settings are stored per form in forms-repo.ts; this file is shared with the browser.

export type FormId = "visa" | "ticket" | "application" | "contact" | "staff";

export type BuiltInField = { key: string; label: string; required: boolean; core?: boolean; section?: string };

export type FormDef = {
  id: FormId;
  title: string;
  description: string;
  page: string;
  inbox: string;
  /** Where custom fields can go. Forms without sections add them at the end. */
  sections?: { id: string; label: string }[];
  fields: BuiltInField[];
};

export const customFieldTypes = [
  { id: "text", label: "Short text" },
  { id: "textarea", label: "Long text" },
  { id: "email", label: "Email" },
  { id: "tel", label: "Phone" },
  { id: "number", label: "Number" },
  { id: "date", label: "Date" },
  { id: "select", label: "Dropdown" },
  { id: "file", label: "File upload" },
  { id: "section", label: "Section heading" },
] as const;

export type CustomFieldType = (typeof customFieldTypes)[number]["id"];

/** A custom field, or a "section" heading (label = heading, hint = description) that groups the fields after it. */
export type CustomField = {
  key: string; // custom_<id>, also the input name
  label: string;
  type: CustomFieldType;
  required: boolean;
  options: string[]; // dropdown choices
  hint: string;
  section: string;
};

/** What admins have changed. Built-in fields not listed keep their defaults. */
export type FormSettings = {
  fields: Record<string, { hidden?: boolean; required?: boolean }>;
  custom: CustomField[];
};

/** Settings applied to a form's built-in fields, ready for the page and the server. */
export type FormLayout = {
  fields: Record<string, { shown: boolean; required: boolean }>;
  custom: CustomField[];
};

export const CUSTOM_KEY = /^custom_[a-z0-9]{1,24}$/;

export const formDefs: FormDef[] = [
  {
    id: "visa",
    title: "Visa application",
    description: "The five-step application at /visa-application.",
    page: "/visa-application",
    inbox: "visa",
    sections: [
      { id: "personal", label: "Step 1 · Personal information" },
      { id: "travel", label: "Step 2 · Travel information" },
      { id: "documents", label: "Step 3 · Supporting documents" },
    ],
    fields: [
      { key: "firstName", label: "First name", required: true, section: "personal" },
      { key: "middleName", label: "Middle name", required: false, section: "personal" },
      { key: "lastName", label: "Last name", required: true, section: "personal" },
      { key: "birthDate", label: "Date of birth", required: true, section: "personal" },
      { key: "gender", label: "Gender", required: true, section: "personal" },
      { key: "nationality", label: "Nationality", required: true, section: "personal" },
      { key: "passport", label: "Passport number", required: true, section: "personal" },
      { key: "issueDate", label: "Date of issue", required: true, section: "personal" },
      { key: "expiryDate", label: "Date of expiry", required: true, section: "personal" },
      { key: "issuePlace", label: "Place of issue", required: true, section: "personal" },
      { key: "authority", label: "Issuing authority", required: true, section: "personal" },
      { key: "email", label: "Email address", required: true, section: "personal" },
      { key: "phone", label: "Phone number (with country code)", required: true, section: "personal" },
      { key: "address1", label: "Address line 1", required: true, section: "personal" },
      { key: "address2", label: "Address line 2", required: false, section: "personal" },
      { key: "city", label: "City", required: true, section: "personal" },
      { key: "province", label: "State / Province", required: true, section: "personal" },
      { key: "postal", label: "Postal / Zip code", required: true, section: "personal" },
      { key: "homeCountry", label: "Country (address)", required: true, section: "personal" },
      { key: "originCountry", label: "Departure country", required: true, section: "travel" },
      { key: "country", label: "Destination country", required: true, core: true, section: "travel" },
      { key: "job", label: "Available job role", required: true, core: true, section: "travel" },
      { key: "visaType", label: "Visa type", required: true, core: true, section: "travel" },
      { key: "startDate", label: "Preferred start date", required: false, section: "travel" },
      { key: "applicants", label: "Number of applicants", required: true, section: "travel" },
      { key: "employment", label: "Current employment status (not asked for student visas)", required: true, section: "travel" },
      { key: "occupation", label: "Occupation (not asked for student visas)", required: true, section: "travel" },
      { key: "employer", label: "Employer / Company name (not asked for student visas)", required: false, section: "travel" },
      { key: "income", label: "Monthly income (not asked for student visas)", required: false, section: "travel" },
      { key: "doc_passport", label: "Passport bio page", required: true, section: "documents" },
      { key: "doc_cv", label: "Curriculum vitae / resume", required: true, section: "documents" },
      { key: "doc_certificates", label: "Relevant certificates", required: false, section: "documents" },
      { key: "doc_photo", label: "Passport-sized photograph", required: true, section: "documents" },
      { key: "paymentMethod", label: "Payment method", required: true, core: true },
    ],
  },
  {
    id: "ticket",
    title: "Air ticket booking",
    description: "The booking request at /air-ticket-booking.",
    page: "/air-ticket-booking",
    inbox: "tickets",
    fields: [
      { key: "from", label: "Departure country", required: true, core: true },
      { key: "to", label: "Destination", required: true, core: true },
      { key: "departDate", label: "Departure date", required: true },
      { key: "returnDate", label: "Return date", required: false },
      { key: "passengers", label: "Passengers", required: true },
      { key: "travelClass", label: "Travel class", required: true },
      { key: "email", label: "Email address", required: true },
      { key: "passportFile", label: "Travelling passport (bio page)", required: true },
      { key: "notes", label: "Additional notes", required: false },
    ],
  },
  {
    id: "application",
    title: "Job application",
    description: "The “Apply for this job” form on every job page.",
    page: "/jobs",
    inbox: "applications",
    fields: [
      { key: "name", label: "Full name", required: true },
      { key: "email", label: "Email", required: true },
      { key: "phone", label: "Phone", required: true },
      { key: "location", label: "Current location", required: false },
      { key: "cv", label: "CV (PDF or Word, max 4 MB)", required: true },
      { key: "message", label: "Cover note", required: false },
    ],
  },
  {
    id: "contact",
    title: "Contact us",
    description: "The message form at /contact-us.",
    page: "/contact-us",
    inbox: "messages",
    fields: [
      { key: "name", label: "Full name", required: true },
      { key: "email", label: "Email", required: true },
      { key: "phone", label: "Phone", required: false },
      { key: "country", label: "Country", required: false },
      { key: "topic", label: "I am…", required: false },
      { key: "message", label: "Message", required: true },
    ],
  },
  {
    id: "staff",
    title: "Request staff",
    description: "The employer form at /employers/request-staff.",
    page: "/employers/request-staff",
    inbox: "requests",
    fields: [
      { key: "name", label: "Your name", required: true },
      { key: "company", label: "Company", required: true },
      { key: "email", label: "Work email", required: true },
      { key: "phone", label: "Phone", required: false },
      { key: "service", label: "Service", required: false },
      { key: "industry", label: "Industry", required: false },
      { key: "role", label: "Role(s) you're hiring for", required: true },
      { key: "headcount", label: "Number of people", required: false },
      { key: "start", label: "Ideal start date", required: false },
      { key: "details", label: "Tell us more", required: true },
    ],
  },
];

export function getFormDef(id: string) {
  return formDefs.find((f) => f.id === id);
}

export const emptySettings: FormSettings = { fields: {}, custom: [] };

export function resolveLayout(def: FormDef, settings: FormSettings): FormLayout {
  const fields: FormLayout["fields"] = {};
  for (const f of def.fields) {
    const s = settings.fields[f.key] ?? {};
    fields[f.key] = { shown: f.core || !s.hidden, required: s.required ?? f.required };
  }
  return { fields, custom: settings.custom };
}

/** A built-in field is on the form (unknown keys count as shown, so code-only fields keep working). */
export function shown(layout: FormLayout, key: string) {
  return layout.fields[key]?.shown ?? true;
}

/** A built-in or custom field must be filled in. */
export function isRequired(layout: FormLayout, key: string) {
  const f = layout.fields[key];
  if (f) return f.shown && f.required;
  return layout.custom.some((c) => c.key === key && c.required);
}

/** Custom fields for one section (or every custom field for forms without sections). */
export function customIn(layout: FormLayout, section?: string) {
  return section === undefined ? layout.custom : layout.custom.filter((c) => c.section === section);
}

/** Fields that identify the person: the editor warns before they're made optional or removed. */
export const contactFields = ["email", "name", "firstName", "lastName"];

/** Every label, option and hint of the custom fields, for translation. */
export function customStrings(layout: FormLayout) {
  return layout.custom.flatMap((c) => [c.label, c.hint, ...c.options]).filter(Boolean);
}

/** File types accepted by custom file fields. */
export const CUSTOM_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
export const CUSTOM_FILE_ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx";
