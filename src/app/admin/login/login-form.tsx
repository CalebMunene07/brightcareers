"use client";

import { useActionState } from "react";
import { login, type ActionState } from "@/app/admin/actions";

const input =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export function LoginForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(login, { ok: false, message: "" });

  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="email" className="text-sm font-medium text-slate-800">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required className={input} />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium text-slate-800">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={input} />
      </div>
      {state.message && (
        <p role="alert" className="text-sm font-medium text-red-600">{state.message}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
