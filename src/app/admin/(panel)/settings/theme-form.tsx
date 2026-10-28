"use client";

import { useActionState, useState } from "react";
import type { ActionState } from "@/app/admin/actions";
import { saveSettingsAction } from "@/app/admin/settings-actions";
import type { SettingField } from "@/lib/settings";
import { contrastWarnings, defaultTheme, isHexColor, type Theme } from "@/lib/theme";
import type { FieldState } from "./settings-form";

const keyFor: Record<string, keyof Theme> = { brandColor: "brand", brandDarkColor: "brandDark", accentColor: "accent" };

export function ThemeForm({ fields, states }: { fields: SettingField[]; states: Record<string, FieldState> }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveSettingsAction, { ok: false, message: "" });
  const [colors, setColors] = useState<Theme>(() => {
    const t = { ...defaultTheme };
    for (const f of fields) {
      const v = states[f.key]?.value;
      if (v && isHexColor(v)) t[keyFor[f.key]] = v.toLowerCase();
    }
    return t;
  });

  // The preview and warnings only use valid colours; half-typed hex values are ignored.
  const valid = (Object.keys(colors) as (keyof Theme)[]).every((k) => isHexColor(colors[k]));
  const preview = valid ? colors : defaultTheme;
  const warnings = valid ? contrastWarnings(colors) : [];
  const customised = fields.some((f) => states[f.key]?.source !== "none");

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="section" value="branding" />

      <div className="grid gap-4 sm:grid-cols-3">
        {fields.map((f) => {
          const k = keyFor[f.key];
          const id = `branding-${f.key}`;
          return (
            <div key={f.key}>
              <label htmlFor={id} className="text-sm font-medium text-slate-800">{f.label}</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="color"
                  aria-label={`${f.label} picker`}
                  value={isHexColor(colors[k]) ? colors[k] : defaultTheme[k]}
                  onChange={(e) => setColors((c) => ({ ...c, [k]: e.target.value }))}
                  className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
                />
                <input
                  id={id}
                  name={f.key}
                  value={colors[k]}
                  onChange={(e) => setColors((c) => ({ ...c, [k]: e.target.value.trim() }))}
                  spellCheck={false}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm uppercase text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>
              {f.help && <p className="mt-1 text-xs text-slate-500">{f.help}</p>}
              {state.errors?.[f.key] && <p className="mt-1 text-xs text-red-600">{state.errors[f.key]}</p>}
            </div>
          );
        })}
      </div>

      {/* Live preview using the chosen colours */}
      <div className="overflow-hidden rounded-xl ring-1 ring-slate-200" aria-label="Preview">
        <div className="flex items-center justify-between px-4 py-3 text-sm font-bold text-white" style={{ background: preview.brand }}>
          <span>Bridge Careers</span>
          <span className="font-semibold opacity-90">Find a Job · Who We Are</span>
        </div>
        <div className="px-4 py-6 text-white" style={{ background: preview.brandDark }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: preview.accent }}>For job seekers</p>
          <p className="mt-1 text-xl font-bold">Work that fits your life</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full px-4 py-2 text-sm font-semibold" style={{ background: preview.accent, color: preview.brandDark }}>Search jobs</span>
            <span className="rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ background: preview.brand }}>Build your CV</span>
          </div>
        </div>
        <div className="bg-white px-4 py-3 text-sm">
          <span className="font-semibold" style={{ color: preview.brand }}>A link in your main colour →</span>
        </div>
      </div>

      {warnings.length > 0 && (
        <ul role="alert" className="space-y-1 rounded-lg bg-amber-50 p-3 text-sm text-amber-900 ring-1 ring-amber-200">
          {warnings.map((w) => (
            <li key={w}>⚠ {w}</li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
        <button type="submit" disabled={pending || !valid} className="rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
          {pending ? "Saving…" : "Save colours"}
        </button>
        {customised && (
          <button
            type="submit"
            name="reset"
            value="1"
            disabled={pending}
            onClick={() => setColors({ ...defaultTheme })}
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:border-brand hover:text-brand disabled:opacity-60"
          >
            Reset to default colours
          </button>
        )}
        {state.message && (
          <span role="status" className={`text-sm font-medium ${state.ok ? "text-emerald-700" : "text-red-600"}`}>{state.message}</span>
        )}
      </div>
      <p className="text-xs text-slate-500">Saved colours apply to every page within a few seconds. Refresh to see them here.</p>
    </form>
  );
}
