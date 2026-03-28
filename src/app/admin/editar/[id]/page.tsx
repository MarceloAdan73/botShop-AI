'use client'

import { useFormStatus } from 'react-dom'
import { useActionState } from 'react'
import { updateProduct } from '@/app/admin/actions'
import { toast } from '@/components/ui/Toast'
import { useEffect, useState, use, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Product, Category } from '@/lib/models'
import ImageUploader from '@/components/ui/ImageUploader'
import { Save, ArrowLeft, Tag, DollarSign, Package, Edit3 } from 'lucide-react'

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
        <>Actualizando...</>
      ) : (
        <><Save className="w-5 h-5" /> Actualizar Producto</>
      )}
    </button>
  )
}

export default function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const productId = resolvedParams.id
  
  const [state, formAction] = useActionState(
    async (prevState: any, formData: FormData) => updateProduct(productId, prevState, formData),
    initialState
  )
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

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
    
    formAction(formData)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-4 md:mb-6">
          <button onClick={() => router.back()} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors text-sm md:text-base">
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden sm:inline">Volver</span>
          </button>
          <h1 className="text-lg md:text-2xl font-bold flex items-center gap-2">
            <Edit3 className="w-5 h-5 md:w-6 md:h-6 text-blue-400" /> <span className="hidden sm:inline">Editar Producto</span><span className="sm:hidden">Editar</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <input type="hidden" name="id" value={productId} />
          <ProductForm 
            id={productId} 
            imageInputRef={imageInputRef}
            onImageChange={setSelectedImage}
          />
        </form>
      </div>
    </div>
  )
}

const CATEGORIES = [
  { slug: 'mujer', name: 'Mujer', icon: '👗' },
  { slug: 'hombre', name: 'Hombre', icon: '👔' },
  { slug: 'ninos', name: 'Niños', icon: '🧒' },
]

function ProductForm({ id, imageInputRef, onImageChange }: { id: string, imageInputRef: React.RefObject<HTMLInputElement | null>, onImageChange: (file: File | null) => void }) {
  const [product, setProduct] = useState<Product & { category: Category } | null>(null)
  const [loading, setLoading] = useState(true)

  const handleImageSelect = (file: File | null) => {
    onImageChange(file)
  }

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/admin/products/${id}`)
        if (res.ok) {
          const data = await res.json()
          setProduct(data)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) return <div className="text-center py-12">Cargando...</div>
  if (!product) return <div className="text-center py-12 text-red-400">Producto no encontrado</div>

  return (
    <>
      {/* Image Upload */}
      <div className="bg-[#1F1F1F] p-4 md:p-6 rounded-xl">
        <h3 className="font-medium mb-4">Imagen del Producto</h3>
        <ImageUploader 
          onImageSelect={handleImageSelect} 
          initialPreview={product.imageUrl || null}
          inputRef={imageInputRef}
        />
      </div>

        <div className="bg-[#1F1F1F] p-4 md:p-6 rounded-xl space-y-4">
        <h3 className="font-medium">Detalles</h3>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
            <Tag className="w-4 h-4" /> Nombre
          </label>
          <input 
            name="name" 
            required 
            defaultValue={product.name}
            className="w-full bg-[#333] p-2 md:p-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Descripción</label>
          <textarea 
            name="description" 
            defaultValue={product.description || ''}
            className="w-full bg-[#333] p-2 md:p-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 md:h-24"
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
              defaultValue={product.price}
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
              defaultValue={product.stock}
              className="w-full bg-[#333] p-2 md:p-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Categoría</label>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {CATEGORIES.map((cat: { slug: string; name: string; icon: string }) => (
              <label key={cat.slug} className="flex items-center gap-2 cursor-pointer bg-[#333] px-3 md:px-4 py-2 rounded-lg hover:bg-[#444] transition">
                <input 
                  type="radio" 
                  name="category" 
                  value={cat.slug} 
                  defaultChecked={product.category?.slug === cat.slug}
                  required 
                  className="hidden peer" 
                />
                <span className="text-lg md:text-xl">{cat.icon}</span>
                <span className="text-sm peer-checked:text-blue-400">{cat.name}</span>
                <div className="w-4 h-4 border border-gray-500 rounded-full peer-checked:bg-blue-500 peer-checked:border-blue-500"></div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Talles Disponibles</label>
          <div className="flex flex-wrap gap-2">
            {['S', 'M', 'L', 'XL'].map(size => {
              const currentTalles = product.talles || ''
              const isSelected = currentTalles.split(',').map(t => t.trim()).includes(size)
              return (
                <label key={size} className="cursor-pointer">
                  <input type="checkbox" name="sizes" value={size} defaultChecked={isSelected} className="hidden peer" />
                  <div className="w-10 h-10 flex items-center justify-center bg-[#333] rounded border border-gray-600 peer-checked:bg-blue-600 peer-checked:border-blue-600 text-sm font-medium hover:bg-[#444]">
                    {size}
                  </div>
                </label>
              )
            })}
          </div>
        </div>
      </div>

      <SubmitButton />
    </>
  )
}
