import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import NoteContentContainer from "../../components/NoteContentContainer/NoteContentContainer"
import NoteVueContainer from "../../components/NoteVueContainer/NoteVueContainer"
import Sidebar from "../../components/Sidebar/Sidebar"
import './note.css'
import { Button } from "@/components/ui/button"
import { ApiError } from "@/lib/api"
import { createNote, deleteNote, getNote, updateNote } from "@/lib/note-api"
import { useUserNotes } from "@/hooks/useUserNotes"

const NoteEditor = ({ id }: { id?: string }) => {
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [noteId, setNoteId] = useState<number | undefined>(id ? Number(id) : undefined)
  const [isLoading, setIsLoading] = useState(Boolean(id))
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { notes, isLoading: notesLoading } = useUserNotes()

  useEffect(() => {
    if (!id) return
    getNote(Number(id))
      .then((note) => {
        setTitle(note.title)
        setContent(note.content)
        setNoteId(note.id)
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load note"))
      .finally(() => setIsLoading(false))
  }, [id])

  const handleSave = async () => {
    setError(null)
    setIsSaving(true)
    try {
      if (noteId) {
        await updateNote(noteId, { title, content })
      } else {
        const created = await createNote({ title, content })
        setNoteId(created.id)
        navigate(`/note/${created.id}`, { replace: true })
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save note")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!noteId) return
    setError(null)
    try {
      await deleteNote(noteId)
      navigate("/dashboard")
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete note")
    }
  }

  const handleView = () => {
    if (!noteId) return
    navigate(`/note/${noteId}/view`)
  }

  return (
    <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col p-4 w-full">
            <input
                type="text"
                name="title"
                id="title"
                placeholder="Note Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                className="bg-transparent border-none text-4xl font-bold text-foreground placeholder:text-muted-foreground focus:outline-none mb-4"
            />
            {error && <p className="text-destructive mb-4">{error}</p>}
            <div className="note-container flex items-center gap-4 ">
                <NoteContentContainer value={content} onChange={setContent} notes={notes} />
                <NoteVueContainer content={content} notes={notes} notesLoading={notesLoading} onError={setError} />
                <div className="flex flex-col gap-2">
                    <Button variant="default" onClick={handleSave} disabled={isSaving || isLoading || !title.trim()}>
                        {isSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={!noteId}>
                        Delete
                    </Button>
                    <Button variant="outline" onClick={handleView} disabled={!noteId}>
                        View
                    </Button>
                </div>
            </div>
        </div>
    </div>
  )
}

/**
 * `/note/new` and `/note/:id` render the same element, so React would otherwise
 * keep the previous note's state alive across the transition — and "Save" would
 * overwrite the note we just navigated away from. Keying on the route param
 * forces a fresh editor per note.
 */
const Note = () => {
  const { id } = useParams<{ id: string }>()
  return <NoteEditor key={id ?? "new"} id={id} />
}

export default Note
