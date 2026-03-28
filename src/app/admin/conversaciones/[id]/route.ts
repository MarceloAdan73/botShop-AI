import { NextResponse } from 'next/server';
import { ConversationModel } from '@/lib/models';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = parseInt(idStr)
    
    const conversation = ConversationModel.findById(id)
    
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversación no encontrada' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      conversation: {
        id: conversation.id,
        nombre_cliente: conversation.nombreCliente,
        telefono_cliente: conversation.telefonoCliente,
        fecha_inicio: conversation.fechaInicio,
        total_mensajes: conversation.totalMensajes,
        necesita_atencion: conversation.necesitaAtencion,
        resumen: conversation.resumen,
        mensajes: (conversation as any).mensajes,
        userInfo: (conversation as any).userInfo
      }
    })
  } catch (error) {
    console.error('Error fetching conversation:', error)
    return NextResponse.json(
      { error: 'Error al cargar la conversación' },
      { status: 500 }
    )
  }
}
