# KundOMDb

A Next.js application that uses the OMDb API to search for movies and display their details.

## Features

- Search for movies with live debounced search
- View movie details including plot, ratings, cast, and crew
- Pagination for search results
- URL-based search state (shareable search links)
- Fallback images for missing posters

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```
OMDB_API_KEY=your_api_key_here
```

### Running the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

### Test Coverage

- **API client** (`lib/omdb.ts`) - Search and movie detail fetching, error handling
- **Components**
  - Movie card rendering and linking
  - Poster image fallback behavior
- **Pages** - Home page search functionality, loading states, error handling

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Jest with React Testing Library
