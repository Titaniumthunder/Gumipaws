import { HOME_HERO } from "@/content/site";

/**
 * The home page hero: one photo filling the whole first screen, with the
 * headline set over it and the nav floating on top (Nav's `overlay` mode).
 *
 * There is no button here. The booking action lives in the nav, which stays
 * on screen as the visitor scrolls, so a second copy in the hero would only
 * compete with the headline.
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
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/25 to-black/50"
      />

      {/* Sits a little below centre, over the dogs' chests rather than their
          faces. Those chests are white, so the type carries a soft shadow —
          invisible over the dark coat, but enough to hold it off bright fur. */}
      <div className="mx-auto max-w-5xl px-6 pt-[16vh] [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]">
        <h1 className="text-balance font-heading text-4xl font-medium leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
          {HOME_HERO.headline}
        </h1>
        <p className="mt-5 text-base tracking-wide text-white/85 sm:text-lg">
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
