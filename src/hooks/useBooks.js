import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useBooks() {
  const [books, setBooks] = useState([])
  const [currentBook, setCurrentBook] = useState(null)
  const [loading, setLoading] = useState(true)

  async function fetchBooks() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBooks(data || [])
      
      const reading = data?.find(b => b.status === 'reading')
      setCurrentBook(reading || null)
    } catch (err) {
      console.error('Error fetching books:', err)
    } finally {
      setLoading(false)
    }
  }

  async function addBook(title, author, totalPages) {
    try {
      const { data, error } = await supabase
        .from('books')
        .insert([{
          title,
          author,
          total_pages: totalPages,
          current_page: 0,
          status: 'reading',
          start_date: new Date().toISOString().split('T')[0]
        }])
        .select()
        .single()

      if (error) throw error
      setBooks(prev => [data, ...prev])
      if (!currentBook) setCurrentBook(data)
      return data
    } catch (err) {
      console.error('Error adding book:', err)
      return null
    }
  }

  async function updateBook(id, updates) {
    try {
      const { data, error } = await supabase
        .from('books')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setBooks(prev => prev.map(b => b.id === id ? data : b))
      
      if (currentBook?.id === id) {
        if (data.status === 'reading') {
          setCurrentBook(data)
        } else {
          // Find another reading book
          const nextReading = books.find(b => b.id !== id && b.status === 'reading')
          setCurrentBook(nextReading || null)
        }
      }
      return data
    } catch (err) {
      console.error('Error updating book:', err)
      return null
    }
  }

  async function updateProgress(id, currentPage) {
    const book = books.find(b => b.id === id)
    if (!book) return null

    const updates = { current_page: currentPage }
    
    // Auto-complete if reached end
    if (book.total_pages && currentPage >= book.total_pages) {
      updates.status = 'completed'
      updates.end_date = new Date().toISOString().split('T')[0]
    }

    return updateBook(id, updates)
  }

  async function completeBook(id, rating, notes) {
    return updateBook(id, {
      status: 'completed',
      end_date: new Date().toISOString().split('T')[0],
      rating,
      notes
    })
  }

  async function deleteBook(id) {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id)

      if (error) throw error
      setBooks(prev => prev.filter(b => b.id !== id))
      if (currentBook?.id === id) {
        const nextReading = books.find(b => b.id !== id && b.status === 'reading')
        setCurrentBook(nextReading || null)
      }
    } catch (err) {
      console.error('Error deleting book:', err)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const completedBooks = books.filter(b => b.status === 'completed')
  const readingBooks = books.filter(b => b.status === 'reading')
  const toReadBooks = books.filter(b => b.status === 'to_read')

  return {
    books,
    currentBook,
    completedBooks,
    readingBooks,
    toReadBooks,
    loading,
    addBook,
    updateBook,
    updateProgress,
    completeBook,
    deleteBook,
    refetch: fetchBooks
  }
}

export const BOOK_STATUSES = [
  { value: 'to_read', label: 'Por leer', color: 'gray' },
  { value: 'reading', label: 'Leyendo', color: 'blue' },
  { value: 'completed', label: 'Completado', color: 'green' },
  { value: 'abandoned', label: 'Abandonado', color: 'red' }
]
