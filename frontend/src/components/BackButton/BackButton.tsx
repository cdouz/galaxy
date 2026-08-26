import { ArrowLeft } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"

type BackButtonProps = {
  /** Always land here. Omit to pop the history entry instead. */
  to?: string
  label?: string
}

const BackButton = ({ to, label = "Back" }: BackButtonProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const goBack = () => {
    if (to) return navigate(to)
    // A direct hit on a public page has no history entry to pop back to.
    return location.key === "default" ? navigate("/") : navigate(-1)
  }

  return (
    <button
      onClick={goBack}
      className="fixed left-4 top-4 z-20 flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      <ArrowLeft size={18} />
      {label}
    </button>
  )
}

export default BackButton
