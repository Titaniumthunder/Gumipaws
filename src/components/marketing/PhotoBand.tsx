/**
 * A full-width photograph between two sections.
 *
 * The middle of a page settles into one rhythm — label, heading, cards,
 * repeated — and each block stops registering as its own thing. An
 * edge-to-edge photograph breaks that up.
 *
 * The photo is landscape on purpose. A wide band crops a portrait shot to a
 * narrow horizontal strip, which is what happened when this used one of the
 * 900x1600 phone photos.
 */
const PHOTO = "/gallery/jojo-nap.jpg";
const ALT = "Jojo fast asleep among soft toys after a long spa day";

export default function PhotoBand() {
  return (
    <section aria-label="After a groom" className="relative">
      <div className="relative h-[280px] overflow-hidden sm:h-[360px] lg:h-[420px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PHOTO}
          alt={ALT}
          loading="lazy"
          className="h-full w-full object-cover object-center"
        />
        {/* Keeps the line legible whatever the photo is doing underneath. */}
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
