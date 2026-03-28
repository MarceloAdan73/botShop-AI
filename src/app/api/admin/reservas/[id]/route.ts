import { NextResponse } from 'next/server';
import { ReservaModel, ProductModel } from '@/lib/models';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reservaId = parseInt(id);

    if (isNaN(reservaId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const reserva = ReservaModel.findById(reservaId);
    if (!reserva) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
    }

    const producto = ProductModel.findById(reserva.productoId);
    if (producto && producto.estado === 'reservado') {
      ProductModel.cambiarEstado(reserva.productoId, 'disponible', null);
    }

    ReservaModel.updateEstado(reservaId, 'cancelada');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reserva:', error);
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}