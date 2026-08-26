import './Landing.css'
import { Link } from "react-router-dom"
import { Link2, Search, Waypoints } from "lucide-react"
import Logo from "@/components/Logo/Logo"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Waypoints,
    title: "See the whole map",
    description: "Your notes and their links drawn as one force-directed galaxy.",
  },
  {
    icon: Link2,
    title: "Link as you write",
    description: "Type [[Note]] to connect an idea. Backlinks appear on their own.",
  },
  {
    icon: Search,
    title: "Find any star",
    description: "Full-text search across every note you have ever written.",
  },
]

const Landing = () => {
  return (
    <div className="landing relative flex h-dvh flex-col overflow-hidden">
      <div className="landing-sky" aria-hidden="true" />
      <div className="landing-glow" aria-hidden="true" />

      <header className="relative z-10 mx-auto flex w-full max-w-5xl shrink-0 items-center justify-between px-6 py-4">
        <span className="flex items-center gap-3">
          <Logo className="h-10 w-auto" />
          <span className="jacques-francois text-milk text-3xl leading-none">Galaxy</span>
        </span>
        <Button variant="ghost" size="lg" asChild className="text-milk text-base">
          <Link to="/about">About</Link>
        </Button>
      </header>

      <main className="relative z-10 mx-auto flex w-full min-h-0 max-w-5xl flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <Logo className="landing-mark h-20 w-auto sm:h-24" alt="" />

        <h1 className="jacques-francois text-milk text-4xl leading-tight sm:text-5xl">
          Connect your stars
          <br />
          <span className="italic">Reveal a galaxy</span>
        </h1>

        <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
          Galaxy is a note-taking app where every note is a star and every link a
          constellation. Write, connect, and watch the shape of what you know appear.
        </p>

        <div className="grid w-full max-w-sm grid-cols-1 gap-3 sm:grid-cols-2">
          <Button size="lg" className="w-full" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full" asChild>
            <Link to="/register">Register</Link>
          </Button>
        </div>

        {/* Extra context when there is room for it; the hero alone has to fit 100vh. */}
        <ul className="landing-features mt-2 hidden w-full gap-3 text-left sm:grid sm:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <li key={title} className="landing-card rounded-lg border border-border p-4 transition-colors">
              <Icon className="text-milk" size={18} />
              <h2 className="text-milk mt-2 text-sm font-semibold">{title}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            </li>
          ))}
        </ul>
      </main>

      <footer className="relative z-10 shrink-0 border-t border-border/60 py-3 text-center text-xs text-muted-foreground">
        Galaxy — built by{" "}
        <Link to="/about" className="text-milk underline underline-offset-4">
          cdouz
        </Link>
      </footer>
    </div>
  )
}

export default Landing
