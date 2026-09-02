import { CTA, FULL_GROOM_CHECKLIST } from "@/content/site";

/**
 * The Full Groom, explained once.
 *
 * This section used to carry its own "full groom by size" price list, the same
 * five rows the pricing table repeats a screen later. Saying it twice made the
 * page longer without telling anyone anything new, so the prices live in the
 * pricing table alone and a photograph takes the space — which also breaks up
 * the run of card grids through the middle of the page.
 */
export default function SignaturePackage() {
  return (
    <section id="full-groom" className="bg-cream-deep py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            Signature package
          </p>
          <h2 className="mt-3 font-heading text-4xl text-brown sm:text-5xl">
            The GumiPaws Full Groom
          </h2>
          <p className="mt-4 max-w-md text-brown-soft">
            Our most-loved, all-inclusive spa treatment — everything from bath to
            bow, hand-finished by a groomer who knows your pup by name.
          </p>

          <ul className="mt-6 space-y-3">
            {FULL_GROOM_CHECKLIST.map((item) => (
              <li key={item} className="flex items-start gap-3 text-brown">
                <span
                  aria-hidden
                  className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blush text-xs text-white"
                >
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="/book"
              className="rounded-full bg-blush px-6 py-3 font-semibold text-white shadow-card transition hover:bg-blush/90"
            >
              {CTA.primary}
            </a>
            <a
              href="/pricing"
              className="rounded-full border border-brown/20 px-6 py-3 font-semibold text-brown transition hover:bg-card"
            >
              {CTA.secondary}
            </a>
          </div>
        </div>

        <div className="h-[380px] overflow-hidden rounded-4xl bg-card shadow-soft md:h-[440px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gallery/transformation-3.jpg"
            alt="A small white dog before and after a full groom: damp and scruffy in a towel, then dry and neatly rounded"
            loading="lazy"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}
