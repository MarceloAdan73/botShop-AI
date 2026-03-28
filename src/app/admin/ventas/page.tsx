'use client'

import { redirect } from 'next/navigation'
import { checkAuth } from '../actions'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BarChart2, DollarSign, Calendar, TrendingUp, Trash2 } from 'lucide-react'
import { ConfirmModal } from '@/components/admin/ConfirmModal'

interface Venta {
  id: number
  productoId: string
  nombreCliente: string
  telefonoCliente?: string
  metodoPago?: string
  precioVenta?: number
  nota?: string
  fechaVenta: string
  producto?: {
    name: string
    imageUrl?: string
  }
}

interface Stats {
  totalVentas: number
  montoTotal: number
  ventasHoy: number
  montoHoy: number
  ventasSemana: number
  montoSemana: number
  ventasMes: number
  montoMes: number
}

export default function VentasPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [ventas, setVentas] = useState<Venta[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null })

  useEffect(() => {
    async function checkAuthAndFetch() {
      const auth = await checkAuth()
      if (!auth) {
        router.push('/admin')
        return
      }
      setIsAuthenticated(true)

      try {
        const res = await fetch('/api/admin/ventas')
        if (res.ok) {
          const data = await res.json()
          setVentas(data.ventas || [])
          setStats(data.stats)
        }
      } catch (error) {
        console.error('Error fetching ventas:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetch()
  }, [router])

  const handleDelete = async () => {
    if (!deleteModal.id) return
    try {
      const res = await fetch(`/api/admin/ventas/${deleteModal.id}`, { method: 'DELETE' })
      if (res.ok) {
        setVentas(prev => prev.filter(v => v.id !== deleteModal.id))
      }
    } catch (error) {
      console.error('Error eliminando:', error)
    } finally {
      setDeleteModal({ isOpen: false, id: null })
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <p>Verificando autenticación...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" /> Volver
            </Link>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-purple-400" /> Historial de Ventas
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#1F1F1F] rounded-xl p-4 border border-[#333] hover:border-blue-500/50 transition-colors">
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Total Ventas
            </p>
            <p className="text-2xl font-bold text-white">{stats?.totalVentas || 0}</p>
          </div>
          <div className="bg-[#1F1F1F] rounded-xl p-4 border border-[#333] hover:border-emerald-500/50 transition-colors">
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Monto Total
            </p>
            <p className="text-2xl font-bold text-emerald-400">${(stats?.montoTotal || 0).toLocaleString()}</p>
          </div>
          <div className="bg-[#1F1F1F] rounded-xl p-4 border border-[#333] hover:border-blue-500/50 transition-colors">
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Ventas Hoy
            </p>
            <p className="text-2xl font-bold text-blue-400">{stats?.ventasHoy || 0}</p>
          </div>
          <div className="bg-[#1F1F1F] rounded-xl p-4 border border-[#333] hover:border-purple-500/50 transition-colors">
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <BarChart2 className="w-4 h-4" /> Este Mes
            </p>
            <p className="text-2xl font-bold text-purple-400">${(stats?.montoMes || 0).toLocaleString()}</p>
          </div>
        </div>

        {loading ? (
          <div className="bg-[#1F1F1F] rounded-xl p-8 md:p-12 text-center">
            <p className="text-gray-400">Cargando ventas...</p>
          </div>
        ) : ventas.length > 0 ? (
          <div className="bg-[#1F1F1F] rounded-xl overflow-hidden">
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <table className="w-full min-w-[600px]">
                <thead className="bg-[#2A2A2A]">
                  <tr className="text-left text-xs md:text-sm text-gray-400">
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Pago</th>
                    <th className="px-4 py-3 text-right">Precio</th>
                    <th className="px-4 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#333]">
                  {ventas.map((venta) => (
                    <tr key={venta.id} className="hover:bg-[#252525] transition-colors">
                      <td className="px-4 py-3 text-xs md:text-sm whitespace-nowrap">
                        {new Date(venta.fechaVenta).toLocaleDateString('es-AR')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 md:gap-3">
                          {venta.producto?.imageUrl && (
                            <img 
                              src={venta.producto.imageUrl} 
                              alt="" 
                              className="w-8 h-8 md:w-10 md:h-10 rounded object-cover flex-shrink-0"
                            />
                          )}
                          <span className="text-xs md:text-sm truncate max-w-[120px] md:max-w-none">
                            {venta.producto?.name || 'Producto eliminado'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs md:text-sm">{venta.nombreCliente}</p>
                        {venta.telefonoCliente && (
                          <p className="text-[10px] md:text-xs text-gray-500">{venta.telefonoCliente}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs md:text-sm whitespace-nowrap">
                        {venta.metodoPago}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-green-400 text-xs md:text-sm whitespace-nowrap">
                        ${venta.precioVenta?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, id: venta.id })}
                          className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1.5 mx-auto p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-[#1F1F1F] rounded-xl p-12 text-center">
            <p className="text-gray-400">No hay ventas registradas todavía.</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Eliminar Venta"
        message="¿Estás seguro de que deseas eliminar esta venta? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        type="danger"
      />
    </div>
  )
}
