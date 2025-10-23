'use client'

import Link from 'next/link'

export default function CTASection() {
	return (
		<section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					{/* Main CTA */}
					<div className="max-w-4xl mx-auto">
						<h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
							Ready to Experience the Future of AI Knowledge?
						</h2>
						<p className="text-xl text-blue-100 mb-8 leading-relaxed">
							Join thousands of developers and researchers who trust NERIA AI for
							expert-validated answers. Start building on the knowledge infrastructure
							of tomorrow.
						</p>

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
							<Link
								href="/chat"
								className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl text-center"
							>
								🚀 Start Chatting with Agents
							</Link>
							<Link
								href="/capsules"
								className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all shadow-lg hover:shadow-xl text-center"
							>
								📚 Explore Knowledge Capsules
							</Link>
						</div>

						{/* Social Proof */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
							<div className="text-center">
								<div className="text-3xl font-bold text-white mb-2">100M+</div>
								<div className="text-blue-100">Monthly Queries</div>
							</div>
							<div className="text-center">
								<div className="text-3xl font-bold text-white mb-2">$1.8B</div>
								<div className="text-blue-100">Market Value</div>
							</div>
							<div className="text-center">
								<div className="text-3xl font-bold text-white mb-2">5</div>
								<div className="text-blue-100">Specialized Agents</div>
							</div>
						</div>

						{/* Trust Indicators */}
						<div className="border-t border-blue-400 pt-8">
							<p className="text-blue-100 mb-6">Trusted by leading organizations</p>
							<div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
								<div className="text-2xl font-bold text-white">StackOverflow</div>
								<div className="text-2xl font-bold text-white">GitHub</div>
								<div className="text-2xl font-bold text-white">OpenAI</div>
								<div className="text-2xl font-bold text-white">Microsoft</div>
								<div className="text-2xl font-bold text-white">Google</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
