import type { Metadata } from "next";
import Nav from "@/components/marketing/Nav";
import PageHeader from "@/components/marketing/PageHeader";
import CTAFooter from "@/components/marketing/CTAFooter";
import { BUSINESS, CTA } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact — GumiPaws",
  description:
    "Phone, email, address and opening hours for GumiPaws, plus the online booking link. No deposit — pay in person at pickup.",
};

/**
 * Contact details, and nothing else.
 *
 * Everything a visitor needs here fits on one screen: how to reach us, when we
 * are open, and the one button that actually gets them an appointment. Padding
 * this page out with reassurance copy or another photo band would only push the
 * phone number further down.
 *
 * There is deliberately no contact form. A form needs a POST endpoint to
 * receive it, and the site has none — a form that silently discards a message
 * is worse than no form, because the sender believes they have been in touch.
 * Add one only once there is a route on the other end of it.
 */
export default function ContactPage() {
  return (
    <main>
      <Nav />

      <PageHeader
        label="Contact"
        title="Come and say hello"
        intro="Booking online is the quickest way to a spot, but the phone and the inbox are always open."
      />

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 sm:pb-28">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: the details themselves, marked up as a real <address>. */}
          <div className="rounded-3xl bg-card p-8 shadow-card sm:p-10">
            <h2 className="font-heading text-2xl text-brown">Find us</h2>

            <address className="mt-8 space-y-7 not-italic">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                  Phone
                </p>
                <a
                  href={BUSINESS.phoneHref}
                  className="mt-1 block text-lg font-semibold text-brown transition hover:text-blush"
                >
                  {BUSINESS.phone}
                </a>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                  Email
                </p>
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="mt-1 block text-lg font-semibold text-brown transition hover:text-blush"
                >
                  {BUSINESS.email}
                </a>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                  The spa
                </p>
                <p className="mt-1 text-lg text-brown-soft">
                  {BUSINESS.address}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                  Hours
                </p>
                <p className="mt-1 text-lg text-brown-soft">{BUSINESS.hours}</p>
              </div>
            </address>
          </div>

          {/* Right: the action. The page exists to get someone booked. */}
          <div className="rounded-3xl bg-cream-deep p-8 shadow-card sm:p-10">
            <h2 className="font-heading text-2xl text-brown">Book online</h2>
            <p className="mt-4 text-lg leading-relaxed text-brown-soft">
              Booking takes a couple of minutes and there is no deposit. Pick a
              service and a time, and we confirm the final price at drop-off
              before anything begins.
            </p>
            <p className="mt-4 leading-relaxed text-brown-soft">
              Not sure which groom your dog needs? Ring us, or have a look at
              what each one includes.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/book"
                className="rounded-full bg-blush px-8 py-4 font-semibold text-white shadow-card transition hover:bg-blush/90"
              >
                {CTA.primary}
              </a>
              <a
                href="/services"
                className="rounded-full border border-brown/20 px-8 py-4 font-semibold text-brown transition hover:bg-card"
              >
                {CTA.secondary}
              </a>
            </div>
          </div>
        </div>
      </section>

      <CTAFooter />
    </main>
  );
}
