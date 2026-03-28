'use client'

import { redirect } from 'next/navigation'
import { checkAuth } from '../../actions'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

export default function ConsultaDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [conversation, setConversation] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkAuthAndFetch() {
      const auth = await checkAuth()
      if (!auth) {
        router.push('/admin')
        return
      }
      setIsAuthenticated(true)
      
      try {
        // Fetch conversation details
        const res = await fetch(`/api/admin/conversaciones/${id}`)
        if (!res.ok) {
          throw new Error('No se pudo cargar la conversación')
        }
        const data = await res.json()
        setConversation(data.conversation)
        
        // Parse messages if they exist
        if (data.conversation.mensajes) {
          try {
            const parsedMessages = typeof data.conversation.mensajes === 'string' 
              ? JSON.parse(data.conversation.mensajes)
              : data.conversation.mensajes
            setMessages(Array.isArray(parsedMessages) ? parsedMessages : [])
          } catch (e) {
            console.error('Error parsing messages:', e)
            setMessages([])
          }
        }
      } catch (err: any) {
        setError(err.message || 'Error al cargar la conversación')
      } finally {
        setLoading(false)
      }
    }
    
    checkAuthAndFetch()
  }, [id, router])

  // Marcar como atendida/no atendida
  const toggleAttentionStatus = async () => {
    try {
      const newState = !conversation.necesitaAtencion
      const res = await fetch(`/api/admin/conversaciones/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ necesitaAtencion: newState })
      })
      
      if (res.ok) {
        setConversation({ ...conversation, necesitaAtencion: newState })
      }
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  // Responder por WhatsApp
  const openWhatsApp = () => {
    if (conversation.telefonoCliente) {
      const phone = conversation.telefonoCliente.replace(/\D/g, '')
      window.open(`https://wa.me/${phone}`, '_blank')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <p>Verificando autenticación...</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-12 text-center text-gray-400">
            <p>Cargando conversación...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !conversation) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-12 text-center text-red-400">
            <p>{error || 'Conversación no encontrada'}</p>
            <Link href="/admin/consultas" className="text-blue-400 hover:underline mt-4 inline-block">
              ← Volver a consultas
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3 md:gap-4">
          <div className="flex items-center gap-2">
            <Link href="/admin/consultas" className="text-gray-400 hover:text-white text-sm md:text-base">
              ← <span className="hidden sm:inline">Volver</span>
            </Link>
            <h1 className="text-lg md:text-2xl font-bold">Detalle</h1>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={toggleAttentionStatus}
              className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                conversation.necesitaAtencion
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {conversation.necesitaAtencion ? '○ Pendiente' : '✓ Respondida'}
            </button>
            
            {conversation.telefonoCliente && (
              <button
                onClick={openWhatsApp}
                className="bg-green-600 hover:bg-green-700 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm flex items-center gap-1 md:gap-2"
              >
                💬 <span className="hidden sm:inline">WhatsApp</span>
              </button>
            )}
          </div>
        </div>

        {/* Info de la conversación */}
        <div className="bg-[#1F1F1F] p-3 md:p-4 rounded-xl mb-4 md:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <div>
              <span className="text-gray-400 text-xs md:text-sm">Cliente</span>
              <p className="font-medium text-sm md:text-base">{conversation.nombreCliente || 'Anónimo'}</p>
            </div>
            <div>
              <span className="text-gray-400 text-xs md:text-sm">Teléfono</span>
              <p className="font-medium text-sm md:text-base">{conversation.telefonoCliente || '-'}</p>
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <span className="text-gray-400 text-xs md:text-sm">Fecha</span>
              <p className="font-medium text-xs md:text-sm">
                {new Date(conversation.fechaInicio).toLocaleDateString('es-AR')}
              </p>
            </div>
          </div>
          
          {conversation.resumen && (
            <div className="mt-3 md:mt-4">
              <span className="text-gray-400 text-xs md:text-sm">Resumen</span>
              <p className="text-gray-300 text-xs md:text-sm">{conversation.resumen}</p>
            </div>
          )}
        </div>

        {/* Área de chat */}
        <div className="bg-[#1F1F1F] rounded-xl overflow-hidden mb-4 md:mb-6">
          <div className="p-3 md:p-4 border-b border-[#333] flex justify-between items-center">
            <h3 className="font-medium text-sm md:text-base">Mensajes</h3>
            <span className="text-gray-400 text-xs md:text-sm">{messages.length}</span>
          </div>
          
          <div className="p-3 md:p-4 space-y-3 md:space-y-4 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[90%] sm:max-w-[80%] p-2.5 md:p-3 ${
                      msg.role === 'user'
                        ? 'bg-[#3B3B3B] text-white rounded-2xl rounded-br-md'
                        : 'bg-[#2A2A2A] text-white rounded-2xl rounded-bl-md'
                    }`}
                  >
                    <p className="text-xs md:text-sm whitespace-pre-wrap">{msg.content}</p>
                    {msg.timestamp && (
                      <p className="text-[10px] md:text-xs text-gray-400 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString('es-AR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-6 md:py-8 text-sm">
                <p>No hay mensajes en esta conversación.</p>
              </div>
            )}
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          <div className="bg-[#1F1F1F] p-3 md:p-4 rounded-xl text-center">
            <p className="text-gray-400 text-[10px] md:text-sm">Mensajes</p>
            <p className="text-lg md:text-2xl font-bold">{conversation.totalMensajes}</p>
          </div>
          <div className="bg-[#1F1F1F] p-3 md:p-4 rounded-xl text-center">
            <p className="text-gray-400 text-[10px] md:text-sm">Estado</p>
            <p className={`text-sm md:text-lg font-bold ${conversation.necesitaAtencion ? 'text-yellow-400' : 'text-green-400'}`}>
              {conversation.necesitaAtencion ? 'Pendiente' : 'Respondido'}
            </p>
          </div>
          <div className="bg-[#1F1F1F] p-3 md:p-4 rounded-xl text-center">
            <p className="text-gray-400 text-[10px] md:text-sm">Fecha</p>
            <p className="text-sm md:text-base font-bold">
              {new Date(conversation.fechaInicio).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
