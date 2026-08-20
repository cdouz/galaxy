import type { Note } from "./note-api"

const WIKILINK_PATTERN = /\[\[([^[\]]+)\]\]/g
export const WIKILINK_HREF_PREFIX = "wikilink:"

/**
 * Turns `[[Title]]` into a normal markdown link (`[Title](wikilink:Title)`)
 * so react-markdown can render it; the `wikilink:` scheme is intercepted by
 * a custom `a` component instead of being treated as a real URL.
 */
export function transformWikiLinks(content: string): string {
  return content.replace(WIKILINK_PATTERN, (_match, rawTitle: string) => {
    const title = rawTitle.trim()
    return `[${title}](${WIKILINK_HREF_PREFIX}${encodeURIComponent(title)})`
  })
}

export function resolveWikiLinkTitle(title: string, notes: Note[]): Note | undefined {
  const lower = title.toLowerCase()
  return notes.find((note) => note.title.toLowerCase() === lower)
}
