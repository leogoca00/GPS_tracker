import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useObjectives() {
  const [objectives, setObjectives] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchObjectives() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('objectives')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true })

      if (error) throw error
      setObjectives(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateProgress(id, newProgress) {
    try {
      const { error } = await supabase
        .from('objectives')
        .update({ 
          current_progress: newProgress,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
      
      setObjectives(prev => 
        prev.map(obj => 
          obj.id === id 
            ? { ...obj, current_progress: newProgress }
            : obj
        )
      )
    } catch (err) {
      setError(err.message)
    }
  }

  async function addObjective(title, description, targetMetric, targetValue) {
    try {
      const { data, error } = await supabase
        .from('objectives')
        .insert([{
          title,
          description,
          target_metric: targetMetric,
          target_value: targetValue
        }])
        .select()
        .single()

      if (error) throw error
      setObjectives(prev => [...prev, data])
      return data
    } catch (err) {
      setError(err.message)
      return null
    }
  }

  useEffect(() => {
    fetchObjectives()
  }, [])

  return {
    objectives,
    loading,
    error,
    updateProgress,
    addObjective,
    refetch: fetchObjectives
  }
}
