import Nav from "@/components/marketing/Nav";
import Hero from "@/components/marketing/Hero";
import TrustStrip from "@/components/marketing/TrustStrip";
import Testimonial from "@/components/marketing/Testimonial";
import Services from "@/components/marketing/Services";
import PhotoBand from "@/components/marketing/PhotoBand";
import CTAFooter from "@/components/marketing/CTAFooter";

/**
 * The homepage is now a doorway, not the whole building.
 *
 * It used to carry every section the site had — the full groom explainer, the
 * process, the gallery, the booking band — so a visitor had to scroll past all
 * of it to reach anything. Those sections have moved to pages of their own, and
 * the nav gets people there in one click, which is faster than scrolling.
 *
 * What is left is the minimum needed to decide whether to keep going: who we
 * are (Hero), that other people trust us (TrustStrip), what we actually do
 * (Services), and a look at the work (PhotoBand). Testimonial sits between the
 * trust strip and the services for when there is a real quote to put there; it
 * renders nothing until then.
 *
 * The temptation will be to add "just one more" section back. Don't — the
 * length is the feature.
 *
 * No metadata export here: the homepage title and description in
 * src/app/layout.tsx are already written for this page, and repeating them
 * would mean two places to keep in step.
 */
export default function HomePage() {
  return (
    <main>
      <Nav />
      <Hero />
      <TrustStrip />
      <Testimonial />
      <Services />
      <PhotoBand />
      <CTAFooter />
    </main>
  );
}
