import { AlertCircle, CalendarDays, FileText, Filter, Plus, Search, Settings2 } from 'lucide-react'
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
import type { CreatePlanningEntryInput, PlanningEntryWithDetails } from '@/modules/planning/types'

type ConfirmAction = 'delete' | 'archive'

function sameDate(entryDate: string | null | undefined, filterDate: string) {
  if (!filterDate) return true
  if (!entryDate) return false
  return entryDate.slice(0, 10) === filterDate
}

function normalize(value?: string | null) {
  return (value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function PlanningPage() {
  const {
    schoolYearId,
    schoolName,
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

  const activePeriod = periods.find((period) => period.id === activePeriodId)
  const archivedEntries = entries.filter(
    (entry) => String(entry.status).toLowerCase() === 'archived',
  ).length

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

  if (formOpen) {
    return (
      <section className="w-full min-w-0 pb-8">
        <PlanningEntryForm
          sectionSubjects={sectionSubjects}
          periods={periods}
          schoolName={editingEntry?.schoolNameSnapshot || editingEntry?.schoolName || schoolName}
          initial={
            editingEntry
              ? {
                  entry: {
                    id: editingEntry.id,
                    sectionSubjectId: editingEntry.sectionSubjectId,
                    academicPeriodId: editingEntry.academicPeriodId,
                    fundamentalCompetenceId: editingEntry.fundamentalCompetenceId,
                    fundamentalCompetencies: editingEntry.fundamentalCompetencies,
                    title: editingEntry.title,
                    schoolNameSnapshot: editingEntry.schoolNameSnapshot ?? editingEntry.schoolName,
                    teacherNameSnapshot:
                      editingEntry.teacherNameSnapshot ?? editingEntry.teacherName,
                    curricularArea: editingEntry.curricularArea,
                    educationLevel: editingEntry.educationLevel,
                    topic: editingEntry.topic,
                    transversalAxis: editingEntry.transversalAxis,
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
                    linkedActivityIds: editingEntry.linkedActivityIds,
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
            } catch (caught) {
              setFormError(caught instanceof Error ? caught.message : 'No se pudo generar.')
            } finally {
              setIsSubmitting(false)
            }
          }}
          onClose={closeForm}
        />
      </section>
    )
  }

  return (
    <section className="mx-auto w-full min-w-0 max-w-[1440px] space-y-5">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-[28px]">
              Planificaciones
            </h1>
            {activePeriod ? (
              <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-accent/12 px-3 text-xs font-semibold text-accent">
                <span className="size-1.5 rounded-full bg-accent" />
                {activePeriod.name} · activo
              </span>
            ) : null}
          </div>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Organiza, consulta y exporta tu planificación curricular por competencias.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setPeriodManagerOpen(true)}>
            <Settings2 className="size-4" />
            Períodos
          </Button>
          <Button variant="primary" onClick={openCreateForm} disabled={!periods.length}>
            <Plus className="size-4" />
            Nueva planificación
          </Button>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <PlanningMetric
          icon={<FileText className="size-5" />}
          label="Planificaciones"
          value={entries.length}
        />
        <PlanningMetric
          icon={<Filter className="size-5" />}
          label="Resultados visibles"
          value={filteredEntries.length}
        />
        <PlanningMetric
          icon={<CalendarDays className="size-5" />}
          label="Archivadas"
          value={archivedEntries}
        />
      </div>

      <div className="rounded-3xl bg-card shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Filter className="size-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-foreground">Filtrar planificaciones</h2>
              <p className="text-xs text-muted-foreground">
                Afina la lista por curso, asignatura, período o fecha.
              </p>
            </div>
          </div>
          <span className="hidden text-xs font-semibold text-muted-foreground sm:block">
            {filteredEntries.length} {filteredEntries.length === 1 ? 'resultado' : 'resultados'}
          </span>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-[minmax(0,1.35fr)_repeat(3,minmax(0,1fr))_170px]">
          <label className="grid min-w-0 gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Buscar
            </span>
            <span className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="w-full pl-9"
                placeholder="Título, tema o competencia"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </span>
          </label>

          <label className="grid min-w-0 gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Curso
            </span>
            <Select value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)}>
              <option value="">Todos los cursos</option>
              {sectionSubjects.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.gradeName} {item.sectionName} — {item.subjectName}
                </option>
              ))}
            </Select>
          </label>

          <label className="grid min-w-0 gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Asignatura
            </span>
            <Select
              value={subjectFilter}
              onChange={(event) => setSubjectFilter(event.target.value)}
            >
              <option value="">Todas las asignaturas</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </Select>
          </label>

          <label className="grid min-w-0 gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Período
            </span>
            <Select value={periodFilter} onChange={(event) => setPeriodFilter(event.target.value)}>
              <option value="">Todos los períodos</option>
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.name}
                </option>
              ))}
            </Select>
          </label>

          <label className="grid min-w-0 gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Fecha
            </span>
            <Input
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
            />
          </label>
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
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
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
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-6 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FileText className="size-6" />
          </span>
          <p className="mt-4 text-sm font-semibold text-foreground">
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

function PlanningMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-card px-5 py-4 shadow-sm">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </span>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-2xl font-black tabular-nums text-primary">{value}</p>
      </div>
    </div>
  )
}
