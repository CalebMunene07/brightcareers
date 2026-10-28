import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteIndustryAction } from "@/app/admin/industry-actions";
import { ConfirmButton } from "@/app/admin/(panel)/confirm-button";
import { requireAdmin } from "@/lib/auth";
import { collections, getDb } from "@/lib/db";
import { getIndustryById } from "@/lib/industries-repo";
import { listAllImages } from "@/lib/media";
import { IndustryForm } from "../industry-form";

export default async function EditIndustryPage({ params }: PageProps<"/admin/industries/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const [industry, images] = await Promise.all([getIndustryById(id), listAllImages()]);
  if (!industry) notFound();
  const jobs = await (await getDb()).collection(collections.jobs).countDocuments({ industry: industry.slug });

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/industries" className="text-sm text-slate-500 hover:text-brand">← Industries</Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-brand-dark">{industry.name}</h1>
        <div className="flex items-center gap-3">
          {industry.published && (
            <Link href={`/employers/industries/${industry.slug}`} target="_blank" className="text-sm font-semibold text-brand hover:underline">
              View on site ↗
            </Link>
          )}
          <ConfirmButton
            action={deleteIndustryAction.bind(null, id)}
            label="Delete"
            confirmLabel={jobs > 0 ? `Delete (${jobs} job${jobs === 1 ? "" : "s"} use it)` : "Yes, delete"}
          />
        </div>
      </div>
      {jobs > 0 && (
        <p className="mt-3 text-sm text-slate-500">
          {jobs} job{jobs === 1 ? "" : "s"} use this industry. If you delete it or change its URL, update those jobs too.
        </p>
      )}
      <div className="mt-6">
        <IndustryForm industry={industry} images={images} nextOrder={industry.order} />
      </div>
    </div>
  );
}
