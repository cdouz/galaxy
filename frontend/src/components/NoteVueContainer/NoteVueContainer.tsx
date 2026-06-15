import Markdown from "react-markdown"
import remarkBreaks from "remark-breaks"
import './NoteVueContainer.css'

type Props = {
  content: string
}

const NoteVueContainer = ({ content }: Props) => {
  return (
    <div className="nvc p-6 overflow-y-auto prose prose-invert max-w-none">
      <Markdown remarkPlugins={[remarkBreaks]}>{content}</Markdown>
    </div>
  )
}

export default NoteVueContainer