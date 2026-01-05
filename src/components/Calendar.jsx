import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCalendar, MONTH_NAMES, DAY_NAMES } from '../hooks/useCalendar'

export function Calendar({ onDayClick }) {
  const { getMonthData, getMonthlyStats, currentMonth, currentYear, today } = useCalendar()
  const [viewMonth, setViewMonth] = useState(currentMonth)
  const [viewYear, setViewYear] = useState(currentYear)

  const days = getMonthData(viewMonth, viewYear)
  const stats = getMonthlyStats(viewMonth, viewYear)

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  const getIntensity = (data) => {
    if (!data) return 'bg-neutral-100 dark:bg-neutral-800'
    const blockCount = data.blocks?.length || 0
    if (blockCount >= 3 || data.hasNote) return 'bg-green-500'
    if (blockCount >= 2) return 'bg-green-400'
    if (blockCount >= 1) return 'bg-green-300 dark:bg-green-600'
    if (data.hasNote) return 'bg-green-200 dark:bg-green-700'
    return 'bg-neutral-100 dark:bg-neutral-800'
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <h3 className="font-semibold">{MONTH_NAMES[viewMonth]} {viewYear}</h3>
          <p className="text-xs text-gps-muted">
            {stats.activeDays} días activos ({stats.percentage}%)
          </p>
        </div>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAY_NAMES.map(day => (
          <div key={day} className="text-center text-xs text-gps-muted font-medium py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((dayData, index) => (
          <button
            key={index}
            disabled={!dayData.day}
            onClick={() => dayData.date && onDayClick?.(dayData.date)}
            className={`
              aspect-square rounded-md text-xs font-medium
              flex items-center justify-center
              transition-all duration-200
              ${!dayData.day ? 'invisible' : ''}
              ${dayData.isToday ? 'ring-2 ring-gps-accent ring-offset-1 dark:ring-offset-neutral-900' : ''}
              ${getIntensity(dayData.data)}
              ${dayData.data ? 'text-white' : 'text-gps-dark dark:text-gps-light'}
              hover:scale-110 hover:shadow-md
              disabled:hover:scale-100 disabled:hover:shadow-none
            `}
          >
            {dayData.day}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gps-muted">
        <span>Menos</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-neutral-200 dark:bg-neutral-700" />
          <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-800" />
          <div className="w-3 h-3 rounded-sm bg-green-300 dark:bg-green-600" />
          <div className="w-3 h-3 rounded-sm bg-green-400" />
          <div className="w-3 h-3 rounded-sm bg-green-500" />
        </div>
        <span>Más</span>
      </div>
    </div>
  )
}
