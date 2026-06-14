import NoteContentContainer from "../../components/NoteContentContainer/NoteContentContainer"
import NoteVueContainer from "../../components/NoteVueContainer/NoteVueContainer"
import Sidebar from "../../components/Sidebar/Sidebar"
import './note.css'

const Note = () => {
  return (
    <div className="flex h-screen bg-zinc-800">
      <Sidebar />
      <div className="note-container flex justify-center items-center gap-4 flex-1">
        <NoteContentContainer />
        <NoteVueContainer />
      </div>
    </div>
  )
}

export default Note
