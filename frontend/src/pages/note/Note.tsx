import { useState } from "react"
import NoteContentContainer from "../../components/NoteContentContainer/NoteContentContainer"
import NoteVueContainer from "../../components/NoteVueContainer/NoteVueContainer"
import Sidebar from "../../components/Sidebar/Sidebar"
import './note.css'
import { Button } from "@/components/ui/button"

const Note = () => {
  const [content, setContent] = useState("")
    const saveNote = () => {

        console.log("Saving note:", content)
    }

    const deleteNote = () => {
        // Implement the logic to delete the note
        console.log("Deleting note")
    }
  return (
    <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col p-4 w-full">
            <textarea name="title" id="title" placeholder="Note Title" className="bg-transparent border border-gray-600 text-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            <div className="note-container flex items-center gap-4 ">
                <NoteContentContainer value={content} onChange={setContent} />
                <NoteVueContainer content={content} />
                <div className="flex flex-col gap-2">
                    <Button variant="default" onClick={saveNote}>
                        Save Note
                    </Button>
                    <Button variant="destructive" onClick={deleteNote}>
                        Delete Note
                    </Button>
                </div> 
            </div>
        </div>
    </div>
  )
}

export default Note
