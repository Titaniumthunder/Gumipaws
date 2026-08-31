import GalleryCarousel from "./GalleryCarousel";

/**
 * The gallery section: heading plus a one-at-a-time photo carousel.
 *
 * The layout lives in GalleryCarousel, which is a client component because it
 * tracks the current slide. Keeping this wrapper on the server means the copy
 * below is still server-rendered.
 */
export default function Gallery() {
  return (
    <section id="gallery" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">
          Gallery
        </p>
        <h2 className="mt-2 font-heading text-3xl text-brown sm:text-4xl">
          Before &amp; after
        </h2>
        <p className="mt-3 text-brown-soft">
          Real dogs, real grooms. Use the arrows to meet more of them.
        </p>
      </div>

      <GalleryCarousel />
    </section>
  );
}
