import type { Metadata } from "next";
import { getHero, heroProps } from "@/lib/heroes";
import Image from "@/components/site-image";
import Link from "next/link";
import { ArrowRight } from "@/components/icon";
import { PhotoHero } from "@/components/sections";
import { getAudience } from "@/lib/articles";
import { getPublishedArticles } from "@/lib/articles-repo";
import { getT } from "@/lib/translate";
import { pageMetadata } from "@/lib/seo";

const resourceCategories = getAudience("employers").categories;

export const metadata: Metadata = pageMetadata("/employers/resources", "Employer resources | Bridge Careers Global", "Guides and insights on hiring, retention, workforce planning and more.");

const PER_PAGE = 6;

function param(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function pageHref(params: { q?: string; category?: string; page?: number }) {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.category) sp.set("category", params.category);
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  const qs = sp.toString();
  return `/employers/resources${qs ? `?${qs}` : ""}#list`;
}

export default async function ResourcesPage({ searchParams }: PageProps<"/employers/resources">) {
  const [hero, t] = await Promise.all([getHero("resources"), getT()]);
  const sp = await searchParams;
  const q = param(sp.q)?.trim() ?? "";
  const category = param(sp.category) ?? "";
  const page = Math.max(1, Number(param(sp.page)) || 1);

  const resources = await getPublishedArticles("employers");
  const filtered = resources
    .filter((r) => !category || r.category === category)
    .filter((r) => !q || `${r.title} ${r.excerpt}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date));
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const shown = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return (
    <>
      <PhotoHero
        {...heroProps(hero)}
        compact
        crumbs={[
          { label: "Employers", href: "/employers" },
          { label: "Resources", href: "/employers/resources" },
        ]}
      />

      <section id="list" className="scroll-mt-28 bg-muted py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <form method="get" action="/employers/resources#list" className="flex flex-col gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200 md:flex-row md:items-center">
            <label htmlFor="rq" className="sr-only">{t("Search resources")}</label>
            <input
              id="rq"
              name="q"
              defaultValue={q}
              placeholder={t("Search resources")}
              className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-2.5 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
            {category && <input type="hidden" name="category" value={category} />}
            <button type="submit" className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-brand-dark">
              {t("Search")}
            </button>
          </form>

          <nav aria-label={t("Categories")} className="mt-6 flex flex-wrap gap-2">
            {["", ...resourceCategories].map((c) => {
              const active = c === category;
              return (
                <Link
                  key={c || "all"}
                  href={pageHref({ q, category: c })}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 transition ${
                    active ? "bg-brand text-white ring-brand" : "bg-white text-slate-700 ring-slate-200 hover:ring-brand"
                  }`}
                >
                  {t(c || "All")}
                </Link>
              );
            })}
          </nav>

          {shown.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {shown.map((r) => (
                <article key={r.slug} className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image src={r.image} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="self-start rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">{t(r.category)}</span>
                    <h2 className="mt-4 text-lg font-bold leading-snug text-brand-dark">
                      <Link href={`/employers/resources/${r.slug}`} className="after:absolute after:inset-0">
                        {t(r.title)}
                      </Link>
                    </h2>
                    <p className="mt-2 flex-1 text-sm text-slate-600">{t(r.excerpt)}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 self-end text-sm font-bold text-brand">
                      {t("Read more")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-10 rounded-2xl bg-white p-10 text-center text-slate-600 ring-1 ring-slate-200">
              {t("No resources match your search.")}{" "}
              <Link href="/employers/resources#list" className="font-semibold text-brand hover:underline">{t("Clear filters")}</Link>
            </p>
          )}

          {pages > 1 && (
            <nav aria-label={t("Pagination")} className="mt-10 flex justify-center gap-2">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={pageHref({ q, category, page: n })}
                  aria-current={n === current ? "page" : undefined}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                    n === current ? "bg-brand text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-brand"
                  }`}
                >
                  {n}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
