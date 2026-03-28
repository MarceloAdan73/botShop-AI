import { NextResponse } from 'next/server';
import { ReservaModel, ProductModel } from '@/lib/models';

export async function GET() {
  try {
    ReservaModel.markExpiredAsVencida();
    
    const reservasActivas = ReservaModel.findActivas().filter(r => {
      const producto = ProductModel.findById(r.productoId);
      return producto && producto.estado === 'reservado';
    });
    
    const reservasVencidas = ReservaModel.findVencidas().filter(r => {
      const producto = ProductModel.findById(r.productoId);
      return producto && producto.estado === 'reservado';
    });
    
    return NextResponse.json({
      reservasActivas,
      reservasVencidas
    });
  } catch (error) {
    console.error('Error fetching reservas:', error);
    return NextResponse.json({ error: 'Error al cargar reservas' }, { status: 500 });
  }
}