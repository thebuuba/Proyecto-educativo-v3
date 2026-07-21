/**
 * @file Componente SchoolProfileForm
 *
 * Formulario para editar los datos del perfil del centro
 * educativo: nombre, sector y código oficial.
 */

import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { SchoolProfile } from '@/modules/school-administration/types'

/** Propiedades del componente SchoolProfileForm */
type SchoolProfileFormProps = {
  profile: SchoolProfile | null
  onSave: (input: {
    name: string
    sector: SchoolProfile['sector']
    centerCode: string | null
  }) => Promise<void>
}

const sectorOptions = [
  { value: 'private', label: 'Privado' },
  { value: 'public', label: 'Público' },
  { value: 'semiofficial', label: 'Semioficial' },
] as const

export function SchoolProfileForm({ profile, onSave }: SchoolProfileFormProps) {
  const [name, setName] = useState(profile?.name ?? '')
  const [sector, setSector] = useState<SchoolProfile['sector']>(profile?.sector ?? 'private')
  const [centerCode, setCenterCode] = useState(profile?.centerCode ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      await onSave({
        name: name.trim(),
        sector,
        centerCode: centerCode.trim() || null,
      })
      setSuccess(true)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar.',
      )
    } finally {
      setSaving(false)
    }
  }

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Centro educativo</CardTitle>
          <CardDescription>Cargando información...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Centro educativo</CardTitle>
        <CardDescription>
          Información general de la institución educativa.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-lg border border-success/20 bg-success/12 p-3 text-sm text-success">
              Información guardada correctamente.
            </div>
          ) : null}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Nombre de la institución <span className="text-destructive">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Colegio Aula Base"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Sector</label>
              <Select
                value={sector}
                onChange={(e) => setSector(e.target.value as SchoolProfile['sector'])}
              >
                {sectorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Código de centro</label>
              <Input value={centerCode} onChange={(e) => setCenterCode(e.target.value)} />
            </div>
          </div>

          <Button type="submit" loading={saving} disabled={!name.trim()}>
            Guardar cambios
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
