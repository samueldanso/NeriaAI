export default function FeaturesSection() {
	const features = [
		{
			icon: (
				<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
					/>
				</svg>
			),
			title: 'Multi-Agent System',
			description:
				'5 specialized uAgents collaborate to route, research, reason, validate, and store knowledge with seamless coordination.',
			highlight:
				"Autonomous AI agents validate each other's reasoning — no centralized authority, no human bottleneck.",
		},
		{
			icon: (
				<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
			),
			title: 'Knowledge Capsules',
			description:
				'Each verified answer becomes an ownable, permanent ERC-721 asset on Base L2 with IPFS storage and vector search.',
			highlight: 'Verified answers become reusable knowledge capsules for future queries.',
		},
		{
			icon: (
				<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
					/>
				</svg>
			),
			title: 'MeTTa Reasoning',
			description:
				'Transparent, structured logic graphs generated with MeTTa knowledge representation for explainable AI reasoning.',
			highlight:
				'Shows reasoning steps clearly and builds on existing capsules for reusability.',
		},
		{
			icon: (
				<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			),
			title: 'Expert Validation',
			description:
				'Multi-agent consensus (2/3 approval) verifies reasoning quality through ASI:One human expert coordination.',
			highlight: 'Human experts validate every answer through our ASI:One integration.',
		},
		{
			icon: (
				<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			),
			title: 'Vector Search',
			description:
				'Discover related capsules via Supabase pgvector, even without exact keywords using semantic similarity.',
			highlight:
				"Find relevant knowledge even when you don't know the exact terms to search for.",
		},
		{
			icon: (
				<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M13 10V3L4 14h7v7l9-11h-7z"
					/>
				</svg>
			),
			title: 'Real-time Processing',
			description:
				'Agentverse registry + Chat Protocol enable seamless agent discovery and real-time communication.',
			highlight: 'Watch agents coordinate in real-time as they process your query.',
		},
	]

	return (
		<section id="features" className="py-20 bg-white dark:bg-gray-900">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
						Why NERIA AI?
					</h2>
					<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						We're building knowledge infrastructure. Not just validated answers, but
						reusable reasoning chains that future queries can build upon.
					</p>
				</div>

				{/* Features Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature, index) => (
						<div key={index} className="group relative">
							<div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group-hover:border-blue-200 dark:group-hover:border-blue-800">
								{/* Icon */}
								<div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
									{feature.icon}
								</div>

								{/* Content */}
								<div className="space-y-4">
									<h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
										{feature.title}
									</h3>
									<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
										{feature.description}
									</p>
									<div className="pt-2 border-t border-gray-100 dark:border-gray-700">
										<p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
											{feature.highlight}
										</p>
									</div>
								</div>

								{/* Hover Effect */}
								<div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							</div>
						</div>
					))}
				</div>

				{/* Bottom CTA */}
				<div className="text-center mt-16">
					<div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
						<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
							Ready to experience the future of AI knowledge?
						</h3>
						<p className="text-gray-600 dark:text-gray-300 mb-6">
							Join thousands of developers and researchers who trust NERIA AI for
							expert-validated answers.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<a
								href="/chat"
								className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
							>
								Try NERIA AI Now
							</a>
							<a
								href="/capsules"
								className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-600"
							>
								Explore Knowledge Capsules
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
