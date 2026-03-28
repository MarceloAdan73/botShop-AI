'use server'

import { ProductModel, CategoryModel, ConversationModel, VentaModel, ReservaModel, type ReservaInfo, type VentaInfo } from '@/lib/models'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { join } from 'path'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'demo123'

const METODOS_PAGO = [
  'Efectivo',
  'Transferencia',
  'Mercado Pago',
  'Tarjeta Débito',
  'Tarjeta Crédito'
]

export async function login(formData: FormData) {
  const password = formData.get('password') as string
  if (password === ADMIN_PASSWORD) {
    (await cookies()).set('admin-auth', 'true', { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 })
    revalidatePath('/admin')
    redirect('/admin')
  } else {
    // Invalid password - remain on login
  }
}

export async function logout() {
  (await cookies()).delete('admin-auth')
  revalidatePath('/admin')
  redirect('/admin')
}

export async function checkAuth() {
  const authCookie = (await cookies()).get('admin-auth')
  return authCookie?.value === 'true'
}

// Product CRUD
export async function createProduct(prevState: any, formData: FormData) {
  try {
    if (!(await checkAuth())) redirect('/admin')

    const name = (formData.get('name') as string)?.trim()
    const description = (formData.get('description') as string)?.trim()
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string) || 0
    const categoryName = formData.get('category') as string
    const imageFile = formData.get('image') as File | null
    const sizes = formData.getAll('sizes') as string[]
    const talles = sizes.length > 0 ? sizes.join(', ') : ''

    // Validaciones
    if (!name || name.length < 2) {
      return { success: false, message: '❌ El nombre debe tener al menos 2 caracteres' }
    }
    if (isNaN(price) || price < 0) {
      return { success: false, message: '❌ El precio debe ser un número positivo' }
    }
    if (stock < 0) {
      return { success: false, message: '❌ El stock no puede ser negativo' }
    }
    if (!categoryName) {
      return { success: false, message: '❌ Debes seleccionar una categoría' }
    }

    // Ensure default categories exist
    const defaultCategories = [
      { name: 'Mujer', slug: 'mujer', icon: '👗' },
      { name: 'Hombre', slug: 'hombre', icon: '👔' },
      { name: 'Niños', slug: 'ninos', icon: '🧒' },
    ];

    for (const cat of defaultCategories) {
      const exists = CategoryModel.findBySlug(cat.slug);
      if (!exists) {
        CategoryModel.create(cat);
      }
    }

    const category = CategoryModel.findBySlug(categoryName)

    if (!category) {
      return { success: false, message: `❌ La categoría "${categoryName}" no existe` }
    }

    const product = ProductModel.create({
      name,
      description,
      price,
      stock,
      categoryId: category.id,
      talles: talles || undefined,
      imageUrl: undefined
    })
    
    let imageUrl: string | undefined = undefined
    
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const mimeExt = imageFile.type.split('/')[1] || 'jpg'
      const safeExt = mimeExt.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4) || 'jpg'
      const filename = `${product.id}.${safeExt}`
      const uploadDir = join(process.cwd(), 'public', 'productos')
      const filepath = join(uploadDir, filename)

      await mkdir(uploadDir, { recursive: true })
      await writeFile(filepath, buffer)
      
      imageUrl = `/productos/${filename}`
      ProductModel.update(product.id, { imageUrl })
      
      console.log('✅ Imagen guardada:', filepath, '->', imageUrl)
    }
    
    console.log('✅ Producto creado:', product.id, 'imagen:', imageUrl)

    revalidatePath('/admin/productos')
    revalidatePath('/admin')
    return { success: true, message: '✅ Producto guardado' }
  } catch (error) {
    console.error(error)
    return { success: false, message: '❌ Algo salió mal, intentá de nuevo' }
  }
}

export async function updateProduct(id: string, prevState: any, formData: FormData) {
  try {
    if (!(await checkAuth())) redirect('/admin')

    const name = (formData.get('name') as string)?.trim()
    const description = (formData.get('description') as string)?.trim()
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string) || 0
    const categoryName = formData.get('category') as string
    const imageFile = formData.get('image') as File | null
    const sizes = formData.getAll('sizes') as string[]
    const talles = sizes.length > 0 ? sizes.join(', ') : ''

    // Validaciones
    if (!name || name.length < 2) {
      return { success: false, message: '❌ El nombre debe tener al menos 2 caracteres' }
    }
    if (isNaN(price) || price < 0) {
      return { success: false, message: '❌ El precio debe ser un número positivo' }
    }
    if (stock < 0) {
      return { success: false, message: '❌ El stock no puede ser negativo' }
    }
    if (!categoryName) {
      return { success: false, message: '❌ Debes seleccionar una categoría' }
    }

    // Ensure default categories exist
    const defaultCategories = [
      { name: 'Mujer', slug: 'mujer', icon: '👗' },
      { name: 'Hombre', slug: 'hombre', icon: '👔' },
      { name: 'Niños', slug: 'ninos', icon: '🧒' },
    ];

    for (const cat of defaultCategories) {
      const exists = CategoryModel.findBySlug(cat.slug);
      if (!exists) {
        CategoryModel.create(cat);
      }
    }

    const category = CategoryModel.findBySlug(categoryName)

    if (!category) {
      return { success: false, message: `❌ La categoría "${categoryName}" no existe` }
    }

    const currentProduct = ProductModel.findById(id)

    if (!currentProduct) {
      return { success: false, message: '❌ Producto no encontrado' }
    }

    let imageUrl = currentProduct.imageUrl

    if (imageFile && imageFile.size > 0) {
      if (imageUrl) {
        const oldPath = join(process.cwd(), 'public', imageUrl)
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
    revalidatePath('/admin')
    return { success: true, message: '✅ Producto actualizado' }
  } catch (error) {
    console.error(error)
    return { success: false, message: '❌ Algo salió mal, intentá de nuevo' }
  }
}

export async function deleteProduct(prevState: any, formData: FormData) {
  try {
    if (!(await checkAuth())) redirect('/admin')

    const id = formData.get('id') as string
    if (!id) {
      return { success: false, message: '❌ ID no encontrado' }
    }

    const product = ProductModel.findById(id)
    if (product?.imageUrl) {
      const imagePath = join(process.cwd(), 'public', product.imageUrl)
      try {
        await unlink(imagePath)
      } catch (e) {

      }
    }

    ProductModel.delete(id)
    revalidatePath('/admin')
    return { success: true, message: '🗑️ Producto eliminado' }
  } catch (error) {
    console.error(error)
    return { success: false, message: '❌ Error al eliminar' }
  }
}

export async function duplicateProduct(prevState: any, formData: FormData) {
  try {
    if (!(await checkAuth())) redirect('/admin')

    const id = formData.get('id') as string
    if (!id) {
      return { success: false, message: '❌ ID no encontrado' }
    }

    const product = ProductModel.findById(id)
    if (!product) {
      return { success: false, message: '❌ Producto no encontrado' }
    }

    const newProduct = ProductModel.create({
      name: `${product.name} (Copia)`,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl // Copiar misma imagen
    })

    revalidatePath('/admin')
    return { success: true, message: '✅ Producto duplicado' }
  } catch (error) {
    console.error(error)
    return { success: false, message: '❌ Error al duplicar' }
  }
}

// Category CRUD
export async function createCategory(formData: FormData) {
  if (!(await checkAuth())) redirect('/admin')

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const icon = formData.get('icon') as string

  CategoryModel.create({
    name,
    slug,
    icon,
  })
  revalidatePath('/admin')
}

export async function updateCategory(id: string, formData: FormData) {
  if (!(await checkAuth())) redirect('/admin')

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const icon = formData.get('icon') as string

  CategoryModel.update(id, {
    name,
    slug,
    icon,
  })
  revalidatePath('/admin')
}

export async function deleteCategory(id: string) {
  try {
    if (!(await checkAuth())) redirect('/admin')

    const result = CategoryModel.delete(id)
    if (!result.success) {
      return { success: false, message: `❌ No se puede eliminar: hay ${result.productCount} productos en esta categoría` }
    }
    revalidatePath('/admin')
    return { success: true, message: '🗑️ Categoría eliminada' }
  } catch (error) {
    console.error(error)
    return { success: false, message: '❌ Error al eliminar' }
  }
}

export async function getDashboardStats() {
  if (!(await checkAuth())) return null

  ReservaModel.markExpiredAsVencida();

  const products = ProductModel.findAll()
  const totalProducts = products.length
  const lowStockProducts = products.filter(p => p.stock !== undefined && p.stock === 0).length
  
  const totalConversations = ConversationModel.count()
  const pendingConversations = ConversationModel.count({ necesitaAtencion: true })

  const countByEstado = ProductModel.countByEstado()
  const countByCategory = ProductModel.countByCategory()
  const ventasStats = VentaModel.getEstadisticas()
  
  const reservasActivas = countByEstado.reservado

  return {
    totalProducts,
    lowStockProducts,
    pendingConversations,
    totalConversations,
    productosDisponibles: countByEstado.disponible,
    productosReservados: countByEstado.reservado,
    productosVendidos: countByEstado.vendido,
    productosPorCategoria: countByCategory,
    ventasTotales: ventasStats.totalVentas,
    montoTotal: ventasStats.montoTotal,
    ventasHoy: ventasStats.ventasHoy,
    montoHoy: ventasStats.montoHoy,
    reservasActivas
  }
}

export async function reservarProducto(productoId: string, formData: FormData) {
  try {
    if (!(await checkAuth())) redirect('/admin')

    const nombreCliente = (formData.get('nombreCliente') as string)?.trim()
    const telefonoCliente = (formData.get('telefonoCliente') as string)?.trim()
    const diasValidez = parseInt(formData.get('diasValidez') as string) || 3
    const nota = (formData.get('nota') as string)?.trim()

    if (!nombreCliente || nombreCliente.length < 2) {
      return { success: false, message: '❌ El nombre del cliente es requerido' }
    }

    const producto = ProductModel.findById(productoId)
    if (!producto) {
      return { success: false, message: '❌ Producto no encontrado' }
    }

    if (producto.estado !== 'disponible') {
      return { success: false, message: `❌ El producto ya está ${producto.estado}` }
    }

    const fechaVencimiento = new Date()
    fechaVencimiento.setDate(fechaVencimiento.getDate() + diasValidez)

    const reservaInfo: ReservaInfo = {
      nombreCliente,
      telefonoCliente: telefonoCliente || undefined,
      fechaReserva: new Date().toISOString(),
      fechaVencimiento: fechaVencimiento.toISOString()
    }

    const reserva = ReservaModel.create({
      productoId,
      nombreCliente,
      telefonoCliente: telefonoCliente || undefined,
      fechaReserva: new Date(),
      fechaVencimiento,
      nota: nota || undefined
    })

    reservaInfo.reservaId = reserva.id

    ProductModel.cambiarEstado(productoId, 'reservado', reservaInfo)

    revalidatePath('/admin')
    return { success: true, message: `✅ Reservado para ${nombreCliente} hasta ${fechaVencimiento.toLocaleDateString()}` }
  } catch (error) {
    console.error(error)
    return { success: false, message: '❌ Error al reservar' }
  }
}

export async function venderProducto(productoId: string, formData: FormData) {
  try {
    if (!(await checkAuth())) redirect('/admin')

    const nombreCliente = (formData.get('nombreCliente') as string)?.trim()
    const telefonoCliente = (formData.get('telefonoCliente') as string)?.trim()
    const metodoPago = formData.get('metodoPago') as string
    const precioVenta = parseFloat(formData.get('precioVenta') as string)
    const nota = (formData.get('nota') as string)?.trim()

    if (!nombreCliente || nombreCliente.length < 2) {
      return { success: false, message: '❌ El nombre del cliente es requerido' }
    }

    if (!metodoPago) {
      return { success: false, message: '❌ Selecciona un método de pago' }
    }

    if (isNaN(precioVenta) || precioVenta < 0) {
      return { success: false, message: '❌ El precio de venta debe ser un número válido' }
    }

    const producto = ProductModel.findById(productoId)
    if (!producto) {
      return { success: false, message: '❌ Producto no encontrado' }
    }

    if (producto.estado === 'vendido') {
      return { success: false, message: '❌ Este producto ya fue vendido' }
    }

    const venta = VentaModel.create({
      productoId,
      nombreCliente,
      telefonoCliente: telefonoCliente || undefined,
      metodoPago,
      precioVenta,
      nota: nota || undefined
    })

    const ventaInfo: VentaInfo = {
      nombreCliente,
      telefonoCliente: telefonoCliente || undefined,
      fechaVenta: new Date().toISOString(),
      metodoPago,
      precioVenta,
      ventaId: venta.id
    }

    if (producto.estado === 'reservado') {
      const reserva = ReservaModel.findActivas().find(r => r.productoId === productoId)
      if (reserva) {
        ReservaModel.updateEstado(reserva.id, 'completada')
      }
    }

    ProductModel.cambiarEstado(productoId, 'vendido', ventaInfo)

    revalidatePath('/admin')
    return { success: true, message: `✅ Vendido a ${nombreCliente} por $${precioVenta.toLocaleString()}` }
  } catch (error) {
    console.error(error)
    return { success: false, message: '❌ Error al registrar venta' }
  }
}

export async function liberarProducto(productoId: string) {
  try {
    if (!(await checkAuth())) redirect('/admin')

    const producto = ProductModel.findById(productoId)
    if (!producto) {
      return { success: false, message: '❌ Producto no encontrado' }
    }

    if (producto.estado === 'reservado') {
      const reserva = ReservaModel.findActivas().find(r => r.productoId === productoId)
      if (reserva) {
        ReservaModel.updateEstado(reserva.id, 'cancelada')
      }
    }

    ProductModel.cambiarEstado(productoId, 'disponible', null)

    revalidatePath('/admin')
    return { success: true, message: '✅ Producto liberado y disponible' }
  } catch (error) {
    console.error(error)
    return { success: false, message: '❌ Error al liberar' }
  }
}
