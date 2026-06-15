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
        <div className="flex flex-col p-4 w-full">
            <textarea name="title" id="title" placeholder="Note Title" className="bg-transparent border border-gray-600 text-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            <div className="note-container flex items-center gap-4 ">
                <NoteContentContainer value={content} onChange={setContent} />
                <NoteVueContainer content={content} />
                        <div>
            <button>Save Note</button>
            <button>Delete Note</button>
        </div> 
            </div>
        </div>

    

    </div>
  )
}

export default Note
