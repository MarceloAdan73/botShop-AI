import { NextResponse } from 'next/server';
import { ConversationModel, ReservaModel, ProductModel } from '@/lib/models';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-real-ip') || 
               'anonymous';
    
    const body = await req.json();
    const { messages, conversationId, tipo, nombreCliente, producto, precio } = body;
    
    const userInfo = {
      ip: ip,
      timestamp: new Date(),
      sessionId: conversationId ? `conv-${conversationId}` : `session-${Date.now()}`
    };
    
    if (tipo === 'reserva') {
      const productos = ProductModel.findByEstado('disponible');
      const productoObj = productos.find(p => 
        p.name.toLowerCase().includes(producto?.toLowerCase() || '')
      );
      
      if (productoObj) {
        const reserva = ReservaModel.create({
          productoId: productoObj.id,
          nombreCliente: nombreCliente,
          telefonoCliente: undefined,
          fechaReserva: new Date(),
          fechaVencimiento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 días
          nota: `Reserva desde bot web - Precio informado: $${precio}`
        });
        
        const reservaInfo = {
          nombreCliente,
          fechaReserva: new Date().toISOString(),
          fechaVencimiento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          reservaId: reserva.id
        };
        ProductModel.cambiarEstado(productoObj.id, 'reservado', reservaInfo);
        
        if (conversationId) {
          ConversationModel.update(parseInt(conversationId), {
            necesitaAtencion: false
          });
        }
        
        return NextResponse.json({ success: true, tipo: 'reserva', reservaId: reserva.id });
      }
    }
    
    if (conversationId) {
      ConversationModel.update(parseInt(conversationId), {
        totalMensajes: messages?.length || 0,
        mensajes: messages,
        userInfo: userInfo
      });
      
      return NextResponse.json({ success: true, conversationId });
    } else {
      const newConversation = ConversationModel.create({
        mensajes: messages,
        userInfo: userInfo,
        totalMensajes: messages?.length || 0,
        necesitaAtencion: true
      });
      
      return NextResponse.json({ success: true, conversationId: newConversation.id });
    }
  } catch (error) {
    console.error('Error guardando conversación:', error);
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 });
  }
}
