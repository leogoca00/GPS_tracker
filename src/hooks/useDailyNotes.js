import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useDailyNotes() {
  const [notes, setNotes] = useState([])
  const [todayNote, setTodayNote] = useState(null)
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().split('T')[0]

  async function fetchNotes() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('daily_notes')
        .select('*')
        .order('date', { ascending: false })
        .limit(30)

      if (error) throw error
      setNotes(data || [])
      
      const todayData = data?.find(n => n.date === today)
      setTodayNote(todayData || null)
    } catch (err) {
      console.error('Error fetching notes:', err)
    } finally {
      setLoading(false)
    }
  }

  async function saveNote(content, mood = null, date = today) {
    try {
      // Check if note exists for this date
      const existing = notes.find(n => n.date === date)
      
      if (existing) {
        const { data, error } = await supabase
          .from('daily_notes')
          .update({ content, mood, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
          .select()
          .single()

        if (error) throw error
        setNotes(prev => prev.map(n => n.id === existing.id ? data : n))
        if (date === today) setTodayNote(data)
        return data
      } else {
        const { data, error } = await supabase
          .from('daily_notes')
          .insert([{ date, content, mood }])
          .select()
          .single()

        if (error) throw error
        setNotes(prev => [data, ...prev])
        if (date === today) setTodayNote(data)
        return data
      }
    } catch (err) {
      console.error('Error saving note:', err)
      return null
    }
  }

  async function deleteNote(id) {
    try {
      const { error } = await supabase
        .from('daily_notes')
        .delete()
        .eq('id', id)

      if (error) throw error
      setNotes(prev => prev.filter(n => n.id !== id))
      if (todayNote?.id === id) setTodayNote(null)
    } catch (err) {
      console.error('Error deleting note:', err)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  return {
    notes,
    todayNote,
    loading,
    saveNote,
    deleteNote,
    refetch: fetchNotes
  }
}

export const MOODS = [
  { value: 'great', emoji: '🔥', label: 'Excelente' },
  { value: 'good', emoji: '😊', label: 'Bien' },
  { value: 'neutral', emoji: '😐', label: 'Normal' },
  { value: 'bad', emoji: '😔', label: 'Mal' },
  { value: 'terrible', emoji: '💀', label: 'Terrible' }
]
