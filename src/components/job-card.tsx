import Link from "next/link";
import { ArrowRight } from "@/components/icon";
import { daysUntilClose, formatPosted, type Job } from "@/lib/jobs";
import { getLocale, getT } from "@/lib/translate";

const typeStyles: Record<Job["type"], string> = {
  Permanent: "bg-brand/10 text-brand",
  Temporary: "bg-amber-100 text-amber-800",
  Contract: "bg-violet-100 text-violet-800",
};

export async function JobCard({ job }: { job: Job }) {
  const [t, locale] = await Promise.all([getT(), getLocale()]);
  const days = daysUntilClose(job);
  const date = (iso: string) => formatPosted(iso, locale);
  return (
    <article className="group relative rounded-2xl bg-white p-6 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-brand/40">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className={`rounded-full px-2.5 py-1 ${typeStyles[job.type]}`}>{t(job.type)}</span>
        <span className="text-slate-500">{t("Posted {date}", { date: date(job.posted) })}</span>
        {days !== null && days >= 0 && (
          <span className={days <= 7 ? "text-red-600" : "text-slate-500"}>
            ·{" "}
            {days === 0
              ? t("Closes today")
              : days <= 7
                ? t(days === 1 ? "Closes in {n} day" : "Closes in {n} days", { n: days })
                : t("Closes {date}", { date: date(job.closes!) })}
          </span>
        )}
      </div>
      <h3 className="mt-3 text-lg font-semibold text-brand-dark">
        <Link href={`/jobs/${job.slug}`} className="after:absolute after:inset-0">
          {t(job.title)}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-slate-600">
        {t(job.company)} · {t(job.location)}
      </p>
      <p className="mt-3 line-clamp-2 text-sm text-slate-600">{t(job.summary)}</p>
      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-800">{t(job.salary)}</span>
        <span className="inline-flex items-center gap-1.5 font-semibold text-brand transition-all group-hover:gap-2.5">
          {t("View job")} <ArrowRight />
        </span>
      </div>
    </article>
  );
}
