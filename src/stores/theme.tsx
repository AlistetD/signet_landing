import { createContext, use, useEffect, useState, type ReactNode } from 'react'
import {
  applyDocumentTheme,
  isStoredTheme,
  persistTheme,
  readStoredTheme,
  resolveTheme,
  themeFromDocument,
  type Theme,
} from '@/lib/theme'

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof document === 'undefined') {
      return 'light'
    }
    return themeFromDocument()
  })
  const [followsSystem, setFollowsSystem] = useState(() => {
    if (typeof window === 'undefined') {
      return true
    }
    return !isStoredTheme(readStoredTheme())
  })

  const setTheme = (next: Theme) => {
    applyDocumentTheme(next)
    persistTheme(next)
    setFollowsSystem(false)
    setThemeState(next)
  }

  useEffect(() => {
    if (!followsSystem) {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const sync = () => {
      const next = resolveTheme(null, media.matches)
      applyDocumentTheme(next)
      setThemeState(next)
    }

    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [followsSystem])

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
