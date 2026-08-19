import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "@/components/Sidebar/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import { ApiError } from "@/lib/api"

const Settings = () => {
  const { user, updateUsername, deleteAccount } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState(user?.username ?? "")
  const [isSavingUsername, setIsSavingUsername] = useState(false)
  const [usernameError, setUsernameError] = useState<string | null>(null)

  const [deletePassword, setDeletePassword] = useState("")
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleUsernameSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setUsernameError(null)
    setIsSavingUsername(true)

    try {
      await updateUsername(username)
    } catch (err) {
      setUsernameError(err instanceof ApiError ? err.message : "Something went wrong")
    } finally {
      setIsSavingUsername(false)
    }
  }

  const handleDeleteSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setDeleteError(null)
    setIsDeletingAccount(true)

    try {
      await deleteAccount(deletePassword)
      navigate("/")
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Something went wrong")
      setIsDeletingAccount(false)
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col w-full p-8 gap-8">
        <h1 className="text-3xl font-bold text-milk">Settings</h1>

        <section className="flex flex-col gap-4 max-w-sm">
          <h2 className="text-lg font-semibold text-milk">Username</h2>
          <form onSubmit={handleUsernameSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="username" className="text-sm text-milk">Username</label>
              <Input
                id="username"
                required
                minLength={3}
                maxLength={50}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {usernameError && <p className="text-sm text-destructive">{usernameError}</p>}

            <Button type="submit" disabled={isSavingUsername} className="self-start">
              {isSavingUsername ? "Saving..." : "Save"}
            </Button>
          </form>
        </section>

        <section className="flex flex-col gap-4 max-w-sm">
          <h2 className="text-lg font-semibold text-destructive">Danger zone</h2>
          <form onSubmit={handleDeleteSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="delete-password" className="text-sm text-milk">
                Enter your password to delete your account
              </label>
              <Input
                id="delete-password"
                type="password"
                autoComplete="current-password"
                required
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />
            </div>

            {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}

            <Button
              type="submit"
              variant="destructive"
              disabled={isDeletingAccount}
              className="self-start"
            >
              {isDeletingAccount ? "Deleting..." : "Delete account"}
            </Button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default Settings
