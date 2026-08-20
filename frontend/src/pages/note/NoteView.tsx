import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import NoteVueContainer from "../../components/NoteVueContainer/NoteVueContainer"
import BacklinksPanel from "../../components/BacklinksPanel/BacklinksPanel"
import { Button } from "@/components/ui/button"
import { ApiError } from "@/lib/api"
import { getBacklinks, getNote, type Backlink } from "@/lib/note-api"
import { useUserNotes } from "@/hooks/useUserNotes"

const NoteView = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [backlinks, setBacklinks] = useState<Backlink[]>([])
  const [isLoadingBacklinks, setIsLoadingBacklinks] = useState(true)
  const { notes, isLoading: notesLoading } = useUserNotes()

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

  useEffect(() => {
    if (!id) return
    getBacklinks(Number(id))
      .then(setBacklinks)
      .catch(() => setBacklinks([]))
      .finally(() => setIsLoadingBacklinks(false))
  }, [id])

  return (
    <div className="flex flex-col h-screen p-4">
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-foreground">{title || "Untitled"}</h1>
            <Button variant="outline" onClick={() => navigate(-1)}>
                Back
            </Button>
        </div>
        {isLoading && <p className="text-muted-foreground">Loading note...</p>}
        {error && <p className="text-destructive">{error}</p>}
        {!isLoading && !error && (
          <>
            <NoteVueContainer content={content} notes={notes} notesLoading={notesLoading} onError={setError} />
            <BacklinksPanel backlinks={backlinks} isLoading={isLoadingBacklinks} />
          </>
        )}
    </div>
  )
}

export default NoteView
