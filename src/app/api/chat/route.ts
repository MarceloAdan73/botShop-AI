import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { generarPromptTienda } from '@/lib/tienda-config';
import { ConversationModel, ProductModel, CategoryModel, ConfigModel, type Product } from '@/lib/models';

const RATE_LIMIT = 10;
const WINDOW_SECONDS = 60;

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-real-ip') || 
               'anonymous';
    
    const key = `ratelimit:${ip}`;
    
    let current = 0;
    let ttl = WINDOW_SECONDS;
    
    try {
      if (redis) {
        current = await redis.incr(key);
        if (current === 1) {
          await redis.expire(key, WINDOW_SECONDS);
        }
        ttl = await redis.ttl(key);
      } else {
        current = 0;
      }
    } catch (redisError) {
      console.error('Redis error (fail open):', redisError);
      current = 0;
    }
    
    if (current > RATE_LIMIT) {
      return NextResponse.json(
        { 
          error: 'Too Many Requests',
          message: `Has excedido el límite de ${RATE_LIMIT} requests por minuto. Esperá ${ttl} segundos.`
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': (Math.floor(Date.now() / 1000) + ttl).toString(),
          }
        }
      );
    }

    const { message, history, conversationId } = await req.json();

    const contents = (history || []).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const systemPrompt = await generarPromptDinamico();

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
          topP: 0.9,
          topK: 20
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error de Gemini API:', response.status, errorText);
      
      if (response.status === 429) {
        return NextResponse.json({ error: 'Límite diario excedido. Intentá de nuevo mañana.' }, { status: 429 });
      }
      return NextResponse.json({ error: 'Error con el modelo' }, { status: 502 });
    }

    const data = await response.json();
    
    let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      console.error('Invalid response format from Gemini:', data);
      return NextResponse.json({ error: 'Invalid response format' }, { status: 502 });
    }
    
    responseText = await procesarMarcadoresImagen(responseText);
    
    try {
      const fullMessages = [
        ...(history || []),
        { role: 'user', content: message, timestamp: new Date().toISOString() },
        { role: 'assistant', content: responseText.trim(), timestamp: new Date().toISOString() }
      ];
      
      const userInfo = {
        ip: ip,
        timestamp: new Date(),
        sessionId: conversationId ? `conv-${conversationId}` : `session-${Date.now()}`
      };
      
      const necesitaAtencion = !conversationId;
      
      if (conversationId) {
        const currentConversation = ConversationModel.findById(parseInt(conversationId));
        if (currentConversation) {
          ConversationModel.update(parseInt(conversationId), {
            totalMensajes: currentConversation.totalMensajes + 2,
            mensajes: fullMessages,
            userInfo: userInfo,
            necesitaAtencion: necesitaAtencion
          });
        }
        
        return NextResponse.json(
          { 
            response: responseText.trim(),
            conversationId: parseInt(conversationId)
          }, 
          { 
            headers: {
              'X-RateLimit-Limit': RATE_LIMIT.toString(),
              'X-RateLimit-Remaining': current > 0 ? Math.max(0, RATE_LIMIT - current).toString() : '10',
              'X-RateLimit-Reset': (Math.floor(Date.now() / 1000) + ttl).toString(),
            }
          }
        );
      } else {
        const newConversation = ConversationModel.create({
          mensajes: fullMessages,
          userInfo: userInfo,
          totalMensajes: 2,
          necesitaAtencion: necesitaAtencion
        });
        
        return NextResponse.json(
          { 
            response: responseText.trim(),
            conversationId: newConversation.id
          }, 
          { 
            headers: {
              'X-RateLimit-Limit': RATE_LIMIT.toString(),
              'X-RateLimit-Remaining': current > 0 ? Math.max(0, RATE_LIMIT - current).toString() : '10',
              'X-RateLimit-Reset': (Math.floor(Date.now() / 1000) + ttl).toString(),
            }
          }
        );
      }
    } catch (error) {
      console.error('Error guardando conversación:', error);
    }
    
    return NextResponse.json(
      { response: responseText.trim() },
      { 
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT.toString(),
          'X-RateLimit-Remaining': current > 0 ? Math.max(0, RATE_LIMIT - current).toString() : '10',
          'X-RateLimit-Reset': (Math.floor(Date.now() / 1000) + ttl).toString(),
        }
      }
    );
    
  } catch (error) {
    console.error('Error en API chat:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

async function procesarMarcadoresImagen(texto: string): Promise<string> {
  const patron = /\[IMAGEN:([^\]]+)\]/g;
  
  return texto.replace(patron, (match, contenido) => {
    const trimmedContent = contenido.trim();
    
    let processedUrl = trimmedContent;
    
    if (!trimmedContent.startsWith('http') && !trimmedContent.startsWith('/productos/')) {
      if (trimmedContent.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        processedUrl = `/productos/${trimmedContent}`;
      } else {
        processedUrl = `/productos/${trimmedContent}.jpg`;
      }
    }
    
    return `[IMAGEN:${processedUrl}]`;
  });
}

async function generarPromptDinamico(): Promise<string> {
  let productosInfo = '';
  let categoriasInfo = '';
  let configInfo = '';
  
  try {
    const categoriasDB = CategoryModel.findAll();
    if (categoriasDB.length > 0) {
      categoriasInfo = '\n\n📂 CATEGORÍAS DISPONIBLES:\n';
      categoriasDB.forEach(cat => {
        const productosEnCat = ProductModel.findByCategory(cat.id);
        const count = productosEnCat.filter(p => p.estado === 'disponible').length;
        categoriasInfo += `• ${cat.icon} ${cat.name} (${count} productos disponibles)\n`;
      });
      categoriasInfo += '\nIMPORTANTE: Cuando el usuario pida productos de una categoría específica, mostrá SOLO los de esa categoría.\n';
    }
    
    const config = ConfigModel.findFirst();
    if (config?.storeInfo) {
      const store = config.storeInfo;
      configInfo = '\n\nINFO ADICIONAL DEL PANEL:\n';
      
      if (store.envios) {
        configInfo += `ENVÍOS: ${store.envios.disponible ? 'Sí' : 'No'}\n`;
        if (store.envios.costos?.local) configInfo += `- Local: ${store.envios.costos.local}\n`;
      }
      
      if (store.pagos?.metodos) {
        configInfo += `PAGO: ${store.pagos.metodos.join(', ')}\n`;
      }
    }
    
    const productosDisponibles = ProductModel.findByEstado('disponible');
    
    if (productosDisponibles.length > 0) {
      productosInfo = '\n\n📦 PRODUCTOS DISPONIBLES (todos):\n';
      
      const porCategoria: Record<string, Product[]> = {};
      productosDisponibles.forEach(p => {
        const cat = CategoryModel.findById(p.categoryId);
        const catName = cat?.name || 'Sin categoría';
        if (!porCategoria[catName]) porCategoria[catName] = [];
        porCategoria[catName].push(p);
      });
      
      Object.entries(porCategoria).forEach(([catName, productos]) => {
        productosInfo += `\n--- ${catName.toUpperCase()} ---\n`;
        productos.forEach(p => {
          const tallesInfo = p.talles ? ` | Talles: ${p.talles}` : '';
          if (p.imageUrl) {
            productosInfo += `• ${p.name} - $${p.price.toLocaleString()}${tallesInfo} → [IMAGEN:${p.imageUrl}]\n`;
          } else {
            productosInfo += `• ${p.name} - $${p.price.toLocaleString()}${tallesInfo}\n`;
          }
        });
      });
      
      productosInfo += `\nREGLAS:\n`;
      productosInfo += `1. Cuando hables de un producto con imagen, terminá con [IMAGEN:url]\n`;
      productosInfo += `2. Si el usuario pregunta por "niños", buscá en la categoría "Niños" o productos con talles pequeños\n`;
      productosInfo += `3. Si no hay productos en una categoría, decí "No hay productos de esa categoría actualmente"\n`;
    } else {
      productosInfo = '\n\n⚠️ NO HAY PRODUCTOS DISPONIBLES.\n';
    }
  } catch (error) {
    console.error('Error obteniendo datos para el prompt:', error);
  }
  
  return generarPromptTienda() + categoriasInfo + configInfo + productosInfo;
}
