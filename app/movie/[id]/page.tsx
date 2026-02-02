import { notFound } from 'next/navigation'
import { BackButton } from '@/components/back-button'
import { Header } from '@/components/header'
import { RatingBadge } from '@/components/rating-badge'
import { PosterImage } from '@/components/poster-image'
import { ViewTransitionElement } from '@/components/view-transition-element'
import type { MovieDetails, OmdbErrorResponse } from '@/types/movie'

interface MoviePageProps {
	params: Promise<{ id: string }>
}

async function getMovieDetails(id: string): Promise<MovieDetails | null> {
	try {
		const response = await fetch(`http://localhost:3000/api/movies/${id}`, {
			cache: 'no-store',
		})

		if (!response.ok) {
			return null
		}

		const data: MovieDetails | OmdbErrorResponse = await response.json()

		if (data.Response === 'False') {
			return null
		}

		return data as MovieDetails
	} catch (error) {
		console.error('Error fetching movie details:', error)
		return null
	}
}

export default async function MoviePage({ params }: MoviePageProps) {
	const { id } = await params
	const movie = await getMovieDetails(id)

	if (!movie) {
		notFound()
	}

	return (
		<main className="min-h-screen p-8">
			<div className="max-w-7xl mx-auto">
				<Header asLink />

				<BackButton />

				<div className="grid md:grid-cols-[300px_1fr] gap-8">
					<div className="w-full max-w-[300px]">
						<ViewTransitionElement
							name={`poster-${id}`}
							className="aspect-[2/3] relative rounded-lg overflow-hidden"
						>
							<PosterImage
								src={movie.Poster}
								alt={`${movie.Title} poster`}
								className="w-full h-full object-cover"
							/>
						</ViewTransitionElement>
					</div>

					<div className="space-y-6">
						<div>
							<ViewTransitionElement
								name={`title-${id}`}
								as="h1"
								className="text-4xl font-bold mb-2"
							>
								{movie.Title}
							</ViewTransitionElement>
							<div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
								<ViewTransitionElement name={`year-${id}`} as="span">
									{movie.Year}
								</ViewTransitionElement>
								<span>•</span>
								<span>{movie.Rated}</span>
								<span>•</span>
								<span>{movie.Runtime}</span>
								<span>•</span>
								<span>{movie.Genre}</span>
							</div>

							<RatingBadge ratings={movie.Ratings} />
						</div>

						<div>
							<h2 className="text-xl font-semibold mb-2">Plot</h2>
							<p className="text-muted-foreground leading-relaxed">
								{movie.Plot}
							</p>
						</div>

						<div className="grid sm:grid-cols-2 gap-4">
							<div>
								<h3 className="font-semibold mb-1">Director</h3>
								<p className="text-muted-foreground">{movie.Director}</p>
							</div>

							<div>
								<h3 className="font-semibold mb-1">Writer</h3>
								<p className="text-muted-foreground">{movie.Writer}</p>
							</div>

							<div>
								<h3 className="font-semibold mb-1">Actors</h3>
								<p className="text-muted-foreground">{movie.Actors}</p>
							</div>

							<div>
								<h3 className="font-semibold mb-1">Language</h3>
								<p className="text-muted-foreground">{movie.Language}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}
