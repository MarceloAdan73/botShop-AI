import { NextResponse } from 'next/server';
import { VentaModel } from '@/lib/models';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ventaId = parseInt(id);

    if (isNaN(ventaId)) {
      return NextResponse.json(
        { error: 'ID de venta inválido' },
        { status: 400 }
      );
    }

    const venta = VentaModel.findById(ventaId);

    if (!venta) {
      return NextResponse.json(
        { error: 'Venta no encontrada' },
        { status: 404 }
      );
    }

    VentaModel.delete(ventaId);

    return NextResponse.json({ success: true, message: 'Venta eliminada' });
  } catch (error: any) {
    console.error('Error en API eliminar venta:', error?.message || error);
    return NextResponse.json(
      { error: 'Error al eliminar venta', details: error?.message || 'Error desconocido' },
      { status: 500 }
    );
  }
}
