import { Header } from "@/components/sales/Header";
import { Hero } from "@/components/sales/Hero";
import { SocialProof } from "@/components/sales/SocialProof";
import { Comparison } from "@/components/sales/Comparison";
import { PremiumDemo } from "@/components/sales/PremiumDemo";
import { Benefits } from "@/components/sales/Benefits";
import { Testimonials } from "@/components/sales/Testimonials";
import { Partners } from "@/components/sales/Partners";
import { ContactForm } from "@/components/sales/ContactForm";
import { Footer } from "@/components/sales/Footer";
export const dynamic = "force-static";

export default function Home() {
  return (
    <main>
      <SocialProof />
      <Header />
      <Hero />
      <Comparison />
      <PremiumDemo />
      <Benefits />
      <Testimonials />
      <Partners />
      <ContactForm />
      <Footer />
    </main>
  );
}
