"use client";

import { useState, useTransition } from "react";
import type { ActionState } from "@/app/admin/actions";
import { scanSiteAction, translatePendingAction } from "@/app/admin/translation-actions";

export function TranslationTools({ locale, canTranslate, pending }: { locale: string; canTranslate: boolean; pending: number }) {
  const [result, setResult] = useState<ActionState | null>(null);
  const [busy, start] = useTransition();
  const run = (fn: () => Promise<ActionState>) => start(async () => setResult(await fn()));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => run(() => scanSiteAction(locale))}
          className="rounded-full border border-brand px-5 py-2 text-sm font-semibold text-brand hover:bg-brand/5 disabled:opacity-60"
        >
          {busy ? "Working…" : "Scan whole site"}
        </button>
        {canTranslate && (
          <button
            type="button"
            disabled={busy || pending === 0}
            onClick={() => run(() => translatePendingAction(locale))}
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {busy ? "Working…" : `Translate ${pending} pending now`}
          </button>
        )}
      </div>
      {result && (
        <p role="status" className={`text-sm font-medium ${result.ok ? "text-emerald-700" : "text-red-600"}`}>{result.message}</p>
      )}
    </div>
  );
}
