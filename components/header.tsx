import Link from 'next/link'

interface HeaderProps {
	asLink?: boolean
}

export function Header({ asLink = false }: HeaderProps) {
	if (asLink) {
		return (
			<header className="mb-8">
				<Link href="/" className="group inline-block">
					<span className="text-4xl font-bold group-hover:underline">
						KundOMDb
					</span>
				</Link>
			</header>
		)
	}

	return (
		<header className="mb-12">
			<h1 className="text-4xl font-bold mb-2">KundOMDb</h1>
		</header>
	)
}
