import FeaturesSection from "../components/landing/features";
import Footer from "../components/landing/footer";
import Header from "../components/landing/header";
import { HeroSection } from "../components/landing/hero-section";
import IntegrationsSection from "../components/landing/integrations";

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <FeaturesSection />
      <IntegrationsSection />
      <Footer />
    </>
  );
}
