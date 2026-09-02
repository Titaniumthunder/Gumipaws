import { CTA, SERVICE_CARDS } from "@/content/site";

/**
 * Four services, described rather than priced.
 *
 * The cards used to lead with a figure, which turned the section into a price
 * list competing with the real one further down. They now say what the service
 * is and send anyone who wants numbers to /pricing, where every price is still
 * posted in full.
 */
export default function Services({ heading = true }: { heading?: boolean }) {
  const featured = SERVICE_CARDS.filter((c) => c.featured);
  const rest = SERVICE_CARDS.filter((c) => !c.featured);

  return (
    <section id="services" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      {heading && (
        <div className="mb-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            Services
          </p>
          <h2 className="mt-3 font-heading text-4xl text-brown sm:text-5xl">
            Everything your pup needs
          </h2>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((card) => (
          <div
            key={card.title}
            className="relative flex flex-col rounded-3xl bg-card p-7 text-brown shadow-card transition hover:-translate-y-1"
          >
            {card.badge && (
              <span className="absolute right-4 top-4 rounded-full bg-brown px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cream">
                {card.badge}
              </span>
            )}
            <h3 className="font-heading text-xl">{card.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-brown-soft">
              {card.blurb}
            </p>
            <a
              href={card.href ?? "/book"}
              className="mt-6 inline-block text-sm font-semibold text-blush underline-offset-4 hover:underline"
            >
              {CTA.choose(card.title)} →
            </a>
          </div>
        ))}
      </div>

      {/* The smaller services, one tap away rather than five more cards. */}
      {rest.length > 0 && (
        <details className="group mx-auto mt-10 max-w-3xl rounded-3xl bg-card p-6 shadow-card">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-brown">
            <span>More services</span>
            <span aria-hidden className="text-blush transition group-open:rotate-180">
              ▾
            </span>
          </summary>
          <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
            {rest.map((card) => (
              <li
                key={card.title}
                className="border-b border-dashed border-black/10 py-2 text-sm text-brown-soft"
              >
                {card.title}
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <a
          href="/book"
          className="rounded-full bg-blush px-8 py-4 font-semibold text-white shadow-card transition hover:bg-blush/90"
        >
          {CTA.primary}
        </a>
        <a
          href="/services"
          className="rounded-full border border-brown/20 px-8 py-4 font-semibold text-brown transition hover:bg-card"
        >
          {CTA.secondary}
        </a>
      </div>
    </section>
  );
}
