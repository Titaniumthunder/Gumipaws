import type { Metadata } from "next";
import Nav from "@/components/marketing/Nav";
import PageHeader from "@/components/marketing/PageHeader";
import Services from "@/components/marketing/Services";
import PricingTable from "@/components/marketing/PricingTable";
import CTAFooter from "@/components/marketing/CTAFooter";
import { CTA, SIZE_FOOTNOTE } from "@/content/site";

export const metadata: Metadata = {
  title: "Services — GumiPaws",
  description:
    "What we do and what it costs: baths, full grooms, poodle and doodle coats, and the full add-on menu, priced by size and posted in full.",
};

/**
 * Services: the work, and the price of the work, on one page.
 *
 * These were two questions a visitor had to ask in two places — the service
 * cards described the groom, and the numbers lived a click away on /pricing.
 * Anyone weighing up a full groom wanted both at once, so they sit together
 * here.
 *
 * That is the whole page, and it is why nothing else is on it. Four sections is
 * already the most any page here carries; adding the process, the gallery or a
 * booking band would bury the prices under a scroll, which defeats the point of
 * putting them on the same page in the first place.
 */
export default function ServicesPage() {
  return (
    <main>
      <Nav />

      <PageHeader
        label="Services"
        title="What we do"
        intro="Every groom is hand-finished and sized to the coat in front of us. Here is the work, and here is what it costs."
      />

      <Services heading={false} />

      {/* PricingTable carries its own heading block, but PageHeader has already
          spent this page's h1 — so it is suppressed and the h2 written here. */}
      <section className="mx-auto max-w-3xl px-4 pt-20 text-center sm:px-6 sm:pt-28">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">
          Pricing
        </p>
        <h2 className="mt-3 font-heading text-4xl text-brown sm:text-5xl">
          Honest, posted prices
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-brown-soft">
          Your dog&apos;s size sets the starting price. We confirm the final
          figure at drop-off, before any work begins.
        </p>
      </section>

      <PricingTable heading={false} />

      <section className="mx-auto max-w-3xl px-4 pb-4 text-center sm:px-6">
        <p className="text-xs leading-relaxed text-brown-soft">
          {SIZE_FOOTNOTE}
        </p>
        <a
          href="/book"
          className="mt-8 inline-block rounded-full bg-blush px-8 py-4 font-semibold text-white shadow-card transition hover:bg-blush/90"
        >
          {CTA.primary}
        </a>
      </section>

      <CTAFooter />
    </main>
  );
}
