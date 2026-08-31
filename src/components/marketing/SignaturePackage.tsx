import { FULL_GROOM_CHECKLIST, FULL_GROOM_SIZE_PRICING } from "@/content/site";

export default function SignaturePackage() {
  return (
    <section id="full-groom" className="bg-cream-deep py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            Signature package
          </p>
          <h2 className="mt-2 font-heading text-3xl text-brown sm:text-4xl">
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
        </div>

        <div className="rounded-4xl bg-card p-8 shadow-soft">
          <h3 className="font-heading text-xl text-brown">Full groom by size</h3>
          <ul className="mt-5 divide-y divide-black/5">
            {FULL_GROOM_SIZE_PRICING.map((row) => (
              <li
                key={row.size}
                className="flex items-center justify-between py-3"
              >
                <span className="text-brown-soft">{row.size}</span>
                <span className="font-heading text-lg text-brown">
                  {row.price}
                </span>
              </li>
            ))}
          </ul>
          <a
            href="/book"
            className="mt-6 block rounded-full bg-blush px-6 py-3 text-center font-semibold text-white shadow-card transition hover:bg-blush/90"
          >
            Book the full groom
          </a>
        </div>
      </div>
    </section>
  );
}
