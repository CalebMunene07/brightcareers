"use client";

import { useActionState, useState, type KeyboardEvent } from "react";
import type { ActionState } from "@/app/admin/actions";
import { saveLocationsAction } from "@/app/admin/location-actions";
import type { Region } from "@/lib/locations";

const input =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";
const iconButton = "rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 hover:text-brand-dark disabled:opacity-30";

type Row = Region & { id: number };

let nextId = 0;
const withId = (r: Region): Row => ({ ...r, id: nextId++ });

export function LocationsForm({
  regions: initial,
  jobCounts,
  suggestions,
}: {
  regions: Region[];
  jobCounts: Record<string, number>;
  suggestions: string[];
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveLocationsAction, { ok: false, message: "" });
  const [regions, setRegions] = useState<Row[]>(() => initial.map(withId));
  const [drafts, setDrafts] = useState<Record<number, string>>({});

  const update = (id: number, change: (r: Row) => Row) => setRegions((rs) => rs.map((r) => (r.id === id ? change(r) : r)));

  function move(index: number, by: number) {
    setRegions((rs) => {
      const next = [...rs];
      [next[index], next[index + by]] = [next[index + by], next[index]];
      return next;
    });
  }

  function addCountry(id: number) {
    const name = (drafts[id] ?? "").trim();
    if (!name) return;
    update(id, (r) =>
      r.countries.some((c) => c.toLowerCase() === name.toLowerCase())
        ? r
        : { ...r, countries: [...r.countries, name].sort((a, b) => a.localeCompare(b)) },
    );
    setDrafts((d) => ({ ...d, [id]: "" }));
  }

  function onDraftKey(e: KeyboardEvent<HTMLInputElement>, id: number) {
    if (e.key !== "Enter") return;
    e.preventDefault(); // add the country instead of submitting the form
    addCountry(id);
  }

  const payload = JSON.stringify(regions.map(({ name, countries }) => ({ name, countries })));

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="regions" value={payload} />
      <datalist id="country-suggestions">
        {suggestions.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>

      {regions.map((region, index) => (
        <section key={region.id} className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
          <div className="flex items-center gap-2">
            <label htmlFor={`region-${region.id}`} className="sr-only">Continent name</label>
            <input
              id={`region-${region.id}`}
              value={region.name}
              onChange={(e) => update(region.id, (r) => ({ ...r, name: e.target.value }))}
              placeholder="Continent or region name, e.g. Africa"
              className={`${input} font-semibold`}
            />
            <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className={iconButton} aria-label={`Move ${region.name} up`}>↑</button>
            <button type="button" onClick={() => move(index, 1)} disabled={index === regions.length - 1} className={iconButton} aria-label={`Move ${region.name} down`}>↓</button>
            <button
              type="button"
              onClick={() => setRegions((rs) => rs.filter((r) => r.id !== region.id))}
              className="shrink-0 rounded-md px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Remove
            </button>
          </div>

          <ul className="mt-4 flex flex-wrap gap-2">
            {region.countries.map((country) => (
              <li key={country} className="inline-flex items-center gap-1 rounded-full bg-slate-100 py-1 pl-3 pr-1 text-sm text-slate-800">
                {country}
                {jobCounts[country] ? (
                  <span className="rounded-full bg-accent/30 px-1.5 text-[11px] font-semibold text-brand-dark" title="Jobs in this country">
                    {jobCounts[country]}
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => update(region.id, (r) => ({ ...r, countries: r.countries.filter((c) => c !== country) }))}
                  className="rounded-full px-1.5 text-slate-400 hover:bg-slate-200 hover:text-red-600"
                  aria-label={`Remove ${country}`}
                >
                  ×
                </button>
              </li>
            ))}
            {region.countries.length === 0 && <li className="text-sm text-slate-400">No countries yet.</li>}
          </ul>

          <div className="mt-4 flex gap-2">
            <label htmlFor={`add-${region.id}`} className="sr-only">Add a country to {region.name}</label>
            <input
              id={`add-${region.id}`}
              list="country-suggestions"
              value={drafts[region.id] ?? ""}
              onChange={(e) => setDrafts((d) => ({ ...d, [region.id]: e.target.value }))}
              onKeyDown={(e) => onDraftKey(e, region.id)}
              placeholder="Add a country…"
              className={input}
            />
            <button
              type="button"
              onClick={() => addCountry(region.id)}
              className="shrink-0 rounded-full bg-white px-5 py-2 text-sm font-semibold text-brand ring-1 ring-brand hover:bg-brand hover:text-white"
            >
              Add
            </button>
          </div>
        </section>
      ))}

      <button
        type="button"
        onClick={() => setRegions((rs) => [...rs, withId({ name: "", countries: [] })])}
        className="w-full rounded-2xl border-2 border-dashed border-slate-300 py-4 text-sm font-semibold text-slate-600 hover:border-brand hover:text-brand"
      >
        + Add continent
      </button>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="rounded-full bg-brand px-8 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
          {pending ? "Saving…" : "Save locations"}
        </button>
        {state.message && (
          <p role="status" className={`text-sm font-medium ${state.ok ? "text-emerald-700" : "text-red-600"}`}>{state.message}</p>
        )}
      </div>
    </form>
  );
}
