import Markdown, { defaultUrlTransform } from "react-markdown"
import remarkBreaks from "remark-breaks"
import { useNavigate } from "react-router-dom"
import { ApiError } from "@/lib/api"
import { createNote, type Note } from "@/lib/note-api"
import { resolveWikiLinkTitle, transformWikiLinks, WIKILINK_HREF_PREFIX } from "@/lib/wikilinks"
import './NoteVueContainer.css'

type Props = {
  content: string
  notes: Note[]
  notesLoading?: boolean
  onError?: (message: string) => void
  /** Refetches the note list; used to keep link resolution in step with the server. */
  refreshNotes?: () => Promise<Note[]>
}

const NoteVueContainer = ({ content, notes, notesLoading, onError, refreshNotes }: Props) => {
  const navigate = useNavigate()

  const handleWikiLinkClick = async (title: string) => {
    if (notesLoading) return

    const resolved = resolveWikiLinkTitle(title, notes)
    if (resolved) {
      navigate(`/note/${resolved.id}/view`)
      return
    }

    try {
      const created = await createNote({ title, content: "" })
      void refreshNotes?.()
      navigate(`/note/${created.id}`)
    } catch (err) {
      // The list is a snapshot taken when the page mounted. A 409 means the note
      // does exist and only our copy is out of date -- another tab, or a note
      // created earlier in this session -- so re-resolve against the server
      // rather than showing "title already exists" for a link that works.
      if (err instanceof ApiError && err.status === 409 && refreshNotes) {
        const existing = resolveWikiLinkTitle(title, await refreshNotes())
        if (existing) {
          navigate(`/note/${existing.id}/view`)
          return
        }
      }
      onError?.(err instanceof ApiError ? err.message : "Failed to create note")
    }
  }

  const urlTransform = (url: string) =>
    url.startsWith(WIKILINK_HREF_PREFIX) ? url : defaultUrlTransform(url)

  return (
    <div className="nvc p-6 overflow-y-auto prose prose-invert max-w-none">
      <Markdown
        remarkPlugins={[remarkBreaks]}
        urlTransform={urlTransform}
        components={{
          a: ({ href, children, ...props }) => {
            if (!href?.startsWith(WIKILINK_HREF_PREFIX)) {
              return (
                <a {...props} href={href}>
                  {children}
                </a>
              )
            }

            const title = decodeURIComponent(href.slice(WIKILINK_HREF_PREFIX.length))
            const isResolved = Boolean(resolveWikiLinkTitle(title, notes))

            return (
              <a
                {...props}
                href={href}
                className={isResolved ? "wikilink" : "wikilink wikilink-broken"}
                onClick={(e) => {
                  e.preventDefault()
                  handleWikiLinkClick(title)
                }}
              >
                {children}
              </a>
            )
          },
        }}
      >
        {transformWikiLinks(content)}
      </Markdown>
    </div>
  )
}

export default NoteVueContainer
