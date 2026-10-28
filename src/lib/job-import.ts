import "server-only";
import { parseCsv } from "@/lib/csv";
import { getAllIndustries } from "@/lib/industries-repo";
import { formatLocation, jobSlug, jobTypes, todayIso, type Job, type JobType } from "@/lib/jobs";
import { REMOTE } from "@/lib/locations";
import { getAllCountries } from "@/lib/locations-repo";
import { slugify } from "@/lib/text";

// Spreadsheet (CSV) job import. List cells (responsibilities, requirements) use "|" between items.

export const importColumns = [
  { key: "title", label: "title", required: true, example: "Registered Nurse" },
  { key: "slug", label: "slug", required: false, example: "" },
  { key: "company", label: "company", required: true, example: "Private hospital group" },
  { key: "city", label: "city", required: false, example: "Lusaka" },
  { key: "country", label: "country", required: true, example: "Zambia" },
  { key: "type", label: "type", required: true, example: "Permanent" },
  { key: "industry", label: "industry", required: true, example: "healthcare" },
  { key: "salary", label: "salary", required: true, example: "Competitive + benefits" },
  { key: "posted", label: "posted", required: false, example: "2026-10-03" },
  { key: "closes", label: "closes", required: false, example: "2026-11-03" },
  { key: "summary", label: "summary", required: true, example: "Join a growing private hospital." },
  { key: "responsibilities", label: "responsibilities", required: false, example: "Deliver patient care|Keep accurate records" },
  { key: "requirements", label: "requirements", required: false, example: "Registered nurse|2+ years' experience" },
  { key: "published", label: "published", required: false, example: "yes" },
] as const;

export const MAX_IMPORT_ROWS = 1000;

export type ImportRowError = { row: number; messages: string[] };
export type ParsedImport = { jobs: Job[]; errors: ImportRowError[]; total: number };

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export async function parseJobCsv(text: string): Promise<ParsedImport> {
  const rows = parseCsv(text);
  if (rows.length < 2) return { jobs: [], errors: [{ row: 1, messages: ["The file has no job rows under the header."] }], total: 0 };

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const missing = importColumns.filter((c) => c.required && !header.includes(c.key)).map((c) => c.key);
  if (missing.length > 0) {
    return { jobs: [], errors: [{ row: 1, messages: [`Missing column(s): ${missing.join(", ")}. Use the template.`] }], total: 0 };
  }
  const body = rows.slice(1);
  if (body.length > MAX_IMPORT_ROWS) {
    return { jobs: [], errors: [{ row: 1, messages: [`Too many rows (max ${MAX_IMPORT_ROWS}). Split the file.`] }], total: body.length };
  }

  const [industries, countries] = await Promise.all([getAllIndustries(), getAllCountries()]);
  const today = todayIso();
  const seen = new Set<string>();
  const jobs: Job[] = [];
  const errors: ImportRowError[] = [];

  body.forEach((cells, i) => {
    const rowNumber = i + 2; // matches the spreadsheet row (header is row 1)
    const get = (key: string) => (cells[header.indexOf(key)] ?? "").trim();
    const list = (key: string) => get(key).split("|").map((s) => s.trim()).filter(Boolean);
    const messages: string[] = [];

    for (const c of importColumns) if (c.required && !get(c.key)) messages.push(`${c.key} is required`);

    const typeRaw = get("type");
    const type = jobTypes.find((t) => t.toLowerCase() === typeRaw.toLowerCase());
    if (typeRaw && !type) messages.push(`type must be one of ${jobTypes.join(", ")}`);

    const industryRaw = get("industry").toLowerCase();
    const industry = industries.find((x) => x.slug === industryRaw || x.name.toLowerCase() === industryRaw);
    if (industryRaw && !industry) messages.push(`unknown industry "${get("industry")}"`);

    const countryRaw = get("country");
    const country =
      countryRaw.toLowerCase() === REMOTE.toLowerCase() ? REMOTE : (countries.find((c) => c.toLowerCase() === countryRaw.toLowerCase()) ?? countryRaw);
    if (countryRaw && country !== REMOTE && !countries.includes(country)) messages.push(`unknown country "${countryRaw}"`);

    const posted = get("posted") || today;
    const closes = get("closes");
    if (!DATE.test(posted)) messages.push("posted must be YYYY-MM-DD");
    if (closes && !DATE.test(closes)) messages.push("closes must be YYYY-MM-DD");
    if (closes && DATE.test(posted) && closes < posted) messages.push("closes is before posted");

    const city = country === REMOTE ? "" : get("city");
    const slug = slugify(get("slug")) || jobSlug(get("title"), city, country);
    if (slug && seen.has(slug)) messages.push(`duplicate slug "${slug}" in this file`);
    seen.add(slug);

    const publishedRaw = get("published").toLowerCase();
    if (publishedRaw && !["yes", "no", "true", "false", "1", "0"].includes(publishedRaw)) messages.push("published must be yes or no");

    if (messages.length > 0) {
      errors.push({ row: rowNumber, messages });
      return;
    }

    jobs.push({
      slug,
      title: get("title"),
      company: get("company"),
      location: formatLocation(city, country),
      country,
      city: city || undefined,
      type: type as JobType,
      industry: industry!.slug,
      salary: get("salary"),
      posted,
      closes: closes || undefined,
      summary: get("summary"),
      responsibilities: list("responsibilities"),
      requirements: list("requirements"),
      published: !["no", "false", "0"].includes(publishedRaw),
    });
  });

  return { jobs, errors, total: body.length };
}
