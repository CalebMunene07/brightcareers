import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/settings";
import { resolveTheme } from "@/lib/theme";

// Web app manifest (/manifest.webmanifest). The theme colour follows the colours saved in admin settings.
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const theme = resolveTheme(await getSettings());
  return {
    name: "Bridge Careers Global",
    short_name: "Bridge Careers",
    description:
      "Bridge Careers Global connects people with meaningful work and helps employers build great teams across the world.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: theme.brandDark,
    categories: ["business", "productivity"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
