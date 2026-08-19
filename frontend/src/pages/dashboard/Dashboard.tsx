import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Sidebar from "@/components/Sidebar/Sidebar"
import { useAuth } from "@/hooks/useAuth"
import { listNotes, type Note } from "@/lib/note-api"
import { ApiError } from "@/lib/api"

const Dashboard = () => {
  const { user } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listNotes()
      .then(setNotes)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load notes"))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col w-full p-8">
        <h1 className="text-3xl font-bold text-milk mb-6">Welcome{user ? `, ${user.username}` : ""}</h1>

        {isLoading && <p className="text-muted-foreground">Loading notes...</p>}
        {error && <p className="text-destructive">{error}</p>}

        {!isLoading && !error && notes.length === 0 && (
          <p className="text-muted-foreground">
            No notes yet. Use "New note" in the sidebar to create one.
          </p>
        )}

        {!isLoading && !error && notes.length > 0 && (
          <ul className="flex flex-col gap-2">
            {notes.map((note) => (
              <li key={note.id}>
                <Link
                  to={`/note/${note.id}`}
                  className="block rounded-lg px-4 py-3 hover:bg-[var(--secondary)] text-white"
                >
                  {note.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Dashboard
