import { AlertCircle, Building2, CheckCircle } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { api } from '@/services/apiClient'

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
  const schools = await api.get<Array<{ slug: string }>>('/settings/school')
  const slugs = schools.map((s) => s.slug)
  const usedSlugs = new Set(slugs)

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

export function CompleteRegistrationPage() {
  const { loading, needsProfile, user, refreshAuth } = useAuth()

  const [schoolName, setSchoolName] = useState('')
  const [nombres, setNombres] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [telefono, setTelefono] = useState('')
  const [slug, setSlug] = useState('')

  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [completed, setCompleted] = useState(false)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="rounded-lg border border-border bg-card px-5 py-4 text-sm font-medium text-foreground shadow-sm">
          Cargando sesión...
        </div>
      </div>
    )
  }

  if (!user || !needsProfile) {
    return <Navigate to="/" replace />
  }

  if (completed) {
    return <Navigate to="/" replace />
  }

  const slugPreview = schoolName ? createSlug(schoolName) : slug

  function handleSchoolNameChange(value: string) {
    setSchoolName(value)
    setSlug(createSlug(value))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')

    const trimmedSchoolName = schoolName.trim()
    const trimmedNombres = nombres.trim()
    const trimmedApellidos = apellidos.trim()
    const trimmedPhone = telefono.trim() || null

    if (!trimmedSchoolName || !trimmedNombres || !trimmedApellidos || !slug) {
      setErrorMessage('Completa todos los campos obligatorios.')
      return
    }

    setIsSubmitting(true)

    try {
      const finalSlug = await getAvailableSlug(trimmedSchoolName)
      const email = user!.email ?? ''

      await api.post('/auth/register', {
        email,
        password: '',
        fullName: `${trimmedNombres} ${trimmedApellidos}`,
        schoolName: trimmedSchoolName,
        slug: finalSlug,
      })

      if (trimmedPhone) {
        await api.patch(`/users/${user!.id}`, { phone: trimmedPhone })
      }

      await refreshAuth()
      setCompleted(true)
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo completar el registro. Intenta nuevamente.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
            AB
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">Aula Base</p>
            <p className="text-xs text-muted-foreground">Gestión estudiantil</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-md animate-in fade-in slide-in-from-bottom-4 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-accent/20">
              <Building2 className="size-5 text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Completa tu registro
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Cuéntanos sobre tu institución para terminar la configuración.
              </p>
            </div>
          </div>

          {errorMessage ? (
            <div className="mt-6 flex gap-3 rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>{errorMessage}</p>
            </div>
          ) : null}

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="schoolName" className="text-sm font-medium text-foreground">
                Nombre del colegio
              </label>
              <Input
                id="schoolName"
                type="text"
                autoComplete="organization"
                required
                value={schoolName}
                  onChange={(event) => handleSchoolNameChange(event.target.value)}
                  className="mt-2"
              />
            </div>

            {slugPreview && (
              <p className="-mt-3 text-xs text-muted-foreground">
                Slug: <span className="font-mono text-foreground">{slugPreview}</span>
              </p>
            )}

            {/* El slug real se envía en el submit, está en la variable `slug` */}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombres" className="text-sm font-medium text-foreground">
                  Nombres
                </label>
                <Input
                  id="nombres"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={nombres}
                  onChange={(event) => setNombres(event.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <label htmlFor="apellidos" className="text-sm font-medium text-foreground">
                  Apellidos
                </label>
                <Input
                  id="apellidos"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={apellidos}
                  onChange={(event) => setApellidos(event.target.value)}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <label htmlFor="telefono" className="text-sm font-medium text-foreground">
                Teléfono <span className="text-muted-foreground">(opcional)</span>
              </label>
              <Input
                id="telefono"
                type="tel"
                autoComplete="tel"
                value={telefono}
                onChange={(event) => setTelefono(event.target.value)}
                className="mt-2"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              className="w-full"
            >
              <CheckCircle className="size-4" />
              {isSubmitting ? 'Guardando...' : 'Completar registro'}
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
