import { Card } from './ui/Card'
import { StatusDot } from './ui/Badge'

export function WeekStatusWidget({ sessions = [], className = '' }) {
  // Calculate which blocks are done this week
  const blocksDone = {
    estudio: sessions.some(s => s.block_type === 'estudio'),
    proyecto: sessions.some(s => s.block_type === 'proyecto'),
    documentacion: sessions.some(s => s.block_type === 'documentacion'),
    visibilidad: sessions.some(s => s.block_type === 'visibilidad'),
    revision: sessions.some(s => s.block_type === 'revision'),
  }

  const doneCount = Object.values(blocksDone).filter(Boolean).length

  const getWeekStatus = () => {
    if (doneCount >= 5) return 'green'
    if (doneCount >= 3) return 'yellow'
    return 'red'
  }

  const status = getWeekStatus()
  const statusLabels = {
    green: 'Semana perfecta',
    yellow: 'Semana válida',
    red: 'Por debajo del mínimo'
  }

  const blocks = [
    { key: 'estudio', icon: '📚', label: 'Estudio' },
    { key: 'proyecto', icon: '🔧', label: 'Proyecto' },
    { key: 'documentacion', icon: '📝', label: 'Docs' },
    { key: 'visibilidad', icon: '📢', label: 'Visib.' },
    { key: 'revision', icon: '🔄', label: 'Revisión' },
  ]

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">Estado Semanal</h3>
          <p className="text-sm text-gps-muted flex items-center gap-2 mt-1">
            <StatusDot status={status} />
            {statusLabels[status]}
          </p>
        </div>
        <div className={`
          text-3xl font-bold font-mono
          ${status === 'green' ? 'text-green-500' : 
            status === 'yellow' ? 'text-yellow-500' : 'text-red-500'}
        `}>
          {doneCount}/5
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {blocks.map(block => (
          <div 
            key={block.key}
            className={`
              flex flex-col items-center p-2 rounded-lg
              transition-all duration-200
              ${blocksDone[block.key] 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : 'bg-neutral-100 dark:bg-neutral-800'
              }
            `}
          >
            <span className="text-lg">{block.icon}</span>
            <span className={`
              text-[10px] mt-1
              ${blocksDone[block.key] 
                ? 'text-green-700 dark:text-green-400' 
                : 'text-gps-muted'
              }
            `}>
              {block.label}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
