import { useEffect, useState } from "react"
import { ApiError } from "@/lib/api"
import { listNotes, type Note } from "@/lib/note-api"

export function useUserNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listNotes()
      .then(setNotes)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load notes"))
      .finally(() => setIsLoading(false))
  }, [])

  return { notes, isLoading, error }
}
