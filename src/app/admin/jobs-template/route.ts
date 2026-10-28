import { getSession } from "@/lib/auth";
import { toCsv } from "@/lib/csv";
import { importColumns } from "@/lib/job-import";

// Downloadable CSV template for bulk job import.
export async function GET() {
  if (!(await getSession())) return new Response("Unauthorized", { status: 401 });

  const csv = toCsv([importColumns.map((c) => c.key), importColumns.map((c) => c.example)]);
  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="bridge-jobs-template.csv"',
      "Cache-Control": "no-store",
    },
  });
}
