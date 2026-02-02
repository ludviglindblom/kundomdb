'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export function useViewTransitions() {
	const pathname = usePathname()
	const previousPathname = useRef(pathname)

	useEffect(() => {
		// Skip on initial mount
		if (previousPathname.current === pathname) {
			return
		}

		console.log('Route changed from', previousPathname.current, 'to', pathname)
		previousPathname.current = pathname
	}, [pathname])
}
