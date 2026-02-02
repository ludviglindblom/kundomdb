import type { Rating } from '@/types/movie'
import { ThumbsDown, ThumbsUp } from 'lucide-react'

interface RatingBadgeProps {
	ratings: Rating[]
}

type KundoRating = 'thumbsDown' | 'thumbsUp' | null

function calculateKundoRating(
	imdbRating: Rating | undefined,
	rtRating: Rating | undefined
): KundoRating {
	if (!imdbRating || !rtRating) {
		return null
	}

	const imdbMatch = imdbRating.Value.match(/^(\d+\.?\d*)\/10$/)
	if (!imdbMatch) {
		return null
	}
	const imdbScore = parseFloat(imdbMatch[1])
	if (isNaN(imdbScore)) {
		return null
	}

	const rtMatch = rtRating.Value.match(/^(\d+)%$/)
	if (!rtMatch) {
		return null
	}
	const rtScore = parseFloat(rtMatch[1])
	if (isNaN(rtScore)) {
		return null
	}

	if (imdbScore >= 7.0 && rtScore >= 70) {
		return 'thumbsUp'
	} else {
		return 'thumbsDown'
	}
}

export function RatingBadge({ ratings }: RatingBadgeProps) {
	const imdbRating = ratings.find((r) => r.Source === 'Internet Movie Database')
	const rtRating = ratings.find((r) => r.Source === 'Rotten Tomatoes')
	const kundoRating = calculateKundoRating(imdbRating, rtRating)

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

			{kundoRating && (
				<div
					className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
						kundoRating === 'thumbsDown'
							? 'bg-red-700/10 border-red-700/20'
							: 'bg-green-600/10 border-green-600/20'
					}`}
				>
					<div className="flex items-center gap-1">
						<span className="text-sm font-semibold">Kundo</span>
					</div>
					{kundoRating === 'thumbsDown' ? (
						<ThumbsDown className="self-end w-4 h-4" />
					) : (
						<ThumbsUp className="self-start w-4 h-4" />
					)}
				</div>
			)}
		</div>
	)
}
