"use client";

import { useEffect, useRef, useState } from "react";
import { HERO_SLIDESHOW } from "@/content/site";

/** How long each photo holds before fading to the next. */
const HOLD_MS = 4500;

/**
 * The hero photo, cycling through one dog after another.
 *
 * Every photo is stacked in the same box and cross-faded by opacity, so the
 * frame never reflows and there is no sideways movement to distract from the
 * headline beside it.
 *
 * Rotation stops while a pointer is over the image or keyboard focus is inside
 * it, so the dots can be used without the photo changing underfoot. It does not
 * start at all when the visitor has asked for reduced motion — they get the
 * first photo, held still, and the dots still work.
 */
export default function HeroSlideshow() {
  const count = HERO_SLIDESHOW.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  // Lets a manual pick restart the countdown rather than inheriting whatever
  // was left of the previous photo's turn.
  const [tick, setTick] = useState(0);
  const liveRef = useRef<HTMLParagraphElement>(null);

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

  const show = (i: number) => {
    setIndex(i);
    setTick((t) => t + 1);
  };

  return (
    <div
      className="relative h-full w-full"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {HERO_SLIDESHOW.map((photo, i) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={photo.after}
          src={photo.after}
          alt={photo.alt ?? `${photo.dogName} after a groom at GumiPaws`}
          // Only the visible photo should be announced or reachable; the rest
          // are decorative duplicates as far as a screen reader is concerned.
          aria-hidden={i !== index}
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 h-full w-full motion-safe:transition-opacity motion-safe:duration-700 ${
            photo.fit === "contain" ? "object-contain" : "object-cover"
          } ${i === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}

      {count > 1 && (
        <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-2">
          {HERO_SLIDESHOW.map((photo, i) => (
            <button
              key={photo.after}
              type="button"
              onClick={() => show(i)}
              aria-label={`Show ${photo.dogName}`}
              aria-current={i === index}
              className={`h-2 rounded-full shadow-card transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brown/40 ${
                i === index ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white/90"
              }`}
            />
          ))}
        </div>
      )}

      {/* Names the visible dog for screen readers without moving focus. */}
      <p ref={liveRef} aria-live="polite" className="sr-only">
        {HERO_SLIDESHOW[index]?.dogName}
      </p>
    </div>
  );
}
