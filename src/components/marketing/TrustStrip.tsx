import { BUSINESS } from "@/content/site";

/**
 * The proof that used to crowd the hero — the review line and the two badges —
 * given its own slim band directly beneath it.
 *
 * Still the second thing on the page, so nothing is buried; it just no longer
 * competes with the headline and the booking button for the same glance.
 */
export default function TrustStrip() {
  return (
    <section className="border-y border-black/5 bg-cream-deep">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-4 text-sm text-brown sm:px-6">
        <span className="flex items-center gap-2">
          <span aria-label="5 out of 5 stars" className="text-gold">
            ★★★★★
          </span>
          <span className="text-brown-soft">Loved by 300+ local pups</span>
        </span>
        <span className="text-brown-soft">✨ Same-week spots</span>
        <span className="text-brown-soft">🛁 Fluff guaranteed</span>
        <a
          href={BUSINESS.phoneHref}
          className="font-semibold text-brown underline-offset-4 hover:underline"
        >
          Call {BUSINESS.phone}
        </a>
      </div>
    </section>
  );
}
