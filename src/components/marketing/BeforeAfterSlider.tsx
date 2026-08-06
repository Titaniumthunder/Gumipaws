"use client";

import { useCallback, useRef, useState } from "react";
import type { GalleryPhoto } from "@/lib/site";

/** Arrow keys nudge the divider by this much; Shift/Page keys by the larger step. */
const STEP = 4;
const STEP_LARGE = 12;

function clamp(percent: number) {
  return Math.min(100, Math.max(0, percent));
}

export type BeforeAfterSliderProps = GalleryPhoto & {
  /** Classes for the photo frame. It fills its parent, so size the parent. */
  className?: string;
  /**
   * Zoom the photo on hover. Only applied to the single-photo fallback — on a
   * comparison it would fight the drag and shift the clip edge.
   */
  hoverZoom?: boolean;
  loading?: "lazy" | "eager";
  /** Where the divider starts, 0–100. */
  initialPosition?: number;
};

function altFor(dogName: string, stage: "before" | "after") {
  return stage === "before"
    ? `${dogName} before a groom at GumiPaws`
    : `${dogName} after a groom at GumiPaws`;
}

/**
 * A drag-to-compare pair of photos.
 *
 * The comparison UI only appears when the entry actually has *both* photos.
 * With just one — the common case while the photo library is still being built
 * up — it renders that photo on its own: no divider, no handle, no empty
 * "before" placeholder.
 */
export default function BeforeAfterSlider(props: BeforeAfterSliderProps) {
  const {
    dogName,
    before,
    after,
    className = "",
    hoverZoom = false,
    loading = "lazy",
  } = props;

  if (!before || !after) {
    const only = after || before;
    if (!only) return null;

    return (
      <div className={`relative h-full w-full overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={only}
          alt={altFor(dogName, after ? "after" : "before")}
          loading={loading}
          className={`h-full w-full object-cover ${
            hoverZoom ? "transition duration-500 hover:scale-105" : ""
          }`}
        />
      </div>
    );
  }

  return <Comparison {...props} before={before} after={after} />;
}

type ComparisonProps = BeforeAfterSliderProps & { before: string };

function Comparison({
  dogName,
  before,
  after,
  className = "",
  loading = "lazy",
  initialPosition = 50,
}: ComparisonProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(() => clamp(initialPosition));
  const [isDragging, setIsDragging] = useState(false);

  const moveTo = useCallback((clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const { left, width } = frame.getBoundingClientRect();
    if (width <= 0) return;
    setPosition(clamp(((clientX - left) / width) * 100));
  }, []);

  /**
   * Pointer events cover mouse, touch and pen in one path. Capturing the
   * pointer keeps the drag alive once it leaves the frame; `touch-pan-y` on
   * the frame leaves vertical page scrolling to the browser, which cancels the
   * drag via `pointercancel` the moment it decides the gesture is a scroll.
   */
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // A right- or middle-click shouldn't grab the divider.
    if (event.pointerType === "mouse" && event.button !== 0) return;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Capture is an enhancement — without it the drag just stops at the
      // frame edge. Never let it block the drag itself.
    }
    setIsDragging(true);
    moveTo(event.clientX);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    moveTo(event.clientX);
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? STEP_LARGE : STEP;
    let next: number;

    switch (event.key) {
      case "ArrowLeft":
      case "ArrowDown":
        next = position - step;
        break;
      case "ArrowRight":
      case "ArrowUp":
        next = position + step;
        break;
      case "PageDown":
        next = position - STEP_LARGE;
        break;
      case "PageUp":
        next = position + STEP_LARGE;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = 100;
        break;
      default:
        return;
    }

    event.preventDefault();
    setPosition(clamp(next));
  };

  const shown = Math.round(position);
  // Mid-drag the pointer already supplies the motion; easing there feels laggy.
  // Off the drag it smooths out the keyboard steps.
  const easeClip = isDragging
    ? ""
    : "motion-safe:transition-[clip-path] motion-safe:duration-100";
  const easeLeft = isDragging
    ? ""
    : "motion-safe:transition-[left] motion-safe:duration-100";

  return (
    <div
      ref={frameRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={`relative h-full w-full select-none overflow-hidden touch-pan-y ${
        isDragging ? "cursor-grabbing" : "cursor-ew-resize"
      } ${className}`}
    >
      {/* The "after" shot is the base layer; "before" is clipped over its left. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={after}
        alt={altFor(dogName, "after")}
        loading={loading}
        draggable={false}
        className="pointer-events-none h-full w-full select-none object-cover"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={before}
        alt={altFor(dogName, "before")}
        loading={loading}
        draggable={false}
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        className={`pointer-events-none absolute inset-0 h-full w-full select-none object-cover ${easeClip}`}
      />

      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brown shadow-card">
        Before
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-blush/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-card">
        After
      </span>

      <div
        aria-hidden="true"
        style={{ left: `${position}%` }}
        className={`pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white/90 shadow-soft ${easeLeft}`}
      />

      <div
        role="slider"
        tabIndex={0}
        aria-label={`Drag to compare ${dogName}'s before and after groom photos`}
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={shown}
        aria-valuetext={`${shown}% of the before photo shown`}
        onKeyDown={handleKeyDown}
        style={{ left: `${position}%` }}
        className={`absolute top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-card text-brown shadow-soft ring-1 ring-brown/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${easeLeft}`}
      >
        <DragArrows />
      </div>
    </div>
  );
}

/** Outward chevrons — the "you can drag this" affordance on the handle. */
function DragArrows() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M9.5 7.5 5 12l4.5 4.5" />
      <path d="M14.5 7.5 19 12l-4.5 4.5" />
    </svg>
  );
}
