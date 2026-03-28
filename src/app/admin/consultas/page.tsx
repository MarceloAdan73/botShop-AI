'use client'

import { redirect } from 'next/navigation'
import { checkAuth } from '../actions'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MessageCircle, Download, Search, Filter, AlertCircle, CheckCircle, Eye, Trash2 } from 'lucide-react'
import { ConfirmModal } from '@/components/admin/ConfirmModal'

export default function ConsultasPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [conversations, setConversations] = useState<any[]>([])
  const [filteredConversations, setFilteredConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null })
  
  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    async function checkAuthAndFetch() {
      const auth = await checkAuth()
      if (!auth) {
        router.push('/admin')
        return
      }
      setIsAuthenticated(true)
      await fetchConversations()
    }
    
    async function fetchConversations() {
      try {
        const res = await fetch('/api/admin/conversaciones')
        if (res.ok) {
          const data = await res.json()
          setConversations(data.conversaciones || [])
          setFilteredConversations(data.conversaciones || [])
        }
      } catch (error) {
        console.error('Error fetching conversations:', error)
      } finally {
        setLoading(false)
      }
    }
    
    checkAuthAndFetch()

    const interval = setInterval(fetchConversations, 10000)
    return () => clearInterval(interval)
  }, [router])

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...conversations]
    
    // Filtro de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(conv => 
        (conv.nombreCliente?.toLowerCase().includes(searchLower)) ||
        (conv.telefonoCliente?.includes(searchTerm)) ||
        (conv.resumen?.toLowerCase().includes(searchLower))
      )
    }
    
    // Filtro de fecha
    if (dateFilter !== 'all') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
      
      filtered = filtered.filter(conv => {
        const convDate = new Date(conv.fechaInicio)
        switch (dateFilter) {
          case 'today':
            return convDate >= today
          case 'week':
            return convDate >= weekAgo
          case 'month':
            return convDate >= monthAgo
          default:
            return true
        }
      })
    }
    
    // Filtro de estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(conv => 
        statusFilter === 'pending' ? conv.necesitaAtencion : !conv.necesitaAtencion
      )
    }
    
    setFilteredConversations(filtered)
    setCurrentPage(1) // Reset a primera página cuando cambian los filtros
  }, [conversations, searchTerm, dateFilter, statusFilter])

  // Paginación
  const totalPages = Math.ceil(filteredConversations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedConversations = filteredConversations.slice(startIndex, startIndex + itemsPerPage)

  const handleDelete = async () => {
    if (!deleteModal.id) return
    try {
      const res = await fetch(`/api/admin/conversaciones/${deleteModal.id}`, { method: 'DELETE' })
      if (res.ok) {
        setConversations(prev => prev.filter(c => c.id !== deleteModal.id))
      }
    } catch (error) {
      console.error('Error eliminando:', error)
    } finally {
      setDeleteModal({ isOpen: false, id: null })
    }
  }

  // Exportar a CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Cliente', 'Teléfono', 'Fecha', 'Mensajes', 'Necesita Atención', 'Resumen']
    const csvContent = [
      headers.join(','),
      ...filteredConversations.map(conv => [
        conv.id,
        `"${conv.nombreCliente || 'Anónimo'}"`,
        `"${conv.telefonoCliente || ''}"`,
        `"${new Date(conv.fechaInicio).toLocaleString('es-AR')}"`,
        conv.totalMensajes,
        conv.necesitaAtencion ? 'Sí' : 'No',
        `"${(conv.resumen || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `consultas_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <p>Verificando autenticación...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center">
            <Link href="/admin" className="mr-4 text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
              <ArrowLeft className="w-5 h-5" /> Volver
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-purple-400" /> Consultas de Clientes
            </h1>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" /> Exportar CSV
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-[#1F1F1F] p-4 rounded-xl mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, teléfono o resumen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#333] pl-10 pr-4 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-[#333] px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas las fechas</option>
                <option value="today">Hoy</option>
                <option value="week">Últimos 7 días</option>
                <option value="month">Último mes</option>
              </select>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#333] px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="responded">Respondidos</option>
            </select>
          </div>
        </div>

        {/* Tabla de conversaciones */}
        <div className="bg-[#1F1F1F] rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 md:p-12 text-center text-gray-400">
              <p>Cargando conversaciones...</p>
            </div>
          ) : paginatedConversations.length > 0 ? (
            <>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <table className="w-full min-w-[700px]">
                  <thead className="bg-[#2A2A2A]">
                    <tr>
                      <th className="text-left p-3 md:p-4 text-xs md:text-sm font-medium text-gray-400">Cliente</th>
                      <th className="text-left p-3 md:p-4 text-xs md:text-sm font-medium text-gray-400 hidden sm:table-cell">Teléfono</th>
                      <th className="text-left p-3 md:p-4 text-xs md:text-sm font-medium text-gray-400">Fecha</th>
                      <th className="text-center p-3 md:p-4 text-xs md:text-sm font-medium text-gray-400">Msjs</th>
                      <th className="text-center p-3 md:p-4 text-xs md:text-sm font-medium text-gray-400">Estado</th>
                      <th className="text-center p-3 md:p-4 text-xs md:text-sm font-medium text-gray-400">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedConversations.map((conv) => (
                      <tr key={conv.id} className="border-t border-[#333] hover:bg-[#2A2A2A] transition">
                        <td className="p-3 md:p-4">
                          <div className="font-medium text-sm">{conv.nombreCliente || 'Anónimo'}</div>
                          {conv.resumen && (
                            <div className="text-[10px] md:text-xs text-gray-500 mt-1 truncate max-w-[150px] md:max-w-xs">
                              {conv.resumen}
                            </div>
                          )}
                        </td>
                        <td className="p-3 md:p-4 text-gray-300 hidden sm:table-cell text-sm">
                          {conv.telefonoCliente || '-'}
                        </td>
                        <td className="p-3 md:p-4 text-gray-400 text-xs md:text-sm whitespace-nowrap">
                          {new Date(conv.fechaInicio).toLocaleDateString('es-AR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="p-3 md:p-4 text-center">
                          <span className="bg-blue-900 text-blue-300 px-1.5 md:px-2 py-1 rounded text-xs">
                            {conv.totalMensajes}
                          </span>
                        </td>
                        <td className="p-3 md:p-4 text-center">
                          {conv.necesitaAtencion ? (
                            <span className="text-amber-400 text-[10px] md:text-xs px-1.5 md:px-2 py-1 border border-amber-400 rounded flex items-center gap-1 justify-center">
                              <AlertCircle className="w-3 h-3 md:w-3.5 md:h-3.5" /> <span className="hidden md:inline">Pendiente</span>
                            </span>
                          ) : (
                            <span className="text-emerald-400 text-[10px] md:text-xs px-1.5 md:px-2 py-1 border border-emerald-400 rounded flex items-center gap-1 justify-center">
                              <CheckCircle className="w-3 h-3 md:w-3.5 md:h-3.5" /> <span className="hidden md:inline">Respondido</span>
                            </span>
                          )}
                        </td>
                        <td className="p-3 md:p-4 text-center">
                          <div className="flex items-center justify-center gap-1 md:gap-2">
                            <Link
                              href={`/admin/consultas/${conv.id}`}
                              className="text-blue-400 hover:text-blue-300 text-xs md:text-sm flex items-center gap-1 p-1"
                            >
                              <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" /> <span className="hidden sm:inline">Ver</span>
                            </Link>
                            <button
                              onClick={() => setDeleteModal({ isOpen: true, id: conv.id })}
                              className="text-red-400 hover:text-red-300 text-xs md:text-sm flex items-center gap-1 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 p-4 border-t border-[#333]">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded bg-[#333] hover:bg-[#444] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Anterior
                  </button>
                  
                  <span className="text-gray-400 text-sm">
                    Página {currentPage} de {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded bg-[#333] hover:bg-[#444] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center text-gray-400">
              <p>No hay consultas registradas con los filtros aplicados.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Eliminar Consulta"
        message="¿Estás seguro de que deseas eliminar esta conversación? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        type="danger"
      />
    </div>
  )
}
