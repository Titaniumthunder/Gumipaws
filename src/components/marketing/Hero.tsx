import { HOME_HERO } from "@/content/site";

/**
 * The home page hero: one photo filling the whole first screen, with the
 * headline set over it and the nav floating on top (Nav's `overlay` mode).
 *
 * There is no button here. The booking action lives in the nav, which stays
 * on screen as the visitor scrolls, so a second copy in the hero would only
 * compete with the headline.
 *
 * Two overlays sit between the photo and the type: an even top-to-bottom
 * gradient, and a darker patch behind the headline. See the notes beside each.
 *
 * The curve along the bottom is filled with the colour of the section that
 * follows (TrustStrip, `cream-deep`), so the photo appears to sit on the page
 * rather than end in a hard edge. Change that section's background and this
 * fill has to change with it.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-brown text-center"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HOME_HERO.image}
        alt={HOME_HERO.alt}
        loading="eager"
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      {/* Darkest at the top, under the nav, and the bottom, above the curve;
          lighter through the middle so the dogs still read as the subject. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/30 to-black/50"
      />
      {/* A soft dark patch behind the headline only. The photo is pale pink with
          white fur exactly where the type lands, so the overall overlay alone
          would have to go much darker to keep it readable, and that would dim
          the dogs and flatten the colour the photo is here for. Measured behind
          the type, this lifts the headline's worst spots from 2.5:1 to about
          3.9:1 contrast (large text needs 3:1) while the faces dim by only
          three more points. Centred at 58% of the height, which is where the
          text block sits at every screen size. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_22%_at_50%_58%,rgba(0,0,0,0.45),transparent)]"
      />

      {/* Sits a little below centre, over the dogs' chests rather than their
          faces. Those chests are white, so the type carries a soft shadow —
          invisible over the dark coat, but enough to hold it off bright fur. */}
      <div className="mx-auto max-w-5xl px-6 pt-[16vh] [text-shadow:0_1px_3px_rgba(0,0,0,0.45),0_2px_16px_rgba(0,0,0,0.5)]">
        <h1 className="text-balance font-heading text-4xl font-medium leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
          {HOME_HERO.headline}
        </h1>
        <p className="mt-5 text-base font-medium tracking-wide text-white/90 sm:text-lg">
          {HOME_HERO.subline}
        </p>
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-10 w-full fill-cream-deep sm:h-16 lg:h-24"
      >
        {/* Cream fills both lower corners and thins to nothing at the centre,
            so the photo bows down into the page. */}
        <path d="M0,0 Q720,200 1440,0 L1440,100 L0,100 Z" />
      </svg>
    </section>
  );
}
