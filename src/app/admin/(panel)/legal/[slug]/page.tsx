import Link from "next/link";
import { notFound } from "next/navigation";
import { resetLegalAction } from "@/app/admin/legal-actions";
import { ConfirmButton } from "@/app/admin/(panel)/confirm-button";
import { requireAdmin } from "@/lib/auth";
import { getLegal, getLegalMeta } from "@/lib/legal-repo";
import { LegalForm } from "../legal-form";

export default async function EditLegalPage({ params, searchParams }: PageProps<"/admin/legal/[slug]">) {
  await requireAdmin();
  const { slug } = await params;
  const page = await getLegal(slug);
  if (!page) notFound();
  const [meta, { reset }] = await Promise.all([getLegalMeta(slug), searchParams]);

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/legal" className="text-sm text-slate-500 hover:text-brand">← Legal pages</Link>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">{page.title}</h1>
          <Link href={`/${slug}`} target="_blank" className="text-sm text-brand hover:underline">/{slug} ↗</Link>
        </div>
        {meta && <ConfirmButton action={resetLegalAction.bind(null, slug)} label="Reset to draft template" confirmLabel="Yes, discard my edits" />}
      </div>
      {reset === "1" && (
        <p role="status" className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 ring-1 ring-emerald-200">Reset to the draft template.</p>
      )}
      <div className="mt-6">
        <LegalForm key={meta?.updatedAt?.toISOString() ?? "default"} slug={slug} page={page} />
      </div>
    </div>
  );
}
