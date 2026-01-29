import { searchMovies, getMovieById } from '@/lib/omdb'
import type { SearchResponse, MovieDetails } from '@/types/movie'

global.fetch = jest.fn()

describe('OMDB API Client', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		process.env.OMDB_API_KEY = 'test-api-key'
	})

	describe('searchMovies', () => {
		it('should return search results for a valid query', async () => {
			const mockResponse: SearchResponse = {
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
			}

			;(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse,
			})

			const result = await searchMovies('Blade Runner')

			expect(global.fetch).toHaveBeenCalledWith(
				expect.stringContaining('s=Blade+Runner')
			)
			expect(result).toEqual(mockResponse)
		})

		it('should include page parameter when provided', async () => {
			const mockResponse: SearchResponse = {
				Search: [],
				totalResults: '0',
				Response: 'True',
			}

			;(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse,
			})

			await searchMovies('test', 2)

			expect(global.fetch).toHaveBeenCalledWith(
				expect.stringContaining('page=2')
			)
		})

		it('should return error response for empty query', async () => {
			const result = await searchMovies('')

			expect(result).toEqual({
				Response: 'False',
				Error: 'Search query cannot be empty',
			})
			expect(global.fetch).not.toHaveBeenCalled()
		})

		it('should handle fetch errors gracefully', async () => {
			;(global.fetch as jest.Mock).mockRejectedValueOnce(
				new Error('Network error')
			)

			const result = await searchMovies('test')

			expect(result).toEqual({
				Response: 'False',
				Error: 'Failed to fetch search results',
			})
		})

		it('should handle HTTP errors', async () => {
			;(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: false,
				status: 500,
			})

			const result = await searchMovies('test')

			expect(result).toEqual({
				Response: 'False',
				Error: 'Failed to fetch search results',
			})
		})
	})

	describe('getMovieById', () => {
		it('should return movie details for a valid IMDB ID', async () => {
			const mockResponse: MovieDetails = {
				Title: 'Blade Runner',
				Year: '1982',
				Rated: 'R',
				Runtime: '117 min',
				Genre: 'Sci-Fi, Thriller',
				Director: 'Ridley Scott',
				Writer: 'Hampton Fancher',
				Actors: 'Harrison Ford',
				Plot: 'A blade runner must pursue and terminate four replicants.',
				Language: 'English',
				Poster: 'https://example.com/poster.jpg',
				Ratings: [
					{ Source: 'Internet Movie Database', Value: '8.2/10' },
					{ Source: 'Rotten Tomatoes', Value: '90%' },
				],
				Response: 'True',
			}

			;(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse,
			})

			const result = await getMovieById('tt0083658')

			expect(global.fetch).toHaveBeenCalledWith(
				expect.stringContaining('i=tt0083658')
			)
			expect(result).toEqual(mockResponse)
		})

		it('should return error response for empty IMDB ID', async () => {
			const result = await getMovieById('')

			expect(result).toEqual({
				Response: 'False',
				Error: 'IMDB ID cannot be empty',
			})
			expect(global.fetch).not.toHaveBeenCalled()
		})

		it('should handle fetch errors gracefully', async () => {
			;(global.fetch as jest.Mock).mockRejectedValueOnce(
				new Error('Network error')
			)

			const result = await getMovieById('tt0083658')

			expect(result).toEqual({
				Response: 'False',
				Error: 'Failed to fetch movie details',
			})
		})

		it('should handle HTTP errors', async () => {
			;(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: false,
				status: 404,
			})

			const result = await getMovieById('tt0083658')

			expect(result).toEqual({
				Response: 'False',
				Error: 'Failed to fetch movie details',
			})
		})
	})
})
