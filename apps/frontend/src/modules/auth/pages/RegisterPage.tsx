import { AlertCircle, UserPlus } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { SocialLoginButtons } from '@/modules/auth/components/SocialLoginButtons'
import { useAuth } from '@/modules/auth/hooks/useAuth'

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

function getRegisterErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return 'No se pudo crear la cuenta. Intenta nuevamente.'
  }

  if (error.message.toLowerCase().includes('already registered')) {
    return 'Este correo ya está registrado'
  }

  return error.message
}

export function RegisterPage() {
  const { register, loginWithOAuth } = useAuth()
  const [schoolName, setSchoolName] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registered, setRegistered] = useState(false)

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
                Registrar escuela
              </h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Crea la cuenta administradora de tu institución.
              </p>
            </div>

            {errorMessage ? (
              <div className="mt-6 flex gap-3 rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <p>{errorMessage}</p>
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
                  htmlFor="schoolName"
                  className="text-sm font-medium text-foreground"
                >
                  Nombre del colegio
                </label>
                <Input
                  id="schoolName"
                  type="text"
                  autoComplete="organization"
                  required
                  value={schoolName}
                  onChange={(event) => setSchoolName(event.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <label
                  htmlFor="fullName"
                  className="text-sm font-medium text-foreground"
                >
                  Nombre completo
                </label>
                <Input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <label
                  htmlFor="registerEmail"
                  className="text-sm font-medium text-foreground"
                >
                  Correo electrónico
                </label>
                <Input
                  id="registerEmail"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2"
                />
              </div>

              <PasswordInput
                id="registerPassword"
                label="Contraseña"
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              <PasswordInput
                id="confirmPassword"
                label="Confirmar contraseña"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />

              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                loading={isSubmitting}
                className="w-full"
              >
                <UserPlus className="size-4" />
                {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
              </Button>
            </form>

            <div className="mt-6 border-t border-border pt-6">
              <p className="text-center text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login">
                  <span className="text-accent hover:underline">
                    Inicia sesión
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
