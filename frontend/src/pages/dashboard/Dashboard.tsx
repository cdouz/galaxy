import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Waypoints } from "lucide-react"
import Sidebar from "@/components/Sidebar/Sidebar"
import Logo from "@/components/Logo/Logo"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { getDashboardStats, type DashboardStats } from "@/lib/dashboard-api"
import { ApiError } from "@/lib/api"

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="rounded-lg border border-border bg-card text-card-foreground px-4 py-6 text-center">
    <p className="text-4xl font-bold">{value}</p>
    <p className="mt-1 text-sm text-muted-foreground">{label}</p>
  </div>
)

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
      <div className="w-full overflow-y-auto px-6 py-12">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
          <header className="flex flex-col items-center gap-4 text-center">
            <Logo className="h-20 w-auto sm:h-24" alt="" />
            <div>
              <h1 className="text-3xl font-bold text-milk sm:text-4xl">
                Welcome{user ? `, ${user.username}` : ""}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Here is the state of your galaxy.
              </p>
            </div>
          </header>

          {isLoading && <p className="mt-12 text-muted-foreground">Loading dashboard...</p>}
          {error && <p className="mt-12 text-destructive">{error}</p>}

          {!isLoading && !error && stats && (
            <>
              <div className="mt-12 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
                <Stat label={stats.noteCount === 1 ? "Note" : "Notes"} value={stats.noteCount} />
                <Stat label={stats.linkCount === 1 ? "Link" : "Links"} value={stats.linkCount} />
              </div>

              <div className="mt-10 grid w-full max-w-lg grid-cols-1 gap-4 sm:grid-cols-2">
                <Button size="lg" className="h-12 w-full text-base" asChild>
                  <Link to="/note/new">
                    <Plus />
                    New note
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 w-full text-base" asChild>
                  <Link to="/graph">
                    <Waypoints />
                    My Galaxy
                  </Link>
                </Button>
              </div>

              <div className="my-12 h-px w-full bg-border" />

              <section className="w-full">
                <h2 className="text-center text-lg font-semibold text-foreground">
                  Recently updated notes
                </h2>

                {stats.recentNotes.length === 0 && (
                  <p className="mt-4 text-center text-muted-foreground">
                    No notes yet. Use "New note" above to create one.
                  </p>
                )}

                {stats.recentNotes.length > 0 && (
                  <ul className="mt-6 flex flex-col gap-3">
                    {stats.recentNotes.map((note) => (
                      <li key={note.id}>
                        <Link
                          to={`/note/${note.id}/view`}
                          className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-5 py-4 text-foreground transition-colors hover:bg-secondary"
                        >
                          <span className="truncate">{note.title}</span>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {new Date(note.updatedAt).toLocaleDateString()}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
