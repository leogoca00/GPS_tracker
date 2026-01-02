export function Card({ children, className = '', hover = false, onClick }) {
  return (
    <div 
      className={`
        bg-white dark:bg-neutral-900 
        border border-neutral-200 dark:border-neutral-800
        rounded-xl p-4
        ${hover ? 'card-hover cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-3 ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`font-semibold text-lg ${className}`}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-gps-muted mt-1 ${className}`}>
      {children}
    </p>
  )
}
