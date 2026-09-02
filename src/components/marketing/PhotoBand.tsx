/**
 * A full-width photo between two card sections.
 *
 * The middle of the page had settled into one rhythm — small label, heading,
 * row of cards, repeated — so each section stopped registering as its own
 * thing. An edge-to-edge photograph breaks that up and lets the grooming work
 * carry a stretch of the page on its own.
 */
export default function PhotoBand() {
  return (
    <section aria-label="A recent groom" className="relative">
      <div className="relative h-[280px] overflow-hidden sm:h-[360px] lg:h-[420px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/gallery/jojo-lawn-alert.jpg"
          alt="Jojo, freshly groomed, sitting alert on a sunny lawn"
          loading="lazy"
          className="h-full w-full object-cover object-center"
        />
        {/* Keeps the text legible whatever the photo is doing underneath. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-brown/70 via-brown/20 to-transparent"
        />
        <p className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-8 font-heading text-2xl text-white sm:px-6 sm:text-3xl">
          Every pup leaves fluffy, fresh, and happy.
        </p>
      </div>
    </section>
  );
}
