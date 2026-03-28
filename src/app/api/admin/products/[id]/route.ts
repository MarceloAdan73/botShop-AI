import { NextRequest, NextResponse } from 'next/server'
import { ProductModel, CategoryModel } from '@/lib/models'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { join } from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const product = ProductModel.findByIdWithCategory(id)

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const formData = await request.formData()
    
    const name = (formData.get('name') as string)?.trim()
    const description = (formData.get('description') as string)?.trim()
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string) || 0
    const categorySlug = formData.get('category') as string
    const imageFile = formData.get('image') as File | null
    const sizes = formData.getAll('sizes') as string[]
    const talles = sizes.length > 0 ? sizes.join(', ') : ''

    if (!name || name.length < 2) {
      return NextResponse.json({ error: 'El nombre debe tener al menos 2 caracteres' }, { status: 400 })
    }
    if (isNaN(price) || price < 0) {
      return NextResponse.json({ error: 'El precio debe ser un número positivo' }, { status: 400 })
    }
    if (stock < 0) {
      return NextResponse.json({ error: 'El stock no puede ser negativo' }, { status: 400 })
    }

    const category = CategoryModel.findBySlug(categorySlug)
    if (!category) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 400 })
    }

    const currentProduct = ProductModel.findById(id)
    if (!currentProduct) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    let imageUrl = currentProduct.imageUrl

    if (imageFile && imageFile.size > 0) {
      if (currentProduct.imageUrl) {
        const oldPath = join(process.cwd(), 'public', currentProduct.imageUrl)
        try {
          await unlink(oldPath)
        } catch (e) {
        }
      }

      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const extension = imageFile.type.split('/')[1] || 'jpg'
      const filename = `${id}.${extension}`
      const uploadDir = join(process.cwd(), 'public', 'productos')
      const filepath = join(uploadDir, filename)

      await mkdir(uploadDir, { recursive: true })
      await writeFile(filepath, buffer)
      
      imageUrl = `/productos/${filename}`
    }

    ProductModel.update(id, {
      name,
      description,
      price,
      stock,
      categoryId: category.id,
      imageUrl,
      talles
    })

    return NextResponse.json({ success: true, message: 'Producto actualizado' })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const product = ProductModel.findById(id)
    if (product?.imageUrl) {
      const imagePath = join(process.cwd(), 'public', product.imageUrl)
      try {
        await unlink(imagePath)
      } catch (e) {
      }
    }

    ProductModel.delete(id)
    return NextResponse.json({ success: true, message: 'Producto eliminado' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 })
  }
}
