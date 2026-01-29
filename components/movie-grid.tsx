import { MovieCard } from '@/components/movie-card'
import type { MovieSearchResult } from '@/types/movie'

interface MovieGridProps {
	movies: MovieSearchResult[]
}

export function MovieGrid({ movies }: MovieGridProps) {
	if (movies.length === 0) {
		return null
	}

	const uniqueMovies = movies.filter(
		(movie, index, self) =>
			index === self.findIndex((m) => m.imdbID === movie.imdbID)
	)

	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
			{uniqueMovies.map((movie) => (
				<MovieCard key={movie.imdbID} movie={movie} />
			))}
		</div>
	)
}
