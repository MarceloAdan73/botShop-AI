import { NextRequest, NextResponse } from 'next/server'
import { ProductModel } from '@/lib/models'

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 })
    }

    const product = ProductModel.findById(id)
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    const newProduct = ProductModel.create({
      name: `${product.name} (Copia)`,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl
    })

    return NextResponse.json({ success: true, message: 'Producto duplicado', product: newProduct })
  } catch (error) {
    console.error('Error duplicando producto:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}