import Image from "@/components/site-image";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getHero, getHeroMeta, heroDefs, type HeroId } from "@/lib/heroes";

export default async function HeroesPage() {
  await requireAdmin();
  const ids = Object.keys(heroDefs) as HeroId[];
  const data = await Promise.all(ids.map(async (id) => ({ id, hero: await getHero(id), meta: await getHeroMeta(id) })));
  const groups = ["Job seekers", "Employers", "General"] as const;

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold text-brand-dark">Page heroes</h1>
      <p className="mt-1 text-sm text-slate-500">
        The banner at the top of each page. Service pages are edited under{" "}
        <Link href="/admin/services" className="font-semibold text-brand hover:underline">Services</Link>.
      </p>

      {groups.map((group) => (
        <section key={group} className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{group}</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data
              .filter((d) => heroDefs[d.id].group === group)
              .map(({ id, hero, meta }) => (
                <Link key={id} href={`/admin/heroes/${id}`} className="group overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 hover:ring-brand">
                  <div className="relative aspect-[3/1] bg-brand-dark">
                    {hero.image && <Image src={hero.image} alt="" fill sizes="33vw" className="object-cover opacity-70" />}
                    <p className="absolute inset-x-4 bottom-3 line-clamp-2 text-sm font-bold text-white">{hero.title}</p>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-brand-dark">{heroDefs[id].label}</p>
                    <p className="text-xs text-slate-500">{heroDefs[id].path}</p>
                    <p className="mt-2 text-xs text-slate-400">{meta ? `Edited ${meta.updatedAt.toLocaleDateString("en-GB")}` : "Default"}</p>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
