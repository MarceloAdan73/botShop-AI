'use client'

import { useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  loading?: boolean
}

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger',
  loading = false
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const colors = {
    danger: {
      bg: 'bg-red-600 hover:bg-red-700',
      icon: 'text-red-400',
      border: 'border-red-500/30'
    },
    warning: {
      bg: 'bg-amber-600 hover:bg-amber-700',
      icon: 'text-amber-400',
      border: 'border-amber-500/30'
    },
    info: {
      bg: 'bg-blue-600 hover:bg-blue-700',
      icon: 'text-blue-400',
      border: 'border-blue-500/30'
    }
  }

  const color = colors[type]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div 
        ref={modalRef}
        className={`relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#1F1F1F] rounded-2xl shadow-2xl border ${color.border} animate-in fade-in zoom-in-95 duration-200 mx-4`}
      >
        <div className="p-4 sm:p-6">
          <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-[#2A2A2A] flex items-center justify-center ${color.icon}`}>
            <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          
          <h2 className="text-lg sm:text-xl font-bold text-white text-center mb-2">{title}</h2>
          <p className="text-gray-400 text-center text-sm sm:text-base mb-4 sm:mb-6">{message}</p>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 sm:py-3 bg-[#333] hover:bg-[#444] text-white rounded-xl font-medium transition-colors disabled:opacity-50 text-sm sm:text-base"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 px-4 py-2.5 sm:py-3 text-white rounded-xl font-medium transition-colors disabled:opacity-50 text-sm sm:text-base ${color.bg}`}
            >
              {loading ? 'Procesando...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
