import { AlertCircle, LogIn } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '@/modules/auth/hooks/useAuth'

type LocationState = {
  from?: {
    pathname?: string
  }
}

export function LoginPage() {
  const { authError, isAuthenticated, loading, login } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const from =
    (location.state as LocationState | null)?.from?.pathname &&
    (location.state as LocationState).from?.pathname !== '/login'
      ? (location.state as LocationState).from?.pathname
      : '/'

  if (!loading && isAuthenticated) {
    return <Navigate to={from ?? '/'} replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
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

  return (
    <main className="flex min-h-screen bg-slate-100">
      <section className="hidden min-h-screen w-[42%] flex-col justify-between bg-slate-950 p-10 text-white lg:flex">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-lg bg-cyan-500 text-sm font-bold text-white">
            AB
          </span>
          <div>
            <p className="text-sm font-semibold">Aula Base</p>
            <p className="text-xs text-slate-400">Gestión estudiantil</p>
          </div>
        </div>

        <div>
          <p className="max-w-md text-3xl font-semibold leading-tight">
            Acceso seguro para administrar la operación académica.
          </p>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
            Roles, permisos y sesiones preparados para conectar módulos reales
            del sistema.
          </p>
        </div>

        <p className="text-xs text-slate-500">Supabase Auth</p>
      </section>

      <section className="flex min-h-screen flex-1 items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-lg bg-cyan-600 text-sm font-bold text-white">
                AB
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  Aula Base
                </p>
                <p className="text-xs text-slate-500">Gestión estudiantil</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div>
              <h1 className="text-2xl font-semibold text-slate-950">
                Iniciar sesión
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Usa tus credenciales institucionales para continuar.
              </p>
            </div>

            {errorMessage || authError ? (
              <div className="mt-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <p>{errorMessage || authError}</p>
              </div>
            ) : null}

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-cyan-700 px-4 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <LogIn className="size-4" />
                {isSubmitting ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
