import { render, screen, fireEvent } from '@testing-library/react'
import { PosterImage } from '@/components/poster-image'

describe('PosterImage', () => {
	it('should render image when src is valid', () => {
		render(
			<PosterImage
				src="https://example.com/poster.jpg"
				alt="Test Movie poster"
				className="test-class"
			/>
		)

		const img = screen.getByRole('img')
		expect(img).toHaveAttribute('src', 'https://example.com/poster.jpg')
		expect(img).toHaveAttribute('alt', 'Test Movie poster')
		expect(img).toHaveClass('test-class')
	})

	it('should show fallback when src is empty', () => {
		render(<PosterImage src="" alt="Test Movie poster" />)

		const fallback = screen.getByRole('img', {
			name: 'Test Movie poster (poster unavailable)',
		})
		expect(fallback).toBeInTheDocument()
	})

	it('should show fallback when src is "N/A"', () => {
		render(<PosterImage src="N/A" alt="Test Movie poster" />)

		const fallback = screen.getByRole('img', {
			name: 'Test Movie poster (poster unavailable)',
		})
		expect(fallback).toBeInTheDocument()
	})

	it('should show fallback when image fails to load', () => {
		render(
			<PosterImage
				src="https://example.com/broken.jpg"
				alt="Test Movie poster"
			/>
		)

		const img = screen.getByRole('img')
		expect(img).toHaveAttribute('src', 'https://example.com/broken.jpg')

		fireEvent.error(img)

		const fallback = screen.getByRole('img', {
			name: 'Test Movie poster (poster unavailable)',
		})
		expect(fallback).toBeInTheDocument()
	})

	it('should apply className to fallback', () => {
		const { container } = render(
			<PosterImage src="" alt="Test Movie poster" className="custom-class" />
		)

		const fallback = container.querySelector('.custom-class')
		expect(fallback).toBeInTheDocument()
	})

	it('should add lazy loading to valid images', () => {
		render(
			<PosterImage src="https://example.com/poster.jpg" alt="Test Movie" />
		)

		const img = screen.getByRole('img') as HTMLImageElement
		expect(img).toHaveAttribute('loading', 'lazy')
	})
})
