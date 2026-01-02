import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

export function useTimer() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState('estudio')
  const [selectedObjective, setSelectedObjective] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1)
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isRunning])

  const start = useCallback(() => {
    setIsRunning(true)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    setIsRunning(false)
    setSeconds(0)
  }, [])

  const saveSession = useCallback(async (notes = '') => {
    if (seconds < 60) return null // Mínimo 1 minuto

    const minutes = Math.floor(seconds / 60)
    
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert([{
          block_type: selectedBlock,
          objective_id: selectedObjective,
          duration_minutes: minutes,
          notes
        }])
        .select()
        .single()

      if (error) throw error
      
      reset()
      return data
    } catch (err) {
      console.error('Error saving session:', err)
      return null
    }
  }, [seconds, selectedBlock, selectedObjective, reset])

  const formatTime = useCallback((totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  return {
    seconds,
    isRunning,
    selectedBlock,
    selectedObjective,
    setSelectedBlock,
    setSelectedObjective,
    start,
    pause,
    reset,
    saveSession,
    formatTime,
    formattedTime: formatTime(seconds)
  }
}

export function useSessions() {
  const [sessions, setSessions] = useState([])
  const [todaySessions, setTodaySessions] = useState([])
  const [weekSessions, setWeekSessions] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchSessions() {
    try {
      setLoading(true)
      
      // Get all sessions
      const { data, error } = await supabase
        .from('sessions')
        .select('*, objectives(title)')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      
      setSessions(data || [])
      
      // Filter today's sessions
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const todayData = (data || []).filter(s => {
        const sessionDate = new Date(s.created_at)
        sessionDate.setHours(0, 0, 0, 0)
        return sessionDate.getTime() === today.getTime()
      })
      setTodaySessions(todayData)
      
      // Filter this week's sessions
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      weekStart.setHours(0, 0, 0, 0)
      
      const weekData = (data || []).filter(s => {
        const sessionDate = new Date(s.created_at)
        return sessionDate >= weekStart
      })
      setWeekSessions(weekData)
      
    } catch (err) {
      console.error('Error fetching sessions:', err)
    } finally {
      setLoading(false)
    }
  }

  function getTotalMinutes(sessionList) {
    return sessionList.reduce((acc, s) => acc + s.duration_minutes, 0)
  }

  function getSessionsByBlock(sessionList) {
    return sessionList.reduce((acc, s) => {
      acc[s.block_type] = (acc[s.block_type] || 0) + s.duration_minutes
      return acc
    }, {})
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  return {
    sessions,
    todaySessions,
    weekSessions,
    loading,
    refetch: fetchSessions,
    getTotalMinutes,
    getSessionsByBlock,
    todayTotal: getTotalMinutes(todaySessions),
    weekTotal: getTotalMinutes(weekSessions)
  }
}

export const BLOCK_TYPES = [
  { value: 'estudio', label: 'Estudio Técnico', icon: '📚', color: 'bg-blue-500' },
  { value: 'proyecto', label: 'Proyectos/PCBs', icon: '🔧', color: 'bg-purple-500' },
  { value: 'documentacion', label: 'Documentación', icon: '📝', color: 'bg-green-500' },
  { value: 'visibilidad', label: 'Visibilidad', icon: '📢', color: 'bg-orange-500' },
  { value: 'revision', label: 'Revisión', icon: '🔄', color: 'bg-gray-500' }
]
