import { useState } from "react"
import NoteContentContainer from "../../components/NoteContentContainer/NoteContentContainer"
import NoteVueContainer from "../../components/NoteVueContainer/NoteVueContainer"
import Sidebar from "../../components/Sidebar/Sidebar"
import './note.css'

const Note = () => {
  const [content, setContent] = useState("")

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="note-container flex justify-center items-center gap-4 w-full">
        <NoteContentContainer value={content} onChange={setContent} />
        <NoteVueContainer content={content} />
      </div>
    </div>
  )
}

export default Note
