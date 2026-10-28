import type { Metadata } from "next";
import { getHero, heroProps } from "@/lib/heroes";
import { LocationPicker } from "@/components/location-picker";
import { FeatureGrid, PhotoHero, SplitSection } from "@/components/sections";
import { getPricing } from "@/lib/pricing-repo";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/cv-maker", "CV maker | Bridge Careers Global", "Create a professional CV in minutes with our CV maker, then download it as a PDF or send it to our consultants for free.");

export default async function CvMakerPage() {
  const [hero, { cvDownloadFee }] = await Promise.all([getHero("cv-maker"), getPricing()]);
  return (
    <>
      <PhotoHero
        {...heroProps(hero)}
        crumbs={[{ label: "CV maker", href: "/cv-maker" }]}
      />

      <FeatureGrid
        items={[
          { icon: "clock", title: "Quick to create", text: "Guided sections and an example CV help you get from blank page to finished CV fast." },
          { icon: "cv", title: "Professional templates", text: "Three clean, recruiter-friendly layouts with a choice of accent colours." },
          { icon: "check", title: "Easy to read", text: "Clear structure and readable fonts that work for people and screening software alike." },
        ]}
      />

      <SplitSection
        muted
        image="/images/laptop-woman.jpg"
        title="Tailor it for every application"
        points={[
          "Your draft saves automatically, so you can come back and update it any time",
          "Reorder experience, switch templates and change colours in one click",
          `Download a print-ready PDF for USD ${cvDownloadFee}, or send it to a Bridge consultant for free`,
        ]}
        cta={{ label: "Create your CV", href: "/cv-maker/builder" }}
      />

      <LocationPicker title="Ready to apply?" text="Once your CV is ready, choose where you'd like to work and start applying." />
    </>
  );
}
