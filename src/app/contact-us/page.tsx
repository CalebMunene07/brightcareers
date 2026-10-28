import type { Metadata } from "next";
import { getHero, heroProps } from "@/lib/heroes";
import { submitContact } from "@/app/actions";
import { TForm } from "@/components/t-form";
import { getFormLayout } from "@/lib/forms-repo";
import { Icon } from "@/components/icon";
import { LocationPicker } from "@/components/location-picker";
import { PhotoHero } from "@/components/sections";
import { getContent } from "@/lib/site-content";
import { getT } from "@/lib/translate";
import { getAllCountries } from "@/lib/locations-repo";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/contact-us", "Contact us | Bridge Careers Global", "Get in touch with Bridge Careers Global about jobs, hiring or partnerships.");

const refugeeTopic = "I'm a refugee looking for work";
const topics = ["Looking for a job", refugeeTopic, "Looking to hire", "A current client", "Something else"];

export default async function ContactPage({ searchParams }: PageProps<"/contact-us">) {
  const hero = await getHero("contact-us");
  const { country, topic } = await searchParams;
  const [offices, { contactEmail }, allCountries, t] = await Promise.all([getContent("offices"), getContent("company"), getAllCountries(), getT()]);
  const selected = typeof country === "string" && allCountries.includes(country) ? country : undefined;

  return (
    <>
      <PhotoHero
        {...heroProps(hero)}
        compact
        crumbs={[{ label: "Contact us", href: "/contact-us" }]}
      />

      <LocationPicker mode="contact" />

      <section id="form" className="scroll-mt-28 bg-muted py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200 sm:p-10">
            <h2 className="text-2xl font-bold text-brand-dark">
              {selected ? t("Contact our team for {country}", { country: t(selected) }) : t("Send us a message")}
            </h2>
            <p className="mt-2 text-slate-600">{t("We usually reply within one working day.")}</p>
            <div className="mt-8">
              <TForm
                key={`${selected ?? "none"}-${topic ?? ""}`}
                action={submitContact}
                layout={await getFormLayout("contact")}
                submitLabel="Send message"
                fields={[
                  { name: "name", label: "Full name", required: true },
                  { name: "email", label: "Email", type: "email", required: true },
                  { name: "phone", label: "Phone", type: "tel" },
                  { name: "country", label: "Country", type: "select", options: allCountries, defaultValue: selected },
                  {
                    name: "topic",
                    label: "I am…",
                    type: "select",
                    full: true,
                    options: topics,
                    defaultValue: topic === "refugee" ? refugeeTopic : undefined,
                  },
                  { name: "message", label: "Message", type: "textarea", required: true },
                ]}
              />
            </div>
          </div>

          <aside id="offices" className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-dark">{t("Our offices")}</h2>
            {offices.map((o) => (
              <div key={o.city} className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
                <h3 className="flex items-center gap-2 font-bold text-brand-dark">
                  <Icon name="map" className="h-5 w-5 text-brand" /> {t(o.city)}
                </h3>
                <p className="mt-1 text-sm text-slate-600">{t(o.address)}</p>
                <a href={`tel:${o.phone.replace(/\s/g, "")}`} className="mt-2 block text-sm font-semibold text-brand hover:underline">
                  {o.phone}
                </a>
              </div>
            ))}
            <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
              <h3 className="font-bold text-brand-dark">{t("Email")}</h3>
              <a href={`mailto:${contactEmail}`} className="mt-1 block text-sm font-semibold text-brand hover:underline">
                {contactEmail}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
