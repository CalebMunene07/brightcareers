import Image from "@/components/site-image";
import Link from "next/link";
import { ArrowRight } from "@/components/icon";
import { getPublishedIndustries } from "@/lib/industries-repo";
import { getT } from "@/lib/translate";

export async function IndustryGrid({ withText = false }: { withText?: boolean }) {
  const [industries, t] = await Promise.all([getPublishedIndustries(), getT()]);
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {industries.map((ind) => (
        <Link
          key={ind.slug}
          href={`/employers/industries/${ind.slug}`}
          className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="relative aspect-[3/2] overflow-hidden">
            <Image
              src={ind.image}
              alt=""
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-1 flex-col p-5">
            <span className="flex items-center justify-between gap-2 text-lg font-bold text-brand-dark">
              {t(ind.name)}
              <ArrowRight className="h-5 w-5 shrink-0 text-brand transition-transform group-hover:translate-x-1" />
            </span>
            {withText && <span className="mt-2 text-sm text-slate-600">{t(ind.description)}</span>}
          </div>
        </Link>
      ))}
    </div>
  );
}
