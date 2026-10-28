import { requireAdmin } from "@/lib/auth";
import { countryNames } from "@/lib/countries";
import { jobCountry } from "@/lib/jobs";
import { getAllJobs } from "@/lib/jobs-repo";
import { getRegions } from "@/lib/locations-repo";
import { LocationsForm } from "./locations-form";

export default async function LocationsPage() {
  await requireAdmin();
  const [regions, jobs] = await Promise.all([getRegions(), getAllJobs()]);

  const jobCounts: Record<string, number> = {};
  for (const job of jobs) {
    const c = jobCountry(job);
    jobCounts[c] = (jobCounts[c] ?? 0) + 1;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-brand-dark">Locations</h1>
      <p className="mt-1 text-sm text-slate-500">
        Continents and countries shown in the “Find your next role” picker, the contact form and the job forms. Each
        country gets its own job listing, job count and contact link. Names are translated automatically like the rest of
        the site. “Remote” is always available.
      </p>
      <div className="mt-6">
        <LocationsForm regions={regions} jobCounts={jobCounts} suggestions={countryNames} />
      </div>
    </div>
  );
}
