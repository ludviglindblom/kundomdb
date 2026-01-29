import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
	title: 'KundOMDb',
	description: 'Search and discover movies',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className="font-sans antialiased bg-background text-foreground">
				{children}
			</body>
		</html>
	)
}
