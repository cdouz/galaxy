import Sidebar from "@/components/Sidebar/Sidebar"
import { useAuth } from "@/hooks/useAuth"

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col items-center justify-center gap-2 w-full text-center">
        <h1 className="text-3xl font-bold text-milk">Welcome{user ? `, ${user.username}` : ""}</h1>
        <p className="text-muted-foreground">Dashboard coming soon.</p>
      </div>
    </div>
  )
}

export default Dashboard
