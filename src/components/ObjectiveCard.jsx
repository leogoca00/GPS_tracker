import { useState } from 'react'
import { ChevronRight, Plus, Minus } from 'lucide-react'
import { Card } from './ui/Card'
import { ProgressBar } from './ui/ProgressBar'
import { Button } from './ui/Button'

export function ObjectiveCard({ objective, onUpdateProgress, expanded = false }) {
  const [isExpanded, setIsExpanded] = useState(expanded)
  const percentage = Math.round((objective.current_progress / objective.target_value) * 100)
  
  const getProgressColor = () => {
    if (percentage >= 80) return 'green'
    if (percentage >= 50) return 'yellow'
    return 'red'
  }

  const handleIncrement = (e) => {
    e.stopPropagation()
    onUpdateProgress(objective.id, objective.current_progress + 1)
  }

  const handleDecrement = (e) => {
    e.stopPropagation()
    if (objective.current_progress > 0) {
      onUpdateProgress(objective.id, objective.current_progress - 1)
    }
  }

  return (
    <Card 
      className="animate-fade-in"
      hover
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base leading-tight mb-2 pr-2">
            {objective.title}
          </h3>
          <ProgressBar 
            value={objective.current_progress} 
            max={objective.target_value}
            color={getProgressColor()}
            size="sm"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gps-muted">
              {objective.current_progress} / {objective.target_value} {objective.target_metric}
            </span>
            <span className={`text-xs font-mono font-semibold ${
              percentage >= 80 ? 'text-green-500' :
              percentage >= 50 ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {percentage}%
            </span>
          </div>
        </div>
        <ChevronRight 
          size={18} 
          className={`text-gps-muted mt-1 transition-transform duration-200 ${
            isExpanded ? 'rotate-90' : ''
          }`}
        />
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 animate-fade-in">
          <p className="text-sm text-gps-muted mb-4">
            {objective.description}
          </p>
          
          <div className="flex items-center justify-center gap-3">
            <Button 
              variant="secondary" 
              size="icon"
              onClick={handleDecrement}
              disabled={objective.current_progress === 0}
            >
              <Minus size={18} />
            </Button>
            <span className="font-mono text-2xl font-bold min-w-[60px] text-center">
              {objective.current_progress}
            </span>
            <Button 
              variant="primary" 
              size="icon"
              onClick={handleIncrement}
            >
              <Plus size={18} />
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
