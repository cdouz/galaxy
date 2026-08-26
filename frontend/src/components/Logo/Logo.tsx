import blueLogo from "@/assets/blue-logo.svg"
import whiteLogo from "@/assets/white-logo.png"
import { useTheme } from "@/hooks/useTheme"
import { cn } from "@/lib/utils"

type LogoProps = {
  /**
   * "auto" follows the page background (blue mark on light, white elsewhere).
   * "on-primary" is for surfaces painted with --primary, such as the sidebar:
   * that token is a near-white in the dark theme and dark in the other two, so
   * the mark inverts relative to "auto" there.
   */
  tone?: "auto" | "white" | "blue" | "on-primary"
  className?: string
  alt?: string
}

const Logo = ({ tone = "auto", className, alt = "Galaxy" }: LogoProps) => {
  const { theme } = useTheme()
  const useBlue =
    tone === "blue" ||
    (tone === "auto" && theme === "light") ||
    (tone === "on-primary" && theme === "dark")

  return (
    <img
      src={useBlue ? blueLogo : whiteLogo}
      alt={alt}
      draggable={false}
      className={cn("shrink-0 select-none object-contain", className)}
    />
  )
}

export default Logo
