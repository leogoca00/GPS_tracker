import { Link } from 'react-router-dom'
import { Timer, Target, FolderKanban, TrendingUp } from 'lucide-react'
import { Header } from '../components/Header'
import { Card } from '../components/ui/Card'
import { ProgressBar } from '../components/ui/ProgressBar'
import { WeekStatusWidget } from '../components/WeekStatusWidget'
import { useObjectives } from '../hooks/useObjectives'
import { useSessions } from '../hooks/useTimer'
import { useProjects } from '../hooks/useProjects'

export function Home() {
  const { objectives, loading: loadingObj } = useObjectives()
  const { weekSessions, todayTotal, weekTotal, loading: loadingSessions } = useSessions()
  const { projects, loading: loadingProjects } = useProjects()

  // Calculate overall progress
  const totalProgress = objectives.reduce((acc, obj) => acc + obj.current_progress, 0)
  const totalTarget = objectives.reduce((acc, obj) => acc + obj.target_value, 0)
  const overallPercentage = totalTarget > 0 ? Math.round((totalProgress / totalTarget) * 100) : 0

  const activeProjects = projects.filter(p => p.status !== 'completado').length
  const completedProjects = projects.filter(p => p.status === 'completado').length

  const formatMinutes = (mins) => {
    if (mins < 60) return `${mins}m`
    const hrs = Math.floor(mins / 60)
    const remaining = mins % 60
    return remaining > 0 ? `${hrs}h ${remaining}m` : `${hrs}h`
  }

  if (loadingObj || loadingSessions || loadingProjects) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gps-muted">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 safe-area-inset">
      <div className="max-w-lg mx-auto px-4 pt-6">
        <Header 
          title="GPS 2026" 
          subtitle="Sistema de Objetivos"
        />

        {/* Overall progress */}
        <Card className="mb-4 bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gps-muted">Progreso General</p>
              <p className="text-3xl font-bold font-mono">{overallPercentage}%</p>
            </div>
            <TrendingUp className="text-gps-accent" size={32} />
          </div>
          <ProgressBar 
            value={totalProgress} 
            max={totalTarget} 
            color="green"
            size="md"
          />
        </Card>

        {/* Week status */}
        <WeekStatusWidget sessions={weekSessions} className="mb-4" />

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Link to="/sessions">
            <Card hover className="h-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Timer size={20} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-gps-muted">Hoy</p>
                  <p className="font-semibold">{formatMinutes(todayTotal)}</p>
                </div>
              </div>
            </Card>
          </Link>

          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Timer size={20} className="text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-gps-muted">Esta semana</p>
                <p className="font-semibold">{formatMinutes(weekTotal)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick access cards */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/objectives">
            <Card hover className="h-full">
              <div className="flex flex-col items-center text-center py-2">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-2">
                  <Target size={24} className="text-green-500" />
                </div>
                <p className="font-semibold">{objectives.length}</p>
                <p className="text-xs text-gps-muted">Objetivos</p>
              </div>
            </Card>
          </Link>

          <Link to="/projects">
            <Card hover className="h-full">
              <div className="flex flex-col items-center text-center py-2">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-2">
                  <FolderKanban size={24} className="text-orange-500" />
                </div>
                <p className="font-semibold">{activeProjects}</p>
                <p className="text-xs text-gps-muted">Proyectos activos</p>
              </div>
            </Card>
          </Link>
        </div>

        {/* Top objectives preview */}
        <h2 className="font-semibold mt-6 mb-3">Objetivos Principales</h2>
        <div className="space-y-2">
          {objectives.slice(0, 3).map(obj => {
            const pct = Math.round((obj.current_progress / obj.target_value) * 100)
            return (
              <Link to="/objectives" key={obj.id}>
                <Card hover className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-sm font-medium truncate">{obj.title}</p>
                    <ProgressBar 
                      value={obj.current_progress} 
                      max={obj.target_value}
                      size="sm"
                      color={pct >= 80 ? 'green' : pct >= 50 ? 'yellow' : 'red'}
                    />
                  </div>
                  <span className="text-sm font-mono font-semibold text-gps-muted">
                    {pct}%
                  </span>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
