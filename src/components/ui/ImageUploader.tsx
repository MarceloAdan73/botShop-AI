'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploaderProps {
  onImageSelect: (file: File | null) => void
  initialPreview?: string | null
  name?: string
  inputRef?: React.RefObject<HTMLInputElement | null>
}

export default function ImageUploader({ onImageSelect, initialPreview = null, name = 'image', inputRef: externalRef }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(initialPreview)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const internalRef = useRef<HTMLInputElement>(null)
  const fileInputRef = externalRef || internalRef

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen.')
      return false
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo no debe superar los 5MB.')
      return false
    }
    return true
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setError(null)

    if (file) {
      if (validateFile(file)) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
        onImageSelect(file)
      } else {
        if (fileInputRef.current) fileInputRef.current.value = ''
        setPreview(null)
        onImageSelect(null)
      }
    } else {
      setPreview(null)
      onImageSelect(null)
    }
  }

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (fileInputRef.current) fileInputRef.current.value = ''
    setPreview(null)
    setError(null)
    onImageSelect(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (validateFile(file)) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
        onImageSelect(file)
      }
    }
  }

  return (
    <div className="w-full">
      <div 
        className={`
          relative rounded-xl overflow-hidden transition-all duration-200
          ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-[#333]'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {preview ? (
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <img 
              src={preview} 
              alt="Vista previa" 
              className="w-full h-48 md:h-56 object-cover" 
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <X className="w-4 h-4" /> Eliminar
                </button>
                <button
                  type="button"
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors backdrop-blur-sm"
                >
                  <Upload className="w-4 h-4" /> Cambiar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div 
            className={`
              flex flex-col items-center justify-center h-48 md:h-56 cursor-pointer
              bg-[#252525] hover:bg-[#2A2A2A] border-2 border-dashed rounded-xl
              ${isDragging ? 'border-blue-500' : 'border-gray-600 hover:border-gray-400'}
              transition-all duration-200
            `}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className={`
              w-16 h-16 rounded-full bg-[#333] flex items-center justify-center mb-4
              ${isDragging ? 'bg-blue-500/20' : ''}
            `}>
              <ImageIcon className={`w-8 h-8 ${isDragging ? 'text-blue-400' : 'text-gray-400'}`} />
            </div>
            <p className="text-gray-300 font-medium mb-1">
              {isDragging ? 'Suelta la imagen aquí' : 'Arrastra una imagen o haz clic'}
            </p>
            <p className="text-gray-500 text-sm">PNG, JPG, WEBP hasta 5MB</p>
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
          <X className="w-4 h-4" /> {error}
        </p>
      )}
    </div>
  )
}
