import { Button } from "@/components/ui/button"
import { Globe, Link, Mail } from "lucide-react"

const socials = [
  { label: "GitHub", href: "https://github.com/your-username", icon: Link },
  { label: "LinkedIn", href: "https://linkedin.com/in/your-profile", icon: Globe },
  { label: "Email", href: "mailto:you@example.com", icon: Mail },
]

const About = () => {
  return (
    <div className="flex flex-col items-center gap-6 max-w-xl mx-auto py-16 px-4 text-center">
      <h1 className="text-3xl font-bold">About galaxy...</h1>
      <p className="text-muted-foreground">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
        ea commodo consequat.
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
  )
}

export default About
