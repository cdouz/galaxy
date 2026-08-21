import { useRef, useState } from "react"
import WikiLinkAutocomplete from "@/components/WikiLinkAutocomplete/WikiLinkAutocomplete"
import { useWikiLinkAutocomplete } from "@/hooks/useWikiLinkAutocomplete"
import { getCaretCoordinates, type CaretCoordinates } from "@/lib/caret-position"
import type { Note } from "@/lib/note-api"
import './NoteContentContainer.css'

type Props = {
  value: string
  onChange: (value: string) => void
  notes: Note[]
}

const NoteContentContainer = ({ value, onChange, notes }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [caretCoordinates, setCaretCoordinates] = useState<CaretCoordinates | null>(null)
  const { isOpen, suggestions, selectedIndex, handleSelectionChange, moveSelection, commit, close } =
    useWikiLinkAutocomplete(notes)

  // Measuring the caret mounts a throwaway mirror element, so it happens here in
  // the event that moved the caret -- never while rendering -- and only while the
  // suggestion list is actually open.
  const syncSelection = (target: HTMLTextAreaElement) => {
    const opened = handleSelectionChange(target.value, target.selectionStart)
    setCaretCoordinates(opened ? getCaretCoordinates(target, target.selectionStart) : null)
  }

  const handleSelect = (note: Note) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const { value: newValue, caretIndex } = commit(note, textarea.value, textarea.selectionStart)
    onChange(newValue)

    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(caretIndex, caretIndex)
    })
  }

  const dismiss = () => {
    close()
    setCaretCoordinates(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isOpen) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      moveSelection(1)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      moveSelection(-1)
    } else if (e.key === "Enter") {
      e.preventDefault()
      const note = suggestions[selectedIndex]
      if (note) handleSelect(note)
    } else if (e.key === "Escape") {
      e.preventDefault()
      dismiss()
    }
  }

  return (
      <div className="ncc border-r border-border relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            syncSelection(e.target)
          }}
          onKeyDown={handleKeyDown}
          onKeyUp={(e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") syncSelection(e.currentTarget)
          }}
          onClick={(e) => syncSelection(e.currentTarget)}
          onBlur={dismiss}
          className="w-full h-full resize-none bg-transparent p-6 font-mono text-sm outline-none"
          placeholder="Write markdown here..."
        />
        {isOpen && caretCoordinates && (
          <WikiLinkAutocomplete
            suggestions={suggestions}
            selectedIndex={selectedIndex}
            position={{ top: caretCoordinates.top + caretCoordinates.height, left: caretCoordinates.left }}
            onSelect={handleSelect}
          />
        )}
      </div>
  )
}

export default NoteContentContainer
