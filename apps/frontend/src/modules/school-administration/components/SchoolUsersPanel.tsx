import { UsersRound } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { FeedbackBanner, FilterBar, StatusBadge } from '@/components/ui/SemanticUI'
import type { Role } from '@/modules/auth/types/auth'
import { getSchoolUser, getSchoolUserRoles, listSchoolUsers, updateSchoolUser, type SchoolUser } from '../services/schoolUsersService'

const statusLabels: Record<string, string> = { ACTIVE: 'Activo', INACTIVE: 'Inactivo', ARCHIVED: 'Archivado' }
const statusLabel = (status: string) => statusLabels[status.toUpperCase()] ?? status
const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'No se pudo completar la solicitud.'

export function SchoolUsersPanel() {
  const [users, setUsers] = useState<SchoolUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reload, setReload] = useState(0)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [editing, setEditing] = useState<SchoolUser | null>(null)
  const [editLoading, setEditLoading] = useState(false)
  const [editReady, setEditReady] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [editReload, setEditReload] = useState(0)
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [roles, setRoles] = useState<Role[]>([])
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    listSchoolUsers(controller.signal)
      .then(data => { if (!controller.signal.aborted) setUsers(data) })
      .catch(reason => { if (!controller.signal.aborted) setError(errorMessage(reason)) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [reload])

  useEffect(() => {
    if (!editing) return
    const controller = new AbortController()
    setEditLoading(true)
    setEditReady(false)
    setEditError(null)
    setFullName(editing.fullName)
    setAvatarUrl('')
    setRoles([])
    Promise.all([getSchoolUser(editing.id, controller.signal), getSchoolUserRoles(editing.id, controller.signal)])
      .then(([detail, userRoles]) => {
        if (controller.signal.aborted) return
        if (!detail) throw new Error('Este usuario ya no está disponible.')
        setFullName(detail.fullName)
        setAvatarUrl(detail.avatarUrl ?? '')
        setRoles(userRoles)
        setEditReady(true)
      })
      .catch(reason => { if (!controller.signal.aborted) setEditError(errorMessage(reason)) })
      .finally(() => { if (!controller.signal.aborted) setEditLoading(false) })
    return () => controller.abort()
  }, [editing, editReload])

  async function handleSave(event: FormEvent) {
    event.preventDefault()
    if (!editing || saving || !editReady || !fullName.trim()) return
    setSaving(true)
    setEditError(null)
    setSuccess(null)
    try {
      const updated = await updateSchoolUser(editing.id, { fullName, avatarUrl })
      setUsers(current => current.map(user => user.id === updated.id ? updated : user))
      setEditing(null)
      setSuccess('Datos del usuario actualizados.')
    } catch (reason) {
      setEditError(errorMessage(reason))
    } finally {
      setSaving(false)
    }
  }

  const search = query.trim().toLocaleLowerCase('es')
  const filtered = users.filter(user =>
    (!status || user.status.toUpperCase() === status) &&
    (!search || `${user.fullName} ${user.email}`.toLocaleLowerCase('es').includes(search)),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuarios del centro</CardTitle>
        <CardDescription>Consulta las cuentas del centro y actualiza su nombre y avatar.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {success ? <FeedbackBanner tone="success" role="status">{success}</FeedbackBanner> : null}
        {error ? <FeedbackBanner tone="danger" role="alert" className="flex flex-wrap items-center justify-between gap-3">
          <span>{error}</span><Button variant="outline" onClick={() => setReload(current => current + 1)}>Reintentar</Button>
        </FeedbackBanner> : null}
        <FilterBar className="grid gap-3 p-0 shadow-none sm:grid-cols-[minmax(0,1fr)_200px]">
          <label className="space-y-2 text-sm font-semibold text-foreground">
            <span>Buscar usuarios</span><Input value={query} onChange={event => setQuery(event.target.value)} placeholder="Nombre o correo" />
          </label>
          <label className="space-y-2 text-sm font-semibold text-foreground">
            <span>Estado de usuario</span><Select value={status} onChange={event => setStatus(event.target.value)}>
              <option value="">Todos</option>
              {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </Select>
          </label>
        </FilterBar>
        {loading ? <p role="status" className="text-sm text-muted-foreground">Cargando usuarios…</p> : null}
        {filtered.length ? <ul className="divide-y divide-border/70" aria-label="Usuarios del centro" aria-busy={loading}>
          {filtered.map(user => <li key={user.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div className="min-w-0 flex-1">
              <p className="break-words font-semibold text-foreground">{user.fullName}</p>
              <p className="break-all text-sm text-muted-foreground">{user.email}</p>
            </div>
            <StatusBadge tone={user.status.toUpperCase() === 'ACTIVE' ? 'success' : 'neutral'}>{statusLabel(user.status)}</StatusBadge>
            <Button variant="outline" aria-label={`Editar ${user.fullName}`} disabled={loading || saving} onClick={() => setEditing(user)}>Editar</Button>
          </li>)}
        </ul> : !loading && !error ? <EmptyState compact icon={UsersRound} title={users.length ? 'Sin coincidencias' : 'Sin usuarios'} description={users.length ? 'Prueba otro nombre, correo o estado.' : 'No hay cuentas del centro para mostrar.'} /> : null}
      </CardContent>
      {editing ? <Modal title="Editar usuario" icon={UsersRound} description="Correo, estado y roles son de consulta." onClose={() => setEditing(null)} closeDisabled={saving}>
        <form className="space-y-4 p-5" onSubmit={event => void handleSave(event)}>
          {editLoading ? <p role="status" className="text-sm text-muted-foreground">Cargando datos del usuario…</p> : null}
          {editError ? <FeedbackBanner tone="danger" role="alert">{editError}</FeedbackBanner> : null}
          {!editReady && !editLoading ? <Button variant="outline" onClick={() => setEditReload(current => current + 1)}>Reintentar datos</Button> : null}
          <label className="block space-y-2 text-sm font-semibold text-foreground">
            <span>Nombre completo</span><Input required maxLength={200} value={fullName} onChange={event => setFullName(event.target.value)} disabled={saving || !editReady} />
          </label>
          <label className="block space-y-2 text-sm font-semibold text-foreground">
            <span>URL de avatar</span><Input type="url" value={avatarUrl} onChange={event => setAvatarUrl(event.target.value)} disabled={saving || !editReady} placeholder="https://..." />
          </label>
          <label className="block space-y-2 text-sm font-semibold text-foreground">
            <span>Correo</span><Input value={editing.email} readOnly />
          </label>
          <div className="flex flex-wrap items-center gap-2 text-sm"><span className="font-semibold">Estado</span><StatusBadge tone={editing.status.toUpperCase() === 'ACTIVE' ? 'success' : 'neutral'}>{statusLabel(editing.status)}</StatusBadge></div>
          <div className="space-y-2"><p className="text-sm font-semibold">Roles</p><div className="flex flex-wrap gap-2">
            {roles.map(role => <StatusBadge key={role.id} tone="info" dot={false}>{role.name}</StatusBadge>)}
            {editReady && !roles.length ? <span className="text-sm text-muted-foreground">Sin roles activos</span> : null}
          </div></div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" data-ui-action="cancel" disabled={saving} onClick={() => setEditing(null)}>Cancelar</Button>
            <Button type="submit" loading={saving} disabled={!editReady || !fullName.trim()}>Guardar cambios</Button>
          </div>
        </form>
      </Modal> : null}
    </Card>
  )
}
