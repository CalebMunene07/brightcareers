// Job types and helpers. Live jobs are stored in MongoDB (see jobs-repo.ts);
// sampleJobs seeds the database and is used as a fallback when no database is configured.

import { slugify } from "@/lib/text";

export const jobTypes = ["Permanent", "Temporary", "Contract"] as const;
export type JobType = (typeof jobTypes)[number];

export type Job = {
  slug: string;
  title: string;
  company: string;
  location: string; // display text, e.g. "Lusaka, Zambia" or "Remote"
  country?: string; // one of the picker countries, or "Remote"
  city?: string;
  type: JobType;
  industry: string; // industry slug from content.ts
  salary: string;
  posted: string; // ISO date
  closes?: string; // optional closing date (YYYY-MM-DD); the job is hidden after this day
  summary: string;
  responsibilities: string[];
  requirements: string[];
  published?: boolean;
};

export const sampleJobs: Job[] = [
  {
    slug: "registered-nurse-lusaka",
    title: "Registered Nurse",
    company: "Private hospital group",
    location: "Lusaka, Zambia",
    type: "Permanent",
    industry: "healthcare",
    salary: "Competitive + benefits",
    posted: "2026-09-29",
    summary: "Join a growing private hospital providing high-quality inpatient and outpatient care.",
    responsibilities: [
      "Deliver safe, patient-centred nursing care on a medical ward",
      "Administer medication and monitor patient progress",
      "Work closely with doctors and allied health professionals",
      "Maintain accurate clinical records",
    ],
    requirements: [
      "Registered with the national nursing council",
      "At least 2 years' post-qualification experience",
      "Strong communication and teamwork skills",
    ],
  },
  {
    slug: "software-engineer-remote",
    title: "Full-Stack Software Engineer",
    company: "Fintech scale-up",
    location: "Remote",
    type: "Permanent",
    industry: "technology",
    salary: "$45,000 – $65,000",
    posted: "2026-09-30",
    summary: "Build customer-facing payment products used by thousands of small businesses.",
    responsibilities: [
      "Design and ship features across the web app and APIs",
      "Write tests and review teammates' code",
      "Work with product and design to shape the roadmap",
    ],
    requirements: [
      "3+ years with TypeScript, React and Node.js",
      "Experience with relational databases",
      "Comfortable working in a remote, async team",
    ],
  },
  {
    slug: "warehouse-operative-johannesburg",
    title: "Warehouse Operative",
    company: "National distribution centre",
    location: "Johannesburg, South Africa",
    type: "Temporary",
    industry: "logistics",
    salary: "Hourly rate + overtime",
    posted: "2026-10-01",
    summary: "Immediate starts for picking, packing and dispatch during the peak season.",
    responsibilities: [
      "Pick and pack orders accurately using handheld scanners",
      "Load and unload deliveries safely",
      "Keep work areas clean and organised",
    ],
    requirements: [
      "Able to work shifts including weekends",
      "Previous warehouse experience is a plus",
      "Good attention to detail",
    ],
  },
  {
    slug: "accountant-london",
    title: "Management Accountant",
    company: "Professional services firm",
    location: "London, United Kingdom",
    type: "Permanent",
    industry: "finance",
    salary: "£50,000 – £58,000",
    posted: "2026-09-24",
    summary: "Own month-end reporting and support budgeting for a growing advisory business.",
    responsibilities: [
      "Prepare monthly management accounts and variance analysis",
      "Support annual budgeting and quarterly forecasts",
      "Improve reporting processes and controls",
    ],
    requirements: [
      "ACCA, CIMA or ACA qualified (or finalist)",
      "Strong Excel skills",
      "Experience in a services business preferred",
    ],
  },
  {
    slug: "civil-engineer-contract",
    title: "Civil Engineer",
    company: "Infrastructure contractor",
    location: "Ndola, Zambia",
    type: "Contract",
    industry: "engineering",
    salary: "Day rate negotiable",
    posted: "2026-09-20",
    summary: "12-month contract on a regional road rehabilitation project.",
    responsibilities: [
      "Supervise site works against design and specification",
      "Coordinate subcontractors and materials",
      "Produce progress and quality reports",
    ],
    requirements: [
      "Degree in civil engineering",
      "5+ years on roads or infrastructure projects",
      "Registered with the engineering institution",
    ],
  },
  {
    slug: "sous-chef-cape-town",
    title: "Sous Chef",
    company: "Boutique hotel",
    location: "Cape Town, South Africa",
    type: "Permanent",
    industry: "hospitality",
    salary: "Competitive + meals",
    posted: "2026-09-27",
    summary: "Help lead a small, creative kitchen team in a well-reviewed hotel restaurant.",
    responsibilities: [
      "Run the pass and lead service in the head chef's absence",
      "Train and mentor junior chefs",
      "Manage stock, ordering and food safety records",
    ],
    requirements: [
      "Previous sous chef or senior CDP experience",
      "Food safety certification",
      "Calm under pressure",
    ],
  },
  {
    slug: "site-manager-construction",
    title: "Site Manager",
    company: "Residential developer",
    location: "Lusaka, Zambia",
    type: "Contract",
    industry: "construction",
    salary: "Competitive",
    posted: "2026-09-18",
    summary: "Lead day-to-day delivery of a 60-unit residential development.",
    responsibilities: [
      "Manage site teams and subcontractors",
      "Ensure health and safety compliance",
      "Track programme and report to the project manager",
    ],
    requirements: [
      "Proven site management experience",
      "Health and safety qualification",
      "Strong planning skills",
    ],
  },
  {
    slug: "machine-operator-temp",
    title: "Machine Operator",
    company: "Food manufacturer",
    location: "Kitwe, Zambia",
    type: "Temporary",
    industry: "manufacturing",
    salary: "Hourly rate",
    posted: "2026-10-02",
    summary: "Operate packaging lines in a modern food production facility.",
    responsibilities: [
      "Set up and run packaging machinery",
      "Carry out quality checks during production",
      "Report faults and support maintenance",
    ],
    requirements: [
      "Experience in a production environment",
      "Willing to work rotating shifts",
      "Good hygiene and safety awareness",
    ],
  },
  {
    slug: "store-manager-retail",
    title: "Store Manager",
    company: "Fashion retailer",
    location: "Johannesburg, South Africa",
    type: "Permanent",
    industry: "retail",
    salary: "Base + performance bonus",
    posted: "2026-09-22",
    summary: "Lead a high-footfall store and a team of 20 sales associates.",
    responsibilities: [
      "Hit sales and margin targets",
      "Recruit, coach and schedule the store team",
      "Keep visual standards and stock levels on point",
    ],
    requirements: [
      "2+ years managing a retail store",
      "Commercial mindset",
      "Strong people leadership",
    ],
  },
  {
    slug: "maths-teacher",
    title: "Secondary Maths Teacher",
    company: "International school",
    location: "Lusaka, Zambia",
    type: "Permanent",
    industry: "education",
    salary: "Competitive + housing allowance",
    posted: "2026-09-15",
    summary: "Teach IGCSE and A-level mathematics in a supportive international school.",
    responsibilities: [
      "Plan and deliver engaging maths lessons",
      "Assess and report on student progress",
      "Contribute to extracurricular activities",
    ],
    requirements: [
      "Teaching qualification and maths degree",
      "Experience with IGCSE or A-level curricula",
      "Passion for student development",
    ],
  },
  {
    slug: "solar-technician",
    title: "Solar PV Technician",
    company: "Renewable energy installer",
    location: "Livingstone, Zambia",
    type: "Contract",
    industry: "energy",
    salary: "Monthly rate",
    posted: "2026-09-28",
    summary: "Install and commission solar systems for commercial and residential clients.",
    responsibilities: [
      "Install PV panels, inverters and batteries",
      "Test and commission systems",
      "Diagnose and repair faults",
    ],
    requirements: [
      "Electrical trade qualification",
      "Hands-on solar installation experience",
      "Valid driver's licence",
    ],
  },
  {
    slug: "office-administrator",
    title: "Office Administrator",
    company: "Logistics company",
    location: "London, United Kingdom",
    type: "Temporary",
    industry: "office",
    salary: "£14 – £16 per hour",
    posted: "2026-10-01",
    summary: "Three-month cover supporting a busy operations office.",
    responsibilities: [
      "Manage the reception desk and incoming calls",
      "Process invoices and update spreadsheets",
      "Coordinate meetings and diaries",
    ],
    requirements: [
      "Previous office or admin experience",
      "Confident with Microsoft Office",
      "Friendly and organised",
    ],
  },
];

/** The job's country: the stored value, or the last part of the location text for older jobs. */
export function jobCountry(job: Pick<Job, "country" | "location">) {
  if (job.country) return job.country;
  const parts = job.location.split(",").map((p) => p.trim()).filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

/** Builds the display location from city and country. */
export function formatLocation(city: string, country: string) {
  return city && country !== "Remote" ? `${city}, ${country}` : country;
}

/** The URL slug a job gets when none is typed: its title plus where it is, so the same role can be posted in several places. */
export function jobSlug(title: string, city: string, country: string) {
  return slugify(`${title} ${country === "Remote" ? "remote" : city || country}`);
}

export function searchJobs(
  jobs: Job[],
  filters: {
  q?: string;
  location?: string;
  type?: string;
    industry?: string;
  },
) {
  const q = filters.q?.trim().toLowerCase();
  const location = filters.location?.trim().toLowerCase();

  return jobs
    .filter((job) => {
      if (q && !`${job.title} ${job.summary} ${job.company}`.toLowerCase().includes(q)) return false;
      if (location && jobCountry(job).toLowerCase() !== location && !job.location.toLowerCase().includes(location)) return false;
      if (filters.type && job.type !== filters.type) return false;
      if (filters.industry && job.industry !== filters.industry) return false;
      return true;
    })
    .sort((a, b) => b.posted.localeCompare(a.posted));
}

/** Time zone used for "today" when comparing closing dates (set SITE_TIMEZONE to change). */
const SITE_TIMEZONE = process.env.SITE_TIMEZONE || "Africa/Lusaka";

/** Today's date as YYYY-MM-DD in the site's time zone. */
export function todayIso(now = new Date()) {
  try {
    // en-CA formats dates as YYYY-MM-DD.
    return new Intl.DateTimeFormat("en-CA", { timeZone: SITE_TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  } catch {
    return now.toISOString().slice(0, 10); // unknown time zone: fall back to UTC
  }
}

/** A job is open until the end of its closing date. Jobs without a closing date stay open. */
export function isOpen(job: Pick<Job, "closes">, today = todayIso()) {
  return !job.closes || job.closes >= today;
}

/** Whole days left until the closing date (0 = closes today), or null without one. */
export function daysUntilClose(job: Pick<Job, "closes">, today = todayIso()) {
  if (!job.closes) return null;
  return Math.round((Date.parse(job.closes) - Date.parse(today)) / 86_400_000);
}

const dateLocales: Record<string, string> = { en: "en-GB", fr: "fr-FR", pt: "pt-PT", sw: "sw-KE" };

export function formatPosted(iso: string, locale = "en") {
  return new Date(iso).toLocaleDateString(dateLocales[locale] ?? "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
