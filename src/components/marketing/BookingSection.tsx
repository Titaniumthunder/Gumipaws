import BookingWizard from "@/components/booking/BookingWizard";

export default function BookingSection() {
  return (
    <section id="book" className="bg-cream-deep py-16">
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 sm:px-6 md:grid-cols-2">
        {/* Left: pitch */}
        <div className="md:sticky md:top-24">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            Book
          </p>
          <h2 className="mt-2 font-heading text-3xl text-brown sm:text-4xl">
            Book a spa day
          </h2>
          <p className="mt-4 max-w-md text-brown-soft">
            Pick your services, tell us about your pup, and choose a time. You&apos;ll
            see a clear estimated total before you confirm — no deposit, pay in
            person at pickup.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-brown">
            {[
              "Real, posted prices — no surprises",
              "Same-week appointments",
              "Instant email confirmation",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="grid h-5 w-5 place-items-center rounded-full bg-blush text-xs text-white"
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: wizard */}
        <BookingWizard />
      </div>
    </section>
  );
}
