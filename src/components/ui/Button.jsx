export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  onClick,
  type = 'button'
}) {
  const variants = {
    primary: 'bg-gps-accent text-white hover:bg-green-600 active:bg-green-700',
    secondary: 'bg-neutral-200 dark:bg-neutral-800 text-gps-dark dark:text-gps-light hover:bg-neutral-300 dark:hover:bg-neutral-700',
    ghost: 'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
    outline: 'bg-transparent border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
    icon: 'p-2'
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-lg font-medium
        transition-all duration-200
        btn-press
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  )
}
