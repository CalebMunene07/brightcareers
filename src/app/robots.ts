import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { siteUrl } from "@/lib/seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  await connection();
  const url = await siteUrl();
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${url}/sitemap.xml`,
    host: url,
  };
}
