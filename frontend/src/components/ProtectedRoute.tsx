import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth()

  // The session is checked against the server on first load; rendering nothing
  // meanwhile showed a blank page on every entry to a protected route.
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
