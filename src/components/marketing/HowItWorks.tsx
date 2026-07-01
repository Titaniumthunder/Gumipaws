import { HOW_IT_WORKS } from "@/lib/site";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-brown py-16 text-cream">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            How it works
          </p>
          <h2 className="mt-2 font-heading text-3xl sm:text-4xl">
            Four calm, happy steps
          </h2>
        </div>

        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((s) => (
            <li key={s.step} className="text-center sm:text-left">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-blush font-heading text-xl text-white">
                {s.step}
              </span>
              <h3 className="mt-4 font-heading text-xl">{s.title}</h3>
              <p className="mt-2 text-sm text-cream/70">{s.blurb}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
