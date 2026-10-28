import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteSolutionAction } from "@/app/admin/actions";
import { ConfirmButton } from "@/app/admin/(panel)/confirm-button";
import { requireAdmin } from "@/lib/auth";
import { listAllImages } from "@/lib/media";
import { getSolutionById } from "@/lib/solutions-repo";
import { SolutionForm } from "../solution-form";

export default async function EditServicePage({ params }: PageProps<"/admin/services/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const [solution, images] = await Promise.all([getSolutionById(id), listAllImages()]);
  if (!solution) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/services" className="text-sm text-slate-500 hover:text-brand">← Services</Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-brand-dark">{solution.title}</h1>
        <div className="flex items-center gap-3">
          {solution.published && (
            <Link href={`/employers/solutions/${solution.slug}`} target="_blank" className="text-sm font-semibold text-brand hover:underline">
              View on site ↗
            </Link>
          )}
          <ConfirmButton action={deleteSolutionAction.bind(null, id)} label="Delete" confirmLabel="Yes, delete this service" />
        </div>
      </div>
      <div className="mt-6">
        <SolutionForm solution={solution} images={images} nextOrder={solution.order} />
      </div>
    </div>
  );
}
