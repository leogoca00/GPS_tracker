export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-neutral-200 dark:bg-neutral-800 text-gps-dark dark:text-gps-light',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
  }

  return (
    <span className={`
      inline-flex items-center px-2 py-0.5 
      rounded-full text-xs font-medium
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </span>
  )
}

export function StatusDot({ status }) {
  const colors = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  }

  return (
    <span className={`
      inline-block w-2 h-2 rounded-full
      ${colors[status]}
      animate-pulse-slow
    `} />
  )
}
