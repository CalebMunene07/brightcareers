"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { jobCountry } from "@/lib/jobs";
import { getAllJobs } from "@/lib/jobs-repo";
import { countriesOf, REMOTE, type Region } from "@/lib/locations";
import { getAllCountries, saveRegions } from "@/lib/locations-repo";

const MAX_NAME = 60;

function parse(raw: string): Region[] | null {
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return null;
    return data.map((r) => ({
      name: String(r?.name ?? "").trim(),
      countries: Array.isArray(r?.countries) ? r.countries.map((c: unknown) => String(c ?? "").trim()) : [],
    }));
  } catch {
    return null;
  }
}

export async function saveLocationsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  const regions = parse(String(formData.get("regions") ?? ""));
  if (!regions) return { ok: false, message: "Couldn't read the list. Reload the page and try again." };
  if (regions.length === 0) return { ok: false, message: "Add at least one continent." };

  const regionNames = new Set<string>();
  const seen = new Map<string, string>(); // lower-case country → continent
  for (const r of regions) {
    if (!r.name) return { ok: false, message: "Every continent needs a name." };
    if (r.name.length > MAX_NAME) return { ok: false, message: `“${r.name}” is too long.` };
    if (regionNames.has(r.name.toLowerCase())) return { ok: false, message: `There are two continents called “${r.name}”.` };
    regionNames.add(r.name.toLowerCase());
    if (r.countries.length === 0) return { ok: false, message: `Add at least one country to “${r.name}”, or remove it.` };

    for (const c of r.countries) {
      if (!c) return { ok: false, message: `A country in “${r.name}” has no name.` };
      if (c.length > MAX_NAME) return { ok: false, message: `“${c}” is too long.` };
      if (c.toLowerCase() === REMOTE.toLowerCase()) return { ok: false, message: "“Remote” is built in, so it can't be added as a country." };
      const other = seen.get(c.toLowerCase());
      if (other) return { ok: false, message: `“${c}” is listed under both “${other}” and “${r.name}”. Keep it in one.` };
      seen.set(c.toLowerCase(), r.name);
    }
  }

  // Jobs store their country by name, so a country (or its spelling) can't disappear while jobs still use it.
  const kept = new Set(countriesOf(regions));
  const removed = new Set((await getAllCountries()).filter((c) => !kept.has(c)));
  if (removed.size > 0) {
    const inUse = new Map<string, number>();
    for (const job of await getAllJobs()) {
      const c = jobCountry(job);
      if (removed.has(c)) inUse.set(c, (inUse.get(c) ?? 0) + 1);
    }
    if (inUse.size > 0) {
      const list = [...inUse].map(([c, n]) => `${c} (${n} job${n === 1 ? "" : "s"})`).join(", ");
      return { ok: false, message: `These countries still have jobs: ${list}. Move or delete those jobs first.` };
    }
  }

  await saveRegions(regions, session.email);
  revalidatePath("/", "layout");
  return { ok: true, message: "Saved. The location picker, contact form and job forms now use this list." };
}
