import Nav from "@/components/marketing/Nav";
import Hero from "@/components/marketing/Hero";
import TrustStrip from "@/components/marketing/TrustStrip";
import Testimonial from "@/components/marketing/Testimonial";
import Marquee from "@/components/marketing/Marquee";
import Services from "@/components/marketing/Services";
import SignaturePackage from "@/components/marketing/SignaturePackage";
import PhotoBand from "@/components/marketing/PhotoBand";
import HowItWorks from "@/components/marketing/HowItWorks";
import Gallery from "@/components/marketing/Gallery";
import BookingSection from "@/components/marketing/BookingSection";
import CTAFooter from "@/components/marketing/CTAFooter";

/**
 * The homepage tells the story; the numbers live on /pricing.
 *
 * The pricing table used to sit in the middle of this page, which made it long
 * and put a wall of figures between the services and everything after them.
 * The service cards describe the work and link through instead.
 *
 * Sections alternate on purpose — full-width photography between the card
 * grids, and a call to action after each stretch rather than only at the end.
 */
export default function HomePage() {
  return (
    <main>
      <Nav />
      <Hero />
      <TrustStrip />
      <Testimonial />
      <Marquee />
      <Services />
      <SignaturePackage />
      <PhotoBand />
      <HowItWorks />
      <Gallery />
      <BookingSection />
      <CTAFooter />
    </main>
  );
}
