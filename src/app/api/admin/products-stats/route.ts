import { NextResponse } from 'next/server';
import { ProductModel, CategoryModel, ReservaModel } from '@/lib/models';

export async function GET() {
  try {
    ReservaModel.markExpiredAsVencida();

    const allProducts = ProductModel.findAll().map(p => ({
      ...p,
      category: CategoryModel.findById(p.categoryId) ?? undefined
    }));

    const allCategories = CategoryModel.findAll();

    const productsPorCategoria = allCategories.map(cat => ({
      ...cat,
      productos: allProducts.filter(p => p.categoryId === cat.id)
    }));

    const stats = ProductModel.countByEstado();

    return NextResponse.json({
      products: allProducts,
      productsPorCategoria,
      totalProducts: allProducts.length,
      stats,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error en products-stats:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
