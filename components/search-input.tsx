'use client'

interface SearchInputProps {
	value: string
	onChange: (value: string) => void
	placeholder?: string
}

export function SearchInput({
	value,
	onChange,
	placeholder = 'Search for movies...',
}: SearchInputProps) {
	return (
		<div className="w-full max-w-2xl">
			<input
				type="text"
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onFocus={(e) => e.target.select()}
				className="flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 text-lg shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
			/>
		</div>
	)
}
