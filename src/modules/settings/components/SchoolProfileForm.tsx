import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import type { SchoolProfile } from '@/modules/settings/types'

type SchoolProfileFormProps = {
  profile: SchoolProfile | null
  onSave: (input: { name: string; slug: string }) => Promise<void>
}

export function SchoolProfileForm({ profile, onSave }: SchoolProfileFormProps) {
  const [name, setName] = useState(profile?.name ?? '')
  const [slug, setSlug] = useState(profile?.slug ?? '')
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
      await onSave({ name: name.trim(), slug: slug.trim() })
      setSuccess(true)
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
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
          <CardTitle>Institución</CardTitle>
          <CardDescription>Cargando información...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Institución</CardTitle>
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

          <Button type="submit" loading={saving} disabled={!name.trim() || !slug.trim()}>
            Guardar cambios
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
