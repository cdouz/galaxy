import './NoteContentContainer.css'

const NoteContentContainer = () => {
  return (
      <div className="ncc flex-1 border-r border-zinc-700">
        <textarea
          className="w-full h-full resize-none bg-transparent p-6 font-mono text-sm outline-none"
          placeholder="Write markdown here..."
        />
      </div>
  )
}

export default NoteContentContainer