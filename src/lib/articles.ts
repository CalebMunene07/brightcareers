// Article model shared by job seeker insights (/insights) and employer resources (/employers/resources).

import { insights } from "@/lib/insights";
import { resources } from "@/lib/resources";

export const audiences = [
  { id: "jobseekers", label: "Job seeker insights", basePath: "/insights", categories: ["Career advice", "Insights"] },
  { id: "employers", label: "Employer resources", basePath: "/employers/resources", categories: ["Guides", "Insights", "Articles"] },
] as const;

export type Audience = (typeof audiences)[number]["id"];

export function isAudience(value: string): value is Audience {
  return audiences.some((a) => a.id === value);
}

export function getAudience(id: Audience) {
  return audiences.find((a) => a.id === id)!;
}

export type ArticleBlock = { heading?: string; text: string };

export type Article = {
  id?: string;
  audience: Audience;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  date: string; // YYYY-MM-DD
  body: ArticleBlock[];
  published: boolean;
};

export const defaultArticles: Article[] = [
  ...insights.map((i, n) => ({
    audience: "jobseekers" as const,
    slug: i.slug,
    category: i.tag,
    title: i.title,
    excerpt: i.excerpt,
    image: i.image,
    date: ["2026-09-28", "2026-09-14", "2026-09-01"][n] ?? "2026-09-01",
    body: i.body,
    published: true,
  })),
  ...resources.map((r) => ({
    audience: "employers" as const,
    slug: r.slug,
    category: r.category,
    title: r.title,
    excerpt: r.excerpt,
    image: r.image,
    date: r.date,
    body: r.body,
    published: true,
  })),
];

/* Body <-> editable text. "## Heading" lines start a section; blank lines separate paragraphs. */

export function bodyToText(body: ArticleBlock[]) {
  return body.map((b) => (b.heading ? `## ${b.heading}\n\n${b.text}` : b.text)).join("\n\n");
}

export function textToBody(text: string): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  let current: ArticleBlock | null = null;
  for (const line of text.replace(/\r\n/g, "\n").split("\n")) {
    const heading = line.match(/^##\s+(.*)$/);
    if (heading) {
      current = { heading: heading[1].trim(), text: "" };
      blocks.push(current);
      continue;
    }
    if (!current) {
      current = { text: "" };
      blocks.push(current);
    }
    current.text += `${line}\n`;
  }
  return blocks
    .map((b) => ({ ...b, text: b.text.replace(/\n{3,}/g, "\n\n").trim() }))
    .filter((b) => b.heading || b.text);
}

export function paragraphs(text: string) {
  return text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}
