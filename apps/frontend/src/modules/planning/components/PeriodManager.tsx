/**
 * @file Componente PeriodManager
 *
 * Modal para gestionar los períodos académicos: crear,
 * listar y eliminar períodos.
 */

import { CalendarDays, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { FeedbackBanner, StatusBadge } from '@/components/ui/SemanticUI'
import {
  createAcademicPeriod,
  deleteAcademicPeriod,
} from '@/modules/planning/services/planningService'
import type { AcademicPeriodSummary } from '@/modules/planning/types'

/** Propiedades del componente PeriodManager */
type PeriodManagerProps = {
  schoolYearId: string
  periods: AcademicPeriodSummary[]
  onRefresh: () => void
  onClose: () => void
}

/** Modal para gestionar períodos académicos */
export function PeriodManager({
  schoolYearId,
  periods,
  onRefresh,
  onClose,
}: PeriodManagerProps) {
  const [name, setName] = useState('')
  const [sequence, setSequence] = useState(periods.length + 1)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AcademicPeriodSummary | null>(null)

  async function handleCreate() {
    setError(null)
    if (!name.trim()) { setError('El nombre del período es requerido.'); return }
    if (!startDate || !endDate) { setError('Las fechas de inicio y fin son requeridas.'); return }
    if (startDate > endDate) { setError('La fecha de inicio debe ser anterior a la fecha de fin.'); return }
    setSubmitting(true)
    try {
      await createAcademicPeriod({ schoolYearId, name: name.trim(), sequence, startDate, endDate })
      setName('')
      setSequence(periods.length + 2)
      setStartDate('')
      setEndDate('')
      onRefresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo crear el período.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteAcademicPeriod(deleteTarget.id)
      setDeleteTarget(null)
      onRefresh()
    } catch (caught) {
      console.error('Error al eliminar período académico:', caught)
      setDeleteTarget(null)
    }
  }

  return (
    <Modal
      title="Períodos académicos"
      description="Organiza los trimestres o períodos del año escolar activo."
      icon={CalendarDays}
      tone="warning"
      eyebrow="Planificación"
      onClose={onClose}
    >
      <div className="space-y-5 p-5">
        {error ? <FeedbackBanner tone="danger">{error}</FeedbackBanner> : null}

        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-extrabold text-foreground">Períodos existentes</h4>
              <p className="mt-0.5 text-xs text-muted-foreground">{periods.length} período{periods.length === 1 ? '' : 's'} configurado{periods.length === 1 ? '' : 's'}.</p>
            </div>
            <StatusBadge tone={periods.length ? 'success' : 'warning'}>{periods.length ? 'Configurados' : 'Pendiente'}</StatusBadge>
          </div>

          {periods.length > 0 ? (
            <div className="space-y-2">
              {periods.map((period) => (
                <div
                  key={period.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-muted/45 px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-warning/22 text-xs font-black text-foreground">
                        {period.sequence}
                      </span>
                      <p className="truncate text-sm font-extrabold text-foreground">{period.name}</p>
                    </div>
                    <p className="mt-1 pl-10 text-xs text-muted-foreground">{period.startDate} → {period.endDate}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-destructive hover:text-destructive"
                    aria-label={`Eliminar ${period.name}`}
                    onClick={() => setDeleteTarget(period)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-warning/14 p-4 text-sm text-muted-foreground">
              Todavía no hay períodos. Crea el primero para poder organizar planificaciones y evaluaciones por fecha.
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-warning/12 p-4 sm:p-5">
          <div className="mb-4">
            <h4 className="text-sm font-extrabold text-foreground">Nuevo período</h4>
            <p className="mt-0.5 text-xs text-muted-foreground">Define el nombre, orden y rango de fechas.</p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-foreground">
              Nombre
              <Input
                type="text"
                placeholder="Ej.: Primer trimestre"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-1.5"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1fr)]">
              <label className="block text-sm font-semibold text-foreground">
                Secuencia
                <Input
                  type="number"
                  min={1}
                  value={sequence}
                  onChange={(event) => setSequence(Number(event.target.value))}
                  className="mt-1.5"
                />
              </label>
              <label className="block text-sm font-semibold text-foreground">
                Fecha inicio
                <Input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="mt-1.5" />
              </label>
              <label className="block text-sm font-semibold text-foreground">
                Fecha fin
                <Input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="mt-1.5" />
              </label>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleCreate} loading={submitting} disabled={submitting}>
                <Plus className="size-4" /> Agregar período
              </Button>
            </div>
          </div>
        </section>
      </div>

      {deleteTarget ? (
        <ConfirmDialog
          title="Eliminar período"
          description={`¿Eliminar “${deleteTarget.name}”? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          destructive
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      ) : null}
    </Modal>
  )
}
