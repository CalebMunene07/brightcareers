"use client";

import { useState } from "react";

// Two-step destructive button (no browser confirm dialog).
export function ConfirmButton({
  action,
  label,
  confirmLabel,
}: {
  action: () => Promise<void>;
  label: string;
  confirmLabel: string;
}) {
  const [armed, setArmed] = useState(false);

  if (!armed) {
    return (
      <button type="button" onClick={() => setArmed(true)} className="rounded-full border border-red-300 px-4 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50">
        {label}
      </button>
    );
  }

  return (
    <form action={action} className="flex items-center gap-2">
      <button type="submit" className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700">
        {confirmLabel}
      </button>
      <button type="button" onClick={() => setArmed(false)} className="text-sm text-slate-500 hover:text-slate-800">
        Cancel
      </button>
    </form>
  );
}
