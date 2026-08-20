import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Search as SearchIcon } from "lucide-react"
import Sidebar from "@/components/Sidebar/Sidebar"
import { Input } from "@/components/ui/input"
import { searchNotes, type Note } from "@/lib/note-api"
import { ApiError } from "@/lib/api"

const SEARCH_DEBOUNCE_MS = 300

type SearchState = {
  /** The query these results belong to, so a stale render is recognisable. */
  query: string
  results: Note[]
  error: string | null
}

const snippet = (content: string, length = 140) =>
  content.length > length ? `${content.slice(0, length)}…` : content

const Search = () => {
  const [query, setQuery] = useState("")
  const [searchState, setSearchState] = useState<SearchState>({ query: "", results: [], error: null })

  const trimmed = query.trim()
  // Everything shown is derived from the query the results belong to: an empty
  // box shows nothing, and results are never rendered under a query that did not
  // produce them. Deriving it here also keeps state out of the render path.
  const isCurrent = searchState.query === trimmed
  const isLoading = Boolean(trimmed) && !isCurrent
  const results = isCurrent ? searchState.results : []
  const error = isCurrent ? searchState.error : null
  const hasSearched = Boolean(trimmed) && isCurrent

  useEffect(() => {
    if (!trimmed) {
      return
    }

    // The debounce only cancels the timer, not a request already in flight: two
    // keystrokes can leave two calls racing, and the slower, older one would
    // otherwise land last and overwrite the results the user is waiting for.
    let ignore = false
    const timeoutId = setTimeout(() => {
      searchNotes(trimmed)
        .then((notes) => {
          if (!ignore) setSearchState({ query: trimmed, results: notes, error: null })
        })
        .catch((err) => {
          if (ignore) return
          setSearchState({
            query: trimmed,
            results: [],
            error: err instanceof ApiError ? err.message : "Search failed",
          })
        })
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      ignore = true
      clearTimeout(timeoutId)
    }
  }, [trimmed])

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
          <p className="text-muted-foreground">No notes match "{trimmed}".</p>
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
