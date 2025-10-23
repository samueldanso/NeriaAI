'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	return (
		<header className="bg-white dark:bg-gray-900 shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center py-6">
					{/* Logo */}
					<div className="flex items-center">
						<Link href="/" className="flex items-center space-x-2">
							<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
								<svg
									className="w-5 h-5 text-white"
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
							</div>
							<span className="text-2xl font-bold text-gray-900 dark:text-white">
								NERIA AI
							</span>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex space-x-8">
						<Link
							href="/chat"
							className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
						>
							Chat
						</Link>
						<Link
							href="/capsules"
							className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
						>
							Knowledge Capsules
						</Link>
						<Link
							href="#features"
							className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
						>
							Features
						</Link>
						<Link
							href="#how-it-works"
							className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
						>
							How It Works
						</Link>
					</nav>

					{/* CTA Buttons */}
					<div className="hidden md:flex items-center space-x-4">
						<Link
							href="/chat"
							className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
						>
							Sign In
						</Link>
						<Link
							href="/chat"
							className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
						>
							Get Started
						</Link>
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
						>
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
						<div className="flex flex-col space-y-4">
							<Link
								href="/chat"
								className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
							>
								Chat
							</Link>
							<Link
								href="/capsules"
								className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
							>
								Knowledge Capsules
							</Link>
							<Link
								href="#features"
								className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
							>
								Features
							</Link>
							<Link
								href="#how-it-works"
								className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
							>
								How It Works
							</Link>
							<div className="pt-4 border-t border-gray-200 dark:border-gray-700">
								<Link
									href="/chat"
									className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
								>
									Sign In
								</Link>
								<Link
									href="/chat"
									className="block mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-center"
								>
									Get Started
								</Link>
							</div>
						</div>
					</div>
				)}
			</div>
		</header>
	)
}
