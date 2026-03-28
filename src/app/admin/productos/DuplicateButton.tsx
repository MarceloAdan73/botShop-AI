'use client'

import { useFormStatus } from 'react-dom'
import { useActionState } from 'react'
import { duplicateProduct } from '../actions'
import { toast } from '@/components/ui/Toast'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const initialState = {
  success: false,
  message: ''
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="text-blue-400 hover:text-blue-300 p-1 disabled:opacity-50"
      title="Duplicar"
    >
      {pending ? '...' : '📋'}
    </button>
  )
}

export function DuplicateButton({ productId }: { productId: string }) {
  const router = useRouter()

  const handleSubmit = async (prevState: any, formData: FormData) => {
    formData.set('id', productId)
    return duplicateProduct(prevState, formData)
  }

  const [state, formAction, isPending] = useActionState(handleSubmit, initialState)

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast.success(state.message)
        router.refresh()
      } else {
        toast.error(state.message)
      }
    }
  }, [state, router])

  return (
    <form action={formAction}>
      <SubmitButton />
    </form>
  )
}
