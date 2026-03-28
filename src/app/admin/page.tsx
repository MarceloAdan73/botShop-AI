'use client'

import { checkAuth, getDashboardStats, logout } from './actions'
import LoginForm from './login-form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  Package, 
  MessageCircle, 
  AlertTriangle, 
  PlusCircle, 
  Edit3, 
  Eye, 
  LogOut,
  TrendingUp,
  ShoppingCart,
  Bookmark
} from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [stats, setStats] = useState<{
    totalProducts: number;
    lowStockProducts: number;
    pendingConversations: number;
    totalConversations: number;
    ventasHoy?: number;
    montoHoy?: number;
    reservasActivas?: number;
    productosDisponibles?: number;
    productosPorCategoria?: { categoryId: string; categoryName: string; count: number }[];
  } | null>(null)
  const [prevReservas, setPrevReservas] = useState<number>(0)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    let currentPrevReservas = prevReservas

    async function checkAuthAndLoadStats() {
      const auth = await checkAuth()
      setIsAuthenticated(auth)
      if (auth) {
        const dashboardStats = await getDashboardStats()
        if (dashboardStats) {
          setStats(dashboardStats)
          currentPrevReservas = dashboardStats.reservasActivas || 0
          setPrevReservas(currentPrevReservas)
        }
      }
    }
    checkAuthAndLoadStats()

    const interval = setInterval(async () => {
      const dashboardStats = await getDashboardStats()
      if (dashboardStats) {
        const nuevasReservas = (dashboardStats.reservasActivas || 0) - currentPrevReservas
        if (nuevasReservas > 0) {
          setShowNotification(true)
          setTimeout(() => setShowNotification(false), 5000)
          router.refresh()
        }
        setStats(dashboardStats)
        currentPrevReservas = dashboardStats.reservasActivas || 0
        setPrevReservas(currentPrevReservas)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white p-6 flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white p-6 flex items-center justify-center">
        <LoginForm />
      </div>
    )
  }

  const totalProducts = stats?.totalProducts || 0
  const pendingConversations = stats?.pendingConversations || 0
  const lowStockProducts = stats?.lowStockProducts || 0

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-6">
      {showNotification && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto bg-amber-600 text-white px-4 sm:px-6 py-3 rounded-lg shadow-lg z-50 flex items-center justify-center sm:justify-start gap-2 animate-bounce">
          <Bookmark className="w-5 h-5" />
          <span>Nueva reserva recibida!</span>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Panel de Administración</h1>
          <p className="text-gray-400 mt-1">Gestión de productos y ventas</p>
        </div>
        <form action={logout}>
          <button type="submit" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm md:text-base">
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-[#1F1F1F] p-4 md:p-6 rounded-xl flex items-center space-x-3 md:space-x-4 border border-[#333] hover:border-blue-500/50 transition-colors">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-blue-600/20 flex items-center justify-center flex-shrink-0">
            <Package className="w-6 h-6 md:w-7 md:h-7 text-blue-400" />
          </div>
          <div>
            <p className="text-gray-400 text-xs md:text-sm">Productos Totales</p>
            <p className="text-xl md:text-2xl font-bold">{totalProducts}</p>
          </div>
        </div>
        <div className="bg-[#1F1F1F] p-4 md:p-6 rounded-xl flex items-center space-x-3 md:space-x-4 border border-[#333] hover:border-purple-500/50 transition-colors">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-purple-600/20 flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-purple-400" />
          </div>
          <div>
            <p className="text-gray-400 text-xs md:text-sm">Consultas Pendientes</p>
            <p className="text-xl md:text-2xl font-bold">{pendingConversations}</p>
          </div>
        </div>
        <div className="bg-[#1F1F1F] p-4 md:p-6 rounded-xl flex items-center space-x-3 md:space-x-4 border border-[#333] hover:border-amber-500/50 transition-colors sm:col-span-2 lg:col-span-1">
          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${lowStockProducts > 0 ? 'bg-amber-600/20' : 'bg-emerald-600/20'}`}>
            {lowStockProducts > 0 ? (
              <AlertTriangle className="w-6 h-6 md:w-7 md:h-7 text-amber-400" />
            ) : (
              <TrendingUp className="w-6 h-6 md:w-7 md:h-7 text-emerald-400" />
            )}
          </div>
          <div>
            <p className="text-gray-400 text-xs md:text-sm">{lowStockProducts > 0 ? 'Stock Bajo' : 'Stock OK'}</p>
            <p className={`text-xl md:text-2xl font-bold ${lowStockProducts > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {lowStockProducts > 0 ? lowStockProducts : 'OK'}
            </p>
          </div>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-[#1F1F1F] p-3 md:p-4 rounded-xl border border-[#333]">
            <p className="text-gray-400 text-xs">Ventas Hoy</p>
            <p className="text-lg md:text-xl font-bold text-emerald-400">{stats.ventasHoy}</p>
          </div>
          <div className="bg-[#1F1F1F] p-3 md:p-4 rounded-xl border border-[#333]">
            <p className="text-gray-400 text-xs">Monto Hoy</p>
            <p className="text-lg md:text-xl font-bold text-emerald-400">${(stats.montoHoy ?? 0).toLocaleString()}</p>
          </div>
          <div className="bg-[#1F1F1F] p-3 md:p-4 rounded-xl border border-[#333]">
            <p className="text-gray-400 text-xs">Reservas Activas</p>
            <p className="text-lg md:text-xl font-bold text-amber-400">{stats.reservasActivas ?? 0}</p>
          </div>
          <div className="bg-[#1F1F1F] p-3 md:p-4 rounded-xl border border-[#333]">
            <p className="text-gray-400 text-xs">Disponibles</p>
            <p className="text-lg md:text-xl font-bold text-blue-400">{stats.productosDisponibles ?? 0}</p>
          </div>
        </div>
      )}

      <div className="bg-[#1F1F1F] p-4 md:p-6 rounded-xl mb-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
          <Link 
            href="/admin/nuevo"
            className="bg-blue-600 hover:bg-blue-700 px-3 md:px-4 py-2 md:py-3 rounded-lg flex items-center justify-center gap-1.5 md:gap-2 transition-colors text-xs md:text-sm"
          >
            <PlusCircle className="w-4 h-4" /> Nuevo
          </Link>
          <Link 
            href="/admin/productos"
            className="bg-emerald-600 hover:bg-emerald-700 px-3 md:px-4 py-2 md:py-3 rounded-lg flex items-center justify-center gap-1.5 md:gap-2 transition-colors text-xs md:text-sm"
          >
            <Edit3 className="w-4 h-4" /> Productos
          </Link>
          <Link 
            href="/admin/ventas"
            className="bg-violet-600 hover:bg-violet-700 px-3 md:px-4 py-2 md:py-3 rounded-lg flex items-center justify-center gap-1.5 md:gap-2 transition-colors text-xs md:text-sm"
          >
            <ShoppingCart className="w-4 h-4" /> Ventas
          </Link>
          <Link 
            href="/admin/reservas"
            className="bg-amber-600 hover:bg-amber-700 px-3 md:px-4 py-2 md:py-3 rounded-lg flex items-center justify-center gap-1.5 md:gap-2 transition-colors text-xs md:text-sm"
          >
            <Bookmark className="w-4 h-4" /> Reservas
          </Link>
          <Link 
            href="/admin/consultas"
            className="bg-purple-600 hover:bg-purple-700 px-3 md:px-4 py-2 md:py-3 rounded-lg flex items-center justify-center gap-1.5 md:gap-2 transition-colors text-xs md:text-sm col-span-2 md:col-span-1"
          >
            <Eye className="w-4 h-4" /> Consultas
          </Link>
        </div>
      </div>
    </div>
  )
}
