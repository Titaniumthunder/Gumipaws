/**
 * The top of every page except the homepage: small label, big heading, one
 * line of copy, plenty of air.
 *
 * Having one component do this is what makes a set of separate pages feel like
 * one site rather than five. Nothing else about a page top should vary.
 */
export default function PageHeader({
  label,
  title,
  intro,
}: {
  label: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-6 pt-16 text-center sm:px-6 sm:pb-10 sm:pt-24">
      <p className="text-sm font-semibold uppercase tracking-widest text-gold">
        {label}
      </p>
      <h1 className="mt-3 font-heading text-4xl text-brown sm:text-5xl">
        {title}
      </h1>
      {intro && (
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-brown-soft">
          {intro}
        </p>
      )}
    </section>
  );
}
