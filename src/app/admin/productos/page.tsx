import { redirect } from 'next/navigation'
import { checkAuth } from '../actions'
import { ProductModel, CategoryModel, ReservaModel } from '@/lib/models'
import { ProductosClient } from '@/components/admin/ProductosClient'

export default async function ProductosPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) redirect('/admin')

  ReservaModel.markExpiredAsVencida();

  const params = await searchParams
  const query = (params.q as string) || ''
  const estadoFilter = (params.estado as string) || ''

  const allProducts = ProductModel.findAll().map(p => ({
    ...p,
    category: CategoryModel.findById(p.categoryId) ?? undefined
  }))

  const allCategories = CategoryModel.findAll()

  const productsPorCategoria = allCategories.map(cat => ({
    ...cat,
    productos: allProducts.filter(p => p.categoryId === cat.id)
  }))

  let filteredProducts = allProducts
  if (query) {
    const lowerQuery = query.toLowerCase()
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      (p.description && p.description.toLowerCase().includes(lowerQuery))
    )
  }
  
  if (estadoFilter) {
    filteredProducts = filteredProducts.filter(p => p.estado === estadoFilter)
  }

  const filteredProductsPorCategoria = allCategories.map(cat => ({
    ...cat,
    productos: filteredProducts.filter(p => p.categoryId === cat.id)
  }))

  const stats = ProductModel.countByEstado()

  return (
    <ProductosClient
      allProducts={allProducts}
      filteredProducts={filteredProducts}
      productsPorCategoria={productsPorCategoria}
      filteredProductsPorCategoria={filteredProductsPorCategoria}
      categories={allCategories}
      totalProducts={filteredProducts.length}
      stats={stats}
      query={query}
      estadoFilter={estadoFilter}
    />
  )
}
