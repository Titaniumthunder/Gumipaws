import { GALLERY_PHOTOS } from "@/lib/site";

/**
 * Asymmetric 6-cell photo grid. The first and last cells span two rows/columns
 * on larger screens for a boutique magazine feel.
 */
export default function Gallery() {
  // Tailwind span classes per cell index (desktop layout).
  const spans = [
    "sm:col-span-2 sm:row-span-2",
    "",
    "",
    "sm:row-span-2",
    "",
    "sm:col-span-2",
  ];

  return (
    <section id="gallery" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">
          Gallery
        </p>
        <h2 className="mt-2 font-heading text-3xl text-brown sm:text-4xl">
          Fresh from the spa
        </h2>
      </div>

      <div className="grid auto-rows-[180px] grid-cols-2 gap-4 sm:grid-cols-4">
        {GALLERY_PHOTOS.map((src, i) => (
          <div
            key={src}
            className={`overflow-hidden rounded-3xl shadow-card ${spans[i] ?? ""}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Groomed dog ${i + 1}`}
              className="h-full w-full object-cover transition duration-500 hover:scale-105"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
