import { AlertCircle, UserPlus } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { supabase } from '@/services/supabase'

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

async function getAvailableSlug(schoolName: string) {
  const baseSlug = createSlug(schoolName) || 'escuela'
  const { data, error } = await supabase
    .from('schools')
    .select('slug')
    .or(`slug.eq.${baseSlug},slug.like.${baseSlug}-%`)

  if (error) {
    throw error
  }

  const usedSlugs = new Set((data ?? []).map((school) => school.slug))

  if (!usedSlugs.has(baseSlug)) {
    return baseSlug
  }

  let suffix = 1
  let nextSlug = `${baseSlug}-${suffix}`

  while (usedSlugs.has(nextSlug)) {
    suffix += 1
    nextSlug = `${baseSlug}-${suffix}`
  }

  return nextSlug
}

function getRegisterErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return 'No se pudo crear la cuenta. Intenta nuevamente.'
  }

  if (error.message.toLowerCase().includes('user already registered')) {
    return 'Este correo ya está registrado'
  }

  return error.message
}

export function RegisterPage() {
  const [schoolName, setSchoolName] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registered, setRegistered] = useState(false)

  if (registered) {
    return <Navigate to="/login" state={{ registered: true }} replace />
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
      const { error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
      })

      if (signUpError) {
        throw signUpError
      }

      const slug = await getAvailableSlug(trimmedSchoolName)
      const { error: registerError } = await supabase.rpc('register_school', {
        school_name: trimmedSchoolName,
        slug,
        full_name: trimmedFullName,
        email: trimmedEmail,
      })

      if (registerError) {
        throw registerError
      }

      setRegistered(true)
    } catch (error) {
      setErrorMessage(getRegisterErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen bg-background">
      <section className="hidden min-h-screen w-[42%] flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
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

        <p className="text-xs text-muted-foreground">Supabase Auth</p>
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

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
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

              <div>
                <label
                  htmlFor="registerPassword"
                  className="text-sm font-medium text-foreground"
                >
                  Contraseña
                </label>
                <Input
                  id="registerPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-foreground"
                >
                  Confirmar contraseña
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="mt-2"
                />
              </div>

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
