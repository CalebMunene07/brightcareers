import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAllIndustries } from "@/lib/industries-repo";
import { getAllCountries } from "@/lib/locations-repo";
import { JobForm } from "../job-form";

export default async function NewJobPage() {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/jobs" className="text-sm text-slate-500 hover:text-brand">← Jobs</Link>
      <h1 className="mt-2 text-2xl font-bold text-brand-dark">New job</h1>
      <div className="mt-6">
        <JobForm industries={(await getAllIndustries()).map((i) => ({ slug: i.slug, name: i.name }))} countries={await getAllCountries()} />
      </div>
    </div>
  );
}
