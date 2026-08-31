import { ADD_ONS, PRICING_COLUMNS, SIZE_FOOTNOTE } from "@/content/site";

export default function PricingTable() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">
          Pricing
        </p>
        <h2 className="mt-2 font-heading text-3xl text-brown sm:text-4xl">
          Honest, posted prices
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {PRICING_COLUMNS.map((col) => (
          <div
            key={col.name}
            className={[
              "relative rounded-3xl p-6 shadow-card",
              col.popular
                ? "bg-brown text-cream ring-2 ring-gold"
                : "bg-card text-brown",
            ].join(" ")}
          >
            {col.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                Most popular
              </span>
            )}
            <h3 className="font-heading text-2xl">{col.name}</h3>
            <p
              className={[
                "text-xs uppercase tracking-wide",
                col.popular ? "text-cream/70" : "text-brown-soft",
              ].join(" ")}
            >
              {col.note}
            </p>
            <ul
              className={[
                "mt-5 divide-y",
                col.popular ? "divide-white/10" : "divide-black/5",
              ].join(" ")}
            >
              {col.rows.map((row) => (
                <li
                  key={row.size}
                  className="flex items-center justify-between py-2.5"
                >
                  <span
                    className={col.popular ? "text-cream/80" : "text-brown-soft"}
                  >
                    {row.size}
                  </span>
                  <span className="font-semibold">{row.price}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Add-ons */}
      <div className="mt-10 rounded-3xl bg-card p-6 shadow-card sm:p-8">
        <h3 className="font-heading text-xl text-brown">Add-ons</h3>
        <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {ADD_ONS.map((addon) => (
            <li
              key={addon.name}
              className="flex items-center justify-between border-b border-dashed border-black/10 py-2 text-sm"
            >
              <span className="text-brown-soft">{addon.name}</span>
              <span className="font-semibold text-brown">{addon.price}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 text-center text-xs text-brown-soft">{SIZE_FOOTNOTE}</p>
    </section>
  );
}
