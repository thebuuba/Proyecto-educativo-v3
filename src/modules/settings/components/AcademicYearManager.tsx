import { Check, Plus } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import type { SchoolYearItem } from '@/modules/settings/types'
import { cn } from '@/utils/cn'

type AcademicYearManagerProps = {
  schoolYears: SchoolYearItem[]
  onAdd: (input: { name: string; startDate: string; endDate: string }) => Promise<void>
  onActivate: (id: string) => Promise<void>
}

const currentYear = new Date().getFullYear()

export function AcademicYearManager({
  schoolYears,
  onAdd,
  onActivate,
}: AcademicYearManagerProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [name, setName] = useState(`Año Escolar ${currentYear}-${currentYear + 1}`)
  const [startDate, setStartDate] = useState(`${currentYear}-09-01`)
  const [endDate, setEndDate] = useState(`${currentYear + 1}-08-31`)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activating, setActivating] = useState<string | null>(null)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !startDate || !endDate) return

    setSaving(true)
    setError(null)

    try {
      await onAdd({ name: name.trim(), startDate, endDate })
      setFormOpen(false)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo crear el año escolar.',
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleActivate(id: string) {
    setActivating(id)
    try {
      await onActivate(id)
    } finally {
      setActivating(null)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Años escolares</CardTitle>
            <CardDescription>
              Administra los períodos lectivos de la institución.
            </CardDescription>
          </div>
          <Button variant="primary" size="sm" onClick={() => setFormOpen(true)}>
            <Plus className="size-4" />
            Nuevo
          </Button>
        </CardHeader>
        <CardContent>
          {schoolYears.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No hay años escolares registrados.
            </p>
          ) : (
            <div className="divide-y divide-border rounded-lg border border-border">
              {schoolYears.map((year) => (
                <div
                  key={year.id}
                  className={cn(
                    'flex items-center justify-between gap-4 px-4 py-3',
                    year.status === 'inactive' && 'opacity-55',
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-foreground">
                        {year.name}
                      </span>
                      {year.isCurrent ? (
                        <Badge tone="success">Actual</Badge>
                      ) : null}
                      {year.status === 'inactive' ? (
                        <Badge tone="muted">Inactivo</Badge>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {year.startDate} — {year.endDate}
                    </p>
                  </div>

                  {!year.isCurrent && year.status === 'active' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      loading={activating === year.id}
                      onClick={() => handleActivate(year.id)}
                    >
                      <Check className="size-4" />
                      Activar
                    </Button>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {formOpen ? (
        <Modal
          title="Nuevo año escolar"
          description="Registra un nuevo período lectivo."
          onClose={() => setFormOpen(false)}
        >
          <form onSubmit={handleCreate} className="space-y-4 p-5">
            {error ? (
              <div className="rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Nombre <span className="text-destructive">*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Fecha inicio <span className="text-destructive">*</span>
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Fecha fin <span className="text-destructive">*</span>
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" type="button" onClick={() => setFormOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" loading={saving}>
                Crear año escolar
              </Button>
            </div>
          </form>
        </Modal>
      ) : null}
    </>
  )
}
