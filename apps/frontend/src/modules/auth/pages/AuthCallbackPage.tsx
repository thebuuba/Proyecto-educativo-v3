import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from '@/modules/auth/hooks/useAuth'

export function AuthCallbackPage() {
  const { finishOAuthCallback, profileRequired } = useAuth()
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let mounted = true
    finishOAuthCallback()
      .then(() => {
        if (mounted) setDone(true)
      })
      .catch((err: unknown) => {
        if (mounted) setError(err instanceof Error ? err.message : 'No se pudo completar el acceso social.')
      })
    return () => {
      mounted = false
    }
  }, [finishOAuthCallback])

  if (profileRequired) return <Navigate to="/onboarding" replace />
  if (done) return <Navigate to="/" replace />

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F0F1F3] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-[#111827]">Conectando cuenta</h1>
        <p className="mt-2 text-sm text-[#6B7280]">
          Estamos validando tu acceso social.
        </p>
        {error ? (
          <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-500">
            {error}
          </p>
        ) : null}
      </div>
    </main>
  )
}
