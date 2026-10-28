import type { Metadata } from "next";
import { submitStaffRequest } from "@/app/actions";
import { TForm } from "@/components/t-form";
import { getFormLayout } from "@/lib/forms-repo";
import { PageHero } from "@/components/page-hero";
import { getPublishedIndustries } from "@/lib/industries-repo";
import { getPublishedSolutions } from "@/lib/solutions-repo";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/employers/request-staff", "Request staff | Bridge Careers Global", "Tell us about your hiring needs and we'll put together a shortlist.");

export default async function RequestStaffPage({ searchParams }: PageProps<"/employers/request-staff">) {
  const { service } = await searchParams;
  const [employerSolutions, industries] = await Promise.all([getPublishedSolutions(), getPublishedIndustries()]);
  const preselected = employerSolutions.find((s) => s.slug === service)?.title;

  return (
    <>
      <PageHero
        eyebrow="For employers"
        title="Request staff"
        text="Share a few details and a consultant will contact you within one working day."
        crumbs={[
          { label: "Employers", href: "/employers" },
          { label: "Request staff", href: "/employers/request-staff" },
        ]}
      />
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <TForm
            action={submitStaffRequest}
            layout={await getFormLayout("staff")}
            submitLabel="Send request"
            fields={[
              { name: "name", label: "Your name", required: true },
              { name: "company", label: "Company", required: true },
              { name: "email", label: "Work email", type: "email", required: true },
              { name: "phone", label: "Phone", type: "tel" },
              {
                name: "service",
                label: "Service",
                type: "select",
                options: employerSolutions.map((s) => s.title),
                defaultValue: preselected,
              },
              {
                name: "industry",
                label: "Industry",
                type: "select",
                options: industries.map((i) => i.name),
              },
              { name: "role", label: "Role(s) you're hiring for", required: true, full: true },
              { name: "headcount", label: "Number of people" },
              { name: "start", label: "Ideal start date", placeholder: "e.g. ASAP, 1 Nov" },
              { name: "details", label: "Tell us more", type: "textarea", required: true },
            ]}
          />
        </div>
      </section>
    </>
  );
}
