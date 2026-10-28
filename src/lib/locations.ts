// Continents and countries for the "Find your next role" picker on /jobs, the contact page and the job forms.
// Admins manage the live list in Admin → Locations (see locations-repo.ts); these defaults apply until it's saved there.

export type Region = { name: string; countries: string[] };

export const defaultRegions: Region[] = [
  {
    name: "Europe",
    countries: [
      "Belgium",
      "France",
      "Germany",
      "Ireland",
      "Netherlands",
      "Poland",
      "Portugal",
      "Spain",
      "United Kingdom",
    ],
  },
  {
    name: "Middle East",
    countries: ["Bahrain", "Oman", "Qatar", "Saudi Arabia", "UAE"],
  },
  {
    name: "The Americas",
    countries: ["Brazil", "Canada", "Mexico", "United States"],
  },
  {
    name: "Asia Pacific",
    countries: ["Australia", "India", "Malaysia", "New Zealand", "Singapore"],
  },
];

export const REMOTE = "Remote";

/** Every country across the regions, alphabetically. */
export function countriesOf(regions: Region[]) {
  return [...new Set(regions.flatMap((r) => r.countries))].sort((a, b) => a.localeCompare(b));
}
