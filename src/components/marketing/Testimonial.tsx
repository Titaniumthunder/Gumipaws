/**
 * A single customer quote, given a whole quiet band near the top of the page.
 *
 * PLACEHOLDER: the words below are not from a real customer. Replace `QUOTE`
 * and `ATTRIBUTION` with something an actual client said before this goes
 * anywhere near production — an invented review presented as genuine is worse
 * than no review at all. The section hides itself if either is left empty.
 */
const QUOTE = "";
const ATTRIBUTION = "";

export default function Testimonial() {
  if (!QUOTE || !ATTRIBUTION) return null;

  return (
    <section className="bg-cream-deep py-20 sm:py-28">
      <figure className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <blockquote className="font-heading text-2xl leading-relaxed text-brown sm:text-3xl">
          &ldquo;{QUOTE}&rdquo;
        </blockquote>
        <figcaption className="mt-6 text-sm font-semibold uppercase tracking-widest text-gold">
          {ATTRIBUTION}
        </figcaption>
      </figure>
    </section>
  );
}
