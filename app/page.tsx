import ClosingCta from "@/components/ClosingCta";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Nav from "@/components/Nav";
import Reckoning from "@/components/Reckoning";
import Reveal from "@/components/Reveal";
import WhyDifferent from "@/components/WhyDifferent";

export default function Home() {
  return (
    <>
      <Reveal />

      <a
        href="#waitlist"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:rounded-full focus:bg-amber-500 focus:px-4 focus:py-2 focus:font-semibold focus:text-ink"
      >
        Skip to waitlist
      </a>

      <Nav />

      <main id="top">
        <Hero />
        <Reckoning />
        <HowItWorks />
        <WhyDifferent />
        <ClosingCta />
      </main>

      <Footer />
    </>
  );
}
