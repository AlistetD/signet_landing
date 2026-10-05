import { createContext, use, useState, type ReactNode } from 'react'
import { applyDocumentTheme, persistTheme, themeFromDocument, type Theme } from '@/lib/theme'

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function writeTheme(theme: Theme): void {
  applyDocumentTheme(theme)
  persistTheme(theme)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof document === 'undefined') {
      return 'dark'
    }
    return themeFromDocument()
  })

  const setTheme = (next: Theme) => {
    writeTheme(next)
    setThemeState(next)
  }

  const value: ThemeContextValue = {
    theme,
    setTheme,
    toggleTheme: () => {
      setTheme(theme === 'dark' ? 'light' : 'dark')
    },
  }

  return <ThemeContext value={value}>{children}</ThemeContext>
}

export function useTheme(): ThemeContextValue {
  const value = use(ThemeContext)
  if (!value) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return value
}
