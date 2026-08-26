import { Settings, LayoutDashboard, Plus, Search, Waypoints, Info, LogOut } from "lucide-react"
import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import Logo from "@/components/Logo/Logo"
import BackButton from "@/components/BackButton/BackButton"
import { getRecentNotes, type Note } from "@/lib/note-api"
import './sidebar.css'

type SidebarItem = {
  icon: React.ReactNode
  label: string
  to: string
}

const topItems: SidebarItem[] = [
  { icon: <LayoutDashboard size={18} />, label: "Dashboard", to: "/dashboard" },
  { icon: <Waypoints size={18} />, label: "My Galaxy", to: "/graph" },
  { icon: <Search size={18} />, label: "Search", to: "/search" },
  { icon: <Plus size={18} />, label: "New note", to: "/note/new" },
]

const bottomItems: SidebarItem[] = [
  { icon: <Settings size={18} />, label: "Settings", to: "/settings" },
  { icon: <Info size={18} />, label: "About", to: "/about" }
]

const rowLayout = (expanded: boolean) =>
  expanded ? "gap-3 px-3 justify-start" : "gap-0 px-0 justify-center"

const Item = ({ icon, label, to, expanded }: SidebarItem & { expanded: boolean }) => (
  <NavLink
    to={to}
    title={label}
    className={({ isActive }) =>
      `flex items-center rounded-lg py-2 transition-colors hover:bg-secondary ${rowLayout(expanded)} ${isActive ? "bg-milk text-milk-foreground" : "text-muted-foreground"}`
    }
  >
    <span className="shrink-0">{icon}</span>
    <span className={`overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-200 ${expanded ? "opacity-100 w-24" : "opacity-0 w-0"}`}>
      {label}
    </span>
  </NavLink>
)

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false)
  const [recentNotes, setRecentNotes] = useState<Note[]>([])
  const [notesLoading, setNotesLoading] = useState(true)
  const { user, isLoading: authLoading, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      navigate("/")
    }
  }

  useEffect(() => {
    if (!user) return
    getRecentNotes()
      .then(setRecentNotes)
      .catch(() => setRecentNotes([]))
      .finally(() => setNotesLoading(false))
  }, [user])

  // Nothing until the session check lands, so a signed-in user never sees the
  // signed-out rail flash by first.
  if (authLoading) return null

  // About is public: without a session there is nothing to navigate to here.
  if (!user) return <BackButton />

  return (
    <aside
      className={`flex h-screen flex-col px-2 py-4 transition-all duration-200 overflow-hidden shrink-0 ${expanded ? "w-48" : "w-14"}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <NavLink
        to="/dashboard"
        aria-label="Galaxy"
        className={`mb-3 flex items-center rounded-lg py-2 transition-colors hover:bg-secondary ${rowLayout(expanded)}`}
      >
        <Logo tone="on-primary" className="h-8 w-auto" alt="" />
        <span className={`jacques-francois overflow-hidden whitespace-nowrap text-2xl leading-none text-milk transition-all duration-200 ${expanded ? "opacity-100 w-24" : "opacity-0 w-0"}`}>
          Galaxy
        </span>
      </NavLink>
      <nav className="flex flex-col gap-1">
        {topItems.map((item) => (
          <Item key={item.to} {...item} expanded={expanded} />
        ))}
      </nav>
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        {expanded && (
          <div className="flex flex-col gap-1 pt-2">
            <p className="px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
              Recent
            </p>
            {notesLoading && (
              <p className="px-3 py-2 text-sm text-muted-foreground">Loading…</p>
            )}
            {!notesLoading && recentNotes.length === 0 && (
              <p className="px-3 py-2 text-sm text-muted-foreground">No notes yet</p>
            )}
            {!notesLoading && recentNotes.map((note) => (
              <NavLink
                key={note.id}
                to={`/note/${note.id}/view`}
                className={({ isActive }) =>
                  `truncate rounded-lg px-3 py-2 text-sm transition-colors hover:bg-secondary ${isActive ? "bg-milk text-milk-foreground" : "text-muted-foreground"}`
                }
              >
                {note.title}
              </NavLink>
            ))}
          </div>
        )}
      </div>
      <nav className="flex flex-col gap-1">
        {bottomItems.map((item) => (
          <Item key={item.to} {...item} expanded={expanded} />
        ))}
        <button
          onClick={handleLogout}
          title="Logout"
          className={`flex w-full items-center rounded-lg py-2 text-left transition-colors hover:bg-secondary text-muted-foreground ${rowLayout(expanded)}`}
        >
          <span className="shrink-0"><LogOut size={18} /></span>
          <span className={`overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-200 ${expanded ? "opacity-100 w-24" : "opacity-0 w-0"}`}>
            Logout
          </span>
        </button>
      </nav>
    </aside>
  )
}

export default Sidebar
