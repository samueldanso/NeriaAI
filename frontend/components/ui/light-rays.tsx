'use client'

import { cn } from '@/lib/utils'

interface LightRaysProps {
	className?: string
}

export function LightRays({ className }: LightRaysProps) {
	return (
		<div className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}>
			{/* Gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20" />

			{/* Light rays */}
			<svg
				className="absolute inset-0 h-full w-full"
				viewBox="0 0 100 100"
				preserveAspectRatio="xMidYMid slice"
			>
				<defs>
					<radialGradient
						id="light-ray-1"
						cx="50%"
						cy="0%"
						r="100%"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
						<stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
						<stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
					</radialGradient>
					<radialGradient
						id="light-ray-2"
						cx="30%"
						cy="0%"
						r="120%"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
						<stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
						<stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
					</radialGradient>
					<radialGradient
						id="light-ray-3"
						cx="70%"
						cy="0%"
						r="120%"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
						<stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
						<stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
					</radialGradient>
				</defs>

				{/* Animated light rays */}
				<ellipse
					cx="50"
					cy="0"
					rx="60"
					ry="80"
					fill="url(#light-ray-1)"
					className="animate-pulse"
					style={{
						animationDuration: '4s',
						animationDelay: '0s',
					}}
				/>
				<ellipse
					cx="30"
					cy="0"
					rx="50"
					ry="70"
					fill="url(#light-ray-2)"
					className="animate-pulse"
					style={{
						animationDuration: '6s',
						animationDelay: '1s',
					}}
				/>
				<ellipse
					cx="70"
					cy="0"
					rx="50"
					ry="70"
					fill="url(#light-ray-3)"
					className="animate-pulse"
					style={{
						animationDuration: '5s',
						animationDelay: '2s',
					}}
				/>
			</svg>
		</div>
	)
}
