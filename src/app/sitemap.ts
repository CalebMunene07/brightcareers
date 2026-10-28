import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getPublishedArticles } from "@/lib/articles-repo";
import { getPublishedCustomForms } from "@/lib/custom-forms-repo";
import { getPublishedIndustries } from "@/lib/industries-repo";
import { getPublishedJobs } from "@/lib/jobs-repo";
import { legalSlugs } from "@/lib/legal-repo";
import { siteUrl } from "@/lib/seo";
import { getPublishedSolutions } from "@/lib/solutions-repo";

// Every public page, including open jobs and published articles, built on request so new content shows up straight away.

const staticPages: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/jobs", priority: 0.9, changeFrequency: "daily" },
  { path: "/visa-application", priority: 0.8, changeFrequency: "monthly" },
  { path: "/air-ticket-booking", priority: 0.7, changeFrequency: "monthly" },
  { path: "/cv-maker", priority: 0.7, changeFrequency: "monthly" },
  { path: "/cv-maker/builder", priority: 0.5, changeFrequency: "monthly" },
  { path: "/working-with-bridge", priority: 0.6, changeFrequency: "monthly" },
  { path: "/jobs-for-refugees", priority: 0.6, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
  { path: "/employers", priority: 0.8, changeFrequency: "monthly" },
  { path: "/employers/solutions", priority: 0.7, changeFrequency: "monthly" },
  { path: "/employers/industries", priority: 0.7, changeFrequency: "monthly" },
  { path: "/employers/request-staff", priority: 0.7, changeFrequency: "monthly" },
  { path: "/employers/how-we-work", priority: 0.5, changeFrequency: "monthly" },
  { path: "/employers/who-we-are", priority: 0.5, changeFrequency: "monthly" },
  { path: "/employers/resources", priority: 0.6, changeFrequency: "weekly" },
  { path: "/employers/faq", priority: 0.5, changeFrequency: "monthly" },
  { path: "/diversity-and-inclusion", priority: 0.4, changeFrequency: "monthly" },
  { path: "/contact-us", priority: 0.6, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const [url, jobs, insights, resources, industries, solutions, forms] = await Promise.all([
    siteUrl(),
    getPublishedJobs(),
    getPublishedArticles("jobseekers"),
    getPublishedArticles("employers"),
    getPublishedIndustries(),
    getPublishedSolutions(),
    getPublishedCustomForms(),
  ]);

  return [
    ...staticPages.map((p) => ({ url: `${url}${p.path}`, changeFrequency: p.changeFrequency, priority: p.priority })),
    ...jobs.map((j) => ({ url: `${url}/jobs/${j.slug}`, lastModified: j.posted, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...insights.map((a) => ({ url: `${url}/insights/${a.slug}`, lastModified: a.date, priority: 0.5 })),
    ...resources.map((a) => ({ url: `${url}/employers/resources/${a.slug}`, lastModified: a.date, priority: 0.5 })),
    ...industries.map((i) => ({ url: `${url}/employers/industries/${i.slug}`, priority: 0.6 })),
    ...solutions.map((s) => ({ url: `${url}/employers/solutions/${s.slug}`, priority: 0.6 })),
    ...(forms.length > 0 ? [{ url: `${url}/apply`, priority: 0.7 }] : []),
    ...forms.map((f) => ({ url: `${url}/apply/${f.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...legalSlugs.map((slug) => ({ url: `${url}/${slug}`, changeFrequency: "yearly" as const, priority: 0.2 })),
  ];
}
