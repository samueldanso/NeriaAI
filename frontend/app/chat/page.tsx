'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
	id: string
	role: 'user' | 'assistant' | 'agent'
	content: string
	timestamp: Date
	agentType?: string
	agentName?: string
	reasoning?: any
	validation?: any
}

export default function ChatPage() {
	const [messages, setMessages] = useState<Message[]>([])
	const [input, setInput] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const messagesEndRef = useRef<HTMLDivElement>(null)

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!input.trim() || isLoading) return

		const userMessage: Message = {
			id: Date.now().toString(),
			role: 'user',
			content: input.trim(),
			timestamp: new Date(),
		}

		setMessages((prev) => [...prev, userMessage])
		setInput('')
		setIsLoading(true)

		try {
			// Try direct agent communication first
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ message: userMessage.content }),
			})

			const data = await response.json()

			if (data.success) {
				const assistantMessage: Message = {
					id: (Date.now() + 1).toString(),
					role: 'assistant',
					content: data.response,
					timestamp: new Date(),
					agentType: data.agentType,
					agentName:
						data.agentType === 'reasoning' ? 'Reasoning Agent' : 'Validation Agent',
				}

				setMessages((prev) => [...prev, assistantMessage])
			} else {
				// Fallback to backend API
				const backendResponse = await fetch('/api/backend/query', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						query: userMessage.content,
						sessionId: `session_${Date.now()}`,
					}),
				})

				const backendData = await backendResponse.json()

				if (backendData.success) {
					const assistantMessage: Message = {
						id: (Date.now() + 1).toString(),
						role: 'assistant',
						content: backendData.response,
						timestamp: new Date(),
						reasoning: backendData.reasoning,
						validation: backendData.validation,
					}

					setMessages((prev) => [...prev, assistantMessage])
				} else {
					throw new Error(backendData.error || 'Failed to get response')
				}
			}
		} catch (error) {
			console.error('Error:', error)
			const errorMessage: Message = {
				id: (Date.now() + 1).toString(),
				role: 'assistant',
				content:
					'Sorry, I encountered an error while processing your request. Please try again.',
				timestamp: new Date(),
			}
			setMessages((prev) => [...prev, errorMessage])
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<>
			{/* Messages Container */}
			<div className="flex-1 overflow-y-auto">
				<div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
					{messages.length === 0 ? (
						<div className="text-center py-12">
							<div className="inline-block p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
								<svg
									className="w-12 h-12 text-white"
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
							<h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
								NERIA AI
							</h1>
							<p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
								Ask me anything and I'll coordinate our 5-agent system to provide
								expert-validated answers.
							</p>

							{/* Suggested Topics - Perplexity Style */}
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
								<button className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
									<div className="flex items-center gap-3 mb-2">
										<div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
											<svg
												className="w-4 h-4 text-blue-600 dark:text-blue-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
												/>
											</svg>
										</div>
										<span className="font-medium text-gray-800 dark:text-white">
											Troubleshoot
										</span>
									</div>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										Debug code issues with expert validation
									</p>
								</button>

								<button className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
									<div className="flex items-center gap-3 mb-2">
										<div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
											<svg
												className="w-4 h-4 text-purple-600 dark:text-purple-400"
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
										<span className="font-medium text-gray-800 dark:text-white">
											NERIA 101
										</span>
									</div>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										Learn about our multi-agent system
									</p>
								</button>

								<button className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
									<div className="flex items-center gap-3 mb-2">
										<div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
											<svg
												className="w-4 h-4 text-green-600 dark:text-green-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
												/>
											</svg>
										</div>
										<span className="font-medium text-gray-800 dark:text-white">
											Health
										</span>
									</div>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										Medical and wellness questions
									</p>
								</button>

								<button className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
									<div className="flex items-center gap-3 mb-2">
										<div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
											<svg
												className="w-4 h-4 text-yellow-600 dark:text-yellow-400"
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
										<span className="font-medium text-gray-800 dark:text-white">
											Learn
										</span>
									</div>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										Educational content and tutorials
									</p>
								</button>

								<button className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
									<div className="flex items-center gap-3 mb-2">
										<div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
											<svg
												className="w-4 h-4 text-red-600 dark:text-red-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
												/>
											</svg>
										</div>
										<span className="font-medium text-gray-800 dark:text-white">
											Local
										</span>
									</div>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										Location-based information
									</p>
								</button>
							</div>
						</div>
					) : (
						messages.map((message) => (
							<div
								key={message.id}
								className={`flex ${
									message.role === 'user' ? 'justify-end' : 'justify-start'
								}`}
							>
								<div
									className={`max-w-[80%] rounded-2xl px-6 py-4 ${
										message.role === 'user'
											? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
											: 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-md'
									}`}
								>
									<div className="flex items-start gap-3">
										{message.role === 'assistant' && (
											<div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
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
										)}
										<div className="flex-1">
											{message.role === 'assistant' ? (
												<div>
													{message.agentName && (
														<div className="flex items-center gap-2 mb-2">
															<span className="text-xs font-medium text-purple-600 dark:text-purple-400">
																{message.agentName}
															</span>
															<span className="text-xs text-gray-500">
																{message.timestamp.toLocaleTimeString()}
															</span>
														</div>
													)}
													<div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-headings:my-3 prose-img:rounded-lg prose-img:shadow-md">
														<ReactMarkdown
															remarkPlugins={[remarkGfm]}
															components={{
																img: ({ node, ...props }) => (
																	<img
																		{...props}
																		className="max-w-full h-auto rounded-lg shadow-md my-4"
																		loading="lazy"
																		alt={props.alt || 'Image'}
																	/>
																),
																a: ({ node, ...props }) => (
																	<a
																		{...props}
																		target="_blank"
																		rel="noopener noreferrer"
																		className="text-blue-500 hover:text-blue-600 underline"
																	/>
																),
																code: ({
																	node,
																	className,
																	children,
																	...props
																}) => {
																	const isInline =
																		!className?.includes(
																			'language-'
																		)
																	return isInline ? (
																		<code
																			className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm"
																			{...props}
																		>
																			{children}
																		</code>
																	) : (
																		<code
																			className={`block bg-gray-100 dark:bg-gray-700 p-3 rounded-lg overflow-x-auto ${
																				className || ''
																			}`}
																			{...props}
																		>
																			{children}
																		</code>
																	)
																},
															}}
														>
															{message.content}
														</ReactMarkdown>
													</div>
													{message.reasoning && (
														<div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
															<h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
																🧠 Reasoning Chain
															</h4>
															<pre className="text-xs text-blue-700 dark:text-blue-300 overflow-x-auto">
																{JSON.stringify(
																	message.reasoning,
																	null,
																	2
																)}
															</pre>
														</div>
													)}
													{message.validation && (
														<div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
															<h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
																✅ Validation Status
															</h4>
															<pre className="text-xs text-green-700 dark:text-green-300 overflow-x-auto">
																{JSON.stringify(
																	message.validation,
																	null,
																	2
																)}
															</pre>
														</div>
													)}
												</div>
											) : (
												<p className="whitespace-pre-wrap break-words">
													{message.content}
												</p>
											)}
										</div>
									</div>
								</div>
							</div>
						))
					)}

					{isLoading && (
						<div className="flex justify-start">
							<div className="max-w-[80%] rounded-2xl px-6 py-4 bg-white dark:bg-gray-800 shadow-md">
								<div className="flex items-center gap-3">
									<div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
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
									<div className="flex gap-1">
										<div
											className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
											style={{ animationDelay: '0ms' }}
										></div>
										<div
											className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
											style={{ animationDelay: '150ms' }}
										></div>
										<div
											className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
											style={{ animationDelay: '300ms' }}
										></div>
									</div>
									<span className="text-sm text-gray-500 ml-2">
										Agents are reasoning...
									</span>
								</div>
							</div>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>
			</div>

			{/* Input Form - Perplexity Style */}
			<div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
				<div className="max-w-4xl mx-auto">
					<form onSubmit={handleSubmit} className="relative">
						<div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-full">
							<svg
								className="w-5 h-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
							<input
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="Ask anything... Our 5-agent system will research, reason, and validate your answer."
								disabled={isLoading}
								className="flex-1 bg-transparent text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
							/>
							<div className="flex items-center gap-2">
								<button
									type="button"
									className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
								>
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
										/>
									</svg>
								</button>
								<button
									type="button"
									className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
								>
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
										/>
									</svg>
								</button>
								<button
									type="submit"
									disabled={isLoading || !input.trim()}
									className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
										/>
									</svg>
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	)
}
