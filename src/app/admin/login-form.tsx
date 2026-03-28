'use client'

import { useFormStatus } from 'react-dom'
import { login } from './actions'
import { Lock, User, Copy, Check } from 'lucide-react'
import { useState } from 'react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <span className="animate-spin">⏳</span>
          Verificando...
        </>
      ) : (
        <>
          <Lock className="w-4 h-4" />
          Iniciar Sesión
        </>
      )}
    </button>
  )
}

export default function LoginForm() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-md mx-4">
      <div className="bg-[#1F1F1F] p-6 sm:p-8 rounded-2xl border border-[#333] shadow-2xl">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Panel de Administración</h2>
          <p className="text-gray-400 text-xs sm:text-sm">Ingresá tus credenciales para continuar</p>
        </div>

        <form action={login} className="space-y-4 sm:space-y-5">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Ingresá la contraseña"
              className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg px-4 py-2.5 sm:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm sm:text-base"
            />
          </div>
          <SubmitButton />
        </form>

        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[#333]">
          <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-700/50 rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="text-xl sm:text-2xl">🔐</span>
              <h3 className="text-amber-400 font-semibold text-sm sm:text-base">Credenciales de Demo</h3>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between bg-[#1F1F1F] rounded-lg px-3 sm:px-4 py-2 sm:py-3">
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Contraseña</p>
                  <p className="text-white font-mono font-medium text-sm">demo123</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard('demo123')}
                  className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors text-gray-400 hover:text-white"
                  title="Copiar"
                >
                  {copied ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 text-center">
                Usá esta contraseña para acceder al panel
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 text-center">
          <a href="/" className="text-gray-500 hover:text-gray-300 text-xs sm:text-sm transition-colors flex items-center justify-center gap-2">
            ← Volver al chat
          </a>
        </div>
      </div>

      <p className="text-center text-gray-600 text-[10px] sm:text-xs mt-4 sm:mt-6">
        ShopBot © 2024 • Versión Demo
      </p>
    </div>
  )
}
