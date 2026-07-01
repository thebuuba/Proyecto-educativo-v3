import { AlertCircle, Plus, Search, Settings2 } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { PeriodManager } from '@/modules/planning/components/PeriodManager'
import { PlanningDocumentView } from '@/modules/planning/components/PlanningDocumentView'
import { PlanningEntryCard } from '@/modules/planning/components/PlanningEntryCard'
import { PlanningEntryForm } from '@/modules/planning/components/PlanningEntryForm'
import { usePlanning } from '@/modules/planning/hooks/usePlanning'
import type {
  CreatePlanningEntryInput,
  PlanningEntryWithDetails,
} from '@/modules/planning/types'

type ConfirmAction = 'delete' | 'archive'

function sameDate(entryDate: string | null | undefined, filterDate: string) {
  if (!filterDate) return true
  if (!entryDate) return false
  return entryDate.slice(0, 10) === filterDate
}

function normalize(value?: string | null) {
  return (value ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function PlanningPage() {
  const {
    schoolYearId,
    periods,
    activePeriodId,
    entries,
    sectionSubjects,
    competencies,
    loading,
    error,
    addEntry,
    generateEntry,
    editEntry,
    removeEntry,
    duplicateEntry,
    archiveEntry,
    refreshPeriods,
  } = usePlanning()

  const [periodManagerOpen, setPeriodManagerOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<PlanningEntryWithDetails | null>(null)
  const [previewEntry, setPreviewEntry] = useState<PlanningEntryWithDetails | null>(null)
  const [confirmTarget, setConfirmTarget] = useState<PlanningEntryWithDetails | null>(null)
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>('delete')
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [query, setQuery] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [periodFilter, setPeriodFilter] = useState(activePeriodId ?? '')
  const [dateFilter, setDateFilter] = useState('')

  const subjects = useMemo(
    () => Array.from(new Set(sectionSubjects.map((item) => item.subjectName))).sort(),
    [sectionSubjects],
  )

  const filteredEntries = useMemo(() => {
    const search = normalize(query)

    return entries.filter((entry) => {
      const matchesCourse = !courseFilter || entry.sectionSubjectId === courseFilter
      const matchesSubject = !subjectFilter || entry.subjectName === subjectFilter
      const matchesPeriod = !periodFilter || entry.academicPeriodId === periodFilter
      const matchesDate = sameDate(entry.plannedDate, dateFilter)
      const matchesSearch =
        !search ||
        normalize(entry.title).includes(search) ||
        normalize(entry.subjectName).includes(search) ||
        normalize(entry.achievementIndicator).includes(search) ||
        normalize(entry.specificCompetence).includes(search)

      return matchesCourse && matchesSubject && matchesPeriod && matchesDate && matchesSearch
    })
  }, [courseFilter, dateFilter, entries, periodFilter, query, subjectFilter])

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
      setPeriodFilter(input.academicPeriodId)
      closeForm()
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'No se pudo guardar.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDuplicate(entry: PlanningEntryWithDetails) {
    try {
      await duplicateEntry(entry.id)
    } catch (error) {
      console.error('Error al duplicar planificacion:', error)
    }
  }

  function requestArchive(entry: PlanningEntryWithDetails) {
    setConfirmAction('archive')
    setConfirmTarget(entry)
  }

  function requestDelete(entry: PlanningEntryWithDetails) {
    setConfirmAction('delete')
    setConfirmTarget(entry)
  }

  async function handleConfirm() {
    if (!confirmTarget) return

    try {
      if (confirmAction === 'archive') {
        await archiveEntry(confirmTarget.id)
      } else {
        await removeEntry(confirmTarget.id)
      }
    } catch (error) {
      console.error('Error al procesar planificacion:', error)
    } finally {
      setConfirmTarget(null)
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
              Crea, consulta, edita, duplica y exporta tus planificaciones docentes.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:pb-1">
            <Button
              variant="outline"
              className="h-12 px-5"
              onClick={() => setPeriodManagerOpen(true)}
            >
              <Settings2 className="size-4" />
              Períodos
            </Button>
            <Button
              variant="primary"
              className="h-12 px-5"
              onClick={openCreateForm}
              disabled={!periods.length}
            >
              <Plus className="size-4" />
              Nueva planificación
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr_1fr_1fr_170px]">
          <label className="relative block">
            <span className="sr-only">Buscar por título o tema</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar por título, tema o competencia"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <Select value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)}>
            <option value="">Todos los cursos</option>
            {sectionSubjects.map((item) => (
              <option key={item.id} value={item.id}>
                {item.gradeName} {item.sectionName} — {item.subjectName}
              </option>
            ))}
          </Select>

          <Select value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)}>
            <option value="">Todas las asignaturas</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </Select>

          <Select value={periodFilter} onChange={(event) => setPeriodFilter(event.target.value)}>
            <option value="">Todos los períodos</option>
            {periods.map((period) => (
              <option key={period.id} value={period.id}>
                {period.name}
              </option>
            ))}
          </Select>

          <Input
            type="date"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
          />
        </div>
      </div>

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
      ) : filteredEntries.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filteredEntries.map((entry) => (
            <PlanningEntryCard
              key={entry.id}
              entry={entry}
              onPreview={setPreviewEntry}
              onEdit={openEditForm}
              onDuplicate={handleDuplicate}
              onArchive={requestArchive}
              onDelete={requestDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card text-center">
          <p className="text-sm font-medium text-muted-foreground">
            No hay planificaciones que coincidan con los filtros actuales.
          </p>
          <Button variant="outline" className="mt-4" onClick={openCreateForm}>
            <Plus className="size-4" />
            Crear planificación
          </Button>
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
                    plannedDate: editingEntry.plannedDate?.slice(0, 10) ?? null,
                  },
                }
              : {
                  entry: {
                    sectionSubjectId: courseFilter,
                    academicPeriodId: periodFilter || activePeriodId || periods[0]?.id || '',
                    title: '',
                  },
                  academicPeriodId: periodFilter || activePeriodId || periods[0]?.id,
                }
          }
          competencies={competencies}
          submitting={isSubmitting}
          error={formError}
          onSubmit={handleSubmit}
          onGenerateAndCreate={async (input) => {
            setIsSubmitting(true)
            setFormError(null)
            try {
              await generateEntry(input)
              setPeriodFilter(input.academicPeriodId ?? periodFilter)
              closeForm()
            } catch (error) {
              setFormError(error instanceof Error ? error.message : 'No se pudo generar.')
            } finally {
              setIsSubmitting(false)
            }
          }}
          onClose={closeForm}
        />
      ) : null}

      {previewEntry ? (
        <PlanningDocumentView entry={previewEntry} onClose={() => setPreviewEntry(null)} />
      ) : null}

      {confirmTarget ? (
        <ConfirmDialog
          title={confirmAction === 'archive' ? 'Archivar planificación' : 'Eliminar planificación'}
          description={
            confirmAction === 'archive'
              ? `¿Archivar "${confirmTarget.title}"? Podrás conservarla como registro histórico.`
              : `¿Eliminar "${confirmTarget.title}"? Esta acción no se puede deshacer.`
          }
          confirmLabel={confirmAction === 'archive' ? 'Archivar' : 'Eliminar'}
          destructive={confirmAction === 'delete'}
          onConfirm={handleConfirm}
          onClose={() => setConfirmTarget(null)}
        />
      ) : null}
    </section>
  )
}
