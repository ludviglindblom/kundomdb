import { Header } from '@/components/header'

export default function NotFound() {
	return (
		<main className="min-h-screen p-8">
			<div className="max-w-7xl mx-auto">
				<Header asLink />

				<div className="flex items-center justify-center py-24">
					<div className="text-center">
						<h1 className="text-6xl font-bold mb-4">404</h1>
						<h2 className="text-2xl font-semibold mb-2">Movie Not Found</h2>
						<p className="text-muted-foreground">
							The movie you're looking for doesn't exist or has been removed.
						</p>
					</div>
				</div>
			</div>
		</main>
	)
}
