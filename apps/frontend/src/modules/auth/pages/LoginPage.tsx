import { CheckCircle, Eye, EyeOff } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { FacebookIcon, FLOATING_ICONS, GoogleIcon } from '@/components/auth/AuthIcons'
import { AuthTransitionLink } from '@/modules/auth/components/AuthTransitionLink'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { requestPasswordReset } from '@/modules/auth/services/authService'
import { isRememberSessionEnabled, setRememberSession } from '@/modules/auth/services/supabaseClient'

type LocationState = {
  from?: { pathname?: string }
  registered?: boolean
}

export function LoginPage() {
  const { authError, isAuthenticated, loading, login, loginWithProvider, profileRequired } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(isRememberSessionEnabled)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false)
  const fromState = location.state as LocationState | null
  const from = fromState?.from?.pathname && fromState.from.pathname !== '/login' && fromState.from.pathname !== '/'
    ? fromState.from.pathname
    : '/inicio'
  const registered = fromState?.registered === true

  if (!loading && isAuthenticated) return <Navigate to={from ?? '/inicio'} replace />
  if (!loading && profileRequired) return <Navigate to="/onboarding" replace />

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setForgotPasswordSent(false)
    setIsSubmitting(true)
    try {
      await login({ email, password })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo iniciar sesión. Revisa tus credenciales.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setErrorMessage('Ingresa tu correo electrónico primero.')
      return
    }
    setErrorMessage('')
    setIsSubmitting(true)
    try {
      await requestPasswordReset(email.trim())
      setForgotPasswordSent(true)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo enviar el correo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-screen page-enter relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <AuthBackdrop />

      <div className="auth-panel dashboard-warm-shadow relative z-10 w-full max-w-sm rounded-3xl bg-card p-6 sm:p-8">
        <div className="mb-7 flex flex-col items-center">
          <div className="relative mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/16 text-lg font-extrabold text-foreground">
            AB
            <span className="absolute -right-1 -top-1 size-3 rounded-full bg-warning" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Aula Base</h1>
          <p className="mt-1 text-sm text-muted-foreground">Tu espacio de trabajo docente</p>
        </div>

        {errorMessage || authError ? (
          <div className="mb-5 flex items-center gap-2.5 rounded-2xl border border-destructive/25 bg-destructive/14 px-4 py-3 text-foreground">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-destructive/24 text-xs font-extrabold">!</span>
            <span className="text-sm font-medium">{errorMessage || authError}</span>
          </div>
        ) : null}

        {registered && !errorMessage && !authError ? (
          <SuccessMessage>Cuenta creada correctamente. Ya puedes iniciar sesión.</SuccessMessage>
        ) : null}

        {forgotPasswordSent && !errorMessage ? (
          <SuccessMessage>Te enviamos un correo para restablecer tu contraseña.</SuccessMessage>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <AuthField label="Correo electrónico">
            <input
              type="email"
              placeholder="docente@escuela.edu"
              required
              value={email}
              onChange={(event) => { setEmail(event.target.value); setErrorMessage('') }}
              className="auth-input"
            />
          </AuthField>

          <AuthField label="Contraseña">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                value={password}
                onChange={(event) => { setPassword(event.target.value); setErrorMessage('') }}
                className="auth-input pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </AuthField>

          <div className="flex items-center justify-between gap-3 pt-1">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => {
                  const checked = event.target.checked
                  setRememberMe(checked)
                  setRememberSession(checked)
                }}
                className="size-4 cursor-pointer accent-primary"
              />
              <span className="text-sm text-muted-foreground">Recordarme</span>
            </label>
            <button type="button" onClick={handleForgotPassword} className="text-sm font-semibold text-foreground decoration-primary hover:underline">
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground shadow-sm transition hover:bg-primary-hover active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">o continúa con</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ProviderButton onClick={() => loginWithProvider('google').catch((error: unknown) => setErrorMessage(error instanceof Error ? error.message : 'No se pudo iniciar con Google.'))}>
            <GoogleIcon /> Google
          </ProviderButton>
          <ProviderButton onClick={() => loginWithProvider('facebook').catch((error: unknown) => setErrorMessage(error instanceof Error ? error.message : 'No se pudo iniciar con Facebook.'))}>
            <FacebookIcon /> Facebook
          </ProviderButton>
        </div>

        <p className="mt-7 text-center text-sm text-muted-foreground">
          ¿Aún no tienes cuenta?{' '}
          <AuthTransitionLink to="/registro" direction="forward" className="font-extrabold text-foreground decoration-primary hover:underline">
            Regístrate
          </AuthTransitionLink>
        </p>

        <p className="mt-8 text-center text-xs text-muted-foreground/70">© {new Date().getFullYear()} Aula Base</p>
      </div>
    </main>
  )
}

function AuthBackdrop() {
  return <div className="pointer-events-none absolute inset-0">
    {FLOATING_ICONS.map((item, index) => (
      <item.Icon key={index} style={{ position: 'absolute', top: item.top, left: item.left, width: item.size, height: item.size, color: 'var(--primary)', opacity: 0.055, transform: `translate(-50%, -50%) rotate(${item.rotate}deg)` }} strokeWidth={1.5} />
    ))}
    <div className="absolute -right-32 -top-32 size-[30rem] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--primary) 18%, transparent) 0%, transparent 70%)' }} />
    <div className="absolute -bottom-36 -left-32 size-[30rem] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--warning) 16%, transparent) 0%, transparent 70%)' }} />
  </div>
}

function AuthField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-semibold text-foreground">{label}</span>{children}</label>
}

function SuccessMessage({ children }: { children: React.ReactNode }) {
  return <div className="mb-5 flex items-center gap-2.5 rounded-2xl border border-success/30 bg-success/16 px-4 py-3 text-foreground"><CheckCircle className="size-4 shrink-0" /><span className="text-sm font-medium">{children}</span></div>
}

function ProviderButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="flex items-center justify-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted active:scale-[0.985]">{children}</button>
}
