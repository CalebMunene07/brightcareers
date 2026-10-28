"use client";

import { useState, useTransition } from "react";
import type { ActionState } from "@/app/admin/actions";
import { runRetentionAction } from "@/app/admin/privacy-actions";

export function RetentionButton() {
  const [result, setResult] = useState<ActionState | null>(null);
  const [pending, start] = useTransition();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={() => start(async () => setResult(await runRetentionAction()))}
        className="rounded-full border border-brand px-5 py-2 text-sm font-semibold text-brand hover:bg-brand/5 disabled:opacity-60"
      >
        {pending ? "Cleaning up…" : "Run cleanup now"}
      </button>
      {result && <span role="status" className="text-sm text-slate-700">{result.message}</span>}
    </div>
  );
}
