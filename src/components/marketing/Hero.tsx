import { BUSINESS, HERO_PHOTO } from "@/lib/site";

/** Five gold stars for the social-proof line. */
function Stars() {
  return (
    <span aria-label="5 out of 5 stars" className="text-gold">
      {"★★★★★"}
    </span>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
        {/* Copy */}
        <div>
          <h1 className="font-heading text-4xl leading-tight text-brown sm:text-5xl md:text-6xl">
            The spa day your pup looks forward to.
          </h1>
          <p className="mt-5 max-w-md text-lg text-brown-soft">
            Boutique grooming with warm hydro-baths, hand-finished cuts, and
            honest, posted prices. Your dog leaves fluffy, fresh, and happy.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#book"
              className="rounded-full bg-blush px-6 py-3 font-semibold text-white shadow-card transition hover:bg-blush/90"
            >
              Book a spa day
            </a>
            <a
              href={BUSINESS.phoneHref}
              className="rounded-full border border-brown/20 px-6 py-3 font-semibold text-brown transition hover:bg-card"
            >
              Call {BUSINESS.phone}
            </a>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-brown-soft">
            <Stars />
            <span>Loved by 300+ local pups</span>
          </div>
        </div>

        {/* Logo + badges */}
        <div className="relative">
          <div className="overflow-hidden rounded-4xl bg-cream-deep shadow-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_PHOTO}
              alt="GumiPaws — grooming, daycare & boutique"
              className="h-[380px] w-full object-contain p-4 md:h-[460px]"
              loading="eager"
            />
          </div>
          <span className="absolute -left-3 top-6 rounded-full bg-card px-4 py-2 text-sm font-semibold text-brown shadow-card">
            ✨ Same-week spots
          </span>
          <span className="absolute -right-3 bottom-6 rounded-full bg-card px-4 py-2 text-sm font-semibold text-brown shadow-card">
            🛁 Fluff guaranteed
          </span>
        </div>
      </div>
    </section>
  );
}
