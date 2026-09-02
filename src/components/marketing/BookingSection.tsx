import Link from "next/link";
import { CTA } from "@/content/site";

/**
 * Homepage CTA band for booking. The wizard itself lives on its own page at
 * /book (Healthy Spot-style: marketing site links out to a dedicated booking
 * flow instead of embedding it mid-page).
 */
export default function BookingSection() {
  return (
    <section id="book" className="bg-cream-deep py-16">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">
          Book
        </p>
        <h2 className="mt-2 font-heading text-3xl text-brown sm:text-4xl">
          {CTA.primary}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-brown-soft">
          Pick your services, tell us about your pup, and choose a time.
          You&apos;ll see a clear estimated total before you confirm — no
          deposit, pay in person at pickup.
        </p>

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-brown">
          {[
            "Real, posted prices — no surprises",
            "Same-week appointments",
            "Instant email confirmation",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span
                aria-hidden
                className="grid h-5 w-5 place-items-center rounded-full bg-blush text-xs text-white"
              >
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>

        <Link
          href="/book"
          className="mt-8 inline-block rounded-full bg-blush px-10 py-4 font-heading text-lg text-white shadow-card transition hover:bg-blush/90"
        >
          {CTA.primary}
        </Link>
        <p className="mt-3 text-xs text-brown-soft">
          Takes about two minutes. No account needed.
        </p>
      </div>
    </section>
  );
}
