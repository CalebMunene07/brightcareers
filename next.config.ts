import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  // Room for CV and visa document uploads (Vercel caps request bodies at 4.5 MB).
  experimental: { serverActions: { bodySizeLimit: "4.4mb" } },
  async redirects() {
    return [
      { source: "/about", destination: "/employers/who-we-are", permanent: true },
      { source: "/contact", destination: "/contact-us", permanent: true },
      { source: "/find-a-job", destination: "/", permanent: true },
      { source: "/industries", destination: "/employers/industries", permanent: true },
      { source: "/industries/:slug", destination: "/employers/industries/:slug", permanent: true },
      {
        source: "/employers/:slug(flexible-staffing|permanent-recruitment|training)",
        destination: "/employers/solutions/:slug",
        permanent: true,
      },
      { source: "/employers/recruitment-outsourcing", destination: "/employers/solutions/outsourcing", permanent: true },
      { source: "/employers/diversity-inclusion", destination: "/employers/solutions/diversity-and-inclusion", permanent: true },
    ];
  },
};

export default nextConfig;
