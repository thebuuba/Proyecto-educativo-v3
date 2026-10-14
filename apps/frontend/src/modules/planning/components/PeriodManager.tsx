/**
 * @file Componente PeriodManager
 *
 * Modal para gestionar los períodos académicos: crear,
 * listar, editar y eliminar períodos.
 */

import { CalendarDays, Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { FeedbackBanner, StatusBadge } from '@/components/ui/SemanticUI'
import {
  createAcademicPeriod,
  deleteAcademicPeriod,
  updateAcademicPeriod,
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
  const [sequence, setSequence] = useState(() => getNextSequence(periods))
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AcademicPeriodSummary | null>(null)
  const pending = useRef(false)
  const knownSequences = useRef<Array<{ id?: string; sequence: number }>>(periods)
  const busy = submitting || deleting

  useEffect(() => { knownSequences.current = periods }, [periods])

  function resetForm() {
    setEditingId(null)
    setName('')
    setSequence(getNextSequence(knownSequences.current))
    setStartDate('')
    setEndDate('')
    setError(null)
  }

  function handleEdit(period: AcademicPeriodSummary) {
    if (pending.current) return
    setEditingId(period.id)
    setName(period.name)
    setSequence(period.sequence)
    setStartDate(period.startDate.slice(0, 10))
    setEndDate(period.endDate.slice(0, 10))
    setError(null)
  }

  function closeManager() {
    if (!pending.current) onClose()
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault()
    if (pending.current || deleteTarget) return
    setError(null)
    if (!name.trim()) { setError('El nombre del período es requerido.'); return }
    if (!Number.isInteger(sequence) || sequence < 1) { setError('La secuencia debe ser un número entero mayor que cero.'); return }
    if (!startDate || !endDate) { setError('Las fechas de inicio y fin son requeridas.'); return }
    if (startDate >= endDate) { setError('La fecha de inicio debe ser anterior a la fecha de fin.'); return }
    pending.current = true
    setSubmitting(true)
    try {
      const input = { name: name.trim(), sequence, startDate, endDate }
      if (editingId) await updateAcademicPeriod(editingId, input)
      else await createAcademicPeriod({ schoolYearId, ...input })
      // Mantiene el orden guardado mientras onRefresh recibe la lista actualizada.
      knownSequences.current = editingId
        ? knownSequences.current.map((period) => period.id === editingId ? { ...period, sequence } : period)
        : [...knownSequences.current, { sequence }]
      resetForm()
      onRefresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo guardar el período.')
    } finally {
      setSubmitting(false)
      pending.current = false
    }
  }

  async function handleDelete() {
    if (!deleteTarget || pending.current) return
    pending.current = true
    setDeleting(true)
    setError(null)
    try {
      await deleteAcademicPeriod(deleteTarget.id)
      const previousNext = getNextSequence(knownSequences.current)
      knownSequences.current = knownSequences.current.filter((period) => period.id !== deleteTarget.id)
      if (editingId === deleteTarget.id) resetForm()
      else if (!editingId && sequence === previousNext) setSequence(getNextSequence(knownSequences.current))
      setDeleteTarget(null)
      onRefresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo eliminar el período.')
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
      pending.current = false
    }
  }

  return (
    <Modal
      title="Períodos académicos"
      description="Organiza los trimestres o períodos del año escolar activo."
      icon={CalendarDays}
      tone="warning"
      eyebrow="Planificación"
      onClose={closeManager}
      closeDisabled={busy}
    >
      <div className="space-y-5 p-5">
        {error ? <FeedbackBanner role="alert" tone="danger">{error}</FeedbackBanner> : null}

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
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-warning/22 text-xs font-black text-foreground">
                        {period.sequence}
                      </span>
                      <p className="truncate text-sm font-extrabold text-foreground">{period.name}</p>
                    </div>
                    <p className="mt-1 pl-10 text-xs text-muted-foreground">{period.startDate.slice(0, 10)} → {period.endDate.slice(0, 10)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      aria-label={`Editar ${period.name}`}
                      disabled={busy || deleteTarget !== null}
                      onClick={() => handleEdit(period)}
                    >
                      <Pencil className="size-4" /> Editar
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-destructive hover:text-destructive"
                      aria-label={`Eliminar ${period.name}`}
                      disabled={busy || deleteTarget !== null}
                      onClick={() => { if (!pending.current) setDeleteTarget(period) }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-warning/14 p-4 text-sm text-muted-foreground">
              Todavía no hay períodos. Crea el primero para poder organizar planificaciones y evaluaciones por fecha.
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
          <div className="mb-4">
            <h4 className="text-sm font-extrabold text-foreground">{editingId ? 'Editar período' : 'Nuevo período'}</h4>
            <p className="mt-0.5 text-xs text-muted-foreground">Define el nombre, orden y rango de fechas.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <label className="block text-sm font-semibold text-foreground">
              Nombre
              <Input
                type="text"
                placeholder="Ej.: Primer trimestre"
                value={name}
                required
                disabled={busy || deleteTarget !== null}
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
                  step={1}
                  required
                  disabled={busy || deleteTarget !== null}
                  value={sequence}
                  onChange={(event) => setSequence(Number(event.target.value))}
                  className="mt-1.5"
                />
              </label>
              <label className="block text-sm font-semibold text-foreground">
                Fecha inicio
                <Input type="date" value={startDate} required disabled={busy || deleteTarget !== null} onChange={(event) => setStartDate(event.target.value)} className="mt-1.5" />
              </label>
              <label className="block text-sm font-semibold text-foreground">
                Fecha fin
                <Input type="date" value={endDate} required disabled={busy || deleteTarget !== null} onChange={(event) => setEndDate(event.target.value)} className="mt-1.5" />
              </label>
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              {editingId ? <Button data-ui-action="cancel" variant="outline" disabled={busy || deleteTarget !== null} onClick={() => { if (!pending.current) resetForm() }}>Cancelar edición</Button> : null}
              <Button type="submit" loading={submitting} disabled={busy || deleteTarget !== null}>
                {editingId ? <Pencil className="size-4" /> : <Plus className="size-4" />}
                {editingId ? 'Guardar cambios' : 'Agregar período'}
              </Button>
            </div>
          </form>
        </section>
      </div>

      {deleteTarget ? (
        <ConfirmDialog
          title="Eliminar período"
          description={`¿Eliminar “${deleteTarget.name}”? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          destructive
          onConfirm={handleDelete}
          onClose={() => { if (!pending.current) setDeleteTarget(null) }}
        />
      ) : null}
    </Modal>
  )
}

function getNextSequence(periods: readonly { sequence: number }[]) {
  return periods.reduce((maximum, period) => Math.max(maximum, period.sequence), 0) + 1
}
