import { Header } from '../components/Header'
import { TimerDisplay } from '../components/TimerDisplay'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { useTimer, useSessions, BLOCK_TYPES } from '../hooks/useTimer'
import { useObjectives } from '../hooks/useObjectives'

export function Sessions() {
  const timer = useTimer()
  const { objectives } = useObjectives()
  const { 
    todaySessions, 
    weekSessions, 
    todayTotal, 
    weekTotal,
    refetch,
    loading 
  } = useSessions()

  const handleSave = async (notes) => {
    const result = await timer.saveSession(notes)
    if (result) {
      refetch()
    }
    return result
  }

  const formatMinutes = (mins) => {
    if (mins < 60) return `${mins} min`
    const hrs = Math.floor(mins / 60)
    const remaining = mins % 60
    return remaining > 0 ? `${hrs}h ${remaining}m` : `${hrs}h`
  }

  const getBlockInfo = (type) => BLOCK_TYPES.find(b => b.value === type)

  return (
    <div className="min-h-screen pb-24 safe-area-inset">
      <div className="max-w-lg mx-auto px-4 pt-6">
        <Header 
          title="Sesiones" 
          subtitle="Cronómetro de estudio"
        />

        {/* Timer */}
        <div className="mb-8">
          <TimerDisplay
            formattedTime={timer.formattedTime}
            isRunning={timer.isRunning}
            selectedBlock={timer.selectedBlock}
            onStart={timer.start}
            onPause={timer.pause}
            onReset={timer.reset}
            onSave={handleSave}
            onBlockChange={timer.setSelectedBlock}
            objectives={objectives}
          />
        </div>

        {/* Today's stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card>
            <p className="text-xs text-gps-muted mb-1">Hoy</p>
            <p className="text-2xl font-bold font-mono">{formatMinutes(todayTotal)}</p>
            <p className="text-xs text-gps-muted">{todaySessions.length} sesiones</p>
          </Card>
          <Card>
            <p className="text-xs text-gps-muted mb-1">Esta semana</p>
            <p className="text-2xl font-bold font-mono">{formatMinutes(weekTotal)}</p>
            <p className="text-xs text-gps-muted">{weekSessions.length} sesiones</p>
          </Card>
        </div>

        {/* Today's sessions */}
        <h2 className="font-semibold mb-3">Sesiones de hoy</h2>
        {loading ? (
          <div className="text-center py-8 text-gps-muted">Cargando...</div>
        ) : todaySessions.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gps-muted">No hay sesiones registradas hoy</p>
            <p className="text-sm text-gps-muted mt-1">¡Inicia el cronómetro!</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {todaySessions.map(session => {
              const block = getBlockInfo(session.block_type)
              return (
                <Card key={session.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{block?.icon}</span>
                    <div>
                      <p className="text-sm font-medium">{block?.label}</p>
                      {session.notes && (
                        <p className="text-xs text-gps-muted line-clamp-1">{session.notes}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant="default">
                    {formatMinutes(session.duration_minutes)}
                  </Badge>
                </Card>
              )
            })}
          </div>
        )}

        {/* Week breakdown by block */}
        {weekSessions.length > 0 && (
          <>
            <h2 className="font-semibold mt-6 mb-3">Resumen semanal por bloque</h2>
            <div className="space-y-2">
              {BLOCK_TYPES.map(block => {
                const blockSessions = weekSessions.filter(s => s.block_type === block.value)
                const totalMins = blockSessions.reduce((acc, s) => acc + s.duration_minutes, 0)
                if (totalMins === 0) return null
                
                return (
                  <Card key={block.value} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${block.color} flex items-center justify-center text-white text-sm`}>
                        {block.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{block.label}</p>
                        <p className="text-xs text-gps-muted">{blockSessions.length} sesiones</p>
                      </div>
                    </div>
                    <span className="font-mono font-semibold">{formatMinutes(totalMins)}</span>
                  </Card>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
