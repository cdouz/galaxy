import { useEffect, useState, type ReactNode } from "react"
import { ThemeContext, type Theme } from "./theme-context"

const STORAGE_KEY = "theme"
const THEMES: Theme[] = ["galaxy", "dark", "light"]

function readStoredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  return THEMES.includes(stored as Theme) ? (stored as Theme) : "galaxy"
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readStoredTheme)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme)
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
