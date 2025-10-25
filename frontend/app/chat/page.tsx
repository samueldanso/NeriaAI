'use client'

import { usePrivy } from '@privy-io/react-auth'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { AppSidebar } from '@/components/app-sidebar'
import { EnhancedReasoningDisplay } from '@/components/enhanced-reasoning-display'
import { MintNFTButton } from '@/components/mint-nft-button'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import {
	extractCapsuleDataFromResponse,
	isCapsuleReadyForStorage,
	processCapsuleStorage,
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
	// NFT minting related fields
	capsuleId?: string
	ipfsHash?: string
	requiresManualMinting?: boolean
	mintingConfig?: any
}

export default function ChatPage() {
	const [messages, setMessages] = useState<Message[]>([])
	const [input, setInput] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [currentAgentStep, setCurrentAgentStep] = useState(0)
	const [isStoringCapsule, setIsStoringCapsule] = useState(false)
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const { user, ready, authenticated, login } = usePrivy()
	const router = useRouter()

	// Protect route - redirect if not authenticated
	useEffect(() => {
		if (ready && !authenticated) {
			router.push('/')
		}
	}, [ready, authenticated, router])

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	// Show loading while checking authentication
	if (!ready || !authenticated) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-background">
				<div className="text-center">
					<div className="inline-block p-8 bg-muted rounded-full mb-8">
						<Image
							src="/icon.png"
							alt="Neria AI"
							width={64}
							height={64}
							className="w-16 h-16 animate-pulse"
						/>
					</div>
					<p className="text-muted-foreground">Loading...</p>
				</div>
			</div>
		)
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
						// Add minting mode (hybrid for now)
						capsuleData.mintingMode = 'hybrid'

						// Get wallet provider for NFT minting
						// Privy embedded wallet or fallback to window.ethereum
						capsuleData.walletProvider =
							typeof window !== 'undefined' ? (window as any).ethereum : undefined

						try {
							// Process storage (Supabase + IPFS + NFT Minting)
							const storageResult = await processCapsuleStorage(capsuleData)

							if (storageResult.success) {
								// Show success message with conditional NFT minting
								const successMessage: Message = {
									id: `storage-success-${Date.now()}`,
									role: 'agent',
									content: storageResult.requiresManualMinting
										? `🎉 **Knowledge Capsule Stored Successfully!**\n\n📦 **Capsule ID:** \`${storageResult.capsuleId}\`\n🔗 **IPFS Hash:** \`${storageResult.ipfsHash}\`\n🌐 **Gateway URL:** [View on IPFS](${storageResult.ipfsUrl})\n\n🎨 **Ready for NFT Minting:**\nYour knowledge capsule is ready to be minted as an NFT on Base L2. Click the "Mint NFT" button below to proceed.\n\n✅ Your knowledge is now permanently stored on IPFS and ready for blockchain minting!`
										: `🎉 **Knowledge Capsule Stored & NFT Minted Successfully!**\n\n📦 **Capsule ID:** \`${
												storageResult.capsuleId
										  }\`\n🔗 **IPFS Hash:** \`${
												storageResult.ipfsHash
										  }\`\n🌐 **Gateway URL:** [View on IPFS](${
												storageResult.ipfsUrl
										  })\n\n🎨 **NFT Details:**\n🆔 **Token ID:** \`${
												storageResult.tokenId || 'Pending...'
										  }\`\n⛓️ **Transaction Hash:** \`${
												storageResult.nftTxHash || 'Pending...'
										  }\`\n🔗 **Base Sepolia Explorer:** [View Transaction](https://sepolia.basescan.org/tx/${
												storageResult.nftTxHash || ''
										  })\n\n✅ Your knowledge is now permanently stored on IPFS and minted as an NFT on Base L2!`,
									timestamp: new Date(),
									capsuleId: storageResult.capsuleId,
									ipfsHash: storageResult.ipfsHash,
									requiresManualMinting: storageResult.requiresManualMinting,
									mintingConfig: storageResult.mintingConfig,
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
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<div className="flex flex-col h-full w-full bg-background">
					{/* Messages Container */}
					<div className="flex-1 overflow-y-auto">
						<div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
							{messages.length === 0 ? (
								<div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
									<div className="inline-block p-8 bg-muted rounded-full mb-8">
										<Image
											src="/icon.png"
											alt="Neria AI"
											width={64}
											height={64}
											className="w-16 h-16"
										/>
									</div>
									<h1 className="text-4xl font-bold text-foreground mb-4">
										NERIA AI
									</h1>
									<p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
										Ask Neria - Our 5-agent system will research, reason, and
										validate your answer
									</p>

									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
										<button className="p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-left border hover:border-primary/20 hover:scale-[1.02]">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
													<svg
														className="w-5 h-5 text-primary"
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
												<span className="font-semibold text-card-foreground text-lg">
													Troubleshoot
												</span>
											</div>
											<p className="text-sm text-muted-foreground">
												Debug code issues with expert validation
											</p>
										</button>

										<button className="p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-left border hover:border-primary/20 hover:scale-[1.02]">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-10 h-10 bg-secondary/50 rounded-lg flex items-center justify-center">
													<svg
														className="w-5 h-5 text-secondary-foreground"
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
												<span className="font-semibold text-card-foreground text-lg">
													NERIA 101
												</span>
											</div>
											<p className="text-sm text-muted-foreground">
												Learn about our multi-agent system
											</p>
										</button>

										<button className="p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-left border hover:border-primary/20 hover:scale-[1.02]">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
													<svg
														className="w-5 h-5 text-accent-foreground"
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
												<span className="font-semibold text-card-foreground text-lg">
													Health
												</span>
											</div>
											<p className="text-sm text-muted-foreground">
												Medical and wellness questions
											</p>
										</button>

										<button className="p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-left border hover:border-primary/20 hover:scale-[1.02]">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
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
															d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
														/>
													</svg>
												</div>
												<span className="font-semibold text-card-foreground text-lg">
													Learn
												</span>
											</div>
											<p className="text-sm text-muted-foreground">
												Educational content and tutorials
											</p>
										</button>

										<button className="p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-left border hover:border-primary/20 hover:scale-[1.02]">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
													<svg
														className="w-5 h-5 text-destructive"
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
												<span className="font-semibold text-card-foreground text-lg">
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
								<>
									{isLoading && (
										<div className="flex justify-start">
											<div className="max-w-[80%] rounded-2xl px-6 py-4 bg-card shadow-md border">
												<div className="flex items-center gap-3">
													<div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center p-1">
														<Image
															src="/icon.png"
															alt="Neria AI"
															width={20}
															height={20}
															className="w-5 h-5"
														/>
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
									{messages.map((message) => {
										// Render agent status differently
										if (message.isAgentStatus && message.agentSteps) {
											return (
												<div
													key={message.id}
													className="flex justify-start"
												>
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
																	{message.agentSteps.map(
																		(step, idx) => (
																			<div
																				key={idx}
																				className={`flex items-center gap-3 text-sm transition-all duration-300 ${
																					step.status ===
																					'active'
																						? 'scale-105'
																						: ''
																				}`}
																			>
																				<span
																					className={`text-base ${
																						step.status ===
																						'completed'
																							? 'text-green-600 dark:text-green-400'
																							: step.status ===
																							  'active'
																							? 'text-blue-600 dark:text-blue-400 animate-pulse'
																							: 'text-muted-foreground/40'
																					}`}
																				>
																					{step.status ===
																					'completed'
																						? '✓'
																						: step.status ===
																						  'active'
																						? '⟳'
																						: '○'}
																				</span>
																				<span className="text-lg">
																					{step.icon}
																				</span>
																				<span
																					className={
																						step.status ===
																						'completed'
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
																		)
																	)}
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
													message.role === 'user'
														? 'justify-end'
														: 'justify-start'
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
															<div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center p-1">
																<Image
																	src="/icon.png"
																	alt="Neria AI"
																	width={20}
																	height={20}
																	className="w-5 h-5"
																/>
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
																			remarkPlugins={[
																				remarkGfm,
																			]}
																			components={{
																				img: ({
																					node,
																					...props
																				}) => (
																					<img
																						{...props}
																						className="max-w-full h-auto rounded-lg shadow-md my-4"
																						loading="lazy"
																						alt={
																							props.alt ||
																							'Image'
																						}
																					/>
																				),
																				a: ({
																					node,
																					...props
																				}) => (
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
																							{
																								children
																							}
																						</code>
																					) : (
																						<code
																							className={`block bg-muted p-3 rounded-lg overflow-x-auto ${
																								className ||
																								''
																							}`}
																							{...props}
																						>
																							{
																								children
																							}
																						</code>
																					)
																				},
																			}}
																		>
																			{message.content}
																		</ReactMarkdown>
																	</div>
																	<EnhancedReasoningDisplay
																		reasoning={
																			message.reasoning
																		}
																		validation={
																			message.validation
																		}
																		className="mt-4"
																	/>
																	{message.requiresManualMinting &&
																		message.capsuleId &&
																		message.ipfsHash && (
																			<div className="mt-4 flex justify-start">
																				<MintNFTButton
																					capsuleId={
																						message.capsuleId
																					}
																					capsuleTitle={
																						message.content.slice(
																							0,
																							50
																						) + '...'
																					}
																					ipfsHash={
																						message.ipfsHash
																					}
																					confidence={
																						0.75
																					} // Default confidence for manual minting
																					mode="manual"
																					onMintSuccess={(
																						tokenId,
																						txHash
																					) => {
																						// Update the message to show success
																						setMessages(
																							(
																								prev
																							) =>
																								prev.map(
																									(
																										msg
																									) =>
																										msg.id ===
																										message.id
																											? {
																													...msg,
																													content:
																														msg.content.replace(
																															'Ready for NFT Minting',
																															`NFT Minted Successfully! Token ID: ${tokenId}`
																														),
																													requiresManualMinting:
																														false,
																													tokenId,
																													nftTxHash:
																														txHash,
																											  }
																											: msg
																								)
																						)
																					}}
																					onMintError={(
																						error
																					) => {
																						console.error(
																							'Minting error:',
																							error
																						)
																					}}
																				/>
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
									})}
								</>
							)}
							<div ref={messagesEndRef} />
						</div>
					</div>

					{/* Input Form - Bottom positioned like in the design */}
					<div className="bg-background py-4">
						<div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
							<form onSubmit={handleSubmit} className="relative">
								<div className="flex items-center gap-2 px-4 py-3 bg-muted rounded-full border border-border">
									<input
										type="text"
										value={input}
										onChange={(e) => setInput(e.target.value)}
										placeholder="Ask Neria a question..."
										disabled={isLoading}
										className="flex-1 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none"
									/>
									<div className="flex items-center gap-2">
										<button
											type="button"
											className="p-2 text-muted-foreground hover:text-foreground transition-colors"
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
											className="p-2 text-muted-foreground hover:text-foreground transition-colors"
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
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
