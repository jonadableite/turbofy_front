import { Header } from "@/components/sales/Header";
import { Hero } from "@/components/sales/Hero";
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
      <Header />
      <Hero />
      <PremiumDemo />
      <Benefits />
      <Testimonials />
      <Partners />
      <ContactForm />
      <Footer />
    </main>
  );
}
