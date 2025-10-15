'use client'

import { useState } from 'react'
import Link from 'next/link'

interface QueryResult {
	response: string
	reasoning_chain?: any
	validation_status?: string
	capsule_id?: string
}

export default function Home() {
	const [query, setQuery] = useState('')
	const [result, setResult] = useState<QueryResult | null>(null)
	const [loading, setLoading] = useState(false)

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		setResult(null)

		try {
			const res = await fetch('http://localhost:8000/query', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ query }),
			})

			const data = await res.json()
			setResult(data)
		} catch (error) {
			setResult({
				response: 'Error: Could not connect to backend',
				validation_status: 'error',
			})
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Navigation */}
			<nav className="bg-white border-b">
				<div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold">NERIA AI</h1>
						<p className="text-sm text-gray-600">
							I you can cite — trusted, verified, reusable knowledge.
						</p>
					</div>
					<div className="flex gap-4">
						<Link href="/" className="text-blue-600 font-medium">
							Query
						</Link>
						<Link href="/capsules" className="text-gray-600 hover:text-blue-600">
							Capsules
						</Link>
					</div>
				</div>
			</nav>

			<div className="max-w-4xl mx-auto p-8">
				{/* Hero Section */}
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold mb-3">
						Ask Complex Questions, Get Verified Knowledge
					</h2>
					<p className="text-gray-600">
						AI agents reason through your query, human experts validate, and the result
						becomes a reusable Knowledge Capsule
					</p>
				</div>

				{/* Query Form */}
				<div className="bg-white border rounded-lg p-6 shadow-sm mb-6">
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label htmlFor="query" className="block text-sm font-medium mb-2">
								Your Question:
							</label>
							<textarea
								id="query"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								className="w-full p-4 border rounded-lg min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="e.g., How can decentralized AI transform education in Africa?"
								required
							/>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium transition"
						>
							{loading ? '🔄 Processing with AI Agents...' : '🚀 Submit Query'}
						</button>
					</form>
				</div>

				{/* Result Display */}
				{result && (
					<div className="space-y-6">
						{/* Status Badge */}
						<div className="flex items-center gap-3">
							<span
								className={`px-4 py-2 rounded-full text-sm font-medium ${
									result.validation_status === 'pending'
										? 'bg-yellow-100 text-yellow-800'
										: result.validation_status === 'validated'
										? 'bg-green-100 text-green-800'
										: 'bg-gray-100 text-gray-800'
								}`}
							>
								{result.validation_status === 'pending' && '⏳ Awaiting Validation'}
								{result.validation_status === 'validated' && '✅ Validated'}
								{result.validation_status === 'error' && '❌ Error'}
								{!result.validation_status && '📝 Processing'}
							</span>
						</div>

						{/* Response */}
						<div className="bg-white border rounded-lg p-6 shadow-sm">
							<h3 className="font-bold text-lg mb-3">Response:</h3>
							<p className="text-gray-800 leading-relaxed">{result.response}</p>
						</div>

						{/* Reasoning Chain (Phase 2) */}
						{result.reasoning_chain && (
							<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
								<h3 className="font-bold text-lg mb-3 flex items-center gap-2">
									🧠 Reasoning Chain
								</h3>
								<pre className="text-sm bg-white p-4 rounded overflow-auto">
									{JSON.stringify(result.reasoning_chain, null, 2)}
								</pre>
							</div>
						)}

						{/* Capsule ID (Phase 2) */}
						{result.capsule_id && (
							<div className="bg-green-50 border border-green-200 rounded-lg p-4">
								<p className="text-sm">
									<span className="font-medium">Knowledge Capsule ID:</span>{' '}
									<code className="bg-white px-2 py-1 rounded">
										{result.capsule_id}
									</code>
								</p>
							</div>
						)}

						{/* Process Flow Info */}
						<div className="bg-gray-50 border rounded-lg p-6">
							<h4 className="font-semibold mb-3">What happens next:</h4>
							<ol className="space-y-2 text-sm text-gray-700">
								<li className="flex gap-2">
									<span className="text-blue-600">1.</span>
									<span>
										Reasoning Agent analyzes your query using MeTTa logic
									</span>
								</li>
								<li className="flex gap-2">
									<span className="text-blue-600">2.</span>
									<span>
										Validation Agent sends reasoning to human experts via
										ASI:One
									</span>
								</li>
								<li className="flex gap-2">
									<span className="text-blue-600">3.</span>
									<span>Expert approves/revises the reasoning chain</span>
								</li>
								<li className="flex gap-2">
									<span className="text-blue-600">4.</span>
									<span>System creates a verified Knowledge Capsule</span>
								</li>
								<li className="flex gap-2">
									<span className="text-blue-600">5.</span>
									<span>Capsule is stored for future reuse and audit</span>
								</li>
							</ol>
						</div>
					</div>
				)}

				{/* Features Grid */}
				{!result && (
					<div className="grid md:grid-cols-3 gap-6 mt-12">
						<div className="text-center p-6">
							<div className="text-3xl mb-3">🤖</div>
							<h3 className="font-semibold mb-2">AI Reasoning</h3>
							<p className="text-sm text-gray-600">
								uAgents + MeTTa analyze and structure knowledge
							</p>
						</div>
						<div className="text-center p-6">
							<div className="text-3xl mb-3">✅</div>
							<h3 className="font-semibold mb-2">Human Validation</h3>
							<p className="text-sm text-gray-600">
								Experts review via ASI:One interface
							</p>
						</div>
						<div className="text-center p-6">
							<div className="text-3xl mb-3">📦</div>
							<h3 className="font-semibold mb-2">Knowledge Capsules</h3>
							<p className="text-sm text-gray-600">
								Verified, reusable, auditable outputs
							</p>
						</div>
					</div>
				)}
			</div>

			{/* Footer */}
			<footer className="mt-16 py-8 border-t bg-white">
				<div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-600">
					<p className="mb-2">Powered by Fetch.ai uAgents • MeTTa • ASI:One</p>
					<p>ETHOnline 2025 | ASI Alliance Track</p>
				</div>
			</footer>
		</div>
	)
}
