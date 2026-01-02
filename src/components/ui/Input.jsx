export function Input({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  className = '',
  ...props 
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-1.5 text-gps-muted">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          w-full px-3 py-2 rounded-lg
          bg-neutral-100 dark:bg-neutral-800
          border border-neutral-200 dark:border-neutral-700
          text-gps-dark dark:text-gps-light
          placeholder:text-gps-muted
          focus:outline-none focus:ring-2 focus:ring-gps-accent/50
          transition-all duration-200
        "
        {...props}
      />
    </div>
  )
}

export function TextArea({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  rows = 3,
  className = '',
  ...props 
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-1.5 text-gps-muted">
          {label}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className="
          w-full px-3 py-2 rounded-lg
          bg-neutral-100 dark:bg-neutral-800
          border border-neutral-200 dark:border-neutral-700
          text-gps-dark dark:text-gps-light
          placeholder:text-gps-muted
          focus:outline-none focus:ring-2 focus:ring-gps-accent/50
          transition-all duration-200
          resize-none
        "
        {...props}
      />
    </div>
  )
}

export function Select({ label, value, onChange, options, className = '' }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-1.5 text-gps-muted">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className="
          w-full px-3 py-2 rounded-lg
          bg-neutral-100 dark:bg-neutral-800
          border border-neutral-200 dark:border-neutral-700
          text-gps-dark dark:text-gps-light
          focus:outline-none focus:ring-2 focus:ring-gps-accent/50
          transition-all duration-200
        "
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
