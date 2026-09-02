import { CTA, SERVICE_CARDS } from "@/content/site";

/**
 * The four headline services as cards, with the smaller ones tucked into a
 * dropdown below.
 *
 * All eight used to sit in the grid at once. On a phone that is eight stacked
 * cards to scroll before reaching anything else, and the four that matter
 * carried no more weight than "Teeth Brushing". The rest are one tap away, and
 * every price is still posted in full further down the page.
 */
export default function Services() {
  const featured = SERVICE_CARDS.filter((c) => c.featured);
  const rest = SERVICE_CARDS.filter((c) => !c.featured);

  return (
    <section id="services" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">
          Services
        </p>
        <h2 className="mt-2 font-heading text-3xl text-brown sm:text-4xl">
          Everything your pup needs
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((card) => (
          <div
            key={card.title}
            className="relative flex flex-col rounded-3xl bg-card p-6 text-brown shadow-card transition hover:-translate-y-1"
          >
            {card.badge && (
              <span className="absolute right-4 top-4 rounded-full bg-brown px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cream">
                {card.badge}
              </span>
            )}
            <h3 className="font-heading text-xl">{card.title}</h3>
            <p className="mt-2 flex-1 text-sm text-brown-soft">{card.blurb}</p>
            {card.price && (
              <p className="mt-4 text-lg font-semibold">{card.price}</p>
            )}
            <a
              href={card.href ?? "/book"}
              className="mt-4 inline-block text-sm font-semibold text-blush underline-offset-4 hover:underline"
            >
              {CTA.choose(card.title)} →
            </a>
          </div>
        ))}
      </div>

      {/* Everything else, one tap away rather than four more cards to scroll. */}
      {rest.length > 0 && (
        <details className="group mx-auto mt-8 max-w-3xl rounded-3xl bg-card p-5 shadow-card">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-brown">
            <span>More services</span>
            <span
              aria-hidden
              className="text-blush transition group-open:rotate-180"
            >
              ▾
            </span>
          </summary>
          <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {rest.map((card) => (
              <li
                key={card.title}
                className="flex items-baseline justify-between gap-4 border-b border-dashed border-black/10 py-2 text-sm"
              >
                <span className="text-brown-soft">{card.title}</span>
                <span className="shrink-0 font-semibold text-brown">
                  {card.price ?? "In store"}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="mt-8 text-center">
        <a
          href="#pricing"
          className="inline-block rounded-full border border-brown/20 px-6 py-3 font-semibold text-brown transition hover:bg-card"
        >
          {CTA.secondary}
        </a>
      </div>
    </section>
  );
}
