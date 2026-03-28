import { NextResponse } from 'next/server';
import { ProductModel, CategoryModel } from '@/lib/models';

export async function POST() {
  try {
    let categoriaNinos = CategoryModel.findBySlug('ninos');
    
    if (!categoriaNinos) {
      categoriaNinos = CategoryModel.create({
        name: 'Niños',
        slug: 'ninos',
        icon: '🧒',
        talles: '10, 12, 14, 16'
      });
    }
    
    const productosNinos = ProductModel.findByCategory(categoriaNinos.id);
    const disponibles = productosNinos.filter(p => p.estado === 'disponible');
    
    if (disponibles.length === 0) {
      const productosPrueba = [
        { name: 'Remera básica niña', description: 'Remera de algodon para niña', price: 12000, stock: 5, talles: '8, 10, 12, 14' },
        { name: 'Jean skinny niño', description: 'Jean elasstico para niño', price: 18000, stock: 3, talles: '10, 12, 14' },
        { name: 'Buzo felpa niño', description: 'Buzo suave de felpa', price: 22000, stock: 4, talles: '10, 12, 14, 16' },
        { name: 'Short denim niña', description: 'Short de jean para niña', price: 15000, stock: 3, talles: '10, 12, 14' },
        { name: 'Campera bomber niña', description: 'Campera ligera para niña', price: 28000, stock: 2, talles: '10, 12, 14' },
      ];
      
      productosPrueba.forEach(p => {
        ProductModel.create({
          name: p.name,
          description: p.description,
          price: p.price,
          stock: p.stock,
          categoryId: categoriaNinos.id,
          imageUrl: undefined,
          talles: p.talles
        });
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      categoria: categoriaNinos.name,
      productos: disponibles.length === 0 ? 5 : disponibles.length
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}