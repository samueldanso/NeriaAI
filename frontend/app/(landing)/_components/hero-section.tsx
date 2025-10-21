import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function HeroSection() {
	return (
		<section className="relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-28">
			<div className="container mx-auto px-4">
				{/* Announcement Badge */}
				<div className="mb-8 flex justify-center">
					<Link
						href="#features"
						className="group inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium transition-all hover:bg-accent hover:shadow-md"
					>
						<span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
							NEW
						</span>
						<span className="text-muted-foreground group-hover:text-foreground transition-colors">
							Multi-Agent AI Reasoning System
						</span>
						<ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
					</Link>
				</div>

				{/* Hero Headline */}
				<div className="mx-auto max-w-5xl text-center">
					<h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
						<span className="block text-foreground">Where AI outputs</span>
						<span className="relative mt-2 block">
							<span className="text-foreground line-through decoration-primary/30 decoration-2">
								become
							</span>{' '}
							<span
								className="relative inline-block bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent"
								style={{
									fontFamily: 'var(--font-garnett)',
									fontStyle: 'italic',
									fontWeight: 600,
								}}
							>
								trusted knowledge
							</span>
						</span>
					</h1>

					{/* Subheading */}
					<p className="mx-auto mb-10 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl lg:leading-relaxed">
						Transform fragmented AI responses into expert-validated, reusable Knowledge
						Capsules. Built by AI agents, verified by human experts.
					</p>

					{/* CTA Button */}
					<div className="flex justify-center">
						<Button
							asChild
							size="lg"
							className="group h-12 gap-2 rounded-full px-8 text-base font-semibold shadow-lg transition-all hover:shadow-xl"
						>
							<Link href="/capsules">
								Try Neria AI
								<ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
							</Link>
						</Button>
					</div>
				</div>

				{/* Product Preview */}
				<div className="mx-auto mt-16 max-w-6xl">
					<div className="relative overflow-hidden rounded-2xl border bg-muted/30 shadow-2xl backdrop-blur-sm">
						<Image
							src="/images/hero-mock.png"
							alt="Neria AI Platform Interface - Expert-validated knowledge capsules"
							width={1920}
							height={1080}
							priority
							className="size-full object-cover"
						/>
					</div>
				</div>
			</div>

			{/* Background gradient decoration */}
			<div
				className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
				aria-hidden="true"
			>
				<div
					className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-blue-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
					style={{
						clipPath:
							'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
					}}
				/>
			</div>
		</section>
	)
}
