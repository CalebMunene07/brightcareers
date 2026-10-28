import type { Metadata } from "next";
import Image from "@/components/site-image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@/components/icon";
import { CtaBanner } from "@/components/sections";
import { formatPosted } from "@/lib/jobs";
import { ArticleBody } from "@/components/article-body";
import { getPublishedArticle, getPublishedArticles } from "@/lib/articles-repo";
import { getLocale, getT } from "@/lib/translate";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/employers/resources/[slug]">): Promise<Metadata> {
  const r = await getPublishedArticle("employers", (await params).slug);
  if (!r) return {};
  return pageMetadata(`/employers/resources/${r.slug}`, `${r.title} | Bridge Careers Global`, r.excerpt);
}

export default async function ResourcePage({ params }: PageProps<"/employers/resources/[slug]">) {
  const r = await getPublishedArticle("employers", (await params).slug);
  if (!r) notFound();

  const [t, locale] = await Promise.all([getT(), getLocale()]);
  const related = (await getPublishedArticles("employers")).filter((x) => x.slug !== r.slug && x.category === r.category).slice(0, 3);

  return (
    <>
      <article className="bg-white">
        <header className="mx-auto max-w-3xl px-4 pt-12 sm:px-6 sm:pt-16">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
            <Link href="/employers/resources" className="hover:text-brand">← {t("All resources")}</Link>
          </nav>
          <span className="mt-6 inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">{t(r.category)}</span>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-brand-dark sm:text-5xl">{t(r.title)}</h1>
          <p className="mt-4 text-lg text-slate-600">{t(r.excerpt)}</p>
          <p className="mt-4 text-sm text-slate-500">{formatPosted(r.date, locale)}</p>
        </header>
        <div className="relative mx-auto mt-10 aspect-[2/1] max-w-5xl overflow-hidden sm:rounded-3xl">
          <Image src={r.image} alt="" fill priority sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" />
        </div>
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <ArticleBody body={r.body} />
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-muted py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-brand-dark">{t("More in {category}", { category: t(r.category) })}</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {related.map((x) => (
                <Link key={x.slug} href={`/employers/resources/${x.slug}`} className="group rounded-2xl bg-white p-6 ring-1 ring-slate-200 hover:ring-brand">
                  <h3 className="font-bold text-brand-dark">{t(x.title)}</h3>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand">
                    {t("Read more")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBanner
        title="Need help putting this into practice?"
        text="Our consultants can help you plan and deliver your next hiring project."
        cta={{ label: "Request a quote", href: "/employers/request-staff" }}
      />
    </>
  );
}
