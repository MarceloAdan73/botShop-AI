'use client'

import { useFormStatus } from 'react-dom'
import { useActionState, useTransition } from 'react'
import { createProduct } from '../actions'
import { toast } from '@/components/ui/Toast'
import { useEffect, useState, useRef } from 'react'
import ImageUploader from '@/components/ui/ImageUploader'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Tag, DollarSign, Package } from 'lucide-react'

const initialState = {
  success: false,
  message: '',
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button 
      type="submit"
      disabled={pending}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
    >
      {pending ? (
        <>Guardando...</>
      ) : (
        <><Save className="w-5 h-5" /> Guardar Producto</>
      )}
    </button>
  )
}

export default function NuevoProductoPage() {
  const router = useRouter()
  const [state, formAction] = useActionState(createProduct, initialState)
  const [isPending, startTransition] = useTransition()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  
  const categories = [
    { slug: 'mujer', name: 'Mujer', icon: '👗' },
    { slug: 'hombre', name: 'Hombre', icon: '👔' },
    { slug: 'ninos', name: 'Niños', icon: '🧒' },
  ]

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast.success(state.message)
        router.push('/admin/productos')
      } else {
        toast.error(state.message)
      }
    }
  }, [state, router])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    
    if (selectedImage) {
      formData.set('image', selectedImage)
    }
    
    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-4 md:mb-6">
          <button onClick={() => router.back()} className="mr-4 text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-5 h-5" /> Volver
          </button>
          <h1 className="text-xl md:text-2xl font-bold">Nuevo Producto</h1>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Image Upload */}
            <div className="bg-[#1F1F1F] p-4 md:p-6 rounded-xl">
              <h3 className="font-medium mb-4">Imagen del Producto</h3>
              <ImageUploader 
                onImageSelect={setSelectedImage} 
                inputRef={imageInputRef}
              />
            </div>

            {/* Details */}
            <div className="bg-[#1F1F1F] p-4 md:p-6 rounded-xl space-y-4">
              <h3 className="font-medium">Detalles</h3>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Nombre
                </label>
                <input 
                  name="name" 
                  required 
                  placeholder="Ej: Remera negra oversize"
                  className="w-full bg-[#333] p-2 md:p-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Descripción</label>
                <textarea 
                  name="description" 
                  placeholder="Descripción del producto..."
                  className="w-full bg-[#333] p-2 md:p-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Precio ($)
                  </label>
                  <input 
                    name="price" 
                    type="number" 
                    step="0.01" 
                    required 
                    placeholder="0.00"
                    className="w-full bg-[#333] p-2 md:p-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                    <Package className="w-4 h-4" /> Stock
                  </label>
                  <input 
                    name="stock" 
                    type="number" 
                    required 
                    defaultValue={0}
                    className="w-full bg-[#333] p-2 md:p-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Categoría</label>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {categories.map((cat) => (
                    <label key={cat.slug} className="flex items-center space-x-2 cursor-pointer bg-[#333] px-3 md:px-4 py-2 rounded-lg hover:bg-[#444] transition">
                      <input type="radio" name="category" value={cat.slug} required className="hidden peer" />
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-sm peer-checked:text-blue-400">{cat.name}</span>
                      <div className="w-4 h-4 border border-gray-500 rounded-full peer-checked:bg-blue-500 peer-checked:border-blue-500"></div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                 <label className="block text-sm text-gray-400 mb-2">Talles Disponibles</label>
                 <div className="flex space-x-2">
                   {['S', 'M', 'L', 'XL'].map(size => (
                     <label key={size} className="cursor-pointer">
                       <input type="checkbox" name="sizes" value={size} className="hidden peer" />
                       <div className="w-10 h-10 flex items-center justify-center bg-[#333] rounded border border-gray-600 peer-checked:bg-blue-600 peer-checked:border-blue-600 text-sm font-medium hover:bg-[#444]">
                         {size}
                       </div>
                     </label>
                   ))}
                 </div>
              </div>
            </div>
          </div>

          <SubmitButton />
        </form>
      </div>
    </div>
  )
}
