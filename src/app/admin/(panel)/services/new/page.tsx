import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { listAllImages } from "@/lib/media";
import { getAdminSolutions } from "@/lib/solutions-repo";
import { SolutionForm } from "../solution-form";

export default async function NewServicePage() {
  await requireAdmin();
  const [{ list, usingDefaults }, images] = await Promise.all([getAdminSolutions(), listAllImages()]);
  // New services can only be added once the built-in ones are in the database.
  if (usingDefaults) redirect("/admin/services");

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/services" className="text-sm text-slate-500 hover:text-brand">← Services</Link>
      <h1 className="mt-2 text-2xl font-bold text-brand-dark">New service</h1>
      <div className="mt-6">
        <SolutionForm images={images} nextOrder={Math.max(0, ...list.map((s) => s.order)) + 1} />
      </div>
    </div>
  );
}
