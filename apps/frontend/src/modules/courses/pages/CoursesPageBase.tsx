import {
  AlertCircle,
  Archive,
  ArchiveRestore,
  ArrowLeft,
  ArrowRight,
  Atom,
  Baby,
  Binary,
  BookOpen,
  BookMarked,
  Bot,
  Brain,
  BriefcaseBusiness,
  Building2,
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  Calculator,
  Camera,
  ChartColumn,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Code2,
  CookingPot,
  Cross,
  Dna,
  Dumbbell,
  Earth,
  Edit3,
  Eye,
  FileText,
  Footprints,
  Gavel,
  GraduationCap,
  Globe2,
  Guitar,
  Hammer,
  HandHeart,
  HeartPulse,
  Landmark,
  LayoutDashboard,
  Languages,
  Leaf,
  Library,
  Laptop,
  Microscope,
  MoreHorizontal,
  Music2,
  Paintbrush,
  Palette as PaletteIcon,
  PenTool,
  Pipette,
  Plane,
  Plus,
  Power,
  Presentation,
  Puzzle,
  RotateCcw,
  ScrollText,
  Search,
  SearchX,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sprout,
  Stethoscope,
  Telescope,
  Theater,
  Trash2,
  UsersRound,
  FlaskConical,
  Wrench,
  X,
} from 'lucide-react'
import { SubjectResourcesPanel } from '../components/SubjectResourcesPanel'
import { SubjectReportsPanel } from '@/modules/reports/components/SubjectReportsPanel'
import { memo, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { BackIcon } from '@/components/ui/BackIcon'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'

import { useAuth } from '@/modules/auth/hooks/useAuth'
import { SectionForm } from '@/modules/courses/components/SectionForm'
import { SubjectAssignmentForm } from '@/modules/courses/components/SubjectAssignmentForm'
import { TeacherAssignmentForm } from '@/modules/courses/components/TeacherAssignmentForm'
import { CourseTeamsPanel } from '@/modules/courses/components/CourseTeamsPanel'
import { CourseStudentsPanel } from '@/modules/courses/components/CourseStudentsPanel'
import { getCourseTeams } from '@/modules/courses/services/coursesService'
import { getStudentsByCourse } from '@/modules/students/services/studentsService'
import type { CourseStudent } from '@/modules/students/types'
import type { CourseAdvancedFilters } from '@/modules/courses/components/CoursesAdvancedFiltersDrawer'
import { getStudentsBySection } from '@/modules/attendance/services/attendanceService'
import type { StudentAttendanceRow } from '@/modules/attendance/types'
import { SubjectAttendancePanel } from './SubjectAttendancePage'
import { getAcademicPeriods, getGradingWorkspace } from '@/modules/grading/services/gradingService'
import type { AcademicPeriodOpt, GradeRecordRow, GradingActivity, StudentGradeRow } from '@/modules/grading/types'
import { activityRubricConfiguration } from '@/modules/grading/components/GradingBook'
import {
  activityAppliesToBlock,
  buildCompactGradeRows,
  competencyBlocks,
  scoreForActivity,
  type CompactGradeRow,
} from '@/modules/grading/utils/competencyGrades'
import { getPlanningEntries } from '@/modules/planning/services/planningService'
import { JournalForm, journalEntryTypeLabel, type JournalCourseOption } from '@/modules/journal/pages/JournalPage'
import { deleteJournalEntry, getJournalEntries } from '@/modules/journal/services/journalService'
import type { JournalEntry } from '@/modules/journal/types'
import { useCourses } from '@/modules/courses/hooks/useCourses'
import type {
  CreateSubjectInput,
  GradeWithSections,
  CourseTeam,
  Section,
  SectionSubjectAssignment,
  Subject,
  TeacherAssignmentInput,
} from '@/modules/courses/types'
import {
  matchesCourseSearch,
  matchesCourseStateFilters,
  matchesSectionFilter,
} from '@/modules/courses/utils/courseFilterOptions'
import { buildSubjectAttendanceHref } from '@/modules/courses/utils/subjectNavigation'
import { cn } from '@/utils/cn'
import { getSubjectPalette as getSubjectColor, type SubjectPalette } from '@/utils/subjectPalette'
import { ProgressIndicator, StatusBadge } from '@/components/ui/SemanticUI'

type CourseCardItem = {
  id: string
  grade: GradeWithSections
  section: Section
  assignments: SectionSubjectAssignment[]
  assignment: SectionSubjectAssignment | null
  subjectName: string
  levelName: string
  cycleName: string
  archived: boolean
}

const levelStyles: Record<string, { color: string; soft: string }> = {
  'Primaria': { color: 'var(--primary)', soft: 'var(--primary-container)' },
  'Secundaria': { color: 'var(--primary)', soft: 'var(--primary-container)' },
}

const defaultLevelStyle = { color: 'var(--primary)', soft: 'var(--primary-container)' }

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
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    grades,
    catalogs,
    currentSchoolYear,
    loading,
    error,
    refetch,
    removeGrade,
    addSection,
    editSection,
    removeSection,
    addSubject,
    createTeacherAssignment,
    assignSubject,
    removeSubjectAssignment,
    restoreSubjectAssignment,
    customizeSubjectAssignment,
    permanentlyDeleteSubjectAssignment,
  } = useCourses()

  const canManage = hasRole(['admin', 'coordinator'])
  const canEnroll = hasRole(['admin', 'director', 'coordinator', 'teacher'])

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
    kind: 'grade' | 'section' | 'assignment' | 'empty-assignment' | 'permanent-assignment'
    id: string
    label: string
    relatedDataCount?: number
    studentCount?: number
  } | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    const syncHeaderSearch = (event: Event) => {
      setSearchQuery((event as CustomEvent<string>).detail ?? '')
    }
    window.addEventListener('courses:search', syncHeaderSearch)
    return () => window.removeEventListener('courses:search', syncHeaderSearch)
  }, [])
  const [levelFilter, setLevelFilter] = useState('all')
  const [showArchived, setShowArchived] = useState(false)
  const advancedFilters = useMemo(() => ({ ...defaultAdvancedFilters, showArchived }), [showArchived])
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(() => searchParams.get('courseId'))

  useEffect(() => {
    setSelectedCourseId(searchParams.get('courseId'))
  }, [searchParams])

  const setCourseWorkspace = useCallback((courseId: string | null, subjectId?: string | null) => {
    const next = new URLSearchParams(searchParams)
    if (courseId) next.set('courseId', courseId)
    else next.delete('courseId')
    if (courseId && subjectId) next.set('subjectId', subjectId)
    else next.delete('subjectId')
    setSearchParams(next)
    setSelectedCourseId(courseId)
  }, [searchParams, setSearchParams])

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

  function openCreateSectionFromActions() {
    const grade = grades.find((item) => item.status === 'active') ?? grades[0]
    if (grade) openCreateSection(grade)
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

  const handleDeleteConfirm = useCallback(async (confirmation?: string) => {
    if (!deleteTarget) return

    try {
      if (deleteTarget.kind === 'grade') {
        await removeGrade(deleteTarget.id)
      } else if (deleteTarget.kind === 'section') {
        await removeSection(deleteTarget.id)
      } else if (deleteTarget.kind === 'assignment') {
        await removeSubjectAssignment(deleteTarget.id)
      } else {
        await permanentlyDeleteSubjectAssignment(deleteTarget.id, confirmation)
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
  }, [deleteTarget, permanentlyDeleteSubjectAssignment, removeGrade, removeSection, removeSubjectAssignment])

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

  const handleOpen = useCallback((id: string) => setCourseWorkspace(id), [setCourseWorkspace])
  const handleAddSection = useCallback((grade: GradeWithSections) => openCreateSection(grade), [])
  const handleEditSection = useCallback((grade: GradeWithSections, sectionId: string) => openEditSection(grade, sectionId), [])
  const handleDeleteSection = useCallback((section: Section) =>
    setDeleteTarget({ kind: 'section', id: section.id, label: section.name }), [])
  const handleOpenAssignSubject = useCallback((grade: GradeWithSections, sectionId: string) => {
    if (!currentSchoolYear) {
      setActionError('Activa un ano escolar antes de asignar asignaturas.')
      return
    }
    openAssignSubject(grade, sectionId)
  }, [currentSchoolYear])
  const handleDeleteAssignment = useCallback((assignment: SectionSubjectAssignment) =>
    setDeleteTarget({ kind: 'assignment', id: assignment.id, label: assignment.subjectName }), [])
  const handleDeleteEmptyAssignment = useCallback((assignment: SectionSubjectAssignment, studentCount: number) =>
    setDeleteTarget({ kind: 'empty-assignment', id: assignment.id, label: assignment.subjectName, studentCount }), [])
  const handleDeleteArchivedAssignment = useCallback((assignment: SectionSubjectAssignment) =>
    setDeleteTarget({ kind: 'permanent-assignment', id: assignment.id, label: assignment.subjectName, relatedDataCount: assignment.relatedDataCount }), [])
  const handleRestoreAssignment = useCallback(async (assignment: SectionSubjectAssignment) => {
    try {
      await restoreSubjectAssignment(assignment.id)
      setActionError(null)
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'No se pudo restaurar la asignatura.')
    }
  }, [restoreSubjectAssignment])

  const courseCards = useMemo(() => buildCourseCards(grades), [grades])
  const activeCourseCards = useMemo(() => courseCards.filter((item) => !item.archived), [courseCards])
  const filterOptionCourseCards = advancedFilters.showArchived ? courseCards : activeCourseCards
  const appliedCourseFilters = useMemo<CourseAdvancedFilters>(() => ({
    ...advancedFilters,
    level: levelFilter,
  }), [advancedFilters, levelFilter])
  const filteredCourseCards = useMemo(
    () => applyCourseFilters(courseCards, appliedCourseFilters, debouncedSearch),
    [appliedCourseFilters, courseCards, debouncedSearch],
  )
  const levelFilters = useMemo(() => uniqueValues(filterOptionCourseCards.map((item) => item.levelName)), [filterOptionCourseCards])
  const groupedCourses = useMemo(() => groupCoursesByLevel(filteredCourseCards), [filteredCourseCards])
  const selectedCourse = useMemo(
    () => courseCards.find((item) => item.id === selectedCourseId) ?? null,
    [courseCards, selectedCourseId],
  )

  const totalStudents = useMemo(
    () => {
      const sections = new Map<string, number>()
      activeCourseCards.forEach((item) => sections.set(item.section.id, toSafeCount(item.section.studentCount)))
      return Array.from(sections.values()).reduce((sum, count) => sum + count, 0)
    },
    [activeCourseCards],
  )
  const totalAssignments = useMemo(
    () => activeCourseCards.reduce((total, item) => total + item.assignments.length, 0),
    [activeCourseCards],
  )
  const totalTeams = useMemo(
    () => activeCourseCards.reduce(
      (total, item) => total + item.assignments.reduce(
        (sum, assignment) => sum + toSafeCount(assignment.teamCount),
        0,
      ),
      0,
    ),
    [activeCourseCards],
  )

  return (
    <div className="w-full min-w-0 space-y-6">
      {selectedCourse ? (
        <CourseWorkspace
          item={selectedCourse}
          initialAssignmentId={searchParams.get('subjectId')}
          schoolYearName={currentSchoolYear?.name ?? ''}
          schoolYearId={currentSchoolYear?.id ?? null}
          canEnroll={canEnroll}
          canManage={canManage}
          onAssignSubject={handleOpenAssignSubject}
          onEditSection={handleEditSection}
          onArchiveSubject={handleDeleteAssignment}
          onDeleteEmptySubject={handleDeleteEmptyAssignment}
          onRestoreSubject={handleRestoreAssignment}
          onDeleteArchivedSubject={handleDeleteArchivedAssignment}
          onCustomizeSubject={customizeSubjectAssignment}
          onAssignmentChange={(assignmentId) => setCourseWorkspace(selectedCourse.id, assignmentId)}
          onStudentsBack={() => void refetch(false)}
          onBack={() => setCourseWorkspace(null)}
        />
      ) : (
        <>
          <section data-tour="manage-students" aria-labelledby="courses-summary-title" className="relative rounded-3xl bg-primary p-5 text-primary-foreground shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-card text-primary"><Library className="size-5" /></span>
                <div className="min-w-0">
                  <h1 id="courses-summary-title" className="text-2xl font-extrabold tracking-tight">Mis cursos</h1>
                  <p className="text-sm text-primary-foreground/90">Año escolar {currentSchoolYear?.name ?? 'sin configurar'}</p>
                </div>
              </div>
              {canManage ? (
                <details data-tour="create-course" className="group relative shrink-0">
                  <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-full bg-card px-4 text-sm font-bold text-primary transition hover:bg-card/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-card/50 [&::-webkit-details-marker]:hidden">
                    Acciones <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="absolute right-0 z-30 mt-2 w-52 rounded-2xl border border-border bg-card p-1.5 shadow-xl">
                    <button type="button" onClick={openCreateSectionFromActions} className="flex min-h-10 w-full items-center gap-2 rounded-xl px-3 text-left text-sm font-bold hover:bg-muted"><Plus className="size-4 text-primary" /> Nueva sección</button>
                    <button type="button" onClick={openCreateAssignmentFlow} className="flex min-h-10 w-full items-center gap-2 rounded-xl px-3 text-left text-sm font-bold hover:bg-muted"><Plus className="size-4 text-primary" /> Nuevo curso</button>
                  </div>
                </details>
              ) : null}
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4" aria-label="Resumen de cursos">
              {([
                [Library, activeCourseCards.length, 'Cursos'],
                [UsersRound, totalStudents, 'Estudiantes'],
                [BookOpen, totalAssignments, 'Asignaturas'],
                [UsersRound, totalTeams, 'Equipos'],
              ] as const).map(([Icon, value, label]) => (
                <div key={label} className="flex items-center gap-3 rounded-2xl bg-card/15 px-3 py-2.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-card/15"><Icon className="size-4" /></span>
                  <div><strong className="block text-lg font-extrabold leading-5 tabular-nums">{value}</strong><span className="text-xs text-primary-foreground/90">{label}</span></div>
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex max-w-full flex-wrap items-center gap-1 rounded-full border border-border bg-card p-1 shadow-sm" aria-label="Filtrar por nivel">
                {['all', ...levelFilters].map((level) => {
                  const count = level === 'all' ? activeCourseCards.length : activeCourseCards.filter((item) => item.levelName === level).length
                  return <button
                    key={level}
                    type="button"
                    aria-pressed={levelFilter === level}
                    className={cn('inline-flex min-h-9 items-center gap-2 rounded-full px-4 text-sm font-semibold transition', levelFilter === level ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}
                    onClick={() => setLevelFilter(level)}
                  >{level === 'all' ? 'Todos' : cleanLevelName(level)} <span className={cn('rounded-full px-1.5 py-0.5 text-[10px] tabular-nums', levelFilter === level ? 'bg-card/20' : 'bg-muted')}>{count}</span></button>
                })}
              </div>
              <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-4 text-sm text-muted-foreground shadow-sm">
                <input type="checkbox" checked={showArchived} onChange={(event) => setShowArchived(event.target.checked)} className="peer sr-only" />
                <span aria-hidden="true" className="relative h-5 w-9 rounded-full bg-muted transition peer-checked:bg-primary peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary after:absolute after:left-0.5 after:top-0.5 after:size-4 after:rounded-full after:bg-card after:shadow-sm after:transition-transform peer-checked:after:translate-x-4" />
                Mostrar archivados
              </label>
            </div>
            <label className="relative block w-full lg:w-72">
              <span className="sr-only">Buscar curso</span>
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input className="h-11 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" style={{ borderRadius: '9999px' }} placeholder="Buscar curso..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
            </label>
          </div>
          {!loading && !error && !currentSchoolYear ? (
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
            <div className="space-y-9">
              {groupedCourses.map((group) => (
                <section key={group.key}>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-full bg-primary/8 text-primary"><BookOpen className="size-4" /></span>
                    <h2 className="text-lg font-extrabold text-foreground">Nivel {cleanLevelName(group.levelName)}</h2>
                    <span className="rounded-full bg-primary/8 px-2.5 py-1 text-[11px] font-bold tabular-nums text-primary">
                      {group.items.length} cursos
                    </span>
                  </div>

                  <div className="space-y-6">
                    {groupCoursesByCycle(group.items).map((cycle) => (
                      <div key={cycle.name}>
                        <div className="mb-3 flex items-center gap-3">
                          <h3 className="text-sm font-semibold text-muted-foreground">{cycle.name}</h3>
                          <span className="text-xs text-muted-foreground">· {cycle.items.length} cursos</span>
                          <div className="h-px flex-1 bg-border" />
                        </div>
                        <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                          {cycle.items.map((item) => (
                            <CourseCard
                              key={item.id}
                              item={item}
                              canManage={canManage}
                              onOpen={handleOpen}
                              onAddSection={handleAddSection}
                              onEditSection={handleEditSection}
                              onDeleteSection={handleDeleteSection}
                              onAssignSubject={handleOpenAssignSubject}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
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
          schoolYearName={currentSchoolYear?.name}
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
          cycleName={sectionGrade.academicCycleName}
          schoolYearName={currentSchoolYear?.name}
          sections={sectionGrade.sections}
          section={editingSection ?? undefined}
          submitting={sectionSubmitting}
          error={sectionFormError}
          onSubmit={handleSectionSubmit}
          onClose={closeSectionForm}
        />
      ) : null}

      {deleteTarget?.kind === 'empty-assignment' ? (
        <EmptySubjectDeleteDialog
          subjectName={deleteTarget.label}
          studentCount={deleteTarget.studentCount ?? 0}
          onConfirm={() => handleDeleteConfirm()}
          onClose={() => setDeleteTarget(null)}
        />
      ) : deleteTarget?.kind === 'assignment' ? (
        <ArchiveSubjectDialog
          subjectName={deleteTarget.label}
          onConfirm={() => handleDeleteConfirm()}
          onClose={() => setDeleteTarget(null)}
        />
      ) : deleteTarget?.kind === 'permanent-assignment' && (deleteTarget.relatedDataCount ?? 0) > 0 ? (
        <PermanentSubjectDeleteDialog
          subjectName={deleteTarget.label}
          onConfirm={(confirmation) => handleDeleteConfirm(confirmation)}
          onClose={() => setDeleteTarget(null)}
        />
      ) : deleteTarget ? (
        <ConfirmDialog
          title={
            deleteTarget.kind === 'grade'
              ? 'Inactivar curso'
              : deleteTarget.kind === 'section'
                ? 'Inactivar seccion'
              : 'Eliminar asignatura definitivamente'
          }
          description={
            deleteTarget.kind === 'grade'
              ? `Inactivar el curso "${deleteTarget.label}"? Se conservara el historial relacionado.`
              : deleteTarget.kind === 'section'
                ? `Inactivar la seccion "${deleteTarget.label}"? Se conservara el historial relacionado.`
                : `¿Eliminar definitivamente "${deleteTarget.label}"? Esta acción no se puede deshacer.`
          }
          confirmLabel={deleteTarget.kind === 'permanent-assignment' ? 'Eliminar definitivamente' : 'Inactivar'}
          destructive
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      ) : null}
    </div>
  )
}

function CourseWorkspace({
  item,
  initialAssignmentId,
  schoolYearName,
  schoolYearId,
  canEnroll,
  canManage,
  onAssignSubject,
  onEditSection,
  onArchiveSubject,
  onDeleteEmptySubject,
  onRestoreSubject,
  onDeleteArchivedSubject,
  onCustomizeSubject,
  onAssignmentChange,
  onStudentsBack,
  onBack,
}: {
  item: CourseCardItem
  initialAssignmentId: string | null
  schoolYearName: string
  schoolYearId: string | null
  canEnroll: boolean
  canManage: boolean
  onAssignSubject: (grade: GradeWithSections, sectionId: string) => void
  onEditSection: (grade: GradeWithSections, sectionId: string) => void
  onArchiveSubject: (assignment: SectionSubjectAssignment) => void
  onDeleteEmptySubject: (assignment: SectionSubjectAssignment, studentCount: number) => void
  onRestoreSubject: (assignment: SectionSubjectAssignment) => void | Promise<void>
  onDeleteArchivedSubject: (assignment: SectionSubjectAssignment) => void
  onCustomizeSubject: (id: string, input: { color: string | null; icon: string | null }) => void | Promise<void>
  onAssignmentChange: (assignmentId: string | null) => void
  onStudentsBack: () => void
  onBack: () => void
}) {
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(initialAssignmentId)
  const [subjectInitialTab, setSubjectInitialTab] = useState('resumen')
  const [workspaceView, setWorkspaceView] = useState<'subjects' | 'archived' | 'students'>('subjects')
  const [studentAction, setStudentAction] = useState<'new' | 'import' | undefined>()
  const [appearanceTarget, setAppearanceTarget] = useState<SectionSubjectAssignment | null>(null)
  const selectedAssignment = item.assignments.find((assignment) => assignment.id === selectedAssignmentId) ?? null
  const archivedAssignments = item.section.assignments.filter((assignment) => assignment.status === 'inactive')

  useEffect(() => {
    setSelectedAssignmentId(
      initialAssignmentId && item.assignments.some((assignment) => assignment.id === initialAssignmentId)
        ? initialAssignmentId
        : null,
    )
  }, [initialAssignmentId, item.assignments, item.section.id])
  useEffect(() => {
    setWorkspaceView('subjects')
    setSubjectInitialTab('resumen')
  }, [item.section.id, schoolYearId])

  const [subjectCategory, setSubjectCategory] = useState('Todas')
  const [subjectSearch, setSubjectSearch] = useState('')
  const navigate = useNavigate()
  const courseAverages = item.assignments.map((assignment) => assignment.averageScore).filter((score): score is number => score !== null)
  const courseAverage = courseAverages.length ? Math.round(courseAverages.reduce((sum, score) => sum + score, 0) / courseAverages.length) : null
  const visibleAssignments = item.assignments.filter((assignment) =>
    (subjectCategory === 'Todas' || getSubjectCategory(assignment.subjectName) === subjectCategory)
    && normalizeText(assignment.subjectName).includes(normalizeText(subjectSearch)),
  )
  const visibleArchivedAssignments = archivedAssignments.filter((assignment) =>
    (subjectCategory === 'Todas' || getSubjectCategory(assignment.subjectName) === subjectCategory)
    && normalizeText(assignment.subjectName).includes(normalizeText(subjectSearch)),
  )

  function openAssignment(assignment: SectionSubjectAssignment, tab = 'resumen') {
    setSubjectInitialTab(tab)
    setSelectedAssignmentId(assignment.id)
    onAssignmentChange(assignment.id)
  }
  if (selectedAssignment) {
    return (
      <SubjectDetailView
        item={{ ...item, assignment: selectedAssignment, subjectName: selectedAssignment.subjectName }}
        schoolYearName={schoolYearName}
        schoolYearId={schoolYearId}
        canEnroll={canEnroll}
        initialTab={subjectInitialTab}
        backLabel="Asignaturas del curso"
        onBack={() => { setSelectedAssignmentId(null); onAssignmentChange(null) }}
      />
    )
  }

  if (workspaceView === 'students') {
    return <CourseStudentsPanel courseId={item.section.id} courseName={`${item.grade.name} ${item.section.name}`} canEnroll={canEnroll} canManage={canManage} initialAction={studentAction} onBack={() => { setStudentAction(undefined); setWorkspaceView('subjects'); onStudentsBack() }} />
  }

  return (
    <div className="course-workspace-shell course-overview-workspace w-full min-w-0 space-y-3 lg:-mt-8">
      <button type="button" onClick={onBack} className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft className="size-4" /> Mis cursos
      </button>

      <header className="rounded-3xl bg-primary p-5 text-primary-foreground shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-5">
            <span className="grid size-20 shrink-0 place-items-center rounded-3xl bg-card text-2xl font-extrabold text-primary shadow-sm">{getCourseCompactLabel(item.grade.name, item.section.name)}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-3"><h1 className="text-3xl font-extrabold">{item.grade.name} {item.section.name}</h1><span className="rounded-full bg-card/15 px-2.5 py-1 text-[10px] font-bold uppercase">{item.archived ? 'Archivado' : '● Activo'}</span></div>
              <p className="mt-1 text-sm text-primary-foreground/90">{cleanLevelName(item.levelName)} · {item.cycleName}{schoolYearName ? ` · Año escolar ${schoolYearName}` : ''}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {canManage ? <button type="button" onClick={() => onEditSection(item.grade, item.section.id)} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-card/15 px-4 text-sm font-semibold hover:bg-card/25"><Edit3 className="size-4" /> Editar</button> : null}
            {canEnroll ? <button type="button" onClick={() => { setStudentAction('new'); setWorkspaceView('students') }} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-card px-4 text-sm font-semibold text-primary hover:bg-card/90"><Plus className="size-4" /> Agregar estudiantes</button> : null}
          </div>
        </div>
        <div className="mt-6 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {([
            [UsersRound, item.section.studentCount ?? 0, 'Estudiantes', ''],
            [BookOpen, item.assignments.length, 'Asignaturas', archivedAssignments.length ? ` · ${archivedAssignments.length} archivada${archivedAssignments.length === 1 ? '' : 's'}` : ''],
            [CalendarCheck2, '—', 'Asistencia', ''],
            [ChartColumn, courseAverage ?? '—', 'Promedio', ''],
          ] as const).map(([Icon, value, label, detail]) => (
            <div key={label} className="flex min-w-0 items-center gap-3 rounded-2xl bg-card/15 px-3 py-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-card/15"><Icon className="size-4" /></span>
              <div><strong className="block text-lg font-extrabold leading-5 tabular-nums">{value}</strong><span className="text-xs text-primary-foreground/90">{label}{detail}</span></div>
            </div>
          ))}
        </div>
      </header>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-primary/8 text-primary"><BookOpen className="size-5" /></span>
              <div><h2 className="text-lg font-extrabold text-foreground">Asignaturas</h2><p className="text-xs text-muted-foreground">Selecciona una asignatura para entrar a su espacio académico.</p></div>
            </div>
            <div className="inline-flex items-center rounded-full border border-border bg-card p-1 shadow-sm">
              {([['subjects', 'Activas', item.assignments.length], ['archived', 'Archivadas', archivedAssignments.length]] as const).map(([view, label, count]) => (
                <button key={view} type="button" aria-pressed={workspaceView === view} onClick={() => setWorkspaceView(view)} className={cn('min-h-8 rounded-full px-3 text-xs font-semibold', workspaceView === view ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}>{label} <span className="ml-1 rounded-full bg-card/20 px-1.5">{count}</span></button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {['Todas', 'Ciencias', 'Ciencias exactas', 'Lenguas', 'Humanidades', 'Artes', 'Salud', 'Optativa'].map((category) => (
                <button key={category} type="button" aria-pressed={subjectCategory === category} onClick={() => setSubjectCategory(category)} className={cn('min-h-8 rounded-full border px-3 text-xs font-medium shadow-sm', subjectCategory === category ? 'border-foreground bg-foreground text-card' : 'border-border bg-card text-muted-foreground hover:text-foreground')}>{category}</button>
              ))}
            </div>
            <label className="relative block w-full sm:w-60">
              <span className="sr-only">Buscar asignatura</span><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input value={subjectSearch} onChange={(event) => setSubjectSearch(event.target.value)} placeholder="Buscar asignatura..." className="h-10 w-full border border-border bg-card pl-9 pr-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" style={{ borderRadius: '9999px' }} />
            </label>
          </div>

          {workspaceView === 'archived' ? (
            visibleArchivedAssignments.length ? (
              <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                {visibleArchivedAssignments.map((assignment) => <ArchivedSubjectCard key={assignment.id} assignment={assignment} onRestore={() => void onRestoreSubject(assignment)} onDelete={() => onDeleteArchivedSubject(assignment)} />)}
              </div>
            ) : <EmptyState title={archivedAssignments.length ? 'No hay asignaturas para este filtro' : 'No hay asignaturas archivadas'} description={archivedAssignments.length ? 'Prueba con otra categoría o búsqueda.' : 'Las asignaturas que archives aparecerán aquí.'} />
          ) : (
            <div className="grid items-stretch gap-4 sm:grid-cols-2 2xl:grid-cols-3">
              {visibleAssignments.map((assignment) => (
                <CourseSubjectCard key={assignment.id} assignment={assignment} studentCount={item.section.studentCount ?? 0} canManage={canManage}
                  onOpen={(tab) => openAssignment(assignment, tab)}
                  onArchive={() => onArchiveSubject(assignment)}
                  onCustomize={() => setAppearanceTarget(assignment)}
                  onDelete={() => onDeleteEmptySubject(assignment, item.section.studentCount ?? 0)}
                />
              ))}
              {canManage && subjectCategory === 'Todas' && !subjectSearch ? (
                <button type="button" onClick={() => onAssignSubject(item.grade, item.section.id)} className="flex min-h-60 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-primary/20 p-6 text-center hover:border-primary/40 hover:bg-primary/[0.03]">
                  <span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground"><Plus className="size-5" /></span>
                  <strong className="mt-3 text-sm text-foreground">Agregar asignatura</strong>
                  <span className="mt-1 max-w-48 text-xs text-muted-foreground">Añade una nueva asignatura para organizar su contenido.</span>
                </button>
              ) : null}
              {!visibleAssignments.length ? <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">No hay asignaturas para este filtro.</div> : null}
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <CourseStudentsSidebar courseId={item.section.id} courseName={`${item.grade.name} ${item.section.name}`} onView={() => { setStudentAction(undefined); setWorkspaceView('students') }} onAdd={() => { setStudentAction('new'); setWorkspaceView('students') }} canEnroll={canEnroll} />
          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Acciones rápidas</h2>
            <div className="mt-4 space-y-1">
              {([
                [CalendarCheck2, 'Pasar asistencia', 'Registro del día', 'asistencia'],
                [ClipboardList, 'Nueva actividad', 'Para todo el curso', 'actividades'],
                [ChartColumn, 'Reporte del curso', 'Calificaciones y asistencia', 'reportes'],
              ] as const).map(([Icon, label, description, tab]) => (
                <button key={label} type="button" onClick={() => tab === 'reportes' ? navigate('/reportes') : item.assignments[0] && openAssignment(item.assignments[0], tab)} className="flex min-h-12 w-full items-center gap-3 rounded-xl px-2 text-left hover:bg-muted">
                  <span className={cn('grid size-9 shrink-0 place-items-center rounded-full text-white', tab === 'asistencia' ? 'bg-success' : tab === 'actividades' ? 'bg-warning' : '')} style={tab === 'reportes' ? { backgroundColor: 'var(--palette-violet)' } : undefined}><Icon className="size-4" /></span>
                  <span className="min-w-0 flex-1"><strong className="block text-sm font-medium text-foreground">{label}</strong><span className="block text-[11px] text-muted-foreground">{description}</span></span><ChevronRight className="size-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>

      {appearanceTarget ? <SubjectAppearanceDialog assignment={appearanceTarget} onSave={(input) => onCustomizeSubject(appearanceTarget.id, input)} onClose={() => setAppearanceTarget(null)} /> : null}
    </div>
  )
}

function CourseStudentsSidebar({ courseId, courseName, canEnroll, onView, onAdd }: { courseId: string; courseName: string; canEnroll: boolean; onView: () => void; onAdd: () => void }) {
  const [students, setStudents] = useState<CourseStudent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    getStudentsByCourse(courseId).then((rows) => { if (active) setStudents(rows) }).catch(() => { if (active) setStudents([]) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [courseId])

  return <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
    <div className="flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-success/15 text-success"><UsersRound className="size-5" /></span><div className="min-w-0"><h2 className="text-base font-semibold text-foreground">Estudiantes</h2><p className="text-xs leading-4 text-muted-foreground">{students.length} comparten todas las asignaturas de {courseName}</p></div></div>
    <div className="mt-4 flex h-9 items-center rounded-full bg-muted/70 p-1 text-xs"><span className="flex-1 rounded-full bg-card px-3 py-1 text-center font-medium text-foreground shadow-sm">Todos <strong className="ml-1 rounded bg-primary/10 px-1 text-[10px] font-semibold text-primary">{students.length}</strong></span><span className="flex-1 px-3 py-1 text-center font-medium text-muted-foreground">Atención <span className="ml-1 rounded bg-card px-1 text-[10px]">—</span></span></div>
    <div className="mt-3 space-y-1">{loading ? <p className="py-6 text-center text-xs text-muted-foreground">Cargando estudiantes...</p> : students.slice(0, 5).map((student, index) => <button key={student.id} type="button" onClick={onView} className="flex min-h-14 w-full items-center gap-3 rounded-xl px-1.5 py-1 text-left hover:bg-muted"><span className={cn('grid size-9 shrink-0 place-items-center rounded-full text-[11px] font-semibold', index % 3 === 0 ? 'bg-primary/10 text-primary' : index % 3 === 1 ? 'bg-success/15 text-success' : 'bg-warning/20 text-warning-foreground')}>{student.firstName[0]}{student.lastName[0]}</span><span className="min-w-0 flex-1"><strong className="block truncate text-sm font-medium text-foreground">{student.fullName}</strong><span className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground"><span className="h-1 w-14 rounded-full bg-muted" />Sin registro</span></span><span className="shrink-0 text-right"><strong className="block text-sm font-semibold text-foreground">—</strong><span className="block text-[10px] text-muted-foreground">prom.</span></span></button>)}</div>
    {!loading && !students.length ? <p className="py-5 text-center text-xs text-muted-foreground">Todavía no hay estudiantes.</p> : null}
    <div className="mt-4 flex gap-2 border-t border-border pt-4">{canEnroll ? <button type="button" onClick={onAdd} className="min-h-9 flex-1 rounded-full bg-muted/70 px-3 text-xs font-medium text-foreground hover:bg-muted"><Plus className="mr-1 inline size-3.5 text-muted-foreground" />Agregar</button> : null}<button type="button" onClick={onView} className="min-h-9 flex-1 rounded-full bg-primary/10 px-3 text-xs font-medium text-primary hover:bg-primary/15">Ver todos <ArrowRight className="ml-1 inline size-3.5" /></button></div>
  </section>
}
const subjectCategories = [
  { name: 'Ciencias exactas', terms: ['matematica', 'algebra', 'geometria'] },
  { name: 'Salud', terms: ['educacion fisica', 'deporte', 'salud'] },
  { name: 'Ciencias', terms: ['ciencias de la naturaleza', 'biologia', 'quimica', 'fisica'] },
  { name: 'Lenguas', terms: ['lengua', 'idioma', 'ingles', 'frances'] },
  { name: 'Humanidades', terms: ['sociales', 'historia', 'formacion integral', 'religiosa'] },
  { name: 'Artes', terms: ['artistica', 'arte', 'musica'] },
  { name: 'Optativa', terms: ['optativa'] },
]

function getSubjectCategory(name: string) {
  const normalized = normalizeText(name)
  if (normalized.includes('optativa')) return 'Optativa'
  return subjectCategories.find((category) => category.terms.some((term) => normalized.includes(term)))?.name ?? 'Otras'
}

export function CourseSubjectCard({ assignment, studentCount, canManage, onOpen, onCustomize, onArchive, onDelete }: { assignment: SectionSubjectAssignment; studentCount: number; canManage: boolean; onOpen: (tab: string) => void; onCustomize: () => void; onArchive: () => void; onDelete: () => void }) {
  const category = getSubjectCategory(assignment.subjectName)
  const color = getAssignmentPalette(assignment).color
  const average = assignment.averageScore === null ? null : Math.max(0, Math.min(100, assignment.averageScore))
  const teacher = assignment.teacherName ?? 'Sin docente asignado'
  const initials = teacher.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toLocaleUpperCase('es')

  function openAssignmentFromKeyboard(event: React.KeyboardEvent<HTMLElement>) {
    if (event.target !== event.currentTarget || (event.key !== 'Enter' && event.key !== ' ')) return
    event.preventDefault()
    onOpen('resumen')
  }

  return (
    <article role="link" tabIndex={0} aria-label={`Entrar a la asignatura ${assignment.subjectName}`}
      onClick={() => onOpen('resumen')} onKeyDown={openAssignmentFromKeyboard}
      className="course-subject-card group relative flex min-h-[17rem] cursor-pointer flex-col rounded-3xl border bg-card p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-full text-card shadow-sm [&>svg]:size-5" style={{ backgroundColor: color }}>{getSubjectIcon(assignment.subjectName, assignment.appearanceIcon)}</span>
        <div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{category}</p><h3 className="mt-0.5 line-clamp-2 text-sm font-extrabold leading-5 text-foreground">{assignment.subjectName}</h3></div>
        {canManage ? <AssignmentActionsMenu label={assignment.subjectName} items={[
          { label: 'Personalizar apariencia', icon: <Paintbrush className="size-4" />, tone: 'primary', onSelect: onCustomize },
          { label: 'Archivar asignatura', icon: <Archive className="size-4" />, tone: 'archive', onSelect: onArchive },
          ...(assignment.canDelete ? [{ label: 'Eliminar asignatura', icon: <Trash2 className="size-4" />, tone: 'danger' as const, onSelect: onDelete }] : []),
        ]} /> : null}
      </div>
      <div className="mt-5 flex min-w-0 items-center gap-2 text-xs text-muted-foreground"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">{initials}</span><span className="truncate">{teacher}</span></div>
      <div className="mt-4 grid grid-cols-3 divide-x divide-border rounded-3xl bg-muted/70 py-2.5 text-center">
        {([[UsersRound, studentCount, 'Estudiantes'], [ClipboardList, assignment.activityCount ?? 0, 'Actividades'], [UsersRound, assignment.teamCount ?? 0, 'Equipos']] as const).map(([Icon, value, label]) => <span key={label} className="flex flex-col items-center px-1"><span className="flex items-center gap-1 text-xs text-foreground"><Icon className="size-3.5 text-muted-foreground" /><strong>{value}</strong></span><small className="mt-0.5 text-[10px] text-muted-foreground">{label}</small></span>)}
      </div>
      <div className="mt-auto flex items-center gap-3 pt-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-full p-1 text-xs font-bold text-foreground" style={{ background: `conic-gradient(${color} ${average ?? 0}%, var(--muted) 0)` }}><span className="grid size-full place-items-center rounded-full bg-card">{average === null ? '—' : Math.round(average)}</span></span>
        <span className="min-w-0 flex-1"><strong className="block text-xs text-foreground">{average === null ? 'Sin calificaciones' : average >= 85 ? 'Excelente' : average >= 70 ? 'En progreso' : 'Requiere atención'}</strong><span className="text-[11px] text-muted-foreground">{assignment.lastAttendanceDate ? `Asistencia: ${formatRelativeAttendance(assignment.lastAttendanceDate)}` : 'Sin registro de asistencia'}</span></span>
        <button type="button" onClick={(event) => { event.stopPropagation(); onOpen('resumen') }} aria-label={`Abrir ${assignment.subjectName}`} className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary hover:bg-primary/15"><ChevronRight className="size-4" /></button>
      </div>
    </article>
  )
}
function ArchivedSubjectCard({ assignment, onRestore, onDelete }: { assignment: SectionSubjectAssignment; onRestore: () => void; onDelete: () => void }) {
  const palette = getAssignmentPalette(assignment)
  return (
    <article className="relative overflow-visible rounded-2xl bg-card shadow-sm">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl text-white opacity-80" style={{ backgroundColor: palette.color }}>{getSubjectIcon(assignment.subjectName, assignment.appearanceIcon)}</span>
          <div className="flex items-center gap-1">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold uppercase text-slate-600">Archivada</span>
            <AssignmentActionsMenu
              label={assignment.subjectName}
              items={[
                { label: 'Restaurar asignatura', icon: <ArchiveRestore className="size-4" />, tone: 'primary', onSelect: onRestore },
                { label: 'Eliminar permanentemente', icon: <Trash2 className="size-4" />, tone: 'danger', onSelect: onDelete },
              ]}
            />
          </div>
        </div>
        <h3 className="mt-4 text-base font-extrabold text-foreground">{assignment.subjectName}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{assignment.teacherName ?? 'Sin docente asignado'}</p>
        <p className="mt-4 text-[11px] text-muted-foreground">Toda su información académica permanece conservada.</p>
      </div>
    </article>
  )
}

type AssignmentMenuItem = {
  label: string
  icon: ReactNode
  tone: 'primary' | 'archive' | 'danger'
  onSelect: () => void
}

function AssignmentActionsMenu({ label, items }: { label: string; items: AssignmentMenuItem[] }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])

  const close = useCallback((restoreFocus = false) => {
    setOpen(false)
    if (restoreFocus) window.setTimeout(() => triggerRef.current?.focus(), 0)
  }, [])

  useEffect(() => {
    if (!open) return
    window.setTimeout(() => itemRefs.current[0]?.focus(), 0)
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close()
    }
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close(true)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onEscape)
    }
  }, [close, open])

  function handleMenuKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? items.length - 1
        : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length
    itemRefs.current[nextIndex]?.focus()
  }

  return (
    <div ref={rootRef} className="relative" onClick={(event) => event.stopPropagation()}>
      <button ref={triggerRef} type="button" aria-label={`Más opciones de ${label}`} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"><MoreHorizontal className="size-4" /></button>
      {open ? (
        <div role="menu" aria-label={`Opciones de ${label}`} className="absolute right-0 top-9 z-30 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          {items.map((item, index) => (
            <div key={item.label} className={cn(index > 0 && 'border-t border-slate-100 pt-1 mt-1')}>
              <button
                ref={(node) => { itemRefs.current[index] = node }}
                role="menuitem"
                type="button"
                onKeyDown={(event) => handleMenuKeyDown(event, index)}
                onClick={() => { close(); item.onSelect() }}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset',
                  item.tone === 'primary' && 'text-primary hover:bg-primary/7 focus-visible:ring-primary/30',
                  item.tone === 'archive' && 'text-amber-700 hover:bg-amber-50 focus-visible:ring-amber-300',
                  item.tone === 'danger' && 'text-destructive hover:bg-destructive/5 focus-visible:ring-destructive/25',
                )}
              >
                {item.icon}<span>{item.label}</span>
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

const SUBJECT_APPEARANCE_COLORS = [
  '#1E40AF', '#2563EB', '#0369A1', '#0891B2', '#0F766E', '#059669',
  '#15803D', '#4D7C0F', '#A16207', '#D97706', '#EA580C', '#DC2626',
  '#BE123C', '#DB2777', '#C026D3', '#9333EA', '#7C3AED', '#4F46E5',
  '#3730A3', '#334155', '#475569', '#374151', '#1F2937', '#111827',
]
type SubjectIconOption = { value: string; label: string; keywords: string }
type SubjectIconCategory = { id: string; label: string; description: string; icons: SubjectIconOption[] }

const CURRICULAR_SUBJECT_ICONS: SubjectIconOption[] = [
  { value: 'book', label: 'Lengua', keywords: 'español literatura comunicación lectura escritura' },
  { value: 'calculator', label: 'Matemática', keywords: 'álgebra geometría cálculo estadística' },
  { value: 'landmark', label: 'Sociales', keywords: 'historia geografía ciudadanía sociedad' },
  { value: 'leaf', label: 'Naturaleza', keywords: 'ciencias naturaleza ecología ambiente' },
  { value: 'dna', label: 'Biología', keywords: 'biología genética vida anatomía' },
  { value: 'flask', label: 'Química', keywords: 'química laboratorio experimentos' },
  { value: 'atom', label: 'Física', keywords: 'física energía mecánica electricidad' },
  { value: 'hand-heart', label: 'Formación', keywords: 'religión ética humana valores integral' },
  { value: 'dumbbell', label: 'Ed. Física', keywords: 'deporte educación física movimiento' },
  { value: 'languages', label: 'Idiomas', keywords: 'inglés francés lenguas extranjeras' },
  { value: 'palette', label: 'Artística', keywords: 'arte plástica expresión artística' },
  { value: 'laptop', label: 'Informática', keywords: 'informática tecnología computación tic' },
  { value: 'baby', label: 'Nivel inicial', keywords: 'inicial infancia desarrollo temprano' },
  { value: 'brain', label: 'Pensamiento', keywords: 'lógico creativo crítico razonamiento' },
  { value: 'footprints', label: 'Psicomotricidad', keywords: 'motricidad cuerpo coordinación' },
  { value: 'music', label: 'Música', keywords: 'música canto ritmo sonido' },
]

const SUBJECT_ICON_BANK: SubjectIconCategory[] = [
  {
    id: 'stem', label: 'Ciencia, tecnología e innovación', description: 'STEM, programación, robótica y ciencias aplicadas', icons: [
      { value: 'microscope', label: 'Microscopio', keywords: 'microbiología laboratorio investigación' },
      { value: 'telescope', label: 'Astronomía', keywords: 'astronomía espacio universo' },
      { value: 'code', label: 'Programación', keywords: 'software código desarrollo web' },
      { value: 'binary', label: 'Computación', keywords: 'datos binario sistemas computacionales' },
      { value: 'bot', label: 'Robótica', keywords: 'robot inteligencia artificial automatización' },
      { value: 'chart', label: 'Estadística', keywords: 'econometría análisis datos gráficos' },
      { value: 'earth', label: 'Geociencias', keywords: 'geología planeta tierra clima' },
      { value: 'sprout', label: 'Agronomía', keywords: 'agricultura botánica cultivos sostenibilidad' },
    ],
  },
  {
    id: 'humanities', label: 'Humanidades y ciencias sociales', description: 'Filosofía, derecho, economía y comunicación', icons: [
      { value: 'book-marked', label: 'Literatura', keywords: 'literatura lectura clásicos escritura' },
      { value: 'scroll-text', label: 'Filosofía', keywords: 'filosofía pensamiento humanidades' },
      { value: 'gavel', label: 'Derecho', keywords: 'leyes justicia civismo' },
      { value: 'building', label: 'Arquitectura', keywords: 'arquitectura urbanismo construcción' },
      { value: 'briefcase', label: 'Negocios', keywords: 'economía emprendimiento administración finanzas' },
      { value: 'presentation', label: 'Comunicación', keywords: 'oratoria debate comunicación medios' },
      { value: 'pen-tool', label: 'Escritura', keywords: 'escritura creativa periodismo redacción' },
      { value: 'shield-check', label: 'Ciudadanía', keywords: 'ciudadanía seguridad civismo convivencia' },
    ],
  },
  {
    id: 'arts', label: 'Arte, diseño y medios', description: 'Artes escénicas, audiovisuales y diseño creativo', icons: [
      { value: 'theater', label: 'Teatro', keywords: 'teatro actuación drama artes escénicas' },
      { value: 'guitar', label: 'Instrumentos', keywords: 'guitarra instrumentos música' },
      { value: 'camera', label: 'Fotografía', keywords: 'fotografía cine audiovisual' },
      { value: 'palette', label: 'Diseño', keywords: 'diseño pintura ilustración color' },
      { value: 'music', label: 'Producción musical', keywords: 'música audio producción sonido' },
    ],
  },
  {
    id: 'health', label: 'Salud y bienestar', description: 'Medicina, enfermería, actividad física y cuidado', icons: [
      { value: 'stethoscope', label: 'Medicina', keywords: 'medicina salud clínica' },
      { value: 'cross', label: 'Enfermería', keywords: 'enfermería primeros auxilios salud' },
      { value: 'heart-pulse', label: 'Bienestar', keywords: 'bienestar nutrición salud emocional' },
      { value: 'dumbbell', label: 'Entrenamiento', keywords: 'fitness deporte entrenamiento' },
    ],
  },
  {
    id: 'technical', label: 'Técnica, oficios y formación profesional', description: 'Ingeniería, gastronomía, aviación y talleres', icons: [
      { value: 'wrench', label: 'Ingeniería', keywords: 'ingeniería mecánica mantenimiento' },
      { value: 'hammer', label: 'Taller', keywords: 'carpintería construcción oficios' },
      { value: 'cooking-pot', label: 'Gastronomía', keywords: 'cocina gastronomía alimentos hotelería' },
      { value: 'plane', label: 'Aviación', keywords: 'aviación aeronáutica turismo viajes' },
      { value: 'briefcase', label: 'Emprendimiento', keywords: 'negocios empresa comercio' },
    ],
  },
  {
    id: 'development', label: 'Desarrollo personal y aprendizaje', description: 'Educación especial, habilidades y desarrollo integral', icons: [
      { value: 'puzzle', label: 'Educación especial', keywords: 'inclusión educación especial neurodiversidad' },
      { value: 'brain', label: 'Psicología', keywords: 'psicología neurociencia aprendizaje' },
      { value: 'hand-heart', label: 'Valores', keywords: 'ética valores orientación tutoría' },
      { value: 'baby', label: 'Primera infancia', keywords: 'infancia preescolar estimulación' },
      { value: 'footprints', label: 'Desarrollo motor', keywords: 'motricidad coordinación movimiento' },
    ],
  },
]

export function SubjectAppearanceDialog({ assignment, onSave, onClose }: { assignment: SectionSubjectAssignment; onSave: (input: { color: string | null; icon: string | null }) => void | Promise<void>; onClose: () => void }) {
  const [color, setColor] = useState<string | null>(assignment.appearanceColor)
  const defaultColor = getSubjectColor(assignment.subjectName).color
  const [hexColor, setHexColor] = useState(assignment.appearanceColor ?? defaultColor)
  const [icon, setIcon] = useState<string | null>(assignment.appearanceIcon)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [iconBankOpen, setIconBankOpen] = useState(false)
  const [expandedIconCategory, setExpandedIconCategory] = useState<string | null>(null)
  const [iconQuery, setIconQuery] = useState('')
  const previewPalette = color ? { color, soft: `${color}14` } : getSubjectColor(assignment.subjectName)
  const normalizedIconQuery = normalizeText(iconQuery)
  const bankIconCount = SUBJECT_ICON_BANK.reduce((total, category) => total + category.icons.length, 0)
  const filteredBankIcons = SUBJECT_ICON_BANK.flatMap((category) => category.icons).filter((option) => normalizeText(`${option.label} ${option.keywords}`).includes(normalizedIconQuery))

  function selectColor(nextColor: string) {
    const normalizedColor = nextColor.toUpperCase()
    setColor(normalizedColor)
    setHexColor(normalizedColor)
  }

  function updateHexColor(nextValue: string) {
    const normalizedValue = nextValue.toUpperCase()
    setHexColor(normalizedValue)
    if (/^#[0-9A-F]{6}$/.test(normalizedValue)) setColor(normalizedValue)
  }

  async function save() {
    setSaving(true)
    setError(null)
    try {
      await onSave({ color, icon })
      onClose()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'No se pudo guardar la apariencia.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title="Personalizar apariencia" description="Cambia únicamente el aspecto visual de esta asignatura." onClose={onClose} className="max-w-2xl" contentClassName="overflow-x-hidden">
      <div className="space-y-6 p-5">
        <div className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-sm">
          <span className="flex size-11 items-center justify-center rounded-xl text-white" style={{ backgroundColor: previewPalette.color }}>{getSubjectIcon(assignment.subjectName, icon)}</span>
          <div><p className="font-extrabold text-foreground">{assignment.subjectName}</p><p className="text-xs text-muted-foreground">Vista previa de la tarjeta</p></div>
        </div>

        <fieldset>
          <legend className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Color principal</legend>
          <p className="mt-1 text-xs text-muted-foreground">Elige un tono rápido o crea uno con el selector completo.</p>
          <div className="mt-3 grid grid-cols-8 gap-2 sm:grid-cols-12">
            {SUBJECT_APPEARANCE_COLORS.map((option) => (
              <button key={option} type="button" title={option} aria-label={`Usar color ${option}`} aria-pressed={color === option} onClick={() => selectColor(option)} className={cn('aspect-square w-full rounded-full border-2 border-white shadow-sm ring-2 transition hover:scale-105', color === option ? 'ring-primary' : 'ring-slate-200')} style={{ backgroundColor: option }} />
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 sm:flex-row sm:items-center">
            <label className="group relative flex h-12 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 shadow-sm transition hover:border-primary/30">
              <span className="size-8 shrink-0 rounded-lg border border-black/10 shadow-inner" style={{ backgroundColor: /^#[0-9A-F]{6}$/.test(hexColor) ? hexColor : defaultColor }} />
              <span className="min-w-0"><span className="flex items-center gap-1.5 text-xs font-extrabold text-foreground"><Pipette className="size-3.5 text-primary" /> Selector completo</span><span className="block text-[10px] text-muted-foreground">Abre el espectro de colores</span></span>
              <input type="color" value={/^#[0-9A-F]{6}$/.test(hexColor) ? hexColor : defaultColor} onChange={(event) => selectColor(event.target.value)} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Abrir selector completo de color" />
            </label>
            <div className="min-w-0 flex-1">
              <label htmlFor="subject-custom-color" className="mb-1 block text-[10px] font-extrabold uppercase tracking-wide text-slate-500">Código hexadecimal</label>
              <Input id="subject-custom-color" value={hexColor} onChange={(event) => updateHexColor(event.target.value)} maxLength={7} spellCheck={false} className={cn('h-10 bg-white px-3 font-mono text-sm uppercase', !/^#[0-9A-F]{6}$/.test(hexColor) && 'border-amber-400 focus:border-amber-500')} aria-invalid={!/^#[0-9A-F]{6}$/.test(hexColor)} />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Icono</legend>
          <p className="mt-1 text-xs text-muted-foreground">Asignaturas del currículo dominicano</p>
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8">
            {CURRICULAR_SUBJECT_ICONS.map((option) => (
              <SubjectIconOptionButton key={option.value} option={option} selected={icon === option.value} onSelect={() => setIcon(option.value)} />
            ))}
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-primary/15 bg-primary/[0.02]">
            <button type="button" aria-expanded={iconBankOpen} onClick={() => setIconBankOpen((value) => !value)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-primary/[0.04]">
              <span className="flex min-w-0 items-center gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary"><Library className="size-4" /></span><span className="min-w-0"><span className="block text-sm font-extrabold text-foreground">Banco de iconos por áreas</span><span className="block truncate text-xs text-muted-foreground">{bankIconCount} opciones para asignaturas internacionales y especializadas</span></span></span>
              <ChevronDown className={cn('size-4 shrink-0 text-primary transition-transform', iconBankOpen && 'rotate-180')} />
            </button>

            {iconBankOpen ? (
              <div className="border-t border-primary/10 bg-white p-3">
                <div className="relative mb-3"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="h-10 pl-9" value={iconQuery} onChange={(event) => setIconQuery(event.target.value)} placeholder="Buscar: robótica, derecho, medicina..." /></div>
                <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                  {normalizedIconQuery ? (
                    filteredBankIcons.length ? <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">{filteredBankIcons.map((option) => <SubjectIconOptionButton key={`${option.value}-${option.label}`} option={option} selected={icon === option.value} onSelect={() => setIcon(option.value)} />)}</div> : <p className="rounded-lg bg-slate-50 px-4 py-6 text-center text-xs text-muted-foreground">No encontramos iconos relacionados con “{iconQuery}”.</p>
                  ) : SUBJECT_ICON_BANK.map((category) => {
                    const open = expandedIconCategory === category.id
                    return (
                      <div key={category.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <button type="button" aria-expanded={open} onClick={() => setExpandedIconCategory(open ? null : category.id)} className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-slate-50"><span><span className="block text-xs font-extrabold text-foreground">{category.label}</span><span className="block text-[10px] text-muted-foreground">{category.description} · {category.icons.length} iconos</span></span><ChevronDown className={cn('size-4 shrink-0 text-slate-500 transition-transform', open && 'rotate-180')} /></button>
                        {open ? <div className="grid grid-cols-4 gap-2 border-t border-slate-100 bg-slate-50/50 p-3 sm:grid-cols-6">{category.icons.map((option) => <SubjectIconOptionButton key={option.value} option={option} selected={icon === option.value} onSelect={() => setIcon(option.value)} />)}</div> : null}
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </fieldset>

        {error ? <p role="alert" className="text-sm font-semibold text-destructive">{error}</p> : null}

        <div className="flex min-w-0 flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <Button type="button" variant="ghost" className="w-full justify-center sm:w-auto" onClick={() => { setColor(null); setHexColor(defaultColor); setIcon(null) }} disabled={saving}><RotateCcw className="size-4" /> Restablecer predeterminada</Button>
          <div className="flex min-w-0 flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={onClose} disabled={saving}>Cancelar</Button>
            <Button type="button" className="w-full sm:w-auto" onClick={() => void save()} loading={saving}>Guardar apariencia</Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

function SubjectIconOptionButton({ option, selected, onSelect }: { option: SubjectIconOption; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      title={option.label}
      aria-label={`Usar icono ${option.label}`}
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        'flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl border px-1 py-2 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
        selected ? 'border-primary bg-primary text-primary-foreground shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-primary/30 hover:bg-primary/[0.03] hover:text-primary',
      )}
    >
      {getAppearanceIcon(option.value)}
      <span className="w-full truncate text-[9px] font-bold leading-3">{option.label}</span>
    </button>
  )
}

function ArchiveSubjectDialog({ subjectName, onConfirm, onClose }: { subjectName: string; onConfirm: () => void | Promise<void>; onClose: () => void }) {
  const [loading, setLoading] = useState(false)

  async function confirm() {
    setLoading(true)
    try {
      await onConfirm()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Archivar asignatura" description="Podrás restaurarla en cualquier momento." onClose={onClose} className="max-w-lg">
      <div className="p-5">
        <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><Archive className="size-5" /></span>
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-amber-950">Se moverá a Asignaturas archivadas</p>
            <p className="mt-1 break-words text-sm font-semibold leading-5 text-amber-800">{subjectName}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-slate-600"><Archive className="size-4 text-amber-700" /> Qué cambiará</div>
            <p className="mt-2 text-sm leading-5 text-slate-700">Dejará de aparecer entre las asignaturas activas del curso.</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-emerald-700"><CheckCircle2 className="size-4" /> Se conservará</div>
            <p className="mt-2 text-sm leading-5 text-emerald-900">Toda la información académica, equipos, historial y apariencia.</p>
          </div>
        </div>

        <p className="mt-4 text-xs leading-5 text-muted-foreground">Mientras esté archivada no podrás trabajar dentro de ella. Al restaurarla, volverá exactamente con su información y configuración actuales.</p>

        <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button type="button" onClick={() => void confirm()} loading={loading} className="border-amber-600 bg-amber-600 text-white shadow-sm hover:bg-amber-700"><Archive className="size-4" /> Archivar asignatura</Button>
        </div>
      </div>
    </Modal>
  )
}

function PermanentSubjectDeleteDialog({ subjectName, onConfirm, onClose }: { subjectName: string; onConfirm: (confirmation: string) => void | Promise<void>; onClose: () => void }) {
  const [confirmation, setConfirmation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const matches = confirmation === subjectName

  async function confirm() {
    if (!matches) return
    setLoading(true)
    setError(null)
    try {
      await onConfirm(confirmation)
    } catch (confirmError) {
      setError(confirmError instanceof Error ? confirmError.message : 'No se pudo eliminar la asignatura.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Eliminar asignatura permanentemente" description="Esta acción no se puede deshacer." onClose={onClose} className="max-w-lg">
      <div className="space-y-4 p-5">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Se eliminarán permanentemente la asignatura y toda su información asociada: actividades, instrumentos, calificaciones, asistencias, planificaciones, horarios y equipos.
        </div>
        <label className="block text-sm font-bold text-foreground">Escribe <span className="text-destructive">{subjectName}</span> para confirmar.</label>
        <Input autoFocus value={confirmation} onChange={(event) => setConfirmation(event.target.value)} disabled={loading} />
        {error ? <p role="alert" className="text-sm font-semibold text-destructive">{error}</p> : null}
        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button><Button type="button" variant="destructive" onClick={() => void confirm()} disabled={!matches} loading={loading}>Eliminar permanentemente</Button></div>
      </div>
    </Modal>
  )
}

function EmptySubjectDeleteDialog({ subjectName, studentCount, onConfirm, onClose }: { subjectName: string; studentCount: number; onConfirm: () => void | Promise<void>; onClose: () => void }) {
  const [loading, setLoading] = useState(false)

  async function confirm() {
    setLoading(true)
    try {
      await onConfirm()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Eliminar asignatura" description="Revisa esta acción antes de continuar." onClose={onClose} className="max-w-lg">
      <div className="p-5">
        <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50/80 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-destructive"><Trash2 className="size-5" /></span>
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-red-900">Esta asignatura se eliminará permanentemente</p>
            <p className="mt-1 break-words text-sm font-semibold leading-5 text-red-800">{subjectName}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-slate-600"><Trash2 className="size-4 text-destructive" /> Se eliminará</div>
            <p className="mt-2 text-sm leading-5 text-slate-700">La asignatura vacía y su apariencia personalizada.</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-emerald-700"><CheckCircle2 className="size-4" /> Se conservará</div>
            <p className="mt-2 text-sm leading-5 text-emerald-900">{studentCount > 0 ? `${studentCount} estudiantes y sus matrículas en el curso.` : 'La matrícula y toda la información general del curso.'}</p>
          </div>
        </div>

        <p className="mt-4 text-xs leading-5 text-muted-foreground">Esta asignatura no contiene actividades, calificaciones, asistencias, equipos, horarios ni planificaciones. La eliminación no se puede deshacer.</p>

        <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button type="button" variant="destructive" onClick={() => void confirm()} loading={loading}><Trash2 className="size-4" /> Eliminar asignatura</Button>
        </div>
      </div>
    </Modal>
  )
}

function SubjectDetailView({
  item,
  schoolYearName,
  schoolYearId,
  canEnroll,
  initialTab,
  backLabel,
  onBack,
}: {
  item: CourseCardItem
  schoolYearName: string
  schoolYearId: string | null
  canEnroll: boolean
  initialTab?: string
  backLabel: string
  onBack: () => void
}) {
  const navigate = useNavigate()
  const [teamSearchParams, setTeamSearchParams] = useSearchParams()
  const palette = item.assignment ? getAssignmentPalette(item.assignment) : getSubjectColor(item.subjectName)
  const courseLabel = `${item.grade.name} ${item.section.name}`.trim()
  const teamId = teamSearchParams.get('teamId')
  const activityId = teamSearchParams.get('activityId')
  const requestedTab = teamSearchParams.get('tab')
  const [activeTab, setActiveTab] = useState(teamId ? 'equipos' : activityId ? 'actividades' : requestedTab ?? initialTab ?? 'resumen')
  const [students, setStudents] = useState<StudentAttendanceRow[]>([])
  const [studentsLoading, setStudentsLoading] = useState(true)
  const [studentsError, setStudentsError] = useState<string | null>(null)
  const [overview, setOverview] = useState<{
    gradingStudents: StudentGradeRow[]
    activities: GradingActivity[]
    gradeRecords: GradeRecordRow[]
    teams: CourseTeam[]
    plannings: Array<{ id: string; title: string; plannedDate: string | null }>
    academicPeriods: AcademicPeriodOpt[]
    selectedAcademicPeriodId: string | null
  }>({ gradingStudents: [], activities: [], gradeRecords: [], teams: [], plannings: [], academicPeriods: [], selectedAcademicPeriodId: null })
  const [activityBlockPickerOpen, setActivityBlockPickerOpen] = useState(false)

  useEffect(() => {
    if (teamId) setActiveTab('equipos')
    else if (activityId) setActiveTab('actividades')
    else if (requestedTab) setActiveTab(requestedTab)
  }, [activityId, requestedTab, teamId])

  const selectSubjectTab = (nextTab: string) => {
    setActiveTab(nextTab)
    const next = new URLSearchParams(teamSearchParams)
    if (nextTab !== 'equipos') next.delete('teamId')
    if (nextTab !== 'actividades') next.delete('activityId')
    if (nextTab === 'actividades' || nextTab === 'planificaciones' || nextTab === 'asistencia' || nextTab === 'horario' || nextTab === 'recursos' || nextTab === 'reportes') next.set('tab', nextTab)
    else next.delete('tab')
    setTeamSearchParams(next, { replace: true })
  }

  const changeTeamRoute = (nextTeamId: string | null) => {
    const next = new URLSearchParams(teamSearchParams)
    if (nextTeamId) next.set('teamId', nextTeamId)
    else next.delete('teamId')
    setTeamSearchParams(next, nextTeamId ? undefined : { replace: true })
  }

  const changeActivityRoute = (nextActivityId: string | null | undefined) => {
    const next = new URLSearchParams(teamSearchParams)
    next.set('tab', 'actividades')
    if (nextActivityId) next.set('activityId', nextActivityId)
    else next.delete('activityId')
    setTeamSearchParams(next, nextActivityId ? undefined : { replace: true })
  }

  useEffect(() => {
    if (!schoolYearId) {
      setStudentsLoading(false)
      setStudentsError('No hay año escolar activo.')
      return
    }

    setStudentsLoading(true)
    setStudentsError(null)
    getStudentsBySection(item.section.id, schoolYearId)
      .then(setStudents)
      .catch((error) => setStudentsError(error instanceof Error ? error.message : 'No se pudieron cargar los estudiantes.'))
      .finally(() => setStudentsLoading(false))
  }, [item.section.id, schoolYearId])

  useEffect(() => {
    if (!item.assignment?.id) {
      return
    }
    let active = true
    Promise.allSettled([
      getGradingWorkspace({ sectionSubjectId: item.assignment.id }),
      getPlanningEntries({ sectionSubjectId: item.assignment.id }),
      getCourseTeams(item.assignment.id),
    ]).then(([gradingResult, planningResult, teamsResult]) => {
      if (!active) return
      setOverview({
        gradingStudents: gradingResult.status === 'fulfilled' ? gradingResult.value.students : [],
        activities: gradingResult.status === 'fulfilled' ? gradingResult.value.activities : [],
        gradeRecords: gradingResult.status === 'fulfilled' ? gradingResult.value.gradeRecords : [],
        teams: teamsResult.status === 'fulfilled' ? teamsResult.value : [],
        plannings: planningResult.status === 'fulfilled' ? planningResult.value.map((entry) => ({ id: entry.id, title: entry.title, plannedDate: entry.plannedDate })) : [],
        academicPeriods: gradingResult.status === 'fulfilled' ? gradingResult.value.academicPeriods : [],
        selectedAcademicPeriodId: gradingResult.status === 'fulfilled' ? gradingResult.value.selectedAcademicPeriodId : null,
      })
    })
    return () => { active = false }
  }, [item.assignment?.id])

  const attendanceRows = students.filter((student) => student.status)
  const presentRows = attendanceRows.filter((student) => student.status === 'present')
  const attendancePercent = attendanceRows.length ? Math.round((presentRows.length / attendanceRows.length) * 100) : null
  const gradePercentages = overview.gradeRecords.filter((record) => record.maxScore > 0).map((record) => (record.score / record.maxScore) * 100)
  const averageScore = gradePercentages.length
    ? Math.round(gradePercentages.reduce((total, score) => total + score, 0) / gradePercentages.length)
    : item.assignment?.averageScore === null || item.assignment?.averageScore === undefined
      ? null
      : Math.round(item.assignment.averageScore)
  const activityCount = Math.max(item.assignment?.activityCount ?? 0, overview.activities.length)
  const subjectTabs = [
    { id: 'resumen', label: 'Resumen', icon: <LayoutDashboard className="size-4" /> },
    { id: 'estudiantes', label: 'Estudiantes', icon: <UsersRound className="size-4" /> },
    { id: 'equipos', label: 'Equipos', icon: <UsersRound className="size-4" /> },
    { id: 'actividades', label: 'Actividades', icon: <CheckSquare className="size-4" /> },
    { id: 'asistencia', label: 'Asistencia', icon: <CalendarCheck2 className="size-4" /> },
    { id: 'calificaciones', label: 'Calificaciones', icon: <GraduationCap className="size-4" /> },
    { id: 'horario', label: 'Horario', icon: <CalendarDays className="size-4" /> },
    { id: 'recursos', label: 'Recursos', icon: <Library className="size-4" /> },
    { id: 'reportes', label: 'Reportes', icon: <ChartColumn className="size-4" /> },
    { id: 'configuracion', label: 'Configuración', icon: <SlidersHorizontal className="size-4" /> },
    { id: 'planificaciones', label: 'Planificaciones', icon: <ClipboardList className="size-4" />, muted: true, badge: 'Próximamente' },
  ]
  const subjectActions = [
    { title: 'Crear', items: [
      { label: 'Nueva actividad', shortcut: 'N', icon: <Plus className="size-4" />, onSelect: () => setActivityBlockPickerOpen(true) },
      { label: 'Agregar a bitácora', shortcut: 'B', icon: <BookMarked className="size-4" />, onSelect: () => {
        const journalParams = new URLSearchParams({ action: 'create', sectionId: item.section.id })
        if (item.assignment?.id) journalParams.set('sectionSubjectId', item.assignment.id)
        navigate(`/bitacora?${journalParams}`)
      } },
    ] },
    { title: 'Clase', items: [
      { label: 'Registrar asistencia', shortcut: 'A', icon: <CalendarCheck2 className="size-4" />, onSelect: () => {
        if (item.assignment) navigate(buildSubjectAttendanceHref(item.assignment.id, item.id))
      } },
      { label: 'Organizar equipos', icon: <UsersRound className="size-4" />, onSelect: () => selectSubjectTab('equipos') },
      { label: 'Gestionar calificaciones', icon: <GraduationCap className="size-4" />, onSelect: () => selectSubjectTab('calificaciones') },
    ] },
    { title: 'Curso', items: [
      { label: 'Recursos', icon: <Library className="size-4" />, onSelect: () => selectSubjectTab('recursos') },
      { label: 'Reportes', icon: <ChartColumn className="size-4" />, onSelect: () => selectSubjectTab('reportes') },
      { label: 'Configuración', icon: <SlidersHorizontal className="size-4" />, onSelect: () => selectSubjectTab('configuracion') },
    ] },
  ]

  return (
    <div className="course-workspace-shell subject-workspace w-full min-w-0 max-w-full space-y-3">
      <header className="subject-workspace-header flex flex-wrap items-center gap-4 rounded-3xl border border-border bg-card px-5 py-5 shadow-sm lg:min-h-[124px] lg:flex-nowrap lg:px-6">
        <button type="button" className="grid size-11 shrink-0 place-items-center rounded-full border border-border text-primary shadow-sm hover:bg-primary/5" onClick={onBack} aria-label={backLabel} title={backLabel}><BackIcon /></button>
        <span className="hidden h-12 w-px bg-border sm:block" />
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl text-white shadow-sm [&>svg]:size-7" style={{ backgroundColor: palette.color }}>{getSubjectIcon(item.subjectName, item.assignment?.appearanceIcon)}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">{courseLabel}</span><span className="rounded-full bg-success/10 px-2.5 py-0.5 text-[11px] font-semibold text-success">● Activa</span></div>
          <h1 className="mt-1 line-clamp-2 text-lg font-semibold tracking-tight text-foreground">{item.subjectName}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground"><span>{cleanLevelName(item.levelName)} · {item.cycleName} · Sección {item.section.name}</span>{schoolYearName ? <span className="inline-flex items-center gap-1"><CalendarDays className="size-3.5" />{schoolYearName}</span> : null}<span className="inline-flex items-center gap-1"><UsersRound className="size-3.5" />{students.length || item.section.studentCount || 0} estudiantes</span><span className="inline-flex items-center gap-1"><UsersRound className="size-3.5" />{item.assignment?.teamCount ?? 0} equipos</span></p>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button type="button" onClick={() => selectSubjectTab('asistencia')} className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-xs font-semibold text-foreground shadow-sm hover:bg-muted"><CalendarCheck2 className="size-4 text-success" /> Asistencia</button>
          <details className="group relative" onKeyDown={(event) => {
            if (!event.currentTarget.open || !['n', 'b', 'a'].includes(event.key.toLowerCase())) return
            const action = subjectActions.flatMap((section) => section.items).find((item) => 'shortcut' in item && item.shortcut?.toLowerCase() === event.key.toLowerCase())
            if (!action) return
            event.preventDefault()
            action.onSelect()
            event.currentTarget.removeAttribute('open')
          }}>
            <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover [&::-webkit-details-marker]:hidden">Acciones <ChevronDown className="size-4 transition group-open:rotate-180" /></summary>
            <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-3xl border border-border bg-card p-1 shadow-xl">
              {subjectActions.map((section) => <section key={section.title} className="border-b border-border px-1 py-2 last:border-b-0">
                <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{section.title}</p>
                {section.items.map((action) => <button key={action.label} type="button" aria-label={action.label} className="flex h-12 w-full items-center gap-3 rounded-xl px-2 text-left text-sm font-medium text-foreground hover:bg-muted" onClick={(event) => { action.onSelect(); event.currentTarget.closest('details')?.removeAttribute('open') }}><span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">{action.icon}</span><span className="min-w-0 flex-1 whitespace-nowrap">{action.label}</span>{'shortcut' in action ? <span className="text-xs text-muted-foreground">{action.shortcut}</span> : null}</button>)}
              </section>)}
            </div>
          </details>
        </div>
      </header>

      <nav className="subject-workspace-tabs flex min-w-0 items-center gap-1 overflow-x-auto rounded-full border border-border bg-card px-3 py-1.5 shadow-sm" aria-label="Secciones de la asignatura">
        {subjectTabs.slice(0, 7).map((tab) => <DetailTab key={tab.id} active={activeTab === tab.id} icon={tab.icon} label={tab.label} count={tab.id === 'estudiantes' ? students.length || item.section.studentCount || 0 : tab.id === 'equipos' ? item.assignment?.teamCount ?? 0 : tab.id === 'actividades' ? activityCount : undefined} onClick={() => selectSubjectTab(tab.id)} />)}
        <details className="group relative ml-auto shrink-0"><summary className="flex h-10 cursor-pointer list-none items-center gap-2 px-4 text-sm font-medium text-muted-foreground [&::-webkit-details-marker]:hidden">··· Más <ChevronDown className="size-3.5" /></summary><div className="absolute right-0 top-11 z-40 w-52 rounded-2xl border border-border bg-card p-2 shadow-xl">{subjectTabs.slice(7).map((tab) => <button key={tab.id} type="button" onClick={(event) => { selectSubjectTab(tab.id); event.currentTarget.closest('details')?.removeAttribute('open') }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs text-foreground hover:bg-muted">{tab.icon}{tab.label}</button>)}</div></details>
      </nav>

      {activeTab === 'resumen' ? (
        <SubjectOverviewDashboard
          students={students.length}
          teams={item.assignment?.teamCount ?? 0}
          activities={overview.activities}
          activityCount={activityCount}
          gradeRecords={overview.gradeRecords}
          plannings={overview.plannings}
          attendancePercent={attendancePercent}
          averageScore={averageScore}
          lastAttendanceDate={item.assignment?.lastAttendanceDate ?? null}
          onNavigate={selectSubjectTab}
        />
      ) : activeTab === 'estudiantes' ? (
        <EstudiantesTab
          students={students}
          loading={studentsLoading}
          error={studentsError}
          courseId={item.assignment?.id ?? null}
          sectionId={item.section.id}
          canEnroll={canEnroll}
          gradingStudents={overview.gradingStudents}
          activities={overview.activities}
          gradeRecords={overview.gradeRecords}
          teams={overview.teams}
          journalCourse={item.assignment && schoolYearId ? {
            id: item.assignment.id,
            sectionId: item.section.id,
            schoolYearId,
            gradeName: item.grade.name,
            sectionName: item.section.name,
            subjectName: item.subjectName,
          } : null}
        />
      ) : activeTab === 'equipos' ? (
        <CourseTeamsPanel
          sectionSubjectId={item.assignment?.id ?? null}
          students={students}
          activities={overview.activities}
          canManage={canEnroll}
          context={{ courseLabel, subjectName: item.subjectName, schoolYearName }}
          initialTeamId={teamId}
          onTeamChange={changeTeamRoute}
        />
      ) : activeTab === 'actividades' ? (
        <SubjectActivitiesTab
          activities={overview.activities}
          activityId={activityId}
          academicPeriods={overview.academicPeriods}
          selectedAcademicPeriodId={overview.selectedAcademicPeriodId}
          records={overview.gradeRecords}
          students={overview.gradingStudents}
          teams={overview.teams}
          assignmentId={item.assignment?.id ?? null}
          courseId={item.id}
          courseLabel={courseLabel}
          subjectName={item.subjectName}
          onCreate={() => setActivityBlockPickerOpen(true)}
          onActivityChange={changeActivityRoute}
        />
      ) : activeTab === 'asistencia' ? (
        <SubjectAttendancePanel key={item.assignment?.id} sectionSubjectId={item.assignment?.id ?? null} students={students} loading={studentsLoading} error={studentsError} courseId={item.id} courseLabel={courseLabel} subjectName={item.subjectName} schoolYearName={schoolYearName} />
      ) : activeTab === 'calificaciones' ? (
        <CalificacionesTab sectionSubjectId={item.assignment?.id ?? null} schoolYearId={schoolYearId} courseId={item.id} courseLabel={courseLabel} subjectName={item.subjectName} />
      ) : activeTab === 'planificaciones' ? (
        <PlanningDisabledPanel onActivities={() => selectSubjectTab('actividades')} />
      ) : activeTab === 'recursos' ? (
        <SubjectResourcesPanel sectionSubjectId={item.assignment?.id ?? null} courseLabel={courseLabel} subjectName={item.subjectName} />
      ) : activeTab === 'reportes' ? (
        <SubjectReportsPanel
          sectionSubjectId={item.assignment?.id ?? null}
          courseLabel={courseLabel}
          subjectName={item.subjectName}
          initialStudents={overview.gradingStudents}
          initialActivities={overview.activities}
          initialRecords={overview.gradeRecords}
          periods={overview.academicPeriods}
          initialPeriodId={overview.selectedAcademicPeriodId}
        />
      ) : (
        <SubjectModulePanel icon={<SlidersHorizontal className="size-6" />} title="Configuración de la asignatura" description="La apariencia y el estado de la asignatura se administran desde el menú de su tarjeta en el curso." action="Volver a asignaturas" onAction={onBack} />
      )}

      {activityBlockPickerOpen && item.assignment ? (
        <ActivityBlockPickerDialog
          assignmentId={item.assignment.id}
          courseId={item.id}
          courseName={courseLabel}
          subjectName={item.subjectName}
          onClose={() => setActivityBlockPickerOpen(false)}
        />
      ) : null}
    </div>
  )
}

export function ActivityBlockPickerDialog({ assignmentId, courseId, courseName, subjectName, onClose }: {
  assignmentId: string
  courseId: string
  courseName: string
  subjectName: string
  onClose: () => void
}) {
  const visuals = [
    { icon: <BookOpen className="size-6" />, iconTone: 'bg-blue-100 text-blue-700', border: 'hover:border-blue-300', badge: 'bg-blue-50 text-blue-700' },
    { icon: <Brain className="size-6" />, iconTone: 'bg-emerald-100 text-emerald-700', border: 'hover:border-emerald-300', badge: 'bg-emerald-50 text-emerald-700' },
    { icon: <HandHeart className="size-6" />, iconTone: 'bg-amber-100 text-amber-700', border: 'hover:border-amber-300', badge: 'bg-amber-50 text-amber-700' },
    { icon: <FlaskConical className="size-6" />, iconTone: 'bg-violet-100 text-violet-700', border: 'hover:border-violet-300', badge: 'bg-violet-50 text-violet-700' },
  ]

  return (
    <Modal
      title="Selecciona el bloque de competencias"
      description="La actividad se organizará y calificará dentro del bloque que elijas."
      onClose={onClose}
      className="max-w-4xl rounded-2xl"
    >
      <div className="p-6">
        <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-primary/10 bg-primary/[0.035] px-4 py-3 text-sm">
          <span className="font-extrabold text-foreground">{courseName}</span>
          <span className="text-muted-foreground">·</span>
          <span className="font-semibold text-muted-foreground">{subjectName}</span>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {competencyBlocks.map((block, index) => {
            const visual = visuals[index]
            const href = `/calificaciones?${new URLSearchParams({
              sectionSubjectId: assignmentId,
              action: 'create-activity',
              competencyBlockId: block.id,
              origin: 'subject',
              returnCourseId: courseId,
              returnSubjectId: assignmentId,
              returnTab: 'actividades',
            }).toString()}`
            return (
              <Link
                key={block.id}
                data-competency-block-id={block.id}
                to={href}
                onClick={onClose}
                className={cn('group flex min-h-40 flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-shadow duration-200 hover:shadow-lg', visual.border)}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={cn('flex size-12 items-center justify-center rounded-xl', visual.iconTone)}>{visual.icon}</span>
                  <span className={cn('rounded-full px-3 py-1 text-xs font-extrabold', visual.badge)}>{block.shortName}</span>
                </div>
                <h3 className="mt-4 text-base font-extrabold leading-5 text-foreground">{block.name}</h3>
                <span className="mt-auto flex items-center gap-2 pt-4 text-sm font-extrabold text-primary">Elegir este bloque <ArrowLeft className="size-4 rotate-180 transition group-hover:translate-x-1" /></span>
              </Link>
            )
          })}
        </div>

        <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </Modal>
  )
}

function SubjectOverviewDashboard({ students, teams, activities, activityCount, gradeRecords, plannings, attendancePercent, averageScore, lastAttendanceDate, onNavigate }: {
  students: number
  teams: number
  activities: Array<{ id: string; name: string; date?: string; activityType?: 'individual' | 'group'; instrumentId?: string }>
  activityCount: number
  gradeRecords: Array<{ score: number; maxScore: number; evaluationActivityId?: string | null }>
  plannings: Array<{ id: string; title: string; plannedDate: string | null }>
  attendancePercent: number | null
  averageScore: number | null
  lastAttendanceDate: string | null
  onNavigate: (tab: string) => void
}) {
  const datedActivities = activities.filter((activity) => activity.date).sort((a, b) => new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime())
  const upcomingActivities = datedActivities.filter((activity) => new Date(activity.date ?? 0).getTime() >= startOfToday()).slice(0, 3)
  const recentActivity = [...datedActivities].sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime())[0] ?? activities[0]
  const evaluatedActivityIds = new Set(gradeRecords.map((record) => record.evaluationActivityId).filter(Boolean))
  const pendingActivities = Math.max(activityCount - evaluatedActivityIds.size, 0)
  return <div className="subject-summary space-y-5">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <AcademicSummaryCard icon={<ClipboardList className="size-4" />} value={activityCount} label="Actividades" detail={`${evaluatedActivityIds.size} evaluadas · ${pendingActivities} pendientes`} tone="blue" onClick={() => onNavigate('actividades')} />
      <AcademicSummaryCard icon={<FileText className="size-4" />} value={plannings.length} label="Planificaciones" detail={`${plannings.filter((entry) => entry.plannedDate).length} programadas`} tone="orange" onClick={() => onNavigate('planificaciones')} />
      <AcademicSummaryCard icon={<UsersRound className="size-4" />} value={teams} label="Equipos" detail={`${students} estudiantes`} tone="violet" onClick={() => onNavigate('equipos')} />
      <AcademicSummaryCard icon={<CalendarCheck2 className="size-4" />} value={attendancePercent === null ? '—' : `${attendancePercent}%`} label="Asistencia" detail="Período actual" tone="emerald" onClick={() => onNavigate('asistencia')} />
      <AcademicSummaryCard icon={<ChartColumn className="size-4" />} value={averageScore === null ? '—' : `${averageScore}%`} label="Promedio general" detail={`${gradeRecords.length} registros`} tone="orange" onClick={() => onNavigate('calificaciones')} />
    </div>
    <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
      <DashboardPanel title="Próximas actividades" subtitle={upcomingActivities.length ? `${upcomingActivities.length} por entregar próximamente` : 'Sin entregas próximas'} action="Ver todas →" onAction={() => onNavigate('actividades')}>
        <div className="px-5 py-3">{upcomingActivities.length ? upcomingActivities.map((activity) => <ActivityPreview key={activity.id} activity={activity} />) : <CompactEmpty icon={<CalendarClock className="size-5" />} text="No hay actividades próximas." />}</div>
        <button type="button" onClick={() => onNavigate('actividades')} className="flex w-full items-center justify-center gap-2 border-t border-border py-3 text-xs font-semibold text-primary"><CalendarDays className="size-4" /> Ver calendario completo</button>
      </DashboardPanel>
      <DashboardPanel title="Requiere tu atención" badge={!activities.some((activity) => activity.instrumentId) || !plannings.length ? Number(!activities.some((activity) => activity.instrumentId)) + Number(!plannings.length) : undefined}>
        <div className="space-y-3 px-5 pb-5">{!activities.some((activity) => activity.instrumentId) ? <NoticeRow tone="amber" title="Faltan instrumentos de evaluación" detail="Crea una rúbrica o lista de cotejo para calificar las actividades." action="Crear instrumento" onAction={() => onNavigate('calificaciones')} /> : null}{!plannings.length ? <NoticeRow tone="blue" title="Sin planificación programada" detail="Programa tus unidades para organizar el período." action="Planificar" onAction={() => onNavigate('planificaciones')} /> : null}{activities.some((activity) => activity.instrumentId) && plannings.length ? <NoticeRow tone="blue" title="Todo está al día" detail="No hay avisos pendientes." /> : null}</div>
      </DashboardPanel>
      <DashboardPanel title="Actividad reciente" subtitle="Lo último que pasó en esta asignatura" action="Ver historial →" onAction={() => onNavigate('actividades')}>
        <div className="px-5 pb-5">{recentActivity ? <div className="flex items-center gap-3 rounded-xl bg-muted/45 p-4"><span className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary"><CheckSquare className="size-5" /></span><div className="min-w-0"><p className="truncate text-sm font-semibold">{recentActivity.name}</p><p className="text-xs text-muted-foreground">{recentActivity.date ? `Programada para ${formatShortDate(recentActivity.date)}` : 'Actividad registrada'}</p></div></div> : lastAttendanceDate ? <div className="flex items-center gap-3 rounded-xl bg-muted/45 p-4"><span className="grid size-10 place-items-center rounded-full bg-success/10 text-success"><CalendarCheck2 className="size-5" /></span><div><p className="text-sm font-semibold">Asistencia registrada</p><p className="text-xs text-muted-foreground">{formatShortDate(lastAttendanceDate)}</p></div></div> : <CompactEmpty icon={<CheckSquare className="size-5" />} text="Todavía no hay actividad reciente." />}</div>
      </DashboardPanel>
      <DashboardPanel title="Última asistencia" subtitle={lastAttendanceDate ? `Registrada el ${formatShortDate(lastAttendanceDate)}` : 'Sin asistencia registrada'} action="Historial →" onAction={() => onNavigate('asistencia')}>
        <div className="flex items-center gap-5 px-5 pb-5"><span className={cn('grid size-20 shrink-0 place-items-center rounded-full border-[6px] text-lg font-semibold text-foreground', attendancePercent === null ? 'border-muted' : 'border-success')}>{attendancePercent === null ? '—' : `${attendancePercent}%`}</span><div><p className="text-sm font-semibold text-foreground">{students} estudiantes</p><p className="text-xs text-muted-foreground">en la asignatura</p></div></div>
      </DashboardPanel>
      <div className="xl:col-start-2"><DashboardPanel title="Reportes rápidos" subtitle="Descarga los datos de la asignatura"><div className="grid gap-2 px-5 pb-5">{['Calificaciones', 'Asistencia', 'Actividades', 'Resumen académico'].map((report) => <Link key={report} to="/reportes" className="flex items-center justify-between rounded-xl bg-muted/45 px-3 py-2 text-xs font-medium hover:bg-primary/5">Reporte de {report.toLowerCase()} <span className="text-primary">PDF</span></Link>)}</div></DashboardPanel></div>
    </div>
  </div>
}

function DashboardPanel({ title, subtitle, badge, action, onAction, children }: { title: string; subtitle?: string; badge?: number; action?: string; onAction?: () => void; children: ReactNode }) {
  return <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm"><header className="flex min-h-16 items-start justify-between gap-3 px-5 pb-3 pt-5"><div><h2 className="text-base font-semibold text-foreground">{title}</h2>{subtitle ? <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p> : null}</div>{action ? <button type="button" onClick={onAction} className="shrink-0 text-xs font-semibold text-primary hover:underline">{action}</button> : badge ? <span className="rounded-full bg-warning/20 px-2 text-xs font-semibold text-foreground">{badge}</span> : null}</header>{children}</section>
}

function ActivityPreview({ activity }: { activity: { name: string; date?: string; activityType?: 'individual' | 'group' } }) {
  const date = activity.date ? new Date(activity.date) : null
  return <div className="flex min-h-20 items-center gap-3 border-b border-border py-3 last:border-b-0"><span className="flex size-11 shrink-0 flex-col items-center justify-center rounded-full bg-muted text-foreground"><strong className="text-sm leading-none">{date ? date.getDate() : '—'}</strong><span className="mt-0.5 text-[9px] font-semibold uppercase">{date ? date.toLocaleDateString('es-DO', { month: 'short' }).replace('.', '') : 'S/F'}</span></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{activity.name}</span><span className="mt-1 block text-xs text-muted-foreground">{activity.activityType === 'group' ? 'Proyecto en equipo' : 'Actividad individual'} · {activity.date ? formatShortDate(activity.date) : 'Sin fecha'}</span></span><span className="text-[11px] text-muted-foreground">{date ? 'Próxima' : 'Pendiente'}</span></div>
}

function AcademicSummaryCard({ icon, value, label, detail, tone, onClick }: { icon: ReactNode; value: string | number; label: string; detail: string; tone: 'violet' | 'orange' | 'blue' | 'emerald'; onClick: () => void }) {
  const tones = { violet: 'bg-primary/10 text-primary', orange: 'bg-warning/20 text-foreground', blue: 'bg-primary/10 text-primary', emerald: 'bg-success/12 text-success' }
  return <button type="button" onClick={onClick} aria-label={`Ir a ${label}`} className="flex min-h-32 w-full flex-col rounded-3xl border border-border bg-card p-4 text-left shadow-sm transition hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"><span className="flex w-full items-start justify-between"><span className={cn('grid size-9 place-items-center rounded-full', tones[tone])}>{icon}</span><strong className="text-2xl font-semibold leading-none text-foreground">{value}</strong></span><span className="mt-auto block text-sm font-semibold text-foreground">{label}</span><span className="block text-[11px] text-muted-foreground">{detail}</span><span className="mt-3 h-1 w-full rounded-full bg-muted"><span className={cn('block h-full rounded-full', tone === 'emerald' ? 'bg-success' : 'bg-primary')} style={{ width: typeof value === 'string' && value.endsWith('%') ? value : '0%' }} /></span></button>
}

function NoticeRow({ tone, title, detail, action, onAction }: { tone: 'amber' | 'blue'; title: string; detail: string; action?: string; onAction?: () => void }) {
  return <div className={cn('flex gap-3 rounded-2xl border px-4 py-3', tone === 'amber' ? 'border-warning/30 bg-warning/10' : 'border-primary/20 bg-primary/5')}><AlertCircle className={cn('mt-0.5 size-4 shrink-0', tone === 'amber' ? 'text-warning' : 'text-primary')} /><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{title}</p><p className="mt-0.5 text-xs leading-5 text-muted-foreground">{detail}</p>{action ? <button type="button" onClick={onAction} className="mt-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-primary shadow-sm">{action}</button> : null}</div></div>
}

function CompactEmpty({ icon, text }: { icon: ReactNode; text: string }) {
  return <div className="flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 text-center text-muted-foreground"><span className="text-slate-400">{icon}</span><p className="mt-2 text-xs font-semibold">{text}</p></div>
}

function SubjectModulePanel({ icon, title, description, href, action, onAction }: { icon: ReactNode; title: string; description: string; href?: string; action: string; onAction?: () => void }) {
  const content = <><span className="flex size-14 items-center justify-center rounded-2xl bg-primary/8 text-primary">{icon}</span><h2 className="mt-4 text-lg font-extrabold">{title}</h2><p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">{description}</p><span className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground">{action}</span></>
  return href ? <Link to={href} className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">{content}</Link> : <button type="button" onClick={onAction} className="flex min-h-72 w-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">{content}</button>
}

function formatShortDate(value?: string | null) {
  if (!value) return 'Sin fecha'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })
}

const defaultAdvancedFilters: CourseAdvancedFilters = {
  level: 'all',
  cycle: 'all',
  subject: 'all',
  grade: 'all',
  section: 'all',
  showArchived: false,
  onlyWithTeams: false,
  onlyWithoutStudents: false,
  sortBy: 'current',
}

function DetailTab({ active, icon, label, muted, badge, count, onClick }: { active?: boolean; icon: ReactNode; label: string; muted?: boolean; badge?: string; count?: number; onClick?: () => void }) {
  return (
    <button
      type="button"
      className={cn(
        'relative flex h-10 min-w-0 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full px-3 text-sm font-medium text-muted-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-primary/5 hover:text-primary',
        active && 'text-primary',
        muted && !active && 'bg-muted/40 text-muted-foreground/70 hover:bg-muted/60 hover:text-muted-foreground',
      )}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
    >
      {icon}
      {label}
      {count !== undefined ? <span className="grid min-w-5 place-items-center rounded-full bg-muted px-1 text-[10px] font-semibold text-muted-foreground">{count}</span> : null}
      {badge ? <span className="hidden rounded-full bg-slate-100 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide text-slate-500 2xl:inline">{badge}</span> : null}
    </button>
  )
}

type SubjectActivityStatus = 'pending' | 'partial' | 'graded'

export function SubjectActivitiesTab({ activities, activityId, academicPeriods, selectedAcademicPeriodId, records, students, teams, assignmentId, courseId, courseLabel, subjectName, onCreate, onActivityChange }: {
  activities: GradingActivity[]
  activityId: string | null
  academicPeriods: AcademicPeriodOpt[]
  selectedAcademicPeriodId: string | null
  records: GradeRecordRow[]
  students: StudentGradeRow[]
  teams: CourseTeam[]
  assignmentId: string | null
  courseId: string
  courseLabel: string
  subjectName: string
  onCreate: () => void
  onActivityChange: (activityId: string | null | undefined) => void
}) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | SubjectActivityStatus>('all')
  const [sort, setSort] = useState<'recent' | 'oldest' | 'name'>('recent')
  const selected = activities.find((activity) => activity.id === activityId) ?? null
  const period = academicPeriods.find((item) => item.id === selectedAcademicPeriodId) ?? academicPeriods[0]
  const activityMeta = (activity: GradingActivity) => {
    const graded = students.filter((student) => Boolean(scoreForActivity(records, student.enrollmentId, activity.id))).length
    const state: SubjectActivityStatus = graded === 0 ? 'pending' : graded >= students.length && students.length > 0 ? 'graded' : 'partial'
    return { graded, state }
  }
  const visible = activities
    .filter((activity) => !query.trim() || `${activity.name} ${activity.description ?? ''}`.toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es')))
    .filter((activity) => status === 'all' || activityMeta(activity).state === status)
    .sort((left, right) => sort === 'name'
      ? left.name.localeCompare(right.name, 'es')
      : sort === 'oldest'
        ? (left.date ?? '').localeCompare(right.date ?? '')
        : (right.date ?? '').localeCompare(left.date ?? ''))

  if (!assignmentId) return <EmptyState title="Sin asignatura" description="Este curso no tiene una asignatura asignada." />
  if (selected) return <SubjectActivityDetail activity={selected} records={records} students={students} teams={teams} assignmentId={assignmentId} courseId={courseId} periodName={period?.name ?? 'Período actual'} onBack={() => onActivityChange(null)} />

  return <section className="space-y-4" aria-labelledby="subject-activities-title">
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div><h2 id="subject-activities-title" className="text-xl font-extrabold tracking-tight">Actividades</h2><p className="mt-1 text-sm text-muted-foreground">Gestiona las actividades de esta asignatura.</p><p className="mt-1 text-xs font-semibold text-muted-foreground">{courseLabel} · {subjectName} · {period?.name ?? 'Período actual'}</p></div>
      <Button className="h-11 px-5" onClick={onCreate}><Plus className="size-4" /> Crear actividad</Button>
    </header>
    <div className="grid gap-2 rounded-2xl border border-border bg-card p-3 shadow-sm lg:grid-cols-[minmax(0,12rem)_minmax(0,12rem)_minmax(14rem,1fr)_minmax(0,12rem)]">
      <label className="grid min-w-0 gap-1 text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">Período<select disabled title={period?.name ?? 'Período actual'} className="h-10 w-full min-w-0 truncate rounded-xl border border-border bg-muted/30 px-3 text-sm font-bold text-foreground"><option>{period?.name ?? 'Período actual'}</option></select></label>
      <label className="grid min-w-0 gap-1 text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">Estado<select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="h-10 w-full min-w-0 rounded-xl border border-border bg-card px-3 text-sm font-bold text-foreground"><option value="all">Todas</option><option value="pending">Pendientes</option><option value="partial">Parcialmente calificadas</option><option value="graded">Calificadas</option></select></label>
      <label className="relative self-end"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Buscar actividad" value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 pl-9" placeholder="Buscar actividad..." /></label>
      <label className="grid min-w-0 gap-1 text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">Ordenar<select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} className="h-10 w-full min-w-0 rounded-xl border border-border bg-card px-3 text-sm font-bold text-foreground"><option value="recent">Más recientes</option><option value="oldest">Más antiguas</option><option value="name">Nombre A-Z</option></select></label>
    </div>
    {!activities.length ? <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 text-center"><span className="flex size-14 items-center justify-center rounded-2xl bg-primary/8 text-primary"><CheckSquare className="size-6" /></span><h3 className="mt-4 text-lg font-extrabold">Aún no hay actividades</h3><p className="mt-2 max-w-md text-sm text-muted-foreground">Crea la primera actividad de esta asignatura para comenzar a evaluarla.</p><Button className="mt-5" onClick={onCreate}><Plus className="size-4" /> Crear primera actividad</Button></div> : !visible.length ? <EmptyState title="Sin coincidencias" description="Prueba con otro texto o estado." /> : <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm"><table className="min-w-[70rem] w-full text-left text-sm"><thead className="bg-muted/40 text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground"><tr><th className="px-4 py-3">Actividad</th><th className="px-4 py-3">Bloque</th><th className="px-4 py-3">Período</th><th className="px-4 py-3">Fecha</th><th className="px-4 py-3">Valor</th><th className="px-4 py-3">Instrumento</th><th className="px-4 py-3">Modalidad</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3">Progreso</th><th className="px-4 py-3 text-right">Acciones</th></tr></thead><tbody className="divide-y divide-border">{visible.map((activity) => { const meta = activityMeta(activity); const block = competencyBlocks.find((item) => item.id === activity.competencyBlockId); return <tr key={activity.id} tabIndex={0} aria-label={`Abrir actividad ${activity.name}`} onClick={() => onActivityChange(activity.id)} onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); onActivityChange(activity.id) } }} className="cursor-pointer outline-none transition hover:bg-primary/[0.035] focus-visible:bg-primary/[0.05] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"><td className="px-4 py-3"><span className="max-w-52 text-left font-extrabold text-foreground">{activity.name}</span></td><td className="px-4 py-3 text-xs"><strong className="block">{block?.shortName ?? 'Bloque'}</strong><span className="line-clamp-1 max-w-40 text-[10px] text-muted-foreground">{block?.name}</span></td><td className="px-4 py-3 text-xs font-bold">{period?.name?.split('—')[0]?.trim() ?? 'Actual'}</td><td className="px-4 py-3 text-xs text-muted-foreground">{formatShortDate(activity.date)}</td><td className="px-4 py-3 text-xs font-bold">{activity.maxScore} pts</td><td className="px-4 py-3 text-xs text-muted-foreground">{activityInstrumentLabel(activity.instrumentType)}</td><td className="px-4 py-3 text-xs">{activity.activityType === 'group' ? 'Grupal' : 'Individual'}</td><td className="px-4 py-3"><ActivityStatusBadge status={meta.state} /></td><td className="px-4 py-3"><div className="min-w-24"><span className="text-[10px] font-bold text-muted-foreground">{meta.graded} / {students.length}</span><div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${students.length ? (meta.graded / students.length) * 100 : 0}%` }} /></div></div></td><td className="px-4 py-3"><div className="flex justify-end gap-1"><button type="button" onClick={(event) => { event.stopPropagation(); onActivityChange(activity.id) }} aria-label={`Ver ${activity.name}`} className="grid size-9 place-items-center rounded-lg text-primary hover:bg-primary/8"><Eye className="size-4" /></button><Link onClick={(event) => event.stopPropagation()} to={buildActivityGradingHref(assignmentId, courseId, activity.id, 'edit')} aria-label={`Editar ${activity.name}`} className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted"><Edit3 className="size-4" /></Link><Link onClick={(event) => event.stopPropagation()} to={buildActivityGradingHref(assignmentId, courseId, activity.id, 'evaluate')} aria-label={`Evaluar ${activity.name}`} className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted"><ChartColumn className="size-4" /></Link></div></td></tr> })}</tbody></table><footer className="border-t border-border px-4 py-3 text-xs text-muted-foreground">Mostrando {visible.length} de {activities.length} actividades</footer></div>}
  </section>
}

function SubjectActivityDetail({ activity, records, students, teams, assignmentId, courseId, periodName, onBack }: { activity: GradingActivity; records: GradeRecordRow[]; students: StudentGradeRow[]; teams: CourseTeam[]; assignmentId: string; courseId: string; periodName: string; onBack: () => void }) {
  const [tab, setTab] = useState<'info' | 'instrument' | 'participants' | 'evaluation' | 'history'>('info')
  const block = competencyBlocks.find((item) => item.id === activity.competencyBlockId)
  const graded = students.filter((student) => Boolean(scoreForActivity(records, student.enrollmentId, activity.id))).length
  const status: SubjectActivityStatus = graded === 0 ? 'pending' : graded >= students.length && students.length > 0 ? 'graded' : 'partial'
  const selectedTeams = teams.filter((team) => activity.teamIds?.includes(team.id))
  const tabs = [['info', 'Información'], ['instrument', 'Instrumento'], ['participants', 'Estudiantes / Equipos'], ['evaluation', 'Evaluación'], ['history', 'Historial']] as const
  return <section className="space-y-4"><header className="rounded-2xl border border-border bg-card p-4 shadow-sm"><button type="button" onClick={onBack} className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-3 text-xs font-extrabold text-primary hover:bg-primary/[0.04]"><BackIcon /> Volver a actividades</button><div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start"><span className="flex size-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><FlaskConical className="size-5" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-extrabold">{activity.name}</h2><span className="rounded-full bg-primary/8 px-2 py-1 text-[10px] font-extrabold text-primary">{periodName.split('—')[0]?.trim()}</span><ActivityStatusBadge status={status} /></div><p className="mt-2 text-xs font-semibold text-muted-foreground">{activity.activityType === 'group' ? 'Grupal' : 'Individual'} · {activity.maxScore} puntos · {activityInstrumentLabel(activity.instrumentType)} · {formatShortDate(activity.date)}</p></div><Link to={buildActivityGradingHref(assignmentId, courseId, activity.id, 'edit')} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-xs font-extrabold hover:bg-muted"><Edit3 className="size-4" /> Editar actividad</Link></div><nav className="mt-4 flex gap-1 overflow-x-auto border-t border-border pt-2" aria-label="Secciones de la actividad">{tabs.map(([id, label]) => <button key={id} type="button" aria-current={tab === id ? 'page' : undefined} onClick={() => setTab(id)} className={cn('h-10 whitespace-nowrap rounded-lg px-3 text-xs font-extrabold', tab === id ? 'bg-primary/8 text-primary' : 'text-muted-foreground hover:bg-muted')}>{label}</button>)}</nav></header>
    {tab === 'info' ? <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]"><section className="rounded-2xl border border-border bg-card p-5 shadow-sm"><h3 className="text-sm font-extrabold">Descripción</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{activity.description || 'Sin descripción.'}</p>{activity.resources?.length ? <><h3 className="mt-5 text-sm font-extrabold">Recursos</h3><div className="mt-2 flex flex-wrap gap-2">{activity.resources.map((resource) => <span key={resource} className="rounded-lg border border-border px-3 py-2 text-xs font-bold">{resource}</span>)}</div></> : null}</section><section className="rounded-2xl border border-border bg-card p-5 shadow-sm"><h3 className="text-sm font-extrabold">Detalles</h3><dl className="mt-4 space-y-3 text-xs"><ActivityDefinition label="Período" value={periodName} /><ActivityDefinition label="Bloque" value={block?.shortName ?? 'Sin bloque'} /><ActivityDefinition label="Fecha" value={formatShortDate(activity.date)} /><ActivityDefinition label="Valor" value={`${activity.maxScore} puntos`} /><ActivityDefinition label="Modalidad" value={activity.activityType === 'group' ? 'Grupal' : 'Individual'} /><ActivityDefinition label="Estado" value={activityStatusLabel(status)} /></dl></section></div> : tab === 'instrument' ? <SubjectActivityPanel title="Instrumento"><p className="text-sm text-muted-foreground">{activityInstrumentLabel(activity.instrumentType)}</p>{activity.instrumentCriteria && Object.keys(activity.instrumentCriteria).length ? <dl className="mt-4 grid gap-3 sm:grid-cols-2">{Object.entries(activity.instrumentCriteria).map(([key, value]) => <div key={key} className="rounded-xl bg-muted/30 p-3"><dt className="text-[10px] font-extrabold uppercase text-muted-foreground">{key}</dt><dd className="mt-1 text-sm">{value}</dd></div>)}</dl> : null}</SubjectActivityPanel> : tab === 'participants' ? <SubjectActivityPanel title={activity.activityType === 'group' ? 'Equipos asignados' : 'Estudiantes asignados'}>{activity.activityType === 'group' ? selectedTeams.length ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{selectedTeams.map((team) => <div key={team.id} className="rounded-xl border border-border p-4"><strong>{team.name}</strong><p className="mt-1 text-xs text-muted-foreground">{team.members.length} integrantes</p></div>)}</div> : <p className="text-sm text-muted-foreground">No hay equipos vinculados.</p> : <p className="text-sm text-muted-foreground">{students.length} estudiantes de la asignatura.</p>}</SubjectActivityPanel> : tab === 'evaluation' ? <SubjectActivityPanel title="Evaluación de la actividad"><p className="text-sm text-muted-foreground">{graded} de {students.length} estudiantes calificados.</p><Link to={buildActivityGradingHref(assignmentId, courseId, activity.id, 'evaluate')} className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-extrabold text-primary-foreground"><ChartColumn className="size-4" /> Ir a evaluar / calificar</Link></SubjectActivityPanel> : <SubjectActivityPanel title="Historial"><p className="text-sm text-muted-foreground">La actividad está programada para {formatShortDate(activity.date)}. Los cambios de evaluación se conservan en su matriz específica.</p></SubjectActivityPanel>}
  </section>
}

function SubjectActivityPanel({ title, children }: { title: string; children: ReactNode }) { return <section className="rounded-2xl border border-border bg-card p-5 shadow-sm"><h3 className="mb-4 text-sm font-extrabold">{title}</h3>{children}</section> }
function ActivityDefinition({ label, value }: { label: string; value: string }) { return <div className="flex items-start justify-between gap-3"><dt className="font-bold">{label}</dt><dd className="max-w-44 text-right leading-5 text-muted-foreground">{value}</dd></div> }
function ActivityStatusBadge({ status }: { status: SubjectActivityStatus }) { const styles = status === 'graded' ? 'bg-emerald-50 text-emerald-700' : status === 'partial' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'; return <span className={cn('inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-extrabold', styles)}>{activityStatusLabel(status)}</span> }
function activityStatusLabel(status: SubjectActivityStatus) { return status === 'graded' ? 'Calificada' : status === 'partial' ? 'Parcialmente calificada' : 'Pendiente' }
function activityInstrumentLabel(value?: string) { return ({ rubrica: 'Rúbrica', 'lista-cotejo': 'Lista de cotejo', escala: 'Escala estimativa', 'lista-ponderada': 'Lista ponderada' } as Record<string, string>)[value ?? ''] ?? value ?? 'Sin instrumento' }
function buildActivityGradingHref(assignmentId: string, courseId: string, activityId: string | undefined, mode: 'edit' | 'evaluate') { return `/calificaciones?${new URLSearchParams({ sectionSubjectId: assignmentId, activityId: activityId ?? '', activityMode: mode, origin: 'subject', returnCourseId: courseId, returnSubjectId: assignmentId, returnTab: 'actividades' }).toString()}` }

function PlanningDisabledPanel({ onActivities }: { onActivities: () => void }) {
  return <section className="flex min-h-72 items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 text-center"><div className="max-w-lg"><span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground"><ClipboardList className="size-6" /></span><div className="mt-4 flex items-center justify-center gap-2"><h2 className="text-xl font-extrabold">Planificaciones</h2><span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-slate-500">Próximamente</span></div><p className="mt-3 text-sm leading-6 text-muted-foreground">Este módulo estará disponible próximamente. Mientras tanto, puedes crear y gestionar tus actividades desde el apartado Actividades.</p><Button className="mt-5" onClick={onActivities}>Ir a Actividades</Button></div></section>
}

export function EstudiantesTab({ students, loading, error, courseId, sectionId, canEnroll, gradingStudents, activities, gradeRecords, teams, journalCourse }: {
  students: StudentAttendanceRow[]
  loading: boolean
  error: string | null
  courseId: string | null
  sectionId: string
  canEnroll: boolean
  gradingStudents: StudentGradeRow[]
  activities: GradingActivity[]
  gradeRecords: GradeRecordRow[]
  teams: CourseTeam[]
  journalCourse: JournalCourseOption | null
}) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'team' | 'no-team' | 'pending'>('all')
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string | null>(null)
  const [journalStudentId, setJournalStudentId] = useState<string | null>(null)
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [journalLoading, setJournalLoading] = useState(false)
  const [journalError, setJournalError] = useState('')
  const [viewingJournal, setViewingJournal] = useState<JournalEntry | null>(null)
  const [editingJournal, setEditingJournal] = useState<JournalEntry | null>(null)
  const [deletingJournal, setDeletingJournal] = useState<JournalEntry | null>(null)
  const detailRef = useRef<HTMLDivElement>(null)
  const toggleStudent = (enrollmentId: string) => setSelectedEnrollmentId((current) => current === enrollmentId ? null : enrollmentId)
  const refreshJournal = useCallback(async () => {
    setJournalLoading(true)
    try {
      setJournalEntries(await getJournalEntries())
      setJournalError('')
    } catch (cause) {
      setJournalError(cause instanceof Error ? cause.message : 'No se pudieron cargar las observaciones.')
    } finally {
      setJournalLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!selectedEnrollmentId) return
    const frame = window.requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'nearest',
      })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [selectedEnrollmentId])

  useEffect(() => {
    if (selectedEnrollmentId) void refreshJournal()
  }, [refreshJournal, selectedEnrollmentId])

  if (loading) return <div className="flex min-h-[200px] items-center justify-center text-sm text-muted-foreground">Cargando estudiantes...</div>
  if (error) return <ErrorState message={error} />
  if (!students.length) {
    return (
      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="grid min-h-[330px] gap-8 px-6 py-10 md:grid-cols-[1.15fr_0.85fr] md:px-10">
          <div className="flex flex-col justify-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <UsersRound className="size-6" />
            </span>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-primary">Matrícula del curso</p>
            <h2 className="mt-2 max-w-lg text-2xl font-extrabold tracking-tight text-foreground">
              Este curso todavía no tiene estudiantes
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Matricula al primer estudiante o importa el listado completo. Cuando agregues la matrícula, aquí aparecerán sus datos y se habilitarán asistencia y calificaciones.
            </p>

            {canEnroll && courseId ? (
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to={`/estudiantes?courseId=${encodeURIComponent(courseId)}&action=new`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
                >
                  <Plus className="size-4" />
                  Matricular estudiante
                </Link>
                <Link
                  to={`/estudiantes?courseId=${encodeURIComponent(courseId)}&action=import`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-bold text-foreground transition-colors hover:bg-muted"
                >
                  <ClipboardList className="size-4" />
                  Importar listado
                </Link>
              </div>
            ) : null}
          </div>

          <aside className="flex flex-col justify-center rounded-2xl bg-muted/70 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Siguiente paso</p>
            <ol className="mt-5 space-y-5">
              <EmptyStep number="1" text="Agrega estudiantes individualmente o importa una lista." />
              <EmptyStep number="2" text="Registra la asistencia desde este mismo curso." />
              <EmptyStep number="3" text="Carga calificaciones y consulta el promedio del período." />
            </ol>
          </aside>
        </div>
      </section>
    )
  }

  const teamByEnrollment = new Map(teams.flatMap((team) => team.members.map((member) => [member.enrollmentId, team] as const)))
  const gradingByEnrollment = new Map(gradingStudents.map((student) => [student.enrollmentId, student]))
  const rows = students.map((student, index) => {
    const gradingStudent = gradingByEnrollment.get(student.enrollmentId)
    const records = gradeRecords.filter((record) => record.enrollmentId === student.enrollmentId && record.maxScore > 0)
    const activityRecords = activities.map((activity) => scoreForActivity(records, student.enrollmentId, activity.id)).filter((record): record is GradeRecordRow => Boolean(record))
    const earned = activityRecords.reduce((sum, record) => sum + record.score, 0)
    const possible = activityRecords.reduce((sum, record) => sum + record.maxScore, 0)
    const average = possible > 0 ? Math.round((earned / possible) * 100) : null
    const completed = activityRecords.length
    const progressStatus: 'Al día' | 'En progreso' | 'Sin actividad' = activities.length > 0 && completed >= activities.length
      ? 'Al día'
      : completed > 0
        ? 'En progreso'
        : 'Sin actividad'
    return {
      ...student,
      listNumber: gradingStudent?.listNumber ?? student.listNumber ?? index + 1,
      team: teamByEnrollment.get(student.enrollmentId) ?? null,
      records,
      completed,
      average,
      progressStatus,
    }
  })
  const normalizedSearch = search.trim().toLocaleLowerCase('es')
  const filteredRows = rows.filter((row) => {
    const matchesSearch = !normalizedSearch || `${row.firstName} ${row.lastName}`.toLocaleLowerCase('es').includes(normalizedSearch)
    const matchesFilter = filter === 'all'
      || (filter === 'team' && row.team)
      || (filter === 'no-team' && !row.team)
      || (filter === 'pending' && row.completed < activities.length)
    return matchesSearch && matchesFilter
  })
  const selected = rows.find((row) => row.enrollmentId === selectedEnrollmentId) ?? null
  const selectedJournalEntries = selected ? journalEntries.filter((entry) =>
    entry.status === 'ACTIVE'
    && entry.sectionSubjectId === courseId
    && entry.students.some(({ student }) => student.id === selected.studentId),
  ) : []
  const studentsWithPendingActivities = activities.length ? rows.filter((row) => row.completed < activities.length).length : 0
  const evaluatedRows = rows.filter((row) => row.average !== null)
  const courseAverage = evaluatedRows.length
    ? Math.round(evaluatedRows.reduce((sum, row) => sum + (row.average ?? 0), 0) / evaluatedRows.length)
    : null

  return (
    <div className="subject-students-tab space-y-4">
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StudentMetric icon={<UsersRound className="size-4" />} value={rows.length} label="Estudiantes matriculados" tone="bg-primary/10 text-primary" />
      <StudentMetric icon={<UsersRound className="size-4" />} value={teams.length} label="Equipos" tone="bg-success/10 text-success" />
      <StudentMetric icon={<ClipboardList className="size-4" />} value={studentsWithPendingActivities} label="Con actividades pendientes" tone="bg-primary/10 text-primary" />
      <StudentMetric icon={<ChartColumn className="size-4" />} value={courseAverage === null ? '—' : courseAverage} label="Promedio del curso" tone="bg-warning/20 text-foreground" />
    </div>
    <section className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-foreground">Estudiantes de la asignatura</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Consulta el progreso general y abre el detalle de cada estudiante.</p>
        </div>
        <button type="button" disabled title="Próximamente" className="inline-flex h-9 cursor-not-allowed items-center gap-2 rounded-lg border border-border px-3 text-xs font-bold text-muted-foreground opacity-70"><FileText className="size-4" /> Exportar</button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <label className="relative min-w-52 flex-1">
          <span className="sr-only">Buscar estudiante</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar estudiante..." className="h-10 w-full rounded-full border-0 bg-muted/70 pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/20" />
        </label>
        {([
          ['all', 'Todos'],
          ['team', 'Con equipo'],
          ['no-team', 'Sin equipo'],
          ['pending', 'Con pendientes'],
        ] as const).map(([value, label]) => (
          <button key={value} type="button" onClick={() => setFilter(value)} className={cn('h-8 rounded-full px-3 text-xs font-medium transition', filter === value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-primary')}>{label}</button>
        ))}
      </div>

      <div className={cn('mt-4 grid gap-4', selected && 'xl:grid-cols-[minmax(0,1fr)_21rem]')}>
        <div className="min-w-0 overflow-hidden rounded-3xl border border-border">
          <div className="overflow-x-auto md:overflow-x-hidden">
            <table className="w-full min-w-[720px] text-left text-xs md:min-w-0 md:table-fixed">
              <thead className="sticky top-0 z-10 border-b border-border bg-muted text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                <tr><th className="w-12 px-3 py-3 text-center">#</th><th className="px-3 py-3">Estudiante</th><th className="px-3 py-3">Equipo</th><th className="px-3 py-3">Actividades</th><th className="px-3 py-3">Promedio</th><th className="px-3 py-3">Asistencia</th><th className="px-3 py-3">Estado</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRows.map((row, index) => (
                  <tr key={row.enrollmentId} tabIndex={0} role="button" aria-expanded={selectedEnrollmentId === row.enrollmentId} aria-controls="subject-student-detail" onClick={() => toggleStudent(row.enrollmentId)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleStudent(row.enrollmentId) } }} className={cn('cursor-pointer text-foreground outline-none transition hover:bg-primary/[0.035] focus:bg-primary/[0.05]', selectedEnrollmentId === row.enrollmentId && 'bg-primary/[0.055]')}>
                    <td className="px-3 py-3 text-center font-bold text-muted-foreground">{index + 1}</td>
                    <td className="px-3 py-3 font-semibold">{row.lastName}, {row.firstName}</td>
                    <td className="px-3 py-3">{row.team ? <span className="font-semibold text-emerald-700">{row.team.name}</span> : <span className="text-muted-foreground">Sin equipo</span>}</td>
                    <td className="px-3 py-3"><span className="font-bold tabular-nums">{row.completed} / {activities.length}</span><div className="mt-1 h-1 w-20 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: activities.length ? `${Math.min(100, (row.completed / activities.length) * 100)}%` : '0%' }} /></div></td>
                    <td className="px-3 py-3 font-bold tabular-nums">{row.average === null ? '—' : `${row.average}%`}</td>
                    <td className="px-3 py-3 text-muted-foreground">—</td>
                    <td className="px-3 py-3"><StudentStatusBadge status={row.progressStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!filteredRows.length ? <p className="px-4 py-10 text-center text-sm text-muted-foreground">No hay estudiantes que coincidan con el filtro.</p> : null}
          <p className="border-t border-border px-3 py-2 text-[11px] text-muted-foreground">Mostrando {filteredRows.length} de {rows.length} estudiantes</p>
        </div>

        {selected ? <div ref={detailRef} id="subject-student-detail"><StudentDetailPanel student={selected} activities={activities} journalEntries={selectedJournalEntries} journalLoading={journalLoading} journalError={journalError} onRetryJournal={() => void refreshJournal()} onViewJournal={setViewingJournal} onJournal={() => setJournalStudentId(selected.studentId)} journalHref={`/bitacora?${new URLSearchParams({ sectionId, sectionSubjectId: courseId ?? '', studentId: selected.studentId }).toString()}`} onClose={() => setSelectedEnrollmentId(null)} /></div> : null}
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-primary/[0.035] px-4 py-3 text-xs text-muted-foreground"><Sparkles className="size-4 text-primary" /><span><strong className="text-foreground">Consejo rápido:</strong> haz clic en cualquier estudiante para ver su progreso detallado.</span></div>

      {journalStudentId && journalCourse ? <JournalForm
        entry={null}
        courses={[journalCourse]}
        initialSectionId={sectionId}
        initialSubjectId={courseId ?? ''}
        initialType="student_observation"
        initialStudentId={journalStudentId}
        onClose={() => setJournalStudentId(null)}
        onSaved={async () => { setJournalStudentId(null); await refreshJournal() }}
      /> : null}

      {viewingJournal ? <StudentJournalDetailModal entry={viewingJournal} onClose={() => setViewingJournal(null)} onEdit={() => { setEditingJournal(viewingJournal); setViewingJournal(null) }} onDelete={() => { setDeletingJournal(viewingJournal); setViewingJournal(null) }} /> : null}

      {editingJournal && journalCourse ? <JournalForm entry={editingJournal} courses={[journalCourse]} initialSectionId={sectionId} initialSubjectId={courseId ?? ''} initialStudentId="" onClose={() => setEditingJournal(null)} onSaved={async () => { setEditingJournal(null); await refreshJournal() }} /> : null}

      {deletingJournal ? <ConfirmDialog title="Eliminar observación permanentemente" description="Esta observación se borrará de la bitácora y no podrá recuperarse." confirmLabel="Eliminar permanentemente" destructive onClose={() => setDeletingJournal(null)} onConfirm={async () => { await deleteJournalEntry(deletingJournal.id); setDeletingJournal(null); await refreshJournal() }} /> : null}
    </section>
    </div>
  )
}

function StudentMetric({ icon, value, label, tone }: { icon: ReactNode; value: string | number; label: string; tone: string }) {
  return <div className="flex min-h-20 items-center gap-3 rounded-3xl border border-border bg-card px-4 py-3 shadow-sm"><span className={cn('grid size-10 shrink-0 place-items-center rounded-full', tone)}>{icon}</span><span><strong className="block text-lg font-semibold leading-none tabular-nums text-foreground">{value}</strong><span className="mt-1 block text-[11px] text-muted-foreground">{label}</span></span></div>
}

function StudentStatusBadge({ status }: { status: 'Al día' | 'En progreso' | 'Sin actividad' }) {
  return <span className={cn('inline-flex rounded-full px-2 py-1 text-[10px] font-bold', status === 'Al día' ? 'bg-emerald-50 text-emerald-700' : status === 'En progreso' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600')}>{status}</span>
}

function StudentDetailPanel({ student, activities, journalEntries, journalLoading, journalError, onRetryJournal, onViewJournal, onJournal, journalHref, onClose }: {
  student: StudentAttendanceRow & { team: CourseTeam | null; records: GradeRecordRow[]; completed: number; average: number | null; progressStatus: 'Al día' | 'En progreso' | 'Sin actividad' }
  activities: GradingActivity[]
  journalEntries: JournalEntry[]
  journalLoading: boolean
  journalError: string
  onRetryJournal: () => void
  onViewJournal: (entry: JournalEntry) => void
  onJournal: () => void
  journalHref: string
  onClose: () => void
}) {
  const blockAverages = competencyBlocks.map((block) => {
    const activityIds = new Set(activities.filter((activity) => activityAppliesToBlock(activity, block.id)).map((activity) => activity.id))
    const records = [...activityIds].map((activityId) => scoreForActivity(student.records, student.enrollmentId, activityId)).filter((record): record is GradeRecordRow => Boolean(record && record.maxScore > 0))
    return { ...block, average: records.length ? Math.round(records.reduce((sum, record) => sum + (record.score / record.maxScore) * 100, 0) / records.length) : null }
  })
  return (
    <aside className="rounded-xl border border-border bg-background p-4 shadow-sm" aria-label={`Detalle de ${student.firstName} ${student.lastName}`}>
      <div className="flex items-start justify-between gap-3"><div><h3 className="font-extrabold text-foreground">{student.firstName} {student.lastName}</h3><p className="mt-1 text-xs text-muted-foreground">{student.team?.name ?? 'Sin equipo'}</p></div><button type="button" onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Cerrar detalle"><X className="size-4" /></button></div>
      <div className="mt-4 grid grid-cols-3 gap-2"><DetailMetric value={`${student.completed}/${activities.length}`} label="Actividades" /><DetailMetric value={student.average === null ? '—' : `${student.average}%`} label="Promedio" /><DetailMetric value="—" label="Asistencia" /></div>
      <h4 className="mt-5 text-xs font-extrabold text-foreground">Promedio por bloque</h4>
      <div className="mt-2 grid grid-cols-2 gap-2">{blockAverages.map((block) => <div key={block.id} title={block.name} className="rounded-lg border border-border p-2 text-center"><strong className="block text-sm text-primary">{block.average === null ? '—' : `${block.average}%`}</strong><span className="mt-0.5 block text-[10px] text-muted-foreground">{block.shortName}</span></div>)}</div>
      <div className="mt-5 flex items-center justify-between"><h4 className="text-xs font-extrabold text-foreground">Actividades</h4><span className="text-[10px] text-muted-foreground">{activities.length} en total</span></div>
      <div className="mt-2 max-h-64 space-y-2 overflow-auto pr-1">
        {activities.length ? activities.map((activity) => {
          const record = scoreForActivity(student.records, student.enrollmentId, activity.id)
          const block = competencyBlocks.find((item) => item.id === activity.competencyBlockId)
          return <details key={activity.id} className="group rounded-lg border border-border bg-card"><summary className="cursor-pointer list-none p-2.5"><div className="flex items-center justify-between gap-2"><span className="min-w-0 truncate text-xs font-bold text-foreground">{activity.name}</span><span className={cn('shrink-0 text-[10px] font-bold', record ? 'text-primary' : 'text-muted-foreground')}>{record ? `${record.score}/${record.maxScore}` : 'Pendiente'}</span></div><p className="mt-1 text-[10px] text-muted-foreground">{block?.shortName ?? 'Sin bloque'}</p></summary><div className="border-t border-border px-2.5 py-2 text-[11px] text-muted-foreground">{record ? `Resultado: ${Math.round((record.score / record.maxScore) * 100)}%. ${record.status ?? 'Calificada'}.` : 'Esta actividad todavía no ha sido completada o calificada.'}</div></details>
        }) : <p className="rounded-lg bg-muted px-3 py-5 text-center text-xs text-muted-foreground">No hay actividades creadas.</p>}
      </div>
      <div className="mt-5 border-t border-border pt-4">
        <div className="flex items-center justify-between gap-2"><h4 className="text-xs font-extrabold text-foreground">Observaciones de bitácora</h4>{journalEntries.length ? <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-extrabold text-primary">{journalEntries.length}</span> : null}</div>
        {journalLoading ? <p className="mt-2 rounded-lg bg-muted/60 px-3 py-3 text-xs text-muted-foreground">Cargando observaciones…</p> : journalError ? <div className="mt-2 rounded-lg border border-destructive/25 bg-destructive/10 p-3"><p className="text-xs text-destructive">{journalError}</p><button type="button" onClick={onRetryJournal} className="mt-2 text-xs font-extrabold text-destructive underline-offset-2 hover:underline">Volver a intentar</button></div> : journalEntries.length ? <div className="mt-2 space-y-2">{journalEntries.slice(0, 2).map((entry) => <button key={entry.id} type="button" onClick={() => onViewJournal(entry)} aria-label={`Ver observación ${entry.title || journalEntryTypeLabel(entry.entryType)}`} className="group w-full rounded-xl border border-border bg-card p-3 text-left transition-[border-color,box-shadow] hover:border-primary/25 hover:shadow-sm"><div className="flex items-start gap-2"><span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><BookMarked className="size-4" aria-hidden="true" /></span><span className="min-w-0 flex-1"><strong className="block truncate text-xs text-foreground">{entry.title || journalEntryTypeLabel(entry.entryType)}</strong><span className="mt-1 line-clamp-2 block text-[11px] leading-4 text-muted-foreground">{entry.content}</span><span className="mt-2 block text-[10px] font-semibold text-primary">{formatJournalDate(entry.occurredAt)}</span></span><ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" /></div></button>)}{journalEntries.length > 2 ? <Link to={journalHref} className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl text-xs font-extrabold text-primary transition hover:bg-primary/[0.04] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"><BookOpen className="size-4" aria-hidden="true" /> Ver las {journalEntries.length} observaciones en Bitácora</Link> : null}</div> : <p className="mt-2 rounded-lg bg-muted/50 px-3 py-3 text-xs leading-5 text-muted-foreground">Todavía no hay observaciones para este estudiante en la asignatura.</p>}
      </div>
      <button type="button" onClick={onJournal} className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-border text-xs font-extrabold text-primary transition hover:bg-primary/[0.04]"><BookMarked className="size-4" aria-hidden="true" /> {journalEntries.length ? 'Agregar otra observación' : 'Agregar observación a bitácora'}</button>
    </aside>
  )
}

function StudentJournalDetailModal({ entry, onClose, onEdit, onDelete }: { entry: JournalEntry; onClose: () => void; onEdit: () => void; onDelete: () => void }) {
  return <Modal title={entry.title || journalEntryTypeLabel(entry.entryType)} description="Detalle de la observación registrada" icon={BookMarked} tone="info" className="max-w-2xl" onClose={onClose}>
    <article className="p-5 sm:p-6">
      <div className="flex flex-wrap gap-2 text-[11px] font-bold"><span className="rounded-full bg-primary/10 px-3 py-1.5 text-primary">{journalEntryTypeLabel(entry.entryType)}</span>{entry.requiresFollowUp ? <span className="rounded-full bg-warning/25 px-3 py-1.5 text-foreground">Requiere seguimiento</span> : null}</div>
      <dl className="mt-5 grid gap-3 rounded-2xl bg-muted/45 p-4 text-xs sm:grid-cols-2"><div><dt className="font-bold uppercase tracking-wide text-muted-foreground">Fecha</dt><dd className="mt-1 font-semibold text-foreground">{formatJournalDate(entry.occurredAt, true)}</dd></div><div><dt className="font-bold uppercase tracking-wide text-muted-foreground">Contexto</dt><dd className="mt-1 font-semibold text-foreground">{entry.section ? `${entry.section.grade.name} ${entry.section.name}` : 'Sin curso'}{entry.sectionSubject ? ` · ${entry.sectionSubject.subject.name}` : ''}</dd></div></dl>
      <div className="mt-5"><h4 className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">Observación</h4><p className="mt-2 whitespace-pre-wrap [overflow-wrap:anywhere] rounded-2xl border border-border bg-card p-4 text-sm leading-6 text-foreground">{entry.content}</p></div>
      {entry.tags.length ? <div className="mt-4 flex flex-wrap gap-2">{entry.tags.map((tag) => <span key={tag} className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">#{tag}</span>)}</div> : null}
      <footer className="mt-6 flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:items-center"><Button variant="destructive" onClick={onDelete}><Trash2 className="size-4" aria-hidden="true" /> Eliminar</Button><div className="flex flex-1 justify-end gap-2"><Button variant="outline" onClick={onClose}>Cerrar</Button><Button onClick={onEdit}><Edit3 className="size-4" aria-hidden="true" /> Editar observación</Button></div></footer>
    </article>
  </Modal>
}

function formatJournalDate(value: string, includeTime = false) {
  return new Date(value).toLocaleString('es', includeTime
    ? { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { day: 'numeric', month: 'short', year: 'numeric' })
}

function DetailMetric({ value, label }: { value: string; label: string }) {
  return <div className="rounded-lg bg-muted/70 px-2 py-2 text-center"><strong className="block text-sm text-foreground">{value}</strong><span className="text-[9px] font-semibold text-muted-foreground">{label}</span></div>
}

function EmptyStep({ number, text }: { number: string; text: string }) {
  return (
    <li className="flex items-start gap-3 text-sm leading-5 text-muted-foreground">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-card font-bold text-primary shadow-sm">{number}</span>
      <span className="pt-1">{text}</span>
    </li>
  )
}


function CalificacionesTab({ sectionSubjectId, schoolYearId, courseId, courseLabel, subjectName }: { sectionSubjectId: string | null; schoolYearId: string | null; courseId: string; courseLabel: string; subjectName: string }) {
  const [periods, setPeriods] = useState<Array<{ id: string; name: string }>>([])
  const [selectedPeriod, setSelectedPeriod] = useState<string>('')
  const [students, setStudents] = useState<StudentGradeRow[]>([])
  const [gradeRecords, setGradeRecords] = useState<GradeRecordRow[]>([])
  const [activities, setActivities] = useState<GradingActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string | null>(null)

  useEffect(() => {
    if (!schoolYearId || !sectionSubjectId) {
      setLoading(false)
      setError(sectionSubjectId ? 'No hay ano escolar activo.' : 'El curso no tiene asignatura asignada.')
      return
    }
    getAcademicPeriods()
      .then((data) => {
        setPeriods(data)
        if (data.length > 0) setSelectedPeriod(data[0].id)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Error al cargar periodos'))
      .finally(() => setLoading(false))
  }, [schoolYearId, sectionSubjectId])

  useEffect(() => {
    if (!selectedPeriod || !sectionSubjectId) return
    setLoading(true)
    setError(null)
    getGradingWorkspace({ sectionSubjectId, academicPeriodId: selectedPeriod, includeOptions: false })
      .then((data) => {
        setStudents(data.students)
        setGradeRecords(data.gradeRecords)
        setActivities(data.activities)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Error al cargar calificaciones'))
      .finally(() => setLoading(false))
  }, [selectedPeriod, sectionSubjectId])

  if (!sectionSubjectId) return <EmptyState title="Sin asignatura" description="Este curso no tiene una asignatura asignada." />
  if (error && !periods.length) return <ErrorState message={error} />

  const rows = buildCompactGradeRows(students, activities, gradeRecords)
  const evaluatedActivities = activities.filter((activity) => gradeRecords.some((record) => scoreForActivity([record], record.enrollmentId, activity.id))).length
  const studentsWithGrades = rows.filter((row) => row.average !== null)
  const courseAverage = studentsWithGrades.length
    ? Math.round(studentsWithGrades.reduce((sum, row) => sum + (row.average ?? 0), 0) / studentsWithGrades.length)
    : null
  const fullBookHref = buildSubjectGradingHref(sectionSubjectId, courseId)
  const createActivityHref = `${fullBookHref}&action=create-activity`

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-foreground">Libro de calificaciones</h2>
            <p className="mt-1 text-sm text-muted-foreground">Consulta el progreso del período y entra al espacio completo para evaluar.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {periods.length > 0 ? (
            <label className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Período</span>
          <select
            className="min-w-56 bg-transparent text-sm font-bold text-foreground outline-none"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            {periods.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
            </label>
          ) : null}
            <Link to={fullBookHref} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-extrabold text-primary-foreground shadow-sm transition hover:bg-primary-hover">
              <GraduationCap className="size-4" /> Abrir libro completo
            </Link>
          </div>
        </div>

        <div className="grid gap-px bg-slate-100 sm:grid-cols-2 xl:grid-cols-4">
          <CompactGradeMetric icon={<ClipboardList className="size-5" />} value={evaluatedActivities} label="Actividades evaluadas" detail={`${Math.max(activities.length - evaluatedActivities, 0)} pendientes`} tone="violet" />
          <CompactGradeMetric icon={<GraduationCap className="size-5" />} value={activities.length} label="Actividades creadas" detail="En este período" tone="blue" />
          <CompactGradeMetric icon={<ChartColumn className="size-5" />} value={courseAverage === null ? '—' : `${courseAverage}%`} label="Promedio del curso" detail={courseAverage === null ? 'Sin evaluar' : 'Período seleccionado'} tone="emerald" />
          <CompactGradeMetric icon={<UsersRound className="size-5" />} value={rows.filter((row) => row.average === null).length} label="Sin calificar" detail={`${students.length} estudiantes`} tone="orange" />
        </div>
      </section>

      {loading ? (
        <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-muted-foreground">Cargando calificaciones...</div>
      ) : error ? (
        <ErrorState message={error} />
      ) : activities.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-primary/20 bg-gradient-to-b from-white to-primary/[0.025] px-6 text-center">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-600"><ClipboardList className="size-7" /></span>
          <h3 className="mt-4 text-lg font-extrabold text-foreground">Aún no hay actividades para calificar</h3>
          <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">Crea una actividad, asígnala a su bloque de competencias y utiliza su instrumento para registrar las calificaciones.</p>
          <Link to={createActivityHref} className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-extrabold text-primary-foreground shadow-sm transition hover:bg-primary-hover">
            <Plus className="size-4" /> Crear primera actividad
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div><h3 className="text-sm font-extrabold">Progreso por estudiante</h3><p className="mt-1 text-xs text-muted-foreground">Promedios calculados a partir de las actividades registradas.</p></div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{students.length} estudiantes</span>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full min-w-[68rem] text-left text-sm">
            <thead className="border-b border-border bg-slate-50 text-[11px] font-extrabold uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="w-16 px-5 py-3 text-center">#</th>
                <th className="min-w-64 px-5 py-3">Estudiante</th>
                {competencyBlocks.map((block) => <th key={block.id} title={block.name} className="w-28 px-3 py-3 text-center">{block.shortName}</th>)}
                <th className="w-28 px-3 py-3 text-center">Período</th>
                <th className="w-36 px-5 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.enrollmentId} role="button" tabIndex={0} aria-label={`Abrir detalle de calificaciones de ${row.firstName} ${row.lastName}`} onClick={() => setSelectedEnrollmentId(row.enrollmentId)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedEnrollmentId(row.enrollmentId) } }} className="cursor-pointer text-foreground transition hover:bg-primary/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
                  <td className="px-5 py-4 text-center font-bold text-muted-foreground">{row.listNumber}</td>
                  <td className="px-5 py-4 font-bold">{row.lastName}, {row.firstName}</td>
                  {competencyBlocks.map((block) => <td key={block.id} className="px-3 py-4 text-center"><GradeValue value={row.blockAverages[block.id]} /></td>)}
                  <td className="px-3 py-4 text-center"><GradeValue value={row.average} emphasized /></td>
                  <td className="px-5 py-4"><GradeStatus status={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
      {selectedEnrollmentId ? <StudentGradesDrawer student={students.find((item) => item.enrollmentId === selectedEnrollmentId) ?? null} students={students} row={rows.find((item) => item.enrollmentId === selectedEnrollmentId) ?? null} activities={activities} records={gradeRecords} courseLabel={courseLabel} subjectName={subjectName} periodName={periods.find((item) => item.id === selectedPeriod)?.name ?? 'Período actual'} onStudentChange={setSelectedEnrollmentId} onClose={() => setSelectedEnrollmentId(null)} /> : null}
    </div>
  )
}

function StudentGradesDrawer({ student, students, row, activities, records, courseLabel, subjectName, periodName, onStudentChange, onClose }: {
  student: StudentGradeRow | null
  students: StudentGradeRow[]
  row: CompactGradeRow | null
  activities: GradingActivity[]
  records: GradeRecordRow[]
  courseLabel: string
  subjectName: string
  periodName: string
  onStudentChange: (enrollmentId: string) => void
  onClose: () => void
}) {
  const [blockId, setBlockId] = useState<(typeof competencyBlocks)[number]['id']>(competencyBlocks[0].id)
  const [activityId, setActivityId] = useState<string | null>(null)
  const [showInstrument, setShowInstrument] = useState(false)
  useEffect(() => { setActivityId(null); setShowInstrument(false) }, [student?.enrollmentId])
  if (!student || !row) return null
  const block = competencyBlocks.find((item) => item.id === blockId) ?? competencyBlocks[0]
  const blockActivities = activities.filter((activity) => activityAppliesToBlock(activity, block.id))
  const selectedActivity = activities.find((activity) => activity.id === activityId) ?? null
  const selectedRecord = selectedActivity ? scoreForActivity(records, student.enrollmentId, selectedActivity.id) : null

  return <Modal title="Detalle de calificaciones" description="Consulta cómo se construyeron las calificaciones de este estudiante en la asignatura." onClose={onClose} overlayClassName="items-stretch justify-end p-0" className="h-full max-h-none max-w-4xl rounded-none border-y-0 border-r-0" contentClassName="bg-muted/10 p-5">
    <div className="space-y-4">
      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start"><span className="grid size-12 shrink-0 place-items-center rounded-full bg-blue-100 font-black text-primary">{student.firstName.charAt(0)}{student.lastName.charAt(0)}</span><div className="min-w-0 flex-1"><h3 className="font-extrabold">{student.lastName}, {student.firstName}</h3><p className="mt-1 text-xs text-muted-foreground">N.º de lista: {String(student.listNumber ?? row.listNumber).padStart(2, '0')}{student.studentCode ? ` · Matrícula: ${student.studentCode}` : ''}</p><p className="mt-1 text-xs text-muted-foreground">Curso: {courseLabel} · Asignatura: {subjectName}</p><p className="mt-1 text-xs font-bold text-primary">Período: {periodName}</p></div><label className="grid min-w-56 gap-1 text-[10px] font-extrabold uppercase text-muted-foreground">Cambiar estudiante<select aria-label="Cambiar estudiante" value={student.enrollmentId} onChange={(event) => onStudentChange(event.target.value)} className="h-11 rounded-xl border border-border bg-card px-3 text-xs font-bold text-foreground">{students.map((item) => <option key={item.enrollmentId} value={item.enrollmentId}>{item.lastName}, {item.firstName}</option>)}</select></label></div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm"><div className="grid grid-cols-2 gap-2 sm:grid-cols-5">{competencyBlocks.map((item) => <GradeSummaryTile key={item.id} label={item.shortName} value={row.blockAverages[item.id]} />)}<GradeSummaryTile label="Promedio" value={row.average} emphasized /></div></section>

      {selectedActivity ? <StudentActivityDetail activity={selectedActivity} record={selectedRecord} studentName={`${student.firstName} ${student.lastName}`} showInstrument={showInstrument} onInstrument={() => setShowInstrument(true)} onBack={() => { if (showInstrument) setShowInstrument(false); else setActivityId(null) }} /> : <>
        <nav className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm sm:grid-cols-4" aria-label="Bloques de competencia">{competencyBlocks.map((item) => <button key={item.id} type="button" aria-pressed={block.id === item.id} onClick={() => setBlockId(item.id)} className={cn('h-11 rounded-xl px-3 text-xs font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', block.id === item.id ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>{item.shortName}</button>)}</nav>
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"><header className="border-b border-border bg-primary/[0.025] p-4"><p className="text-[10px] font-black uppercase tracking-wider text-primary">{block.shortName}</p><h3 className="mt-1 font-extrabold">{block.name}</h3><p className="mt-2 text-sm font-bold text-muted-foreground">Calificación del bloque: <strong className="text-primary">{row.blockAverages[block.id] === null ? 'Sin evaluar' : `${row.blockAverages[block.id]} / 100`}</strong></p></header><div className="p-4"><h4 className="mb-3 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Actividades</h4>{blockActivities.length ? <div className="space-y-2">{blockActivities.map((activity) => { const record = scoreForActivity(records, student.enrollmentId, activity.id); return <button key={activity.id} type="button" onClick={() => setActivityId(activity.id)} className="flex min-h-16 w-full items-center gap-3 rounded-xl border border-border px-4 py-3 text-left transition hover:border-primary/30 hover:bg-primary/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600"><ClipboardList className="size-4" /></span><span className="min-w-0 flex-1"><strong className="block truncate text-sm">{activity.name}</strong><span className="mt-1 block text-xs text-muted-foreground">{record ? `${record.score} / ${record.maxScore}` : `— / ${activity.maxScore}`} · {activityGradeState(record, activity)}</span></span><ChevronRight className="size-4 shrink-0 text-muted-foreground" /></button> })}</div> : <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">Aún no hay actividades registradas en este bloque.</p>}</div></section>
      </>}
    </div>
  </Modal>
}

function GradeSummaryTile({ label, value, emphasized }: { label: string; value: number | null; emphasized?: boolean }) { return <div className={cn('rounded-xl border p-3 text-center', emphasized ? 'border-primary/20 bg-primary/[0.04]' : 'border-border bg-muted/20')}><span className="block text-[10px] font-extrabold text-muted-foreground">{label}</span><strong className={cn('mt-1 block text-xl', emphasized ? 'text-primary' : 'text-foreground')}>{value === null ? '—' : value}</strong></div> }

function StudentActivityDetail({ activity, record, studentName, showInstrument, onInstrument, onBack }: { activity: GradingActivity; record: GradeRecordRow | null; studentName: string; showInstrument: boolean; onInstrument: () => void; onBack: () => void }) {
  const block = competencyBlocks.find((item) => item.id === activity.competencyBlockId) ?? competencyBlocks[0]
  if (showInstrument) return <EvaluatedInstrument activity={activity} record={record} studentName={studentName} onBack={onBack} />
  return <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"><header className="flex items-start gap-3 border-b border-border p-4"><button type="button" onClick={onBack} aria-label="Volver a las actividades" className="grid size-11 shrink-0 place-items-center rounded-xl border border-border text-primary hover:bg-muted"><BackIcon /></button><div className="min-w-0 flex-1"><p className="text-[10px] font-black uppercase tracking-wider text-primary">Detalle de la actividad</p><h3 className="mt-1 text-lg font-extrabold">{activity.name}</h3><p className="mt-1 text-xs text-muted-foreground">{block.shortName} · {block.name}</p></div><ActivityStatusBadge status={record ? 'graded' : 'pending'} /></header><div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_18rem]"><div><h4 className="text-xs font-extrabold uppercase text-muted-foreground">Descripción</h4><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">{activity.description || 'Sin descripción registrada.'}</p></div><dl className="space-y-3 rounded-xl bg-muted/25 p-4 text-xs"><ActivityDefinition label="Fecha" value={formatShortDate(activity.date)} /><ActivityDefinition label="Valor total" value={`${activity.maxScore} puntos`} /><ActivityDefinition label="Obtenido" value={record ? `${record.score} puntos` : 'Sin evaluar'} /><ActivityDefinition label="Estado" value={activityGradeState(record, activity)} /><ActivityDefinition label="Instrumento" value={activityInstrumentLabel(activity.instrumentType)} /></dl></div><footer className="flex justify-end border-t border-border p-4"><Button variant="outline" disabled={!record || !activity.instrumentType} onClick={onInstrument}><ClipboardList className="size-4" /> Ver instrumento evaluado</Button></footer></section>
}

function EvaluatedInstrument({ activity, record, studentName, onBack }: { activity: GradingActivity; record: GradeRecordRow | null; studentName: string; onBack: () => void }) {
  const configuration = activityRubricConfiguration(activity)
  const result = record?.instrumentResult
  const complete = Boolean(result && result.selections.length === configuration.criteria.length)
  return <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"><header className="flex items-start gap-3 border-b border-border p-4"><button type="button" onClick={onBack} aria-label="Volver al detalle de la actividad" className="grid size-11 shrink-0 place-items-center rounded-xl border border-border text-primary hover:bg-muted"><BackIcon /></button><div className="min-w-0 flex-1"><p className="text-[10px] font-black uppercase tracking-wider text-primary">Instrumento evaluado</p><h3 className="mt-1 text-lg font-extrabold">{activityInstrumentLabel(activity.instrumentType)}</h3><p className="mt-1 text-xs text-muted-foreground">{activity.name} · {studentName}</p></div><span className={cn('rounded-full px-3 py-1 text-[10px] font-extrabold', complete ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800')}>{complete ? 'Evaluado' : 'Sin desglose'}</span></header>{!record ? <p className="m-4 rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">Pendiente de evaluación.</p> : !result ? <div className="m-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"><strong className="block">No existe evidencia por criterio para esta calificación histórica.</strong>El sistema conserva el total real de {record.score} / {record.maxScore}, pero no inventará niveles ni selecciones que no fueron registrados.</div> : <div className="p-4"><div className="overflow-x-auto"><table className="w-full min-w-[36rem] text-sm"><thead className="bg-muted/30 text-[10px] font-black uppercase tracking-wide text-muted-foreground"><tr><th className="px-4 py-3 text-left">Criterio</th><th className="px-4 py-3 text-left">Nivel seleccionado</th><th className="px-4 py-3 text-right">Puntuación</th></tr></thead><tbody className="divide-y divide-border">{configuration.criteria.map((criterion, index) => { const selection = result.selections[index]; const level = Number.isInteger(selection) ? configuration.levels[selection] : null; const points = result.criterionScores[index]; return <tr key={`${criterion.title}-${index}`}><td className="px-4 py-4"><strong>{criterion.title}</strong><span className="mt-1 block text-xs text-muted-foreground">Máximo: {criterion.maximum} pts</span></td><td className="px-4 py-4"><span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-bold', level ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600')}>{level?.label ?? 'Sin seleccionar'}</span></td><td className="px-4 py-4 text-right font-extrabold text-primary">{Number.isFinite(points) ? `${points} / ${criterion.maximum}` : '—'}</td></tr> })}</tbody></table></div><div className="mt-4 flex items-center justify-between rounded-xl bg-primary/[0.045] px-4 py-3"><strong>Total</strong><strong className="text-xl text-primary">{record.score} / {record.maxScore}</strong></div></div>}</section>
}

function activityGradeState(record: GradeRecordRow | null, activity: GradingActivity) { if (!record) return 'Pendiente de evaluación'; const expected = activityRubricConfiguration(activity).criteria.length; if (record.instrumentResult && record.instrumentResult.selections.length < expected) return 'Parcialmente evaluada'; return 'Evaluada' }

function buildSubjectGradingHref(sectionSubjectId: string, returnCourseId: string) {
  return `/calificaciones?${new URLSearchParams({ sectionSubjectId, origin: 'subject', returnCourseId, returnSubjectId: sectionSubjectId }).toString()}`
}

function CompactGradeMetric({ icon, value, label, detail, tone }: { icon: ReactNode; value: string | number; label: string; detail: string; tone: 'violet' | 'blue' | 'emerald' | 'orange' }) {
  const tones = { violet: 'bg-violet-50 text-violet-600', blue: 'bg-blue-50 text-blue-600', emerald: 'bg-emerald-50 text-emerald-600', orange: 'bg-orange-50 text-orange-600' }
  return <div className="flex items-center gap-3 bg-white px-5 py-4"><span className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl', tones[tone])}>{icon}</span><span><strong className="block text-2xl leading-none">{value}</strong><span className="mt-1.5 block text-xs font-extrabold">{label}</span><span className="mt-0.5 block text-[10px] text-muted-foreground">{detail}</span></span></div>
}

function GradeValue({ value, emphasized = false }: { value: number | null; emphasized?: boolean }) {
  if (value === null) return <span className="font-bold text-slate-400">—</span>
  return <span className={cn('inline-flex min-w-12 justify-center rounded-lg px-2.5 py-1.5 font-extrabold', emphasized ? 'bg-primary/8 text-primary' : value >= 70 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700')}>{value}%</span>
}

function GradeStatus({ status }: { status: CompactGradeRow['status'] }) {
  const styles = status === 'Calificado' ? 'bg-emerald-50 text-emerald-700' : status === 'En proceso' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
  return <span className={cn('inline-flex rounded-full px-3 py-1 text-[11px] font-extrabold', styles)}>{status}</span>
}

const CourseCard = memo(function CourseCard({
  item,
  canManage,
  onOpen,
  onAddSection,
  onEditSection,
  onDeleteSection,
  onAssignSubject,
}: {
  item: CourseCardItem
  canManage: boolean
  onOpen: (id: string) => void
  onAddSection: (grade: GradeWithSections) => void
  onEditSection: (grade: GradeWithSections, sectionId: string) => void
  onDeleteSection: (section: Section) => void
  onAssignSubject: (grade: GradeWithSections, sectionId: string) => void
}) {
  const levelStyle = getLevelStyle(item.levelName)
  const teamCount = item.section.teamCount ?? 0
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen])
  const gradeNumber = item.grade.name.replace('.º', '').replace('º', '')

  return (
    <article
      className="course-list-card group relative flex min-w-0 flex-col rounded-3xl border bg-card p-5"
    >
      <div
        className="flex flex-1 cursor-pointer flex-col"
        role="button"
        tabIndex={0}
        onClick={() => onOpen(item.id)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onOpen(item.id)
          }
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground shadow-sm"
              style={{ backgroundColor: levelStyle.color }}
            >
              {gradeNumber}
              <span className="ml-px text-xs font-bold opacity-80">{item.section.name}</span>
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-base font-black tracking-tight text-foreground">
                {item.grade.name} {item.section.name}
              </h3>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {item.cycleName} · {cleanLevelName(item.levelName)}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <StatusBadge tone={item.archived ? 'neutral' : 'success'} className="h-6 uppercase">{item.archived ? 'Archivado' : 'Activo'}</StatusBadge>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {([[UsersRound, item.section.studentCount ?? 0, 'estudiantes'], [BookOpen, item.assignments.length, 'asignaturas'], [UsersRound, teamCount, 'equipos']] as const).map(([Icon, value, label]) => (
            <span key={label} className="flex min-w-0 flex-col items-center rounded-3xl bg-muted/70 px-1 py-2.5"><Icon className="size-3.5 text-muted-foreground" /><strong className="mt-0.5 text-sm font-extrabold leading-4 tabular-nums text-foreground">{value}</strong><span className="text-[10px] text-muted-foreground">{label}</span></span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground"><span>Asistencia promedio</span><span aria-label="Asistencia sin datos">—</span></div>
        <ProgressIndicator value={0} tone="neutral" className="mt-1.5 h-1.5" />
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button type="button" onClick={() => onOpen(item.id)} className="flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full bg-primary/10 px-4 text-sm font-semibold text-primary transition hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Entrar al curso <ChevronRight className="size-4" /></button>
        {canManage ? (
          <div className="relative" ref={menuRef}>
            <button type="button" title="Más acciones" className="inline-flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition hover:bg-primary/10 hover:text-primary" aria-label="Más acciones" aria-haspopup="menu" aria-expanded={menuOpen} onClick={(event) => { event.stopPropagation(); setMenuOpen((open) => !open) }}>
              <MoreHorizontal className="size-4" />
            </button>
            {menuOpen ? (
              <div role="menu" className="absolute bottom-10 right-0 z-20 w-52 origin-bottom-right overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-xl motion-safe:animate-[fadeIn_140ms_ease-out]">
                <button role="menuitem" type="button" onClick={() => { setMenuOpen(false); onAddSection(item.grade) }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold transition-colors hover:bg-muted"><Plus className="size-4" /> Nueva sección</button>
                <button role="menuitem" type="button" onClick={() => { setMenuOpen(false); onEditSection(item.grade, item.section.id) }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold transition-colors hover:bg-muted"><CheckSquare className="size-4" /> Editar sección</button>
                <button role="menuitem" type="button" onClick={() => { setMenuOpen(false); onAssignSubject(item.grade, item.section.id) }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold transition-colors hover:bg-muted"><BookOpen className="size-4" /> Asignar asignatura</button>
                <div className="my-1 border-t border-border" />
                <button role="menuitem" type="button" onClick={() => { setMenuOpen(false); onDeleteSection(item.section) }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold transition-colors hover:bg-muted"><Power className="size-4" /> Inactivar sección</button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  )
})

function buildCourseCards(grades: GradeWithSections[]): CourseCardItem[] {
  return grades.flatMap((grade) =>
    grade.sections.map((section) => {
      const levelName = grade.academicLevelName ?? grade.level ?? 'Sin nivel definido'
      const cycleName = grade.academicCycleName ?? 'Sin ciclo'
      const activeAssignments = section.assignments.filter((assignment) => assignment.status === 'active')

      return {
        id: section.id,
        grade,
        section,
        assignments: activeAssignments,
        assignment: null,
        subjectName: '',
        levelName,
        cycleName,
        archived: grade.status !== 'active' || section.status !== 'active',
      }
    }),
  )
}

function cleanLevelName(value: string) {
  return value.replace(/^nivel\s+/i, '').trim()
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)))
}

function toSafeCount(value: unknown) {
  const numericValue = Number(value)
  return Number.isFinite(numericValue) && numericValue >= 0 ? numericValue : 0
}

function formatRelativeAttendance(value: string | null) {
  if (!value) return 'Sin registro'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Sin registro'
  date.setHours(0, 0, 0, 0)
  const days = Math.floor((startOfToday() - date.getTime()) / 86_400_000)
  if (days <= 0) return 'Hoy'
  if (days === 1) return '1 día'
  return `${days} días`
}

function getCourseCompactLabel(gradeName: string, sectionName: string) {
  return `${gradeName.match(/\d+/)?.[0] ?? gradeName}${sectionName}`.trim()
}

function getSubjectIcon(subjectName: string, appearanceIcon?: string | null) {
  if (appearanceIcon) return getAppearanceIcon(appearanceIcon)
  const normalized = normalizeText(subjectName)
  if (normalized.includes('matemat') || normalized.includes('algebra') || normalized.includes('geometr')) return <Calculator className="size-5" />
  if (normalized.includes('ciencias de la naturaleza')) return <Leaf className="size-5" />
  if (normalized.includes('biolog') || normalized.includes('genet')) return <Dna className="size-5" />
  if (normalized.includes('quim')) return <FlaskConical className="size-5" />
  if (normalized.includes('fisic') && !normalized.includes('educacion fisica')) return <Atom className="size-5" />
  if (normalized.includes('natural') || normalized.includes('ecolog') || normalized.includes('vida')) return <Leaf className="size-5" />
  if (normalized.includes('social') || normalized.includes('historia') || normalized.includes('geograf')) return <Landmark className="size-5" />
  if (normalized.includes('relig') || normalized.includes('formacion integral') || normalized.includes('etica')) return <HandHeart className="size-5" />
  if (normalized.includes('educacion fisica') || normalized.includes('deporte')) return <Dumbbell className="size-5" />
  if (normalized.includes('ingles') || normalized.includes('frances') || normalized.includes('idioma')) return <Languages className="size-5" />
  if (normalized.includes('art') || normalized.includes('plastica')) return <PaletteIcon className="size-5" />
  if (normalized.includes('informat') || normalized.includes('tecnolog') || normalized.includes('comput')) return <Laptop className="size-5" />
  if (normalized.includes('musica')) return <Music2 className="size-5" />
  if (normalized.includes('psicomot')) return <Footprints className="size-5" />
  return <BookOpen className="size-5" />
}

function getAppearanceIcon(value: string) {
  switch (value) {
    case 'atom': return <Atom className="size-5" />
    case 'baby': return <Baby className="size-5" />
    case 'binary': return <Binary className="size-5" />
    case 'book-marked': return <BookMarked className="size-5" />
    case 'bot': return <Bot className="size-5" />
    case 'brain': return <Brain className="size-5" />
    case 'briefcase': return <BriefcaseBusiness className="size-5" />
    case 'building': return <Building2 className="size-5" />
    case 'calculator': return <Calculator className="size-5" />
    case 'camera': return <Camera className="size-5" />
    case 'chart': return <ChartColumn className="size-5" />
    case 'code': return <Code2 className="size-5" />
    case 'cooking-pot': return <CookingPot className="size-5" />
    case 'cross': return <Cross className="size-5" />
    case 'dna': return <Dna className="size-5" />
    case 'dumbbell': return <Dumbbell className="size-5" />
    case 'earth': return <Earth className="size-5" />
    case 'footprints': return <Footprints className="size-5" />
    case 'gavel': return <Gavel className="size-5" />
    case 'globe': return <Globe2 className="size-5" />
    case 'guitar': return <Guitar className="size-5" />
    case 'hammer': return <Hammer className="size-5" />
    case 'hand-heart': return <HandHeart className="size-5" />
    case 'heart-pulse': return <HeartPulse className="size-5" />
    case 'landmark': return <Landmark className="size-5" />
    case 'languages': return <Languages className="size-5" />
    case 'laptop': return <Laptop className="size-5" />
    case 'leaf': return <Leaf className="size-5" />
    case 'flask': return <FlaskConical className="size-5" />
    case 'microscope': return <Microscope className="size-5" />
    case 'music': return <Music2 className="size-5" />
    case 'palette': return <PaletteIcon className="size-5" />
    case 'pen-tool': return <PenTool className="size-5" />
    case 'plane': return <Plane className="size-5" />
    case 'presentation': return <Presentation className="size-5" />
    case 'puzzle': return <Puzzle className="size-5" />
    case 'scroll-text': return <ScrollText className="size-5" />
    case 'shield-check': return <ShieldCheck className="size-5" />
    case 'sprout': return <Sprout className="size-5" />
    case 'stethoscope': return <Stethoscope className="size-5" />
    case 'telescope': return <Telescope className="size-5" />
    case 'theater': return <Theater className="size-5" />
    case 'wrench': return <Wrench className="size-5" />
    default: return <BookOpen className="size-5" />
  }
}

function getAssignmentPalette(assignment: SectionSubjectAssignment): SubjectPalette {
  return getSubjectColor(assignment.subjectName, assignment.appearanceColor)
}

function startOfToday() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today.getTime()
}

function applyCourseFilters(
  items: CourseCardItem[],
  filters: CourseAdvancedFilters,
  searchValue: string,
) {
  const filtered = items.filter((item) => {
    const students = item.section.studentCount ?? 0
    const teams = item.section.teamCount ?? 0

    if (!matchesCourseSearch(item, searchValue)) return false
    if (!matchesCourseStateFilters(
      { archived: item.archived, studentCount: students, teamCount: teams },
      filters,
    )) return false
    if (filters.level !== 'all' && item.levelName !== filters.level) return false
    if (filters.cycle !== 'all' && item.cycleName !== filters.cycle) return false
    if (filters.subject !== 'all' && !item.assignments.some((assignment) => assignment.subjectName === filters.subject)) return false
    if (filters.grade !== 'all' && item.grade.id !== filters.grade) return false
    if (!matchesSectionFilter(item.section.name, filters.section)) return false
    return true
  })

  const compareName = (left: CourseCardItem, right: CourseCardItem) =>
    `${left.grade.name} ${left.section.name}`.localeCompare(
      `${right.grade.name} ${right.section.name}`,
      'es',
      { numeric: true },
    )
  const compareGrade = (left: CourseCardItem, right: CourseCardItem) =>
    (left.grade.sequence ?? Number.MAX_SAFE_INTEGER) - (right.grade.sequence ?? Number.MAX_SAFE_INTEGER)
      || left.section.name.localeCompare(right.section.name, 'es', { numeric: true })

  return [...filtered].sort((left, right) => {
    switch (filters.sortBy) {
      case 'name': return compareName(left, right)
      case 'grade': return compareGrade(left, right)
      case 'students': return (right.section.studentCount ?? 0) - (left.section.studentCount ?? 0)
      case 'newest': return new Date(right.section.updatedAt).getTime() - new Date(left.section.updatedAt).getTime()
      case 'oldest': return new Date(left.section.createdAt).getTime() - new Date(right.section.createdAt).getTime()
      default: return 0
    }
  })
}

function groupCoursesByCycle(items: CourseCardItem[]) {
  const groups = new Map<string, CourseCardItem[]>()
  items.forEach((item) => groups.set(item.cycleName, [...(groups.get(item.cycleName) ?? []), item]))
  return Array.from(groups, ([name, cycleItems]) => ({ name, items: cycleItems }))
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
