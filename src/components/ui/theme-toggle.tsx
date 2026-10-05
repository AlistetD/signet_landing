import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/stores/theme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const next = theme === 'dark' ? 'светлую' : 'тёмную'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="glass inline-flex size-11 shrink-0 items-center justify-center rounded-full text-fg select-none"
      aria-label={`Включить ${next} тему`}
      aria-pressed={theme === 'dark'}
    >
      {theme === 'dark' ? (
        <Sun className="size-5" aria-hidden="true" strokeWidth={1.75} />
      ) : (
        <Moon className="size-5" aria-hidden="true" strokeWidth={1.75} />
      )}
    </button>
  )
}
