import { apiFetch } from "./api"
import type { Note } from "./note-api"

export type DashboardStats = {
  noteCount: number
  linkCount: number
  recentNotes: Note[]
}

export function getDashboardStats(): Promise<DashboardStats> {
  return apiFetch<DashboardStats>("/api/dashboard/stats")
}
