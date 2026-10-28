import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getAdminIndustries } from "@/lib/industries-repo";
import { listAllImages } from "@/lib/media";
import { IndustryForm } from "../industry-form";

export default async function NewIndustryPage() {
  await requireAdmin();
  const [{ list, usingDefaults }, images] = await Promise.all([getAdminIndustries(), listAllImages()]);
  if (usingDefaults) redirect("/admin/industries");

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/industries" className="text-sm text-slate-500 hover:text-brand">← Industries</Link>
      <h1 className="mt-2 text-2xl font-bold text-brand-dark">New industry</h1>
      <div className="mt-6">
        <IndustryForm images={images} nextOrder={Math.max(0, ...list.map((i) => i.order)) + 1} />
      </div>
    </div>
  );
}
