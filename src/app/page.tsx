'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { INFO_TIENDA } from '@/lib/tienda-config';
import { loadChat, saveChat, clearChat } from '@/lib/storage';

function MessageContent({ content }: { content: string }) {
  const imageRegex = /\[IMAGEN:\s*([^\]]+)\]/g;
  const directImageRegex = /(https?:\/\/[^\s<>"]+?\.(?:jpg|jpeg|png|gif|webp)(?:\?[^\s<>"]*)?)/gi;
  
  const images: string[] = [];
  
  let textContent = content
    .replace(imageRegex, (_, url) => {
      images.push(url.trim());
      return '';
    })
    .replace(directImageRegex, (url) => {
      images.push(url.trim());
      return '';
    });
  
  textContent = textContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').trim();
  
  return (
    <div className="space-y-3">
      {textContent && (
        <p className="whitespace-pre-wrap text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: textContent }} />
      )}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {images.map((url, i) => (
            <ImageWithFallback key={i} url={url} />
          ))}
        </div>
      )}
    </div>
  );
}

function ImageWithFallback({ url }: { url: string }) {
  const [error, setError] = useState(false);
  
  if (error) {
    return (
      <div className="w-[200px] h-[200px] rounded-lg border border-red-800 bg-red-900/30 flex items-center justify-center">
        <span className="text-red-400 text-xs text-center px-2">Imagen no disponible</span>
      </div>
    );
  }
  
  return (
    <img
      src={url}
      alt="Producto"
      className="max-w-[200px] max-h-[200px] rounded-lg object-cover border border-[#444] hover:scale-105 transition-transform cursor-pointer"
      onError={() => setError(true)}
    />
  );
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  // State to track if the component has mounted (client-side)
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Initialize messages with a default welcome message
  // This prevents hydration mismatch since server and client render the same initial state
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `¡Hola! 👋 Soy ${INFO_TIENDA.nombre}, tu asistente virtual ✨

Puedo ayudarte con:
• Ver nuestros productos disponibles
• Consultar talles y precios
• Información sobre envíos y pagos
• Horarios de atención
• Y cualquier otra duda sobre la tienda

${INFO_TIENDA.redes.instagram} | ${INFO_TIENDA.redes.whatsapp}

Elegí una opción del menú o preguntame lo que necesites:`
    }
  ]);
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat from localStorage only after component mounts
  useEffect(() => {
    // Clear ALL old storage keys from previous versions
    const keysToRemove = ['ploshito_chat_history', 'shopbot_chat_history', 'botia_chat_history', 'tutienda_chat_history', 'TuTienda_chat_history', 'demo_chat_history'];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    const saved = loadChat();
    if (saved && saved.length > 0) {
      setMessages(saved);
    }
    setIsLoaded(true);
  }, []);

  // Auto-save to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveChat(messages);
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Respuestas fijas para cada opción
  const fixedResponses: Record<string, string> = {
    a: `👗 **Ropa de mujer:** ${INFO_TIENDA.categorias.mujer.destacados.join(', ')}. ¿Buscás algo en particular?`,
    b: `👔 **Ropa de hombre:** ${INFO_TIENDA.categorias.hombre.destacados.join(', ')}. Preguntanos por disponibilidad en Instagram.`,
    c: `🧒 **Ropa para niños y niñas:** ${INFO_TIENDA.categorias.ninos.destacados.join(', ')}. Consultá talles y modelos por WhatsApp o Instagram.`,
    d: `📍 **Ubicación:** ${INFO_TIENDA.ubicacion.direccion}, ${INFO_TIENDA.ubicacion.ciudad} (${INFO_TIENDA.ubicacion.tipo}).\n📱 **Contacto:** IG ${INFO_TIENDA.redes.instagram} | WhatsApp ${INFO_TIENDA.redes.whatsapp}`,
    e: `🕒 **Horarios:** ${Object.entries(INFO_TIENDA.horarios.atencion).slice(0, 3).map(([d, h]) => `${d}: ${h}`).join(', ')}...\n📦 **Envíos:** ${INFO_TIENDA.envios.cobertura}.`,
    f: `🎁 **Promociones:** ${INFO_TIENDA.promociones.map(p => p.titulo).join(', ')}`
  };

  const menuOptions = [
    { key: 'a', label: 'Mujer', icon: '👗', desc: 'Ropa de mujer' },
    { key: 'b', label: 'Hombre', icon: '👔', desc: 'Ropa de hombre' },
    { key: 'c', label: 'Niños', icon: '🧒', desc: 'Ropa para niños' },
    { key: 'd', label: 'Ubicación', icon: '📍', desc: 'Dirección y contacto' },
    { key: 'e', label: 'Envíos', icon: '📦', desc: 'Métodos y tiempos' },
    { key: 'f', label: 'Promos', icon: '🎁', desc: 'Ofertas activas' }
  ];

  // Helper function to handle menu option clicks
  const handleOptionClick = (key: string) => {
    // Simulate typing the letter and sending
    const optionMap: Record<string, string> = {
      a: 'A) Ropa de mujer',
      b: 'B) Ropa de hombre',
      c: 'C) Niños/as',
      d: 'D) Contacto y ubicación',
      e: 'E) Horarios y envíos',
      f: 'F) Promociones'
    };
    
    // Immediately show user message
    const userMsg: Message = { role: 'user', content: optionMap[key] || key };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Find response
    const response = fixedResponses[key];
    
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setLoading(false);
    }, 500);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const originalInput = input.trim();
    let userMessageContent = originalInput;
    let botFixedResponse: string | null = null;

    // Detectar si es una opción de letra (A, B, C, D, E, F con posible punto o espacio)
    const trimmedLower = originalInput.toLowerCase();
    if (/^[a-f][\s.]*$/.test(trimmedLower)) {
      const letter = trimmedLower[0];
      if (fixedResponses[letter]) {
        botFixedResponse = fixedResponses[letter];
        // Convertimos la letra a la pregunta para mostrarla en el mensaje del usuario
        const optionMap: Record<string, string> = {
          a: 'A) Ropa de mujer',
          b: 'B) Ropa de hombre',
          c: 'C) Niños/as',
          d: 'D) Contacto y ubicación',
          e: 'E) Horarios y envíos',
          f: 'F) Promociones'
        };
        userMessageContent = optionMap[letter];
      }
    }

    // Agregar mensaje del usuario (con el texto original o el convertido)
    const userMsg: Message = { role: 'user', content: originalInput };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    if (botFixedResponse) {
      setTimeout(async () => {
        setMessages(prev => [...prev, { role: 'assistant', content: botFixedResponse! }]);
        setLoading(false);
        
        try {
          const fullMessages = [
            ...messages,
            { role: 'user', content: userMessageContent },
            { role: 'assistant', content: botFixedResponse! }
          ];
          
          const saveRes = await fetch('/api/chat/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: fullMessages,
              conversationId: conversationId
            }),
          });
          
          if (saveRes.ok) {
            const data = await saveRes.json();
            if (data.conversationId && !conversationId) {
              setConversationId(data.conversationId);
            }
          }
        } catch (error) {
          console.error('Error guardando conversación fija:', error);
        }
      }, 500);
    } else {
        // Llamar al modelo
        try {
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: userMessageContent, // Enviamos la pregunta explícita
              history: messages.slice(-4),
              conversationId: conversationId // Enviar el ID de la conversación si existe
            }),
          });

          if (!res.ok) throw new Error('Error en la respuesta');

          const data = await res.json();
          let responseText = data.response;
          
          // Detectar si hay una reserva para registrar
          const reservaMatch = responseText.match(/\[RESERVA:([^\]]+)\]/);
          if (reservaMatch) {
            const [nombre, producto, precio] = reservaMatch[1].split('|');
            // Enviar reserva al servidor
            try {
              await fetch('/api/chat/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  tipo: 'reserva',
                  nombreCliente: nombre,
                  producto: producto,
                  precio: parseFloat(precio) || 0,
                  conversationId: conversationId
                }),
              });
            } catch (e) {
              console.error('Error registrando reserva:', e);
            }
            // Limpiar el tag de reserva del mensaje
            responseText = responseText.replace(/\[RESERVA:[^\]]+\]/, '');
          }
          
          setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
          
          // Guardar el ID de la conversación si se creó una nueva
          if (data.conversationId && !conversationId) {
            setConversationId(data.conversationId);
          }
        } catch (error) {
          console.error(error);
          setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, hubo un error. Intenta de nuevo.' }]);
        } finally {
          setLoading(false);
        }
      }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-b border-[#1F1F1F] bg-[#1F1F1F]/50 backdrop-blur-md sticky top-0 z-10">
        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-[#3B3B3B] flex items-center justify-center ring-2 ring-[#3B3B3B]">
            {!logoError ? (
              <Image
                src="/logo-plosh.png"
                alt="ShopBot logo"
                width={40}
                height={40}
                className="object-cover"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-base sm:text-lg">🛍️</span>
            )}
          </div>
          {/* Online Indicator */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-[#1F1F1F] rounded-full"></span>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-base sm:text-xl font-semibold tracking-wide truncate">{INFO_TIENDA.nombre}</h1>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> En línea
          </p>
        </div>
        <button
          onClick={() => {
            clearChat();
            setMessages([
              {
                role: 'assistant',
                content: `¡Hola! Soy ${INFO_TIENDA.nombre} 🛍️ Elegí una opción:`
              }
            ]);
          }}
          className="hidden sm:flex text-xs text-gray-400 hover:text-white transition-colors px-3 py-1 border border-[#3B3B3B] rounded-full whitespace-nowrap"
        >
          Borrar conversación
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 pb-2">
        {isLoaded ? (
          <>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#3B3B3B] flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                    <span className="text-xs sm:text-sm">🛍️</span>
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[80%] p-2.5 sm:p-3 ${
                    msg.role === 'user'
                      ? 'bg-[#1F1F1F] text-white rounded-2xl rounded-br-md'
                      : 'bg-[#3B3B3B] text-white rounded-2xl rounded-bl-md'
                  } shadow-lg`}
                >
                  <MessageContent content={msg.content} />
                </div>
              </div>
            ))}
            
            {/* Initial Visual Menu (only show if no other messages except the first one) */}
            {messages.length === 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mt-4">
                {menuOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => handleOptionClick(opt.key)}
                    disabled={loading}
                    className="flex flex-col items-center justify-center p-3 sm:p-4 bg-[#1F1F1F] hover:bg-[#2a2a2a] border border-[#3B3B3B] rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-95"
                  >
                    <span className="text-xl sm:text-2xl mb-1 sm:mb-2">{opt.icon}</span>
                    <span className="font-medium text-xs sm:text-sm">{opt.label}</span>
                    <span className="text-[8px] sm:text-[10px] text-gray-500 mt-0.5 sm:mt-1">{opt.desc}</span>
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#3B3B3B] flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                  <span className="text-xs sm:text-sm">🛍️</span>
                </div>
                <div className="bg-[#3B3B3B] p-2.5 sm:p-3 rounded-2xl rounded-bl-md shadow-lg">
                  <span className="animate-pulse text-gray-400 text-sm">Escribiendo...</span>
                </div>
              </div>
            )}
          </>
        ) : (
          // Skeleton loader while loading from localStorage
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-start">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#3B3B3B] flex items-center justify-center mr-2 flex-shrink-0 mt-1 animate-pulse">
                <span className="text-xs sm:text-sm">🛍️</span>
              </div>
              <div className="bg-[#3B3B3B] p-2.5 sm:p-3 rounded-2xl rounded-bl-md shadow-lg w-40 sm:w-48 animate-pulse">
                <span className="text-gray-400 text-sm">Cargando...</span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mt-4">
              {menuOptions.map((opt) => (
                <div
                  key={opt.key}
                  className="flex flex-col items-center justify-center p-3 sm:p-4 bg-[#1F1F1F] border border-[#3B3B3B] rounded-xl animate-pulse"
                >
                  <span className="text-xl sm:text-2xl mb-1 sm:mb-2 opacity-50">{opt.icon}</span>
                  <span className="font-medium text-xs sm:text-sm text-gray-500">{opt.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t border-[#1F1F1F] bg-[#1F1F1F]/80 backdrop-blur-md">
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribí tu pregunta..."
            className="flex-1 bg-[#0A0A0A] border border-[#3B3B3B] rounded-full px-4 sm:px-5 py-2.5 sm:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/50 transition-colors text-sm sm:text-base"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-white text-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[44px] sm:min-w-[50px]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 rotate-45">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}