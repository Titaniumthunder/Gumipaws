import Nav from "@/components/marketing/Nav";
import Hero from "@/components/marketing/Hero";
import Marquee from "@/components/marketing/Marquee";
import Services from "@/components/marketing/Services";
import SignaturePackage from "@/components/marketing/SignaturePackage";
import PricingTable from "@/components/marketing/PricingTable";
import HowItWorks from "@/components/marketing/HowItWorks";
import Gallery from "@/components/marketing/Gallery";
import BookingSection from "@/components/marketing/BookingSection";
import CTAFooter from "@/components/marketing/CTAFooter";

export default function HomePage() {
  return (
    <main>
      <Nav />
      <Hero />
      <Marquee />
      <Services />
      <SignaturePackage />
      <PricingTable />
      <HowItWorks />
      <Gallery />
      <BookingSection />
      <CTAFooter />
    </main>
  );
}
