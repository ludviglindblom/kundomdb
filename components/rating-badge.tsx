import type { Rating } from '@/types/movie'

interface RatingBadgeProps {
	ratings: Rating[]
}

export function RatingBadge({ ratings }: RatingBadgeProps) {
	const imdbRating = ratings.find((r) => r.Source === 'Internet Movie Database')
	const rtRating = ratings.find((r) => r.Source === 'Rotten Tomatoes')

	if (!imdbRating && !rtRating) {
		return null
	}

	return (
		<div className="flex flex-wrap gap-3">
			{imdbRating && (
				<div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
					<div className="flex items-center gap-1">
						<span className="text-sm font-semibold">IMDb</span>
					</div>
					<span className="text-sm font-bold">{imdbRating.Value}</span>
				</div>
			)}

			{rtRating && (
				<div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
					<div className="flex items-center gap-1">
						<span className="text-sm font-semibold">Rotten Tomatoes</span>
					</div>
					<span className="text-sm font-bold">{rtRating.Value}</span>
				</div>
			)}
		</div>
	)
}
