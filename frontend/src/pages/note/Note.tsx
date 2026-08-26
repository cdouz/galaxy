import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Eye, Save, Trash2 } from "lucide-react"
import NoteContentContainer from "@/components/NoteContentContainer/NoteContentContainer"
import NoteVueContainer from "@/components/NoteVueContainer/NoteVueContainer"
import Sidebar from "@/components/Sidebar/Sidebar"
import { Button } from "@/components/ui/button"
import { ApiError } from "@/lib/api"
import { createNote, deleteNote, getNote, updateNote } from "@/lib/note-api"
import { useUserNotes } from "@/hooks/useUserNotes"

const EMPTY_DRAFT = { title: "", content: "" }

const NoteEditor = ({ id }: { id?: string }) => {
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [saved, setSaved] = useState(EMPTY_DRAFT)
  const [noteId, setNoteId] = useState<number | undefined>(id ? Number(id) : undefined)
  const [isLoading, setIsLoading] = useState(Boolean(id))
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { notes, isLoading: notesLoading, refresh: refreshNotes } = useUserNotes()

  const isDirty = title !== saved.title || content !== saved.content

  useEffect(() => {
    if (!id) return
    getNote(Number(id))
      .then((note) => {
        setTitle(note.title)
        setContent(note.content)
        setSaved({ title: note.title, content: note.content })
        setNoteId(note.id)
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load note"))
      .finally(() => setIsLoading(false))
  }, [id])

  // Closing or reloading the tab with unsaved text hands the draft back to the
  // browser's own confirmation prompt.
  useEffect(() => {
    if (!isDirty) return

    const warn = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [isDirty])

  /** Wikilinks navigate away from the editor; an unsaved draft must not vanish silently. */
  const confirmNavigation = () =>
    !isDirty || window.confirm("This note has unsaved changes. Leave without saving?")

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
      setSaved({ title, content })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save note")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!noteId) return
    if (!window.confirm(`Delete "${title || "this note"}"? This cannot be undone.`)) return

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
    if (!confirmNavigation()) return
    navigate(`/note/${noteId}/view`)
  }

  const status = isDirty ? "Unsaved changes" : noteId ? "All changes saved" : "New note"

  return (
    <div className="flex h-screen overflow-hidden">
        <Sidebar />
        {/* Scrolls as one column on phones; on desktop only the panels scroll. */}
        <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto p-4 lg:overflow-hidden lg:p-6">
            <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                <div className="flex min-w-0 flex-col">
                    <input
                        type="text"
                        name="title"
                        id="title"
                        placeholder="Note Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isLoading}
                        className="w-full bg-transparent border-none text-3xl font-bold text-foreground placeholder:text-muted-foreground focus:outline-none md:text-4xl"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">{status}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <Button size="lg" onClick={handleSave} disabled={isSaving || isLoading || !title.trim()} className="flex-1 px-5 lg:flex-none lg:px-8">
                        <Save />
                        {isSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button size="lg" variant="outline" onClick={handleView} disabled={!noteId} className="flex-1 px-5 lg:flex-none lg:px-8">
                        <Eye />
                        View
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={handleDelete}
                        disabled={!noteId}
                        className="flex-1 px-5 text-destructive hover:bg-destructive hover:text-destructive-foreground lg:flex-none lg:px-8"
                    >
                        <Trash2 />
                        Delete
                    </Button>
                </div>
            </header>
            {error && <p className="text-destructive">{error}</p>}
            {/* Stacked on phones -- editor first, preview under it -- side by side from md up. */}
            <div className="flex min-h-0 flex-1 flex-col gap-4 md:flex-row">
                <NoteContentContainer
                    value={content}
                    onChange={setContent}
                    notes={notes}
                    className="min-h-[45vh] md:min-h-0 md:w-1/2"
                />
                <NoteVueContainer
                    content={content}
                    notes={notes}
                    notesLoading={notesLoading}
                    onError={setError}
                    refreshNotes={refreshNotes}
                    confirmNavigation={confirmNavigation}
                    className="min-h-[45vh] md:min-h-0 md:w-1/2"
                />
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
