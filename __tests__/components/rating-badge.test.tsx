import { render, screen } from '@testing-library/react'
import { RatingBadge } from '@/components/rating-badge'
import type { Rating } from '@/types/movie'

jest.mock('lucide-react', () => ({
	ThumbsUp: () => <div data-testid="thumbs-up-icon">ThumbsUp</div>,
	ThumbsDown: () => <div data-testid="thumbs-down-icon">ThumbsDown</div>,
}))

describe('RatingBadge', () => {
	const createRating = (source: string, value: string): Rating => ({
		Source: source,
		Value: value,
	})

	describe('Basic Rendering', () => {
		it('should render IMDb badge when IMDb rating exists', () => {
			const ratings = [createRating('Internet Movie Database', '8.5/10')]

			render(<RatingBadge ratings={ratings} />)

			expect(screen.getByText('IMDb')).toBeInTheDocument()
			expect(screen.getByText('8.5/10')).toBeInTheDocument()
		})

		it('should render Rotten Tomatoes badge when RT rating exists', () => {
			const ratings = [createRating('Rotten Tomatoes', '85%')]

			render(<RatingBadge ratings={ratings} />)

			expect(screen.getByText('Rotten Tomatoes')).toBeInTheDocument()
			expect(screen.getByText('85%')).toBeInTheDocument()
		})

		it('should render both badges when both ratings exist', () => {
			const ratings = [
				createRating('Internet Movie Database', '8.5/10'),
				createRating('Rotten Tomatoes', '85%'),
			]

			render(<RatingBadge ratings={ratings} />)

			expect(screen.getByText('IMDb')).toBeInTheDocument()
			expect(screen.getByText('8.5/10')).toBeInTheDocument()
			expect(screen.getByText('Rotten Tomatoes')).toBeInTheDocument()
			expect(screen.getByText('85%')).toBeInTheDocument()
		})

		it('should return null when ratings array is empty', () => {
			const { container } = render(<RatingBadge ratings={[]} />)

			expect(container.firstChild).toBeNull()
		})

		it('should return null when ratings exist but neither IMDb nor RT', () => {
			const ratings = [createRating('Metacritic', '85/100')]

			const { container } = render(<RatingBadge ratings={ratings} />)

			expect(container.firstChild).toBeNull()
		})
	})

	describe('Kundorating Calculation', () => {
		it('should show thumbs up when both ratings are above threshold', () => {
			const ratings = [
				createRating('Internet Movie Database', '8.5/10'),
				createRating('Rotten Tomatoes', '90%'),
			]

			render(<RatingBadge ratings={ratings} />)

			expect(screen.getByText('Kundo')).toBeInTheDocument()
			expect(screen.getByTestId('thumbs-up-icon')).toBeInTheDocument()
		})

		it('should show thumbs down when IMDb is below threshold', () => {
			const ratings = [
				createRating('Internet Movie Database', '6.5/10'),
				createRating('Rotten Tomatoes', '80%'),
			]

			render(<RatingBadge ratings={ratings} />)

			expect(screen.getByText('Kundo')).toBeInTheDocument()
			expect(screen.getByTestId('thumbs-down-icon')).toBeInTheDocument()
		})

		it('should show thumbs down when RT is below threshold', () => {
			const ratings = [
				createRating('Internet Movie Database', '8.0/10'),
				createRating('Rotten Tomatoes', '65%'),
			]

			render(<RatingBadge ratings={ratings} />)

			expect(screen.getByText('Kundo')).toBeInTheDocument()
			expect(screen.getByTestId('thumbs-down-icon')).toBeInTheDocument()
		})

		it('should show thumbs down when both are below threshold', () => {
			const ratings = [
				createRating('Internet Movie Database', '5.0/10'),
				createRating('Rotten Tomatoes', '40%'),
			]

			render(<RatingBadge ratings={ratings} />)

			expect(screen.getByText('Kundo')).toBeInTheDocument()
			expect(screen.getByTestId('thumbs-down-icon')).toBeInTheDocument()
		})

		it('should show thumbs up when exactly at threshold', () => {
			const ratings = [
				createRating('Internet Movie Database', '7.0/10'),
				createRating('Rotten Tomatoes', '70%'),
			]

			render(<RatingBadge ratings={ratings} />)

			expect(screen.getByText('Kundo')).toBeInTheDocument()
			expect(screen.getByTestId('thumbs-up-icon')).toBeInTheDocument()
		})

		it('should show thumbs down when just below threshold', () => {
			const ratings = [
				createRating('Internet Movie Database', '6.9/10'),
				createRating('Rotten Tomatoes', '69%'),
			]

			render(<RatingBadge ratings={ratings} />)

			expect(screen.getByText('Kundo')).toBeInTheDocument()
			expect(screen.getByTestId('thumbs-down-icon')).toBeInTheDocument()
		})

		it('should not show Kundorating when only IMDb exists', () => {
			const ratings = [createRating('Internet Movie Database', '8.5/10')]

			render(<RatingBadge ratings={ratings} />)

			expect(screen.getByText('IMDb')).toBeInTheDocument()
			expect(screen.queryByText('Kundo')).not.toBeInTheDocument()
		})

		it('should not show Kundorating when only RT exists', () => {
			const ratings = [createRating('Rotten Tomatoes', '85%')]

			render(<RatingBadge ratings={ratings} />)

			expect(screen.getByText('Rotten Tomatoes')).toBeInTheDocument()
			expect(screen.queryByText('Kundo')).not.toBeInTheDocument()
		})
	})

	describe('Edge Cases', () => {
		it('should handle malformed IMDb rating (no regex match)', () => {
			const ratings = [
				createRating('Internet Movie Database', 'Not a rating'),
				createRating('Rotten Tomatoes', '85%'),
			]

			render(<RatingBadge ratings={ratings} />)

			expect(screen.getByText('IMDb')).toBeInTheDocument()
			expect(screen.getByText('Not a rating')).toBeInTheDocument()
			expect(screen.queryByText('Kundo')).not.toBeInTheDocument()
		})

		it('should handle malformed RT rating (no regex match)', () => {
			const ratings = [
				createRating('Internet Movie Database', '8.5/10'),
				createRating('Rotten Tomatoes', 'Fresh'),
			]

			render(<RatingBadge ratings={ratings} />)

			expect(screen.getByText('Rotten Tomatoes')).toBeInTheDocument()
			expect(screen.getByText('Fresh')).toBeInTheDocument()
			expect(screen.queryByText('Kundo')).not.toBeInTheDocument()
		})

		it('should handle IMDb rating with decimal', () => {
			const ratings = [
				createRating('Internet Movie Database', '7.5/10'),
				createRating('Rotten Tomatoes', '75%'),
			]

			render(<RatingBadge ratings={ratings} />)

			expect(screen.getByText('Kundo')).toBeInTheDocument()
			expect(screen.getByTestId('thumbs-up-icon')).toBeInTheDocument()
		})

		it('should handle IMDb rating without decimal', () => {
			const ratings = [
				createRating('Internet Movie Database', '8/10'),
				createRating('Rotten Tomatoes', '80%'),
			]

			render(<RatingBadge ratings={ratings} />)

			expect(screen.getByText('Kundo')).toBeInTheDocument()
			expect(screen.getByTestId('thumbs-up-icon')).toBeInTheDocument()
		})

		it('should handle RT rating with low single digit', () => {
			const ratings = [
				createRating('Internet Movie Database', '3.0/10'),
				createRating('Rotten Tomatoes', '5%'),
			]

			render(<RatingBadge ratings={ratings} />)

			expect(screen.getByText('Kundo')).toBeInTheDocument()
			expect(screen.getByTestId('thumbs-down-icon')).toBeInTheDocument()
		})

		it('should handle RT rating at 100%', () => {
			const ratings = [
				createRating('Internet Movie Database', '9.0/10'),
				createRating('Rotten Tomatoes', '100%'),
			]

			render(<RatingBadge ratings={ratings} />)

			expect(screen.getByText('Kundo')).toBeInTheDocument()
			expect(screen.getByTestId('thumbs-up-icon')).toBeInTheDocument()
		})

		it('should handle NaN after parsing', () => {
			const ratings = [
				createRating('Internet Movie Database', 'abc/10'),
				createRating('Rotten Tomatoes', '85%'),
			]

			render(<RatingBadge ratings={ratings} />)

			expect(screen.getByText('IMDb')).toBeInTheDocument()
			expect(screen.queryByText('Kundo')).not.toBeInTheDocument()
		})
	})

	describe('UI and Styling', () => {
		it('should apply correct styling classes to IMDb badge', () => {
			const ratings = [createRating('Internet Movie Database', '8.5/10')]

			const { container } = render(<RatingBadge ratings={ratings} />)

			const imdbBadge = container.querySelector('.bg-amber-500\\/10')
			expect(imdbBadge).toBeInTheDocument()
			expect(imdbBadge).toHaveClass('border-amber-500/20')
		})

		it('should apply correct styling classes to RT badge', () => {
			const ratings = [createRating('Rotten Tomatoes', '85%')]

			const { container } = render(<RatingBadge ratings={ratings} />)

			const rtBadge = container.querySelector('.bg-red-500\\/10')
			expect(rtBadge).toBeInTheDocument()
			expect(rtBadge).toHaveClass('border-red-500/20')
		})

		it('should apply green styling for thumbs up Kundorating', () => {
			const ratings = [
				createRating('Internet Movie Database', '8.5/10'),
				createRating('Rotten Tomatoes', '90%'),
			]

			const { container } = render(<RatingBadge ratings={ratings} />)

			const kundoBadge = container.querySelector('.bg-green-600\\/10')
			expect(kundoBadge).toBeInTheDocument()
			expect(kundoBadge).toHaveClass('border-green-600/20')
		})

		it('should apply red styling for thumbs down Kundorating', () => {
			const ratings = [
				createRating('Internet Movie Database', '5.0/10'),
				createRating('Rotten Tomatoes', '40%'),
			]

			const { container } = render(<RatingBadge ratings={ratings} />)

			const kundoBadge = container.querySelector('.bg-red-700\\/10')
			expect(kundoBadge).toBeInTheDocument()
			expect(kundoBadge).toHaveClass('border-red-700/20')
		})
	})

	describe('Integration Tests', () => {
		it('should handle real-world scenario with high ratings', () => {
			const ratings = [
				createRating('Internet Movie Database', '8.8/10'),
				createRating('Rotten Tomatoes', '94%'),
			]

			render(<RatingBadge ratings={ratings} />)

			expect(screen.getByText('IMDb')).toBeInTheDocument()
			expect(screen.getByText('8.8/10')).toBeInTheDocument()

			expect(screen.getByText('Rotten Tomatoes')).toBeInTheDocument()
			expect(screen.getByText('94%')).toBeInTheDocument()

			expect(screen.getByText('Kundo')).toBeInTheDocument()
			expect(screen.getByTestId('thumbs-up-icon')).toBeInTheDocument()
		})

		it('should handle real-world scenario with mixed ratings', () => {
			const ratings = [
				createRating('Internet Movie Database', '6.2/10'),
				createRating('Rotten Tomatoes', '55%'),
			]

			render(<RatingBadge ratings={ratings} />)

			expect(screen.getByText('IMDb')).toBeInTheDocument()
			expect(screen.getByText('6.2/10')).toBeInTheDocument()

			expect(screen.getByText('Rotten Tomatoes')).toBeInTheDocument()
			expect(screen.getByText('55%')).toBeInTheDocument()

			expect(screen.getByText('Kundo')).toBeInTheDocument()
			expect(screen.getByTestId('thumbs-down-icon')).toBeInTheDocument()
		})
	})
})
