'use client'

import { useEffect, useRef, type ReactNode } from 'react'

interface ViewTransitionElementProps {
	name: string
	children: ReactNode
	className?: string
	as?: 'div' | 'h1' | 'h2' | 'h3' | 'span'
}

export function ViewTransitionElement({
	name,
	children,
	className,
	as: Component = 'div',
}: ViewTransitionElementProps) {
	const ref = useRef<HTMLElement>(null)

	useEffect(() => {
		if (ref.current) {
			ref.current.style.setProperty('view-transition-name', name)
		}
	}, [name])

	return (
		<Component ref={ref as any} className={className}>
			{children}
		</Component>
	)
}
