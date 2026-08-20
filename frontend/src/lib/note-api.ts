import { apiFetch } from "./api"

export type Note = {
  id: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export type NotePayload = {
  title: string
  content: string
}

export function listNotes(): Promise<Note[]> {
  return apiFetch<Note[]>("/api/notes")
}

export function getRecentNotes(): Promise<Note[]> {
  return apiFetch<Note[]>("/api/notes/recent")
}

export function getNote(id: number): Promise<Note> {
  return apiFetch<Note>(`/api/notes/${id}`)
}

export function createNote(payload: NotePayload): Promise<Note> {
  return apiFetch<Note>("/api/notes", { method: "POST", body: payload })
}

export function updateNote(id: number, payload: NotePayload): Promise<Note> {
  return apiFetch<Note>(`/api/notes/${id}`, { method: "PUT", body: payload })
}

export function deleteNote(id: number): Promise<void> {
  return apiFetch<void>(`/api/notes/${id}`, { method: "DELETE" })
}
