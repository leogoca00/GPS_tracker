import { Check } from 'lucide-react'
import { Card } from './ui/Card'
import { WEEKLY_BLOCKS } from '../hooks/useWeeklyReviews'

export function WeeklyChecklist({ review, onToggle, weekNumber }) {
  const doneCount = WEEKLY_BLOCKS.filter(b => review?.[b.key]).length
  
  const getStatus = () => {
    if (doneCount >= 5) return { color: 'green', label: 'Semana perfecta' }
    if (doneCount >= 3) return { color: 'yellow', label: 'Semana válida' }
    return { color: 'red', label: 'Por debajo del mínimo' }
  }

  const status = getStatus()

  const colorClasses = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    gray: 'bg-gray-500'
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">Semana {weekNumber}</h3>
          <p className={`text-sm ${
            status.color === 'green' ? 'text-green-500' :
            status.color === 'yellow' ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {status.label} ({doneCount}/5)
          </p>
        </div>
        <div className={`
          w-12 h-12 rounded-full flex items-center justify-center
          text-xl font-bold
          ${status.color === 'green' ? 'bg-green-500/20 text-green-500' :
            status.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-500' : 
            'bg-red-500/20 text-red-500'}
        `}>
          {doneCount}
        </div>
      </div>

      <div className="space-y-2">
        {WEEKLY_BLOCKS.map(block => {
          const isDone = review?.[block.key] || false
          return (
            <button
              key={block.key}
              onClick={() => onToggle(block.key, !isDone)}
              className={`
                w-full flex items-center justify-between p-3 rounded-lg
                transition-all duration-200 btn-press
                ${isDone 
                  ? 'bg-green-500/10 border border-green-500/30' 
                  : 'bg-neutral-100 dark:bg-neutral-800 border border-transparent'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center text-white
                  ${isDone ? 'bg-green-500' : colorClasses[block.color]}
                `}>
                  {isDone ? <Check size={16} /> : <span>{block.icon}</span>}
                </div>
                <span className={`font-medium ${isDone ? 'text-green-600 dark:text-green-400' : ''}`}>
                  {block.label}
                </span>
              </div>
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center
                transition-colors duration-200
                ${isDone 
                  ? 'bg-green-500 border-green-500' 
                  : 'border-neutral-300 dark:border-neutral-600'
                }
              `}>
                {isDone && <Check size={12} className="text-white" />}
              </div>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
