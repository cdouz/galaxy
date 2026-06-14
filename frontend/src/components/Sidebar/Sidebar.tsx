import { Settings, LayoutDashboard, Plus, Search, Waypoints, Info } from "lucide-react"
import { NavLink } from "react-router-dom"

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

const Item = ({ icon, label, to }: SidebarItem) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-zinc-700 ${isActive ? "bg-zinc-700 text-white" : "text-zinc-400"}`
    }
  >
    <span className="shrink-0">{icon}</span>
    <span className="overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-200 group-hover:opacity-100 w-0 group-hover:w-24">
      {label}
    </span>
  </NavLink>
)

const Sidebar = () => {
  return (
    <aside className="group/sidebar flex h-screen w-12 hover:w-44 flex-col justify-between bg-zinc-900 px-2 py-4 transition-all duration-200 overflow-hidden shrink-0">
      <nav className="flex flex-col gap-1">
        {topItems.map((item) => (
          <Item key={item.to} {...item} />
        ))}
      </nav>
      <nav className="flex flex-col gap-1">
        {bottomItems.map((item) => (
          <Item key={item.to} {...item} />
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
