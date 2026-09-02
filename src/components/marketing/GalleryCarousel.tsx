"use client";

import { useEffect, useState } from "react";
import { GALLERY_ITEMS, type GalleryClip, type GalleryPhoto } from "@/content/site";

/**
 * Distance between neighbouring slide centres, as a percentage of one slide's
 * width. Above 100 the slides sit apart; the surplus is the visible gap.
 */
const SPACING = 104;

/** How long a slide holds before the carousel advances on its own. */
const HOLD_MS = 5000;

/** A video entry: a player sized to the slide. */
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
 * One photo, sized by its `fit`. "contain" shows the whole image letterboxed
 * against the card, which the side-by-side collages need — cropping one to fill
 * would cut off the half that makes the point.
 */
function GalleryPicture({
  photo,
  loading,
}: {
  photo: GalleryPhoto;
  loading: "lazy" | "eager";
}) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={photo.after}
      alt={photo.alt ?? `${photo.dogName} at GumiPaws`}
      loading={loading}
      className={`h-full w-full ${
        photo.fit === "contain" ? "object-contain" : "object-cover"
      }`}
    />
  );
}

/** Chevron for the previous/next buttons. `flip` points it right. */
function Chevron({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={flip ? "rotate-180" : ""}
    >
      <path d="M14.5 5 7.5 12l7 7" />
    </svg>
  );
}

/**
 * A rotating carousel: the current photo centred and full strength, with the
 * previous and next ones peeking in either side, dimmed and slightly shrunk so
 * they read as context rather than competing for attention.
 *
 * Slides are positioned by their distance from the current index rather than by
 * scrolling a track. That keeps the maths in percentages — the layout stays
 * correct at any viewport width with no measuring or resize handling — and it
 * makes the wrap-around free: the offset is normalised into the range
 * [-count/2, +count/2), so the first slide is simply "one to the right" of the
 * last and the rotation never dead-ends.
 *
 * Only the three slides nearest the centre are drawn. The rest sit at opacity
 * zero with transitions switched off, so when a slide wraps from one end of the
 * strip to the other it teleports invisibly instead of sweeping across.
 *
 * It advances on its own every few seconds so a visitor sees more than the
 * opening photo without touching anything. Rotation stops while a pointer is
 * over it or keyboard focus is inside, so the arrows and dots can be used
 * without the photo changing underfoot, and it never starts at all for a
 * visitor who has asked for reduced motion — they get the first slide, held
 * still, with the controls still working.
 *
 * Navigation is buttons and dots. Arrow keys are left alone so they keep
 * scrolling the page, which is what a visitor expects while reading down it.
 */
export default function GalleryCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  // Lets a manual pick restart the countdown rather than inheriting whatever
  // was left of the previous slide's turn.
  const [tick, setTick] = useState(0);
  const count = GALLERY_ITEMS.length;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || count < 2) return;
    const id = window.setTimeout(
      // The updater form keeps this correct no matter how the timer and any
      // manual picks interleave.
      () => setIndex((current) => (current + 1) % count),
      HOLD_MS,
    );
    return () => window.clearTimeout(id);
  }, [index, paused, reducedMotion, count, tick]);

  if (count === 0) return null;

  const wrap = (i: number) => ((i % count) + count) % count;
  /**
   * The updater form reads the live index rather than the one captured when
   * this render ran — two clicks inside one batch would otherwise both start
   * from the same stale index and advance only a single slide.
   */
  const step = (delta: number) => {
    setIndex((current) => wrap(current + delta));
    setTick((t) => t + 1);
  };
  const goTo = (i: number) => {
    setIndex(wrap(i));
    setTick((t) => t + 1);
  };

  /** Signed distance from the current slide, taking the shorter way round. */
  const offsetOf = (i: number) => {
    const raw = i - index;
    if (raw > count / 2) return raw - count;
    if (raw < -count / 2) return raw + count;
    return raw;
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Grooming photos"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/*
        Full window width, and a frame sized from the viewport height so a
        maximised window gives a big photo rather than a small one floating in
        the middle. The floor keeps it usable on a short laptop window; the
        ceiling stops it towering on a very tall one.
      */}
      <div className="relative w-full">
        <div className="relative h-[58vh] max-h-[820px] min-h-[360px] overflow-hidden sm:h-[68vh] lg:h-[78vh]">
          {GALLERY_ITEMS.map((entry, i) => {
            const offset = offsetOf(i);
            const isCurrent = offset === 0;
            const isNeighbour = Math.abs(offset) === 1;
            const isDrawn = isCurrent || isNeighbour;

            return (
              <div
                key={"video" in entry ? entry.video : entry.after}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                aria-hidden={!isCurrent}
                style={{
                  transform: `translateX(calc(-50% + ${offset * SPACING}%)) scale(${
                    isCurrent ? 1 : 0.9
                  })`,
                  opacity: isDrawn ? 1 : 0,
                }}
                className={`absolute left-1/2 top-0 h-full w-[88%] overflow-hidden rounded-4xl bg-cream-deep sm:w-[80%] lg:w-[72%] ${
                  // Off-strip slides jump between the two ends; without this
                  // they would animate the whole way across.
                  isDrawn
                    ? "motion-safe:transition-[transform,opacity,filter] motion-safe:duration-500 motion-safe:ease-out"
                    : "transition-none"
                } ${
                  isCurrent
                    ? "z-10 shadow-soft"
                    : "pointer-events-none brightness-75 saturate-[0.85]"
                }`}
              >
                {"video" in entry ? (
                  <GalleryVideo {...entry} />
                ) : (
                  <GalleryPicture
                    photo={entry}
                    // The opening view should not pop in late.
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                )}
              </div>
            );
          })}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className="absolute left-1 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-card text-brown shadow-card ring-1 ring-brown/10 transition hover:bg-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:left-2"
            >
              <Chevron />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photo"
              className="absolute right-1 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-card text-brown shadow-card ring-1 ring-brown/10 transition hover:bg-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:right-2"
            >
              <Chevron flip />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          {GALLERY_ITEMS.map((entry, i) => (
            <button
              key={"video" in entry ? entry.video : entry.after}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to photo ${i + 1}`}
              aria-current={i === index}
              className={`h-2.5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${
                i === index
                  ? "w-7 bg-blush"
                  : "w-2.5 bg-brown/25 hover:bg-brown/40"
              }`}
            />
          ))}
        </div>
      )}

      {/*
        Names the visible slide for screen readers. Silent while the carousel
        is rotating on its own — announcing every automatic change would talk
        over whatever the visitor is actually reading — and polite once they
        have taken control by hovering, focusing, or picking a slide.
      */}
      <p aria-live={paused ? "polite" : "off"} className="sr-only">
        {GALLERY_ITEMS[index]?.dogName}
      </p>
    </div>
  );
}
