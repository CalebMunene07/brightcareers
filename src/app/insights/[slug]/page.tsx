import type { Metadata } from "next";
import Image from "@/components/site-image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/article-body";
import { ArrowRight } from "@/components/icon";
import { getPublishedArticle, getPublishedArticles } from "@/lib/articles-repo";
import { getLocale, getT } from "@/lib/translate";
import { formatPosted } from "@/lib/jobs";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const post = await getPublishedArticle("jobseekers", (await params).slug);
  if (!post) return {};
  return pageMetadata(`/insights/${post.slug}`, `${post.title} | Bridge Careers Global`, post.excerpt);
}

export default async function InsightPage({ params }: PageProps<"/insights/[slug]">) {
  const post = await getPublishedArticle("jobseekers", (await params).slug);
  if (!post) notFound();
  const [t, locale] = await Promise.all([getT(), getLocale()]);
  const others = (await getPublishedArticles("jobseekers")).filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="bg-white">
      <header className="mx-auto max-w-3xl px-4 pt-12 sm:px-6 sm:pt-16">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <Link href="/#insights" className="hover:text-brand">← {t("Career insights")}</Link>
        </nav>
        <span className="mt-6 inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">{t(post.category)}</span>
        <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-brand-dark sm:text-5xl">{t(post.title)}</h1>
        <p className="mt-4 text-lg text-slate-600">{t(post.excerpt)}</p>
        <p className="mt-4 text-sm text-slate-500">{formatPosted(post.date, locale)}</p>
      </header>
      <div className="relative mx-auto mt-10 aspect-[2/1] max-w-5xl overflow-hidden sm:rounded-3xl">
        <Image src={post.image} alt="" fill priority sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" />
      </div>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <ArticleBody body={post.body} />
        <div className="mt-14 flex flex-wrap gap-3 border-t border-slate-200 pt-8">
          <Link href="/jobs" className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
            {t("Find a job")} <ArrowRight />
          </Link>
          {others.map((p) => (
            <Link key={p.slug} href={`/insights/${p.slug}`} className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-brand hover:text-brand">
              {t(p.title)}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
