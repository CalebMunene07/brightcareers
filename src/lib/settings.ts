import "server-only";
import { collections, DatabaseNotConfiguredError, getDb } from "@/lib/db";
import { open, seal } from "@/lib/secret-box";

// Service credentials and settings managed in Admin → Settings.
// Stored in the `settings` collection (secrets encrypted). Environment variables still work
// as a fallback, so an existing .env.local keeps working until values are saved here.
// MONGODB_URI and AUTH_SECRET always stay in the environment.

export type SettingField = {
  key: string;
  label: string;
  env: string; // fallback environment variable
  secret?: boolean;
  color?: boolean; // shown as a colour picker; value is a #rrggbb hex colour
  placeholder?: string;
  help?: string;
  options?: { value: string; label: string }[];
};

export type SettingSection = { id: string; title: string; description: string; fields: SettingField[] };

export const settingSections: SettingSection[] = [
  {
    id: "branding",
    title: "Brand colours",
    description: "The colours used across the website and admin: headers, buttons, links and highlights.",
    fields: [
      { key: "brandColor", label: "Main colour", env: "THEME_BRAND", color: true, placeholder: "#da291c", help: "Buttons, links and section backgrounds." },
      { key: "brandDarkColor", label: "Dark colour", env: "THEME_BRAND_DARK", color: true, placeholder: "#7a0d12", help: "Hero banners, footer and headings." },
      { key: "accentColor", label: "Accent colour", env: "THEME_ACCENT", color: true, placeholder: "#ffc133", help: "Highlights and call-to-action buttons." },
    ],
  },
  {
    id: "email",
    title: "Email (SMTP)",
    description: "Used to email your team when new applications, requests, messages and CVs arrive. Works with any provider.",
    fields: [
      { key: "smtpHost", label: "SMTP host", env: "SMTP_HOST", placeholder: "smtp.gmail.com" },
      { key: "smtpPort", label: "Port", env: "SMTP_PORT", placeholder: "587", help: "587 (STARTTLS) or 465 (SSL)." },
      { key: "smtpUser", label: "Username", env: "SMTP_USER" },
      { key: "smtpPass", label: "Password / app password", env: "SMTP_PASS", secret: true },
      { key: "smtpFrom", label: "From address", env: "SMTP_FROM", placeholder: "Bridge Careers Global <no-reply@yourdomain.com>" },
      { key: "siteUrl", label: "Website address", env: "SITE_URL", placeholder: "https://www.yourdomain.com", help: "Used for links in emails." },
    ],
  },
  {
    id: "storage",
    title: "Cloudflare R2 storage",
    description: "Image uploads (public bucket) and uploaded CVs (private bucket). Create an R2 API token with Object Read & Write.",
    fields: [
      { key: "r2AccountId", label: "Account ID", env: "R2_ACCOUNT_ID" },
      { key: "r2AccessKeyId", label: "Access key ID", env: "R2_ACCESS_KEY_ID" },
      { key: "r2SecretAccessKey", label: "Secret access key", env: "R2_SECRET_ACCESS_KEY", secret: true },
      { key: "r2Bucket", label: "Public bucket (images)", env: "R2_BUCKET" },
      { key: "r2PublicUrl", label: "Public bucket URL", env: "R2_PUBLIC_URL", placeholder: "https://pub-xxxx.r2.dev" },
      { key: "r2PrivateBucket", label: "Private bucket (CVs)", env: "R2_PRIVATE_BUCKET", help: "Must NOT have public access. Leave empty to keep CVs in MongoDB." },
    ],
  },
  {
    id: "translation",
    title: "Translation",
    description: "Machine translation for French, Portuguese and Swahili. Without one, translate by hand in Admin → Translations.",
    fields: [
      {
        key: "translator",
        label: "Service",
        env: "TRANSLATOR",
        options: [
          { value: "", label: "Automatic (first one with a key)" },
          { value: "azure", label: "Microsoft Azure Translator" },
          { value: "google", label: "Google Cloud Translation" },
          { value: "ai", label: "AI (AI Gateway)" },
        ],
      },
      { key: "azureTranslatorKey", label: "Azure Translator key", env: "AZURE_TRANSLATOR_KEY", secret: true, help: "Free tier F0: 2 million characters a month." },
      { key: "azureTranslatorRegion", label: "Azure region", env: "AZURE_TRANSLATOR_REGION", placeholder: "southafricanorth" },
      { key: "googleTranslateApiKey", label: "Google Translate API key", env: "GOOGLE_TRANSLATE_API_KEY", secret: true },
    ],
  },
  {
    id: "ai",
    title: "AI (Vercel AI Gateway)",
    description: "Powers the CV maker's writing help and the optional AI translator. Leave the key empty to turn AI features off.",
    fields: [
      { key: "aiGatewayApiKey", label: "AI Gateway API key", env: "AI_GATEWAY_API_KEY", secret: true },
      { key: "cvAiModel", label: "CV help model", env: "CV_AI_MODEL", placeholder: "anthropic/claude-haiku-4.5" },
      { key: "translateAiModel", label: "AI translation model", env: "TRANSLATE_AI_MODEL", placeholder: "anthropic/claude-haiku-4.5" },
    ],
  },
  {
    id: "security",
    title: "Scheduled jobs",
    description: "Secret your scheduler sends to /api/cron/retention as “Authorization: Bearer <secret>”.",
    fields: [{ key: "cronSecret", label: "Cron secret", env: "CRON_SECRET", secret: true, help: "Use a long random string." }],
  },
];

export const allFields = settingSections.flatMap((s) => s.fields);
type Key = (typeof allFields)[number]["key"];
export type Settings = Record<string, string>;

type Stored = { value: string; sealed?: boolean };
type Doc = { _id: string; values: Record<string, Stored>; updatedAt: Date; updatedBy?: string };

const CACHE_MS = 15_000;
let cache: { at: number; values: Record<string, Stored> } | null = null;

async function col() {
  return (await getDb()).collection<Doc>(collections.settings);
}

async function loadStored(): Promise<Record<string, Stored>> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.values;
  let values: Record<string, Stored> = {};
  try {
    values = (await (await col()).findOne({ _id: "app" }))?.values ?? {};
  } catch (error) {
    if (!(error instanceof DatabaseNotConfiguredError)) throw error;
  }
  cache = { at: Date.now(), values };
  return values;
}

/** Resolved settings: the admin value if saved, otherwise the environment variable, otherwise "". */
export async function getSettings(): Promise<Settings> {
  const stored = await loadStored();
  const out: Settings = {};
  for (const f of allFields) {
    const s = stored[f.key];
    const fromDb = s ? (s.sealed ? open(s.value) : s.value) : null;
    out[f.key] = (fromDb ?? process.env[f.env] ?? "").trim();
  }
  return out;
}

export async function setting(key: Key) {
  return (await getSettings())[key] ?? "";
}

/** What the admin form may see: plain values, and only whether each secret is set (and where from). */
export async function getSettingsForAdmin() {
  const stored = await loadStored();
  return Object.fromEntries(
    allFields.map((f) => {
      const s = stored[f.key];
      const unreadable = !!s?.sealed && open(s.value) === null;
      const source: "admin" | "env" | "none" = s ? "admin" : process.env[f.env] ? "env" : "none";
      const value = f.secret ? "" : s ? s.value : (process.env[f.env] ?? "");
      return [f.key, { value, source, unreadable }];
    }),
  ) as Record<string, { value: string; source: "admin" | "env" | "none"; unreadable: boolean }>;
}

/**
 * Saves one section. Secret fields left empty keep their current value; `clear` lists secret
 * keys to remove (falling back to the environment variable, if any).
 */
export async function saveSection(sectionId: string, input: Record<string, string>, clear: string[], updatedBy: string) {
  const section = settingSections.find((s) => s.id === sectionId);
  if (!section) throw new Error("Unknown settings section");
  const set: Record<string, Stored> = {};
  const unset: string[] = [];
  for (const f of section.fields) {
    const v = (input[f.key] ?? "").trim().slice(0, 4000);
    if (f.secret) {
      if (clear.includes(f.key)) unset.push(f.key);
      else if (v) set[f.key] = { value: seal(v), sealed: true };
    } else if (v) {
      set[f.key] = { value: v };
    } else {
      unset.push(f.key);
    }
  }
  await (await col()).updateOne(
    { _id: "app" },
    {
      $set: { ...Object.fromEntries(Object.entries(set).map(([k, v]) => [`values.${k}`, v])), updatedAt: new Date(), updatedBy },
      ...(unset.length ? { $unset: Object.fromEntries(unset.map((k) => [`values.${k}`, ""])) } : {}),
    },
    { upsert: true },
  );
  cache = null;
}
