import { NextResponse } from 'next/server';
import { ConversationModel, ReservaModel } from '@/lib/models';

export async function GET() {
  try {
    ReservaModel.markExpiredAsVencida();
    
    const conversaciones = ConversationModel.findAll();

    return NextResponse.json({ conversaciones });
  } catch (error: any) {
    console.error('Error en API:', error?.message || error);
    return NextResponse.json(
      { error: 'Error al cargar datos', details: error?.message || 'Error desconocido' },
      { status: 500 }
    );
  }
}