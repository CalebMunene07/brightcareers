import { ObjectId } from "mongodb";
import { getSession } from "@/lib/auth";
import { readCv, type StoredCv } from "@/lib/cv-storage";
import { getDb } from "@/lib/db";
import { CUSTOM_KEY } from "@/lib/forms";
import { customFiles, getInboxType, getPath } from "@/lib/inbox";

// Streams a file uploaded with a submission (from MongoDB or the private R2 bucket) to a signed-in admin.
// e.g. /admin/files/applications/<id>/cv, /admin/files/visa/<id>/documents/passport,
// or /admin/files/visa/<id>/extra/custom_ab12 for a custom file field.
export async function GET(_req: Request, ctx: RouteContext<"/admin/files/[type]/[id]/[...path]">) {
  if (!(await getSession())) return new Response("Unauthorized", { status: 401 });

  const { type, id, path } = await ctx.params;
  const inbox = getInboxType(type);
  const field = path.join(".");
  const customKey = path.length === 2 && path[0] === "extra" && CUSTOM_KEY.test(path[1]) ? path[1] : null;
  if (!inbox || !ObjectId.isValid(id) || !(customKey || inbox.files?.some((f) => f.path === field))) {
    return new Response("Not found", { status: 404 });
  }

  const db = await getDb();
  const doc = await db
    .collection(inbox.collection)
    .findOne({ _id: new ObjectId(id) }, { projection: { [customKey ? "extraFiles" : field]: 1 } });
  const file = !doc
    ? undefined
    : customKey
      ? customFiles(doc).find((f) => f.key === customKey)?.file
      : (getPath(doc, field) as StoredCv | undefined);
  const bytes = file ? await readCv(file) : null;
  if (!file || !bytes) return new Response("Not found", { status: 404 });

  const filename = file.name.replace(/[^\w.\- ]+/g, "_");
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": file.type || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
