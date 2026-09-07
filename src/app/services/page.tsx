import type { Metadata } from "next";
import Nav from "@/components/marketing/Nav";
import PageHeader from "@/components/marketing/PageHeader";
import ServiceMenu from "@/components/marketing/ServiceMenu";
import CTAFooter from "@/components/marketing/CTAFooter";
import { CTA, SIZE_FOOTNOTE } from "@/content/site";

export const metadata: Metadata = {
  title: "Services — GumiPaws",
  description:
    "Every GumiPaws service and what it costs: baths, full grooms, puppy's first groom, poodle and doodle coats, and the full add-on menu, priced by size.",
};

/**
 * Services: pick a service, read its prices.
 *
 * Laid out after the reference site's services page, which is deliberately just
 * four things — the page title, the service names, the prices, and a way to
 * book. The service cards that used to sit above the prices here are gone: they
 * are on the homepage, where they do the job of introducing the work, and
 * repeating them directly above a list of the same services was the page
 * saying everything twice before saying anything new.
 */
export default function ServicesPage() {
  return (
    <main>
      <Nav />

      <PageHeader label="Services" title="Our services" />

      <div className="pb-4 pt-6 sm:pt-10">
        <ServiceMenu />
      </div>

      <section className="mx-auto max-w-xl px-4 pb-4 text-center sm:px-6">
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
