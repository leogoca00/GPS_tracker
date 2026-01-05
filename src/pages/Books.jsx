import { useState } from 'react'
import { Plus, Book, BookOpen, CheckCircle, XCircle } from 'lucide-react'
import { Header } from '../components/Header'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Input, TextArea } from '../components/ui/Input'
import { BookCard } from '../components/BookCard'
import { ProgressBar } from '../components/ui/ProgressBar'
import { useBooks } from '../hooks/useBooks'

export function Books() {
  const { 
    books, 
    currentBook, 
    completedBooks, 
    readingBooks,
    loading, 
    addBook, 
    updateProgress, 
    completeBook, 
    deleteBook 
  } = useBooks()

  const [showAddModal, setShowAddModal] = useState(false)
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    totalPages: ''
  })
  const [filter, setFilter] = useState('all')

  const handleAdd = async () => {
    if (!newBook.title.trim()) return
    await addBook(newBook.title, newBook.author, parseInt(newBook.totalPages) || null)
    setNewBook({ title: '', author: '', totalPages: '' })
    setShowAddModal(false)
  }

  const filteredBooks = books.filter(b => {
    if (filter === 'reading') return b.status === 'reading'
    if (filter === 'completed') return b.status === 'completed'
    if (filter === 'to_read') return b.status === 'to_read'
    return true
  })

  // Calculate yearly goal (12 books)
  const yearlyGoal = 12
  const completedThisYear = completedBooks.filter(b => {
    const endDate = new Date(b.end_date)
    return endDate.getFullYear() === new Date().getFullYear()
  }).length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gps-muted">Cargando libros...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 safe-area-inset">
      <div className="max-w-lg mx-auto px-4 pt-6">
        <Header 
          title="Libros" 
          subtitle={`${completedThisYear}/${yearlyGoal} este año`}
        />

        {/* Yearly progress */}
        <Card className="mb-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gps-muted">Meta anual: 1 libro/mes</p>
              <p className="text-2xl font-bold font-mono">{completedThisYear} / {yearlyGoal}</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
              <BookOpen size={28} className="text-blue-500" />
            </div>
          </div>
          <ProgressBar 
            value={completedThisYear} 
            max={yearlyGoal} 
            color="blue" 
            size="md"
          />
        </Card>

        {/* Currently reading */}
        {currentBook && (
          <div className="mb-6">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <BookOpen size={18} className="text-blue-500" />
              Leyendo ahora
            </h2>
            <BookCard
              book={currentBook}
              onUpdateProgress={updateProgress}
              onComplete={completeBook}
              onDelete={deleteBook}
            />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="text-center py-3">
            <BookOpen size={20} className="mx-auto mb-1 text-blue-500" />
            <p className="text-xl font-bold font-mono">{readingBooks.length}</p>
            <p className="text-xs text-gps-muted">Leyendo</p>
          </Card>
          <Card className="text-center py-3">
            <CheckCircle size={20} className="mx-auto mb-1 text-green-500" />
            <p className="text-xl font-bold font-mono">{completedBooks.length}</p>
            <p className="text-xs text-gps-muted">Completados</p>
          </Card>
          <Card className="text-center py-3">
            <Book size={20} className="mx-auto mb-1 text-gps-muted" />
            <p className="text-xl font-bold font-mono">{books.length}</p>
            <p className="text-xs text-gps-muted">Total</p>
          </Card>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {[
            { value: 'all', label: 'Todos' },
            { value: 'reading', label: 'Leyendo' },
            { value: 'completed', label: 'Completados' },
            { value: 'to_read', label: 'Por leer' }
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                transition-all duration-200 btn-press
                ${filter === tab.value 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-neutral-200 dark:bg-neutral-800 text-gps-muted'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Books list */}
        {filteredBooks.length === 0 ? (
          <Card className="text-center py-8">
            <Book size={32} className="mx-auto mb-2 text-gps-muted" />
            <p className="text-gps-muted">No hay libros</p>
            <p className="text-sm text-gps-muted mt-1">¡Agrega tu primer libro!</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredBooks
              .filter(b => b.id !== currentBook?.id)
              .map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  onUpdateProgress={updateProgress}
                  onComplete={completeBook}
                  onDelete={deleteBook}
                />
              ))}
          </div>
        )}

        {/* Add button */}
        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg z-30"
        >
          <Plus size={24} />
        </Button>

        {/* Add modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Nuevo libro"
        >
          <div className="space-y-4">
            <Input
              label="Título"
              placeholder="Ej: Clean Code"
              value={newBook.title}
              onChange={(e) => setNewBook(prev => ({ ...prev, title: e.target.value }))}
            />
            
            <Input
              label="Autor (opcional)"
              placeholder="Ej: Robert C. Martin"
              value={newBook.author}
              onChange={(e) => setNewBook(prev => ({ ...prev, author: e.target.value }))}
            />
            
            <Input
              label="Total de páginas (opcional)"
              type="number"
              placeholder="Ej: 464"
              value={newBook.totalPages}
              onChange={(e) => setNewBook(prev => ({ ...prev, totalPages: e.target.value }))}
            />

            <div className="flex gap-3 pt-2">
              <Button variant="secondary" className="flex-1" onClick={() => setShowAddModal(false)}>
                Cancelar
              </Button>
              <Button 
                variant="primary" 
                className="flex-1" 
                onClick={handleAdd}
                disabled={!newBook.title.trim()}
              >
                Agregar
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
