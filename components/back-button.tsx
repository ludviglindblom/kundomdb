'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'

export function BackButton() {
	const router = useRouter()
	const isTransitioning = useRef(false)

	const handleBack = async () => {
		if (!document.startViewTransition || isTransitioning.current) {
			router.back()
			return
		}

		isTransitioning.current = true

		// Create a promise that resolves when navigation completes
		const domChangePromise = new Promise<void>((resolve) => {
			const currentPath = window.location.pathname

			const observer = new MutationObserver(() => {
				if (window.location.pathname !== currentPath) {
					observer.disconnect()
					requestAnimationFrame(() => {
						resolve()
					})
				}
			})

			observer.observe(document.body, {
				childList: true,
				subtree: true,
			})

			router.back()

			setTimeout(() => {
				observer.disconnect()
				resolve()
			}, 1000)
		})

		document
			.startViewTransition(async () => {
				await domChangePromise
			})
			.finished.finally(() => {
				isTransitioning.current = false
			})
	}

	return (
		<button
			onClick={handleBack}
			className="inline-flex items-center gap-2 h-9 px-4 py-2 mb-6 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
		>
			<ArrowLeft className="h-4 w-4" />
			Back to Search
		</button>
	)
}
