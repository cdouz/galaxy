import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Search as SearchIcon } from "lucide-react"
import Sidebar from "@/components/Sidebar/Sidebar"
import { Input } from "@/components/ui/input"
import { searchNotes, type Note } from "@/lib/note-api"
import { ApiError } from "@/lib/api"

const SEARCH_DEBOUNCE_MS = 300

const snippet = (content: string, length = 140) =>
  content.length > length ? `${content.slice(0, length)}…` : content

const Search = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    const trimmed = query.trim()

    if (!trimmed) {
      setResults([])
      setError(null)
      setHasSearched(false)
      return
    }

    setIsLoading(true)
    const timeoutId = setTimeout(() => {
      searchNotes(trimmed)
        .then((notes) => {
          setResults(notes)
          setError(null)
        })
        .catch((err) => setError(err instanceof ApiError ? err.message : "Search failed"))
        .finally(() => {
          setIsLoading(false)
          setHasSearched(true)
        })
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timeoutId)
  }, [query])

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col w-full p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-milk mb-6">Search</h1>

        <div className="relative max-w-xl mb-8">
          <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes by title or content..."
            className="pl-9"
          />
        </div>

        {error && <p className="text-destructive">{error}</p>}

        {!error && isLoading && <p className="text-muted-foreground">Searching...</p>}

        {!error && !isLoading && hasSearched && results.length === 0 && (
          <p className="text-muted-foreground">No notes match "{query.trim()}".</p>
        )}

        {!error && !isLoading && results.length > 0 && (
          <ul className="flex flex-col gap-2 max-w-xl">
            {results.map((note) => (
              <li key={note.id}>
                <Link
                  to={`/note/${note.id}/view`}
                  className="flex flex-col gap-1 rounded-lg px-4 py-3 hover:bg-[hsl(var(--secondary))] text-foreground"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium truncate">{note.title}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {note.matchedTitle && (
                      <span className="text-xs rounded-full px-2 py-0.5 bg-milk text-[var(--milk-foreground)]">
                        title
                      </span>
                    )}
                    {note.matchedContent && (
                      <span className="text-xs rounded-full px-2 py-0.5 bg-[hsl(var(--secondary))] text-secondary-foreground">
                        content
                      </span>
                    )}
                  </div>
                  {note.matchedContent && note.content && (
                    <p className="text-sm text-muted-foreground">{snippet(note.content)}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Search
