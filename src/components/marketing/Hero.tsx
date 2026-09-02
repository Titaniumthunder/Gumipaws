import { CTA } from "@/content/site";
import HeroSlideshow from "./HeroSlideshow";

/**
 * The first thing a visitor sees: one headline, one sentence, one action, one
 * photo.
 *
 * The stars, the "same-week spots" and "fluff guaranteed" badges and the second
 * button all used to sit here too. Six things asking for attention at once is
 * no emphasis at all, so the supporting proof moved just below the fold into
 * TrustStrip, where it still lands early without competing with the booking
 * button.
 */
export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
        <div>
          <h1 className="font-heading text-4xl leading-tight text-brown sm:text-5xl md:text-6xl">
            The spa day your pup looks forward to.
          </h1>
          <p className="mt-5 max-w-md text-lg text-brown-soft">
            Boutique grooming with warm hydro-baths, hand-finished cuts, and
            honest, posted prices.
          </p>

          <a
            href="/book"
            className="mt-8 inline-block rounded-full bg-blush px-8 py-4 font-semibold text-white shadow-card transition hover:bg-blush/90"
          >
            {CTA.primary}
          </a>
        </div>

        <div className="h-[380px] overflow-hidden rounded-4xl bg-cream-deep shadow-soft md:h-[460px]">
          <HeroSlideshow />
        </div>
      </div>
    </section>
  );
}
