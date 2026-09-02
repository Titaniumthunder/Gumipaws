import type { Metadata } from "next";
import Nav from "@/components/marketing/Nav";
import PricingTable from "@/components/marketing/PricingTable";
import CTAFooter from "@/components/marketing/CTAFooter";
import { CTA, SIZE_FOOTNOTE } from "@/content/site";

export const metadata: Metadata = {
  title: "Pricing — GumiPaws",
  description:
    "Every GumiPaws price, posted in full: baths, full grooms, poodle and doodle coats, and the complete add-on menu. Priced by size, with no surprises at pickup.",
};

/**
 * Pricing on its own page.
 *
 * The homepage used to carry the whole table, which made it long and put a
 * wall of numbers between a visitor and the rest of the story. The service
 * cards now describe the work and link here, so the numbers are one click away
 * rather than unavoidable — and still posted in full, which is the promise the
 * homepage headline makes.
 */
export default function PricingPage() {
  return (
    <main>
      <Nav />

      <section className="mx-auto max-w-3xl px-4 pb-4 pt-16 text-center sm:px-6 sm:pt-24">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">
          Pricing
        </p>
        <h1 className="mt-3 font-heading text-4xl text-brown sm:text-5xl">
          Honest, posted prices
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-brown-soft">
          Every price is here in full. Your dog&apos;s size sets the starting
          price, and we confirm the final figure at drop-off before any work
          begins.
        </p>
      </section>

      <PricingTable heading={false} />

      <section className="mx-auto max-w-3xl px-4 pb-24 text-center sm:px-6">
        <a
          href="/book"
          className="inline-block rounded-full bg-blush px-8 py-4 font-semibold text-white shadow-card transition hover:bg-blush/90"
        >
          {CTA.primary}
        </a>
        <p className="mt-4 text-xs text-brown-soft">{SIZE_FOOTNOTE}</p>
      </section>

      <CTAFooter />
    </main>
  );
}
