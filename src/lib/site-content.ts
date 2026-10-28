import "server-only";
import { cache } from "react";
import { collections, DatabaseNotConfiguredError, getDb } from "@/lib/db";
import * as defaults from "@/lib/content";
import { iconNames, type IconName } from "@/lib/content";
import { isAllowedImageSrc } from "@/lib/media";
import { applyTips, employerFaq, jobSeekerFaq } from "@/lib/faq";

// Editable site content. Each section is stored as one document in the `content` collection:
// { key, value, updatedAt, updatedBy }. Sections never saved fall back to the defaults in code.

export type FieldType = "text" | "textarea" | "lines" | "icon" | "image";
export type ContentField = { name: string; label: string; type?: FieldType; placeholder?: string };

type Def = {
  label: string;
  description: string;
  kind: "list" | "object";
  itemLabel?: string;
  fields: ContentField[];
  default: unknown;
  usedOn: string[];
  group?: "Company" | "Page sections" | "Help & FAQ" | "Settings";
};

const iconFields: ContentField[] = [
  { name: "icon", label: "Icon", type: "icon" },
  { name: "title", label: "Title" },
  { name: "text", label: "Text", type: "textarea" },
];

type IconItem = { icon: IconName; title: string; text: string };

export const contentDefs = {
  retention: {
    label: "Data retention",
    description: "How many months to keep submissions before they're deleted automatically. Leave empty or 0 to keep them.",
    kind: "object",
    fields: [
      { name: "applicationsMonths", label: "Job applications (months)", placeholder: "24" },
      { name: "cvsMonths", label: "CVs from the CV maker (months)", placeholder: "24" },
      { name: "messagesMonths", label: "Contact messages (months)", placeholder: "12" },
      { name: "requestsMonths", label: "Staff requests (months)", placeholder: "36" },
      { name: "visaMonths", label: "Visa applications (months)", placeholder: "24" },
      { name: "ticketsMonths", label: "Air ticket requests (months)", placeholder: "12" },
      { name: "formsMonths", label: "Other applications from Admin → Forms (months)", placeholder: "24" },
    ],
    default: { applicationsMonths: "24", cvsMonths: "24", messagesMonths: "12", requestsMonths: "36", visaMonths: "24", ticketsMonths: "12", formsMonths: "24" },
    usedOn: [],
    group: "Settings",
  },
  notifications: {
    label: "Email notifications",
    description: "Who receives an email when a new application, staff request, message or CV arrives.",
    kind: "object",
    fields: [{ name: "recipients", label: "Recipient emails (comma-separated)", placeholder: "recruitment@yourdomain.com, ops@yourdomain.com" }],
    default: { recipients: "" },
    usedOn: [],
    group: "Settings",
  },
  stats: {
    label: "Company figures",
    description: "The four headline numbers shown on the homepage, employer and who-we-are pages.",
    kind: "list",
    itemLabel: "Figure",
    fields: [
      { name: "value", label: "Number", placeholder: "1,200+" },
      { name: "label", label: "Label", placeholder: "Candidates placed every year" },
    ],
    default: defaults.stats,
    usedOn: ["/", "/employers", "/employers/who-we-are"],
    group: "Company",
  },
  company: {
    label: "Contact details",
    description: "General contact email shown on the contact page.",
    kind: "object",
    fields: [{ name: "contactEmail", label: "Contact email" }],
    default: { contactEmail: defaults.contactEmail },
    usedOn: ["/contact-us"],
    group: "Company",
  },
  offices: {
    label: "Offices",
    description: "Office cards on the contact page.",
    kind: "list",
    itemLabel: "Office",
    fields: [
      { name: "city", label: "City" },
      { name: "address", label: "Address" },
      { name: "phone", label: "Phone" },
    ],
    default: defaults.offices,
    usedOn: ["/contact-us"],
    group: "Company",
  },
  milestones: {
    label: "Company story",
    description: "Timeline on the who-we-are page.",
    kind: "list",
    itemLabel: "Milestone",
    fields: [
      { name: "period", label: "Title or year", placeholder: "2019" },
      { name: "text", label: "Text", type: "textarea" },
    ],
    default: defaults.milestones,
    usedOn: ["/employers/who-we-are"],
    group: "Company",
  },
  divisions: {
    label: "Divisions",
    description: "Group brands on the who-we-are page.",
    kind: "list",
    itemLabel: "Division",
    fields: [
      { name: "name", label: "Name" },
      { name: "text", label: "Description", type: "textarea" },
      { name: "href", label: "Link", placeholder: "/employers/solutions/training" },
    ],
    default: defaults.divisions,
    usedOn: ["/employers/who-we-are"],
    group: "Company",
  },
  jobSeekerFaq: {
    label: "Job seeker FAQ",
    description: "Questions and answers on the job seeker FAQ page.",
    kind: "list",
    itemLabel: "Question",
    fields: [
      { name: "q", label: "Question" },
      { name: "a", label: "Answer", type: "textarea" },
    ],
    default: jobSeekerFaq,
    usedOn: ["/faq"],
    group: "Help & FAQ",
  },
  employerFaq: {
    label: "Employer FAQ",
    description: "Questions and answers on the employer FAQ page.",
    kind: "list",
    itemLabel: "Question",
    fields: [
      { name: "q", label: "Question" },
      { name: "a", label: "Answer", type: "textarea" },
    ],
    default: employerFaq,
    usedOn: ["/employers/faq"],
    group: "Help & FAQ",
  },
  applyTips: {
    label: "Application tips",
    description: "Expandable tips on the working-with-Bridge page.",
    kind: "list",
    itemLabel: "Tip",
    fields: [
      { name: "title", label: "Title" },
      { name: "points", label: "Tips (one per line)", type: "lines" },
    ],
    default: applyTips,
    usedOn: ["/working-with-bridge"],
    group: "Help & FAQ",
  },
  bridgeDifference: {
    label: "The Bridge difference",
    description: "Image-and-text section below the stats on the employers page.",
    kind: "object",
    fields: [
      { name: "title", label: "Heading" },
      { name: "text", label: "Text", type: "textarea" },
      { name: "points", label: "Bullet points (one per line)", type: "lines" },
      { name: "image", label: "Image", type: "image" },
    ],
    default: {
      title: "The Bridge difference",
      text: "We pair specialist recruiters who understand your sector with the reach of a multi-country network. That means faster shortlists, better-matched candidates and one partner who can support you across temporary, permanent and outsourced hiring.",
      points: [
        "Consultants who specialise in your industry",
        "Compliance, payroll and contracts handled for you",
        "Clear service levels and regular reporting",
      ],
      image: "/images/meeting-table.jpg",
    },
    usedOn: ["/employers"],
    group: "Page sections",
  },
  workModels: {
    label: "Ways of working",
    description: "The delivery models on the how-we-work page.",
    kind: "list",
    itemLabel: "Model",
    fields: [
      { name: "title", label: "Title" },
      { name: "text", label: "Text", type: "textarea" },
      { name: "points", label: "Bullet points (one per line)", type: "lines" },
      { name: "image", label: "Image", type: "image" },
      { name: "href", label: "More-information link (optional)", placeholder: "/employers/solutions/outsourcing" },
    ],
    default: defaults.workModels.map((m) => ({ ...m, href: m.href ?? "" })),
    usedOn: ["/employers/how-we-work"],
    group: "Page sections",
  },
  technology: {
    label: "Powered by technology",
    description: "Six-item grid on employer, solution and who-we-are pages.",
    kind: "list",
    itemLabel: "Item",
    fields: iconFields,
    default: defaults.technology as IconItem[],
    usedOn: ["/employers", "/employers/solutions", "/employers/who-we-are"],
    group: "Page sections",
  },
  advantages: {
    label: "The Bridge advantage",
    description: "Four-item band on employer, solution and industry pages.",
    kind: "list",
    itemLabel: "Advantage",
    fields: iconFields,
    default: defaults.advantages as IconItem[],
    usedOn: ["/employers", "/employers/solutions", "/employers/industries"],
    group: "Page sections",
  },
  whyBridge: {
    label: "Why employers choose Bridge",
    description: "Feature grid on each service and industry page.",
    kind: "list",
    itemLabel: "Reason",
    fields: iconFields,
    default: defaults.whyBridge as IconItem[],
    usedOn: ["/employers/solutions/flexible-staffing", "/employers/industries/healthcare"],
    group: "Page sections",
  },
  hiringSteps: {
    label: "Our hiring process",
    description: "Numbered steps on each service page.",
    kind: "list",
    itemLabel: "Step",
    fields: iconFields,
    default: defaults.hiringSteps as IconItem[],
    usedOn: ["/employers/solutions/flexible-staffing"],
    group: "Page sections",
  },
  candidateJourney: {
    label: "Your journey with Bridge",
    description: "Numbered steps on the working-with-Bridge page.",
    kind: "list",
    itemLabel: "Step",
    fields: iconFields,
    default: [
      { icon: "search", title: "Find a role", text: "Search our jobs or browse by country and industry." },
      { icon: "send", title: "Apply", text: "Send your application and CV in a couple of minutes." },
      { icon: "chat", title: "Talk to a consultant", text: "We call to learn about your skills, goals and availability." },
      { icon: "check", title: "Get prepared", text: "We help with your CV, assessments and interview practice." },
      { icon: "handshake", title: "Meet the employer", text: "We arrange interviews and pass on feedback either way." },
      { icon: "rocket", title: "Start your new job", text: "We sort paperwork and stay in touch after you begin." },
    ] as IconItem[],
    usedOn: ["/working-with-bridge"],
    group: "Page sections",
  },
  refugeeHelp: {
    label: "Refugees: how we can help",
    description: "Feature grid on the jobs-for-refugees page.",
    kind: "list",
    itemLabel: "Item",
    fields: iconFields,
    default: [
      { icon: "chat", title: "One-to-one advice", text: "A consultant who listens, explains how work and hiring work locally, and answers your questions." },
      { icon: "cv", title: "CV and interview help", text: "We help you show your skills and experience in a way local employers understand." },
      { icon: "academic", title: "Training and certificates", text: "Courses through Bridge Academy to update skills or gain local certifications." },
      { icon: "handshake", title: "Inclusive employers", text: "We work with employers who are committed to giving refugees a fair chance." },
    ] as IconItem[],
    usedOn: ["/jobs-for-refugees"],
    group: "Page sections",
  },
  refugeeSteps: {
    label: "Refugees: getting started",
    description: "Numbered steps on the jobs-for-refugees page.",
    kind: "list",
    itemLabel: "Step",
    fields: iconFields,
    default: [
      { icon: "phone", title: "Get in touch", text: "Contact us online or visit one of our offices. You can bring someone to help translate." },
      { icon: "shield", title: "Check your documents", text: "Together we check what you need to be allowed to work and how to get it." },
      { icon: "search", title: "Find the right role", text: "We match your skills and goals with suitable jobs, training or both." },
      { icon: "rocket", title: "Start and grow", text: "We stay in touch after you start and help you plan your next step." },
    ] as IconItem[],
    usedOn: ["/jobs-for-refugees"],
    group: "Page sections",
  },
  refugeeFaq: {
    label: "Refugees: common questions",
    description: "Questions and answers on the jobs-for-refugees page.",
    kind: "list",
    itemLabel: "Question",
    fields: [
      { name: "q", label: "Question" },
      { name: "a", label: "Answer", type: "textarea" },
    ],
    default: [
      { q: "Do I have to pay for your help?", a: "No. Our service is always free for job seekers, including refugees and displaced people. Never pay anyone who asks for money to get you a job." },
      { q: "What documents do I need?", a: "This depends on the country. Usually you need proof of identity and proof that you are allowed to work, such as a residence permit or a work permit. If you are not sure what you have or what you need, talk to us and we will help you find out." },
      { q: "My qualifications are from another country. Can I still use them?", a: "Often, yes. Many qualifications can be recognised or compared. We can point you to the right recognition body and suggest roles where your experience counts while you wait." },
      { q: "I don't speak the local language well yet. Can I still apply?", a: "Yes. Some roles need only basic language skills to start, and we can tell you about language courses. Tell your consultant which languages you speak; they can be an advantage." },
    ],
    usedOn: ["/jobs-for-refugees"],
    group: "Help & FAQ",
  },
} satisfies Record<string, Def>;

export type ContentKey = keyof typeof contentDefs;
export type ContentValue<K extends ContentKey> = (typeof contentDefs)[K]["default"];

export function isContentKey(key: string): key is ContentKey {
  return key in contentDefs;
}

type ContentDoc = { key: string; value: unknown; updatedAt: Date; updatedBy?: string };

async function contentCollection() {
  return (await getDb()).collection<ContentDoc>(collections.content);
}

/** Reads one content section (deduplicated per request). Falls back to the code default. */
export const getContent = cache(async <K extends ContentKey>(key: K): Promise<ContentValue<K>> => {
  try {
    const doc = await (await contentCollection()).findOne({ key });
    return (doc?.value as ContentValue<K>) ?? contentDefs[key].default;
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) return contentDefs[key].default;
    throw error;
  }
});

export async function getContentMeta(key: ContentKey) {
  const doc = await (await contentCollection()).findOne({ key }, { projection: { updatedAt: 1, updatedBy: 1 } });
  return doc ? { updatedAt: doc.updatedAt, updatedBy: doc.updatedBy } : null;
}

/* ---------------- Validation ---------------- */

const MAX_TEXT = 4000;
const MAX_ITEMS = 100;

function cleanItem(fields: ContentField[], raw: unknown) {
  if (typeof raw !== "object" || raw === null) throw new Error("Invalid item");
  const src = raw as Record<string, unknown>;
  const out: Record<string, string | string[]> = {};
  for (const f of fields) {
    const v = src[f.name];
    if (f.type === "lines") {
      const list = Array.isArray(v) ? v : String(v ?? "").split("\n");
      out[f.name] = list.map((l) => String(l).trim().slice(0, MAX_TEXT)).filter(Boolean);
    } else if (f.type === "icon") {
      const icon = String(v ?? "");
      out[f.name] = (iconNames as readonly string[]).includes(icon) ? icon : "check";
    } else if (f.type === "image") {
      out[f.name] = String(v ?? "").trim(); // checked in saveContent (async)
    } else {
      out[f.name] = String(v ?? "").trim().slice(0, MAX_TEXT);
    }
  }
  return out;
}

export function validateContent(key: ContentKey, value: unknown) {
  const def: Def = contentDefs[key];
  if (def.kind === "object") return cleanItem(def.fields, value);
  if (!Array.isArray(value)) throw new Error("Expected a list");
  if (value.length > MAX_ITEMS) throw new Error(`At most ${MAX_ITEMS} items`);
  return value
    .map((item) => cleanItem(def.fields, item))
    .filter((item) => Object.values(item).some((v) => (Array.isArray(v) ? v.length > 0 : v !== "")));
}

export async function saveContent(key: ContentKey, value: unknown, updatedBy: string) {
  const clean = validateContent(key, value);
  const imageFields = (contentDefs[key].fields as ContentField[]).filter((f) => f.type === "image").map((f) => f.name);
  for (const item of Array.isArray(clean) ? clean : [clean]) {
    for (const name of imageFields) {
      const src = item[name];
      if (typeof src === "string" && src && !(await isAllowedImageSrc(src))) {
        throw new Error("One of the images isn't allowed. Pick it from the media library.");
      }
    }
  }
  await (await contentCollection()).updateOne(
    { key },
    { $set: { key, value: clean, updatedAt: new Date(), updatedBy } },
    { upsert: true },
  );
}

export async function resetContent(key: ContentKey) {
  await (await contentCollection()).deleteOne({ key });
}
