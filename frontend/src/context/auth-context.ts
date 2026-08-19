import { createContext } from "react"
import type { LoginPayload, RegisterPayload, User } from "@/lib/auth-api"

export type AuthContextValue = {
  user: User | null
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
  updateUsername: (username: string) => Promise<void>
  deleteAccount: (password: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
