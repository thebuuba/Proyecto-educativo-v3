/**
 * Página de inicio de sesión — Formulario de login con estados de carga,
 * error, registro exitoso y recuperación de contraseña.
 */

import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  SquareCheckBig,
  Star,
  Users,
} from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '@/modules/auth/hooks/useAuth'

type LocationState = {
  from?: {
    pathname?: string
  }
  registered?: boolean
}

const features = [
  {
    icon: BookOpen,
    label: 'Clases y horarios',
    desc: 'Gestiona tus grupos y bloques',
  },
  {
    icon: SquareCheckBig,
    label: 'Asistencia rápida',
    desc: 'Registra en segundos por clase',
  },
  {
    icon: Star,
    label: 'Calificaciones',
    desc: 'Carga notas y genera reportes',
  },
  {
    icon: CalendarDays,
    label: 'Agenda docente',
    desc: 'Eventos, reuniones y entregas',
  },
]

const stats = [
  {
    icon: Users,
    value: '1,248',
    label: 'Estudiantes',
    valueColor: '#1F4E5F',
    iconColor: '#2D6977',
  },
  {
    icon: Clock,
    value: '5',
    label: 'Clases hoy',
    valueColor: '#1F4E5F',
    iconColor: '#2D6977',
  },
  {
    icon: SquareCheckBig,
    value: '92%',
    label: 'Asistencia',
    valueColor: '#059669',
    iconColor: '#10B981',
  },
]

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107" />
      <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00" />
      <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50" />
      <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

/**
 * Página de inicio de sesión.
 * Redirige al dashboard si ya está autenticado. Maneja estados de error,
 * registro exitoso y recuperación de contraseña.
 */
export function LoginPage() {
  const { authError, isAuthenticated, loading, login } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false)
  const fromState = location.state as LocationState | null
  const from =
    fromState?.from?.pathname && fromState.from.pathname !== '/login'
      ? fromState.from.pathname
      : '/'
  const registered = fromState?.registered === true

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

  function handleForgotPassword() {
    if (!email.trim()) {
      setErrorMessage('Ingresa tu correo electrónico primero.')
      return
    }

    setErrorMessage('')
    setForgotPasswordSent(true)
  }

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-[#E9EBED] text-[#111827]">
      <section className="relative hidden h-full w-[45%] shrink-0 flex-col justify-between overflow-hidden bg-white px-[5%] py-[5%] lg:flex">
        <div className="dot-grid absolute inset-0 opacity-50" />

        <div className="relative z-10">
          <div className="fu mb-7 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[#1F4E5F] shadow-[0_4px_12px_rgba(31,78,95,.30)]">
              <span className="text-xs font-extrabold text-white">AB</span>
            </div>
            <div>
              <p className="text-[15px] font-extrabold leading-none text-[#111827]">
                Aula Base
              </p>
              <p className="mt-0.5 text-[11px] text-[#2D6977]">Sistema docente</p>
            </div>
          </div>

          <h1 className="fu fu2 mb-2.5 text-[clamp(28px,2.8vw,46px)] font-extrabold leading-[1.08] tracking-tight text-[#111827]">
            Tu aula,
            <br />
            siempre lista.
          </h1>
          <p className="fu fu3 mb-6 max-w-[280px] text-sm leading-relaxed text-[#4B5563]">
            Todo lo que necesitas como docente en un solo lugar: asistencia,
            notas, grupos y agenda.
          </p>

          <div className="fu fu4 grid grid-cols-2 gap-2">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.label}
                  className="flex items-start gap-2.5 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-3"
                >
                  <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-xl border border-[#A8CDD4] bg-[#EBF5F7] text-[#1F4E5F] shadow-[0_1px_4px_rgba(31,78,95,.08)]">
                    <Icon size={13} />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold leading-none text-[#1F2937]">
                      {feature.label}
                    </p>
                    <p className="mt-0.5 text-[10px] leading-tight text-[#6B7280]">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="relative z-10 fu fu5">
          <div className="grid grid-cols-3 divide-x divide-[#E5E7EB] overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB]">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="flex flex-col items-center gap-1 py-3">
                  <Icon size={12} color={stat.iconColor} />
                  <p className="text-sm font-extrabold" style={{ color: stat.valueColor }}>
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-[#6B7280]">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="flex h-full flex-1 flex-col items-center justify-center overflow-y-auto bg-[#F0F1F3] px-4 py-8 sm:px-8 lg:px-[6%] lg:py-[4%]">
        <div className="w-full max-w-[560px]">
          <div className="fu fu1 mb-7 flex items-center gap-4 rounded-2xl border border-[#E5E7EB] bg-white px-5 py-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EBF5F7] text-[#1F4E5F]">
              <BookOpen size={18} />
            </div>
            <div>
              <p className="mb-0.5 text-[13px] font-bold leading-none text-[#111827]">
                Bienvenido de nuevo
              </p>
              <p className="text-[12px] text-[#6B7280]">
                Accede a tu espacio docente en Aula Base
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 rounded-full bg-[#D1FAE5] px-2.5 py-1">
              <span className="size-1.5 rounded-full bg-[#059669]" />
              <span className="text-[10px] font-bold text-[#059669]">En línea</span>
            </div>
          </div>

          <h2 className="fu fu1 mb-1.5 text-[clamp(26px,2.4vw,40px)] font-extrabold leading-none tracking-tight text-[#111827]">
            Inicia sesión
          </h2>
          <p className="fu fu1 mb-7 text-[15px] text-[#6B7280]">
            Ingresa con tus credenciales de docente.
          </p>

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
            <div className="fu fu2">
              <label
                htmlFor="email"
                className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF]"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setErrorMessage('')
                }}
                placeholder="docente@escuela.edu"
                className="w-full rounded-xl border border-[#E5E7EB] bg-white px-5 py-3.5 text-[15px] text-[#111827] transition-all duration-200 focus:border-[#2D6977] focus:outline-none focus:ring-4 focus:ring-[rgba(31,78,95,.15)]"
              />
            </div>

            <div className="fu fu3">
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF]"
                >
                  Contraseña
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[11px] font-medium text-[#1F4E5F] transition hover:opacity-70"
                >
                  ¿Olvidaste la tuya?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    setErrorMessage('')
                  }}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-5 py-3.5 pr-12 text-[15px] text-[#111827] transition-all duration-200 focus:border-[#2D6977] focus:outline-none focus:ring-4 focus:ring-[rgba(31,78,95,.15)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#D1D5DB] transition hover:opacity-70"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="fu fu4 flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#1F4E5F] py-4 text-[15px] font-bold text-white shadow-[0_4px_18px_rgba(31,78,95,.30)] transition-all active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Ingresando...' : 'Ingresar al sistema'}
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="fu fu5 my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E5E7EB]" />
            <span className="text-[11px] font-medium text-[#9CA3AF]">
              o continúa con
            </span>
            <div className="h-px flex-1 bg-[#E5E7EB]" />
          </div>

          <div className="fu fu6 mb-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2.5 rounded-xl border border-[#E5E7EB] bg-white py-3.5 text-[14px] font-semibold text-[#374151] transition-all hover:bg-gray-50 active:scale-[0.98]"
            >
              <GoogleIcon />
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2.5 rounded-xl bg-[#1877F2] py-3.5 text-[14px] font-semibold text-white shadow-[0_2px_8px_rgba(24,119,242,.25)] transition-all active:scale-[0.98]"
            >
              <FacebookIcon />
              Facebook
            </button>
          </div>

          <div className="fu fu6 border-t border-[#E5E7EB] pt-1">
            <p className="mb-3 mt-3.5 text-center text-[13px] text-[#9CA3AF]">
              ¿Eres nuevo en la plataforma?
            </p>
            <Link
              to="/registro"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white py-4 text-[14px] font-semibold text-[#374151] transition-all"
            >
              <Users size={15} color="#1F4E5F" />
              Regístrate
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
