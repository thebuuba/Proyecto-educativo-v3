/**
 * @file Componente SchoolProfileForm
 *
 * Formulario para editar los datos del perfil del centro
 * educativo: nombre, sector, jornada, etc.
 */

import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { SchoolProfile } from '@/modules/settings/types'

/** Propiedades del componente SchoolProfileForm */
type SchoolProfileFormProps = {
  profile: SchoolProfile | null
  onSave: (input: {
    name: string
    slug: string
    sector: SchoolProfile['sector']
    centerCode: string | null
    schoolShift: SchoolProfile['schoolShift']
    primaryModality: SchoolProfile['primaryModality']
    enabledSubsystems: string[]
    officialExportsEnabled: boolean
  }) => Promise<void>
}

const sectorOptions = [
  { value: 'private', label: 'Privado' },
  { value: 'public', label: 'Público' },
  { value: 'semiofficial', label: 'Semioficial' },
] as const

const shiftOptions = [
  { value: 'morning', label: 'Matutina' },
  { value: 'afternoon', label: 'Vespertina' },
  { value: 'night', label: 'Nocturna' },
  { value: 'extended', label: 'Jornada extendida' },
  { value: 'full_day', label: 'Jornada completa' },
] as const

const modalityOptions = [
  { value: 'general', label: 'General/Académica' },
  { value: 'academic', label: 'Académica' },
  { value: 'technical_professional', label: 'Técnico-Profesional' },
  { value: 'arts', label: 'Artes' },
] as const

const subsystemOptions = [
  { value: 'regular', label: 'Regular' },
  { value: 'adults', label: 'Adultos' },
  { value: 'prepara', label: 'PREPARA' },
  { value: 'special', label: 'Educación especial' },
] as const

export function SchoolProfileForm({ profile, onSave }: SchoolProfileFormProps) {
  const [name, setName] = useState(profile?.name ?? '')
  const [slug, setSlug] = useState(profile?.slug ?? '')
  const [sector, setSector] = useState<SchoolProfile['sector']>(profile?.sector ?? 'private')
  const [centerCode, setCenterCode] = useState(profile?.centerCode ?? '')
  const [schoolShift, setSchoolShift] = useState<SchoolProfile['schoolShift']>(
    profile?.schoolShift ?? 'extended',
  )
  const [primaryModality, setPrimaryModality] = useState<SchoolProfile['primaryModality']>(
    profile?.primaryModality ?? 'general',
  )
  const [enabledSubsystems, setEnabledSubsystems] = useState<string[]>(
    profile?.enabledSubsystems.length ? profile.enabledSubsystems : ['regular'],
  )
  const [officialExportsEnabled, setOfficialExportsEnabled] = useState(
    profile?.officialExportsEnabled ?? true,
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !slug.trim()) return

    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      await onSave({
        name: name.trim(),
        slug: slug.trim(),
        sector,
        centerCode: centerCode.trim() || null,
        schoolShift,
        primaryModality,
        enabledSubsystems,
        officialExportsEnabled,
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

  function toggleSubsystem(value: string) {
    setEnabledSubsystems((current) => {
      if (current.includes(value)) {
        const next = current.filter((item) => item !== value)
        return next.length ? next : ['regular']
      }

      return [...current, value]
    })
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Slug <span className="text-destructive">*</span>
            </label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Ej: colegio-aula-base"
              required
            />
            <p className="text-xs text-muted-foreground">
              Identificador único usado en URLs. Solo letras, números y guiones.
            </p>
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
              <label className="text-sm font-medium text-foreground">Jornada / tanda</label>
              <Select
                value={schoolShift}
                onChange={(e) => setSchoolShift(e.target.value as SchoolProfile['schoolShift'])}
              >
                {shiftOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Código de centro</label>
              <Input value={centerCode} onChange={(e) => setCenterCode(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Modalidad principal</label>
              <Select
                value={primaryModality}
                onChange={(e) =>
                  setPrimaryModality(e.target.value as SchoolProfile['primaryModality'])
                }
              >
                {modalityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <fieldset className="space-y-3 rounded-lg border border-border p-3">
            <legend className="px-1 text-sm font-medium text-foreground">
              Subsistemas habilitados
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {subsystemOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <input
                    type="checkbox"
                    checked={enabledSubsystems.includes(option.value)}
                    onChange={() => toggleSubsystem(option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={officialExportsEnabled}
              onChange={(e) => setOfficialExportsEnabled(e.target.checked)}
            />
            Habilitar encabezados y exportables compatibles con MINERD
          </label>

          <Button type="submit" loading={saving} disabled={!name.trim() || !slug.trim()}>
            Guardar cambios
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
