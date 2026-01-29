export interface MovieSearchResult {
	Title: string
	Year: string
	imdbID: string
	Poster: string
}

export interface SearchResponse {
	Search: MovieSearchResult[]
	totalResults: string
	Response: string
}

export interface Rating {
	Source: string
	Value: string
}

export interface MovieDetails {
	Title: string
	Year: string
	Rated: string
	Runtime: string
	Genre: string
	Director: string
	Writer: string
	Actors: string
	Plot: string
	Language: string
	Poster: string
	Ratings: Rating[]
	Response: string
}

export interface OmdbErrorResponse {
	Response: 'False'
	Error: string
}
