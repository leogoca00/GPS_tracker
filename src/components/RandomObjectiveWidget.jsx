import { useState, useEffect } from 'react'
import { RefreshCw, Target } from 'lucide-react'
import { Card } from './ui/Card'

export function RandomObjectiveWidget({ objectives }) {
  const [objective, setObjective] = useState(null)
  const [isSpinning, setIsSpinning] = useState(false)

  const pickRandom = () => {
    if (objectives.length === 0) return
    setIsSpinning(true)
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * objectives.length)
      setObjective(objectives[randomIndex])
      setIsSpinning(false)
    }, 300)
  }

  useEffect(() => {
    // Pick one on mount based on the day (consistent per day)
    if (objectives.length > 0 && !objective) {
      const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
      const index = dayOfYear % objectives.length
      setObjective(objectives[index])
    }
  }, [objectives])

  if (!objective) return null

  return (
    <Card className="bg-gradient-to-br from-gps-accent/10 to-transparent border-gps-accent/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gps-accent/20 flex items-center justify-center flex-shrink-0">
            <Target size={20} className="text-gps-accent" />
          </div>
          <div>
            <p className="text-xs text-gps-muted mb-1">Objetivo del día</p>
            <p className="font-semibold text-sm leading-tight">{objective.title}</p>
            <p className="text-xs text-gps-muted mt-1">
              {objective.current_progress}/{objective.target_value} {objective.target_metric}
            </p>
          </div>
        </div>
        <button
          onClick={pickRandom}
          disabled={isSpinning}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <RefreshCw 
            size={16} 
            className={`text-gps-muted ${isSpinning ? 'animate-spin' : ''}`} 
          />
        </button>
      </div>
    </Card>
  )
}
