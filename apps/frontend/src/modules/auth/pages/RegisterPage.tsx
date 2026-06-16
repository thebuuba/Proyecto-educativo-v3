/**
 * Página de registro — Formulario para crear una nueva cuenta de institución
 * con validación de campos, estado de carga y manejo de errores.
 */

import {
  ArrowRight,
  BookOpen,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  Users,
} from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

import { useAuth } from '@/modules/auth/hooks/useAuth'

/** Genera un slug URL-friendly a partir de un texto. */
function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Retorna un mensaje de error legible para el registro. */
function getRegisterErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return 'No se pudo crear la cuenta. Intenta nuevamente.'
  }

  if (error.message.toLowerCase().includes('already registered')) {
    return 'Este correo ya está registrado'
  }

  return error.message
}

const benefits = [
  { icon: BookOpen, text: 'Registro de asistencia digital' },
  { icon: GraduationCap, text: 'Calificaciones y reportes automáticos' },
  { icon: Users, text: 'Gestión de grupos y estudiantes' },
  { icon: Check, text: 'Agenda y calendario escolar integrado' },
]

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107" />
      <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00" />
      <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50" />
      <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

/**
 * Página de registro de institución.
 * Redirige al inicio tras un registro exitoso.
 */
export function RegisterPage() {
  const { register } = useAuth()
  const [schoolName, setSchoolName] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [terms, setTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registered, setRegistered] = useState(false)
  const passwordsMatch = Boolean(password && confirmPassword && password === confirmPassword)

  if (registered) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')

    const trimmedSchoolName = schoolName.trim()
    const trimmedFullName = fullName.trim()
    const trimmedEmail = email.trim()

    if (
      !trimmedSchoolName ||
      !trimmedFullName ||
      !trimmedEmail ||
      !password ||
      !confirmPassword
    ) {
      setErrorMessage('Todos los campos son obligatorios.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.')
      return
    }

    if (!terms) {
      setErrorMessage('Debes aceptar los términos para crear la cuenta.')
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        email: trimmedEmail,
        password,
        fullName: trimmedFullName,
        schoolName: trimmedSchoolName,
        slug: createSlug(trimmedSchoolName),
      })
      setRegistered(true)
    } catch (error) {
      setErrorMessage(getRegisterErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen w-full bg-[#E9EBED] text-[#111827]">
      <section className="dot-grid relative hidden min-h-screen w-[38%] shrink-0 flex-col justify-between overflow-hidden bg-white px-[4.5%] py-[5%] lg:flex">
        <div className="absolute inset-0 bg-white/45" />

        <div className="relative z-10">
          <div className="fu mb-8 flex items-center gap-3">
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

          <h2 className="fu fu1 mb-2 text-[clamp(24px,2.4vw,38px)] font-extrabold leading-[1.08] tracking-tight text-[#111827]">
            Únete a miles
            <br />
            de docentes.
          </h2>
          <p className="fu fu2 mb-6 max-w-[260px] text-sm leading-relaxed text-[#4B5563]">
            Crea tu cuenta gratuita y empieza a gestionar tu aula en minutos.
          </p>

          <div className="fu fu3 space-y-2.5">
            {benefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <div key={benefit.text} className="flex items-center gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#EBF5F7] text-[#1F4E5F]">
                    <Icon size={15} />
                  </div>
                  <p className="text-[13px] font-medium text-[#374151]">
                    {benefit.text}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="relative z-10 fu fu4">
          <p className="text-[12px] text-[#9CA3AF]">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-bold text-[#1F4E5F] transition hover:opacity-70">
              Inicia sesión
            </Link>
          </p>
        </div>
      </section>

      <section className="flex min-h-screen flex-1 flex-col items-center justify-center overflow-y-auto bg-[#F0F1F3] px-4 py-8 sm:px-8 lg:px-10 xl:px-14">
        <div className="w-full max-w-[680px] py-6">
          <div className="mb-7 flex items-center gap-3 lg:hidden">
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

          <h1 className="fu text-[clamp(20px,2vw,30px)] font-extrabold tracking-tight text-[#111827]">
            Crear cuenta
          </h1>
          <p className="fu mb-5 text-sm text-[#6B7280]">
            Completa los datos para registrarte en Aula Base.
          </p>

          {errorMessage ? (
            <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-500">
              {errorMessage}
            </div>
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="fu fu1 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">
                  Nombre completo
                </label>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Ana García"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-5 py-3.5 text-[15px] text-[#111827] transition-all focus:border-[#2D6977] focus:outline-none focus:ring-4 focus:ring-[rgba(31,78,95,.14)]"
                />
              </div>
              <div>
                <label htmlFor="registerEmail" className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">
                  Correo electrónico
                </label>
                <input
                  id="registerEmail"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="ana@escuela.edu"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-5 py-3.5 text-[15px] text-[#111827] transition-all focus:border-[#2D6977] focus:outline-none focus:ring-4 focus:ring-[rgba(31,78,95,.14)]"
                />
              </div>
            </div>

            <div className="fu fu2">
              <label htmlFor="schoolName" className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">
                Institución educativa
              </label>
              <input
                id="schoolName"
                type="text"
                autoComplete="organization"
                required
                value={schoolName}
                onChange={(event) => setSchoolName(event.target.value)}
                placeholder="Colegio San Martín"
                className="w-full rounded-xl border border-[#E5E7EB] bg-white px-5 py-3.5 text-[15px] text-[#111827] transition-all focus:border-[#2D6977] focus:outline-none focus:ring-4 focus:ring-[rgba(31,78,95,.14)]"
              />
            </div>

            <div className="fu fu3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="registerPassword" className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="registerPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full rounded-xl border border-[#E5E7EB] bg-white px-5 py-3.5 pr-10 text-[15px] text-[#111827] transition-all focus:border-[#2D6977] focus:outline-none focus:ring-4 focus:ring-[rgba(31,78,95,.14)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D1D5DB] transition hover:opacity-60"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Repite tu contraseña"
                    className="w-full rounded-xl border bg-white px-5 py-3.5 pr-14 text-[15px] text-[#111827] transition-all focus:border-[#2D6977] focus:outline-none focus:ring-4 focus:ring-[rgba(31,78,95,.14)]"
                    style={{
                      borderColor: confirmPassword
                        ? passwordsMatch
                          ? '#10B981'
                          : '#EF4444'
                        : '#E5E7EB',
                    }}
                  />
                  {confirmPassword ? (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px]">
                      {passwordsMatch ? '✓' : '✗'}
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((current) => !current)}
                    className="absolute right-7 top-1/2 -translate-y-1/2 text-[#D1D5DB] transition hover:opacity-60"
                    aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="fu fu4 flex items-start gap-3 pt-1">
              <button
                type="button"
                onClick={() => setTerms((current) => !current)}
                className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-all"
                style={{
                  borderColor: terms ? '#1F4E5F' : '#D1D5DB',
                  background: terms ? '#1F4E5F' : 'transparent',
                }}
                aria-pressed={terms}
              >
                {terms ? <Check size={11} className="text-white" /> : null}
              </button>
              <p className="text-[12px] leading-relaxed text-[#6B7280]">
                Acepto los{' '}
                <span className="cursor-pointer font-semibold text-[#1F4E5F] hover:opacity-70">
                  Términos de servicio
                </span>{' '}
                y la{' '}
                <span className="cursor-pointer font-semibold text-[#1F4E5F] hover:opacity-70">
                  Política de privacidad
                </span>{' '}
                de Aula Base.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="fu fu5 mt-1 flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#1F4E5F] py-4 text-[15px] font-bold text-white shadow-[0_4px_14px_rgba(31,78,95,.25)] transition-all active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Creando cuenta...' : 'Crear mi cuenta'}
              <ArrowRight size={15} />
            </button>

            <div className="fu fu6 flex items-center gap-3 pt-1">
              <div className="h-px flex-1 bg-[#E5E7EB]" />
              <span className="text-[11px] font-medium text-[#9CA3AF]">
                o regístrate con
              </span>
              <div className="h-px flex-1 bg-[#E5E7EB]" />
            </div>

            <div className="fu fu6 grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2.5 rounded-xl border border-[#E5E7EB] bg-white py-3.5 text-sm font-semibold text-[#374151] transition-all hover:bg-gray-50"
              >
                <GoogleIcon />
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2.5 rounded-xl bg-[#1877F2] py-3.5 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(24,119,242,.22)] transition-all"
              >
                <FacebookIcon />
                Facebook
              </button>
            </div>
          </form>

          <p className="mt-5 text-center text-[12px] text-[#9CA3AF] lg:hidden">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-bold text-[#1F4E5F]">
              Inicia sesión
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
