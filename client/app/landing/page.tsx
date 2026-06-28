import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Footer from "../components/landing/Footer";
import CTA from "../components/landing/CTA";
import HowItWorks from "../components/landing/HowItWorks";
import Pricing from "../components/landing/Pricing";
import Testimonials from "../components/landing/Testimonials";

export default function LandingPage() {
  return (
    <main className="min-h-screen text-ink" dir="rtl">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      {/* <Testimonials /> */}
      <Pricing />
      <Footer />
    </main>
  );
}