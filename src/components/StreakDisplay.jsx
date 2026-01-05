import { Flame } from 'lucide-react'

export function StreakDisplay({ streak, size = 'md' }) {
  const sizes = {
    sm: { container: 'p-2', icon: 16, text: 'text-lg' },
    md: { container: 'p-3', icon: 24, text: 'text-2xl' },
    lg: { container: 'p-4', icon: 32, text: 'text-4xl' }
  }

  const s = sizes[size]

  return (
    <div className={`
      flex items-center gap-2 ${s.container}
      bg-gradient-to-r from-orange-500/20 to-red-500/20
      border border-orange-500/30
      rounded-xl
    `}>
      <Flame 
        size={s.icon} 
        className={`${streak > 0 ? 'text-orange-500 animate-pulse' : 'text-neutral-400'}`} 
      />
      <div>
        <span className={`${s.text} font-bold font-mono ${streak > 0 ? 'text-orange-500' : 'text-neutral-400'}`}>
          {streak}
        </span>
        <span className="text-xs text-gps-muted ml-1">
          {streak === 1 ? 'semana' : 'semanas'}
        </span>
      </div>
    </div>
  )
}

export function StreakBadge({ streak }) {
  if (streak === 0) return null

  return (
    <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-500/20 rounded-full">
      <Flame size={12} className="text-orange-500" />
      <span className="text-xs font-bold text-orange-500">{streak}</span>
    </div>
  )
}
