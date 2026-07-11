/**
 * @file Página de Perfil
 *
 * Vista del perfil del usuario autenticado con datos
 * personales, roles, seguridad y opciones de actualización.
 */

import { KeyRound, Save } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ErrorState } from '@/components/ui/ErrorState'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import {
  updateOwnProfile,
} from '@/modules/profile/services/profileService'
import { api } from '@/services/apiClient'
import type { UserRole } from '@/types/domain'

/** Etiquetas en español para cada rol del sistema */
const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  director: 'Director',
  coordinator: 'Coordinador',
  teacher: 'Docente',
  student: 'Estudiante',
  guardian: 'Tutor',
  viewer: 'Lector',
}

export function ProfilePage() {
  const { appUser, roles, refreshAuth } = useAuth()
  const [fullName, setFullName] = useState(appUser?.fullName ?? '')
  const [phone, setPhone] = useState(appUser?.phone ?? '')
  const [avatarUrl, setAvatarUrl] = useState(appUser?.avatarUrl ?? '')
  const [saving, setSaving] = useState(false)
  const [sendingReset, setSendingReset] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const roleText = useMemo(() => {
    if (roles.length === 0) return 'Sin rol activo'
    return roles.map((role) => roleLabels[role.key]).join(', ')
  }, [roles])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!appUser) {
      setError('No se pudo cargar tu perfil.')
      return
    }

    if (!fullName.trim()) {
      setError('El nombre completo es obligatorio.')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      await updateOwnProfile(appUser.id, {
        fullName,
        phone,
        avatarUrl,
      })
      await refreshAuth()
      setSuccess('Perfil actualizado correctamente.')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No se pudo actualizar el perfil.')
    } finally {
      setSaving(false)
    }
  }

  async function handlePasswordReset() {
    if (!appUser?.email) {
      setError('Tu perfil no tiene un correo disponible.')
      return
    }

    setSendingReset(true)
    setError(null)
    setSuccess(null)

    try {
      await api.post('/auth/forgot-password', { email: appUser.email })
      setSuccess('Te enviamos un enlace para actualizar tu contraseña.')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No se pudo enviar el enlace.')
    } finally {
      setSendingReset(false)
    }
  }

  if (!appUser) {
    return (
      <section className="w-full min-w-0">
        <ErrorState message="No se pudo cargar tu perfil." />
      </section>
    )
  }

  return (
    <section className="w-full min-w-0 space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-accent">
          Cuenta
        </p>
        <h1 className="mt-3 text-4xl font-bold text-primary">Perfil</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Actualiza tus datos personales y opciones de acceso.
        </p>
      </div>

      {error ? <ErrorState message={error} /> : null}
      {success ? (
        <div className="rounded-lg border border-success/25 bg-success/10 p-3 text-sm font-medium text-success">
          {success}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Datos personales</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={(event) => void handleSubmit(event)}>
              <label className="block">
                <span className="text-sm font-semibold text-foreground">Nombre completo</span>
                <Input
                  className="mt-2"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  disabled={saving}
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-foreground">Teléfono</span>
                <Input
                  className="mt-2"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Sin teléfono"
                  disabled={saving}
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-foreground">URL de avatar</span>
                <Input
                  className="mt-2"
                  value={avatarUrl}
                  onChange={(event) => setAvatarUrl(event.target.value)}
                  placeholder="https://..."
                  disabled={saving}
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-foreground">Correo</span>
                <Input className="mt-2" value={appUser.email} disabled readOnly />
              </label>

              <Button type="submit" className="h-11 px-5" loading={saving}>
                <Save className="size-4" />
                Guardar cambios
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="flex size-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {getInitials(appUser.fullName)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-base font-bold text-foreground">{appUser.fullName}</p>
                  <p className="truncate text-sm text-muted-foreground">{appUser.email}</p>
                </div>
              </div>

              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="font-semibold text-foreground">Rol</dt>
                  <dd className="mt-1 text-muted-foreground">{roleText}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Escuela</dt>
                  <dd className="mt-1 text-muted-foreground">{appUser.schoolId}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Estado</dt>
                  <dd className="mt-1 text-muted-foreground">{appUser.status}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seguridad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {appUser.lastLoginAt
                  ? `Último acceso: ${formatDateTime(appUser.lastLoginAt)}`
                  : 'Aún no hay un último acceso registrado.'}
              </p>
              <Button
                variant="outline"
                className="w-full justify-center"
                loading={sendingReset}
                onClick={() => void handlePasswordReset()}
              >
                <KeyRound className="size-4" />
                Enviar enlace de contraseña
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

/** Obtiene las iniciales de un nombre completo */
function getInitials(name: string) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return initials || 'AB'
}

/** Formatea una fecha ISO a formato legible en español */
function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('es-DO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
