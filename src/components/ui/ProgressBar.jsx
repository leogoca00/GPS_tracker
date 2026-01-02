export function ProgressBar({ value, max, size = 'md', showLabel = false, color = 'green' }) {
  const percentage = Math.min(Math.round((value / max) * 100), 100)
  
  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }

  const colors = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500'
  }

  return (
    <div className="w-full">
      <div className={`w-full ${heights[size]} bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden`}>
        <div 
          className={`${heights[size]} ${colors[color]} progress-bar rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-gps-muted">
          <span>{value} / {max}</span>
          <span>{percentage}%</span>
        </div>
      )}
    </div>
  )
}
