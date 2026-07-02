import {
  Backpack,
  BookOpen,
  Calculator,
  Eye,
  EyeOff,
  GraduationCap,
  Library,
  Microscope,
  Palette,
  Pencil,
  Ruler,
} from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'

import { AuthTransitionLink } from '@/modules/auth/components/AuthTransitionLink'
import { useAuth } from '@/modules/auth/hooks/useAuth'

const FLOATING_ICONS = [
  { Icon: BookOpen, top: '8%', left: '6%', size: 44, rotate: -12 },
  { Icon: Pencil, top: '18%', left: '88%', size: 36, rotate: 22 },
  { Icon: Backpack, top: '72%', left: '8%', size: 48, rotate: 8 },
  { Icon: Calculator, top: '82%', left: '84%', size: 40, rotate: -18 },
  { Icon: Ruler, top: '42%', left: '4%', size: 42, rotate: 45 },
  { Icon: Palette, top: '38%', left: '92%', size: 38, rotate: -25 },
  { Icon: Microscope, top: '58%', left: '90%', size: 40, rotate: 15 },
  { Icon: Library, top: '62%', left: '3%', size: 44, rotate: -8 },
  { Icon: GraduationCap, top: '5%', left: '45%', size: 32, rotate: -6 },
  { Icon: BookOpen, top: '90%', left: '48%', size: 30, rotate: 12 },
]

function getRegisterErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return 'No se pudo crear la cuenta. Intenta nuevamente.'
  }

  if (error.message.toLowerCase().includes('already registered')) {
    return 'Este correo ya está registrado'
  }

  return error.message
}

function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg className="size-4" fill="white" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

export function RegisterPage() {
  const { loginWithProvider, register } = useAuth()
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
    return <Navigate to="/onboarding" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')

    const trimmedFullName = fullName.trim()
    const trimmedEmail = email.trim()

    if (!trimmedFullName || !trimmedEmail || !password || !confirmPassword) {
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
      })
      setRegistered(true)
    } catch (error) {
      setErrorMessage(getRegisterErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
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
        <div className="mb-8 flex flex-col items-center">
          <div
            className="mb-4 flex size-14 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-md"
            style={{ backgroundColor: '#1E3D8F', boxShadow: '0 4px 14px rgba(30,61,143,0.25)' }}
          >
            AB
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Crea tu cuenta
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Únete a la plataforma docente
          </p>
        </div>

        {errorMessage ? (
          <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
            <div className="flex size-4 shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-100">
              <span className="text-[10px] font-bold text-red-500">!</span>
            </div>
            <span className="text-sm text-red-500">{errorMessage}</span>
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Nombre completo
            </label>
            <input
              type="text"
              placeholder="Ana García"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 transition-all focus:border-[#1E3D8F] focus:outline-none focus:ring-2 focus:ring-[#1E3D8F]/10"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="docente@escuela.edu"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Repite tu contraseña"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border bg-white px-4 py-3 pr-11 text-sm text-gray-800 placeholder-gray-400 transition-all focus:border-[#1E3D8F] focus:outline-none focus:ring-2 focus:ring-[#1E3D8F]/10"
                style={{
                  borderColor: confirmPassword
                    ? passwordsMatch
                      ? '#10B981'
                      : '#EF4444'
                    : '#E5E7EB',
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {confirmPassword ? (
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="text-xs font-medium" style={{ color: passwordsMatch ? '#10B981' : '#EF4444' }}>
                  {passwordsMatch ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
                </span>
              </div>
            ) : null}
          </div>

          <label className="flex cursor-pointer items-start gap-2 pt-1">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => {
                setTerms(e.target.checked)
                if (errorMessage === 'Debes aceptar los términos para crear la cuenta.') {
                  setErrorMessage('')
                }
              }}
              className="mt-0.5 size-4 cursor-pointer rounded border-gray-300 accent-[#1E3D8F] shrink-0"
            />
            <span className="text-sm leading-snug text-gray-600">
              Acepto los{' '}
              <button
                type="button"
                className="font-semibold hover:underline"
                style={{ color: '#1E3D8F' }}
              >
                términos y condiciones
              </button>{' '}
              y el{' '}
              <button
                type="button"
                className="font-semibold hover:underline"
                style={{ color: '#1E3D8F' }}
              >
                aviso de privacidad
              </button>
              .
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-100 hover:opacity-90 active:scale-[0.94] active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: '#1E3D8F' }}
          >
            {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">o regístrate con</span>
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

        <p className="mt-6 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <AuthTransitionLink
            to="/login"
            direction="back"
            className="font-semibold hover:underline"
            style={{ color: '#1E3D8F' }}
          >
            Iniciar sesión
          </AuthTransitionLink>
        </p>

        <p className="mt-10 text-center text-xs text-gray-400">
          © 2025 Aula Base
        </p>
      </div>
    </main>
  )
}
