'use client'

import { ArrowLeft } from 'lucide-react'

export function BackButton() {
	return (
		<button
			onClick={() => window.history.back()}
			className="inline-flex items-center gap-2 h-9 px-4 py-2 mb-6 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
		>
			<ArrowLeft className="h-4 w-4" />
			Back to Search
		</button>
	)
}
