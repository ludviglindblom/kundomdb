import { NextRequest, NextResponse } from 'next/server'
import { getMovieById } from '@/lib/omdb'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params

		if (!id) {
			return NextResponse.json(
				{
					Response: 'False',
					Error: 'Movie ID is required',
				},
				{ status: 400 }
			)
		}

		const result = await getMovieById(id)

		if (result.Response === 'False') {
			return NextResponse.json(result, { status: 404 })
		}

		return NextResponse.json(result)
	} catch (error) {
		console.error('Error in movie details API route:', error)
		return NextResponse.json(
			{
				Response: 'False',
				Error: 'Internal server error',
			},
			{ status: 500 }
		)
	}
}
