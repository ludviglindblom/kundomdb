'use client'

import { useState } from 'react'

interface PosterImageProps {
	src: string
	alt: string
	className?: string
}

export function PosterImage({ src, alt, className }: PosterImageProps) {
	const [hasError, setHasError] = useState(false)
	const showFallback = !src || src === 'N/A' || hasError

	if (showFallback) {
		return (
			<div
				className={`bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center ${className}`}
				role="img"
				aria-label={`${alt} (poster unavailable)`}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="64"
					height="64"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="text-muted-foreground/50"
				>
					<rect width="18" height="18" x="3" y="3" rx="2" />
					<path d="M7 3v18" />
					<path d="M3 7.5h4" />
					<path d="M3 12h18" />
					<path d="M3 16.5h4" />
					<path d="M17 3v18" />
					<path d="M17 7.5h4" />
					<path d="M17 16.5h4" />
				</svg>
			</div>
		)
	}

	return (
		<img
			src={src}
			alt={alt}
			className={className}
			onError={() => setHasError(true)}
			loading="lazy"
		/>
	)
}
