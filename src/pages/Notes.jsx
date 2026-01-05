import { useState } from 'react'
import { Plus, Calendar as CalendarIcon, ChevronDown } from 'lucide-react'
import { Header } from '../components/Header'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { TextArea } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Calendar } from '../components/Calendar'
import { WeeklyChecklist } from '../components/WeeklyChecklist'
import { StreakDisplay } from '../components/StreakDisplay'
import { useDailyNotes, MOODS } from '../hooks/useDailyNotes'
import { useWeeklyReviews, REFLECTION_QUESTIONS } from '../hooks/useWeeklyReviews'

export function Notes() {
  const { notes, todayNote, saveNote, loading: loadingNotes } = useDailyNotes()
  const { 
    currentWeekReview, 
    currentWeek, 
    streak, 
    toggleBlock, 
    saveReview,
    loading: loadingReviews 
  } = useWeeklyReviews()

  const [showNoteModal, setShowNoteModal] = useState(false)
  const [showReflectionModal, setShowReflectionModal] = useState(false)
  const [noteContent, setNoteContent] = useState('')
  const [noteMood, setNoteMood] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [reflections, setReflections] = useState({
    what_worked: '',
    blockers: '',
    next_week_adjustments: '',
    free_reflection: ''
  })
  const [expandedNote, setExpandedNote] = useState(null)

  const handleSaveNote = async () => {
    if (!noteContent.trim()) return
    await saveNote(noteContent, noteMood, selectedDate)
    setNoteContent('')
    setNoteMood(null)
    setShowNoteModal(false)
  }

  const handleSaveReflection = async () => {
    await saveReview(currentWeek, reflections)
    setShowReflectionModal(false)
  }

  const handleDayClick = (date) => {
    const existingNote = notes.find(n => n.date === date)
    setSelectedDate(date)
    if (existingNote) {
      setNoteContent(existingNote.content)
      setNoteMood(existingNote.mood)
    } else {
      setNoteContent('')
      setNoteMood(null)
    }
    setShowNoteModal(true)
  }

  const handleToggleBlock = async (blockKey, value) => {
    await toggleBlock(currentWeek, blockKey, value)
  }

  const openReflectionModal = () => {
    setReflections({
      what_worked: currentWeekReview?.what_worked || '',
      blockers: currentWeekReview?.blockers || '',
      next_week_adjustments: currentWeekReview?.next_week_adjustments || '',
      free_reflection: currentWeekReview?.free_reflection || ''
    })
    setShowReflectionModal(true)
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T12:00:00')
    return date.toLocaleDateString('es', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    })
  }

  if (loadingNotes || loadingReviews) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gps-muted">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 safe-area-inset">
      <div className="max-w-lg mx-auto px-4 pt-6">
        <Header 
          title="Notas" 
          subtitle="Reflexiones y seguimiento"
        />

        {/* Streak */}
        <div className="flex justify-center mb-6">
          <StreakDisplay streak={streak} size="md" />
        </div>

        {/* Weekly checklist */}
        <div className="mb-6">
          <WeeklyChecklist
            review={currentWeekReview}
            onToggle={handleToggleBlock}
            weekNumber={currentWeek}
          />
        </div>

        {/* Weekly reflection button */}
        <Button
          variant="outline"
          className="w-full mb-6"
          onClick={openReflectionModal}
        >
          📝 Reflexión semanal
        </Button>

        {/* Calendar */}
        <div className="mb-6">
          <Calendar onDayClick={handleDayClick} />
        </div>

        {/* Recent notes */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Notas recientes</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedDate(new Date().toISOString().split('T')[0])
              setNoteContent(todayNote?.content || '')
              setNoteMood(todayNote?.mood || null)
              setShowNoteModal(true)
            }}
          >
            <Plus size={16} className="mr-1" />
            Nueva
          </Button>
        </div>

        {notes.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gps-muted">No hay notas todavía</p>
            <p className="text-sm text-gps-muted mt-1">Toca un día en el calendario</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {notes.slice(0, 10).map(note => {
              const mood = MOODS.find(m => m.value === note.mood)
              const isExpanded = expandedNote === note.id
              return (
                <Card 
                  key={note.id} 
                  hover
                  onClick={() => setExpandedNote(isExpanded ? null : note.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gps-muted">{formatDate(note.date)}</span>
                        {mood && <span title={mood.label}>{mood.emoji}</span>}
                      </div>
                      <p className={`text-sm ${isExpanded ? '' : 'line-clamp-2'}`}>
                        {note.content}
                      </p>
                    </div>
                    <ChevronDown 
                      size={16} 
                      className={`text-gps-muted flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Note modal */}
      <Modal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        title={`Nota - ${formatDate(selectedDate)}`}
      >
        <div className="space-y-4">
          {/* Mood selector */}
          <div>
            <label className="block text-sm font-medium mb-2">¿Cómo estuvo el día?</label>
            <div className="flex justify-center gap-2">
              {MOODS.map(mood => (
                <button
                  key={mood.value}
                  onClick={() => setNoteMood(noteMood === mood.value ? null : mood.value)}
                  className={`
                    p-2 text-2xl rounded-lg transition-all duration-200
                    ${noteMood === mood.value 
                      ? 'bg-gps-accent/20 scale-110' 
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }
                  `}
                  title={mood.label}
                >
                  {mood.emoji}
                </button>
              ))}
            </div>
          </div>

          <TextArea
            label="¿Qué pasó hoy?"
            placeholder="Escribe lo que quieras..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            rows={5}
          />

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowNoteModal(false)}>
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              className="flex-1" 
              onClick={handleSaveNote}
              disabled={!noteContent.trim()}
            >
              Guardar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reflection modal */}
      <Modal
        isOpen={showReflectionModal}
        onClose={() => setShowReflectionModal(false)}
        title={`Reflexión - Semana ${currentWeek}`}
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {REFLECTION_QUESTIONS.map(q => (
            <TextArea
              key={q.key}
              label={q.question}
              placeholder={q.placeholder}
              value={reflections[q.key]}
              onChange={(e) => setReflections(prev => ({ ...prev, [q.key]: e.target.value }))}
              rows={2}
            />
          ))}

          <TextArea
            label="Reflexión libre (opcional)"
            placeholder="Cualquier otra cosa que quieras escribir..."
            value={reflections.free_reflection}
            onChange={(e) => setReflections(prev => ({ ...prev, free_reflection: e.target.value }))}
            rows={3}
          />

          <div className="flex gap-3 pt-2 sticky bottom-0 bg-white dark:bg-neutral-900">
            <Button variant="secondary" className="flex-1" onClick={() => setShowReflectionModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleSaveReflection}>
              Guardar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
