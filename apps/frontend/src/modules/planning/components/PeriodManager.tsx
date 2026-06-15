/**
 * @file Componente PeriodManager
 *
 * Modal para gestionar los trimestres académicos: crear,
 * listar y eliminar períodos.
 */

import { AlertCircle, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
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

/** Modal para gestionar trimestres académicos */
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
    if (!name.trim()) { setError('El nombre del trimestre es requerido.'); return }
    if (!startDate || !endDate) { setError('Las fechas de inicio y fin son requeridas.'); return }
    if (startDate > endDate) { setError('La fecha de inicio debe ser anterior a la fecha de fin.'); return }
    setSubmitting(true)
    try {
      await createAcademicPeriod({ schoolYearId, name: name.trim(), sequence, startDate, endDate })
      setName(''); setSequence(periods.length + 2); setStartDate(''); setEndDate('')
      onRefresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No se pudo crear el trimestre.')
    } finally { setSubmitting(false) }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteAcademicPeriod(deleteTarget.id)
      setDeleteTarget(null); onRefresh()
    } catch (error) {
      console.error('Error al eliminar trimestre académico:', error)
      setDeleteTarget(null)
    }
  }

  return (
    <Modal title="Trimestres académicos" onClose={onClose}>
      <div className="space-y-5 p-5">
        {error ? (
          <div className="flex gap-3 rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" /><p>{error}</p>
          </div>
        ) : null}

        {periods.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase text-muted-foreground">Trimestres existentes</p>
            {periods.map((period) => (
              <div key={period.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{period.sequence}. {period.name}</p>
                  <p className="text-xs text-muted-foreground">{period.startDate} → {period.endDate}</p>
                </div>
                <button type="button"
                  className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-background hover:text-destructive"
                  aria-label={`Eliminar ${period.name}`}
                  onClick={() => setDeleteTarget(period)}>
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-border pt-4">
          <p className="mb-4 text-xs font-medium uppercase text-muted-foreground">Nuevo trimestre</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Nombre</label>
              <Input type="text" placeholder="Ej: 1er Trimestre" value={name}
                onChange={(e) => setName(e.target.value)} className="mt-1.5" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Secuencia</label>
                <Input type="number" min={1} value={sequence}
                  onChange={(e) => setSequence(Number(e.target.value))} className="mt-1.5" />
              </div>
              <div />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Fecha inicio</label>
                <Input type="date" value={startDate}
                  onChange={(e) => setStartDate(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Fecha fin</label>
                <Input type="date" value={endDate}
                  onChange={(e) => setEndDate(e.target.value)} className="mt-1.5" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleCreate} disabled={submitting} loading={submitting}>
                <Plus className="size-4" /> Agregar trimestre
              </Button>
            </div>
          </div>
        </div>
      </div>

      {deleteTarget ? (
        <ConfirmDialog
          title="Eliminar trimestre"
          description={`¿Eliminar "${deleteTarget.name}"? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar" destructive
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)} />
      ) : null}
    </Modal>
  )
}
