import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export function Header({ title, subtitle }) {
  const { isDark, toggle } = useTheme()

  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gps-muted mt-0.5">{subtitle}</p>
        )}
      </div>
      <button
        onClick={toggle}
        className="
          p-2.5 rounded-xl
          bg-neutral-100 dark:bg-neutral-800
          hover:bg-neutral-200 dark:hover:bg-neutral-700
          transition-colors duration-200
          btn-press
        "
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  )
}
