import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/marketing/Nav";
import PageHeader from "@/components/marketing/PageHeader";
import HowItWorks from "@/components/marketing/HowItWorks";
import SignaturePackage from "@/components/marketing/SignaturePackage";
import CTAFooter from "@/components/marketing/CTAFooter";
import { ABOUT, CTA, PROMISES } from "@/content/site";

export const metadata: Metadata = {
  title: "About — GumiPaws",
  description:
    "Who GumiPaws is for, what happens during a groom, and the four steps of a visit — posted prices, one groomer start to finish, and no deposit.",
};

/**
 * The About page: the story, the three promises, and how a visit runs.
 *
 * It is short because it is a reading page. Someone lands here to answer one
 * question — what is this place actually like — and a wall of sections gets in
 * the way of that. So the prose is a single narrow column, the promises are
 * three small cards, and everything procedural is handed to HowItWorks, which
 * already says it better than a fourth paragraph would.
 *
 * Nothing here is invented. The copy is whatever src/content/site.ts already
 * claims; if the real story needs telling, it belongs in ABOUT, not in markup.
 */
export default function AboutPage() {
  return (
    <main>
      <Nav />

      <PageHeader
        label="About"
        title="A quiet spa day for anxious dogs"
        intro="What we do, how a visit runs, and what you can count on before you book."
      />

      {/* A narrow measure and generous leading — this block is meant to be read,
          not scanned, so nothing competes with the line of text. */}
      <section className="mx-auto max-w-2xl px-4 pb-20 sm:px-6 sm:pb-28">
        <p className="text-xl leading-relaxed text-brown sm:text-2xl sm:leading-relaxed">
          {ABOUT.lead}
        </p>

        <div className="mt-10 space-y-6 text-lg leading-8 text-brown-soft">
          {ABOUT.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {/* The promises sit inside the reading block rather than in a band of
            their own: they are the end of the same thought, not a new section. */}
        <ul className="mt-14 grid gap-5 sm:grid-cols-3">
          {PROMISES.map((promise) => (
            <li
              key={promise.title}
              className="rounded-3xl bg-card p-6 shadow-soft"
            >
              <h2 className="font-heading text-lg text-brown">
                {promise.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-brown-soft">
                {promise.blurb}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-14 text-center">
          <Link
            href="/book"
            className="inline-block rounded-full bg-blush px-8 py-4 font-semibold text-white shadow-card transition hover:bg-blush/90"
          >
            {CTA.primary}
          </Link>
        </div>
      </section>

      <HowItWorks />
      <SignaturePackage />
      <CTAFooter />
    </main>
  );
}
