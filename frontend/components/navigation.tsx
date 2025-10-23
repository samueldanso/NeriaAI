'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
	const pathname = usePathname()

	const navItems = [
		{
			href: '/',
			label: 'Home',
			icon: (
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
					/>
				</svg>
			),
		},
		{
			href: '/chat',
			label: 'Chat',
			icon: (
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
					/>
				</svg>
			),
		},
		{
			href: '/capsules',
			label: 'Knowledge Capsules',
			icon: (
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
			),
		},
	]

	return (
		<nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
			<div className="max-w-6xl mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-2">
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
						<span className="text-xl font-bold text-gray-800 dark:text-white">
							NERIA AI
						</span>
					</Link>

					{/* Navigation Items */}
					<div className="flex items-center gap-1">
						{navItems.map((item) => {
							const isActive = pathname === item.href
							return (
								<Link
									key={item.href}
									href={item.href}
									className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
										isActive
											? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
											: 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700'
									}`}
								>
									{item.icon}
									<span className="font-medium">{item.label}</span>
								</Link>
							)
						})}
					</div>
				</div>
			</div>
		</nav>
	)
}
