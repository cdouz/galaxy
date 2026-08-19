import './NoteContentContainer.css'

type Props = {
  value: string
  onChange: (value: string) => void
}

const NoteContentContainer = ({ value, onChange }: Props) => {
  return (
      <div className="ncc border-r border-border">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full resize-none bg-transparent p-6 font-mono text-sm outline-none"
          placeholder="Write markdown here..."
        />
      </div>
  )
}

export default NoteContentContainer