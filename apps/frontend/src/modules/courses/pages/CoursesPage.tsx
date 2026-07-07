/**
 * @file Pagina de Gestion Academica
 *
 * Vista principal de organizacion academica: grados, secciones,
 * asignaturas y asignaciones docentes.
 */

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
  Sparkles,
  UsersRound,
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

const subjectAccentClasses = [
  'bg-[#2f4faa] text-[#2f4faa] border-[#2f4faa]',
  'bg-[#6f3cc3] text-[#6f3cc3] border-[#6f3cc3]',
  'bg-[#2e8757] text-[#2e8757] border-[#2e8757]',
  'bg-[#c65b0b] text-[#c65b0b] border-[#c65b0b]',
  'bg-[#1d86a6] text-[#1d86a6] border-[#1d86a6]',
]

const levelClassByName: Record<string, string> = {
  primaria: 'bg-[#eef6fb] text-[#2f4faa]',
  secundaria: 'bg-[#f1edf9] text-[#6f3cc3]',
}

function normalizeText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function getSubjectAccent(subjectName: string) {
  const normalized = normalizeText(subjectName)
  const index = Math.abs([...normalized].reduce((sum, char) => sum + char.charCodeAt(0), 0)) % subjectAccentClasses.length
  return subjectAccentClasses[index]
}

function getLevelPillClass(levelName: string) {
  return levelClassByName[normalizeText(levelName)] ?? 'bg-[#edf2fb] text-[#2f4faa]'
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

  return (
    <section className="mx-auto w-full max-w-[92rem]">
      {selectedCourse ? (
        <CourseDetailView
          item={selectedCourse}
          schoolYearName={currentSchoolYear?.name ?? ''}
          onBack={() => setSelectedCourseId(null)}
        />
      ) : (
        <>
      <div className="mb-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-primary">
              <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Sparkles className="size-3.5" />
              </span>
              Aulabase
            </p>
            <h1 className="mt-5 text-4xl font-black leading-none text-[#111a3a] sm:text-5xl">
              Mis cursos
            </h1>
            <p className="mt-3 text-lg font-semibold text-[#111a3a]">
              {courseCards.length} cursos
              <span className="font-medium text-[#75809d]"> · </span>
              <span className="font-medium text-[#75809d]">
                {currentSchoolYear ? `Ano escolar ${currentSchoolYear.name}` : 'Sin ano escolar activo'}
              </span>
            </p>
          </div>

          {canManage ? (
            <Button variant="primary" className="h-12 px-5" onClick={openCreateAssignmentFlow}>
              <Plus className="size-4" />
              Nuevo curso
            </Button>
          ) : null}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-[#73809f]" />
            <input
              className="h-14 w-full rounded-2xl border border-[#d7deea] bg-white pl-14 pr-4 text-base font-medium text-[#111a3a] shadow-[0_3px_10px_rgba(15,26,58,0.08)] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
              placeholder="Buscar por grado, seccion o asignatura..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>

          <FilterGroup
            options={['all', ...levelFilters]}
            value={levelFilter}
            labels={{ all: 'Todos' }}
            onChange={setLevelFilter}
          />
          <FilterGroup
            options={['all', ...cycleFilters]}
            value={cycleFilter}
            labels={{ all: 'Ambos ciclos' }}
            onChange={setCycleFilter}
          />
        </div>

        {subjectFilters.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <SubjectFilterButton active={subjectFilter === 'all'} onClick={() => setSubjectFilter('all')}>
              Todas
            </SubjectFilterButton>
            {subjectFilters.map((subjectName) => {
              const colorClass = getSubjectAccent(subjectName)
              return (
                <SubjectFilterButton
                  key={subjectName}
                  active={subjectFilter === subjectName}
                  onClick={() => setSubjectFilter(subjectName)}
                >
                  <span className={cn('size-2 rounded-full', colorClass.split(' ')[0])} />
                  {subjectName}
                </SubjectFilterButton>
              )
            })}
          </div>
        ) : null}

        {!currentSchoolYear ? (
          <div className="mt-6 flex gap-3 rounded-2xl border border-warning/25 bg-warning/12 p-4 text-sm text-warning">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p>
              Configura y activa un ano escolar para poder asignar asignaturas
              y docentes a las secciones.
            </p>
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
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
        ) : courseCards.length > 0 ? (
          <div className="space-y-10">
            {groupedCourses.map((group) => (
              <section key={group.key} className="space-y-5">
                <div className="flex items-center gap-4">
                  <p className="shrink-0 text-lg font-black uppercase tracking-[0.28em] text-[#697694]">
                    {group.levelName}
                  </p>
                  <span className="rounded-full bg-[#e9eef7] px-3 py-1 text-sm font-black text-[#697694]">
                    {group.items.length}
                  </span>
                  <div className="h-px flex-1 bg-[#d9e0ec]" />
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="p-16">
              <EmptyState
                title={courseCards.length ? 'Sin resultados' : 'Sin cursos aun'}
                description={courseCards.length ? 'Ajusta los filtros para ver cursos disponibles.' : 'Crea tu primer curso para organizar secciones y asignaturas.'}
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
      </div>
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
    </section>
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
  const accent = getSubjectAccent(item.subjectName)
  const [accentBg, accentText] = accent.split(' ')
  const capacityText = item.section.capacity ? String(item.section.capacity) : '—'
  const courseLabel = `${item.grade.name}.º ${item.section.name}`

  return (
    <div className="space-y-7">
      <header className="rounded-b-3xl bg-[#e8eef7] px-1 pb-0 pt-1">
        <button
          type="button"
          className="mb-6 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.28em] text-[#697694] transition hover:text-primary"
          onClick={onBack}
        >
          <ArrowLeft className="size-4" />
          Mis cursos
        </button>

        <div className="flex flex-col gap-8 pb-7 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 gap-6">
            <div className={cn('flex size-20 shrink-0 items-center justify-center rounded-3xl text-2xl font-black text-white shadow-lg', accentBg)}>
              {item.grade.name}{item.section.name}
            </div>
            <div className="min-w-0">
              <h1 className="text-4xl font-black leading-tight text-[#111a3a] sm:text-5xl">
                {courseLabel} - <span className={accentText}>{item.subjectName}</span>
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-black text-primary">
                <span className="uppercase">{item.levelName}</span>
                <span className="rounded-xl bg-white px-3 py-1.5 text-[#111a3a] shadow-sm">
                  {item.cycleName}
                </span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#75809d]">
                  <MapPin className="size-4" />
                  Seccion {item.section.name}
                </span>
                {schoolYearName ? (
                  <span className="font-semibold text-[#75809d]">Ano escolar {schoolYearName}</span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 lg:min-w-[26rem]">
            <MetricBox value={capacityText} label="Capacidad" />
            <MetricBox value="—" label="Asistencia" />
            <MetricBox value="—" label="Promedio" />
          </div>
        </div>

        <nav className="flex gap-7 overflow-x-auto border-t border-[#d6deec] pt-5">
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
        <section className="rounded-3xl border border-[#d9e0ec] bg-white p-7 shadow-[0_3px_12px_rgba(15,26,58,0.10)]">
          <h2 className="text-lg font-black uppercase tracking-[0.28em] text-[#697694]">
            Sobre este curso
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#28314f]">
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
            <div className="flex items-center justify-between text-sm font-black text-[#697694]">
              <span>Avance del programa</span>
              <span>Sin datos</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-[#e7ebf3]" />
          </div>

          <div className="mt-8 grid gap-6 border-t border-[#d9e0ec] pt-7 sm:grid-cols-3">
            <DetailMeta label="Proxima clase" value="Sin horario" />
            <DetailMeta label="Seccion" value={item.section.name} />
            <DetailMeta label="Docente" value={item.assignment?.teacherName ?? 'Sin docente'} />
          </div>
        </section>

        <section className="rounded-3xl border border-[#d9e0ec] bg-white p-7 shadow-[0_3px_12px_rgba(15,26,58,0.10)]">
          <h2 className="text-lg font-black uppercase tracking-[0.28em] text-[#697694]">
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
    <div className="rounded-2xl bg-white px-4 py-5 text-center shadow-[0_3px_12px_rgba(15,26,58,0.12)]">
      <p className="text-3xl font-black text-[#111a3a]">{value}</p>
      <p className="mt-1 text-xs font-black uppercase text-[#697694]">{label}</p>
    </div>
  )
}

function DetailTab({ active, icon, label }: { active?: boolean; icon: ReactNode; label: string }) {
  return (
    <button
      type="button"
      className={cn(
        'flex h-12 shrink-0 items-center gap-2 border-b-4 border-transparent px-3 text-sm font-black text-[#697694]',
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
      <p className="text-xs font-black uppercase text-[#697694]">{label}</p>
      <p className="mt-2 text-lg font-black text-[#111a3a]">{value}</p>
    </div>
  )
}

function ActivityItem({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#edf2fb] text-primary">
        {icon}
      </span>
      <span className="text-lg font-medium text-[#28314f]">{label}</span>
    </div>
  )
}

function FilterGroup({
  options,
  value,
  labels,
  onChange,
}: {
  options: string[]
  value: string
  labels?: Record<string, string>
  onChange: (value: string) => void
}) {
  return (
    <div className="flex h-14 items-center rounded-2xl bg-[#e9eef8] p-1">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={cn(
            'h-11 rounded-xl px-5 text-sm font-black text-[#667493] transition',
            value === option && 'bg-white text-primary shadow-[0_3px_10px_rgba(15,26,58,0.10)]',
          )}
          onClick={() => onChange(option)}
        >
          {labels?.[option] ?? option}
        </button>
      ))}
    </div>
  )
}

function SubjectFilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-11 items-center gap-2 rounded-2xl border border-[#d9e0ec] bg-white px-5 text-sm font-black text-[#667493] shadow-sm transition hover:border-primary/40',
        active && 'border-primary bg-primary text-primary-foreground',
      )}
      onClick={onClick}
    >
      {children}
    </button>
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
  const accent = getSubjectAccent(item.subjectName)
  const [accentBg, accentText, accentBorder] = accent.split(' ')
  const levelPillClass = getLevelPillClass(item.levelName)

  return (
    <article
      className={cn(
        'cursor-pointer overflow-hidden rounded-3xl border bg-white shadow-[0_3px_12px_rgba(15,26,58,0.10)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(15,26,58,0.14)]',
        item.assignment ? accentBorder.replace('border-', 'border-') : 'border-[#d9e0ec]',
      )}
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
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 gap-5">
            <div className={cn('flex size-16 shrink-0 items-center justify-center rounded-2xl text-lg font-black text-white', accentBg)}>
              {item.grade.name}{item.section.name}
            </div>
            <div className="min-w-0 pt-1">
              <h3 className="truncate text-2xl font-black leading-tight text-[#111a3a]">
                {item.grade.name}.º {item.section.name}
              </h3>
              <p className={cn('mt-1 truncate text-lg font-black', accentText)}>
                {item.subjectName}
              </p>
            </div>
          </div>

          <span className={cn('rounded-xl px-3 py-2 text-xs font-black uppercase', levelPillClass)}>
            {item.levelName}
          </span>
        </div>

        <div className="mt-7 flex items-center gap-3 text-[#667493]">
          <UsersRound className="size-5" />
          <span className="text-base font-semibold">
            {item.section.capacity ? `Capacidad ${item.section.capacity}` : 'Sin capacidad definida'}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-semibold text-[#7a86a3]">
          <span>{item.cycleName}</span>
          {item.assignment?.teacherName ? (
            <>
              <span className="text-[#c8cfdd]">·</span>
              <span>{item.assignment.teacherName}</span>
            </>
          ) : null}
          {schoolYearName ? (
            <>
              <span className="text-[#c8cfdd]">·</span>
              <span>{schoolYearName}</span>
            </>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#d9e0ec] bg-[#f7f9fc] px-6 py-4 text-[#667493]">
        <div className="flex items-center gap-5">
          {canManage ? (
            <>
              <IconAction label="Agregar seccion" onClick={onAddSection}>
                <UsersRound className="size-5" />
              </IconAction>
              <IconAction label="Editar seccion" onClick={onEditSection}>
                <CheckSquare className="size-5" />
              </IconAction>
              <IconAction label="Asignar asignatura" onClick={onAssignSubject}>
                <GraduationCap className="size-5" />
              </IconAction>
              {onDeleteSubjectAssignment ? (
                <IconAction label="Quitar asignatura" onClick={onDeleteSubjectAssignment}>
                  <ClipboardList className="size-5" />
                </IconAction>
              ) : null}
              <IconAction label="Inactivar seccion" onClick={onDeleteSection}>
                <CalendarDays className="size-5" />
              </IconAction>
            </>
          ) : (
            <span className="text-sm font-semibold">Vista de curso</span>
          )}
        </div>
        <MoreHorizontal className="size-5" />
      </div>
    </article>
  )
}

function IconAction({
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
      className="rounded-lg p-1 transition hover:bg-white hover:text-primary"
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
