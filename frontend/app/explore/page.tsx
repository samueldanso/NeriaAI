'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, RefreshCw, ExternalLink, Brain, Shield, Zap } from 'lucide-react'
import { getCapsules, type KnowledgeCapsule } from '@/lib/supabase'
import Image from 'next/image'

export default function ExplorePage() {
	const [capsules, setCapsules] = useState<KnowledgeCapsule[]>([])
	const [searchQuery, setSearchQuery] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const [selectedCapsule, setSelectedCapsule] = useState<KnowledgeCapsule | null>(null)
	const { ready, authenticated } = usePrivy()
	const router = useRouter()

	// Protect route - redirect if not authenticated
	useEffect(() => {
		if (ready && !authenticated) {
			router.push('/')
		}
	}, [ready, authenticated, router])

	useEffect(() => {
		if (ready && authenticated) {
			fetchCapsules()
		}
	}, [ready, authenticated])

	const fetchCapsules = async () => {
		try {
			setIsLoading(true)
			const result = await getCapsules()
			if (result.success && 'capsules' in result) {
				setCapsules(result.capsules)
			} else {
				console.error(
					'Failed to fetch capsules:',
					'error' in result ? result.error : 'Unknown error'
				)
				setCapsules([])
			}
		} catch (error) {
			console.error('Failed to fetch capsules:', error)
			setCapsules([])
		} finally {
			setIsLoading(false)
		}
	}

	const handleSearch = async (query: string) => {
		if (!query.trim()) {
			fetchCapsules()
			return
		}

		// Simple client-side filtering for now
		// TODO: Implement proper vector search with embeddings API
		try {
			setIsLoading(true)
			const result = await getCapsules()
			if (result.success && 'capsules' in result) {
				const filtered = result.capsules.filter(
					(capsule) =>
						capsule.query.toLowerCase().includes(query.toLowerCase()) ||
						capsule.answer.toLowerCase().includes(query.toLowerCase())
				)
				setCapsules(filtered)
			} else {
				console.error('Search failed:', 'error' in result ? result.error : 'Unknown error')
				setCapsules([])
			}
		} catch (error) {
			console.error('Search error:', error)
			setCapsules([])
		} finally {
			setIsLoading(false)
		}
	}

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		handleSearch(searchQuery)
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

	return (
		<>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<div className="flex flex-col h-screen">
						{/* Header */}
						<header className="border-b bg-background px-6 py-4">
							<div className="flex items-center justify-between">
								<div>
									<h1 className="text-2xl font-bold text-foreground">
										Knowledge Capsules
									</h1>
									<p className="text-sm text-muted-foreground mt-1">
										Verified, reusable knowledge from our multi-agent system
									</p>
								</div>
								<div className="flex items-center gap-4">
									<span className="text-sm text-muted-foreground">
										{capsules.length} capsules
									</span>
									<Button
										onClick={fetchCapsules}
										variant="outline"
										size="sm"
										disabled={isLoading}
									>
										<RefreshCw
											className={`w-4 h-4 mr-2 ${
												isLoading ? 'animate-spin' : ''
											}`}
										/>
										Refresh
									</Button>
								</div>
							</div>
						</header>

						{/* Main Content */}
						<div className="flex-1 overflow-y-auto">
							<div className="max-w-6xl mx-auto px-6 py-6">
								{/* Search Bar */}
								<div className="mb-6">
									<form onSubmit={handleSearchSubmit} className="relative">
										<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
										<Input
											type="text"
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
											placeholder="Search knowledge capsules..."
											className="pl-10"
										/>
									</form>
								</div>

								{/* Capsules Grid */}
								{isLoading ? (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
										{Array.from({ length: 6 }).map((_, i) => (
											<Card key={i}>
												<CardHeader>
													<Skeleton className="h-4 w-3/4" />
													<Skeleton className="h-3 w-1/2" />
												</CardHeader>
												<CardContent>
													<Skeleton className="h-20 w-full mb-4" />
													<div className="space-y-2">
														<Skeleton className="h-3 w-full" />
														<Skeleton className="h-3 w-2/3" />
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								) : capsules.length === 0 ? (
									<div className="text-center py-12">
										<div className="inline-block p-8 bg-muted rounded-full mb-8">
											<Image
												src="/icon.png"
												alt="Neria AI"
												width={64}
												height={64}
												className="w-16 h-16"
											/>
										</div>
										<h3 className="text-xl font-semibold text-foreground mb-2">
											No capsules found
										</h3>
										<p className="text-muted-foreground">
											{searchQuery
												? 'Try a different search term'
												: 'No knowledge capsules available yet'}
										</p>
									</div>
								) : (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
										{capsules.map((capsule) => (
											<Card
												key={capsule.id}
												className="cursor-pointer hover:shadow-lg transition-shadow"
												onClick={() => setSelectedCapsule(capsule)}
											>
												<CardHeader>
													<div className="flex items-start justify-between">
														<div className="flex-1">
															<CardTitle className="text-base line-clamp-2 mb-2">
																{capsule.query}
															</CardTitle>
															<div className="flex items-center gap-2 mb-2">
																<Badge
																	variant="secondary"
																	className="text-xs"
																>
																	{capsule.reasoning_type}
																</Badge>
																<span className="text-xs text-muted-foreground">
																	{new Date(
																		capsule.created_at
																	).toLocaleDateString()}
																</span>
															</div>
														</div>
														<div className="flex flex-col items-end gap-1">
															<Badge
																variant={
																	capsule.validation_status ===
																	'VERIFIED'
																		? 'default'
																		: 'destructive'
																}
																className="text-xs"
															>
																{capsule.validation_status}
															</Badge>
															<span className="text-xs text-muted-foreground">
																{Math.round(
																	capsule.confidence * 100
																)}
																% confidence
															</span>
														</div>
													</div>
												</CardHeader>
												<CardContent>
													<div className="space-y-3">
														<div className="flex items-center justify-between text-sm">
															<span className="text-muted-foreground">
																Views
															</span>
															<span className="font-medium">
																{capsule.view_count}
															</span>
														</div>
														<div className="flex items-center justify-between text-sm">
															<span className="text-muted-foreground">
																Citations
															</span>
															<span className="font-medium">
																{capsule.citation_count}
															</span>
														</div>
														{capsule.nft_token_id && (
															<div className="flex items-center justify-between text-sm">
																<span className="text-muted-foreground">
																	NFT
																</span>
																<Badge
																	variant="outline"
																	className="text-xs"
																>
																	Token #{capsule.nft_token_id}
																</Badge>
															</div>
														)}
													</div>
													<div className="mt-4 pt-4 border-t">
														<div className="flex items-center gap-2 text-sm text-muted-foreground">
															<Brain className="w-4 h-4" />
															<span>Multi-agent reasoning</span>
														</div>
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								)}
							</div>
						</div>
					</div>
				</SidebarInset>
			</SidebarProvider>

			{/* Capsule Detail Modal */}
			{selectedCapsule && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
					<Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="text-2xl">
									Knowledge Capsule Details
								</CardTitle>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setSelectedCapsule(null)}
								>
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</Button>
							</div>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Query */}
							<div>
								<h3 className="text-lg font-semibold mb-2">Original Query</h3>
								<p className="text-muted-foreground">{selectedCapsule.query}</p>
							</div>

							{/* Answer */}
							<div>
								<h3 className="text-lg font-semibold mb-2">Answer</h3>
								<div className="bg-muted rounded-lg p-4">
									<p className="text-sm">{selectedCapsule.answer}</p>
								</div>
							</div>

							{/* Validation Info */}
							<div>
								<h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
									<Shield className="w-5 h-5" />
									Validation Details
								</h3>
								<div className="bg-muted rounded-lg p-4">
									<div className="grid grid-cols-2 gap-4">
										<div>
											<span className="text-sm text-muted-foreground">
												Status
											</span>
											<div className="mt-1">
												<Badge
													variant={
														selectedCapsule.validation_status ===
														'VERIFIED'
															? 'default'
															: 'destructive'
													}
												>
													{selectedCapsule.validation_status}
												</Badge>
											</div>
										</div>
										<div>
											<span className="text-sm text-muted-foreground">
												Confidence
											</span>
											<p className="font-medium">
												{Math.round(selectedCapsule.confidence * 100)}%
											</p>
										</div>
										<div>
											<span className="text-sm text-muted-foreground">
												Views
											</span>
											<p className="font-medium">
												{selectedCapsule.view_count}
											</p>
										</div>
										<div>
											<span className="text-sm text-muted-foreground">
												Citations
											</span>
											<p className="font-medium">
												{selectedCapsule.citation_count}
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* NFT Info */}
							{selectedCapsule.nft_token_id && (
								<div>
									<h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
										<Zap className="w-5 h-5" />
										NFT Information
									</h3>
									<div className="bg-muted rounded-lg p-4">
										<div className="grid grid-cols-2 gap-4">
											<div>
												<span className="text-sm text-muted-foreground">
													Token ID
												</span>
												<p className="font-mono text-sm">
													{selectedCapsule.nft_token_id}
												</p>
											</div>
											<div>
												<span className="text-sm text-muted-foreground">
													Contract
												</span>
												<p className="font-mono text-sm">
													{selectedCapsule.nft_contract_address}
												</p>
											</div>
											{selectedCapsule.nft_tx_hash && (
												<div className="col-span-2">
													<span className="text-sm text-muted-foreground">
														Transaction
													</span>
													<p className="font-mono text-sm break-all">
														{selectedCapsule.nft_tx_hash}
													</p>
												</div>
											)}
										</div>
									</div>
								</div>
							)}

							{/* Metadata */}
							<div>
								<h3 className="text-lg font-semibold mb-2">Metadata</h3>
								<div className="bg-muted rounded-lg p-4">
									<div className="grid grid-cols-2 gap-4 text-sm">
										<div>
											<span className="text-muted-foreground">
												Capsule ID
											</span>
											<p className="font-mono text-xs">
												{selectedCapsule.id}
											</p>
										</div>
										<div>
											<span className="text-muted-foreground">Created</span>
											<p className="text-sm">
												{new Date(
													selectedCapsule.created_at
												).toLocaleString()}
											</p>
										</div>
										<div>
											<span className="text-muted-foreground">
												Reasoning Type
											</span>
											<p className="text-sm">
												{selectedCapsule.reasoning_type}
											</p>
										</div>
										<div>
											<span className="text-muted-foreground">Creator</span>
											<p className="font-mono text-xs">
												{selectedCapsule.creator_address}
											</p>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</>
	)
}
