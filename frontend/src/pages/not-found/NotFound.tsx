import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

const NotFound = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="jacques-francois text-milk text-4xl">Lost in space</h1>
      <p className="text-muted-foreground max-w-md">
        This page is not part of your galaxy. It may have been deleted, or the link may be wrong.
      </p>
      <Button asChild>
        <Link to="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  )
}

export default NotFound
