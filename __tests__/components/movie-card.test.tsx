import { render, screen } from '@testing-library/react'
import { MovieCard } from '@/components/movie-card'
import type { MovieSearchResult } from '@/types/movie'

jest.mock('next/link', () => {
	return ({ children, href }: { children: React.ReactNode; href: string }) => {
		return <a href={href}>{children}</a>
	}
})

describe('MovieCard', () => {
	const mockMovie: MovieSearchResult = {
		Title: 'Blade Runner',
		Year: '1982',
		imdbID: 'tt0083658',
		Poster: 'https://example.com/poster.jpg',
	}

	it('should render movie information', () => {
		render(<MovieCard movie={mockMovie} />)

		expect(screen.getByText('Blade Runner')).toBeInTheDocument()
		expect(screen.getByText('1982')).toBeInTheDocument()
	})

	it('should render poster image when available', () => {
		render(<MovieCard movie={mockMovie} />)

		const img = screen.getByAltText('Blade Runner poster')
		expect(img).toBeInTheDocument()
		expect(img).toHaveAttribute('src', 'https://example.com/poster.jpg')
	})

	it('should render placeholder when poster is not available', () => {
		const movieWithoutPoster = {
			...mockMovie,
			Poster: 'N/A',
		}

		render(<MovieCard movie={movieWithoutPoster} />)

		expect(screen.queryByAltText('Blade Runner poster')).not.toBeInTheDocument()
		expect(screen.getByText('Blade Runner')).toBeInTheDocument()
	})

	it('should link to movie detail page', () => {
		render(<MovieCard movie={mockMovie} />)

		const link = screen.getByRole('link')
		expect(link).toHaveAttribute('href', '/movie/tt0083658')
	})

	it('should handle long titles', () => {
		const movieWithLongTitle = {
			...mockMovie,
			Title: 'A Very Long Movie Title That Should Be Truncated',
		}

		render(<MovieCard movie={movieWithLongTitle} />)

		expect(
			screen.getByText('A Very Long Movie Title That Should Be Truncated')
		).toBeInTheDocument()
	})
})
