// Articles for the "Insights for the world of work" section.
// Replace with posts from a CMS or blog when available.

import type { IconName } from "@/lib/content";

export type Insight = {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  icon: IconName;
  image: string;
  body: { heading?: string; text: string }[];
};

export const insights: Insight[] = [
  {
    slug: "tailor-your-cv",
    tag: "Career advice",
    title: "How to tailor your CV for every application in 15 minutes",
    excerpt: "A quick routine to match your CV to the job advert without rewriting it from scratch.",
    icon: "cv",
    image: "/images/resume-review.jpg",
    body: [
      {
        text: "Sending the same CV to every employer is the most common reason good candidates get overlooked. The fix doesn't have to take long.",
      },
      {
        heading: "1. Pull out the keywords",
        text: "Read the advert and highlight the skills, tools and qualifications it mentions more than once. These are what recruiters and screening software look for first.",
      },
      {
        heading: "2. Rewrite your summary",
        text: "Change the two or three lines at the top of your CV so they speak directly to the role, using the same language as the advert.",
      },
      {
        heading: "3. Reorder your achievements",
        text: "Move the bullet points that best match the job to the top of each role. Add numbers wherever you can: team sizes, budgets, targets hit.",
      },
      {
        heading: "4. Cut what doesn't help",
        text: "Remove older or unrelated detail so the most relevant experience stands out. Two pages is plenty for most roles.",
      },
    ],
  },
  {
    slug: "temp-to-perm",
    tag: "Insights",
    title: "Temp-to-perm: why flexible work is a smart route to a permanent job",
    excerpt: "Temporary roles let you prove yourself on the job, and many lead to permanent offers.",
    icon: "clock",
    image: "/images/warehouse-team.jpg",
    body: [
      {
        text: "Many employers use temporary assignments to find their next permanent hires. For candidates, that makes temp work much more than a stop-gap.",
      },
      {
        heading: "You get a foot in the door",
        text: "A temporary role gets you inside an organisation, where you can show your skills and attitude in a way no interview can.",
      },
      {
        heading: "You can try before you commit",
        text: "It works both ways: you get to see the team, the culture and the day-to-day before deciding whether it's the right long-term fit.",
      },
      {
        heading: "You keep building experience",
        text: "Even assignments that don't turn permanent add skills, references and contacts to your CV.",
      },
    ],
  },
  {
    slug: "skills-employers-want",
    tag: "Insights",
    title: "The skills employers are asking us for right now",
    excerpt: "What our consultants hear most often from hiring managers across our markets.",
    icon: "spark",
    image: "/images/pro-woman.jpg",
    body: [
      {
        text: "Across healthcare, logistics, technology and finance, a few themes come up again and again when we talk to employers.",
      },
      {
        heading: "Digital confidence",
        text: "Not just for tech roles. Warehouse, retail and admin positions increasingly expect comfort with scanners, apps and spreadsheets.",
      },
      {
        heading: "Reliability and communication",
        text: "Turning up, keeping people informed and working well in a team remain the qualities hiring managers rate most highly.",
      },
      {
        heading: "Certifications that prove it",
        text: "Short, recognised courses in areas like health and safety, first aid or specific software can tip a decision in your favour.",
      },
    ],
  },
];

export function getInsight(slug: string) {
  return insights.find((i) => i.slug === slug);
}
