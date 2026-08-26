import './Landing.css'
import { Link } from "react-router-dom"
import { Link2, Search, Waypoints } from "lucide-react"
import Logo from "@/components/Logo/Logo"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Waypoints,
    title: "See the whole map",
    description: "Your notes and their links drawn as one force-directed galaxy you can explore.",
  },
  {
    icon: Link2,
    title: "Link as you write",
    description: "Type [[Note]] to connect an idea to another. Backlinks appear on their own.",
  },
  {
    icon: Search,
    title: "Find any star",
    description: "Full-text search across every note, so nothing you wrote gets lost in space.",
  },
]

const Landing = () => {
  return (
    <div className="landing relative min-h-screen overflow-hidden">
      <div className="landing-sky" aria-hidden="true" />
      <div className="landing-glow" aria-hidden="true" />

      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <span className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          <span className="jacques-francois text-milk text-xl">Galaxy</span>
        </span>
        <Button variant="ghost" size="sm" asChild className="text-milk">
          <Link to="/about">About</Link>
        </Button>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 pb-24 text-center">
        <Logo className="landing-mark h-28 w-28 sm:h-36 sm:w-36" alt="" />

        <h1 className="jacques-francois text-milk mt-6 text-4xl leading-tight sm:text-6xl">
          Connect your stars
          <br />
          Reveal a galaxy
        </h1>

        <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
          Galaxy is a note-taking app where every note is a star and every link a
          constellation. Write, connect, and watch the shape of what you know appear.
        </p>

        <div className="mt-10 grid w-full max-w-sm grid-cols-1 gap-3 sm:grid-cols-2">
          <Button size="lg" className="w-full" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full" asChild>
            <Link to="/register">Register</Link>
          </Button>
        </div>

        <ul className="mt-20 grid w-full gap-4 text-left sm:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="landing-card rounded-lg border border-border p-5 transition-colors"
            >
              <Icon className="text-milk" size={20} />
              <h2 className="text-milk mt-3 font-semibold">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </li>
          ))}
        </ul>
      </main>

      <footer className="relative z-10 border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        Galaxy — built by{" "}
        <Link to="/about" className="text-milk underline underline-offset-4">
          cdouz
        </Link>
      </footer>
    </div>
  )
}

export default Landing
