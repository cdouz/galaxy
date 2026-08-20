import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Sidebar from "@/components/Sidebar/Sidebar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { getDashboardStats, type DashboardStats } from "@/lib/dashboard-api"
import { ApiError } from "@/lib/api"

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load dashboard"))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col w-full p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-milk mb-6">Welcome{user ? `, ${user.username}` : ""}</h1>

        {isLoading && <p className="text-muted-foreground">Loading dashboard...</p>}
        {error && <p className="text-destructive">{error}</p>}

        {!isLoading && !error && stats && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 max-w-xl">
              <div className="rounded-lg border border-border bg-card text-card-foreground p-4">
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="text-2xl font-bold">{stats.noteCount}</p>
              </div>
              <div className="rounded-lg border border-border bg-card text-card-foreground p-4">
                <p className="text-sm text-muted-foreground">Links</p>
                <p className="text-sm font-medium text-muted-foreground">Coming soon</p>
              </div>
            </div>

            <div className="flex gap-3 mb-8">
              <Button asChild>
                <Link to="/note/new">New note</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/graph">My Galaxy</Link>
              </Button>
            </div>

            <h2 className="text-lg font-semibold text-foreground mb-3">Recently updated notes</h2>
            {stats.recentNotes.length === 0 && (
              <p className="text-muted-foreground">
                No notes yet. Use "New note" above to create one.
              </p>
            )}
            {stats.recentNotes.length > 0 && (
              <ul className="flex flex-col gap-2 max-w-xl">
                {stats.recentNotes.map((note) => (
                  <li key={note.id}>
                    <Link
                      to={`/note/${note.id}/view`}
                      className="flex items-center justify-between rounded-lg px-4 py-3 hover:bg-[hsl(var(--secondary))] text-foreground"
                    >
                      <span>{note.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
