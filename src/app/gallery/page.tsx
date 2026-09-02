import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/marketing/Nav";
import PageHeader from "@/components/marketing/PageHeader";
import Gallery from "@/components/marketing/Gallery";
import CTAFooter from "@/components/marketing/CTAFooter";
import { CTA } from "@/content/site";

export const metadata: Metadata = {
  title: "Gallery — GumiPaws",
  description:
    "Photographs of dogs we have groomed, before the appointment and after. Real dogs, real grooms, shown full width.",
};

/**
 * The gallery on its own page.
 *
 * This is a page for looking, so almost nothing competes with the photographs:
 * a header, the carousel at full window width, and one way to book. Padding it
 * out with copy would only push the pictures further down, which defeats the
 * point of giving them their own page in the first place.
 *
 * The header leads on the transformation rather than the word "gallery",
 * because the Gallery component brings its own "Before & after" heading and the
 * page should not say the same thing twice on the way down.
 */
export default function GalleryPage() {
  return (
    <main>
      <Nav />

      <PageHeader
        label="Gallery"
        title="The difference a groom makes"
        intro="Photographs of dogs we have groomed, taken before the appointment and after. Little else needs saying."
      />

      <Gallery heading={false} />

      <section className="mx-auto max-w-3xl px-4 pb-24 text-center sm:px-6">
        <h2 className="font-heading text-3xl text-brown sm:text-4xl">
          Your dog could be next
        </h2>
        <p className="mx-auto mt-4 max-w-md text-brown-soft">
          Pick a time that suits you and we will take it from there.
        </p>
        <Link
          href="/book"
          className="mt-8 inline-block rounded-full bg-blush px-8 py-4 font-semibold text-white shadow-card transition hover:bg-blush/90"
        >
          {CTA.primary}
        </Link>
      </section>

      <CTAFooter />
    </main>
  );
}
