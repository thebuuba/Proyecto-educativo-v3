import {
  CheckCircle,
  Eye,
  EyeOff,
} from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { AuthTransitionLink } from '@/modules/auth/components/AuthTransitionLink'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { FacebookIcon, FLOATING_ICONS, GoogleIcon } from '@/components/auth/AuthIcons'

type LocationState = {
  from?: {
    pathname?: string
  }
  registered?: boolean
}

export function LoginPage() {
  const { authError, isAuthenticated, loading, login, loginWithProvider, profileRequired } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false)
  const fromState = location.state as LocationState | null
  const from =
    fromState?.from?.pathname && fromState.from.pathname !== '/login' && fromState.from.pathname !== '/'
      ? fromState.from.pathname
      : '/inicio'
  const registered = fromState?.registered === true

  if (!loading && isAuthenticated) {
    return <Navigate to={from ?? '/inicio'} replace />
  }

  if (!loading && profileRequired) {
    return <Navigate to="/onboarding" replace />
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

  function handleForgotPassword() {
    if (!email.trim()) {
      setErrorMessage('Ingresa tu correo electrónico primero.')
      return
    }

    setErrorMessage('')
    setForgotPasswordSent(true)
  }

  return (
    <main className="auth-screen page-enter relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10" style={{ backgroundColor: '#FAFBFC' }}>
      <div className="pointer-events-none absolute inset-0">
        {FLOATING_ICONS.map((item, i) => (
          <item.Icon
            key={i}
            style={{
              position: 'absolute',
              top: item.top,
              left: item.left,
              width: item.size,
              height: item.size,
              color: '#1E3D8F',
              opacity: 0.06,
              transform: `translate(-50%, -50%) rotate(${item.rotate}deg)`,
            }}
            strokeWidth={1.5}
          />
        ))}
        <div
          className="absolute rounded-full blur-3xl"
          style={{
            top: '-10%',
            right: '-10%',
            width: 500,
            height: 500,
            background: 'radial-gradient(circle, rgba(30,61,143,0.08) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full blur-3xl"
          style={{
            bottom: '-15%',
            left: '-10%',
            width: 500,
            height: 500,
            background: 'radial-gradient(circle, rgba(30,61,143,0.06) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="auth-panel relative z-10 w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center">
          <div
            className="mb-4 flex size-14 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-md"
            style={{ backgroundColor: '#1E3D8F', boxShadow: '0 4px 14px rgba(30,61,143,0.25)' }}
          >
            AB
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Aula Base
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Sistema docente
          </p>
        </div>

        {errorMessage || authError ? (
          <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
            <div className="flex size-4 shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-100">
              <span className="text-[10px] font-bold text-red-500">!</span>
            </div>
            <span className="text-sm text-red-500">{errorMessage || authError}</span>
          </div>
        ) : null}

        {registered && !errorMessage && !authError ? (
          <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-[#D1FAE5] bg-[#D1FAE5] px-4 py-3">
            <CheckCircle className="size-4 text-[#059669]" />
            <span className="text-sm font-medium text-[#059669]">
              Cuenta creada exitosamente. Ya puedes iniciar sesión.
            </span>
          </div>
        ) : null}

        {forgotPasswordSent && !errorMessage ? (
          <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-[#D1FAE5] bg-[#D1FAE5] px-4 py-3">
            <CheckCircle className="size-4 text-[#059669]" />
            <span className="text-sm font-medium text-[#059669]">
              Te hemos enviado un correo para restablecer tu contraseña.
            </span>
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="docente@escuela.edu"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setErrorMessage('')
              }}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 transition-all focus:border-[#1E3D8F] focus:outline-none focus:ring-2 focus:ring-[#1E3D8F]/10"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setErrorMessage('')
                }}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-11 text-sm text-gray-800 placeholder-gray-400 transition-all focus:border-[#1E3D8F] focus:outline-none focus:ring-2 focus:ring-[#1E3D8F]/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="size-4 cursor-pointer accent-[#1E3D8F]"
              />
              <span className="text-sm text-gray-600">Recordarme</span>
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm font-medium hover:underline"
              style={{ color: '#1E3D8F' }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-100 hover:opacity-90 active:scale-[0.94] active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: '#1E3D8F' }}
          >
            {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">o continúa con</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => loginWithProvider('google').catch((error: unknown) => {
              setErrorMessage(error instanceof Error ? error.message : 'No se pudo iniciar con Google.')
            })}
            className="flex items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-100 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.94] active:shadow-none"
          >
            <GoogleIcon />
            Google
          </button>
          <button
            type="button"
            onClick={() => loginWithProvider('facebook').catch((error: unknown) => {
              setErrorMessage(error instanceof Error ? error.message : 'No se pudo iniciar con Facebook.')
            })}
            className="flex items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-100 hover:opacity-90 active:scale-[0.94] active:shadow-none"
            style={{ backgroundColor: '#1877F2' }}
          >
            <FacebookIcon />
            Facebook
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          ¿Aún no tienes cuenta?{' '}
          <AuthTransitionLink
            to="/registro"
            direction="forward"
            className="font-semibold hover:underline"
            style={{ color: '#1E3D8F' }}
          >
            Regístrate
          </AuthTransitionLink>
        </p>

        <p className="mt-12 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Aula Base
        </p>
      </div>
    </main>
  )
}
