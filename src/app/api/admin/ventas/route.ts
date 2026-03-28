import { NextResponse } from 'next/server';
import { VentaModel } from '@/lib/models';

export async function GET() {
  try {
    const ventas = VentaModel.findAll();
    const stats = VentaModel.getEstadisticas();
    
    return NextResponse.json({ ventas, stats });
  } catch (error: any) {
    console.error('Error en API ventas:', error?.message || error);
    return NextResponse.json(
      { error: 'Error al cargar ventas', details: error?.message || 'Error desconocido' },
      { status: 500 }
    );
  }
}
