import { NextResponse } from 'next/server';
import { ConversationModel } from '@/lib/models';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conversationId = parseInt(id);

    if (isNaN(conversationId)) {
      return NextResponse.json(
        { error: 'ID de conversación inválido' },
        { status: 400 }
      );
    }

    const conversation = ConversationModel.findById(conversationId);

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversación no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ conversation });
  } catch (error: any) {
    console.error('Error en API conversación:', error?.message || error);
    return NextResponse.json(
      { error: 'Error al cargar conversación', details: error?.message || 'Error desconocido' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conversationId = parseInt(id);

    if (isNaN(conversationId)) {
      return NextResponse.json(
        { error: 'ID de conversación inválido' },
        { status: 400 }
      );
    }

    const conversation = ConversationModel.findById(conversationId);

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversación no encontrada' },
        { status: 404 }
      );
    }

    ConversationModel.delete(conversationId);

    return NextResponse.json({ success: true, message: 'Conversación eliminada' });
  } catch (error: any) {
    console.error('Error en API eliminar conversación:', error?.message || error);
    return NextResponse.json(
      { error: 'Error al eliminar conversación', details: error?.message || 'Error desconocido' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conversationId = parseInt(id);

    if (isNaN(conversationId)) {
      return NextResponse.json(
        { error: 'ID de conversación inválido' },
        { status: 400 }
      );
    }

    const { necesitaAtencion } = await request.json();

    const conversation = ConversationModel.findById(conversationId);

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversación no encontrada' },
        { status: 404 }
      );
    }

    ConversationModel.update(conversationId, {
      necesitaAtencion: Boolean(necesitaAtencion)
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error en API atención:', error?.message || error);
    return NextResponse.json(
      { error: 'Error al actualizar estado', details: error?.message || 'Error desconocido' },
      { status: 500 }
    );
  }
}
