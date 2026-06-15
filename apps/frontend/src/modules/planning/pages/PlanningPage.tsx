/**
 * @file Página de Planificaciones
 *
 * Vista principal de planificación curricular con selector
 * de trimestres, lista de planificaciones y formularios
 * de creación/edición.
 */

import { AlertCircle, Plus, Settings2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { PeriodManager } from '@/modules/planning/components/PeriodManager'
import { PlanningEntryCard } from '@/modules/planning/components/PlanningEntryCard'
import { PlanningEntryForm } from '@/modules/planning/components/PlanningEntryForm'
import { usePlanning } from '@/modules/planning/hooks/usePlanning'
import type {
  CreatePlanningEntryInput,
  PlanningEntryWithDetails,
} from '@/modules/planning/types'

/** Página principal de planificaciones curriculares */
export function PlanningPage() {
  const {
    schoolYearId,
    periods,
    activePeriodId,
    setActivePeriodId,
    entries,
    sectionSubjects,
    competencies,
    loading,
    error,
    addEntry,
    editEntry,
    removeEntry,
    refreshPeriods,
  } = usePlanning()

  const [periodManagerOpen, setPeriodManagerOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<PlanningEntryWithDetails | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<PlanningEntryWithDetails | null>(null)

  function openCreateForm() {
    setEditingEntry(null)
    setFormError(null)
    setFormOpen(true)
  }

  function openEditForm(entry: PlanningEntryWithDetails) {
    setEditingEntry(entry)
    setFormError(null)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditingEntry(null)
    setFormError(null)
  }

  async function handleSubmit(input: CreatePlanningEntryInput) {
    setIsSubmitting(true)
    setFormError(null)

    try {
      if (editingEntry) {
        await editEntry(editingEntry.id, input)
      } else {
        await addEntry(input)
      }

      closeForm()
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function confirmDelete(entry: PlanningEntryWithDetails) {
    setDeleteTarget(entry)
  }

  async function handleDelete() {
    if (!deleteTarget || !activePeriodId) return

    try {
      await removeEntry(deleteTarget.id, activePeriodId)
    } catch (error) {
      console.error('Error al eliminar planificación:', error)
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <section className="mx-auto w-full max-w-7xl">
      <div className="mb-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">
              Currículo por competencias
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-none text-primary sm:text-5xl">
              Planificaciones
            </h1>
            <p className="mt-3 text-base leading-6 text-muted-foreground">
              Planificación curricular, unidades didácticas y planes de clase.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:pb-1">
            <Button
              variant="outline"
              className="h-12 px-5"
              onClick={() => setPeriodManagerOpen(true)}
            >
              <Settings2 className="size-4" />
              Trimestres
            </Button>
            <Button
              variant="primary"
              className="h-12 px-5"
              onClick={openCreateForm}
              disabled={!activePeriodId}
            >
              <Plus className="size-4" />
              Nueva planificación
            </Button>
          </div>
        </div>
      </div>

      {periods.length > 0 ? (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {periods.map((period) => (
            <button
              key={period.id}
              type="button"
              onClick={() => setActivePeriodId(period.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activePeriodId === period.id
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'border border-border bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              {period.name}
            </button>
          ))}
        </div>
      ) : null}

      {error ? (
        <div className="mb-4 flex gap-3 rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>{error}</p>
        </div>
      ) : null}

      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center text-sm font-medium text-muted-foreground">
          Cargando planificaciones...
        </div>
      ) : entries.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {entries.map((entry) => (
            <PlanningEntryCard
              key={entry.id}
              entry={entry}
              onEdit={openEditForm}
              onDelete={confirmDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
          <p className="text-sm font-medium text-muted-foreground">
            {activePeriodId
              ? 'No hay planificaciones para este trimestre.'
              : 'Selecciona un trimestre académico para ver sus planificaciones.'}
          </p>
          {activePeriodId ? (
            <Button variant="outline" className="mt-4" onClick={openCreateForm}>
              <Plus className="size-4" />
              Crear primera planificación
            </Button>
          ) : null}
        </div>
      )}

      {periodManagerOpen && schoolYearId ? (
        <PeriodManager
          schoolYearId={schoolYearId}
          periods={periods}
          onRefresh={refreshPeriods}
          onClose={() => setPeriodManagerOpen(false)}
        />
      ) : null}

      {formOpen ? (
        <PlanningEntryForm
          sectionSubjects={sectionSubjects}
          periods={periods}
          initial={
            editingEntry
              ? {
                  entry: {
                    id: editingEntry.id,
                    sectionSubjectId: editingEntry.sectionSubjectId,
                    academicPeriodId: editingEntry.academicPeriodId,
                    fundamentalCompetenceId: editingEntry.fundamentalCompetenceId,
                    title: editingEntry.title,
                    specificCompetence: editingEntry.specificCompetence,
                    achievementIndicator: editingEntry.achievementIndicator,
                    contentConceptual: editingEntry.contentConceptual,
                    contentProcedural: editingEntry.contentProcedural,
                    contentAttitudinal: editingEntry.contentAttitudinal,
                    strategies: editingEntry.strategies,
                    activities: editingEntry.activities,
                    resources: editingEntry.resources,
                    evaluationMethod: editingEntry.evaluationMethod,
                    evidence: editingEntry.evidence,
                    evaluationInstruments: editingEntry.evaluationInstruments,
                    durationMinutes: editingEntry.durationMinutes,
                    plannedDate: editingEntry.plannedDate,
                  },
                }
              : {
                  entry: {
                    sectionSubjectId: '',
                    academicPeriodId: activePeriodId ?? '',
                    title: '',
                  },
                  academicPeriodId: activePeriodId ?? undefined,
                }
	          }
	          competencies={competencies}
	          submitting={isSubmitting}
          error={formError}
          onSubmit={handleSubmit}
          onClose={closeForm}
        />
      ) : null}

      {deleteTarget ? (
        <ConfirmDialog
          title="Eliminar planificación"
          description={`¿Eliminar "${deleteTarget.title}"? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          destructive
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      ) : null}
    </section>
  )
}
