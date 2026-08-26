import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, Pencil } from "lucide-react"
import NoteVueContainer from "@/components/NoteVueContainer/NoteVueContainer"
import BacklinksPanel from "@/components/BacklinksPanel/BacklinksPanel"
import { Button } from "@/components/ui/button"
import { ApiError } from "@/lib/api"
import { getBacklinks, getNote, type Backlink } from "@/lib/note-api"
import { useUserNotes } from "@/hooks/useUserNotes"

const NoteView = () => {
  const { id } = useParams<{ id: string }>()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [backlinks, setBacklinks] = useState<Backlink[]>([])
  const [isLoadingBacklinks, setIsLoadingBacklinks] = useState(true)
  const { notes, isLoading: notesLoading, refresh: refreshNotes } = useUserNotes()

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
    <div className="flex h-screen flex-col gap-4 overflow-y-auto p-4 md:p-6">
        <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <h1 className="min-w-0 break-words text-3xl font-bold text-foreground md:text-4xl">{title || "Untitled"}</h1>
            <div className="flex shrink-0 items-center gap-2">
                <Button size="lg" variant="outline" asChild className="flex-1 px-5 lg:flex-none lg:px-8">
                    <Link to="/dashboard">
                        <ArrowLeft />
                        Dashboard
                    </Link>
                </Button>
                {id && !error && (
                    <Button size="lg" asChild className="flex-1 px-5 lg:flex-none lg:px-8">
                        <Link to={`/note/${id}`}>
                            <Pencil />
                            Edit
                        </Link>
                    </Button>
                )}
            </div>
        </header>
        {isLoading && <p className="text-muted-foreground">Loading note...</p>}
        {error && <p className="text-destructive">{error}</p>}
        {!isLoading && !error && (
          <>
            <NoteVueContainer
              content={content}
              notes={notes}
              notesLoading={notesLoading}
              onError={setError}
              refreshNotes={refreshNotes}
              className="min-h-[45vh] flex-1"
            />
            <BacklinksPanel backlinks={backlinks} isLoading={isLoadingBacklinks} />
          </>
        )}
    </div>
  )
}

export default NoteView
