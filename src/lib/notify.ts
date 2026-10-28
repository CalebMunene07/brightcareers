import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { getSettings } from "@/lib/settings";
import { resolveTheme } from "@/lib/theme";
import { getContent } from "@/lib/site-content";

// Email alerts for new form submissions, sent over SMTP (works with any provider).
// SMTP details come from Admin → Settings (or the SMTP_* environment variables). Recipients are
// managed in Admin → Site content → Notifications (falls back to NOTIFY_EMAILS).

// One transporter per SMTP configuration, rebuilt when the settings change.
let transporter: { key: string; t: Transporter } | null = null;

async function smtp() {
  const s = await getSettings();
  if (!s.smtpHost || !s.smtpFrom) return null;
  const port = Number(s.smtpPort) || 587;
  const key = [s.smtpHost, port, s.smtpUser, s.smtpPass].join("|");
  if (transporter?.key !== key) {
    transporter = {
      key,
      t: nodemailer.createTransport({
        host: s.smtpHost,
        port,
        secure: port === 465,
        auth: s.smtpUser ? { user: s.smtpUser, pass: s.smtpPass } : undefined,
      }),
    };
  }
  return { transporter: transporter.t, from: s.smtpFrom, siteUrl: s.siteUrl };
}

export async function emailConfigured() {
  return !!(await smtp());
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export async function recipients() {
  const { recipients: list } = await getContent("notifications");
  const raw = list || process.env.NOTIFY_EMAILS || "";
  return raw
    .split(/[,;\s]+/)
    .map((e) => e.trim())
    .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
}

export async function sendEmail(to: string[], subject: string, fields: [string, string][], link?: string) {
  const cfg = await smtp();
  if (!cfg || to.length === 0) return false;
  const brand = resolveTheme(await getSettings()).brand;

  const text = [...fields.map(([k, v]) => `${k}: ${v}`), "", link ? `Open in admin: ${link}` : ""].join("\n");
  const rows = fields
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#64748b;vertical-align:top">${escapeHtml(k)}</td><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join("");
  const html = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#12202f">
    <h2 style="color:${brand};margin:0 0 12px">${escapeHtml(subject)}</h2>
    <table style="border-collapse:collapse">${rows}</table>
    ${link ? `<p style="margin-top:20px"><a href="${escapeHtml(link)}" style="background:${brand};color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none">Open in admin</a></p>` : ""}
  </div>`;

  await cfg.transporter.sendMail({ from: cfg.from, to, subject, text, html });
  return true;
}

/** Sends a "new submission" alert to the configured recipients. Never throws. */
export async function notifyNewSubmission(kind: string, fields: [string, string][], adminPath: string) {
  try {
    const to = await recipients();
    const base = ((await getSettings()).siteUrl ?? "").replace(/\/+$/, "");
    const sent = await sendEmail(to, `New ${kind} – Bridge Careers Global`, fields, base ? `${base}${adminPath}` : undefined);
    if (!sent) console.info(`[notify] skipped ${kind} alert (email not configured or no recipients)`);
  } catch (error) {
    console.error(`[notify] failed to send ${kind} alert`, error);
  }
}
