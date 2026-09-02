import Nav from "@/components/marketing/Nav";
import Hero from "@/components/marketing/Hero";
import TrustStrip from "@/components/marketing/TrustStrip";
import Marquee from "@/components/marketing/Marquee";
import Services from "@/components/marketing/Services";
import SignaturePackage from "@/components/marketing/SignaturePackage";
import PhotoBand from "@/components/marketing/PhotoBand";
import PricingTable from "@/components/marketing/PricingTable";
import HowItWorks from "@/components/marketing/HowItWorks";
import Gallery from "@/components/marketing/Gallery";
import BookingSection from "@/components/marketing/BookingSection";
import CTAFooter from "@/components/marketing/CTAFooter";

/**
 * Section order alternates deliberately. TrustStrip carries the proof the hero
 * shed, and PhotoBand sits between the two heaviest card grids so the middle of
 * the page is not four label-heading-cards blocks in a row.
 */
export default function HomePage() {
  return (
    <main>
      <Nav />
      <Hero />
      <TrustStrip />
      <Marquee />
      <Services />
      <SignaturePackage />
      <PhotoBand />
      <PricingTable />
      <HowItWorks />
      <Gallery />
      <BookingSection />
      <CTAFooter />
    </main>
  );
}
