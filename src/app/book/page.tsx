import type { Metadata } from "next";
import Link from "next/link";
import BookingWizard from "@/components/booking/BookingWizard";

export const metadata: Metadata = {
  title: "Book a spa day — GumiPaws",
  description:
    "Pick your services, tell us about your pup, and choose a time. Clear starting prices, no deposit — pay in person at pickup.",
};

export default function BookPage() {
  return (
    <main className="min-h-screen bg-cream-deep">
      {/* Slim header so the wizard stays the focus */}
      <header className="bg-cream/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-heading text-xl text-brown transition hover:text-blush"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gumipaws-hero.png"
              alt="GumiPaws logo"
              className="h-10 w-10 rounded-full bg-cream-deep object-cover ring-1 ring-black/5"
            />
            GumiPaws
          </Link>
          <Link
            href="/"
            className="text-sm text-brown-soft underline-offset-4 transition hover:text-brown hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            Book
          </p>
          <h1 className="mt-2 font-heading text-3xl text-brown sm:text-4xl">
            Book a spa day
          </h1>
          <p className="mx-auto mt-3 max-w-md text-brown-soft">
            Pick your services, tell us about your pup, and choose a time.
            You&apos;ll see a clear estimated total before you confirm — no
            deposit, pay in person at pickup.
          </p>
        </div>

        <BookingWizard />

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-brown">
          {[
            "Real, posted prices — no surprises",
            "Same-week appointments",
            "Instant email confirmation",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
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
    </main>
  );
}
