import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Bell,
  CalendarDays,
  CheckSquare,
  ClipboardList,
  GraduationCap,
  Info,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  SearchX,
  Sparkles,
  UsersRound,
  X,
} from 'lucide-react'
import { useCallback, useMemo, useState, type ReactNode } from 'react'

import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'

import { useAuth } from '@/modules/auth/hooks/useAuth'
import { SectionForm } from '@/modules/courses/components/SectionForm'
import { SubjectAssignmentForm } from '@/modules/courses/components/SubjectAssignmentForm'
import { TeacherAssignmentForm } from '@/modules/courses/components/TeacherAssignmentForm'
import { useCourses } from '@/modules/courses/hooks/useCourses'
import type {
  CreateSubjectInput,
  GradeWithSections,
  Section,
  SectionSubjectAssignment,
  Subject,
  TeacherAssignmentInput,
} from '@/modules/courses/types'
import { cn } from '@/utils/cn'

type CourseCardItem = {
  id: string
  grade: GradeWithSections
  section: Section
  assignment: SectionSubjectAssignment | null
  subjectName: string
  levelName: string
  cycleName: string
}

const subjectAccentColors: Record<string, { color: string; soft: string }> = {
  'Lengua Española': { color: '#1e4f8f', soft: 'hsl(224 62% 33% / 0.08)' },
  'Matemática': { color: '#6f3cc3', soft: 'hsl(262 52% 47% / 0.08)' },
  'Ciencias Naturales': { color: '#2e8757', soft: 'hsl(152 45% 34% / 0.08)' },
  'Ciencias Sociales': { color: '#c65b0b', soft: 'hsl(26 80% 42% / 0.08)' },
  'Inglés': { color: '#1d86a6', soft: 'hsl(196 70% 36% / 0.08)' },
}

const defaultSubjectColor = { color: '#1e4f8f', soft: 'hsl(224 62% 33% / 0.08)' }

const levelStyles: Record<string, { color: string; soft: string }> = {
  'Primaria': { color: '#1e4f8f', soft: 'hsl(224 62% 33% / 0.08)' },
  'Secundaria': { color: '#6f3cc3', soft: 'hsl(262 52% 47% / 0.08)' },
}

const defaultLevelStyle = { color: '#1e4f8f', soft: 'hsl(224 62% 33% / 0.08)' }

function getSubjectColor(subjectName: string) {
  const normalized = normalizeText(subjectName)
  const match = Object.entries(subjectAccentColors).find(([key]) => normalizeText(key) === normalized)
  return match ? match[1] : defaultSubjectColor
}

function getLevelStyle(levelName: string) {
  const normalized = normalizeText(levelName)
  const match = Object.entries(levelStyles).find(([key]) => normalizeText(key) === normalized)
  return match ? match[1] : defaultLevelStyle
}

function normalizeText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function CoursesPage() {
  const { hasRole } = useAuth()
  const {
    grades,
    catalogs,
    currentSchoolYear,
    loading,
    error,
    removeGrade,
    addSection,
    editSection,
    removeSection,
    addSubject,
    createTeacherAssignment,
    assignSubject,
    removeSubjectAssignment,
  } = useCourses()

  const canManage = hasRole(['admin', 'coordinator'])

  const [assignmentFlowOpen, setAssignmentFlowOpen] = useState(false)
  const [assignmentFlowError, setAssignmentFlowError] = useState<string | null>(null)
  const [assignmentFlowSubmitting, setAssignmentFlowSubmitting] = useState(false)

  const [sectionFormOpen, setSectionFormOpen] = useState(false)
  const [sectionGrade, setSectionGrade] = useState<GradeWithSections | null>(null)
  const [editingSection, setEditingSection] = useState<Section | null>(null)
  const [sectionFormError, setSectionFormError] = useState<string | null>(null)
  const [sectionSubmitting, setSectionSubmitting] = useState(false)

  const [assignmentTarget, setAssignmentTarget] = useState<{
    grade: GradeWithSections
    section: Section
  } | null>(null)
  const [assignmentError, setAssignmentError] = useState<string | null>(null)
  const [assignmentSubmitting, setAssignmentSubmitting] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<{
    kind: 'grade' | 'section' | 'assignment'
    id: string
    label: string
  } | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [cycleFilter, setCycleFilter] = useState('all')
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)

  function openCreateAssignmentFlow() {
    setAssignmentFlowError(null)
    setAssignmentFlowOpen(true)
  }

  function closeAssignmentFlow() {
    setAssignmentFlowOpen(false)
    setAssignmentFlowError(null)
  }

  function openCreateSection(grade: GradeWithSections) {
    setSectionGrade(grade)
    setEditingSection(null)
    setSectionFormError(null)
    setSectionFormOpen(true)
  }

  function openEditSection(grade: GradeWithSections, sectionId: string) {
    const section = grade.sections.find((s) => s.id === sectionId)
    if (!section) return
    setSectionGrade(grade)
    setEditingSection(section)
    setSectionFormError(null)
    setSectionFormOpen(true)
  }

  function closeSectionForm() {
    setSectionFormOpen(false)
    setSectionGrade(null)
    setEditingSection(null)
    setSectionFormError(null)
  }

  function openAssignSubject(grade: GradeWithSections, sectionId: string) {
    const section = grade.sections.find((s) => s.id === sectionId)
    if (!section) return
    setAssignmentTarget({ grade, section })
    setAssignmentError(null)
  }

  function closeAssignmentForm() {
    setAssignmentTarget(null)
    setAssignmentError(null)
  }

  const handleCreateTeacherAssignment = useCallback(
    async (input: TeacherAssignmentInput) => {
      setAssignmentFlowSubmitting(true)
      setAssignmentFlowError(null)

      try {
        await createTeacherAssignment(input)
        closeAssignmentFlow()
      } catch (error) {
        setAssignmentFlowError(
          error instanceof Error
            ? error.message
            : 'No se pudo crear la asignacion docente.',
        )
      } finally {
        setAssignmentFlowSubmitting(false)
      }
    },
    [createTeacherAssignment],
  )

  const handleSectionSubmit = useCallback(
    async (input: { name: string }) => {
      if (!sectionGrade) return

      setSectionSubmitting(true)
      setSectionFormError(null)

      try {
        if (editingSection) {
          await editSection(editingSection.id, input)
        } else {
          await addSection({ ...input, gradeId: sectionGrade.id })
        }
        closeSectionForm()
      } catch (error) {
        setSectionFormError(
          error instanceof Error
            ? error.message
            : 'No se pudo guardar la seccion.',
        )
      } finally {
        setSectionSubmitting(false)
      }
    },
    [addSection, editSection, editingSection, sectionGrade],
  )

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return

    try {
      if (deleteTarget.kind === 'grade') {
        await removeGrade(deleteTarget.id)
      } else if (deleteTarget.kind === 'section') {
        await removeSection(deleteTarget.id)
      } else {
        await removeSubjectAssignment(deleteTarget.id)
      }
      setActionError(null)
      setDeleteTarget(null)
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : 'No se pudo eliminar el registro.',
      )
      setDeleteTarget(null)
    }
  }, [deleteTarget, removeGrade, removeSection, removeSubjectAssignment])

  const handleCreateSubject = useCallback(
    async (input: CreateSubjectInput): Promise<Subject> => {
      return addSubject(input)
    },
    [addSubject],
  )

  const handleAssignSubject = useCallback(
    async (input: { subjectId: string }) => {
      if (!assignmentTarget || !currentSchoolYear) return

      setAssignmentSubmitting(true)
      setAssignmentError(null)

      try {
        await assignSubject({
          schoolYearId: currentSchoolYear.id,
          gradeId: assignmentTarget.grade.id,
          sectionId: assignmentTarget.section.id,
          subjectId: input.subjectId,
          teacherId: null,
        })
        closeAssignmentForm()
      } catch (error) {
        setAssignmentError(
          error instanceof Error
            ? error.message
            : 'No se pudo asignar la asignatura.',
        )
      } finally {
        setAssignmentSubmitting(false)
      }
    },
    [assignSubject, assignmentTarget, currentSchoolYear],
  )

  const courseCards = useMemo(() => buildCourseCards(grades), [grades])
  const filteredCourseCards = useMemo(() => {
    const query = normalizeText(searchQuery)

    return courseCards.filter((item) => {
      const matchesSearch = !query || normalizeText([
        item.grade.name,
        item.section.name,
        item.subjectName,
        item.levelName,
        item.cycleName,
      ].join(' ')).includes(query)
      const matchesLevel = levelFilter === 'all' || item.levelName === levelFilter
      const matchesCycle = cycleFilter === 'all' || item.cycleName === cycleFilter
      const matchesSubject = subjectFilter === 'all' || item.subjectName === subjectFilter
      return matchesSearch && matchesLevel && matchesCycle && matchesSubject
    })
  }, [courseCards, cycleFilter, levelFilter, searchQuery, subjectFilter])
  const levelFilters = useMemo(() => uniqueValues(courseCards.map((item) => item.levelName)), [courseCards])
  const cycleFilters = useMemo(() => uniqueValues(courseCards.map((item) => item.cycleName)), [courseCards])
  const subjectFilters = useMemo(
    () => uniqueValues(courseCards.map((item) => item.subjectName).filter((item) => item !== 'Sin asignatura')),
    [courseCards],
  )
  const groupedCourses = useMemo(() => groupCoursesByLevel(filteredCourseCards), [filteredCourseCards])
  const selectedCourse = useMemo(
    () => courseCards.find((item) => item.id === selectedCourseId) ?? null,
    [courseCards, selectedCourseId],
  )

  const totalStudents = useMemo(
    () => courseCards.reduce((sum, item) => sum + (item.section.capacity ?? 0), 0),
    [courseCards],
  )

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-6 py-10 md:px-10">
      {selectedCourse ? (
        <CourseDetailView
          item={selectedCourse}
          schoolYearName={currentSchoolYear?.name ?? ''}
          onBack={() => setSelectedCourseId(null)}
        />
      ) : (
        <>
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary">
                  <Sparkles className="h-3 w-3 text-primary-foreground" />
                </span>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
                  AulaBase
                </p>
              </div>
              <h1 className="mt-2.5 text-3xl font-extrabold tracking-tight text-foreground">
                Mis cursos
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{courseCards.length} cursos</span>
                {' · '}
                <span className="font-bold text-foreground">{totalStudents} estudiantes</span>
                {currentSchoolYear ? (
                  <> · Año escolar {currentSchoolYear.name}</>
                ) : null}
              </p>
            </div>

            {canManage ? (
              <Button variant="primary" className="h-10 px-4" onClick={openCreateAssignmentFlow}>
                <Plus className="h-4 w-4" />
                Nuevo curso
              </Button>
            ) : null}
          </header>

          <div className="space-y-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  className="h-10 w-full rounded-xl border border-border bg-card pl-10 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                  placeholder="Buscar por grado, seccion o asignatura..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>

              <div className="flex items-center gap-1 rounded-xl bg-muted p-1">
                {['all', ...levelFilters].map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={cn(
                      'rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors',
                      levelFilter === level
                        ? 'bg-card text-primary shadow-sm'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                    onClick={() => setLevelFilter(level)}
                  >
                    {level === 'all' ? 'Todos' : level}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 rounded-xl bg-muted p-1">
                {['all', ...cycleFilters].map((cycle) => (
                  <button
                    key={cycle}
                    type="button"
                    className={cn(
                      'rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors',
                      cycleFilter === cycle
                        ? 'bg-card text-primary shadow-sm'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                    onClick={() => setCycleFilter(cycle)}
                  >
                    {cycle === 'all' ? 'Ambos ciclos' : cycle}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors',
                  subjectFilter === 'all'
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setSubjectFilter('all')}
              >
                Todas
              </button>
              {subjectFilters.map((subjectName) => {
                const active = subjectFilter === subjectName
                const palette = getSubjectColor(subjectName)
                return (
                  <button
                    key={subjectName}
                    type="button"
                    className="flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors"
                    style={active ? {
                      borderColor: palette.color,
                      backgroundColor: palette.color,
                      color: 'white',
                    } : {
                      borderColor: 'var(--border)',
                      backgroundColor: 'var(--card)',
                      color: 'var(--muted-foreground)',
                    }}
                    onClick={() => setSubjectFilter(active ? 'all' : subjectName)}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: active ? 'white' : palette.color }}
                    />
                    {subjectName}
                  </button>
                )
              })}
              {levelFilter !== 'all' || cycleFilter !== 'all' || subjectFilter !== 'all' || searchQuery ? (
                <button
                  type="button"
                  className="ml-1 inline-flex items-center gap-1 text-xs font-bold text-muted-foreground transition-colors hover:text-destructive"
                  onClick={() => {
                    setSearchQuery('')
                    setLevelFilter('all')
                    setCycleFilter('all')
                    setSubjectFilter('all')
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                  Limpiar
                </button>
              ) : null}
            </div>
          </div>

          {!currentSchoolYear ? (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-warning/25 bg-warning/12 p-4 text-sm text-warning">
              <div className="flex items-center gap-3">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <p>
                  Configura y activa un ano escolar para poder asignar asignaturas
                  y docentes a las secciones.
                </p>
              </div>
              {canManage ? (
                <a
                  href="/configuracion#anos-escolares"
                  className="shrink-0 text-xs font-bold underline underline-offset-2 hover:opacity-80"
                >
                  Ir a configuración
                </a>
              ) : null}
            </div>
          ) : null}

          {actionError ? (
            <div className="flex gap-3 rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>{actionError}</p>
            </div>
          ) : null}

          {error ? (
            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
              <div className="p-6">
                <ErrorState message={error} />
              </div>
            </div>
          ) : loading ? (
            <div className="flex min-h-[280px] items-center justify-center text-sm font-medium text-muted-foreground">
              Cargando cursos y secciones...
            </div>
          ) : filteredCourseCards.length > 0 ? (
            <div className="space-y-8">
              {groupedCourses.map((group) => (
                <section key={group.key}>
                  <div className="mb-3 mt-2 flex items-center gap-3">
                    <h2 className="text-sm font-extrabold uppercase tracking-[0.15em] text-muted-foreground">
                      Nivel {group.levelName.toLowerCase()}
                    </h2>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold tabular-nums text-muted-foreground">
                      {group.items.length}
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {group.items.map((item) => {
                      const assignment = item.assignment
                      return (
                        <CourseCard
                          key={item.id}
                          item={item}
                          schoolYearName={currentSchoolYear?.name ?? ''}
                          canManage={canManage}
                          onOpen={() => setSelectedCourseId(item.id)}
                          onAddSection={() => openCreateSection(item.grade)}
                          onEditSection={() => openEditSection(item.grade, item.section.id)}
                          onDeleteSection={() =>
                            setDeleteTarget({
                              kind: 'section',
                              id: item.section.id,
                              label: item.section.name,
                            })
                          }
                          onAssignSubject={() => {
                            if (!currentSchoolYear) {
                              setActionError('Activa un ano escolar antes de asignar asignaturas.')
                              return
                            }
                            openAssignSubject(item.grade, item.section.id)
                          }}
                          onDeleteSubjectAssignment={assignment ? () =>
                            setDeleteTarget({
                              kind: 'assignment',
                              id: assignment.id,
                              label: assignment.subjectName,
                            }) : undefined}
                        />
                      )
                    })}
                  </div>
                </section>
              ))}
            </div>
          ) : courseCards.length > 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-20 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                <SearchX className="h-5 w-5 text-muted-foreground" />
              </span>
              <p className="mt-4 text-sm font-bold text-foreground">No se encontraron cursos</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Prueba ajustando los filtros o el termino de busqueda.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
              <div className="p-16">
                <EmptyState
                  title="Sin cursos aun"
                  description="Crea tu primer curso para organizar secciones y asignaturas."
                  action={
                    canManage ? (
                      <Button variant="primary" onClick={openCreateAssignmentFlow}>
                        <Plus className="size-4" />
                        Crear curso
                      </Button>
                    ) : undefined
                  }
                />
              </div>
            </div>
          )}
        </>
      )}

      {assignmentFlowOpen ? (
        <TeacherAssignmentForm
          catalogs={catalogs}
          submitting={assignmentFlowSubmitting}
          error={assignmentFlowError}
          onSubmit={handleCreateTeacherAssignment}
          onClose={closeAssignmentFlow}
        />
      ) : null}

      {assignmentTarget ? (
        <SubjectAssignmentForm
          grade={assignmentTarget.grade}
          section={assignmentTarget.section}
          catalogs={catalogs}
          submitting={assignmentSubmitting}
          error={assignmentError}
          onCreateSubject={handleCreateSubject}
          onAssign={handleAssignSubject}
          onClose={closeAssignmentForm}
        />
      ) : null}

      {sectionFormOpen && sectionGrade ? (
        <SectionForm
          key={editingSection?.id ?? 'new-section'}
          gradeName={sectionGrade.name}
          sections={sectionGrade.sections}
          section={editingSection ?? undefined}
          submitting={sectionSubmitting}
          error={sectionFormError}
          onSubmit={handleSectionSubmit}
          onClose={closeSectionForm}
        />
      ) : null}

      {deleteTarget ? (
        <ConfirmDialog
          title={
            deleteTarget.kind === 'grade'
              ? 'Inactivar curso'
              : deleteTarget.kind === 'section'
                ? 'Inactivar seccion'
                : 'Quitar asignatura'
          }
          description={
            deleteTarget.kind === 'grade'
              ? `Inactivar el curso "${deleteTarget.label}"? Se conservara el historial relacionado.`
              : deleteTarget.kind === 'section'
                ? `Inactivar la seccion "${deleteTarget.label}"? Se conservara el historial relacionado.`
                : 'Quitar esta asignatura del curso para el ano escolar activo?'
          }
          confirmLabel={deleteTarget.kind === 'assignment' ? 'Quitar' : 'Inactivar'}
          destructive
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      ) : null}
    </div>
  )
}

function CourseDetailView({
  item,
  schoolYearName,
  onBack,
}: {
  item: CourseCardItem
  schoolYearName: string
  onBack: () => void
}) {
  const palette = getSubjectColor(item.subjectName)
  const courseLabel = `${item.grade.name}.º ${item.section.name}`

  return (
    <div className="space-y-7">
      <header className="rounded-b-3xl bg-muted px-1 pb-0 pt-1">
        <button
          type="button"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground transition hover:text-primary"
          onClick={onBack}
        >
          <ArrowLeft className="size-4" />
          Mis cursos
        </button>

        <div className="flex flex-col gap-8 pb-7 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 gap-6">
            <div
              className="flex size-20 shrink-0 items-center justify-center rounded-2xl text-2xl font-extrabold text-white shadow-lg"
              style={{ backgroundColor: palette.color }}
            >
              {item.grade.name}{item.section.name}
            </div>
            <div className="min-w-0">
              <h1 className="text-4xl font-extrabold leading-tight text-foreground sm:text-5xl">
                {courseLabel} - <span style={{ color: palette.color }}>{item.subjectName}</span>
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-bold text-primary">
                <span className="uppercase">{item.levelName}</span>
                <span className="rounded-xl bg-card px-3 py-1.5 text-foreground shadow-sm">
                  {item.cycleName}
                </span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-muted-foreground">
                  <MapPin className="size-4" />
                  Seccion {item.section.name}
                </span>
                {schoolYearName ? (
                  <span className="font-semibold text-muted-foreground">Ano escolar {schoolYearName}</span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 lg:min-w-[26rem]">
            <MetricBox value={item.section.capacity ? String(item.section.capacity) : '—'} label="Capacidad" />
            <MetricBox value="—" label="Asistencia" />
            <MetricBox value="—" label="Promedio" />
          </div>
        </div>

        <nav className="flex gap-7 overflow-x-auto border-t border-border pt-5">
          <DetailTab active icon={<Info className="size-4" />} label="Informacion" />
          <DetailTab icon={<UsersRound className="size-4" />} label="Estudiantes" />
          <DetailTab icon={<CheckSquare className="size-4" />} label="Asistencia" />
          <DetailTab icon={<GraduationCap className="size-4" />} label="Calificaciones" />
          <DetailTab icon={<ClipboardList className="size-4" />} label="Planificaciones" />
          <DetailTab icon={<CalendarDays className="size-4" />} label="Horario" />
          <DetailTab icon={<BarChart3 className="size-4" />} label="Reportes" />
        </nav>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_28rem]">
        <section className="rounded-2xl border border-border bg-card p-7 shadow-sm">
          <h2 className="text-sm font-extrabold uppercase tracking-[0.15em] text-muted-foreground">
            Sobre este curso
          </h2>
          <p className="mt-5 text-lg leading-8 text-foreground">
            {item.subjectName} para {courseLabel} del nivel {item.levelName.toLowerCase()}
            {item.cycleName ? ` (${item.cycleName.toLowerCase()})` : ''}.
            {' '}
            {item.section.capacity
              ? `Grupo con capacidad de ${item.section.capacity} estudiantes`
              : 'Grupo sin capacidad definida'}
            {item.assignment?.teacherName ? ` con ${item.assignment.teacherName} asignado` : ''}
            {schoolYearName ? ` para el ano escolar ${schoolYearName}` : ''}.
          </p>

          <div className="mt-8">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
              <span>Avance del programa</span>
              <span>Sin datos</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted" />
          </div>

          <div className="mt-8 grid gap-6 border-t border-border pt-7 sm:grid-cols-3">
            <DetailMeta label="Proxima clase" value="Sin horario" />
            <DetailMeta label="Seccion" value={item.section.name} />
            <DetailMeta label="Docente" value={item.assignment?.teacherName ?? 'Sin docente'} />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-7 shadow-sm">
          <h2 className="text-sm font-extrabold uppercase tracking-[0.15em] text-muted-foreground">
            Actividad reciente
          </h2>
          <div className="mt-6 space-y-5">
            <ActivityItem icon={<CheckSquare className="size-5" />} label={item.assignment ? 'Asignatura registrada' : 'Sin asignatura registrada'} />
            <ActivityItem icon={<GraduationCap className="size-5" />} label={item.assignment?.teacherName ? 'Docente asignado' : 'Sin docente asignado'} />
            <ActivityItem icon={<ClipboardList className="size-5" />} label={schoolYearName ? `Ano escolar ${schoolYearName}` : 'Sin ano escolar activo'} />
            <ActivityItem icon={<Bell className="size-5" />} label="Sin alertas registradas" />
          </div>
        </section>
      </div>
    </div>
  )
}

function MetricBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-card px-4 py-5 text-center shadow-sm">
      <p className="text-3xl font-extrabold text-foreground">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase text-muted-foreground">{label}</p>
    </div>
  )
}

function DetailTab({ active, icon, label }: { active?: boolean; icon: ReactNode; label: string }) {
  return (
    <button
      type="button"
      className={cn(
        'flex h-12 shrink-0 items-center gap-2 border-b-4 border-transparent px-3 text-sm font-bold text-muted-foreground',
        active && 'border-primary text-primary',
      )}
    >
      {icon}
      {label}
    </button>
  )
}

function DetailMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase text-muted-foreground">{label}</p>
      <p className="mt-2 text-lg font-extrabold text-foreground">{value}</p>
    </div>
  )
}

function ActivityItem({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-primary">
        {icon}
      </span>
      <span className="text-lg font-medium text-foreground">{label}</span>
    </div>
  )
}

function CourseCard({
  item,
  schoolYearName,
  canManage,
  onOpen,
  onAddSection,
  onEditSection,
  onDeleteSection,
  onAssignSubject,
  onDeleteSubjectAssignment,
}: {
  item: CourseCardItem
  schoolYearName: string
  canManage: boolean
  onOpen: () => void
  onAddSection: () => void
  onEditSection: () => void
  onDeleteSection: () => void
  onAssignSubject: () => void
  onDeleteSubjectAssignment?: () => void
}) {
  const palette = getSubjectColor(item.subjectName)
  const levelStyle = getLevelStyle(item.levelName)
  const gradeNumber = item.grade.name.replace('.º', '')

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:shadow-lg hover:ring-2 hover:ring-ring/20"
    >
      <div
        className="flex flex-1 flex-col p-5 pb-4 cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onOpen()
          }
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-xl text-base font-extrabold text-white"
              style={{ backgroundColor: palette.color }}
            >
              {gradeNumber}
              <span className="ml-px text-xs font-bold opacity-80">{item.section.name}</span>
            </span>
            <div>
              <h3 className="text-lg font-extrabold tracking-tight text-foreground">
                {item.grade.name} {item.section.name}
              </h3>
              <p
                className="text-sm font-bold"
                style={{ color: palette.color }}
              >
                {item.subjectName}
              </p>
            </div>
          </div>

          <span
            className="rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide"
            style={{ backgroundColor: levelStyle.soft, color: levelStyle.color }}
          >
            {item.levelName}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm">
          <UsersRound className="h-4 w-4 text-muted-foreground" />
          <span className="font-bold tabular-nums text-foreground">
            {item.section.capacity ?? 0}
          </span>
          <span className="text-muted-foreground">estudiantes</span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <span>{item.cycleName}</span>
          {item.assignment?.teacherName ? (
            <>
              <span className="text-border">•</span>
              <span>{item.assignment.teacherName}</span>
            </>
          ) : null}
          {schoolYearName ? (
            <>
              <span className="text-border">•</span>
              <span>{schoolYearName}</span>
            </>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border bg-muted/40 px-3 py-2">
        <div className="flex items-center gap-0.5">
          {canManage ? (
            <>
              <FooterAction label="Agregar seccion" onClick={onAddSection}>
                <UsersRound className="h-4 w-4" />
              </FooterAction>
              <FooterAction label="Editar seccion" onClick={onEditSection}>
                <CheckSquare className="h-4 w-4" />
              </FooterAction>
              <FooterAction label="Asignar asignatura" onClick={onAssignSubject}>
                <GraduationCap className="h-4 w-4" />
              </FooterAction>
              {onDeleteSubjectAssignment ? (
                <FooterAction label="Quitar asignatura" onClick={onDeleteSubjectAssignment}>
                  <ClipboardList className="h-4 w-4" />
                </FooterAction>
              ) : null}
              <FooterAction label="Inactivar seccion" onClick={onDeleteSection}>
                <CalendarDays className="h-4 w-4" />
              </FooterAction>
            </>
          ) : (
            <span className="px-2 text-xs font-bold text-muted-foreground">Vista de curso</span>
          )}
        </div>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </article>
  )
}

function FooterAction({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
      aria-label={label}
      title={label}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
    >
      {children}
    </button>
  )
}

function buildCourseCards(grades: GradeWithSections[]): CourseCardItem[] {
  return grades.flatMap((grade) =>
    grade.sections.flatMap((section) => {
      const levelName = grade.academicLevelName ?? grade.level ?? 'Sin nivel definido'
      const cycleName = grade.academicCycleName ?? 'Sin ciclo'
      const activeAssignments = section.assignments.filter((assignment) => assignment.status === 'active')

      if (!activeAssignments.length) {
        const card: CourseCardItem = {
          id: `${grade.id}:${section.id}`,
          grade,
          section,
          assignment: null,
          subjectName: 'Sin asignatura',
          levelName,
          cycleName,
        }
        return [card]
      }

      return activeAssignments.map((assignment): CourseCardItem => ({
        id: assignment.id,
        grade,
        section,
        assignment,
        subjectName: assignment.subjectName || 'Sin asignatura',
        levelName,
        cycleName,
      }))
    }),
  )
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)))
}

function groupCoursesByLevel(items: CourseCardItem[]) {
  const groups = new Map<string, { key: string; levelName: string; items: CourseCardItem[] }>()

  for (const item of items) {
    const group = groups.get(item.levelName) ?? {
      key: item.levelName,
      levelName: item.levelName,
      items: [],
    }
    group.items.push(item)
    groups.set(item.levelName, group)
  }

  return Array.from(groups.values())
}
