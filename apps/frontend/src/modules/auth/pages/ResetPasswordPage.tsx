import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/modules/auth/services/supabaseClient'

export function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)

  useEffect(() => {
    async function prepareRecoverySession() {
      const code = new URLSearchParams(window.location.search).get('code')
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        if (exchangeError) {
          setError('El enlace de recuperación no es válido o expiró.')
          return
        }
        window.history.replaceState({}, '', window.location.pathname)
      }

      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        setError('Abre esta página desde el enlace enviado a tu correo.')
        return
      }
      setSessionReady(true)
    }

    void prepareRecoverySession()
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (password !== confirmation) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setSubmitting(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setSubmitting(false)
    if (updateError) {
      setError(updateError.message)
      return
    }
    setMessage('Contraseña actualizada. Ya puedes iniciar sesión.')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFBFC] px-4">
      <section className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Restablecer contraseña</h1>
        <p className="mt-2 text-sm text-gray-500">Elige una contraseña nueva para tu cuenta.</p>
        {error ? <p role="alert" className="mt-4 text-sm text-red-600">{error}</p> : null}
        {message ? <p role="status" className="mt-4 text-sm text-emerald-700">{message}</p> : null}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input className="w-full rounded-xl border border-gray-200 px-4 py-3" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Nueva contraseña" autoComplete="new-password" />
          <input className="w-full rounded-xl border border-gray-200 px-4 py-3" type="password" required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Confirmar contraseña" autoComplete="new-password" />
          <button className="w-full rounded-xl bg-[#1E3D8F] px-4 py-3 font-medium text-white disabled:opacity-60" disabled={submitting || !sessionReady} type="submit">
            {submitting ? 'Guardando…' : 'Guardar contraseña'}
          </button>
        </form>
        <Link className="mt-5 block text-center text-sm font-medium text-[#1E3D8F]" to="/login">Volver al inicio de sesión</Link>
      </section>
    </main>
  )
}
