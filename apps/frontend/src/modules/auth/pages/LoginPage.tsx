import { AlertCircle, CheckCircle, LogIn, UserPlus } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { SocialLoginButtons } from '@/modules/auth/components/SocialLoginButtons'
import { useAuth } from '@/modules/auth/hooks/useAuth'

type LocationState = {
  from?: {
    pathname?: string
  }
  registered?: boolean
}

export function LoginPage() {
  const { authError, isAuthenticated, loading, login, loginWithOAuth, needsProfile } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false)
  const fromState = location.state as LocationState | null
  const from =
    fromState?.from?.pathname && fromState.from.pathname !== '/login'
      ? fromState.from.pathname
      : '/'
  const registered = fromState?.registered === true

  if (!loading && needsProfile) {
    return <Navigate to="/completar-registro" replace />
  }

  if (!loading && isAuthenticated) {
    return <Navigate to={from ?? '/'} replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setForgotPasswordSent(false)
    setIsSubmitting(true)

    try {
      await login({ email, password })
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo iniciar sesión. Revisa tus credenciales.',
      )
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
    setForgotPasswordSent(false)

    setForgotPasswordSent(true)
  }

  return (
    <main className="flex min-h-screen bg-background">
      <section className="hidden min-h-screen w-[42%] flex-col justify-between bg-gradient-to-br from-primary to-primary/80 p-10 text-primary-foreground lg:flex">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
            AB
          </span>
          <div>
            <p className="text-sm font-semibold">Aula Base</p>
            <p className="text-xs text-muted-foreground">Gestión estudiantil</p>
          </div>
        </div>

        <div>
          <p className="max-w-md text-3xl font-semibold leading-tight">
            Acceso seguro para administrar la operación académica.
          </p>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
            Roles, permisos y sesiones preparados para conectar módulos reales
            del sistema.
          </p>
        </div>

        <p className="text-xs text-muted-foreground">JWT Auth</p>
      </section>

      <section className="flex min-h-screen flex-1 items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
                AB
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Aula Base
                </p>
                <p className="text-xs text-muted-foreground">Gestión estudiantil</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-md animate-in fade-in slide-in-from-bottom-4 sm:p-8">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Iniciar sesión
              </h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Usa tus credenciales institucionales para continuar.
              </p>
            </div>

            {errorMessage || authError ? (
              <div className="mt-6 flex gap-3 rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <p>{errorMessage || authError}</p>
              </div>
            ) : null}

            {registered && !errorMessage && !authError ? (
              <div className="mt-6 flex gap-3 rounded-lg border border-success/20 bg-success/12 p-3 text-sm text-success">
                <CheckCircle className="mt-0.5 size-4 shrink-0" />
                <p>Cuenta creada exitosamente. Ya puedes iniciar sesión.</p>
              </div>
            ) : null}

            {forgotPasswordSent && !errorMessage ? (
              <div className="mt-6 flex gap-3 rounded-lg border border-success/20 bg-success/12 p-3 text-sm text-success">
                <CheckCircle className="mt-0.5 size-4 shrink-0" />
                <p>
                  Te hemos enviado un correo para restablecer tu contraseña.
                </p>
              </div>
            ) : null}

            <div className="mt-6">
              <SocialLoginButtons
                onGoogleSignIn={() => loginWithOAuth('google')}
                onFacebookSignIn={() => loginWithOAuth('facebook')}
                disabled={isSubmitting}
              />
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Correo electrónico
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2"
                />
              </div>

              <PasswordInput
                id="password"
                label="Contraseña"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-muted-foreground transition hover:text-accent"
                >
                  Olvidé mi contraseña
                </button>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
                className="w-full"
              >
                <LogIn className="size-4" />
                {isSubmitting ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </form>

            <div className="mt-6 border-t border-border pt-6">
              <p className="text-center text-sm text-muted-foreground">
                ¿No tienes una cuenta?
              </p>
              <Link to="/registro">
                <Button variant="outline" className="mt-3 w-full">
                  <UserPlus className="size-4" />
                  Registrarse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
