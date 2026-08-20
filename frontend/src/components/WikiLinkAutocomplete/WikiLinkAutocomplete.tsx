import type { Note } from "@/lib/note-api"
import { cn } from "@/lib/utils"

type Props = {
  suggestions: Note[]
  selectedIndex: number
  position: { top: number; left: number }
  onSelect: (note: Note) => void
}

const WikiLinkAutocomplete = ({ suggestions, selectedIndex, position, onSelect }: Props) => {
  return (
    <ul
      className="fixed z-50 w-64 max-h-56 overflow-y-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md py-1"
      style={{ top: position.top, left: position.left }}
    >
      {suggestions.length === 0 && (
        <li className="px-3 py-1.5 text-sm text-muted-foreground">No notes found</li>
      )}
      {suggestions.map((note, index) => (
        <li key={note.id}>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault()
              onSelect(note)
            }}
            className={cn(
              "w-full text-left px-3 py-1.5 text-sm truncate",
              index === selectedIndex ? "bg-[hsl(var(--secondary))]" : "hover:bg-[hsl(var(--secondary))]"
            )}
          >
            {note.title}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default WikiLinkAutocomplete
