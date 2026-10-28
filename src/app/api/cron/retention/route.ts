import { timingSafeEqual } from "node:crypto";
import { runRetention } from "@/lib/privacy";
import { setting } from "@/lib/settings";

// Scheduled data-retention cleanup. Call daily with "Authorization: Bearer <CRON_SECRET>"
// (Vercel Cron sends this header automatically when CRON_SECRET is set).
export async function GET(req: Request) {
  const secret = await setting("cronSecret");
  const given = Buffer.from(req.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret ?? ""}`);
  if (!secret || given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return new Response("Unauthorized", { status: 401 });
  }
  const result = await runRetention("cron");
  return Response.json({ ok: true, deleted: result });
}
