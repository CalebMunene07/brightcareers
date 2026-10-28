import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/article-body";
import { formatPosted } from "@/lib/jobs";
import { getLegal, legalSlugs } from "@/lib/legal-repo";
import { getLocale, getT } from "@/lib/translate";
import { pageMetadata } from "@/lib/seo";

// Only the legal slugs are valid at this top-level route; everything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return legalSlugs.map((legal) => ({ legal }));
}

export async function generateMetadata({ params }: PageProps<"/[legal]">): Promise<Metadata> {
  const slug = (await params).legal;
  const page = await getLegal(slug);
  if (!page) return {};
  return pageMetadata(`/${slug}`, `${page.title} | Bridge Careers Global`, page.summary);
}

export default async function LegalPage({ params }: PageProps<"/[legal]">) {
  const page = await getLegal((await params).legal);
  if (!page) notFound();
  const [t, locale] = await Promise.all([getT(), getLocale()]);

  return (
    <article className="bg-white">
      <header className="bg-muted">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight text-brand-dark sm:text-5xl">{t(page.title)}</h1>
          {page.summary && <p className="mt-4 text-lg text-slate-600">{t(page.summary)}</p>}
          <p className="mt-4 text-sm text-slate-500">{t("Last updated {date}", { date: formatPosted(page.updated, locale) })}</p>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {!page.reviewed && (
          <p role="note" className="mb-10 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>{t("Draft:")}</strong>{" "}
            {t("this page is a starting template and has not yet been reviewed by a lawyer. It may not reflect the legal requirements in every country we operate in.")}
          </p>
        )}
        <ArticleBody body={page.body} />
      </div>
    </article>
  );
}
