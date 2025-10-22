import CTASection from './_components/cta-section'
import FeaturesSection from './_components/features'
import Footer from './_components/footer'
import Header from './_components/header'
import { HeroSection } from './_components/hero-section'
import IntegrationsSection from './_components/integrations'

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
