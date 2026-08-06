import { GALLERY_ITEMS, type GalleryClip } from "@/lib/site";
import BeforeAfterSlider from "./BeforeAfterSlider";

/** A video entry: a player sized to its grid cell. */
function GalleryVideo({ dogName, video, poster }: GalleryClip) {
  return (
    <video
      src={video}
      poster={poster}
      controls
      playsInline
      preload="metadata"
      aria-label={`Video of ${dogName} at GumiPaws`}
      className="h-full w-full bg-cream-deep object-cover"
    >
      <a href={video}>Download the video of {dogName}</a>
    </video>
  );
}

/**
 * Asymmetric 6-cell grid. The first and last cells span two rows/columns on
 * larger screens for a boutique magazine feel. Each cell renders by what the
 * entry actually has: a video clip, a drag-to-compare slider when there's both
 * a before and an after shot, or a plain photo.
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

  const hasComparison = GALLERY_ITEMS.some(
    (entry) => !("video" in entry) && entry.before,
  );

  return (
    <section id="gallery" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">
          Gallery
        </p>
        <h2 className="mt-2 font-heading text-3xl text-brown sm:text-4xl">
          Fresh from the spa
        </h2>
        {hasComparison && (
          <p className="mt-3 text-brown-soft">
            Drag the handle on a photo to see the before.
          </p>
        )}
      </div>

      <div className="grid auto-rows-[180px] grid-cols-2 gap-4 sm:grid-cols-4">
        {GALLERY_ITEMS.map((entry, i) => (
          <div
            key={entry.dogName}
            className={`overflow-hidden rounded-3xl shadow-card ${spans[i] ?? ""}`}
          >
            {"video" in entry ? (
              <GalleryVideo {...entry} />
            ) : (
              <BeforeAfterSlider {...entry} hoverZoom />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
