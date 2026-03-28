'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ProductCard } from '@/components/admin/ProductCard'
import type { Product, Category } from '@/lib/models'
import { Search, Plus, BarChart2, Bookmark, Package, Shirt } from 'lucide-react'

interface CategoryWithProducts extends Category {
  productos: (Product & { category?: Category })[]
}

interface ProductosClientProps {
  allProducts: (Product & { category?: Category })[]
  filteredProducts: (Product & { category?: Category })[]
  productsPorCategoria: CategoryWithProducts[]
  filteredProductsPorCategoria: CategoryWithProducts[]
  categories: Category[]
  totalProducts: number
  stats: { disponible: number; reservado: number; vendido: number; total: number }
  query: string
  estadoFilter: string
}

export function ProductosClient({ 
  allProducts: initialAllProducts,
  filteredProducts: initialFilteredProducts,
  productsPorCategoria: initialProductsPorCategoria,
  filteredProductsPorCategoria: initialFilteredProductsPorCategoria,
  categories,
  totalProducts: initialTotalProducts,
  stats: initialStats,
  query,
  estadoFilter
}: ProductosClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>('todos')
  const [searchQuery, setSearchQuery] = useState(query)
  
  const [allProducts, setAllProducts] = useState(initialAllProducts)
  const [filteredProducts, setFilteredProducts] = useState(initialFilteredProducts)
  const [productsPorCategoria, setProductsPorCategoria] = useState(initialProductsPorCategoria)
  const [filteredProductsPorCategoria, setFilteredProductsPorCategoria] = useState(initialFilteredProductsPorCategoria)
  const [totalProducts, setTotalProducts] = useState(initialTotalProducts)
  const [stats, setStats] = useState(initialStats)
  const [lastStats, setLastStats] = useState(initialStats)

  useEffect(() => {
    async function fetchFreshData() {
      try {
        const res = await fetch('/api/admin/products-stats')
        if (res.ok) {
          const data = await res.json()
          setAllProducts(data.products)
          setFilteredProducts(data.products)
          setProductsPorCategoria(data.productsPorCategoria)
          setFilteredProductsPorCategoria(data.productsPorCategoria)
          setTotalProducts(data.totalProducts)
          setStats(data.stats)
          setLastStats(data.stats)
        }
      } catch (e) {
        console.error('Error fetching fresh data:', e)
      }
    }
    fetchFreshData()
  }, [])

  useEffect(() => {
    let currentLastStats = lastStats

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/admin/products-stats')
        if (res.ok) {
          const data = await res.json()
          if (data.stats.reservado !== currentLastStats.reservado || 
              data.stats.vendido !== currentLastStats.vendido ||
              data.stats.disponible !== currentLastStats.disponible ||
              data.totalProducts !== totalProducts) {
            currentLastStats = data.stats
            setLastStats(data.stats)
            setStats(data.stats)
            setTotalProducts(data.totalProducts)
            setAllProducts(data.products)
            setFilteredProducts(data.products)
            setProductsPorCategoria(data.productsPorCategoria)
            setFilteredProductsPorCategoria(data.productsPorCategoria)
          }
        }
      } catch (e) {
      }
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const handleReserva = useCallback(async (productId: string, formData: FormData) => {
    const res = await fetch('/api/admin/product-actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reservar', productId, formData: Object.fromEntries(formData) })
    })
    const result = await res.json()
    if (result.success) {
      router.refresh()
    }
    return result
  }, [router])

  const handleVenta = useCallback(async (productId: string, formData: FormData) => {
    const res = await fetch('/api/admin/product-actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'vender', productId, formData: Object.fromEntries(formData) })
    })
    const result = await res.json()
    if (result.success) {
      router.refresh()
    }
    return result
  }, [router])

  const handleLiberar = useCallback(async (productId: string) => {
    const res = await fetch('/api/admin/product-actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'liberar', productId })
    })
    const result = await res.json()
    if (result.success) {
      router.refresh()
    }
    return result
  }, [router])

  const handleDelete = useCallback(async (productId: string) => {
    await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' })
    router.refresh()
  }, [router])

  const handleDuplicate = useCallback(async (productId: string) => {
    await fetch('/api/admin/products/duplicate', {
      method: 'POST',
      body: JSON.stringify({ id: productId })
    })
    router.refresh()
  }, [router])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const q = formData.get('q') as string
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (estadoFilter) params.set('estado', estadoFilter)
    router.push(`/admin/productos?${params.toString()}`)
  }

  const handleEstadoFilter = (estado: string) => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (estado) params.set('estado', estado)
    router.push(`/admin/productos?${params.toString()}`)
  }

  const getCurrentProducts = () => {
    if (activeTab === 'todos') {
      return filteredProducts
    }
    const catData = filteredProductsPorCategoria.find(c => c.slug === activeTab)
    return catData?.productos || []
  }

  const currentProducts = getCurrentProducts()

  const getTabCount = (slug: string) => {
    if (slug === 'todos') return filteredProducts.length
    const catData = filteredProductsPorCategoria.find(c => c.slug === slug)
    return catData?.productos.length || 0
  }

  const tabColors: Record<string, string> = {
    todos: 'bg-gray-700 hover:bg-gray-600',
    mujer: 'bg-pink-600 hover:bg-pink-500',
    hombre: 'bg-blue-600 hover:bg-blue-500',
    ninos: 'bg-green-600 hover:bg-green-500'
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
              ← Volver
            </Link>
            <h1 className="text-xl md:text-2xl font-bold">Productos</h1>
            <span className="text-gray-500 text-sm">({stats.total} total)</span>
          </div>
          
          <Link 
            href="/admin/nuevo"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Nuevo Producto
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-[#1F1F1F] rounded-lg p-3 border border-green-800">
            <div className="flex items-center gap-2 text-green-400 text-sm mb-1">
              <Package className="w-4 h-4" /> Disponibles
            </div>
            <p className="text-2xl font-bold text-green-400">{stats.disponible}</p>
          </div>
          <div className="bg-[#1F1F1F] rounded-lg p-3 border border-yellow-800">
            <div className="flex items-center gap-2 text-yellow-400 text-sm mb-1">
              <Bookmark className="w-4 h-4" /> Reservados
            </div>
            <p className="text-2xl font-bold text-yellow-400">{stats.reservado}</p>
          </div>
          <div className="bg-[#1F1F1F] rounded-lg p-3 border border-red-800">
            <div className="flex items-center gap-2 text-red-400 text-sm mb-1">
              <Shirt className="w-4 h-4" /> Vendidos
            </div>
            <p className="text-2xl font-bold text-red-400">{stats.vendido}</p>
          </div>
          <div className="bg-[#1F1F1F] rounded-lg p-3 border border-purple-800">
            <div className="flex items-center gap-2 text-purple-400 text-sm mb-1">
              <Shirt className="w-4 h-4" /> Total
            </div>
            <p className="text-2xl font-bold text-purple-400">{stats.total}</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input 
            type="text" 
            name="q" 
            defaultValue={query}
            placeholder="Buscar productos..." 
            className="bg-[#333] px-4 py-2.5 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
          />
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" /> Buscar
          </button>
        </form>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-gray-500 text-sm px-2 py-2">Categoría:</span>
          <button
            onClick={() => setActiveTab('todos')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeTab === 'todos' ? 'bg-blue-600 text-white' : 'bg-[#333] text-gray-300 hover:bg-[#444]'
            }`}
          >
            Todos ({getTabCount('todos')})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.slug)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                activeTab === cat.slug ? tabColors[cat.slug] : 'bg-[#333] text-gray-300 hover:bg-[#444]'
              }`}
            >
              {cat.icon} {cat.name} ({getTabCount(cat.slug)})
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-gray-500 text-sm px-2 py-2">Estado:</span>
          <button
            onClick={() => handleEstadoFilter('')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              !estadoFilter ? 'bg-green-600 text-white' : 'bg-green-900/50 text-green-300 hover:bg-green-900'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => handleEstadoFilter('disponible')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              estadoFilter === 'disponible' ? 'bg-green-600 text-white' : 'bg-green-900/50 text-green-300 hover:bg-green-900'
            }`}
          >
            Disponibles
          </button>
          <button
            onClick={() => handleEstadoFilter('reservado')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              estadoFilter === 'reservado' ? 'bg-yellow-600 text-white' : 'bg-yellow-900/50 text-yellow-300 hover:bg-yellow-900'
            }`}
          >
            Reservados
          </button>
          <button
            onClick={() => handleEstadoFilter('vendido')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              estadoFilter === 'vendido' ? 'bg-red-600 text-white' : 'bg-red-900/50 text-red-300 hover:bg-red-900'
            }`}
          >
            Vendidos
          </button>
          <div className="flex-1" />
          <Link 
            href="/admin/ventas"
            className="px-3 py-1.5 rounded-lg text-sm bg-purple-900/50 text-purple-300 hover:bg-purple-900 transition-colors flex items-center gap-1.5"
          >
            <BarChart2 className="w-4 h-4" /> Ver Ventas
          </Link>
          <Link 
            href="/admin/reservas"
            className="px-3 py-1.5 rounded-lg text-sm bg-orange-900/50 text-orange-300 hover:bg-orange-900 transition-colors flex items-center gap-1.5"
          >
            <Bookmark className="w-4 h-4" /> Ver Reservas
          </Link>
        </div>

        {query && (
          <div className="mb-4 text-sm text-gray-400">
            Resultados para &quot;{query}&quot;: {currentProducts.length} productos
          </div>
        )}

        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onReserva={handleReserva}
                onVenta={handleVenta}
                onLiberar={handleLiberar}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#1F1F1F] rounded-xl">
            <p className="text-gray-400 text-lg mb-4">
              {query ? `No hay productos que coincidan con &quot;${query}&quot;` : 'No hay productos en esta categoría'}
            </p>
            {query && (
              <button
                onClick={() => router.push('/admin/productos')}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors mr-2"
              >
                Limpiar búsqueda
              </button>
            )}
            <Link href="/admin/nuevo" className="inline-block bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition-colors">
              Cargar producto
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
