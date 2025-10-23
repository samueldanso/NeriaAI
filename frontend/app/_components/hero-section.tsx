'use client'

import Link from 'next/link'
import Image from 'next/image'

export function HeroSection() {
	return (
		<section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 lg:py-32">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Left Column - Content */}
					<div className="space-y-8">
						{/* Badge */}
						<div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-sm font-medium">
							<svg
								className="w-4 h-4 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
								/>
							</svg>
							ETHOnline 2025 | ASI Alliance Track
						</div>

						{/* Main Headline */}
						<div className="space-y-4">
							<h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
								The{' '}
								<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
									StackOverflow
								</span>{' '}
								for AI
							</h1>
							<p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
								Where 5 specialized agents coordinate human validation to provide
								trusted, expert-verified answers you can actually use.
							</p>
						</div>

						{/* Value Proposition */}
						<div className="space-y-4">
							<div className="flex items-center space-x-3">
								<div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
									<svg
										className="w-4 h-4 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
								</div>
								<span className="text-lg text-gray-700 dark:text-gray-300">
									AI-speed generation + Human validation
								</span>
							</div>
							<div className="flex items-center space-x-3">
								<div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
									<svg
										className="w-4 h-4 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
								</div>
								<span className="text-lg text-gray-700 dark:text-gray-300">
									Structured reasoning with MeTTa knowledge graphs
								</span>
							</div>
							<div className="flex items-center space-x-3">
								<div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
									<svg
										className="w-4 h-4 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
								</div>
								<span className="text-lg text-gray-700 dark:text-gray-300">
									Reusable knowledge capsules for future queries
								</span>
							</div>
						</div>

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row gap-4 pt-4">
							<Link
								href="/chat"
								className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl text-center"
							>
								Start Chatting with Agents
							</Link>
							<Link
								href="/capsules"
								className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 text-center"
							>
								Browse Knowledge Capsules
							</Link>
						</div>

						{/* Trust Indicators */}
						<div className="pt-8">
							<p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
								Trusted by developers and researchers worldwide
							</p>
							<div className="flex items-center space-x-8 opacity-60">
								<div className="text-2xl font-bold text-gray-400">100M+</div>
								<div className="text-sm text-gray-500">Monthly Queries</div>
								<div className="text-2xl font-bold text-gray-400">$1.8B</div>
								<div className="text-sm text-gray-500">Market Value</div>
							</div>
						</div>
					</div>

					{/* Right Column - Visual */}
					<div className="relative">
						<div className="relative z-10">
							{/* Main Visual - Agent Coordination Flow */}
							<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
								<div className="space-y-6">
									{/* Header */}
									<div className="text-center">
										<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
											5-Agent Coordination
										</h3>
										<p className="text-gray-600 dark:text-gray-400">
											Real-time agent collaboration
										</p>
									</div>

									{/* Agent Flow Visualization */}
									<div className="space-y-4">
										{/* Query Router */}
										<div className="flex items-center justify-center">
											<div className="bg-blue-100 dark:bg-blue-900/20 px-4 py-2 rounded-lg">
												<span className="text-sm font-medium text-blue-800 dark:text-blue-200">
													1. Query Router
												</span>
											</div>
										</div>

										{/* Arrow */}
										<div className="flex justify-center">
											<svg
												className="w-6 h-6 text-gray-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 14l-7 7m0 0l-7-7m7 7V3"
												/>
											</svg>
										</div>

										{/* Research + Reasoning */}
										<div className="flex justify-center space-x-4">
											<div className="bg-green-100 dark:bg-green-900/20 px-3 py-2 rounded-lg">
												<span className="text-xs font-medium text-green-800 dark:text-green-200">
													2. Research
												</span>
											</div>
											<div className="bg-purple-100 dark:bg-purple-900/20 px-3 py-2 rounded-lg">
												<span className="text-xs font-medium text-purple-800 dark:text-purple-200">
													3. Reasoning
												</span>
											</div>
										</div>

										{/* Arrow */}
										<div className="flex justify-center">
											<svg
												className="w-6 h-6 text-gray-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 14l-7 7m0 0l-7-7m7 7V3"
												/>
											</svg>
										</div>

										{/* Validation + Capsule */}
										<div className="flex justify-center space-x-4">
											<div className="bg-yellow-100 dark:bg-yellow-900/20 px-3 py-2 rounded-lg">
												<span className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
													4. Validation
												</span>
											</div>
											<div className="bg-red-100 dark:bg-red-900/20 px-3 py-2 rounded-lg">
												<span className="text-xs font-medium text-red-800 dark:text-red-200">
													5. Capsule
												</span>
											</div>
										</div>

										{/* Result */}
										<div className="flex justify-center pt-4">
											<div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg">
												<span className="text-sm font-medium">
													✅ Verified Answer
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Background decoration */}
						<div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
						<div className="absolute -bottom-8 -left-4 w-72 h-72 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
					</div>
				</div>
			</div>
		</section>
	)
}
