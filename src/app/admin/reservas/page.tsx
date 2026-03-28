'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { checkAuth } from '../actions'
import { ConfirmModal } from '@/components/admin/ConfirmModal'
import { ArrowLeft, Bookmark, AlertTriangle, User, Calendar, Clock, DollarSign, Trash2, RefreshCw } from 'lucide-react'

interface Reserva {
  id: number
  productoId: string
  nombreCliente: string
  telefonoCliente?: string
  fechaReserva: string
  fechaVencimiento?: string
  nota?: string
  estado: string
  producto?: {
    id: string
    name: string
    price: number
    imageUrl?: string
    categoryId: string
    category?: { name: string }
  }
}

export default function ReservasPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [reservasActivas, setReservasActivas] = useState<Reserva[]>([])
  const [reservasVencidas, setReservasVencidas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; reserva: Reserva | null }>({ isOpen: false, reserva: null })
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  useEffect(() => {
    async function checkAuthAndFetch() {
      const auth = await checkAuth()
      if (!auth) {
        router.push('/admin')
        return
      }
      setIsAuthenticated(true)
      await fetchReservas()
    }
    checkAuthAndFetch()

    const interval = setInterval(fetchReservas, 10000)
    return () => clearInterval(interval)
  }, [router])

  const fetchReservas = async () => {
    try {
      const res = await fetch('/api/admin/reservas')
      if (res.ok) {
        const data = await res.json()
        setReservasActivas(data.reservasActivas || [])
        setReservasVencidas(data.reservasVencidas || [])
      }
    } catch (error) {
      console.error('Error fetching reservas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteModal.reserva) return
    setActionLoading(deleteModal.reserva.id)
    
    try {
      const res = await fetch(`/api/admin/reservas/${deleteModal.reserva.id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        await fetchReservas()
        router.refresh()
      }
    } catch (error) {
      console.error('Error eliminando reserva:', error)
    } finally {
      setActionLoading(null)
      setDeleteModal({ isOpen: false, reserva: null })
    }
  }

  const handleLiberar = async (reserva: Reserva) => {
    setActionLoading(reserva.id)
    try {
      const res = await fetch('/api/admin/product-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'liberar', productId: reserva.productoId })
      })
      if (res.ok) {
        await fetchReservas()
        router.refresh()
      }
    } catch (error) {
      console.error('Error liberando reserva:', error)
    } finally {
      setActionLoading(null)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <p>Verificando autenticación...</p>
      </div>
    )
  }

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" /> Volver
            </Link>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-amber-400" /> Reservas
            </h1>
          </div>
          <button
            onClick={fetchReservas}
            className="px-4 py-2 bg-[#333] hover:bg-[#444] rounded-lg text-sm flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Actualizar
          </button>
        </div>

        {loading ? (
          <div className="bg-[#1F1F1F] rounded-xl p-12 text-center">
            <p className="text-gray-400">Cargando reservas...</p>
          </div>
        ) : (
          <>
            {reservasVencidas.length > 0 && (
              <div className="mb-6 bg-red-900/30 border border-red-700 rounded-xl p-4">
                <h2 className="text-lg font-semibold text-red-400 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Reservas Vencidas ({reservasVencidas.length})
                </h2>
                <p className="text-sm text-gray-300 mb-4">Estas reservas expiraron y deberían ser liberadas o eliminadas.</p>
                <div className="space-y-2">
                  {reservasVencidas.map((reserva) => (
                    <div key={reserva.id} className="flex items-center justify-between bg-[#1F1F1F] rounded-lg p-3">
                      <div>
                        <p className="font-medium">{reserva.producto?.name}</p>
                        <p className="text-sm text-gray-400">
                          {reserva.nombreCliente} - Venció: {reserva.fechaVencimiento ? new Date(reserva.fechaVencimiento).toLocaleDateString('es-AR') : 'N/A'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleLiberar(reserva)}
                          disabled={actionLoading === reserva.id}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors disabled:opacity-50"
                        >
                          Liberar
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, reserva })}
                          disabled={actionLoading === reserva.id}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <h2 className="text-lg font-semibold text-amber-400 flex items-center gap-2">
                <Bookmark className="w-5 h-5" /> Reservas Activas ({reservasActivas.length})
              </h2>
            </div>

            {reservasActivas.length > 0 ? (
              <div className="space-y-4">
                {reservasActivas.map((reserva) => {
                  const vence = reserva.fechaVencimiento ? new Date(reserva.fechaVencimiento) : null
                  const diasRestantes = vence ? Math.ceil((vence.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)) : null
                  const estaPorVencer = diasRestantes !== null && diasRestantes <= 1 && diasRestantes >= 0

                  return (
                    <div key={reserva.id} className="bg-[#1F1F1F] rounded-xl p-3 md:p-6">
                      <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                        {reserva.producto?.imageUrl && (
                          <img 
                            src={reserva.producto.imageUrl} 
                            alt="" 
                            className="w-full sm:w-32 h-32 sm:h-auto aspect-square sm:aspect-auto object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div>
                              <h3 className="font-semibold text-base md:text-lg">{reserva.producto?.name}</h3>
                              <p className="text-gray-400 text-xs md:text-sm">{reserva.producto?.category?.name}</p>
                            </div>
                            <span className={`px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm ${
                              estaPorVencer ? 'bg-yellow-900/50 text-yellow-400' : 'bg-green-900/50 text-green-400'
                            }`}>
                              {estaPorVencer ? '⚡ Por vencer' : 'Activa'}
                            </span>
                          </div>
                          
                          <div className="mt-3 md:mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                            <div>
                              <p className="text-gray-500 text-[10px] md:text-xs flex items-center gap-1">
                                <User className="w-3 h-3" /> CLIENTE
                              </p>
                              <p className="font-medium text-sm">{reserva.nombreCliente}</p>
                              {reserva.telefonoCliente && (
                                <p className="text-xs text-gray-400">{reserva.telefonoCliente}</p>
                              )}
                            </div>
                            <div>
                              <p className="text-gray-500 text-[10px] md:text-xs flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> FECHA RESERVA
                              </p>
                              <p className="font-medium text-sm">{new Date(reserva.fechaReserva).toLocaleDateString('es-AR')}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-[10px] md:text-xs flex items-center gap-1">
                                <Clock className="w-3 h-3" /> VENCIMIENTO
                              </p>
                              <p className={`font-medium text-sm ${estaPorVencer ? 'text-yellow-400' : ''}`}>
                                {vence?.toLocaleDateString('es-AR')}
                                {diasRestantes !== null && (
                                  <span className="text-xs text-gray-400 ml-1 md:ml-2">
                                    ({diasRestantes}d)
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          {reserva.nota && (
                            <div className="mt-3 md:mt-4 p-2 md:p-3 bg-[#2A2A2A] rounded-lg">
                              <p className="text-gray-500 text-[10px] md:text-xs">NOTA</p>
                              <p className="text-xs md:text-sm">{reserva.nota}</p>
                            </div>
                          )}

                          <div className="mt-3 md:mt-4 flex flex-col sm:flex-row flex-wrap gap-2">
                            <span className="text-base md:text-lg flex items-center gap-1 md:gap-2">
                              <DollarSign className="w-4 h-4 text-emerald-400" />
                              ${reserva.producto?.price.toLocaleString()}
                            </span>
                            <div className="flex flex-wrap gap-2 sm:ml-auto">
                              <button
                                onClick={() => setDeleteModal({ isOpen: true, reserva })}
                                disabled={actionLoading === reserva.id}
                                className="px-2 md:px-3 py-1.5 md:py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs md:text-sm transition-colors disabled:opacity-50 flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3 md:w-4 md:h-4" /> <span className="hidden sm:inline">Eliminar</span>
                              </button>
                              <button
                                onClick={() => handleLiberar(reserva)}
                                disabled={actionLoading === reserva.id}
                                className="px-2 md:px-3 py-1.5 md:py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-xs md:text-sm transition-colors disabled:opacity-50 flex items-center gap-1"
                              >
                                <RefreshCw className="w-3 h-3 md:w-4 md:h-4" /> <span className="hidden sm:inline">Liberar</span>
                              </button>
                              <Link 
                                href={`/admin/productos?estado=reservado`}
                                className="px-3 md:px-4 py-1.5 md:py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-xs md:text-sm transition-colors flex items-center gap-1"
                              >
                                <DollarSign className="w-3 h-3 md:w-4 md:h-4" /> <span className="hidden sm:inline">Vender</span><span className="sm:hidden">$</span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-[#1F1F1F] rounded-xl p-12 text-center">
                <p className="text-gray-400">No hay reservas activas.</p>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, reserva: null })}
        onConfirm={handleDelete}
        title="Eliminar Reserva"
        message={`¿Estás seguro de que deseas eliminar la reserva de "${deleteModal.reserva?.nombreCliente}"? Esta acción liberará el producto y no se puede deshacer.`}
        confirmText="Eliminar"
        type="danger"
      />
    </div>
  )
}
