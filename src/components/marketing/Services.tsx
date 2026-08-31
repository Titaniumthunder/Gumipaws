import { SERVICE_CARDS } from "@/content/site";

export default function Services() {
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
        {SERVICE_CARDS.map((card) => (
          <div
            key={card.title}
            className={[
              "relative flex flex-col rounded-3xl p-6 shadow-card transition hover:-translate-y-1",
              card.accent
                ? "bg-gradient-to-br from-blush to-gold text-white"
                : "bg-card text-brown",
            ].join(" ")}
          >
            {card.badge && (
              <span className="absolute right-4 top-4 rounded-full bg-brown px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cream">
                {card.badge}
              </span>
            )}
            <h3 className="font-heading text-xl">{card.title}</h3>
            <p
              className={[
                "mt-2 flex-1 text-sm",
                card.accent ? "text-white/90" : "text-brown-soft",
              ].join(" ")}
            >
              {card.blurb}
            </p>
            {card.price && (
              <p className="mt-4 text-lg font-semibold">
                {card.price}
              </p>
            )}
            <a
              href="/book"
              className={[
                "mt-4 inline-block text-sm font-semibold underline-offset-4 hover:underline",
                card.accent ? "text-white" : "text-blush",
              ].join(" ")}
            >
              Book this →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
