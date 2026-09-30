import { ArrowRight, Check, Eye, EyeOff } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { RegistrationLayout } from '@/modules/auth/components/RegistrationLayout'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { isValidPassword } from '@/modules/auth/utils/password'

export function RegisterPage() {
  const { register, isAuthenticated, onboardingComplete, profileRequired } = useAuth()
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  if (isAuthenticated && onboardingComplete) return <Navigate to="/inicio" replace />
  if (profileRequired || (isAuthenticated && onboardingComplete === false))
    return <Navigate to="/onboarding" replace />

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    const nextErrors: Record<string, string> = {}
    if (!firstName.trim()) nextErrors.firstName = 'Escribe tu nombre.'
    if (!lastName.trim()) nextErrors.lastName = 'Escribe tus apellidos.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      nextErrors.email = 'Escribe un correo válido.'
    if (!isValidPassword(password))
      nextErrors.password = 'Usa 8 caracteres o más, con mayúscula, minúscula y número.'
    if (!accepted) nextErrors.accepted = 'Acepta los Términos y la Política de privacidad.'
    setErrors(nextErrors)
    setServerError('')
    if (Object.keys(nextErrors).length) return
    setSubmitting(true)
    try {
      const result = await register({
        email: email.trim(),
        password,
        fullName: `${firstName.trim()} ${lastName.trim()}`,
      })
      if (result === 'confirmation-required') {
        sessionStorage.setItem('aulabase:confirmation-email', email.trim())
        navigate('/registro/confirma-correo', { replace: true })
      } else {
        sessionStorage.removeItem('aulabase:confirmation-email')
        navigate('/onboarding', { replace: true })
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No se pudo crear la cuenta. Intenta nuevamente.'
      setServerError(
        /already registered/i.test(message)
          ? 'Este correo ya está registrado. Inicia sesión.'
          : message,
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <RegistrationLayout>
      <h1 className="text-[26px] font-semibold tracking-tight sm:text-3xl">Crea tu cuenta</h1>
      <p className="mt-2 text-[15px] text-muted-foreground">
        ¿Ya tienes cuenta?{' '}
        <Link className="font-medium text-primary hover:underline" to="/login">
          Inicia sesión
        </Link>
      </p>
      <form noValidate onSubmit={submit} className="mt-8 space-y-5">
        {serverError && (
          <p role="alert" className="rounded-2xl bg-destructive/12 p-4 text-sm text-destructive">
            {serverError}
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="first-name"
            label="Nombre"
            value={firstName}
            onChange={setFirstName}
            error={errors.firstName}
            autoComplete="given-name"
          />
          <Field
            id="last-name"
            label="Apellidos"
            value={lastName}
            onChange={setLastName}
            error={errors.lastName}
            autoComplete="family-name"
          />
        </div>
        <Field
          id="email"
          label="Correo electrónico"
          value={email}
          onChange={setEmail}
          error={errors.email}
          type="email"
          autoComplete="email"
        />
        <div>
          <label htmlFor="register-password" className="mb-2 block text-sm font-medium">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="register-password"
              className="auth-input pr-12"
              type={visible ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(errors.password)}
              aria-describedby="password-help"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 grid w-12 place-items-center text-muted-foreground"
              aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              onClick={() => setVisible(!visible)}
            >
              {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p
            id="password-help"
            className={`mt-2 text-xs ${errors.password ? 'text-destructive' : 'text-muted-foreground'}`}
          >
            {errors.password || '8 caracteres o más, con mayúscula, minúscula y número.'}
          </p>
        </div>
        <div>
          <label className="flex items-start gap-3 text-sm leading-relaxed">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              aria-invalid={Boolean(errors.accepted)}
              className="mt-1 size-4 accent-primary"
            />
            <span>
              Acepto los{' '}
              <Link
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline"
                to="/terminos"
              >
                Términos y condiciones
              </Link>{' '}
              y la{' '}
              <Link
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline"
                to="/privacidad"
              >
                Política de privacidad
              </Link>
              .
            </span>
          </label>
          {errors.accepted && (
            <p role="alert" className="mt-2 text-xs text-destructive">
              {errors.accepted}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full" loading={submitting} disabled={submitting}>
          Crear cuenta <ArrowRight size={17} />
        </Button>
      </form>
      <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Check className="size-4 text-success" /> El centro y los cursos se configuran después del
        registro.
      </p>
    </RegistrationLayout>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  autoComplete,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  type?: string
  autoComplete: string
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        className="auth-input"
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <p
        id={`${id}-error`}
        role={error ? 'alert' : undefined}
        className="mt-1 text-xs text-destructive"
      >
        {error}
      </p>
    </div>
  )
}
