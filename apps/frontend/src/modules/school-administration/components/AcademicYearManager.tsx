/**
 * @file Componente AcademicYearManager
 *
 * Gestión de años escolares: listado, creación, edición y activación
 * del período lectivo actual.
 */

import { CalendarDays, Check, Pencil, Plus } from 'lucide-react'
import { useId, useRef, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { FeedbackBanner, SemanticIcon, StatusBadge } from '@/components/ui/SemanticUI'
import type { SchoolYearItem, UpdateSchoolYearInput } from '@/modules/school-administration/types'
import { cn } from '@/utils/cn'

/** Propiedades del componente AcademicYearManager */
type AcademicYearManagerProps = {
  schoolYears: SchoolYearItem[]
  onAdd: (input: {
    name: string
    startDate: string
    endDate: string
  }) => Promise<void>
  onEdit: (id: string, input: UpdateSchoolYearInput) => Promise<void>
  onActivate: (id: string) => Promise<void>
}

const currentYear = new Date().getFullYear()
const defaultCalendar = getDefaultAcademicCalendar(currentYear)

export function AcademicYearManager({
  schoolYears,
  onAdd,
  onEdit,
  onActivate,
}: AcademicYearManagerProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState(`Año Escolar ${currentYear}-${currentYear + 1}`)
  const [startDate, setStartDate] = useState(defaultCalendar.startDate)
  const [endDate, setEndDate] = useState(defaultCalendar.endDate)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activating, setActivating] = useState<string | null>(null)
  const [activationError, setActivationError] = useState<string | null>(null)
  const pending = useRef(false)
  const formId = useId()
  const busy = saving || activating !== null

  function openForm(year?: SchoolYearItem) {
    if (pending.current) return
    setEditingId(year?.id ?? null)
    setName(year?.name ?? `Año Escolar ${currentYear}-${currentYear + 1}`)
    setStartDate(year?.startDate.slice(0, 10) ?? defaultCalendar.startDate)
    setEndDate(year?.endDate.slice(0, 10) ?? defaultCalendar.endDate)
    setError(null)
    setFormOpen(true)
  }

  function closeForm() {
    if (!pending.current) setFormOpen(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (pending.current) return
    if (!name.trim() || !startDate || !endDate) {
      setError('Completa el nombre y las fechas del año escolar.')
      return
    }
    if (startDate >= endDate) {
      setError('La fecha de inicio debe ser anterior a la fecha de fin.')
      return
    }

    pending.current = true
    setSaving(true)
    setError(null)

    try {
      const input = {
        name: name.trim(),
        startDate,
        endDate,
      }
      if (editingId) await onEdit(editingId, input)
      else await onAdd(input)
      setFormOpen(false)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar el año escolar.',
      )
    } finally {
      setSaving(false)
      pending.current = false
    }
  }

  async function handleActivate(id: string) {
    if (pending.current || formOpen) return
    pending.current = true
    setActivating(id)
    setActivationError(null)
    try {
      await onActivate(id)
    } catch (error) {
      setActivationError(error instanceof Error ? error.message : 'No se pudo activar el año escolar.')
    } finally {
      setActivating(null)
      pending.current = false
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <SemanticIcon icon={CalendarDays} tone="info" />
            <div>
              <CardTitle>Años escolares y calendario</CardTitle>
              <CardDescription>
                Administra los períodos lectivos de la institución.
              </CardDescription>
            </div>
          </div>
          <Button variant="primary" size="sm" className="rounded-full!" disabled={busy || formOpen} onClick={() => openForm()}>
            <Plus className="size-4" />
            Nuevo
          </Button>
        </CardHeader>
        <CardContent>
          {activationError ? <FeedbackBanner role="alert" tone="danger" className="mb-4">{activationError}</FeedbackBanner> : null}
          {schoolYears.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No hay años escolares registrados.
            </p>
          ) : (
            <div className="divide-y divide-border rounded-2xl border border-border">
              {schoolYears.map((year) => (
                <div
                  key={year.id}
                  className={cn(
                    'flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between',
                    year.status === 'inactive' && 'opacity-55',
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-sm font-medium text-foreground">
                        {year.name}
                      </span>
                      {year.isCurrent ? (
                        <StatusBadge tone="success">Actual</StatusBadge>
                      ) : null}
                      {year.status === 'inactive' ? (
                        <StatusBadge tone="neutral">Inactivo</StatusBadge>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {year.startDate.slice(0, 10)} — {year.endDate.slice(0, 10)}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full!"
                      aria-label={`Editar ${year.name}`}
                      disabled={busy || formOpen}
                      onClick={() => openForm(year)}
                    >
                      <Pencil className="size-4" />
                      Editar
                    </Button>
                    {!year.isCurrent && year.status === 'active' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full!"
                        disabled={busy || formOpen}
                        loading={activating === year.id}
                        onClick={() => handleActivate(year.id)}
                      >
                        <Check className="size-4" />
                        Activar
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {formOpen ? (
        <Modal
          title={editingId ? 'Editar año escolar' : 'Nuevo año escolar'}
          description={editingId ? 'Actualiza el nombre y las fechas del período lectivo.' : 'Registra un nuevo período lectivo.'}
          icon={CalendarDays}
          closeDisabled={saving}
          onClose={closeForm}
        >
          <form onSubmit={handleSave} className="space-y-4 p-5">
            {error ? (
              <FeedbackBanner id={`${formId}-error`} role="alert" tone="danger">
                {error}
              </FeedbackBanner>
            ) : null}

            <div className="space-y-2">
              <label htmlFor={`${formId}-name`} className="text-sm font-medium text-foreground">
                Nombre <span className="text-destructive">*</span>
              </label>
              <Input
                id={`${formId}-name`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={saving}
                autoFocus
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor={`${formId}-start`} className="text-sm font-medium text-foreground">
                  Fecha inicio <span className="text-destructive">*</span>
                </label>
                <Input
                  id={`${formId}-start`}
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  disabled={saving}
                  aria-describedby={error ? `${formId}-error` : undefined}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor={`${formId}-end`} className="text-sm font-medium text-foreground">
                  Fecha fin <span className="text-destructive">*</span>
                </label>
                <Input
                  id={`${formId}-end`}
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  disabled={saving}
                  aria-describedby={error ? `${formId}-error` : undefined}
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <Button data-ui-action="cancel" variant="outline" type="button" disabled={saving} onClick={closeForm}>
                Cancelar
              </Button>
              <Button type="submit" loading={saving}>
                {editingId ? 'Guardar cambios' : 'Crear año escolar'}
              </Button>
            </div>
          </form>
        </Modal>
      ) : null}
    </>
  )
}

/** Obtiene las fechas por defecto del calendario académico según el año */
function getDefaultAcademicCalendar(year: number) {
  if (year === 2025) {
    return {
      startDate: '2025-08-25',
      endDate: '2026-06-20',
    }
  }

  return {
    startDate: `${year}-08-25`,
    endDate: `${year + 1}-06-20`,
  }
}
