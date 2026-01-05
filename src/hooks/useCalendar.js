import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useCalendar() {
  const [markedDays, setMarkedDays] = useState({})
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().split('T')[0]
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  async function fetchMarkedDays() {
    try {
      setLoading(true)
      
      // Get all daily notes (they represent worked days)
      const { data: notes, error: notesError } = await supabase
        .from('daily_notes')
        .select('date, mood')
        .gte('date', `${currentYear}-01-01`)

      if (notesError) throw notesError

      // Get sessions to see which blocks were done each day
      const { data: sessions, error: sessionsError } = await supabase
        .from('sessions')
        .select('created_at, block_type')
        .gte('created_at', `${currentYear}-01-01`)

      if (sessionsError) throw sessionsError

      // Build marked days map
      const daysMap = {}

      // Add days from notes
      notes?.forEach(note => {
        daysMap[note.date] = {
          hasNote: true,
          mood: note.mood,
          blocks: []
        }
      })

      // Add blocks from sessions
      sessions?.forEach(session => {
        const date = session.created_at.split('T')[0]
        if (!daysMap[date]) {
          daysMap[date] = { hasNote: false, mood: null, blocks: [] }
        }
        if (!daysMap[date].blocks.includes(session.block_type)) {
          daysMap[date].blocks.push(session.block_type)
        }
      })

      setMarkedDays(daysMap)
    } catch (err) {
      console.error('Error fetching calendar data:', err)
    } finally {
      setLoading(false)
    }
  }

  function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate()
  }

  function getFirstDayOfMonth(month, year) {
    return new Date(year, month, 1).getDay()
  }

  function getMonthData(month = currentMonth, year = currentYear) {
    const daysInMonth = getDaysInMonth(month, year)
    const firstDay = getFirstDayOfMonth(month, year)
    const days = []

    // Add empty slots for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, date: null })
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      days.push({
        day,
        date,
        isToday: date === today,
        data: markedDays[date] || null
      })
    }

    return days
  }

  function getYearData(year = currentYear) {
    const months = []
    for (let month = 0; month < 12; month++) {
      months.push({
        month,
        name: new Date(year, month).toLocaleDateString('es', { month: 'short' }),
        days: getMonthData(month, year)
      })
    }
    return months
  }

  // Count active days this month
  function getMonthlyStats(month = currentMonth, year = currentYear) {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
    const activeDays = Object.keys(markedDays).filter(date => date.startsWith(monthStr)).length
    const totalDays = getDaysInMonth(month, year)
    const passedDays = month === currentMonth && year === currentYear
      ? new Date().getDate()
      : totalDays

    return {
      activeDays,
      totalDays,
      passedDays,
      percentage: passedDays > 0 ? Math.round((activeDays / passedDays) * 100) : 0
    }
  }

  useEffect(() => {
    fetchMarkedDays()
  }, [])

  return {
    markedDays,
    loading,
    today,
    currentMonth,
    currentYear,
    getMonthData,
    getYearData,
    getMonthlyStats,
    refetch: fetchMarkedDays
  }
}

export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
