import { useLocation, useNavigate } from "react-router-dom"
import NoteVueContainer from "../../components/NoteVueContainer/NoteVueContainer"
import { Button } from "@/components/ui/button"

type LocationState = {
  title?: string
  content?: string
}

const NoteView = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { title = "", content = "" } = (state as LocationState) ?? {}

  return (
    <div className="flex flex-col h-screen p-4">
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-white">{title || "Untitled"}</h1>
            <Button variant="outline" onClick={() => navigate(-1)}>
                Back
            </Button>
        </div>
        <NoteVueContainer content={content} />
    </div>
  )
}

export default NoteView
