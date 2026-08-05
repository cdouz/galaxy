import { Settings, LayoutDashboard, Plus, Search, Waypoints, Info } from "lucide-react"
import { useState } from "react"
import { NavLink } from "react-router-dom"
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
  { icon: <Plus size={18} />, label: "New note", to: "/notes/new" },
]

const bottomItems: SidebarItem[] = [
  { icon: <Settings size={18} />, label: "Settings", to: "/settings" },
  { icon: <Info size={18} />, label: "About", to: "/about" }
]

const Item = ({ icon, label, to, expanded }: SidebarItem & { expanded: boolean }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[var(--secondary)] ${isActive ? "bg-milk text-black" : "text-zinc-400"}`
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

  return (
    <aside
      className={`flex h-screen flex-col justify-between px-2 py-4 transition-all duration-200 overflow-hidden shrink-0 ${expanded ? "w-44" : "w-12"}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <nav className="flex flex-col gap-1">
        {topItems.map((item) => (
          <Item key={item.to} {...item} expanded={expanded} />
        ))}
      </nav>
      <nav className="flex flex-col gap-1">
        {bottomItems.map((item) => (
          <Item key={item.to} {...item} expanded={expanded} />
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
