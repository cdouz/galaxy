import { useState } from "react"
import { useNavigate } from "react-router-dom"
import NoteContentContainer from "../../components/NoteContentContainer/NoteContentContainer"
import NoteVueContainer from "../../components/NoteVueContainer/NoteVueContainer"
import Sidebar from "../../components/Sidebar/Sidebar"
import './note.css'
import { Button } from "@/components/ui/button"

const Note = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const navigate = useNavigate()

    const saveNote = () => {

        console.log("Saving note:", content)
    }

    const deleteNote = () => {
        // Implement the logic to delete the note
        console.log("Deleting note")
    }

    const viewNote = () => {
        navigate("/note/view", { state: { title, content } })
    }
  return (
    <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col p-4 w-full">
            <input
                type="text"
                name="title"
                id="title"
                placeholder="Note Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent border-none text-4xl font-bold text-white placeholder:text-gray-500 focus:outline-none mb-4"
            />
            <div className="note-container flex items-center gap-4 ">
                <NoteContentContainer value={content} onChange={setContent} />
                <NoteVueContainer content={content} />
                <div className="flex flex-col gap-2">
                    <Button variant="default" onClick={saveNote}>
                        Save
                    </Button>
                    <Button variant="destructive" onClick={deleteNote}>
                        Delete
                    </Button>
                    <Button variant="outline" onClick={viewNote}>
                        View
                    </Button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Note
