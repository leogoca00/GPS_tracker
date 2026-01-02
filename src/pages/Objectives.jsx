import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Header } from '../components/Header'
import { ObjectiveCard } from '../components/ObjectiveCard'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Input, TextArea } from '../components/ui/Input'
import { useObjectives } from '../hooks/useObjectives'

export function Objectives() {
  const { objectives, loading, updateProgress, addObjective } = useObjectives()
  const [showAddModal, setShowAddModal] = useState(false)
  const [newObjective, setNewObjective] = useState({
    title: '',
    description: '',
    targetMetric: '',
    targetValue: 12
  })

  const handleAdd = async () => {
    if (!newObjective.title.trim()) return
    
    await addObjective(
      newObjective.title,
      newObjective.description,
      newObjective.targetMetric,
      newObjective.targetValue
    )
    
    setNewObjective({ title: '', description: '', targetMetric: '', targetValue: 12 })
    setShowAddModal(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gps-muted">Cargando objetivos...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 safe-area-inset">
      <div className="max-w-lg mx-auto px-4 pt-6">
        <Header 
          title="Objetivos" 
          subtitle={`${objectives.length} objetivos activos`}
        />

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total', value: objectives.length },
            { 
              label: 'En meta', 
              value: objectives.filter(o => 
                (o.current_progress / o.target_value) >= 0.8
              ).length 
            },
            { 
              label: 'Por mejorar', 
              value: objectives.filter(o => 
                (o.current_progress / o.target_value) < 0.5
              ).length 
            },
          ].map(stat => (
            <div 
              key={stat.label}
              className="bg-neutral-100 dark:bg-neutral-900 rounded-xl p-3 text-center"
            >
              <p className="text-2xl font-bold font-mono">{stat.value}</p>
              <p className="text-xs text-gps-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Objectives list */}
        <div className="space-y-3">
          {objectives.map((objective, index) => (
            <div 
              key={objective.id}
              style={{ '--index': index }}
              className="list-item-enter"
            >
              <ObjectiveCard 
                objective={objective}
                onUpdateProgress={updateProgress}
              />
            </div>
          ))}
        </div>

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
          title="Nuevo Objetivo"
        >
          <div className="space-y-4">
            <Input
              label="Título del objetivo"
              placeholder="Ej: Publicar en YouTube"
              value={newObjective.title}
              onChange={(e) => setNewObjective(prev => ({ ...prev, title: e.target.value }))}
            />
            
            <TextArea
              label="Descripción"
              placeholder="¿Qué quieres lograr?"
              value={newObjective.description}
              onChange={(e) => setNewObjective(prev => ({ ...prev, description: e.target.value }))}
            />
            
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Métrica"
                placeholder="Ej: videos"
                value={newObjective.targetMetric}
                onChange={(e) => setNewObjective(prev => ({ ...prev, targetMetric: e.target.value }))}
              />
              <Input
                label="Meta anual"
                type="number"
                value={newObjective.targetValue}
                onChange={(e) => setNewObjective(prev => ({ ...prev, targetValue: parseInt(e.target.value) || 0 }))}
              />
            </div>

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
                disabled={!newObjective.title.trim()}
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
