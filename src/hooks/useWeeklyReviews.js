import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Helper to get week number
function getWeekNumber(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

export function useWeeklyReviews() {
  const [reviews, setReviews] = useState([])
  const [currentWeekReview, setCurrentWeekReview] = useState(null)
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  const currentYear = new Date().getFullYear()
  const currentWeek = getWeekNumber()

  async function fetchReviews() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('weekly_reviews')
        .select('*')
        .eq('year', currentYear)
        .order('week_number', { ascending: false })

      if (error) throw error
      setReviews(data || [])
      
      const current = data?.find(r => r.week_number === currentWeek)
      setCurrentWeekReview(current || null)
      
      // Calculate streak
      calculateStreak(data || [])
    } catch (err) {
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  function calculateStreak(reviewsData) {
    let count = 0
    const sortedReviews = [...reviewsData].sort((a, b) => b.week_number - a.week_number)
    
    for (let week = currentWeek; week >= 1; week--) {
      const review = sortedReviews.find(r => r.week_number === week)
      if (review?.is_valid_week) {
        count++
      } else if (week < currentWeek) {
        // Don't break streak for current week (still in progress)
        break
      }
    }
    setStreak(count)
  }

  async function saveReview(weekNumber, data) {
    try {
      const existing = reviews.find(r => r.week_number === weekNumber && r.year === currentYear)
      
      if (existing) {
        const { data: updated, error } = await supabase
          .from('weekly_reviews')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
          .select()
          .single()

        if (error) throw error
        setReviews(prev => prev.map(r => r.id === existing.id ? updated : r))
        if (weekNumber === currentWeek) setCurrentWeekReview(updated)
        return updated
      } else {
        const { data: created, error } = await supabase
          .from('weekly_reviews')
          .insert([{ year: currentYear, week_number: weekNumber, ...data }])
          .select()
          .single()

        if (error) throw error
        setReviews(prev => [created, ...prev])
        if (weekNumber === currentWeek) setCurrentWeekReview(created)
        return created
      }
    } catch (err) {
      console.error('Error saving review:', err)
      return null
    }
  }

  async function toggleBlock(weekNumber, blockName, value) {
    const data = { [blockName]: value }
    return saveReview(weekNumber, data)
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  return {
    reviews,
    currentWeekReview,
    currentWeek,
    currentYear,
    streak,
    loading,
    saveReview,
    toggleBlock,
    refetch: fetchReviews,
    getWeekNumber
  }
}

export const WEEKLY_BLOCKS = [
  { key: 'estudio_done', icon: '📚', label: 'Estudio Técnico', color: 'blue' },
  { key: 'proyecto_done', icon: '🔧', label: 'Proyecto/PCB', color: 'purple' },
  { key: 'documentacion_done', icon: '📝', label: 'Documentación', color: 'green' },
  { key: 'contenido_done', icon: '📢', label: 'Contenido', color: 'orange' },
  { key: 'revision_done', icon: '🔄', label: 'Revisión', color: 'gray' }
]

export const REFLECTION_QUESTIONS = [
  { key: 'what_worked', question: '¿Qué funcionó esta semana?', placeholder: 'Lo que salió bien...' },
  { key: 'blockers', question: '¿Qué bloqueos encontré?', placeholder: 'Obstáculos o dificultades...' },
  { key: 'next_week_adjustments', question: '¿Qué ajusto para la próxima semana?', placeholder: 'Cambios o mejoras...' }
]
