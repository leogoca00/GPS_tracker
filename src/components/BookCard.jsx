import { useState } from 'react'
import { Book, Star, MoreVertical, Trash2, CheckCircle } from 'lucide-react'
import { Card } from './ui/Card'
import { ProgressBar } from './ui/ProgressBar'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'
import { Input, TextArea } from './ui/Input'

export function BookCard({ book, onUpdateProgress, onComplete, onDelete }) {
  const [showMenu, setShowMenu] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [rating, setRating] = useState(0)
  const [notes, setNotes] = useState('')
  const [newPage, setNewPage] = useState(book.current_page)

  const progress = book.total_pages 
    ? Math.round((book.current_page / book.total_pages) * 100) 
    : 0

  const handleProgressUpdate = () => {
    if (newPage !== book.current_page) {
      onUpdateProgress(book.id, newPage)
    }
  }

  const handleComplete = () => {
    onComplete(book.id, rating, notes)
    setShowCompleteModal(false)
  }

  const statusVariants = {
    to_read: 'default',
    reading: 'info',
    completed: 'success',
    abandoned: 'danger'
  }

  const statusLabels = {
    to_read: 'Por leer',
    reading: 'Leyendo',
    completed: 'Completado',
    abandoned: 'Abandonado'
  }

  return (
    <>
      <Card className="relative">
        <div className="flex gap-3">
          {/* Book icon */}
          <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Book size={24} className="text-white" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-sm leading-tight line-clamp-1">
                  {book.title}
                </h3>
                {book.author && (
                  <p className="text-xs text-gps-muted">{book.author}</p>
                )}
              </div>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <MoreVertical size={16} className="text-gps-muted" />
              </button>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Badge variant={statusVariants[book.status]}>
                {statusLabels[book.status]}
              </Badge>
              {book.rating && (
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      className={i < book.rating ? 'text-yellow-500 fill-yellow-500' : 'text-neutral-300'}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Progress */}
            {book.status === 'reading' && book.total_pages && (
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="number"
                    value={newPage}
                    onChange={(e) => setNewPage(Math.min(parseInt(e.target.value) || 0, book.total_pages))}
                    onBlur={handleProgressUpdate}
                    className="w-16 px-2 py-1 text-xs rounded bg-neutral-100 dark:bg-neutral-800 border-none text-center"
                    min={0}
                    max={book.total_pages}
                  />
                  <span className="text-xs text-gps-muted">/ {book.total_pages} págs</span>
                  <span className="text-xs font-mono font-semibold ml-auto">{progress}%</span>
                </div>
                <ProgressBar value={book.current_page} max={book.total_pages} size="sm" color="blue" />
              </div>
            )}
          </div>
        </div>

        {/* Dropdown menu */}
        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
            <div className="absolute right-4 top-12 z-20 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 min-w-[160px] animate-fade-in">
              {book.status === 'reading' && (
                <button
                  onClick={() => {
                    setShowMenu(false)
                    setShowCompleteModal(true)
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2 transition-colors"
                >
                  <CheckCircle size={14} />
                  Marcar completado
                </button>
              )}
              <button
                onClick={() => {
                  onDelete(book.id)
                  setShowMenu(false)
                }}
                className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
              >
                <Trash2 size={14} />
                Eliminar
              </button>
            </div>
          </>
        )}
      </Card>

      {/* Complete modal */}
      <Modal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        title="Completar libro"
      >
        <div className="space-y-4">
          <div className="text-center py-2">
            <p className="font-semibold">{book.title}</p>
            <p className="text-sm text-gps-muted">{book.author}</p>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-2">Calificación</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    size={28}
                    className={value <= rating 
                      ? 'text-yellow-500 fill-yellow-500' 
                      : 'text-neutral-300 dark:text-neutral-600'
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <TextArea
            label="Notas del libro (opcional)"
            placeholder="¿Qué aprendiste? ¿Lo recomendarías?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowCompleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleComplete}>
              Completar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
