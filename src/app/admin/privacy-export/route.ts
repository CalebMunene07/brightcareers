import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { exportByEmail } from "@/lib/privacy";

// JSON export of everything held about one email address (for data access requests).
export async function GET(req: NextRequest) {
  if (!(await getSession())) return new Response("Unauthorized", { status: 401 });
  const email = req.nextUrl.searchParams.get("email")?.trim() ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return new Response("Invalid email", { status: 400 });

  const data = await exportByEmail(email);
  const name = email.replace(/[^\w.-]+/g, "_");
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="data-export-${name}.json"`,
      "Cache-Control": "private, no-store",
    },
  });
}
