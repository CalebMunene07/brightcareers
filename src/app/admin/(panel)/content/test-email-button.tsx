"use client";

import { useState, useTransition } from "react";
import { sendTestEmailAction, type ActionState } from "@/app/admin/actions";

export function TestEmailButton() {
  const [result, setResult] = useState<ActionState | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={() => start(async () => setResult(await sendTestEmailAction()))}
        className="rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send test email"}
      </button>
      {result && <span role="status" className={result.ok ? "text-emerald-800" : "text-red-700"}>{result.message}</span>}
    </div>
  );
}
