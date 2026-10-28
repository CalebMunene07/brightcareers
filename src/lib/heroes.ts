import "server-only";
import { cache } from "react";
import { collections, DatabaseNotConfiguredError, getDb } from "@/lib/db";

// Editable page heroes (the banner at the top of each page). Stored in the `content`
// collection as { key: "hero:<id>", value }. Pages fall back to the defaults below.

export type Hero = {
  image: string;
  eyebrow: string;
  title: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

type HeroDef = { label: string; path: string; group: "Job seekers" | "Employers" | "General"; noImage?: boolean; default: Hero };

function hero(h: Partial<Hero> & Pick<Hero, "title">): Hero {
  return { image: "", eyebrow: "", text: "", ctaLabel: "", ctaHref: "", secondaryLabel: "", secondaryHref: "", ...h };
}

export const heroDefs = {
  home: {
    label: "Homepage",
    path: "/",
    group: "Job seekers",
    noImage: true,
    default: hero({
      eyebrow: "For job seekers",
      title: "Work that fits your skills, your goals and your life.",
      text: "We get to know you first, then match you with employers who value what you bring, whether that's a permanent career move, a short contract or flexible hours.",
    }),
  },
  "working-with-bridge": {
    label: "Working with Bridge",
    path: "/working-with-bridge",
    group: "Job seekers",
    default: hero({
      image: "/images/team-laptop.jpg",
      eyebrow: "Working with Bridge",
      title: "Get hired faster, with someone in your corner",
      text: "Our consultants know what employers are looking for. We'll help you stand out, prepare you for every step, and keep you updated along the way, free of charge.",
      ctaLabel: "Find a job",
      ctaHref: "/jobs",
      secondaryLabel: "Build your CV",
      secondaryHref: "/cv-maker",
    }),
  },
  "jobs-for-refugees": {
    label: "Jobs for refugees",
    path: "/jobs-for-refugees",
    group: "Job seekers",
    default: hero({
      image: "/images/pro-man.jpg",
      eyebrow: "Jobs for refugees",
      title: "A new start, with support at every step",
      text: "If you have been forced to leave your home country, finding work can feel hard. We help refugees and displaced people find safe, fair jobs and build a career, free of charge.",
      ctaLabel: "Talk to us",
      ctaHref: "/contact-us?topic=refugee#form",
      secondaryLabel: "Find a job",
      secondaryHref: "/jobs",
    }),
  },
  "cv-maker": {
    label: "CV maker",
    path: "/cv-maker",
    group: "Job seekers",
    default: hero({
      image: "/images/resume-review.jpg",
      eyebrow: "CV maker",
      title: "Create a CV that gets you noticed",
      text: "Build a clear, professional CV in minutes. Pick a template, fill in the guided sections and download a ready-to-send PDF.",
      ctaLabel: "Create your CV",
      ctaHref: "/cv-maker/builder",
    }),
  },
  faq: {
    label: "Job seeker FAQ",
    path: "/faq",
    group: "Job seekers",
    default: hero({
      image: "/images/interview.jpg",
      eyebrow: "FAQ",
      title: "Job seeker FAQ",
      text: "Everything you need to know about finding work with Bridge Careers Global.",
    }),
  },
  employers: {
    label: "Employers home",
    path: "/employers",
    group: "Employers",
    default: hero({
      image: "/images/handshake.jpg",
      eyebrow: "For employers",
      title: "Achieve more with the right people",
      text: "Whether you need one specialist or a whole new team, we combine local market knowledge with proven processes to help your business grow.",
      ctaLabel: "Request a quote",
      ctaHref: "/employers/request-staff",
      secondaryLabel: "Our solutions",
      secondaryHref: "/employers/solutions",
    }),
  },
  "how-we-work": {
    label: "How we work",
    path: "/employers/how-we-work",
    group: "Employers",
    default: hero({
      image: "/images/open-office.jpg",
      eyebrow: "How we work",
      title: "Partnerships built around your business",
      text: "We combine digital tools with people on the ground, so you get the speed of technology and the judgement of experienced recruiters.",
      ctaLabel: "Request a quote",
      ctaHref: "/employers/request-staff",
    }),
  },
  solutions: {
    label: "Solutions overview",
    path: "/employers/solutions",
    group: "Employers",
    default: hero({
      image: "/images/coworkers.jpg",
      eyebrow: "Solutions",
      title: "Recruitment solutions that fit the way you work",
      text: "From short-term cover to fully outsourced hiring, our services slot into your business and scale with your needs.",
      ctaLabel: "Request a quote",
      ctaHref: "/employers/request-staff",
    }),
  },
  industries: {
    label: "Industries",
    path: "/employers/industries",
    group: "Employers",
    default: hero({
      image: "/images/workshop.jpg",
      eyebrow: "Industries",
      title: "Recruitment models built for your sector",
      text: "Every industry has its own skills, certifications and pressures. Our specialist teams design hiring around them.",
      ctaLabel: "Request a quote",
      ctaHref: "/employers/request-staff",
    }),
  },
  "who-we-are": {
    label: "Who we are",
    path: "/employers/who-we-are",
    group: "Employers",
    default: hero({
      image: "/images/coworkers.jpg",
      eyebrow: "Who we are",
      title: "We build bridges between people and work",
      text: "Bridge Careers Global is a recruitment and workforce solutions company helping people find meaningful work and organisations find the talent to grow.",
    }),
  },
  resources: {
    label: "Employer resources",
    path: "/employers/resources",
    group: "Employers",
    default: hero({
      image: "/images/laptop-woman.jpg",
      eyebrow: "Resources",
      title: "Guides and insights for employers",
      text: "Practical advice on hiring, retention and workforce planning from our recruitment specialists.",
    }),
  },
  "employer-faq": {
    label: "Employer FAQ",
    path: "/employers/faq",
    group: "Employers",
    default: hero({
      image: "/images/handshake.jpg",
      eyebrow: "FAQ",
      title: "Employer FAQ",
      text: "How working with Bridge Careers Global works for your business.",
    }),
  },
  "contact-us": {
    label: "Contact us",
    path: "/contact-us",
    group: "General",
    default: hero({
      image: "/images/pro-woman.jpg",
      eyebrow: "Contact us",
      title: "We're here to help",
      text: "Questions about our services, looking for expert support or have a general enquiry? Our teams are ready to talk.",
    }),
  },
  "diversity-and-inclusion": {
    label: "Diversity & inclusion",
    path: "/diversity-and-inclusion",
    group: "General",
    default: hero({
      image: "/images/coworkers.jpg",
      eyebrow: "Diversity & inclusion",
      title: "Opportunity for everyone",
      text: "Talent is everywhere, but opportunity isn't always. We work to change that, one placement at a time.",
    }),
  },
} satisfies Record<string, HeroDef>;

export type HeroId = keyof typeof heroDefs;

export function isHeroId(id: string): id is HeroId {
  return id in heroDefs;
}

const storageKey = (id: HeroId) => `hero:${id}`;

type Doc = { key: string; value: Hero; updatedAt: Date; updatedBy?: string };

async function col() {
  return (await getDb()).collection<Doc>(collections.content);
}

export const getHero = cache(async (id: HeroId): Promise<Hero> => {
  try {
    const doc = await (await col()).findOne({ key: storageKey(id) });
    return doc ? { ...heroDefs[id].default, ...doc.value } : heroDefs[id].default;
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) return heroDefs[id].default;
    throw error;
  }
});

export async function getHeroMeta(id: HeroId) {
  const doc = await (await col()).findOne({ key: storageKey(id) }, { projection: { updatedAt: 1, updatedBy: 1 } });
  return doc ? { updatedAt: doc.updatedAt, updatedBy: doc.updatedBy } : null;
}

export async function saveHero(id: HeroId, value: Hero, updatedBy: string) {
  await (await col()).updateOne(
    { key: storageKey(id) },
    { $set: { key: storageKey(id), value, updatedAt: new Date(), updatedBy } },
    { upsert: true },
  );
}

export async function resetHero(id: HeroId) {
  await (await col()).deleteOne({ key: storageKey(id) });
}

/** Converts a stored hero into PhotoHero props. */
export function heroProps(h: Hero) {
  return {
    image: h.image,
    eyebrow: h.eyebrow || undefined,
    title: h.title,
    text: h.text || undefined,
    cta: h.ctaLabel && h.ctaHref ? { label: h.ctaLabel, href: h.ctaHref } : undefined,
    secondary: h.secondaryLabel && h.secondaryHref ? { label: h.secondaryLabel, href: h.secondaryHref } : undefined,
  };
}
