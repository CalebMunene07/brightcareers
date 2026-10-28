import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { TicketForm } from "@/components/visa/ticket-form";
import { getT } from "@/lib/translate";
import { customStrings } from "@/lib/forms";
import { getFormLayout } from "@/lib/forms-repo";
import { getPricing } from "@/lib/pricing-repo";
import { visaFormLabels } from "@/lib/visa-labels";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/air-ticket-booking", "Air ticket booking | Bridge Careers Global", "Share your route and travel preferences. Our team will compare flight options and confirm the fare before you pay.");

export default async function AirTicketBookingPage() {
  const [layout, pricing] = await Promise.all([getFormLayout("ticket"), getPricing()]);
  const [t, labels] = await Promise.all([getT(), visaFormLabels(customStrings(layout))]);
  return (
    <>
      <section className="relative overflow-hidden bg-brand-dark text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "linear-gradient(110deg, var(--brand-dark) 35%, color-mix(in srgb, var(--brand) 85%, var(--brand-dark)) 100%)" }}
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1fr_auto] md:py-20 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t("Travel with confidence")}</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{t("Air ticket booking")}</h1>
            <p className="mt-5 max-w-2xl text-lg text-white/85">
              {t("Share your route and travel preferences. Our team will help you compare suitable flight options and confirm the fare before payment.")}
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
              {[
                ["globe", "Route support"],
                ["shield", "Secure request"],
                ["users", "Flexible passengers"],
              ].map(([icon, label]) => (
                <li key={label} className="flex items-center gap-2">
                  <Icon name={icon as "globe"} className="h-4 w-4 text-accent" />
                  {t(label)}
                </li>
              ))}
            </ul>
          </div>
          <div aria-hidden="true" className="hidden h-36 w-64 -rotate-12 items-center justify-center rounded-[50%] border-2 border-accent/70 md:flex">
            <Icon name="plane" className="h-16 w-16 rotate-12 text-accent" />
          </div>
        </div>
      </section>

      <section className="bg-muted py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <TicketForm labels={labels} layout={layout} pricing={pricing} />
        </div>
      </section>
    </>
  );
}
