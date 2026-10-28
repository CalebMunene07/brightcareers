import Image from "@/components/site-image";
import Link from "next/link";
import { ArrowRight } from "@/components/icon";
import { getPublishedArticles } from "@/lib/articles-repo";
import { getT } from "@/lib/translate";

export async function InsightsSection() {
  const [all, t] = await Promise.all([getPublishedArticles("jobseekers"), getT()]);
  const insights = all.slice(0, 3);
  if (insights.length === 0) return null;
  return (
    <section id="insights" className="scroll-mt-28 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-brand-dark sm:text-5xl">
            {t("Insights for the world of work")}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            {t("Practical advice and market know-how from our consultants to help you job-hunt smarter and plan your next career move with confidence.")}
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {insights.map((post) => (
            <article
              key={post.slug}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={post.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="self-start rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
                  {t(post.category)}
                </span>
                <h3 className="mt-4 text-xl font-bold leading-snug text-brand-dark">
                  <Link href={`/insights/${post.slug}`} className="after:absolute after:inset-0">
                    {t(post.title)}
                  </Link>
                </h3>
                <p className="mt-3 flex-1 text-sm text-slate-600">{t(post.excerpt)}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 self-end text-sm font-bold text-brand">
                  {t("Read more")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
