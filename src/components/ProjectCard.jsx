import { MoreVertical, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { PROJECT_STATUSES } from '../hooks/useProjects'

export function ProjectCard({ project, onStatusChange, onDelete }) {
  const [showMenu, setShowMenu] = useState(false)
  const currentStatus = PROJECT_STATUSES.find(s => s.value === project.status)
  const currentIndex = PROJECT_STATUSES.findIndex(s => s.value === project.status)

  const getStatusVariant = (status) => {
    const variants = {
      'idea': 'info',
      'diseño': 'purple',
      'fabricacion': 'warning',
      'pruebas': 'warning',
      'completado': 'success'
    }
    return variants[status] || 'default'
  }

  const handleNextStatus = () => {
    if (currentIndex < PROJECT_STATUSES.length - 1) {
      onStatusChange(project.id, PROJECT_STATUSES[currentIndex + 1].value)
    }
  }

  const handlePrevStatus = () => {
    if (currentIndex > 0) {
      onStatusChange(project.id, PROJECT_STATUSES[currentIndex - 1].value)
    }
  }

  return (
    <Card className="animate-fade-in relative">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={getStatusVariant(project.status)}>
              {currentStatus?.label}
            </Badge>
            <Badge variant="default" className="uppercase text-[10px]">
              {project.category}
            </Badge>
          </div>
          <h3 className="font-semibold text-base leading-tight">
            {project.name}
          </h3>
          {project.description && (
            <p className="text-sm text-gps-muted mt-1 line-clamp-2">
              {project.description}
            </p>
          )}
        </div>
        
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <MoreVertical size={18} className="text-gps-muted" />
        </button>
      </div>

      {/* Status progress bar */}
      <div className="mt-4 flex items-center gap-1">
        {PROJECT_STATUSES.map((status, idx) => (
          <button
            key={status.value}
            onClick={() => onStatusChange(project.id, status.value)}
            className={`
              flex-1 h-1.5 rounded-full transition-all duration-200
              ${idx <= currentIndex 
                ? 'bg-gps-accent' 
                : 'bg-neutral-200 dark:bg-neutral-800'
              }
              hover:opacity-80
            `}
            title={status.label}
          />
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <button
          onClick={handlePrevStatus}
          disabled={currentIndex === 0}
          className="text-gps-muted hover:text-gps-dark dark:hover:text-gps-light disabled:opacity-30 transition-colors"
        >
          ← Anterior
        </button>
        <span className="text-gps-muted">
          {currentIndex + 1} / {PROJECT_STATUSES.length}
        </span>
        <button
          onClick={handleNextStatus}
          disabled={currentIndex === PROJECT_STATUSES.length - 1}
          className="text-gps-muted hover:text-gps-dark dark:hover:text-gps-light disabled:opacity-30 transition-colors"
        >
          Siguiente →
        </button>
      </div>

      {/* Dropdown menu */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowMenu(false)} 
          />
          <div className="
            absolute right-4 top-12 z-20
            bg-white dark:bg-neutral-800
            border border-neutral-200 dark:border-neutral-700
            rounded-lg shadow-lg
            py-1 min-w-[140px]
            animate-fade-in
          ">
            <button
              onClick={() => {
                onDelete(project.id)
                setShowMenu(false)
              }}
              className="
                w-full px-3 py-2 text-left text-sm
                text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
                flex items-center gap-2
                transition-colors
              "
            >
              <Trash2 size={14} />
              Eliminar
            </button>
          </div>
        </>
      )}
    </Card>
  )
}
