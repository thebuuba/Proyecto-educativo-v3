import { KeyRound } from 'lucide-react'
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
    <main className="auth-screen relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="pointer-events-none absolute -right-32 -top-32 size-[30rem] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--primary) 18%, transparent) 0%, transparent 70%)' }} />
      <div className="pointer-events-none absolute -bottom-36 -left-32 size-[30rem] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--warning) 16%, transparent) 0%, transparent 70%)' }} />

      <section className="dashboard-warm-shadow relative z-10 w-full max-w-sm rounded-3xl bg-card p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="relative flex size-14 items-center justify-center rounded-2xl bg-warning/24 text-foreground">
            <KeyRound className="size-6" />
            <span className="absolute -right-1 -top-1 size-3 rounded-full bg-primary" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-foreground">Restablecer contraseña</h1>
          <p className="mt-1 text-sm text-muted-foreground">Elige una contraseña nueva para tu cuenta.</p>
        </div>

        {error ? <div role="alert" className="mt-5 rounded-2xl border border-destructive/25 bg-destructive/14 px-4 py-3 text-sm font-semibold text-foreground">{error}</div> : null}
        {message ? <div role="status" className="mt-5 rounded-2xl border border-success/30 bg-success/16 px-4 py-3 text-sm font-semibold text-foreground">{message}</div> : null}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input className="auth-input" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Nueva contraseña" autoComplete="new-password" />
          <input className="auth-input" type="password" required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Confirmar contraseña" autoComplete="new-password" />
          <button className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground shadow-sm transition hover:bg-primary-hover disabled:opacity-60" disabled={submitting || !sessionReady} type="submit">
            {submitting ? 'Guardando…' : 'Guardar contraseña'}
          </button>
        </form>

        <Link className="mt-5 block text-center text-sm font-semibold text-foreground decoration-primary hover:underline" to="/login">Volver al inicio de sesión</Link>
      </section>
    </main>
  )
}
