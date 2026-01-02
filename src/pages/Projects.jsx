import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Header } from '../components/Header'
import { ProjectCard } from '../components/ProjectCard'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Input, TextArea, Select } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { useProjects, PROJECT_STATUSES, PROJECT_CATEGORIES } from '../hooks/useProjects'
import { useObjectives } from '../hooks/useObjectives'

export function Projects() {
  const { projects, loading, addProject, updateProjectStatus, deleteProject } = useProjects()
  const { objectives } = useObjectives()
  const [showAddModal, setShowAddModal] = useState(false)
  const [filter, setFilter] = useState('all')
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    category: 'pcb',
    objectiveId: ''
  })

  const handleAdd = async () => {
    if (!newProject.name.trim()) return
    
    await addProject(
      newProject.name,
      newProject.description,
      newProject.category,
      newProject.objectiveId || null
    )
    
    setNewProject({ name: '', description: '', category: 'pcb', objectiveId: '' })
    setShowAddModal(false)
  }

  const filteredProjects = projects.filter(p => {
    if (filter === 'active') return p.status !== 'completado'
    if (filter === 'completed') return p.status === 'completado'
    return true
  })

  const activeCount = projects.filter(p => p.status !== 'completado').length
  const completedCount = projects.filter(p => p.status === 'completado').length

  const objectiveOptions = [
    { value: '', label: 'Sin objetivo asociado' },
    ...objectives.map(o => ({ value: o.id, label: o.title }))
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gps-muted">Cargando proyectos...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 safe-area-inset">
      <div className="max-w-lg mx-auto px-4 pt-6">
        <Header 
          title="Proyectos" 
          subtitle={`${activeCount} activos · ${completedCount} completados`}
        />

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { value: 'all', label: 'Todos', count: projects.length },
            { value: 'active', label: 'Activos', count: activeCount },
            { value: 'completed', label: 'Completados', count: completedCount },
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                transition-all duration-200 btn-press
                ${filter === tab.value 
                  ? 'bg-gps-accent text-white' 
                  : 'bg-neutral-200 dark:bg-neutral-800 text-gps-muted'
                }
              `}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Status legend */}
        <div className="flex flex-wrap gap-2 mb-4">
          {PROJECT_STATUSES.map(status => (
            <Badge key={status.value} variant="default" className="text-[10px]">
              <span className={`w-1.5 h-1.5 rounded-full ${status.color.replace('text-', 'bg-')} mr-1 inline-block`} />
              {status.label}
            </Badge>
          ))}
        </div>

        {/* Projects list */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gps-muted mb-2">No hay proyectos</p>
            <p className="text-sm text-gps-muted">¡Crea tu primer proyecto!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProjects.map((project, index) => (
              <div 
                key={project.id}
                style={{ '--index': index }}
                className="list-item-enter"
              >
                <ProjectCard 
                  project={project}
                  onStatusChange={updateProjectStatus}
                  onDelete={deleteProject}
                />
              </div>
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
          title="Nuevo Proyecto"
        >
          <div className="space-y-4">
            <Input
              label="Nombre del proyecto"
              placeholder="Ej: PCB Sensor de temperatura"
              value={newProject.name}
              onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
            />
            
            <TextArea
              label="Descripción"
              placeholder="¿De qué trata el proyecto?"
              value={newProject.description}
              onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
            />
            
            <Select
              label="Categoría"
              value={newProject.category}
              onChange={(e) => setNewProject(prev => ({ ...prev, category: e.target.value }))}
              options={PROJECT_CATEGORIES}
            />

            <Select
              label="Objetivo relacionado"
              value={newProject.objectiveId}
              onChange={(e) => setNewProject(prev => ({ ...prev, objectiveId: e.target.value }))}
              options={objectiveOptions}
            />

            <div className="flex gap-3 pt-2">
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={() => setShowAddModal(false)}
              >
                Cancelar
              </Button>
              <Button 
                variant="primary" 
                className="flex-1"
                onClick={handleAdd}
                disabled={!newProject.name.trim()}
              >
                Crear
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
