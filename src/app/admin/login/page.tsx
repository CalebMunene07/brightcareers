import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin sign in | Bridge Careers Global",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await getSession()) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo full />
        </div>
        <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-xl font-bold text-brand-dark">Admin sign in</h1>
          <p className="mt-1 text-sm text-slate-500">Manage jobs and form submissions.</p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
