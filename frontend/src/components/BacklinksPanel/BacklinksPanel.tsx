import { Link } from "react-router-dom"
import type { Backlink } from "@/lib/note-api"

type Props = {
  backlinks: Backlink[]
  isLoading: boolean
}

const BacklinksPanel = ({ backlinks, isLoading }: Props) => {
  return (
    <div className="mt-6">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
        Linked mentions
      </h2>

      {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}

      {!isLoading && backlinks.length === 0 && (
        <p className="text-sm text-muted-foreground">No notes link here yet.</p>
      )}

      {!isLoading && backlinks.length > 0 && (
        <ul className="flex flex-col gap-1 max-w-xl">
          {backlinks.map((backlink) => (
            <li key={backlink.id}>
              <Link
                to={`/note/${backlink.id}/view`}
                className="block rounded-lg px-3 py-2 hover:bg-secondary text-foreground text-sm truncate"
              >
                {backlink.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default BacklinksPanel
