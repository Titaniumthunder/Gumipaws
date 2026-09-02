import GalleryCarousel from "./GalleryCarousel";

/**
 * The gallery section: heading plus a one-at-a-time photo carousel.
 *
 * The layout lives in GalleryCarousel, which is a client component because it
 * tracks the current slide. Keeping this wrapper on the server means the copy
 * below is still server-rendered.
 */
export default function Gallery({ heading = true }: { heading?: boolean }) {
  return (
    /* The heading stays in the page's column; the carousel below runs the full
       width of the window so the photos are as large as the screen allows. */
    <section id="gallery" className="py-20 sm:py-28">
      {heading && (
        <div className="mx-auto mb-10 max-w-6xl px-4 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            Gallery
          </p>
          <h2 className="mt-3 font-heading text-4xl text-brown sm:text-5xl">
            Before &amp; after
          </h2>
          <p className="mt-3 text-brown-soft">
            Real dogs, real grooms. Use the arrows to meet more of them.
          </p>
        </div>
      )}

      <GalleryCarousel />
    </section>
  );
}
