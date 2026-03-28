'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Modal } from './Modal'
import { ConfirmModal } from './ConfirmModal'
import type { Product, Category } from '@/lib/models'
import toast from 'react-hot-toast'
import { MoreVertical, Edit, Copy, Trash2, Bookmark, DollarSign, Unlock, Package } from 'lucide-react'

interface ProductCardProps {
  product: Product & { category?: Category }
  onReserva?: (productId: string, formData: FormData) => Promise<{ success: boolean; message: string }>
  onVenta?: (productId: string, formData: FormData) => Promise<{ success: boolean; message: string }>
  onLiberar?: (productId: string) => Promise<{ success: boolean; message: string }>
  onDelete?: (productId: string) => Promise<void>
  onDuplicate?: (productId: string) => Promise<void>
}

const METODOS_PAGO = ['Efectivo', 'Transferencia', 'Mercado Pago', 'Tarjeta Débito', 'Tarjeta Crédito']

export function ProductCard({ product, onReserva, onVenta, onLiberar, onDelete, onDuplicate }: ProductCardProps) {
  const router = useRouter()
  const [showReservarModal, setShowReservarModal] = useState(false)
  const [showVenderModal, setShowVenderModal] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    console.log('ProductCard render:', product.id, product.imageUrl)
    setImageError(false)
  }, [product.id, product.imageUrl])

  const estadoColors = {
    disponible: 'bg-green-900/50 text-green-300 border-green-700',
    reservado: 'bg-amber-900/50 text-amber-300 border-amber-700',
    vendido: 'bg-rose-900/50 text-rose-300 border-rose-700'
  }

  const estadoLabels = {
    disponible: 'Disponible',
    reservado: 'Reservado',
    vendido: 'Vendido'
  }

  const handleReservar = async (formData: FormData) => {
    if (!onReserva) return { success: false, message: 'Función no disponible' }
    setLoading(true)
    const result = await onReserva(product.id, formData)
    setLoading(false)
    if (result.success) {
      setShowReservarModal(false)
      toast.success(result.message)
      router.refresh()
    } else {
      toast.error(result.message)
    }
    return result
  }

  const handleVender = async (formData: FormData) => {
    if (!onVenta) return { success: false, message: 'Función no disponible' }
    setLoading(true)
    const result = await onVenta(product.id, formData)
    setLoading(false)
    if (result.success) {
      setShowVenderModal(false)
      toast.success(result.message)
      router.refresh()
    } else {
      toast.error(result.message)
    }
    return result
  }

  const handleLiberar = async () => {
    if (!onLiberar) return
    setLoading(true)
    const result = await onLiberar(product.id)
    setLoading(false)
    setShowMenu(false)
    if (result.success) {
      toast.success(result.message)
      router.refresh()
    } else {
      toast.error(result.message)
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return
    setLoading(true)
    await onDelete(product.id)
    setLoading(false)
    setShowDeleteModal(false)
    setShowMenu(false)
    toast.success('Producto eliminado')
    router.refresh()
  }

  const openDeleteModal = () => {
    setShowMenu(false)
    setShowDeleteModal(true)
  }

  const handleDuplicate = async () => {
    if (!onDuplicate) return
    setLoading(true)
    await onDuplicate(product.id)
    setLoading(false)
    setShowMenu(false)
    toast.success('Producto duplicado')
    router.refresh()
  }

  return (
    <>
      <div className="bg-[#1F1F1F] rounded-xl overflow-hidden hover:bg-[#252525] transition-all group">
        <div className="relative aspect-square bg-[#2A2A2A]">
          {product.imageUrl && !imageError ? (
            <img 
              key={`img-${product.id}`}
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover"
              onLoad={() => console.log('✅ Imagen cargada:', product.imageUrl)}
              onError={() => {
                console.log('❌ Error cargando imagen:', product.imageUrl)
                setImageError(true)
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <span className="text-4xl">📷</span>
            </div>
          )}
          
          <div className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-medium border ${estadoColors[product.estado]}`}>
            {estadoLabels[product.estado]}
          </div>

          <button
            type="button"
            title="Opciones del producto"
            onClick={() => setShowMenu(!showMenu)}
            className="absolute top-2 right-2 p-2 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute top-12 right-2 z-20 bg-[#2A2A2A] rounded-lg shadow-xl border border-[#444] overflow-hidden min-w-[160px]">
                <Link href={`/admin/editar/${product.id}`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-[#333] hover:text-white transition-colors">
                  <Edit className="w-4 h-4" /> Editar
                </Link>
                <button onClick={handleDuplicate} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-[#333] hover:text-white transition-colors">
                  <Copy className="w-4 h-4" /> Duplicar
                </button>
                <button onClick={openDeleteModal} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 transition-colors">
                  <Trash2 className="w-4 h-4" /> Eliminar
                </button>
              </div>
            </>
          )}
        </div>

        <div className="p-3">
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="font-medium text-white truncate flex-1 text-sm">{product.name}</h3>
            <span className="text-green-400 font-bold whitespace-nowrap text-sm">
              ${mounted ? product.price.toLocaleString('es-AR') : product.price.toString()}
            </span>
          </div>

          <p className="text-[10px] md:text-xs text-gray-400 mb-2">{product.category?.name || 'Sin categoría'}</p>

          {product.estado === 'reservado' && product.reservaInfo && (
            <div className="text-[10px] md:text-xs text-yellow-400 mb-2 bg-yellow-900/20 p-1.5 md:p-2 rounded">
              <p>👤 {product.reservaInfo.nombreCliente}</p>
              {product.reservaInfo.fechaVencimiento && (
                <p>Vence: {mounted ? new Date(product.reservaInfo.fechaVencimiento).toLocaleDateString('es-AR') : '-'}</p>
              )}
            </div>
          )}

          {product.estado === 'vendido' && product.ventaInfo && (
            <div className="text-[10px] md:text-xs text-red-400 mb-2 bg-red-900/20 p-1.5 md:p-2 rounded">
              <p>👤 {product.ventaInfo.nombreCliente}</p>
              <p>💰 ${mounted ? product.ventaInfo.precioVenta?.toLocaleString('es-AR') : product.ventaInfo.precioVenta} - {product.ventaInfo.metodoPago}</p>
            </div>
          )}

          <div className="flex gap-1.5 md:gap-2 mt-3">
            {product.estado === 'disponible' && (
              <>
                <button
                  onClick={() => setShowReservarModal(true)}
                  className="flex-1 px-2 md:px-3 py-2 text-[10px] md:text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <Bookmark className="w-3 h-3 md:w-3.5 md:h-3.5" /> Reservar
                </button>
                <button
                  onClick={() => setShowVenderModal(true)}
                  className="flex-1 px-2 md:px-3 py-2 text-[10px] md:text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <DollarSign className="w-3 h-3 md:w-3.5 md:h-3.5" /> Vender
                </button>
              </>
            )}
            {product.estado === 'reservado' && (
              <>
                <button
                  onClick={() => setShowVenderModal(true)}
                  className="flex-1 px-2 md:px-3 py-2 text-[10px] md:text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <DollarSign className="w-3 h-3 md:w-3.5 md:h-3.5" /> Vender
                </button>
                <button
                  onClick={handleLiberar}
                  disabled={loading}
                  className="flex-1 px-2 md:px-3 py-2 text-[10px] md:text-xs font-medium bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  <Unlock className="w-3 h-3 md:w-3.5 md:h-3.5" /> Liberar
                </button>
              </>
            )}
            {product.estado === 'vendido' && (
              <button
                onClick={handleLiberar}
                disabled={loading}
                className="w-full px-2 md:px-3 py-2 text-[10px] md:text-xs font-medium bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
              >
                <Package className="w-3 h-3 md:w-3.5 md:h-3.5" /> Disponible
              </button>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={showReservarModal} onClose={() => setShowReservarModal(false)} title="📌 Reservar Producto">
        <form action={async (formData) => { await handleReservar(formData) }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nombre del cliente *</label>
              <input
                type="text"
                name="nombreCliente"
                required
                minLength={2}
                className="w-full bg-[#333] border border-[#444] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                placeholder="Ej: María García"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Teléfono</label>
              <input
                type="tel"
                name="telefonoCliente"
                className="w-full bg-[#333] border border-[#444] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                placeholder="Ej: 2915123456"
              />
            </div>
            <div>
              <label htmlFor="diasValidez" className="block text-sm text-gray-400 mb-1">Días de validez</label>
              <select
                id="diasValidez"
                name="diasValidez"
                title="Días de validez"
                className="w-full bg-[#333] border border-[#444] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                defaultValue="3"
              >
                <option value="1">1 día</option>
                <option value="2">2 días</option>
                <option value="3">3 días</option>
                <option value="5">5 días</option>
                <option value="7">7 días</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nota (opcional)</label>
              <textarea
                name="nota"
                rows={2}
                className="w-full bg-[#333] border border-[#444] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500 resize-none"
                placeholder="Ej: El cliente lo quiere en talle M"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowReservarModal(false)}
                className="flex-1 px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 text-sm bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Reservando...' : 'Reservar'}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showVenderModal} onClose={() => setShowVenderModal(false)} title="💰 Registrar Venta">
        <form action={async (formData) => { await handleVender(formData) }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nombre del cliente *</label>
              <input
                type="text"
                name="nombreCliente"
                required
                minLength={2}
                className="w-full bg-[#333] border border-[#444] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                placeholder="Ej: María García"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Teléfono</label>
              <input
                type="tel"
                name="telefonoCliente"
                className="w-full bg-[#333] border border-[#444] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                placeholder="Ej: 2915123456"
              />
            </div>
            <div>
              <label htmlFor="metodoPago" className="block text-sm text-gray-400 mb-1">Método de pago *</label>
              <select
                id="metodoPago"
                name="metodoPago"
                title="Método de pago"
                required
                className="w-full bg-[#333] border border-[#444] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
              >
                <option value="">Seleccionar...</option>
                {METODOS_PAGO.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="precioVenta" className="block text-sm text-gray-400 mb-1">Precio de venta *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  id="precioVenta"
                  type="number"
                  name="precioVenta"
                  required
                  min={0}
                  defaultValue={product.price}
                  title="Precio de venta"
                  placeholder={product.price.toString()}
                  className="w-full bg-[#333] border border-[#444] rounded-lg pl-7 pr-3 py-2 text-white focus:outline-none focus:border-green-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Precio original: ${mounted ? product.price.toLocaleString('es-AR') : product.price}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nota (opcional)</label>
              <textarea
                name="nota"
                rows={2}
                className="w-full bg-[#333] border border-[#444] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 resize-none"
                placeholder="Ej: Pagó con seña de $5000"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowVenderModal(false)}
                className="flex-1 px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Registrando...' : 'Confirmar Venta'}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Eliminar Producto"
        message={`¿Estás seguro de que deseas eliminar "${product.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        type="danger"
      />
    </>
  )
}
