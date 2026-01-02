import { useState } from 'react'
import { Play, Pause, RotateCcw, Save } from 'lucide-react'
import { Button } from './ui/Button'
import { Select } from './ui/Input'
import { TextArea } from './ui/Input'
import { Modal } from './ui/Modal'
import { BLOCK_TYPES } from '../hooks/useTimer'

export function TimerDisplay({ 
  formattedTime, 
  isRunning, 
  selectedBlock,
  onStart, 
  onPause, 
  onReset,
  onSave,
  onBlockChange,
  objectives = []
}) {
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [notes, setNotes] = useState('')

  const currentBlock = BLOCK_TYPES.find(b => b.value === selectedBlock)

  const handleSave = async () => {
    await onSave(notes)
    setNotes('')
    setShowSaveModal(false)
  }

  const objectiveOptions = [
    { value: '', label: 'Sin objetivo específico' },
    ...objectives.map(o => ({ value: o.id, label: o.title }))
  ]

  return (
    <>
      <div className="flex flex-col items-center">
        {/* Block selector pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {BLOCK_TYPES.map(block => (
            <button
              key={block.value}
              onClick={() => onBlockChange(block.value)}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium
                transition-all duration-200 btn-press
                ${selectedBlock === block.value 
                  ? `${block.color} text-white` 
                  : 'bg-neutral-200 dark:bg-neutral-800 text-gps-muted hover:text-gps-dark dark:hover:text-gps-light'
                }
              `}
            >
              {block.icon} {block.label}
            </button>
          ))}
        </div>

        {/* Timer display */}
        <div className="relative mb-8">
          <div className={`
            w-56 h-56 rounded-full
            flex items-center justify-center
            border-4 transition-colors duration-300
            ${isRunning 
              ? 'border-gps-accent' 
              : 'border-neutral-300 dark:border-neutral-700'
            }
          `}>
            <span className="timer-digit text-5xl font-bold tracking-tight">
              {formattedTime}
            </span>
          </div>
          
          {/* Animated ring when running */}
          {isRunning && (
            <div className="absolute inset-0 rounded-full border-4 border-gps-accent/30 animate-ping" />
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button 
            variant="secondary" 
            size="icon"
            onClick={onReset}
            className="w-12 h-12"
          >
            <RotateCcw size={20} />
          </Button>
          
          <Button 
            variant="primary"
            onClick={isRunning ? onPause : onStart}
            className="w-20 h-20 rounded-full text-xl"
          >
            {isRunning ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </Button>
          
          <Button 
            variant="secondary" 
            size="icon"
            onClick={() => setShowSaveModal(true)}
            className="w-12 h-12"
            disabled={formattedTime === '00:00'}
          >
            <Save size={20} />
          </Button>
        </div>

        {/* Current session info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gps-muted">
            {currentBlock?.icon} Sesión de {currentBlock?.label}
          </p>
        </div>
      </div>

      {/* Save session modal */}
      <Modal 
        isOpen={showSaveModal} 
        onClose={() => setShowSaveModal(false)}
        title="Guardar sesión"
      >
        <div className="space-y-4">
          <div className="text-center py-4">
            <p className="text-sm text-gps-muted mb-1">Tiempo registrado</p>
            <p className="text-3xl font-mono font-bold">{formattedTime}</p>
          </div>

          <Select
            label="Objetivo relacionado"
            options={objectiveOptions}
            onChange={(e) => {}}
          />

          <TextArea
            label="Notas de la sesión (opcional)"
            placeholder="¿Qué trabajaste? ¿Qué aprendiste?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />

          <div className="flex gap-3 pt-2">
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={() => setShowSaveModal(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              className="flex-1"
              onClick={handleSave}
            >
              Guardar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
