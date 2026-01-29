import { NextRequest, NextResponse } from 'next/server'
import { searchMovies } from '@/lib/omdb'

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams
		const query = searchParams.get('q')
		const page = searchParams.get('page')

		if (!query) {
			return NextResponse.json(
				{
					Response: 'False',
					Error: 'Query parameter "q" is required',
				},
				{ status: 400 }
			)
		}

		const pageNumber = page ? parseInt(page, 10) : 1

		if (isNaN(pageNumber) || pageNumber < 1) {
			return NextResponse.json(
				{
					Response: 'False',
					Error: 'Page parameter must be a positive number',
				},
				{ status: 400 }
			)
		}

		const result = await searchMovies(query, pageNumber)

		if (result.Response === 'False') {
			return NextResponse.json(result, { status: 404 })
		}

		return NextResponse.json(result)
	} catch (error) {
		console.error('Error in search API route:', error)
		return NextResponse.json(
			{
				Response: 'False',
				Error: 'Internal server error',
			},
			{ status: 500 }
		)
	}
}
