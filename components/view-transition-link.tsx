'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type ReactNode, useRef } from 'react'

interface ViewTransitionLinkProps {
	href: string
	children: ReactNode
	className?: string
}

export function ViewTransitionLink({
	href,
	children,
	className,
}: ViewTransitionLinkProps) {
	const router = useRouter()
	const isTransitioning = useRef(false)

	const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
		// Only handle left clicks without modifier keys
		if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
			return
		}

		// Check if View Transition API is supported
		if (!document.startViewTransition || isTransitioning.current) {
			return
		}

		e.preventDefault()
		isTransitioning.current = true

		// Create a promise that resolves when the DOM actually changes
		const domChangePromise = new Promise<void>((resolve) => {
			// Watch for DOM mutations
			const observer = new MutationObserver(() => {
				// Check if we're on the new page by looking for unique content
				const newUrl = new URL(href, window.location.origin)
				if (window.location.pathname === newUrl.pathname) {
					observer.disconnect()
					// Wait one more frame for rendering to complete
					requestAnimationFrame(() => {
						resolve()
					})
				}
			})

			observer.observe(document.body, {
				childList: true,
				subtree: true,
			})

			// Start navigation
			router.push(href)

			// Timeout fallback
			setTimeout(() => {
				observer.disconnect()
				resolve()
			}, 1000)
		})

		// Start view transition
		document.startViewTransition(async () => {
			await domChangePromise
		}).finished.finally(() => {
			isTransitioning.current = false
		})
	}

	return (
		<Link href={href} onClick={handleClick} className={className} prefetch>
			{children}
		</Link>
	)
}
