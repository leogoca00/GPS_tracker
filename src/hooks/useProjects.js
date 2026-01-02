import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchProjects() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select('*, objectives(title)')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function addProject(name, description, category, objectiveId = null) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          name,
          description,
          category,
          objective_id: objectiveId,
          status: 'idea'
        }])
        .select('*, objectives(title)')
        .single()

      if (error) throw error
      setProjects(prev => [data, ...prev])
      return data
    } catch (err) {
      setError(err.message)
      return null
    }
  }

  async function updateProjectStatus(id, status) {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
      
      setProjects(prev => 
        prev.map(proj => 
          proj.id === id 
            ? { ...proj, status }
            : proj
        )
      )
    } catch (err) {
      setError(err.message)
    }
  }

  async function deleteProject(id) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error
      setProjects(prev => prev.filter(proj => proj.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return {
    projects,
    loading,
    error,
    addProject,
    updateProjectStatus,
    deleteProject,
    refetch: fetchProjects
  }
}

export const PROJECT_STATUSES = [
  { value: 'idea', label: 'Idea', color: 'text-blue-500' },
  { value: 'diseño', label: 'Diseño', color: 'text-purple-500' },
  { value: 'fabricacion', label: 'Fabricación', color: 'text-yellow-500' },
  { value: 'pruebas', label: 'Pruebas', color: 'text-orange-500' },
  { value: 'completado', label: 'Completado', color: 'text-green-500' }
]

export const PROJECT_CATEGORIES = [
  { value: 'pcb', label: 'PCB' },
  { value: 'software', label: 'Software' },
  { value: 'documentacion', label: 'Documentación' },
  { value: 'otro', label: 'Otro' }
]
