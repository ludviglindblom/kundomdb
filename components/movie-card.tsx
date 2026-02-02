import { useEffect, useRef } from 'react'
import { ViewTransitionLink } from '@/components/view-transition-link'
import { PosterImage } from '@/components/poster-image'
import type { MovieSearchResult } from '@/types/movie'

interface MovieCardProps {
	movie: MovieSearchResult
}

export function MovieCard({ movie }: MovieCardProps) {
	const posterRef = useRef<HTMLDivElement>(null)
	const titleRef = useRef<HTMLHeadingElement>(null)
	const yearRef = useRef<HTMLParagraphElement>(null)

	useEffect(() => {
		if (posterRef.current) {
			posterRef.current.style.setProperty(
				'view-transition-name',
				`poster-${movie.imdbID}`
			)
		}
		if (titleRef.current) {
			titleRef.current.style.setProperty(
				'view-transition-name',
				`title-${movie.imdbID}`
			)
		}
		if (yearRef.current) {
			yearRef.current.style.setProperty(
				'view-transition-name',
				`year-${movie.imdbID}`
			)
		}
	}, [movie.imdbID])

	return (
		<ViewTransitionLink href={`/movie/${movie.imdbID}`}>
			<div className="rounded-lg border bg-card text-card-foreground overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
				<div ref={posterRef} className="aspect-[2/3] relative overflow-hidden">
					<PosterImage
						src={movie.Poster}
						alt={`${movie.Title} poster`}
						className="w-full h-full object-cover transition hover:scale-105"
					/>
				</div>
				<div className="p-4">
					<h3
						ref={titleRef}
						className="font-semibold text-lg line-clamp-2 mb-1"
					>
						{movie.Title}
					</h3>
					<p ref={yearRef} className="text-sm text-muted-foreground">
						{movie.Year}
					</p>
				</div>
			</div>
		</ViewTransitionLink>
	)
}
