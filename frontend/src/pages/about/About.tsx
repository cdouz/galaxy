import Sidebar from "@/components/Sidebar/Sidebar"
import { Button } from "@/components/ui/button"
import { Globe, Link, Mail } from "lucide-react"

const socials = [
  { label: "GitHub", href: "https://github.com/cdouz", icon: Link },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/clotaire-douziech-a34553277/", icon: Globe },
  { label: "Email", href: "mailto:clotaire@cdouz.com", icon: Mail },
]

const About = () => {
  return (
    <div className="flex h-screen">
        <Sidebar/>
        <div className="flex flex-col items-center gap-6 max-w-xl mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-bold text-milk">About <span className="jacques-francois italic">Galaxy...</span></h1>
        <p className="text-muted-foreground">
            Galaxy is a note-taking application that allows you to create, edit, and visualize your notes in a unique way.
            <br/>Developped by <span className="text-milk ">Clotaire Douziech (alias cdouz)</span>, links below.  
        </p>
        <div className="flex gap-4">
            {socials.map(({ label, href, icon: Icon }) => (
            <Button key={label} variant="outline" size="icon" asChild>
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                <Icon />
                </a>
            </Button>
            ))}
        </div>
        </div>
    </div>

  )
}

export default About
