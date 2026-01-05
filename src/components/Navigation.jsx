import { NavLink } from 'react-router-dom'
import { Home, Target, Timer, FolderKanban, FileText, BookOpen } from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: 'Inicio' },
  { to: '/objectives', icon: Target, label: 'Objetivos' },
  { to: '/sessions', icon: Timer, label: 'Sesiones' },
  { to: '/projects', icon: FolderKanban, label: 'Proyectos' },
  { to: '/notes', icon: FileText, label: 'Notas' },
  { to: '/books', icon: BookOpen, label: 'Libros' },
]

export function Navigation() {
  return (
    <nav className="
      fixed bottom-0 left-0 right-0 z-40
      bg-white/80 dark:bg-neutral-900/80
      backdrop-blur-lg
      border-t border-neutral-200 dark:border-neutral-800
      pb-safe
    ">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
              flex flex-col items-center justify-center
              w-14 h-full
              transition-colors duration-200
              ${isActive 
                ? 'text-gps-accent' 
                : 'text-gps-muted hover:text-gps-dark dark:hover:text-gps-light'
              }
            `}
          >
            <Icon size={20} strokeWidth={1.5} />
            <span className="text-[9px] mt-0.5 font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
