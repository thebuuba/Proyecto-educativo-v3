import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import {
  AlertTriangle,
  Archive,
  BookMarked,
  CalendarDays,
  Check,
  ClipboardList,
  Filter,
  Lightbulb,
  MoreVertical,
  NotebookPen,
  Plus,
  RotateCcw,
  Search,
  Tag,
  UserRound,
  UsersRound,
} from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import {
  FeedbackBanner,
  FilterBar,
  PageHero,
  SemanticIcon,
  StatusBadge,
  type SemanticTone,
} from '@/components/ui/SemanticUI'
import { getAttendanceCourses, getStudentsBySection } from '@/modules/attendance/services/attendanceService'
import type { StudentAttendanceRow } from '@/modules/attendance/types'
import {
  archiveJournalEntry,
  completeJournalFollowUp,
  createJournalEntry,
  deleteJournalEntry,
  getJournalEntries,
  restoreJournalEntry,
  updateJournalEntry,
} from '@/modules/journal/services/journalService'
import type { JournalEntry, JournalEntryType, SaveJournalEntry } from '@/modules/journal/types'
import type { EnrollmentCourse } from '@/modules/students/types'
import { cn } from '@/utils/cn'

type JournalTypeInfo = {
  label: string
  tone: SemanticTone
  icon: typeof NotebookPen
}

const typeInfo: Record<JournalEntryType, JournalTypeInfo> = {
  quick_note: { label: 'Nota rápida', tone: 'info', icon: NotebookPen },
  student_observation: { label: 'Observación de estudiante', tone: 'success', icon: UserRound },
  incident: { label: 'Incidente', tone: 'danger', icon: AlertTriangle },
  class_observation: { label: 'Observación de clase', tone: 'info', icon: UsersRound },
  pedagogical_idea: { label: 'Idea pedagógica', tone: 'warning', icon: Lightbulb },
  course_observation: { label: 'Observación de curso', tone: 'success', icon: ClipboardList },
}

export function JournalPage() {
  const [params, setParams] = useSearchParams()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [courses, setCourses] = useState<EnrollmentCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [type, setType] = useState<'all' | JournalEntryType>('all')
  const [sectionId, setSectionId] = useState(params.get('sectionId') ?? '')
  const [subjectId, setSubjectId] = useState(params.get('sectionSubjectId') ?? '')
  const [followUp, setFollowUp] = useState<'all' | 'pending' | 'completed'>('all')
  const [showArchived, setShowArchived] = useState(false)
  const [editing, setEditing] = useState<JournalEntry | 'new' | null>(
    params.get('action') === 'create' ? 'new' : null,
  )

  const refresh = async () => {
    try {
      setEntries(await getJournalEntries())
      setError('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo cargar la bitácora')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void Promise.all([refresh(), getAttendanceCourses().then(setCourses)])
  }, [])

  useEffect(() => {
    const id = window.setTimeout(
      () => setDebounced(search.trim().toLocaleLowerCase('es')),
      250,
    )
    return () => window.clearTimeout(id)
  }, [search])

  const visible = useMemo(
    () =>
      entries.filter((entry) => {
        if ((entry.status === 'ARCHIVED') !== showArchived) return false
        if (type !== 'all' && entry.entryType !== type) return false
        if (sectionId && entry.sectionId !== sectionId) return false
        if (subjectId && entry.sectionSubjectId !== subjectId) return false
        if (followUp !== 'all' && entry.followUpStatus !== followUp) return false

        return (
          !debounced ||
          `${entry.title ?? ''} ${entry.content} ${entry.tags.join(' ')} ${entry.students
            .map(({ student }) => `${student.firstName} ${student.lastName}`)
            .join(' ')}`
            .toLocaleLowerCase('es')
            .includes(debounced)
        )
      }),
    [debounced, entries, followUp, sectionId, showArchived, subjectId, type],
  )

  const grouped = useMemo(
    () =>
      visible.reduce((groups, entry) => {
        const date = entry.occurredAt.slice(0, 10)
        groups.set(date, [...(groups.get(date) ?? []), entry])
        return groups
      }, new Map<string, JournalEntry[]>()),
    [visible],
  )

  const pending = entries.filter(
    (entry) => entry.status === 'ACTIVE' && entry.followUpStatus === 'pending',
  )
  const [weekStart] = useState(() => Date.now() - 7 * 86400000)

  const mutate = async (action: () => Promise<unknown>) => {
    await action()
    await refresh()
  }

  const archive = async (entry: JournalEntry) => {
    await mutate(() =>
      entry.status === 'ARCHIVED'
        ? restoreJournalEntry(entry.id)
        : archiveJournalEntry(entry.id),
    )
  }

  const remove = async (entry: JournalEntry) => {
    if (
      entry.status === 'ARCHIVED' &&
      window.confirm('¿Eliminar definitivamente esta anotación archivada?')
    ) {
      await mutate(() => deleteJournalEntry(entry.id))
    }
  }

  function clearFilters() {
    setSectionId('')
    setSubjectId('')
    setFollowUp('all')
    setType('all')
    setShowArchived(false)
  }

  return (
    <div className="space-y-5 pb-10">
      <PageHero
        title="Bitácora docente"
        description="Notas, observaciones, incidencias, ideas y seguimientos de tu práctica docente."
        icon={BookMarked}
        tone="danger"
        eyebrow="Práctica docente"
        actions={
          <Button onClick={() => setEditing('new')}>
            <Plus className="size-4" /> Nueva anotación
          </Button>
        }
      />

      <FilterBar>
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar en la bitácora..."
              className="pl-11"
            />
          </label>
          <Button variant="outline" onClick={clearFilters}>
            <Filter className="size-4" /> Limpiar filtros
          </Button>
        </div>
      </FilterBar>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <QuickFilter
          active={type === 'all'}
          label="Todos"
          count={entries.filter((entry) => entry.status === 'ACTIVE').length}
          onClick={() => setType('all')}
        />
        {(Object.keys(typeInfo) as JournalEntryType[]).map((id) => (
          <QuickFilter
            key={id}
            active={type === id}
            label={typeInfo[id].label}
            count={entries.filter((entry) => entry.status === 'ACTIVE' && entry.entryType === id).length}
            onClick={() => setType(id)}
          />
        ))}
      </div>

      <FilterBar>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[repeat(3,minmax(0,1fr))_auto] xl:items-end">
          <FilterSelect
            label="Curso"
            value={sectionId}
            onChange={(value) => {
              setSectionId(value)
              setSubjectId('')
            }}
            options={uniqueSections(courses)}
          />
          <FilterSelect
            label="Asignatura"
            value={subjectId}
            onChange={setSubjectId}
            options={courses
              .filter((course) => !sectionId || course.sectionId === sectionId)
              .map((course) => ({ value: course.id, label: course.subjectName }))}
          />
          <FilterSelect
            label="Seguimiento"
            value={followUp}
            onChange={(value) => setFollowUp(value as typeof followUp)}
            options={[
              { value: 'all', label: 'Todos' },
              { value: 'pending', label: 'Pendientes' },
              { value: 'completed', label: 'Completados' },
            ]}
          />
          <label className="flex h-10 items-center gap-2 rounded-xl bg-muted/60 px-3 text-xs font-bold text-foreground">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(event) => setShowArchived(event.target.checked)}
            />
            Ver archivadas
          </label>
        </div>
      </FilterBar>

      {error ? <FeedbackBanner tone="danger">{error}</FeedbackBanner> : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <main className="min-w-0">
          {loading ? (
            <JournalEmpty title="Cargando bitácora..." />
          ) : !visible.length ? (
            <JournalEmpty
              title={entries.length ? 'No hay coincidencias' : 'Tu bitácora está vacía'}
              action={!entries.length ? () => setEditing('new') : undefined}
            />
          ) : (
            <div className="space-y-6">
              {Array.from(grouped.entries()).map(([date, items]) => (
                <section key={date}>
                  <h2 className="mb-3 text-xs font-black uppercase tracking-wider text-muted-foreground">
                    {formatGroupDate(date)}
                  </h2>
                  <div className="space-y-3">
                    {items.map((entry) => (
                      <JournalCard
                        key={entry.id}
                        entry={entry}
                        onEdit={() => setEditing(entry)}
                        onArchive={() => void archive(entry)}
                        onDelete={() => void remove(entry)}
                        onComplete={() =>
                          void mutate(() => completeJournalFollowUp(entry.id))
                        }
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>

        <aside className="space-y-4">
          <Panel title="Resumen">
            <div className="grid grid-cols-2 gap-2">
              <SummaryMetric
                label="Anotaciones"
                value={entries.filter((entry) => entry.status === 'ACTIVE').length}
                tone="info"
              />
              <SummaryMetric label="Pendientes" value={pending.length} tone="warning" />
              <SummaryMetric
                label="Esta semana"
                value={entries.filter((entry) => new Date(entry.occurredAt).getTime() >= weekStart).length}
                tone="success"
              />
              <SummaryMetric
                label="Incidentes"
                value={entries.filter((entry) => entry.status === 'ACTIVE' && entry.entryType === 'incident').length}
                tone="danger"
              />
            </div>
          </Panel>

          <Panel title="Seguimientos pendientes">
            <div className="space-y-1">
              {pending.slice(0, 4).map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => setEditing(entry)}
                  className="block w-full rounded-xl px-2 py-2 text-left transition hover:bg-warning/15"
                >
                  <strong className="line-clamp-1 text-xs text-foreground">
                    {entry.title || typeInfo[entry.entryType].label}
                  </strong>
                  <span className="mt-0.5 block text-[10px] font-bold text-muted-foreground">
                    {entry.followUpDate ? formatDate(entry.followUpDate) : 'Sin fecha'}
                  </span>
                </button>
              ))}
              {!pending.length ? (
                <p className="text-xs text-muted-foreground">No hay seguimientos pendientes.</p>
              ) : null}
            </div>
          </Panel>
        </aside>
      </div>

      {editing ? (
        <JournalForm
          entry={editing === 'new' ? null : editing}
          courses={courses}
          initialSectionId={sectionId || params.get('sectionId') || ''}
          initialSubjectId={subjectId || params.get('sectionSubjectId') || ''}
          initialType={(params.get('type') as JournalEntryType | null) ?? undefined}
          initialStudentId={params.get('studentId') ?? ''}
          onClose={() => {
            setEditing(null)
            params.delete('action')
            setParams(params, { replace: true })
          }}
          onSaved={async () => {
            setEditing(null)
            await refresh()
          }}
        />
      ) : null}
    </div>
  )
}

function JournalCard({
  entry,
  onEdit,
  onArchive,
  onDelete,
  onComplete,
}: {
  entry: JournalEntry
  onEdit: () => void
  onArchive: () => void
  onDelete: () => void
  onComplete: () => void
}) {
  const info = typeInfo[entry.entryType]
  const Icon = info.icon

  return (
    <article className="dashboard-warm-shadow rounded-3xl bg-card p-4 sm:p-5">
      <div className="flex gap-3">
        <SemanticIcon icon={Icon} tone={info.tone} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-extrabold text-foreground">{entry.title || info.label}</h3>
                {entry.followUpStatus === 'pending' ? (
                  <StatusBadge tone="warning">Requiere seguimiento</StatusBadge>
                ) : null}
                {entry.status === 'ARCHIVED' ? (
                  <StatusBadge tone="neutral">Archivada</StatusBadge>
                ) : null}
              </div>
              <p className="mt-1 text-xs font-bold text-primary-variant">
                {entry.section ? `${entry.section.grade.name} ${entry.section.name}` : 'Sin curso'}
                {entry.sectionSubject ? ` · ${entry.sectionSubject.subject.name}` : ''}
                {entry.students.length
                  ? ` · ${entry.students
                      .map(({ student }) => `${student.firstName} ${student.lastName}`)
                      .join(', ')}`
                  : ''}
              </p>
            </div>
            <button
              onClick={onEdit}
              aria-label="Abrir anotación"
              className="grid size-9 shrink-0 place-items-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <MoreVertical className="size-4" />
            </button>
          </div>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
            {entry.content}
          </p>

          <footer className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/65 pt-3 text-[11px] text-muted-foreground">
            <span>
              <CalendarDays className="mr-1 inline size-3" />
              {new Date(entry.occurredAt).toLocaleTimeString('es', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            {entry.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-muted px-2 py-1">
                <Tag className="mr-1 inline size-3" />
                {tag}
              </span>
            ))}
            {entry.followUpStatus === 'pending' ? (
              <button onClick={onComplete} className="ml-auto font-bold text-foreground">
                <Check className="mr-1 inline size-3 text-success" />
                Completar seguimiento
              </button>
            ) : null}
            <button onClick={onArchive} className="font-bold text-primary-variant">
              {entry.status === 'ARCHIVED' ? (
                <RotateCcw className="mr-1 inline size-3" />
              ) : (
                <Archive className="mr-1 inline size-3" />
              )}
              {entry.status === 'ARCHIVED' ? 'Restaurar' : 'Archivar'}
            </button>
            {entry.status === 'ARCHIVED' ? (
              <button onClick={onDelete} className="font-bold text-destructive">
                Eliminar
              </button>
            ) : null}
          </footer>
        </div>
      </div>
    </article>
  )
}

function JournalForm({
  entry,
  courses,
  initialSectionId,
  initialSubjectId,
  initialType,
  initialStudentId,
  onClose,
  onSaved,
}: {
  entry: JournalEntry | null
  courses: EnrollmentCourse[]
  initialSectionId: string
  initialSubjectId: string
  initialType?: JournalEntryType
  initialStudentId: string
  onClose: () => void
  onSaved: () => Promise<void>
}) {
  const [initialDate] = useState(() =>
    entry?.occurredAt
      ? entry.occurredAt.slice(0, 16)
      : new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16),
  )
  const [form, setForm] = useState<SaveJournalEntry>({
    entryType: entry?.entryType ?? initialType ?? 'quick_note',
    title: entry?.title ?? '',
    content: entry?.content ?? '',
    occurredAt: initialDate,
    sectionId: entry?.sectionId ?? initialSectionId,
    sectionSubjectId: entry?.sectionSubjectId ?? initialSubjectId,
    schoolYearId: entry?.schoolYearId ?? undefined,
    academicPeriodId: entry?.academicPeriodId ?? undefined,
    studentIds: entry?.students.map((student) => student.student.id) ?? (initialStudentId ? [initialStudentId] : []),
    tags: entry?.tags ?? [],
    requiresFollowUp: entry?.requiresFollowUp ?? false,
    followUpDate: entry?.followUpDate?.slice(0, 10),
    followUpStatus: entry?.followUpStatus ?? 'none',
  })
  const [students, setStudents] = useState<StudentAttendanceRow[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const sectionCourses = courses.filter((course) => course.sectionId === form.sectionId)

  useEffect(() => {
    const course = courses.find((item) => item.sectionId === form.sectionId)
    if (!course) {
      setStudents([])
      return
    }

    setForm((current) => ({ ...current, schoolYearId: course.schoolYearId }))
    void getStudentsBySection(course.sectionId, course.schoolYearId).then(setStudents)
  }, [form.sectionId, courses])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = {
        ...form,
        occurredAt: new Date(form.occurredAt).toISOString(),
        tags: form.tags,
      }
      if (entry) await updateJournalEntry(entry.id, payload)
      else await createJournalEntry(payload)
      await onSaved()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      title={entry ? 'Editar anotación' : 'Nueva anotación'}
      description="Registra el contexto necesario sin duplicar información académica."
      onClose={onClose}
      className="max-w-4xl"
      contentClassName="p-5"
    >
      <form onSubmit={submit} className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Tipo">
            <select
              className="field"
              value={form.entryType}
              onChange={(event) =>
                setForm({ ...form, entryType: event.target.value as JournalEntryType })
              }
            >
              {Object.entries(typeInfo).map(([id, info]) => (
                <option key={id} value={id}>
                  {info.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Fecha y hora">
            <Input
              type="datetime-local"
              required
              value={form.occurredAt}
              onChange={(event) => setForm({ ...form, occurredAt: event.target.value })}
            />
          </Field>
        </div>

        <Field label="Título (opcional)">
          <Input
            maxLength={160}
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
          />
        </Field>

        <Field label="Contenido">
          <textarea
            required
            maxLength={8000}
            rows={6}
            className="field min-h-32 py-3"
            value={form.content}
            onChange={(event) => setForm({ ...form, content: event.target.value })}
          />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Curso">
            <select
              className="field"
              value={form.sectionId ?? ''}
              onChange={(event) =>
                setForm({
                  ...form,
                  sectionId: event.target.value || undefined,
                  sectionSubjectId: undefined,
                  studentIds: [],
                })
              }
            >
              <option value="">Sin curso</option>
              {uniqueSections(courses).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Asignatura">
            <select
              className="field"
              value={form.sectionSubjectId ?? ''}
              onChange={(event) =>
                setForm({ ...form, sectionSubjectId: event.target.value || undefined })
              }
            >
              <option value="">Sin asignatura</option>
              {sectionCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.subjectName}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {students.length > 0 ? (
          <Field label="Estudiantes relacionados">
            <div className="max-h-40 overflow-y-auto rounded-xl border border-border p-2">
              {students.map((student) => (
                <label
                  key={student.studentId}
                  className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-muted"
                >
                  <input
                    type="checkbox"
                    checked={form.studentIds.includes(student.studentId)}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        studentIds: event.target.checked
                          ? [...form.studentIds, student.studentId]
                          : form.studentIds.filter((id) => id !== student.studentId),
                      })
                    }
                  />
                  {student.firstName} {student.lastName}
                </label>
              ))}
            </div>
          </Field>
        ) : null}

        <Field label="Etiquetas (separadas por coma)">
          <Input
            value={form.tags.join(', ')}
            onChange={(event) =>
              setForm({
                ...form,
                tags: event.target.value.split(',').map((value) => value.trim()),
              })
            }
          />
        </Field>

        <label className="flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={form.requiresFollowUp}
            onChange={(event) =>
              setForm({
                ...form,
                requiresFollowUp: event.target.checked,
                followUpStatus: event.target.checked ? 'pending' : 'none',
              })
            }
          />
          Requiere seguimiento
        </label>

        {form.requiresFollowUp ? (
          <Field label="Fecha de seguimiento">
            <Input
              type="date"
              value={form.followUpDate ?? ''}
              onChange={(event) => setForm({ ...form, followUpDate: event.target.value })}
            />
          </Field>
        ) : null}

        {error ? <FeedbackBanner tone="danger">{error}</FeedbackBanner> : null}

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            Guardar anotación
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function QuickFilter({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean
  label: string
  count: number
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-extrabold transition',
        active
          ? 'border-primary/25 bg-primary/12 text-foreground'
          : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      {label} <span className="ml-1 opacity-60">{count}</span>
    </button>
  )
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="dashboard-warm-shadow rounded-3xl bg-card p-4">
      <h2 className="mb-3 text-sm font-extrabold text-foreground">{title}</h2>
      {children}
    </section>
  )
}

function SummaryMetric({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: SemanticTone
}) {
  const tones: Record<SemanticTone, string> = {
    info: 'bg-primary/12',
    success: 'bg-success/16',
    warning: 'bg-warning/25',
    danger: 'bg-destructive/14',
    neutral: 'bg-muted',
  }

  return (
    <div className={cn('rounded-2xl p-3 text-foreground', tones[tone])}>
      <strong className="text-xl tabular-nums">{value}</strong>
      <span className="block text-[10px] font-bold">{label}</span>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-xs font-extrabold text-foreground">
      {label}
      {children}
    </label>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
}) {
  return (
    <label className="grid gap-1 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-xl border border-border bg-card px-3 text-xs normal-case tracking-normal text-foreground"
      >
        <option value="">Todos</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function JournalEmpty({ title, action }: { title: string; action?: () => void }) {
  return (
    <div className="dashboard-warm-shadow grid min-h-72 place-items-center rounded-3xl bg-card p-8 text-center">
      <div>
        <SemanticIcon icon={BookMarked} tone="danger" className="mx-auto size-14" iconClassName="size-6" />
        <p className="mt-4 text-sm font-bold text-muted-foreground">{title}</p>
        {action ? (
          <Button className="mt-4" onClick={action}>
            <Plus className="size-4" /> Crear primera anotación
          </Button>
        ) : null}
      </div>
    </div>
  )
}

function uniqueSections(courses: EnrollmentCourse[]) {
  return Array.from(
    new Map(
      courses.map((course) => [
        course.sectionId,
        { value: course.sectionId, label: `${course.gradeName} · ${course.sectionName}` },
      ]),
    ).values(),
  )
}

function formatGroupDate(date: string) {
  const today = new Date().toISOString().slice(0, 10)
  if (date === today) return `Hoy · ${formatDate(date)}`
  return formatDate(date)
}

function formatDate(date: string) {
  return new Date(`${date.slice(0, 10)}T12:00:00`).toLocaleDateString('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
