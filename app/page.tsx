'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { SearchInput } from '@/components/search-input'
import { MovieGrid } from '@/components/movie-grid'
import { useDebounce } from '@/hooks/use-debounce'
import type { MovieSearchResult, SearchResponse } from '@/types/movie'

function SearchPage() {
	const searchParams = useSearchParams()
	const router = useRouter()

	const initialQuery = searchParams.get('q') || ''
	const initialPage = parseInt(searchParams.get('page') || '1', 10)

	const [query, setQuery] = useState(initialQuery)
	const [movies, setMovies] = useState<MovieSearchResult[]>([])
	const [totalResults, setTotalResults] = useState(0)
	const [currentPage, setCurrentPage] = useState(initialPage)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const debouncedQuery = useDebounce(query, 300)

	useEffect(() => {
		async function searchMovies() {
			if (!debouncedQuery.trim()) {
				setMovies([])
				setTotalResults(0)
				setError(null)
				return
			}

			setIsLoading(true)
			setError(null)

			try {
				const params = new URLSearchParams({
					q: debouncedQuery,
					page: currentPage.toString(),
				})

				const response = await fetch(`/api/movies/search?${params}`)
				const data = await response.json()

				if (response.ok && data.Response === 'True') {
					const searchData = data as SearchResponse
					setMovies(searchData.Search)
					setTotalResults(parseInt(searchData.totalResults, 10))
				} else {
					setMovies([])
					setTotalResults(0)
					setError(data.Error || 'Failed to search movies')
				}
			} catch (err) {
				setMovies([])
				setTotalResults(0)
				setError('An error occurred while searching')
			} finally {
				setIsLoading(false)
			}
		}

		searchMovies()
	}, [debouncedQuery, currentPage])

	useEffect(() => {
		if (debouncedQuery !== query) {
			setCurrentPage(1)
		}
	}, [query, debouncedQuery])

	useEffect(() => {
		const params = new URLSearchParams()
		if (debouncedQuery) {
			params.set('q', debouncedQuery)
		}
		if (currentPage > 1) {
			params.set('page', currentPage.toString())
		}

		const queryString = params.toString()
		router.replace(queryString ? `/?${queryString}` : '/', { scroll: false })
	}, [debouncedQuery, currentPage, router])

	const handlePageChange = (page: number) => {
		setCurrentPage(page)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const totalPages = Math.ceil(totalResults / 10)

	return (
		<main className="min-h-screen p-8">
			<div className="max-w-7xl mx-auto">
				<Header />

				<div className="mb-8 flex justify-center">
					<SearchInput value={query} onChange={setQuery} />
				</div>

				{isLoading && (
					<div className="flex justify-center items-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground" />
					</div>
				)}

				{error && !isLoading && (
					<div className="text-center py-12">
						<p className="text-lg text-destructive">{error}</p>
					</div>
				)}

				{!isLoading && !error && movies.length === 0 && debouncedQuery && (
					<div className="text-center py-12">
						<p className="text-lg text-muted-foreground">
							No movies found for "{debouncedQuery}"
						</p>
					</div>
				)}

				{!isLoading && !error && movies.length > 0 && (
					<>
						<div className="mb-6">
							<p className="text-sm text-muted-foreground">
								Found {totalResults} result{totalResults !== 1 ? 's' : ''}
							</p>
						</div>

						<MovieGrid movies={movies} />

						{totalPages > 1 && (
							<div className="mt-8 flex justify-center gap-2">
								<button
									onClick={() => handlePageChange(currentPage - 1)}
									disabled={currentPage === 1}
									className="px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Previous
								</button>

								<div className="flex items-center gap-2">
									{Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
										let pageNum: number
										if (totalPages <= 5) {
											pageNum = i + 1
										} else if (currentPage <= 3) {
											pageNum = i + 1
										} else if (currentPage >= totalPages - 2) {
											pageNum = totalPages - 4 + i
										} else {
											pageNum = currentPage - 2 + i
										}

										return (
											<button
												key={pageNum}
												onClick={() => handlePageChange(pageNum)}
												className={`px-4 py-2 rounded-md border ${
													currentPage === pageNum
														? 'bg-foreground text-background'
														: 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
												}`}
											>
												{pageNum}
											</button>
										)
									})}
								</div>

								<button
									onClick={() => handlePageChange(currentPage + 1)}
									disabled={currentPage === totalPages}
									className="px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Next
								</button>
							</div>
						)}
					</>
				)}

				{!debouncedQuery && !isLoading && (
					<div className="text-center py-12">
						<p className="text-lg text-muted-foreground">
							Start typing to search for movies
						</p>
					</div>
				)}
			</div>
		</main>
	)
}

export default function Home() {
	return (
		<Suspense
			fallback={
				<main className="min-h-screen p-8">
					<div className="max-w-7xl mx-auto">
						<Header />
						<div className="mb-8 flex justify-center">
							<div className="w-full max-w-2xl h-12 bg-muted animate-pulse rounded-md" />
						</div>
					</div>
				</main>
			}
		>
			<SearchPage />
		</Suspense>
	)
}
