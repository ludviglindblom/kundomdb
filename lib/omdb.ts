import type {
	SearchResponse,
	MovieDetails,
	OmdbErrorResponse,
} from '@/types/movie'

const OMDB_API_URL = 'http://www.omdbapi.com/'

function getApiKey(): string {
	const apiKey = process.env.OMDB_API_KEY
	if (!apiKey) {
		throw new Error('OMDB_API_KEY is not defined in environment variables')
	}
	return apiKey
}

/**
 * Search for movies by title
 * @param query - The search query string
 * @param page - The page number (default: 1)
 * @returns Search results or error response
 */
export async function searchMovies(
	query: string,
	page: number = 1
): Promise<SearchResponse | OmdbErrorResponse> {
	if (!query.trim()) {
		return {
			Response: 'False',
			Error: 'Search query cannot be empty',
		}
	}

	try {
		const params = new URLSearchParams({
			apikey: getApiKey(),
			s: query,
			page: page.toString(),
			type: 'movie',
		})

		const response = await fetch(`${OMDB_API_URL}?${params}`)

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = await response.json()
		return data
	} catch (error) {
		console.error('Error searching movies:', error)
		return {
			Response: 'False',
			Error: 'Failed to fetch search results',
		}
	}
}

/**
 * Get detailed information about a movie by IMDB ID
 * @param imdbId - The IMDB ID of the movie (e.g., "tt0083658")
 * @returns Movie details or error response
 */
export async function getMovieById(
	imdbId: string
): Promise<MovieDetails | OmdbErrorResponse> {
	if (!imdbId.trim()) {
		return {
			Response: 'False',
			Error: 'IMDB ID cannot be empty',
		}
	}

	try {
		const params = new URLSearchParams({
			apikey: getApiKey(),
			i: imdbId,
			plot: 'full',
		})

		const response = await fetch(`${OMDB_API_URL}?${params}`)

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = await response.json()
		return data
	} catch (error) {
		console.error('Error fetching movie details:', error)
		return {
			Response: 'False',
			Error: 'Failed to fetch movie details',
		}
	}
}
