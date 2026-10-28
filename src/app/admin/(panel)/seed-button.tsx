"use client";

import { useState, useTransition } from "react";
import type { ActionState } from "@/app/admin/actions";
import { seedStarterContentAction } from "@/app/admin/seed-actions";

export function SeedButton() {
  const [result, setResult] = useState<ActionState | null>(null);
  const [pending, start] = useTransition();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={() => start(async () => setResult(await seedStarterContentAction()))}
        className="rounded-full border border-brand px-5 py-2 text-sm font-semibold text-brand hover:bg-brand/5 disabled:opacity-60"
      >
        {pending ? "Loading…" : "Load starter content"}
      </button>
      {result && <span role="status" className={`text-sm ${result.ok ? "text-emerald-700" : "text-red-600"}`}>{result.message}</span>}
    </div>
  );
}
