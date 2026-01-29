import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '@/app/page'

jest.mock('next/navigation', () => ({
	useSearchParams: () => ({
		get: jest.fn(() => null),
	}),
	useRouter: () => ({
		replace: jest.fn(),
	}),
}))

global.fetch = jest.fn()

describe('Home Page', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.useFakeTimers()
	})

	afterEach(() => {
		jest.useRealTimers()
	})

	it('should render initial state', () => {
		render(<Home />)

		expect(screen.getByText('KundOMDb')).toBeInTheDocument()
		expect(screen.getByPlaceholderText('Search for movies...')).toBeInTheDocument()
		expect(screen.getByText('Start typing to search for movies')).toBeInTheDocument()
	})

	it('should show loading state during search', async () => {
		;(global.fetch as jest.Mock).mockImplementation(
			() =>
				new Promise((resolve) =>
					setTimeout(
						() =>
							resolve({
								ok: true,
								json: async () => ({
									Search: [],
									totalResults: '0',
									Response: 'True',
								}),
							}),
						1000
					)
				)
		)

		const user = userEvent.setup({ delay: null })
		render(<Home />)

		const input = screen.getByPlaceholderText('Search for movies...')
		await user.type(input, 'test')

		jest.advanceTimersByTime(300)

		await waitFor(() => {
			const spinner = document.querySelector('.animate-spin')
			expect(spinner).toBeInTheDocument()
		})
	})

	it('should display search results', async () => {
		;(global.fetch as jest.Mock).mockResolvedValue({
			ok: true,
			json: async () => ({
				Search: [
					{
						Title: 'Blade Runner',
						Year: '1982',
						imdbID: 'tt0083658',
						Poster: 'https://example.com/poster.jpg',
					},
				],
				totalResults: '1',
				Response: 'True',
			}),
		})

		const user = userEvent.setup({ delay: null })
		render(<Home />)

		const input = screen.getByPlaceholderText('Search for movies...')
		await user.type(input, 'Blade Runner')

		jest.advanceTimersByTime(300)

		await waitFor(() => {
			expect(screen.getByText('Blade Runner')).toBeInTheDocument()
		})

		expect(screen.getByText('1982')).toBeInTheDocument()
		expect(screen.getByText('Found 1 result')).toBeInTheDocument()
	})

	it('should display error message', async () => {
		;(global.fetch as jest.Mock).mockResolvedValue({
			ok: false,
			json: async () => ({
				Response: 'False',
				Error: 'Movie not found!',
			}),
		})

		const user = userEvent.setup({ delay: null })
		render(<Home />)

		const input = screen.getByPlaceholderText('Search for movies...')
		await user.type(input, 'nonexistent')

		jest.advanceTimersByTime(300)

		await waitFor(() => {
			expect(screen.getByText('Movie not found!')).toBeInTheDocument()
		})
	})

	it('should display no results message', async () => {
		;(global.fetch as jest.Mock).mockResolvedValue({
			ok: true,
			json: async () => ({
				Search: [],
				totalResults: '0',
				Response: 'False',
				Error: 'Movie not found!',
			}),
		})

		const user = userEvent.setup({ delay: null })
		render(<Home />)

		const input = screen.getByPlaceholderText('Search for movies...')
		await user.type(input, 'xyz123')

		jest.advanceTimersByTime(300)

		await waitFor(() => {
			expect(screen.getByText('Movie not found!')).toBeInTheDocument()
		})
	})
})
