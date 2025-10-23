import CTASection from '../components/landing/cta-section'
import FeaturesSection from '../components/landing/features'
import Footer from '../components/landing/footer'
import Header from '../components/landing/header'
import { HeroSection } from '../components/landing/hero-section'
import IntegrationsSection from '../components/landing/integrations'

export default function Home() {
	return (
		<main className="container mx-auto px-4 py-8">
			<Header />
			<HeroSection />
			<FeaturesSection />
			<IntegrationsSection />
			<CTASection />
			<Footer />
		</main>
	)
}
