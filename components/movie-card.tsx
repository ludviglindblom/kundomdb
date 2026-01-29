import Link from 'next/link'
import { PosterImage } from '@/components/poster-image'
import type { MovieSearchResult } from '@/types/movie'

interface MovieCardProps {
	movie: MovieSearchResult
}

export function MovieCard({ movie }: MovieCardProps) {
	return (
		<Link href={`/movie/${movie.imdbID}`}>
			<div className="rounded-lg border bg-card text-card-foreground overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
				<div className="aspect-[2/3] relative overflow-hidden">
					<PosterImage
						src={movie.Poster}
						alt={`${movie.Title} poster`}
						className="w-full h-full object-cover transition hover:scale-105"
					/>
				</div>
				<div className="p-4">
					<h3 className="font-semibold text-lg line-clamp-2 mb-1">
						{movie.Title}
					</h3>
					<p className="text-sm text-muted-foreground">{movie.Year}</p>
				</div>
			</div>
		</Link>
	)
}
