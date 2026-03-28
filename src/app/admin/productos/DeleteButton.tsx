'use client'

import { useState } from 'react'
import { deleteProduct } from '../actions'
import { toast } from '@/components/ui/Toast'
import { useRouter } from 'next/navigation'
import { ConfirmModal } from '@/components/admin/ConfirmModal'

export function DeleteButton({ productId, productName }: { productId: string, productName: string }) {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.set('id', productId)
      
      const result = await deleteProduct({ success: false, message: '' }, formData)
      
      if (result.success) {
        toast.success(result.message)
        router.refresh()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Error al eliminar')
    } finally {
      setLoading(false)
      setShowConfirm(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setShowConfirm(true)}
        className="text-red-400 hover:text-red-300 p-1 disabled:opacity-50"
        title="Eliminar"
        type="button"
      >
        🗑️
      </button>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        title="Eliminar Producto"
        message={`¿Estás seguro de que deseas eliminar "${productName}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        type="danger"
        loading={loading}
      />
    </>
  )
}
