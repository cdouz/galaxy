import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import NoteVueContainer from "../../components/NoteVueContainer/NoteVueContainer"
import { Button } from "@/components/ui/button"
import { ApiError } from "@/lib/api"
import { getNote } from "@/lib/note-api"

const NoteView = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    getNote(Number(id))
      .then((note) => {
        setTitle(note.title)
        setContent(note.content)
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load note"))
      .finally(() => setIsLoading(false))
  }, [id])

  return (
    <div className="flex flex-col h-screen p-4">
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-white">{title || "Untitled"}</h1>
            <Button variant="outline" onClick={() => navigate(-1)}>
                Back
            </Button>
        </div>
        {isLoading && <p className="text-muted-foreground">Loading note...</p>}
        {error && <p className="text-destructive">{error}</p>}
        {!isLoading && !error && <NoteVueContainer content={content} />}
    </div>
  )
}

export default NoteView
