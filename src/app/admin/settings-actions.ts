"use server";

import { randomUUID } from "node:crypto";
import { DeleteObjectCommand, HeadBucketCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { generateText } from "ai";
import { revalidatePath } from "next/cache";
import type { ActionState } from "@/app/admin/actions";
import { aiEnabled, aiModel } from "@/lib/ai";
import { requireAdmin } from "@/lib/auth";
import { sendEmail } from "@/lib/notify";
import { getSettings, saveSection, settingSections } from "@/lib/settings";
import { isHexColor } from "@/lib/theme";
import { invalidateTranslations } from "@/lib/translate";
import { activeTranslator } from "@/lib/translators";

const isUrl = (v: string) => /^https?:\/\/[^\s/]+[^\s]*$/.test(v);

export async function saveSettingsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  const sectionId = String(formData.get("section") ?? "");
  const section = settingSections.find((s) => s.id === sectionId);
  if (!section) return { ok: false, message: "Unknown section." };

  // "Reset" saves the section empty, so the built-in defaults apply again.
  const reset = formData.get("reset") === "1";
  const input = Object.fromEntries(section.fields.map((f) => [f.key, reset ? "" : String(formData.get(f.key) ?? "")]));
  const clear = formData.getAll("clear").map(String);

  const errors: Record<string, string> = {};
  if (input.smtpPort && !/^\d{2,5}$/.test(input.smtpPort.trim())) errors.smtpPort = "Use a port number, e.g. 587.";
  for (const k of ["siteUrl", "r2PublicUrl"]) if (input[k]?.trim() && !isUrl(input[k].trim())) errors[k] = "Use a full address starting with https://";
  if (input.translator && !["azure", "google", "ai"].includes(input.translator)) errors.translator = "Choose a service.";
  for (const f of section.fields) {
    if (f.color && input[f.key] && !isHexColor(input[f.key].trim())) errors[f.key] = "Use a colour like #da291c.";
  }
  if (Object.keys(errors).length > 0) return { ok: false, message: "Please fix the highlighted fields.", errors };

  try {
    await saveSection(sectionId, input, clear, session.email);
  } catch (error) {
    console.error("Saving settings failed", error);
    return { ok: false, message: error instanceof Error ? error.message : "Couldn't save settings." };
  }
  if (sectionId === "translation" || sectionId === "ai") invalidateTranslations();
  revalidatePath(sectionId === "branding" ? "/" : "/admin", "layout");
  return { ok: true, message: reset ? "Reset to the default colours." : "Saved." };
}

/** Checks that the saved credentials for one section actually work. */
export async function testSettingsAction(sectionId: string): Promise<ActionState> {
  const session = await requireAdmin();
  const s = await getSettings();
  const fail = (e: unknown) => ({ ok: false, message: `Test failed: ${e instanceof Error ? e.message.slice(0, 300) : "unknown error"}` });

  try {
    if (sectionId === "email") {
      if (!s.smtpHost || !s.smtpFrom) return { ok: false, message: "Add the SMTP host and From address first." };
      await sendEmail([session.email], "Test – Bridge Careers Global settings", [
        ["Result", "Your email settings work."],
        ["Sent to", session.email],
      ]);
      return { ok: true, message: `Test email sent to ${session.email}.` };
    }

    if (sectionId === "storage") {
      if (!s.r2AccountId || !s.r2AccessKeyId || !s.r2SecretAccessKey || !s.r2Bucket) return { ok: false, message: "Add the account ID, keys and public bucket first." };
      const client = new S3Client({
        region: "auto",
        endpoint: `https://${s.r2AccountId}.r2.cloudflarestorage.com`,
        credentials: { accessKeyId: s.r2AccessKeyId, secretAccessKey: s.r2SecretAccessKey },
      });
      const key = `uploads/_settings-test-${randomUUID()}.txt`;
      await client.send(new PutObjectCommand({ Bucket: s.r2Bucket, Key: key, Body: "ok", ContentType: "text/plain" }));
      let publicOk = "public URL not set";
      if (s.r2PublicUrl) {
        const res = await fetch(`${s.r2PublicUrl.replace(/\/+$/, "")}/${key}`, { cache: "no-store" });
        publicOk = res.ok ? "public URL works" : `public URL returned ${res.status}`;
      }
      await client.send(new DeleteObjectCommand({ Bucket: s.r2Bucket, Key: key }));
      let privateOk = "no private bucket (CVs stay in MongoDB)";
      if (s.r2PrivateBucket) {
        await client.send(new HeadBucketCommand({ Bucket: s.r2PrivateBucket }));
        privateOk = "private bucket reachable";
      }
      return { ok: !publicOk.includes("returned"), message: `Upload works; ${publicOk}; ${privateOk}.` };
    }

    if (sectionId === "translation") {
      const translator = await activeTranslator();
      if (!translator) return { ok: false, message: "No translation service has a key yet." };
      const [out] = await translator.translate(["Find your next job"], "fr");
      return { ok: true, message: `${translator.name} works: “Find your next job” → “${out}”.` };
    }

    if (sectionId === "ai") {
      if (!(await aiEnabled())) return { ok: false, message: "Add an AI Gateway API key first." };
      const { text } = await generateText({ model: await aiModel("cv"), prompt: "Reply with the single word: ready", maxOutputTokens: 10 });
      return { ok: true, message: `AI Gateway works (model replied “${text.trim().slice(0, 40)}”).` };
    }

    return { ok: false, message: "Nothing to test for this section." };
  } catch (error) {
    console.error(`Settings test (${sectionId}) failed`, error);
    return fail(error);
  }
}
