/**
 * @file Página de Perfil
 *
 * Vista del perfil del usuario autenticado con datos
 * personales, roles, seguridad y opciones de actualización.
 */

import { KeyRound, Save, ShieldCheck, UserRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ErrorState } from '@/components/ui/ErrorState'
import { Input } from '@/components/ui/Input'
import { FeedbackBanner, PageHero, SemanticIcon, StatusBadge } from '@/components/ui/SemanticUI'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { updateOwnProfile } from '@/modules/profile/services/profileService'
import { api } from '@/services/apiClient'
import type { UserRole } from '@/types/domain'

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
      await updateOwnProfile(appUser.id, { fullName, phone, avatarUrl })
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
    return <section className="w-full min-w-0"><ErrorState message="No se pudo cargar tu perfil." /></section>
  }

  const active = String(appUser.status).toLowerCase() === 'active' || String(appUser.status).toLowerCase() === 'activo'

  return (
    <section className="w-full min-w-0 space-y-5">
      <PageHero
        title="Perfil"
        description="Actualiza tus datos personales y las opciones de seguridad de tu cuenta."
        icon={UserRound}
        tone="info"
        eyebrow="Cuenta"
      >
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone={active ? 'success' : 'warning'}>{active ? 'Cuenta activa' : appUser.status}</StatusBadge>
          <span className="text-xs text-muted-foreground">{roleText}</span>
        </div>
      </PageHero>

      {error ? <FeedbackBanner tone="danger">{error}</FeedbackBanner> : null}
      {success ? <FeedbackBanner tone="success">{success}</FeedbackBanner> : null}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 border-b-0 pb-2">
            <SemanticIcon icon={UserRound} tone="info" className="size-10 rounded-xl" iconClassName="size-4" />
            <div>
              <CardTitle>Datos personales</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">Información principal de tu cuenta docente.</p>
            </div>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => void handleSubmit(event)}>
              <label className="block">
                <span className="text-sm font-semibold text-foreground">Nombre completo</span>
                <Input className="mt-2" value={fullName} onChange={(event) => setFullName(event.target.value)} disabled={saving} />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-foreground">Teléfono</span>
                <Input className="mt-2" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Sin teléfono" disabled={saving} />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-semibold text-foreground">URL de avatar</span>
                <Input className="mt-2" value={avatarUrl} onChange={(event) => setAvatarUrl(event.target.value)} placeholder="https://..." disabled={saving} />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-semibold text-foreground">Correo</span>
                <Input className="mt-2" value={appUser.email} disabled readOnly />
              </label>
              <div className="sm:col-span-2">
                <Button type="submit" loading={saving}><Save className="size-4" /> Guardar cambios</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/14 text-lg font-extrabold text-foreground">
                  {getInitials(appUser.fullName)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-base font-extrabold text-foreground">{appUser.fullName}</p>
                  <p className="truncate text-sm text-muted-foreground">{appUser.email}</p>
                </div>
              </div>
              <dl className="grid gap-3 text-sm">
                <InfoRow label="Rol" value={roleText} />
                <InfoRow label="Escuela" value={appUser.schoolId} />
                <InfoRow label="Estado" value={String(appUser.status)} />
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3 border-b-0 pb-2">
              <SemanticIcon icon={ShieldCheck} tone="warning" className="size-10 rounded-xl" iconClassName="size-4" />
              <CardTitle>Seguridad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {appUser.lastLoginAt ? `Último acceso: ${formatDateTime(appUser.lastLoginAt)}` : 'Aún no hay un último acceso registrado.'}
              </p>
              <Button variant="outline" className="w-full justify-center" loading={sendingReset} onClick={() => void handlePasswordReset()}>
                <KeyRound className="size-4" /> Enviar enlace de contraseña
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-muted/55 px-3 py-2.5"><dt className="text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">{label}</dt><dd className="mt-0.5 break-words font-semibold text-foreground">{value}</dd></div>
}

function getInitials(name: string) {
  const initials = name.split(/\s+/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
  return initials || 'AB'
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('es-DO', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}
