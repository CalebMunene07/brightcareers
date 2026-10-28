import "server-only";
import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";

// Search and social sharing metadata shared by every public page.

export const SITE_NAME = "Bridge Careers Global";
export const SITE_DESCRIPTION =
  "Bridge Careers Global connects people with meaningful work and helps employers build great teams across the world.";

/** Link preview image for social networks and chat apps: the logo on a 1200×630 canvas. */
export const SHARE_IMAGE = { url: "/images/og-image.png", width: 1200, height: 630, alt: `${SITE_NAME} logo`, type: "image/png" };

/** The public site address from Admin → Settings (or SITE_URL), falling back to the Vercel production domain. */
export async function siteUrl() {
  const configured = (await getSettings()).siteUrl?.trim();
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const url = configured || (vercel ? `https://${vercel}` : "http://localhost:3000");
  return url.replace(/\/+$/, "");
}

/** Title, description, canonical URL and Open Graph / X card details for one page. */
export function pageMetadata(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SITE_NAME, url: path, title, description, images: [SHARE_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [SHARE_IMAGE] },
  };
}

/** Embeds schema.org structured data in a page. */
export function jsonLd(data: Record<string, unknown>) {
  // Escape "<" so text inside the data can never close the script tag.
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
