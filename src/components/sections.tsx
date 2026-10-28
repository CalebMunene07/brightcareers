import Image from "@/components/site-image";
import Link from "next/link";
import { ArrowRight, Icon } from "@/components/icon";
import type { IconName } from "@/lib/content";
import { getContent } from "@/lib/site-content";
import { getPublishedSolutions } from "@/lib/solutions-repo";
import { getT } from "@/lib/translate";

// Shared page sections. Pass English text in; each component translates it for the visitor's
// language with t(), so callers never translate these props themselves.

type Crumb = { label: string; href: string };

/* Full-width photo banner with overlay text */
export async function PhotoHero({
  image,
  eyebrow,
  title,
  text,
  cta,
  secondary,
  crumbs,
  compact = false,
}: {
  image: string;
  eyebrow?: string;
  title: string;
  text?: string;
  cta?: { label: string; href: string };
  secondary?: { label: string; href: string };
  crumbs?: Crumb[];
  compact?: boolean;
}) {
  const t = await getT();
  return (
    <section className={`relative isolate overflow-hidden bg-brand-dark text-white ${compact ? "min-h-[340px]" : "min-h-[460px] md:min-h-[520px]"}`}>
      <Image src={image} alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-dark/95 via-brand-dark/75 to-brand-dark/20" aria-hidden="true" />
      <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        {crumbs && (
          <nav aria-label={t("Breadcrumb")} className="mb-6 text-sm text-slate-200">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-white">{t("Home")}</Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.href} className="flex items-center gap-2">
                  <span aria-hidden="true">/</span>
                  <Link href={c.href} className="hover:text-white">{t(c.label)}</Link>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="max-w-2xl">
          {eyebrow && <p className="text-sm font-bold uppercase tracking-widest text-accent">{t(eyebrow)}</p>}
          <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{t(title)}</h1>
          {text && <p className="mt-5 text-lg leading-relaxed text-slate-100">{t(text)}</p>}
          {(cta || secondary) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {cta && (
                <Link href={cta.href} className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 font-bold uppercase tracking-wide text-brand-dark hover:opacity-90">
                  {t(cta.label)} <ArrowRight />
                </Link>
              )}
              {secondary && (
                <Link href={secondary.href} className="inline-flex items-center gap-2 rounded-full border-2 border-white/60 px-7 py-3 font-bold uppercase tracking-wide hover:bg-white/10">
                  {t(secondary.label)}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* Centered section heading */
export async function CenteredHeading({ title, text, light = false }: { title: string; text?: string; light?: boolean }) {
  const t = await getT();
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className={`text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl ${light ? "text-white" : "text-brand-dark"}`}>{t(title)}</h2>
      {text && <p className={`mt-5 text-lg leading-relaxed ${light ? "text-slate-100" : "text-slate-600"}`}>{t(text)}</p>}
    </div>
  );
}

/* Numbered or icon steps in a row */
export async function IconSteps({
  title,
  text,
  steps,
  numbered = false,
  muted = false,
}: {
  title?: string;
  text?: string;
  steps: { icon: IconName; title: string; text: string }[];
  numbered?: boolean;
  muted?: boolean;
}) {
  const t = await getT();
  const cols = steps.length >= 6 ? "lg:grid-cols-3" : steps.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  return (
    <section className={`py-16 sm:py-20 ${muted ? "bg-muted" : "bg-white"}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {title && <CenteredHeading title={title} text={text} />}
        <ol className={`grid gap-8 sm:grid-cols-2 ${cols} ${title ? "mt-12" : ""}`}>
          {steps.map((s, i) => (
            <li key={s.title} className="flex flex-col items-center text-center">
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Icon name={s.icon} className="h-8 w-8" />
                {numbered && (
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-brand-dark">
                    {i + 1}
                  </span>
                )}
              </span>
              <h3 className="mt-5 text-lg font-bold text-brand-dark">{t(s.title)}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-600">{t(s.text)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* Image beside text, optionally reversed. `children` must already be translated. */
export async function SplitSection({
  image,
  title,
  text,
  points,
  cta,
  reverse = false,
  muted = false,
  children,
}: {
  image: string;
  title: string;
  text?: string;
  points?: string[];
  cta?: { label: string; href: string };
  reverse?: boolean;
  muted?: boolean;
  children?: React.ReactNode;
}) {
  const t = await getT();
  return (
    <section className={`py-16 sm:py-20 ${muted ? "bg-muted" : "bg-white"}`}>
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className={`relative aspect-[4/3] overflow-hidden rounded-3xl ${reverse ? "lg:order-2" : ""}`}>
          <Image src={image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">{t(title)}</h2>
          {text && <p className="mt-4 text-lg leading-relaxed text-slate-600">{t(text)}</p>}
          {points && (
            <ul className="mt-6 space-y-3">
              {points.map((p) => (
                <li key={p} className="flex gap-3 text-slate-700">
                  <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  {t(p)}
                </li>
              ))}
            </ul>
          )}
          {children}
          {cta && (
            <Link href={cta.href} className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-brand-dark">
              {t(cta.label)} <ArrowRight />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

/* Grid of icon + title + text */
export async function FeatureGrid({
  title,
  text,
  items,
  muted = false,
  dark = false,
}: {
  title?: string;
  text?: string;
  items: { icon: IconName; title: string; text: string; href?: string }[];
  muted?: boolean;
  dark?: boolean;
}) {
  const t = await getT();
  const cols = items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  return (
    <section className={`py-16 sm:py-20 ${dark ? "bg-brand text-white" : muted ? "bg-muted" : "bg-white"}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {title && <CenteredHeading title={title} text={text} light={dark} />}
        <div className={`grid gap-6 sm:grid-cols-2 ${cols} ${title ? "mt-12" : ""}`}>
          {items.map((item) => {
            const inner = (
              <>
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${dark ? "bg-white/10 text-accent" : "bg-brand/10 text-brand"}`}>
                  <Icon name={item.icon} />
                </span>
                <h3 className={`mt-5 text-lg font-bold ${dark ? "text-white" : "text-brand-dark"}`}>{t(item.title)}</h3>
                <p className={`mt-2 text-sm leading-relaxed ${dark ? "text-slate-100" : "text-slate-600"}`}>{t(item.text)}</p>
                {item.href && (
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand">
                    {t("Learn more")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </>
            );
            const cardClass = `group rounded-2xl p-7 ${dark ? "bg-white/5 ring-1 ring-white/10" : "bg-white ring-1 ring-slate-200"}`;
            return item.href ? (
              <Link key={item.title} href={item.href} className={`${cardClass} transition hover:-translate-y-1 hover:shadow-lg`}>
                {inner}
              </Link>
            ) : (
              <div key={item.title} className={cardClass}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* Native details/summary accordion. Titles are translated here; `content` must already be translated. */
export async function Accordion({ items }: { items: { title: string; content: React.ReactNode }[] }) {
  const t = await getT();
  return (
    <div className="divide-y divide-slate-200 border-y border-slate-200">
      {items.map((item) => (
        <details key={item.title} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-lg font-bold text-brand-dark [&::-webkit-details-marker]:hidden">
            {t(item.title)}
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-brand transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <div className="pb-6 leading-relaxed text-slate-700">{item.content}</div>
        </details>
      ))}
    </div>
  );
}

/* Service cards (from the admin) plus "How we work" */
export async function SolutionsGrid({ title = "Our solutions", text, muted = false }: { title?: string; text?: string; muted?: boolean }) {
  return (
    <FeatureGrid
      title={title}
      text={text}
      muted={muted}
      items={[
        ...(await getPublishedSolutions()).map((s) => ({ icon: s.icon, title: s.title, text: s.text, href: `/employers/solutions/${s.slug}` })),
        { icon: "cog" as const, title: "How we work", text: "Delivery models built around how your business operates.", href: "/employers/how-we-work" },
      ]}
    />
  );
}

export async function TechnologySection({ muted = false }: { muted?: boolean }) {
  const technology = await getContent("technology");
  return (
    <FeatureGrid
      title="Powered by technology"
      text="Digital tools support every step of hiring, so you get better candidates, faster."
      items={technology}
      muted={muted}
    />
  );
}

export async function AdvantagesSection() {
  return <FeatureGrid title="The Bridge advantage" items={await getContent("advantages")} dark />;
}

export async function StatsBar() {
  const [stats, t] = await Promise.all([getContent("stats"), getT()]);
  return (
    <section className="border-b border-slate-200 bg-white">
      <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-slate-200 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse bg-white px-6 py-10 text-center">
            <dt className="mt-2 text-sm text-slate-600">{t(s.label)}</dt>
            <dd className="text-3xl font-bold text-brand sm:text-4xl">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export async function CtaBanner({
  title,
  text,
  cta,
}: {
  title: string;
  text: string;
  cta: { label: string; href: string };
}) {
  const t = await getT();
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-6 rounded-3xl bg-accent p-10 md:flex-row md:items-center md:justify-between md:p-12">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-brand-dark sm:text-3xl">{t(title)}</h2>
            <p className="mt-2 text-brand-dark/80">{t(text)}</p>
          </div>
          <Link href={cta.href} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-dark px-7 py-3 font-bold uppercase tracking-wide text-white hover:opacity-90">
            {t(cta.label)} <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
