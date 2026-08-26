import blueLogo from "@/assets/blue-logo.svg"
import whiteLogo from "@/assets/white-logo.png"
import { useTheme } from "@/hooks/useTheme"
import { cn } from "@/lib/utils"

type LogoProps = {
  /**
   * "auto" follows the active theme (blue mark on light, white mark elsewhere).
   * Force a tone when the surface colour does not follow the theme, e.g. the
   * sidebar, which stays dark in every theme.
   */
  tone?: "auto" | "white" | "blue"
  className?: string
  alt?: string
}

const Logo = ({ tone = "auto", className, alt = "Galaxy" }: LogoProps) => {
  const { theme } = useTheme()
  const useBlue = tone === "blue" || (tone === "auto" && theme === "light")

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
