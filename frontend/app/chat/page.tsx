'use client'

import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { usePrivy } from '@privy-io/react-auth'
import {
	processCapsuleStorage,
	extractCapsuleDataFromResponse,
	isCapsuleReadyForStorage,
} from '@/lib/storage-service'

interface Message {
	id: string
	role: 'user' | 'assistant' | 'agent'
	content: string
	timestamp: Date
	agentType?: string
	agentName?: string
	reasoning?: any
	validation?: any
	isAgentStatus?: boolean
	agentSteps?: Array<{
		agent: string
		icon: string
		status: 'pending' | 'active' | 'completed'
		message: string
	}>
}

export default function ChatPage() {
	const [messages, setMessages] = useState<Message[]>([])
	const [input, setInput] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [currentAgentStep, setCurrentAgentStep] = useState(0)
	const [isStoringCapsule, setIsStoringCapsule] = useState(false)
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const { user } = usePrivy()

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
		setCurrentAgentStep(0)

		// Add agent status message
		const agentStatusId = `status-${Date.now()}`
		const agentSteps = [
			{
				agent: 'router',
				icon: '🔀',
				status: 'active' as const,
				message: 'Classifying query...',
			},
			{
				agent: 'research',
				icon: '🔍',
				status: 'pending' as const,
				message: 'Searching knowledge base...',
			},
			{
				agent: 'reasoning',
				icon: '🧠',
				status: 'pending' as const,
				message: 'Generating reasoning chain...',
			},
			{
				agent: 'validation',
				icon: '✅',
				status: 'pending' as const,
				message: 'Validating answer (2/3 consensus)...',
			},
			{
				agent: 'capsule',
				icon: '📦',
				status: 'pending' as const,
				message: 'Creating knowledge capsule...',
			},
		]

		const statusMessage: Message = {
			id: agentStatusId,
			role: 'agent',
			content: 'Processing your query through multi-agent system...',
			timestamp: new Date(),
			isAgentStatus: true,
			agentSteps: agentSteps,
		}

		setMessages((prev) => [...prev, statusMessage])

		// Simulate agent progress
		const progressInterval = setInterval(() => {
			setCurrentAgentStep((step) => {
				const nextStep = step + 1
				if (nextStep < agentSteps.length) {
					setMessages((prev) =>
						prev.map((msg) => {
							if (msg.id === agentStatusId && msg.agentSteps) {
								const updatedSteps = [...msg.agentSteps]
								if (step < updatedSteps.length) {
									updatedSteps[step].status = 'completed'
								}
								if (nextStep < updatedSteps.length) {
									updatedSteps[nextStep].status = 'active'
								}
								return { ...msg, agentSteps: updatedSteps }
							}
							return msg
						})
					)
					return nextStep
				}
				clearInterval(progressInterval)
				return step
			})
		}, 2000)

		try {
			// Direct agent communication via uagent-client
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ message: userMessage.content }),
			})

			const data = await response.json()

			clearInterval(progressInterval)

			// Mark all steps as completed
			setMessages((prev) =>
				prev.map((msg) => {
					if (msg.id === agentStatusId && msg.agentSteps) {
						const completedSteps = msg.agentSteps.map((step) => ({
							...step,
							status: 'completed' as const,
						}))
						return { ...msg, agentSteps: completedSteps }
					}
					return msg
				})
			)

			if (data.success) {
				const assistantMessage: Message = {
					id: (Date.now() + 1).toString(),
					role: 'assistant',
					content: data.response,
					timestamp: new Date(),
					agentType: data.agentType,
					agentName: data.agentName || 'Neria AI',
				}

				setMessages((prev) => [...prev, assistantMessage])

				// Check if capsule is ready for storage
				if (isCapsuleReadyForStorage(data.response) && user?.wallet?.address) {
					console.log('🔄 Capsule ready for storage, initiating workflow...')
					setIsStoringCapsule(true)

					// Show storage progress message
					const storageStatusMessage: Message = {
						id: `storage-${Date.now()}`,
						role: 'agent',
						content:
							'💾 Storing Knowledge Capsule...\n\n⏳ Step 1: Saving to database...',
						timestamp: new Date(),
					}
					setMessages((prev) => [...prev, storageStatusMessage])

					// Extract capsule data from response
					const capsuleData = extractCapsuleDataFromResponse(
						data.response,
						userMessage.content,
						user.wallet.address
					)

					if (capsuleData) {
						try {
							// Process storage (Supabase + IPFS)
							const storageResult = await processCapsuleStorage(capsuleData)

							if (storageResult.success) {
								// Show success message
								const successMessage: Message = {
									id: `storage-success-${Date.now()}`,
									role: 'agent',
									content: `🎉 **Knowledge Capsule Stored Successfully!**\n\n📦 **Capsule ID:** \`${storageResult.capsuleId}\`\n🔗 **IPFS Hash:** \`${storageResult.ipfsHash}\`\n🌐 **Gateway URL:** [View on IPFS](${storageResult.ipfsUrl})\n\n✅ Your knowledge is now permanently stored and ready for NFT minting!`,
									timestamp: new Date(),
								}
								setMessages((prev) => [...prev, successMessage])
							} else {
								throw new Error(storageResult.error || 'Storage failed')
							}
						} catch (storageError) {
							console.error('Storage error:', storageError)
							const errorMsg: Message = {
								id: `storage-error-${Date.now()}`,
								role: 'agent',
								content: `❌ Storage Error: ${
									storageError instanceof Error
										? storageError.message
										: 'Failed to store capsule'
								}`,
								timestamp: new Date(),
							}
							setMessages((prev) => [...prev, errorMsg])
						} finally {
							setIsStoringCapsule(false)
						}
					} else {
						setIsStoringCapsule(false)
						console.error('Failed to extract capsule data from response')
					}
				}
			} else {
				throw new Error(data.error || 'Failed to get response from agents')
			}
		} catch (error) {
			console.error('Error:', error)
			clearInterval(progressInterval)

			// Remove status message and show error
			setMessages((prev) => prev.filter((msg) => msg.id !== agentStatusId))

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
							<div className="inline-block p-6 bg-gradient-to-r from-primary to-primary/80 rounded-full mb-6">
								<svg
									className="w-12 h-12 text-primary-foreground"
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
							<h1 className="text-3xl font-bold text-foreground mb-4">NERIA AI</h1>
							<p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
								Ask Neria - Our 5-agent system will research, reason, and validate
								your answer
							</p>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
								<button className="p-4 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow text-left border">
									<div className="flex items-center gap-3 mb-2">
										<div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
											<svg
												className="w-4 h-4 text-primary"
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
										<span className="font-medium text-card-foreground">
											Troubleshoot
										</span>
									</div>
									<p className="text-sm text-muted-foreground">
										Debug code issues with expert validation
									</p>
								</button>

								<button className="p-4 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow text-left border">
									<div className="flex items-center gap-3 mb-2">
										<div className="w-8 h-8 bg-secondary/50 rounded-lg flex items-center justify-center">
											<svg
												className="w-4 h-4 text-secondary-foreground"
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
										<span className="font-medium text-card-foreground">
											NERIA 101
										</span>
									</div>
									<p className="text-sm text-muted-foreground">
										Learn about our multi-agent system
									</p>
								</button>

								<button className="p-4 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow text-left border">
									<div className="flex items-center gap-3 mb-2">
										<div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
											<svg
												className="w-4 h-4 text-accent-foreground"
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
										<span className="font-medium text-card-foreground">
											Health
										</span>
									</div>
									<p className="text-sm text-muted-foreground">
										Medical and wellness questions
									</p>
								</button>

								<button className="p-4 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow text-left border">
									<div className="flex items-center gap-3 mb-2">
										<div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
											<svg
												className="w-4 h-4 text-muted-foreground"
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
										<span className="font-medium text-card-foreground">
											Learn
										</span>
									</div>
									<p className="text-sm text-muted-foreground">
										Educational content and tutorials
									</p>
								</button>

								<button className="p-4 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow text-left border">
									<div className="flex items-center gap-3 mb-2">
										<div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
											<svg
												className="w-4 h-4 text-destructive"
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
										<span className="font-medium text-card-foreground">
											Local
										</span>
									</div>
									<p className="text-sm text-muted-foreground">
										Location-based information
									</p>
								</button>
							</div>
						</div>
					) : (
						messages.map((message) => {
							// Render agent status differently
							if (message.isAgentStatus && message.agentSteps) {
								return (
									<div key={message.id} className="flex justify-start">
										<div className="max-w-[80%] rounded-2xl px-6 py-4 bg-card text-card-foreground shadow-md border">
											<div className="flex items-start gap-3">
												<div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
													<svg
														className="w-5 h-5 text-primary-foreground animate-spin"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
														/>
													</svg>
												</div>
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-3">
														<span className="text-xs font-medium text-primary">
															Multi-Agent Processing
														</span>
													</div>
													<div className="space-y-2">
														{message.agentSteps.map((step, idx) => (
															<div
																key={idx}
																className={`flex items-center gap-3 text-sm transition-all duration-300 ${
																	step.status === 'active'
																		? 'scale-105'
																		: ''
																}`}
															>
																<span
																	className={`text-base ${
																		step.status === 'completed'
																			? 'text-green-600 dark:text-green-400'
																			: step.status ===
																			  'active'
																			? 'text-blue-600 dark:text-blue-400 animate-pulse'
																			: 'text-muted-foreground/40'
																	}`}
																>
																	{step.status === 'completed'
																		? '✓'
																		: step.status === 'active'
																		? '⟳'
																		: '○'}
																</span>
																<span className="text-lg">
																	{step.icon}
																</span>
																<span
																	className={
																		step.status === 'completed'
																			? 'text-green-600 dark:text-green-400'
																			: step.status ===
																			  'active'
																			? 'text-blue-600 dark:text-blue-400'
																			: 'text-muted-foreground/60'
																	}
																>
																	{step.message}
																</span>
															</div>
														))}
													</div>
												</div>
											</div>
										</div>
									</div>
								)
							}

							// Regular message rendering
							return (
								<div
									key={message.id}
									className={`flex ${
										message.role === 'user' ? 'justify-end' : 'justify-start'
									}`}
								>
									<div
										className={`max-w-[80%] rounded-2xl px-6 py-4 ${
											message.role === 'user'
												? 'bg-primary text-primary-foreground'
												: 'bg-card text-card-foreground shadow-md border'
										}`}
									>
										<div className="flex items-start gap-3">
											{message.role === 'assistant' && (
												<div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
													<svg
														className="w-5 h-5 text-primary-foreground"
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
																<span className="text-xs font-medium text-primary">
																	{message.agentName}
																</span>
																<span className="text-xs text-muted-foreground">
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
																			alt={
																				props.alt || 'Image'
																			}
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
																				className="bg-muted px-1.5 py-0.5 rounded text-sm"
																				{...props}
																			>
																				{children}
																			</code>
																		) : (
																			<code
																				className={`block bg-muted p-3 rounded-lg overflow-x-auto ${
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
															<div className="mt-3 p-3 bg-primary/5 rounded-lg border">
																<h4 className="text-sm font-medium text-primary mb-2">
																	🧠 Reasoning Chain
																</h4>
																<pre className="text-xs text-muted-foreground overflow-x-auto">
																	{JSON.stringify(
																		message.reasoning,
																		null,
																		2
																	)}
																</pre>
															</div>
														)}
														{message.validation && (
															<div className="mt-3 p-3 bg-accent/5 rounded-lg border">
																<h4 className="text-sm font-medium text-accent-foreground mb-2">
																	✅ Validation Status
																</h4>
																<pre className="text-xs text-muted-foreground overflow-x-auto">
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
							)
						})
					)}

					{isLoading && (
						<div className="flex justify-start">
							<div className="max-w-[80%] rounded-2xl px-6 py-4 bg-card shadow-md border">
								<div className="flex items-center gap-3">
									<div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
										<svg
											className="w-5 h-5 text-primary-foreground"
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
											className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
											style={{ animationDelay: '0ms' }}
										></div>
										<div
											className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
											style={{ animationDelay: '150ms' }}
										></div>
										<div
											className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
											style={{ animationDelay: '300ms' }}
										></div>
									</div>
									<span className="text-sm text-muted-foreground ml-2">
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
			<div className="bg-card border-t border-border px-6 py-4">
				<div className="max-w-4xl mx-auto">
					<form onSubmit={handleSubmit} className="relative">
						<div className="flex items-center gap-2 px-4 py-3 bg-muted rounded-full">
							<svg
								className="w-5 h-5 text-muted-foreground"
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
								className="flex-1 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none"
							/>
							<div className="flex items-center gap-2">
								<button
									type="button"
									className="p-2 text-muted-foreground hover:text-foreground"
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
									className="p-2 text-muted-foreground hover:text-foreground"
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
									className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
