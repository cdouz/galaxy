import { apiFetch } from "./api"

export type User = {
  id: number
  username: string
  email: string
}

export type RegisterPayload = {
  username: string
  email: string
  password: string
}

export type LoginPayload = {
  email: string
  password: string
}

export function register(payload: RegisterPayload): Promise<User> {
  return apiFetch<User>("/api/auth/register", { method: "POST", body: payload })
}

export function login(payload: LoginPayload): Promise<User> {
  return apiFetch<User>("/api/auth/login", { method: "POST", body: payload })
}

export function logout(): Promise<void> {
  return apiFetch<void>("/api/auth/logout", { method: "POST" })
}

export function me(): Promise<User> {
  return apiFetch<User>("/api/auth/me")
}
