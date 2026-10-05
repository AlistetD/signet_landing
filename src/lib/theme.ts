export const THEME_STORAGE_KEY = 'signet-theme'

export type Theme = 'light' | 'dark'

/** Plasma tint: Signet red on dark, cool gray steam on light. */
export const PLASMA_TINT: Record<Theme, string> = {
  light: '#6a6e74',
  dark: '#e60000',
}

export function isStoredTheme(stored: string | null): stored is Theme {
  return stored === 'light' || stored === 'dark'
}

export function resolveTheme(stored: string | null, prefersDark: boolean): Theme {
  if (isStoredTheme(stored)) {
    return stored
  }
  return prefersDark ? 'dark' : 'light'
}

export function readStoredTheme(): string | null {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY)
  } catch {
    return null
  }
}

export function persistTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Private mode can block storage; the session still themed via the document class.
  }
}

export function applyDocumentTheme(theme: Theme): void {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
  const color = theme === 'dark' ? '#000000' : '#f2f2f2'
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute('content', color)
  })
}

export function themeFromDocument(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}
