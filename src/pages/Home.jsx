import { Link } from 'react-router-dom'
import { Timer, Target, FolderKanban, TrendingUp, BookOpen, FileText } from 'lucide-react'
import { Header } from '../components/Header'
import { Card } from '../components/ui/Card'
import { ProgressBar } from '../components/ui/ProgressBar'
import { RandomObjectiveWidget } from '../components/RandomObjectiveWidget'
import { StreakDisplay, StreakBadge } from '../components/StreakDisplay'
import { useObjectives } from '../hooks/useObjectives'
import { useSessions } from '../hooks/useTimer'
import { useProjects } from '../hooks/useProjects'
import { useWeeklyReviews, WEEKLY_BLOCKS } from '../hooks/useWeeklyReviews'
import { useBooks } from '../hooks/useBooks'

export function Home() {
  const { objectives, loading: loadingObj } = useObjectives()
  const { weekSessions, todayTotal, weekTotal, loading: loadingSessions } = useSessions()
  const { projects, loading: loadingProjects } = useProjects()
  const { currentWeekReview, streak, currentWeek, loading: loadingReviews } = useWeeklyReviews()
  const { completedBooks, currentBook, loading: loadingBooks } = useBooks()

  // Calculate overall progress
  const totalProgress = objectives.reduce((acc, obj) => acc + obj.current_progress, 0)
  const totalTarget = objectives.reduce((acc, obj) => acc + obj.target_value, 0)
  const overallPercentage = totalTarget > 0 ? Math.round((totalProgress / totalTarget) * 100) : 0

  const activeProjects = projects.filter(p => p.status !== 'completado').length

  // Weekly blocks status
  const weeklyDoneCount = WEEKLY_BLOCKS.filter(b => currentWeekReview?.[b.key]).length
  const getWeekStatus = () => {
    if (weeklyDoneCount >= 5) return { color: 'green', label: 'Perfecta' }
    if (weeklyDoneCount >= 3) return { color: 'yellow', label: 'Válida' }
    return { color: 'red', label: 'Pendiente' }
  }
  const weekStatus = getWeekStatus()

  const formatMinutes = (mins) => {
    if (mins < 60) return `${mins}m`
    const hrs = Math.floor(mins / 60)
    const remaining = mins % 60
    return remaining > 0 ? `${hrs}h ${remaining}m` : `${hrs}h`
  }

  const isLoading = loadingObj || loadingSessions || loadingProjects || loadingReviews || loadingBooks

  if (isLoading) {
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

        {/* Streak + Week status row */}
        <div className="flex gap-3 mb-4">
          <StreakDisplay streak={streak} size="sm" />
          <Link to="/notes" className="flex-1">
            <Card hover className="h-full flex items-center justify-between">
              <div>
                <p className="text-xs text-gps-muted">Semana {currentWeek}</p>
                <p className={`font-semibold ${
                  weekStatus.color === 'green' ? 'text-green-500' :
                  weekStatus.color === 'yellow' ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {weekStatus.label}
                </p>
              </div>
              <div className="text-2xl font-bold font-mono text-gps-muted">
                {weeklyDoneCount}/5
              </div>
            </Card>
          </Link>
        </div>

        {/* Random objective widget */}
        <div className="mb-4">
          <RandomObjectiveWidget objectives={objectives} />
        </div>

        {/* Overall progress */}
        <Card className="mb-4 bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gps-muted">Progreso General 2026</p>
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

        {/* Quick stats grid */}
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
                <p className="text-xs text-gps-muted">Semana</p>
                <p className="font-semibold">{formatMinutes(weekTotal)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick access cards */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <Link to="/objectives">
            <Card hover className="h-full py-3">
              <div className="flex flex-col items-center text-center">
                <Target size={20} className="text-green-500 mb-1" />
                <p className="text-lg font-bold font-mono">{objectives.length}</p>
                <p className="text-[10px] text-gps-muted">Objetivos</p>
              </div>
            </Card>
          </Link>

          <Link to="/projects">
            <Card hover className="h-full py-3">
              <div className="flex flex-col items-center text-center">
                <FolderKanban size={20} className="text-orange-500 mb-1" />
                <p className="text-lg font-bold font-mono">{activeProjects}</p>
                <p className="text-[10px] text-gps-muted">Proyectos</p>
              </div>
            </Card>
          </Link>

          <Link to="/books">
            <Card hover className="h-full py-3">
              <div className="flex flex-col items-center text-center">
                <BookOpen size={20} className="text-blue-500 mb-1" />
                <p className="text-lg font-bold font-mono">{completedBooks.length}</p>
                <p className="text-[10px] text-gps-muted">Libros</p>
              </div>
            </Card>
          </Link>

          <Link to="/notes">
            <Card hover className="h-full py-3">
              <div className="flex flex-col items-center text-center">
                <FileText size={20} className="text-purple-500 mb-1" />
                <p className="text-lg font-bold font-mono">{streak}</p>
                <p className="text-[10px] text-gps-muted">Racha</p>
              </div>
            </Card>
          </Link>
        </div>

        {/* Currently reading */}
        {currentBook && (
          <Link to="/books">
            <Card hover className="mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-14 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <BookOpen size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gps-muted">Leyendo</p>
                  <p className="font-medium text-sm truncate">{currentBook.title}</p>
                  {currentBook.total_pages && (
                    <ProgressBar 
                      value={currentBook.current_page} 
                      max={currentBook.total_pages}
                      size="sm"
                      color="blue"
                    />
                  )}
                </div>
                <span className="text-sm font-mono text-gps-muted">
                  {currentBook.total_pages 
                    ? `${Math.round((currentBook.current_page / currentBook.total_pages) * 100)}%`
                    : `p.${currentBook.current_page}`
                  }
                </span>
              </div>
            </Card>
          </Link>
        )}

        {/* Top objectives */}
        <h2 className="font-semibold mb-3">Objetivos Principales</h2>
        <div className="space-y-2">
          {objectives.slice(0, 4).map(obj => {
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
                  <span className={`text-sm font-mono font-semibold ${
                    pct >= 80 ? 'text-green-500' :
                    pct >= 50 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
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
