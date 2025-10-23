import FeaturesSection from "../components/features";
import Footer from "../components/footer";
import Header from "../components/header";
import { HeroSection } from "../components/hero-section";
import IntegrationsSection from "../components/integrations";

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
