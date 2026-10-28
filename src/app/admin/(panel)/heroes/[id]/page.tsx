import Link from "next/link";
import { notFound } from "next/navigation";
import { resetHeroAction } from "@/app/admin/actions";
import { ConfirmButton } from "@/app/admin/(panel)/confirm-button";
import { requireAdmin } from "@/lib/auth";
import { getHero, getHeroMeta, heroDefs, isHeroId } from "@/lib/heroes";
import { listAllImages } from "@/lib/media";
import { HeroForm } from "../hero-form";

export default async function EditHeroPage({ params, searchParams }: PageProps<"/admin/heroes/[id]">) {
  await requireAdmin();
  const { id } = await params;
  if (!isHeroId(id)) notFound();
  const { reset } = await searchParams;

  const def = heroDefs[id];
  const [hero, meta, images] = await Promise.all([getHero(id), getHeroMeta(id), listAllImages()]);
  const noImage = "noImage" in def && def.noImage;

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/heroes" className="text-sm text-slate-500 hover:text-brand">← Page heroes</Link>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">{def.label}</h1>
          <Link href={def.path} target="_blank" className="text-sm text-brand hover:underline">{def.path} ↗</Link>
        </div>
        {meta && <ConfirmButton action={resetHeroAction.bind(null, id)} label="Reset to default" confirmLabel="Yes, discard my edits" />}
      </div>
      {reset === "1" && (
        <p role="status" className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 ring-1 ring-emerald-200">Reset to the default.</p>
      )}
      <div className="mt-6">
        <HeroForm key={meta?.updatedAt?.toISOString() ?? "default"} id={id} hero={hero} images={images} noImage={noImage} />
      </div>
    </div>
  );
}
