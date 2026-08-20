import { useMemo, useState } from "react"
import type { Note } from "@/lib/note-api"

const MAX_SUGGESTIONS = 8

type Trigger = {
  triggerStart: number
  query: string
}

function findOpenTrigger(value: string, cursorPos: number): Trigger | null {
  const uptoCursor = value.slice(0, cursorPos)
  const lastOpen = uptoCursor.lastIndexOf("[[")
  if (lastOpen === -1) return null

  const between = uptoCursor.slice(lastOpen + 2)
  if (between.includes("]]") || between.includes("\n")) return null

  return { triggerStart: lastOpen + 2, query: between }
}

export function useWikiLinkAutocomplete(notes: Note[]) {
  const [trigger, setTrigger] = useState<Trigger | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const suggestions = useMemo(() => {
    if (!trigger) return []
    const query = trigger.query.trim().toLowerCase()
    const matches = query ? notes.filter((note) => note.title.toLowerCase().includes(query)) : notes
    return matches.slice(0, MAX_SUGGESTIONS)
  }, [trigger, notes])

  const isOpen = trigger !== null && suggestions.length > 0

  const handleSelectionChange = (value: string, cursorPos: number) => {
    setTrigger(findOpenTrigger(value, cursorPos))
    setSelectedIndex(0)
  }

  const close = () => setTrigger(null)

  const moveSelection = (delta: number) => {
    if (suggestions.length === 0) return
    setSelectedIndex((prev) => (prev + delta + suggestions.length) % suggestions.length)
  }

  const commit = (note: Note, value: string, cursorPos: number): { value: string; caretIndex: number } => {
    if (!trigger) return { value, caretIndex: cursorPos }

    const insertion = `${note.title}]]`
    const before = value.slice(0, trigger.triggerStart)
    const after = value.slice(cursorPos)

    setTrigger(null)

    return {
      value: `${before}${insertion}${after}`,
      caretIndex: trigger.triggerStart + insertion.length,
    }
  }

  return {
    isOpen,
    suggestions,
    selectedIndex,
    handleSelectionChange,
    moveSelection,
    commit,
    close,
  }
}
