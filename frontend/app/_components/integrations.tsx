export default function IntegrationsSection() {
	const integrations = [
		{
			name: 'Fetch.ai uAgents',
			description: 'Agent framework for autonomous microservices',
			logo: '🤖',
			category: 'Agent Framework',
		},
		{
			name: 'ASI:One',
			description: 'Advanced AI reasoning and validation',
			logo: '🧠',
			category: 'AI Reasoning',
		},
		{
			name: 'MeTTa',
			description: "SingularityNET's logic engine for structured reasoning",
			logo: '🔗',
			category: 'Knowledge Graphs',
		},
		{
			name: 'Agentverse',
			description: 'Agent discovery and communication platform',
			logo: '🌐',
			category: 'Agent Discovery',
		},
		{
			name: 'Base L2',
			description: 'Ethereum L2 for NFT storage and transactions',
			logo: '⛓️',
			category: 'Blockchain',
		},
		{
			name: 'IPFS',
			description: 'Decentralized storage for knowledge capsules',
			logo: '📦',
			category: 'Storage',
		},
		{
			name: 'Supabase',
			description: 'PostgreSQL with pgvector for semantic search',
			logo: '🗄️',
			category: 'Database',
		},
		{
			name: 'Next.js 15',
			description: 'React framework with App Router',
			logo: '⚛️',
			category: 'Frontend',
		},
	]

	const categories = [...new Set(integrations.map((i) => i.category))]

	return (
		<section id="integrations" className="py-20 bg-gray-50 dark:bg-gray-800">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
						Powered by the ASI Alliance Stack
					</h2>
					<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						Built on cutting-edge technologies from the ASI Alliance ecosystem,
						combining the best of AI, blockchain, and agent coordination.
					</p>
				</div>

				{/* Categories */}
				<div className="space-y-12">
					{categories.map((category) => (
						<div key={category}>
							<h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
								{category}
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
								{integrations
									.filter((integration) => integration.category === category)
									.map((integration, index) => (
										<div
											key={index}
											className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 group"
										>
											<div className="text-center">
												<div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
													{integration.logo}
												</div>
												<h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
													{integration.name}
												</h4>
												<p className="text-sm text-gray-600 dark:text-gray-300">
													{integration.description}
												</p>
											</div>
										</div>
									))}
							</div>
						</div>
					))}
				</div>

				{/* Architecture Diagram */}
				<div className="mt-20">
					<div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl">
						<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
							System Architecture
						</h3>
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
							{/* Frontend Layer */}
							<div className="text-center">
								<div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
									<span className="text-2xl">⚛️</span>
								</div>
								<h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
									Frontend Layer
								</h4>
								<p className="text-sm text-gray-600 dark:text-gray-300">
									Next.js 15 + React 19 + TypeScript + Tailwind
								</p>
							</div>

							{/* Agent Layer */}
							<div className="text-center">
								<div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
									<span className="text-2xl">🤖</span>
								</div>
								<h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
									Agent Orchestration
								</h4>
								<p className="text-sm text-gray-600 dark:text-gray-300">
									5 uAgents + Agentverse + Chat Protocol
								</p>
							</div>

							{/* Blockchain Layer */}
							<div className="text-center">
								<div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
									<span className="text-2xl">⛓️</span>
								</div>
								<h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
									Blockchain Layer
								</h4>
								<p className="text-sm text-gray-600 dark:text-gray-300">
									Base L2 + IPFS + Smart Contracts
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
