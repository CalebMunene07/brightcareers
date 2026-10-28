import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SiteChrome } from "@/components/site-chrome";
import { defaultLocale, isLocale, LOCALE_COOKIE } from "@/lib/i18n";
import { getLocalizedDictionary } from "@/lib/nav-repo";
import { SHARE_IMAGE, SITE_DESCRIPTION, SITE_NAME, siteUrl } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { resolveTheme, themeCss } from "@/lib/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Defaults for every page. Pages add their own title, description and canonical URL with pageMetadata().
export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(await siteUrl()),
    title: `${SITE_NAME} | Recruitment & Staffing`,
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    openGraph: { type: "website", siteName: SITE_NAME, images: [SHARE_IMAGE] },
    twitter: { card: "summary_large_image", images: [SHARE_IMAGE] },
  };
}

// The browser UI colour (e.g. the mobile address bar) follows the theme's dark colour.
export async function generateViewport(): Promise<Viewport> {
  return { themeColor: resolveTheme(await getSettings()).brandDark };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const saved = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale = isLocale(saved) ? saved : defaultLocale;
  const [t, settings] = await Promise.all([getLocalizedDictionary(locale), getSettings()]);
  const theme = resolveTheme(settings);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Brand colours from Admin → Settings (validated hex values) */}
        <style dangerouslySetInnerHTML={{ __html: themeCss(theme) }} />
      </head>
      <body className="min-h-full flex flex-col">
        <SiteChrome header={<Header locale={locale} t={t} />} footer={<Footer t={t.footer} locale={locale} />}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
