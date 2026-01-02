import { useEffect } from 'react'
import { X } from 'lucide-react'

export function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="
        relative z-10 w-full sm:max-w-md
        bg-white dark:bg-neutral-900
        border border-neutral-200 dark:border-neutral-800
        rounded-t-2xl sm:rounded-2xl
        p-6 pb-8 sm:pb-6
        animate-slide-up
        max-h-[85vh] overflow-y-auto
      ">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        {children}
      </div>
    </div>
  )
}
