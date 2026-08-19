import { useEffect, useState, type ReactNode } from "react"
import * as authApi from "@/lib/auth-api"
import type { LoginPayload, RegisterPayload, User } from "@/lib/auth-api"
import { AuthContext } from "./auth-context"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    authApi
      .me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (payload: LoginPayload) => {
    setUser(await authApi.login(payload))
  }

  const register = async (payload: RegisterPayload) => {
    setUser(await authApi.register(payload))
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      setUser(null)
    }
  }

  const updateUsername = async (username: string) => {
    setUser(await authApi.updateUsername(username))
  }

  const deleteAccount = async (password: string) => {
    try {
      await authApi.deleteAccount(password)
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUsername, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  )
}
