import {
  AlertCircle,
  Archive,
  ArchiveRestore,
  ArrowLeft,
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
import { memo, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
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
import type { CourseAdvancedFilters } from '@/modules/courses/components/CoursesAdvancedFiltersDrawer'
import { getClassAttendanceHistory, getCurrentAcademicPeriodId, getStudentsBySection, upsertAttendance, type ClassAttendanceHistoryRecord } from '@/modules/attendance/services/attendanceService'
import type { MonthlyAttendanceMark, StudentAttendanceRow } from '@/modules/attendance/types'
import { markToStatus, sortStudentsForRoster, statusToMark } from '@/modules/attendance/utils/monthlyAttendance'
import { getAcademicPeriods, getGradingWorkspace } from '@/modules/grading/services/gradingService'
import type { AcademicPeriodOpt, GradeRecordRow, GradingActivity, StudentGradeRow } from '@/modules/grading/types'
import { activityRubricConfiguration } from '@/modules/grading/components/GradingBook'
import {
  buildCompactGradeRows,
  competencyBlocks,
  scoreForActivity,
  type CompactGradeRow,
} from '@/modules/grading/utils/competencyGrades'
import { getPlanningEntries } from '@/modules/planning/services/planningService'
import { getScheduleEntries } from '@/modules/schedule/services/scheduleService'
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
  buildCycleFilterOptions,
  filterCourseOptionItems,
  matchesCourseSearch,
  matchesCourseStateFilters,
  matchesSectionFilter,
} from '@/modules/courses/utils/courseFilterOptions'
import { buildSubjectAttendanceHref } from '@/modules/courses/utils/subjectNavigation'
import { cn } from '@/utils/cn'
import { getSubjectPalette as getSubjectColor, type SubjectPalette } from '@/utils/subjectPalette'

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
  'Primaria': { color: '#4AA2E3', soft: 'rgb(74 162 227 / 0.12)' },
  'Secundaria': { color: '#6f3cc3', soft: 'hsl(262 52% 47% / 0.08)' },
}

const defaultLevelStyle = { color: '#4AA2E3', soft: 'rgb(74 162 227 / 0.12)' }

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
  const [cycleFilter, setCycleFilter] = useState('all')
  const [subjectFilter, setSubjectFilter] = useState('all')
  const advancedFilters = defaultAdvancedFilters
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
    cycle: cycleFilter,
    subject: subjectFilter,
  }), [cycleFilter, levelFilter, subjectFilter])
  const filteredCourseCards = useMemo(
    () => applyCourseFilters(courseCards, appliedCourseFilters, debouncedSearch),
    [appliedCourseFilters, courseCards, debouncedSearch],
  )
  const levelFilters = useMemo(() => uniqueValues(filterOptionCourseCards.map((item) => item.levelName)), [filterOptionCourseCards])
  const cycleFilterItems = useMemo(
    () => filterCourseOptionItems(filterOptionCourseCards, { level: levelFilter }),
    [filterOptionCourseCards, levelFilter],
  )
  const cycleFilters = useMemo(() => buildCycleFilterOptions(cycleFilterItems), [cycleFilterItems])
  const subjectFilterItems = useMemo(
    () => filterCourseOptionItems(filterOptionCourseCards, { level: levelFilter, cycle: cycleFilter }),
    [cycleFilter, filterOptionCourseCards, levelFilter],
  )
  const subjectFilters = useMemo(
    () => uniqueValues(subjectFilterItems.flatMap((item) => item.assignments.map((assignment) => assignment.subjectName))),
    [subjectFilterItems],
  )
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
          <h1 className="sr-only">Mis cursos</h1>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-between">
          {canManage ? (
            <div className="order-2 flex shrink-0 items-start justify-end">
              <details className="group relative">
                <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-xl bg-primary px-4 text-sm font-extrabold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 [&::-webkit-details-marker]:hidden">
                  Acciones <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
                </summary>
                <div className="absolute right-0 z-30 mt-2 w-52 rounded-2xl border border-border bg-card p-1.5 shadow-xl">
                  <button type="button" onClick={openCreateSectionFromActions} className="flex min-h-10 w-full items-center gap-2 rounded-xl px-3 text-left text-sm font-bold transition hover:bg-muted">
                    <Plus className="size-4 text-primary" /> Nueva sección
                  </button>
                  <button type="button" onClick={openCreateAssignmentFlow} className="flex min-h-10 w-full items-center gap-2 rounded-xl px-3 text-left text-sm font-bold transition hover:bg-muted">
                    <Plus className="size-4 text-primary" /> Nuevo curso
                  </button>
                </div>
              </details>
            </div>
          ) : null}

          <section aria-labelledby="courses-summary-title" className="order-1 flex h-10 min-w-0 flex-1 items-center overflow-hidden rounded-xl bg-card px-3 shadow-sm sm:px-4 [&_p]:hidden">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Library className="size-4" /></span>
                  <div className="min-w-0">
                    <h2 id="courses-summary-title" className="text-xl font-black tracking-tight text-foreground sm:text-2xl">Mis cursos</h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">Año escolar {currentSchoolYear?.name ?? 'sin configurar'}</p>
                  </div>
                </div>
                <div className="hidden" aria-label="Resumen de cursos">
                  <span><strong className="font-bold text-foreground tabular-nums">{activeCourseCards.length}</strong> cursos</span>
                  <span className="text-border" aria-hidden="true">•</span>
                  <span><strong className="font-bold text-foreground tabular-nums">{totalStudents}</strong> estudiantes</span>
                  <span className="text-border" aria-hidden="true">•</span>
                  <span><strong className="font-bold text-foreground tabular-nums">{totalAssignments}</strong> asignaturas</span>
                  <span className="text-border" aria-hidden="true">•</span>
                  <span><strong className="font-bold text-foreground tabular-nums">{totalTeams}</strong> equipos</span>
                </div>
              </div>
            </div>
          </section>
          </div>

          <header className="hidden">
            <div className="min-w-0">
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
                <span className="font-bold text-foreground">{activeCourseCards.length} cursos</span>
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

          <div className="hidden">
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
                {['all', ...cycleFilters.map((option) => option.value)].map((cycle) => (
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
            <div className="space-y-8">
              {groupedCourses.map((group) => (
                <section key={group.key}>
                  <div className="mb-4 mt-2 flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><BookOpen className="size-4" /></span>
                    <h2 className="text-base font-black text-foreground">Nivel {cleanLevelName(group.levelName)}</h2>
                    <span className="rounded-full px-2.5 py-1 text-[11px] font-extrabold tabular-nums" style={{ color: getLevelStyle(group.levelName).color, backgroundColor: getLevelStyle(group.levelName).soft }}>
                      {group.items.length} cursos
                    </span>
                    <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${getLevelStyle(group.levelName).color}55, transparent)` }} />
                  </div>

                  <div className="space-y-5">
                    {groupCoursesByCycle(group.items).map((cycle) => (
                      <div key={cycle.name}>
                        <div className="mb-3 flex items-center gap-2">
                          <h3 className="text-xs font-extrabold text-foreground">{cycle.name}</h3>
                          <span className="rounded-full bg-primary/8 px-2 py-0.5 text-[10px] font-bold text-primary">{cycle.items.length} cursos</span>
                          <div className="h-px flex-1 bg-border/70" />
                        </div>
                        <div className={cn('grid min-w-0 grid-cols-1 gap-4', cycle.items.length > 1 && 'md:grid-cols-2', cycle.items.length > 2 && 'xl:grid-cols-3 2xl:grid-cols-4')}>
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
  const levelStyle = getLevelStyle(item.levelName)
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
    <div className="space-y-5">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-extrabold text-primary transition hover:opacity-75">
        <ArrowLeft className="size-4" /> Volver a mis cursos
      </button>

      <header className="rounded-3xl bg-card p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <div className="flex min-w-0 items-center gap-4">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl text-xl font-extrabold text-primary-foreground shadow-md" style={{ backgroundColor: levelStyle.color }}>
              {getCourseCompactLabel(item.grade.name, item.section.name)}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground">{item.grade.name} {item.section.name}</h1>
                <span className={cn('rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide', item.archived ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-700')}>{item.archived ? 'Archivado' : 'Activo'}</span>
              </div>
              <p className="mt-2 truncate text-xs font-semibold text-muted-foreground">{cleanLevelName(item.levelName)} · {item.cycleName}{schoolYearName ? ` · Año escolar ${schoolYearName}` : ''}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:min-w-[31rem]">
            <CourseHeaderMetric icon={<UsersRound className="size-5" />} value={item.section.studentCount ?? 0} label="Estudiantes" tone="emerald" />
            <CourseHeaderMetric icon={<BookOpen className="size-5" />} value={item.assignments.length} label="Asignaturas" tone="violet" />
            <CourseHeaderMetric icon={<Archive className="size-5" />} value={archivedAssignments.length} label="Archivadas" tone="orange" />
          </div>
        </div>
      </header>

      <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><UsersRound className="size-5" /></span>
          <div className="min-w-0"><h2 className="text-sm font-extrabold">Estudiantes del curso</h2><p className="mt-1 text-xs text-muted-foreground">{item.section.studentCount ?? 0} estudiantes comparten todas las asignaturas de {item.grade.name} {item.section.name}.</p></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" className="h-11" onClick={() => { setStudentAction(undefined); setWorkspaceView('students') }}><UsersRound className="size-4" /> Ver estudiantes</Button>
          {canEnroll ? <Button type="button" className="h-11" onClick={() => { setStudentAction('new'); setWorkspaceView('students') }}><Plus className="size-4" /> Agregar estudiantes</Button> : null}
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary"><BookOpen className="size-5" /></span>
            <div>
              <h2 className="text-lg font-extrabold text-foreground">{workspaceView === 'subjects' ? 'Asignaturas' : 'Asignaturas archivadas'}</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">{workspaceView === 'subjects' ? 'Selecciona una asignatura para acceder a su espacio académico.' : 'Restaura una asignatura o elimina definitivamente su historial académico.'}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {canManage ? (
              <Button type="button" variant="outline" onClick={() => setWorkspaceView(workspaceView === 'archived' ? 'subjects' : 'archived')} className="h-10 rounded-xl px-4">
                {workspaceView === 'archived' ? <><BookOpen className="size-4" /> Ver activas</> : <><Archive className="size-4" /> Archivadas</>}
              </Button>
            ) : null}
            {canManage && workspaceView === 'subjects' ? (
              <Button type="button" onClick={() => onAssignSubject(item.grade, item.section.id)} className="h-10 rounded-xl bg-primary px-5 text-primary-foreground shadow-md">
                <Plus className="size-4" /> Agregar asignatura
              </Button>
            ) : null}
          </div>
        </div>

        {workspaceView === 'archived' ? (
          archivedAssignments.length ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {archivedAssignments.map((assignment) => (
                <ArchivedSubjectCard
                  key={assignment.id}
                  assignment={assignment}
                  onRestore={() => void onRestoreSubject(assignment)}
                  onDelete={() => onDeleteArchivedSubject(assignment)}
                />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
              <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground"><Archive className="size-7" /></span>
              <h3 className="mt-4 font-extrabold">No hay asignaturas archivadas</h3>
              <p className="mt-1 text-sm text-muted-foreground">Las asignaturas que archives aparecerán aquí.</p>
            </div>
          )
        ) : (
          <div className="mt-5 grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {item.assignments.map((assignment) => (
              <CourseSubjectCard
                key={assignment.id}
                assignment={assignment}
                studentCount={item.section.studentCount ?? 0}
                canManage={canManage}
                onOpen={(tab) => { setSubjectInitialTab(tab); setSelectedAssignmentId(assignment.id); onAssignmentChange(assignment.id) }}
                onArchive={() => onArchiveSubject(assignment)}
                onCustomize={() => setAppearanceTarget(assignment)}
                onDelete={() => onDeleteEmptySubject(assignment, item.section.studentCount ?? 0)}
              />
            ))}
            {canManage ? (
              <button type="button" onClick={() => onAssignSubject(item.grade, item.section.id)} className="group flex min-h-44 flex-col items-center justify-center rounded-2xl border border-dashed border-primary/25 bg-white/55 px-6 py-8 text-center transition hover:border-primary/45 hover:bg-primary/[0.03] sm:col-span-2 xl:col-span-1 2xl:col-span-2">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary/8 text-primary transition group-hover:scale-105"><Plus className="size-5" /></span>
                <span className="mt-4 text-sm font-extrabold text-foreground">Agregar asignatura al curso</span>
                <span className="mt-1 text-xs text-muted-foreground">Añade una nueva asignatura para comenzar a organizar el contenido.</span>
              </button>
            ) : null}
            {!item.assignments.length && !canManage ? (
              <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center text-sm text-muted-foreground sm:col-span-2 xl:col-span-3 2xl:col-span-4">Este curso todavía no tiene asignaturas.</div>
            ) : null}
          </div>
        )}
      </section>

      {appearanceTarget ? (
        <SubjectAppearanceDialog
          assignment={appearanceTarget}
          onSave={(input) => onCustomizeSubject(appearanceTarget.id, input)}
          onClose={() => setAppearanceTarget(null)}
        />
      ) : null}
    </div>
  )
}

function CourseHeaderMetric({ icon, value, label, tone }: { icon: ReactNode; value: number; label: string; tone: 'emerald' | 'violet' | 'orange' }) {
  const tones = {
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    violet: 'bg-violet-50 text-violet-600 ring-violet-100',
    orange: 'bg-orange-50 text-orange-600 ring-orange-100',
  }
  return <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm"><span className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl ring-1', tones[tone])}>{icon}</span><span className="min-w-0"><strong className="block text-xl leading-none text-foreground tabular-nums">{value}</strong><span className="mt-1 block truncate text-[10px] font-semibold text-muted-foreground">{label}</span></span></div>
}

export function CourseSubjectCard({ assignment, studentCount, canManage, onOpen, onCustomize, onArchive, onDelete }: { assignment: SectionSubjectAssignment; studentCount: number; canManage: boolean; onOpen: (tab: string) => void; onCustomize: () => void; onArchive: () => void; onDelete: () => void }) {
  const palette = getAssignmentPalette(assignment)
  const average = assignment.averageScore === null ? null : Math.max(0, Math.min(100, assignment.averageScore))

  function openAssignmentFromKeyboard(event: React.KeyboardEvent<HTMLElement>) {
    if (event.target !== event.currentTarget || (event.key !== 'Enter' && event.key !== ' ')) return
    event.preventDefault()
    onOpen('resumen')
  }

  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={`Entrar a la asignatura ${assignment.subjectName}`}
      onClick={() => onOpen('resumen')}
      onKeyDown={openAssignmentFromKeyboard}
      className="group relative flex min-h-[18rem] cursor-pointer flex-col rounded-2xl bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm" style={{ backgroundColor: palette.color }}>{getSubjectIcon(assignment.subjectName, assignment.appearanceIcon)}</span>
          <h3 className="line-clamp-2 text-sm font-extrabold leading-5 text-foreground">{assignment.subjectName}</h3>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide text-emerald-700">Activo</span>
          {canManage ? (
            <AssignmentActionsMenu
              label={assignment.subjectName}
              items={[
                { label: 'Personalizar apariencia', icon: <Paintbrush className="size-4" />, tone: 'primary', onSelect: onCustomize },
                { label: 'Archivar asignatura', icon: <Archive className="size-4" />, tone: 'archive', onSelect: onArchive },
                ...(assignment.canDelete ? [{ label: 'Eliminar asignatura', icon: <Trash2 className="size-4" />, tone: 'danger' as const, onSelect: onDelete }] : []),
              ]}
            />
          ) : null}
        </div>
      </div>

      <div className="mt-4 border-b border-slate-100 pb-3">
        <span className="text-[10px] font-semibold text-muted-foreground">Docente</span>
        <p className="mt-0.5 truncate text-xs font-bold text-primary">{assignment.teacherName ?? 'Sin docente asignado'}</p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-4 py-4 text-[10px]">
        <SubjectMetric icon={<UsersRound className="size-4" />} value={studentCount} label="Estudiantes" tone="text-emerald-600" />
        <SubjectMetric icon={<UsersRound className="size-4" />} value={assignment.teamCount ?? 0} label="Equipos" tone="text-orange-600" />
        <SubjectMetric icon={<CalendarCheck2 className="size-4" />} value={assignment.activityCount ?? 0} label="Actividades" tone="text-violet-600" />
        <SubjectMetric icon={<CalendarDays className="size-4" />} value={formatRelativeAttendance(assignment.lastAttendanceDate)} label="Última asistencia" tone="text-blue-600" />
      </div>

      <div className="mt-auto flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ backgroundColor: palette.soft }}>
        <span className="flex size-7 items-center justify-center rounded-full p-1" style={{ background: `conic-gradient(${palette.color} ${average ?? 0}%, #dbe4ee 0)` }}><span className="size-full rounded-full bg-white" /></span>
        <strong className="text-base text-foreground">{average === null ? '—' : `${Math.round(average)}%`}</strong>
        <span className="text-[9px] font-semibold text-muted-foreground">Promedio general</span>
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

function SubjectMetric({ icon, value, label, tone }: { icon: ReactNode; value: string | number; label: string; tone: string }) {
  return <div className="flex items-start gap-2"><span className={cn('mt-0.5', tone)}>{icon}</span><span><strong className="block text-sm leading-none text-foreground tabular-nums">{value}</strong><span className="mt-1 block text-[9px] text-muted-foreground">{label}</span></span></div>
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
    if (nextTab === 'actividades' || nextTab === 'planificaciones') next.set('tab', nextTab)
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
    { label: 'Nueva actividad', icon: <Plus className="size-4" />, onSelect: () => setActivityBlockPickerOpen(true) },
    { label: 'Agregar a bitácora', icon: <BookMarked className="size-4" />, onSelect: () => {
      const journalParams = new URLSearchParams({ action: 'create', sectionId: item.section.id })
      if (item.assignment?.id) journalParams.set('sectionSubjectId', item.assignment.id)
      navigate(`/bitacora?${journalParams}`)
    } },
    { label: 'Organizar equipos', icon: <UsersRound className="size-4" />, onSelect: () => selectSubjectTab('equipos') },
    { label: 'Registrar asistencia', icon: <CalendarCheck2 className="size-4" />, onSelect: () => {
      if (item.assignment) navigate(buildSubjectAttendanceHref(item.assignment.id, item.id))
    } },
    { label: 'Gestionar calificaciones', icon: <GraduationCap className="size-4" />, onSelect: () => selectSubjectTab('calificaciones') },
    { label: 'Gestionar actividades', icon: <CheckSquare className="size-4" />, onSelect: () => selectSubjectTab('actividades') },
    { label: 'Recursos', icon: <Library className="size-4" />, onSelect: () => selectSubjectTab('recursos') },
    { label: 'Reportes', icon: <ChartColumn className="size-4" />, onSelect: () => selectSubjectTab('reportes') },
    { label: 'Configuración', icon: <SlidersHorizontal className="size-4" />, onSelect: () => selectSubjectTab('configuracion') },
  ]

  return (
    <div className="space-y-3">
      <header className="w-full overflow-visible rounded-2xl bg-card shadow-sm">
        <div className="flex min-h-[76px] items-center gap-3 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button type="button" className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-extrabold text-primary transition hover:border-primary/25 hover:bg-primary/[0.04]" onClick={onBack} aria-label={backLabel} title={backLabel}><ArrowLeft className="size-4" /><span className="hidden sm:inline">Volver</span></button>
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm [&>svg]:size-6" style={{ backgroundColor: palette.color }}>{getSubjectIcon(item.subjectName, item.assignment?.appearanceIcon)}</div>
            <div className="min-w-0">
              <div className="flex min-w-0 flex-nowrap items-center gap-2 overflow-hidden">
                <h1 className="truncate text-base font-extrabold leading-tight text-foreground">{courseLabel} – {item.subjectName}</h1>
                <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">Activa</span>
              </div>
              <p className="mt-1.5 flex min-w-0 flex-nowrap items-center gap-x-1.5 overflow-hidden whitespace-nowrap text-[11px] font-semibold text-muted-foreground"><span>{cleanLevelName(item.levelName)}</span><span>·</span><span>{item.cycleName}</span><span>·</span><span>Sección {item.section.name}</span>{schoolYearName ? <><span>·</span><span className="truncate">Año escolar {schoolYearName}</span></> : null}</p>
            </div>
          </div>

          <details className="group relative shrink-0">
            <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover [&::-webkit-details-marker]:hidden">
              Acciones <ChevronDown className="size-4 transition group-open:rotate-180" />
            </summary>
            <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-border bg-card p-2 shadow-xl">
              {subjectActions.map((action) => (
                <button key={action.label} type="button" className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-foreground transition hover:bg-muted" onClick={(event) => { action.onSelect(); event.currentTarget.closest('details')?.removeAttribute('open') }}>
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </details>
        </div>

      </header>

        <nav className="grid w-full grid-cols-2 gap-1 rounded-2xl bg-card p-1.5 shadow-sm sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" aria-label="Secciones de la asignatura">
          {subjectTabs.map((tab) => <DetailTab key={tab.id} active={activeTab === tab.id} icon={tab.icon} label={tab.label} muted={'muted' in tab && tab.muted} badge={'badge' in tab ? tab.badge : undefined} onClick={() => selectSubjectTab(tab.id)} />)}
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
        <AsistenciaTab sectionSubjectId={item.assignment?.id ?? null} students={students} courseId={item.id} courseLabel={courseLabel} subjectName={item.subjectName} schoolYearName={schoolYearName} />
      ) : activeTab === 'calificaciones' ? (
        <CalificacionesTab sectionSubjectId={item.assignment?.id ?? null} schoolYearId={schoolYearId} courseId={item.id} courseLabel={courseLabel} subjectName={item.subjectName} />
      ) : activeTab === 'planificaciones' ? (
        <PlanningDisabledPanel onActivities={() => selectSubjectTab('actividades')} />
      ) : activeTab === 'horario' ? (
        <HorarioTab sectionId={item.section.id} sectionSubjectId={item.assignment?.id ?? null} />
      ) : activeTab === 'recursos' ? (
        <SubjectModulePanel icon={<Library className="size-6" />} title="Recursos" description="Los recursos se organizan dentro de actividades y planificaciones para mantenerlos vinculados al trabajo académico." href={`/calificaciones?sectionSubjectId=${encodeURIComponent(item.assignment?.id ?? '')}`} action="Gestionar recursos" />
      ) : activeTab === 'reportes' ? (
        <SubjectModulePanel icon={<ChartColumn className="size-6" />} title="Reportes" description="Genera reportes de calificaciones, asistencia y progreso de esta asignatura." href="/reportes" action="Abrir reportes" />
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
                className={cn('group flex min-h-40 flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg', visual.border)}
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
  const latestPlanning = [...plannings].sort((a, b) => new Date(b.plannedDate ?? 0).getTime() - new Date(a.plannedDate ?? 0).getTime())[0]

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <DashboardPanel title="Próximas actividades" action="Ver todas" onAction={() => onNavigate('actividades')}>
          <div className="space-y-2 p-3">
            {upcomingActivities.length ? upcomingActivities.map((activity) => <ActivityPreview key={activity.id} activity={activity} />) : <CompactEmpty icon={<CalendarClock className="size-5" />} text="No hay actividades próximas." />}
            <button type="button" onClick={() => onNavigate('actividades')} className="flex w-full items-center justify-center gap-2 border-t border-slate-100 pt-3 text-xs font-extrabold text-primary"><CalendarDays className="size-3.5" /> Ver calendario completo</button>
          </div>
        </DashboardPanel>

        <div className="space-y-4">
          <DashboardPanel title="Última actividad" action="Ver todas" onAction={() => onNavigate('actividades')}>
            <div className="p-3">{recentActivity ? <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600"><Leaf className="size-5" /></span><div className="min-w-0 flex-1"><p className="truncate text-xs font-extrabold">{recentActivity.name}</p><p className="mt-1 text-[10px] text-muted-foreground">{recentActivity.date ? `Programada para ${formatShortDate(recentActivity.date)}` : 'Actividad registrada'}</p><p className="mt-1 text-[10px] text-muted-foreground">{students} estudiantes matriculados</p></div>{averageScore !== null ? <strong className="rounded-lg bg-emerald-50 px-2 py-1 text-sm text-emerald-700">{averageScore}%</strong> : null}</div> : <CompactEmpty icon={<CheckSquare className="size-5" />} text="Todavía no hay actividades." />}</div>
          </DashboardPanel>
          <DashboardPanel title="Última asistencia" action="Ver historial" onAction={() => onNavigate('asistencia')}>
            <div className="p-3"><div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><CalendarCheck2 className="size-5" /></span><div className="min-w-0 flex-1"><p className="text-xs font-bold">{lastAttendanceDate ? `Registrada el ${formatShortDate(lastAttendanceDate)}` : 'Sin asistencia registrada'}</p><p className="mt-1 text-[10px] text-muted-foreground">Asistencia promedio</p></div>{attendancePercent !== null ? <strong className="rounded-lg bg-emerald-50 px-2 py-1 text-sm text-emerald-700">{attendancePercent}%</strong> : null}</div></div>
          </DashboardPanel>
          {latestPlanning ? <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm"><div className="flex gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-white text-emerald-700"><FileText className="size-5" /></span><div className="min-w-0"><p className="text-[11px] font-extrabold text-emerald-700">Continuar donde quedaste</p><p className="mt-1 truncate text-xs font-bold">{latestPlanning.title}</p><p className="mt-1 text-[10px] text-muted-foreground">Última planificación editada</p></div></div><button type="button" onClick={() => onNavigate('planificaciones')} className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-emerald-100/70 text-[11px] font-extrabold text-emerald-800">Continuar edición <ArrowLeft className="size-3.5 rotate-180" /></button></div> : null}
        </div>
      </div>

      <DashboardPanel title="Resumen académico">
        <div className="grid gap-2 p-3 sm:grid-cols-2 xl:grid-cols-5">
          <AcademicSummaryCard icon={<ClipboardList className="size-4" />} value={activityCount} label="Actividades creadas" detail={`${evaluatedActivityIds.size} evaluadas · ${pendingActivities} pendientes`} tone="violet" onClick={() => onNavigate('actividades')} />
          <AcademicSummaryCard icon={<FileText className="size-4" />} value={plannings.length} label="Planificaciones creadas" detail={`${plannings.filter((entry) => entry.plannedDate).length} programadas`} tone="orange" onClick={() => onNavigate('planificaciones')} />
          <AcademicSummaryCard icon={<UsersRound className="size-4" />} value={teams} label="Equipos creados" detail={`${students} estudiantes`} tone="blue" onClick={() => onNavigate('equipos')} />
          <AcademicSummaryCard icon={<CalendarCheck2 className="size-4" />} value={attendancePercent === null ? '—' : `${attendancePercent}%`} label="Asistencia promedio" detail="Período actual" tone="emerald" onClick={() => onNavigate('asistencia')} />
          <AcademicSummaryCard icon={<ChartColumn className="size-4" />} value={averageScore === null ? '—' : `${averageScore}%`} label="Promedio general" detail={`${gradeRecords.length} registros`} tone="orange" onClick={() => onNavigate('calificaciones')} />
        </div>
      </DashboardPanel>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <DashboardPanel title="Avisos importantes">
          <div className="space-y-2 p-3">
            {!activities.some((activity) => activity.instrumentId) ? <NoticeRow tone="amber" title="No hay instrumentos de evaluación creados" detail="Crea instrumentos para evaluar las actividades." action="Crear instrumento" onAction={() => onNavigate('calificaciones')} /> : null}
            {pendingActivities > 0 ? <NoticeRow tone="blue" title="Revisa las actividades pendientes de evaluar" detail={`Tienes ${pendingActivities} actividades pendientes de evaluación.`} action="Ver actividades" onAction={() => onNavigate('actividades')} /> : <NoticeRow tone="blue" title="Todo está al día" detail="No tienes actividades pendientes de evaluación." />}
          </div>
        </DashboardPanel>
        <DashboardPanel title="Reportes rápidos">
          <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4">
            {['Calificaciones', 'Asistencia', 'Actividades', 'Resumen académico'].map((report, index) => <Link key={report} to="/reportes" className="rounded-xl border border-slate-200 bg-white p-3 text-center transition duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_12px_24px_-14px_rgba(74,162,227,0.45)] active:translate-y-0"><span className={cn('mx-auto flex size-8 items-center justify-center rounded-lg', index % 2 ? 'bg-emerald-50 text-emerald-600' : 'bg-violet-50 text-violet-600')}><FileText className="size-4" /></span><span className="mt-2 block text-[11px] font-extrabold leading-4">Reporte de {report.toLowerCase()}</span><span className="mt-2 block text-[10px] font-bold text-primary">Generar PDF</span></Link>)}
          </div>
        </DashboardPanel>
      </div>
    </div>
  )
}

function DashboardPanel({ title, action, onAction, children }: { title: string; action?: string; onAction?: () => void; children: ReactNode }) {
  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_28px_-25px_rgba(15,45,90,0.8)]"><header className="flex min-h-12 items-center justify-between border-b border-slate-100 px-4 py-2"><h2 className="text-sm font-extrabold text-foreground">{title}</h2>{action ? <button type="button" onClick={onAction} className="text-[11px] font-extrabold text-primary hover:underline">{action}</button> : null}</header>{children}</section>
}

function ActivityPreview({ activity }: { activity: { name: string; date?: string; activityType?: 'individual' | 'group' } }) {
  const date = activity.date ? new Date(activity.date) : null
  return <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5"><span className="flex size-10 shrink-0 flex-col items-center justify-center rounded-lg border border-emerald-200 text-emerald-700"><strong className="text-sm leading-none">{date ? date.getDate() : '—'}</strong><span className="mt-0.5 text-[9px] font-extrabold uppercase">{date ? date.toLocaleDateString('es-DO', { month: 'short' }).replace('.', '') : 'S/F'}</span></span><span className="min-w-0 flex-1"><span className="block truncate text-[11px] font-extrabold">{activity.name}</span><span className="mt-1 block text-[10px] text-muted-foreground">{activity.activityType === 'group' ? 'Trabajo en equipos' : 'Actividad individual'}</span></span><span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">Pendiente</span></div>
}

function AcademicSummaryCard({ icon, value, label, detail, tone, onClick }: { icon: ReactNode; value: string | number; label: string; detail: string; tone: 'violet' | 'orange' | 'blue' | 'emerald'; onClick: () => void }) {
  const tones = { violet: 'bg-violet-50 text-violet-600', orange: 'bg-orange-50 text-orange-600', blue: 'bg-blue-50 text-blue-600', emerald: 'bg-emerald-50 text-emerald-600' }
  return <button type="button" onClick={onClick} aria-label={`Ir a ${label}`} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"><span className="flex items-center gap-2.5"><span className={cn('flex size-9 items-center justify-center rounded-lg', tones[tone])}>{icon}</span><span><strong className="block text-xl leading-none">{value}</strong><span className="mt-1 block text-xs font-bold leading-tight text-slate-700">{label}</span></span></span><span className="mt-3 block border-t border-slate-100 pt-2.5 text-xs leading-4 text-muted-foreground">{detail}</span></button>
}

function NoticeRow({ tone, title, detail, action, onAction }: { tone: 'amber' | 'blue'; title: string; detail: string; action?: string; onAction?: () => void }) {
  return <div className={cn('flex items-center gap-3 rounded-xl border px-3 py-2.5', tone === 'amber' ? 'border-amber-200 bg-amber-50/60' : 'border-blue-200 bg-blue-50/60')}><AlertCircle className={cn('size-4 shrink-0', tone === 'amber' ? 'text-amber-600' : 'text-blue-600')} /><div className="min-w-0 flex-1"><p className="text-[11px] font-extrabold">{title}</p><p className="mt-1 text-[10px] text-muted-foreground">{detail}</p></div>{action ? <button type="button" onClick={onAction} className="shrink-0 rounded-lg border border-current/15 bg-white px-3 py-1.5 text-[10px] font-extrabold text-primary">{action}</button> : null}</div>
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

function DetailTab({ active, icon, label, muted, badge, onClick }: { active?: boolean; icon: ReactNode; label: string; muted?: boolean; badge?: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      className={cn(
        'relative flex h-10 min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-2 text-sm font-bold text-muted-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-primary/5 hover:text-primary',
        active && 'bg-primary/[0.055] text-primary after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:rounded-t-full after:bg-primary',
        muted && !active && 'bg-muted/40 text-muted-foreground/70 hover:bg-muted/60 hover:text-muted-foreground',
      )}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
    >
      {icon}
      {label}
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
    {!activities.length ? <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 text-center"><span className="flex size-14 items-center justify-center rounded-2xl bg-primary/8 text-primary"><CheckSquare className="size-6" /></span><h3 className="mt-4 text-lg font-extrabold">Aún no hay actividades</h3><p className="mt-2 max-w-md text-sm text-muted-foreground">Crea la primera actividad de esta asignatura para comenzar a evaluarla.</p><Button className="mt-5" onClick={onCreate}><Plus className="size-4" /> Crear primera actividad</Button></div> : !visible.length ? <EmptyState title="Sin coincidencias" description="Prueba con otro texto o estado." /> : <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm"><table className="min-w-[70rem] w-full text-left text-sm"><thead className="bg-muted/40 text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground"><tr><th className="px-4 py-3">Actividad</th><th className="px-4 py-3">Bloque</th><th className="px-4 py-3">Período</th><th className="px-4 py-3">Fecha</th><th className="px-4 py-3">Valor</th><th className="px-4 py-3">Instrumento</th><th className="px-4 py-3">Modalidad</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3">Progreso</th><th className="px-4 py-3 text-right">Acciones</th></tr></thead><tbody className="divide-y divide-border">{visible.map((activity) => { const meta = activityMeta(activity); const block = competencyBlocks.find((item) => item.id === activity.competencyBlockId); return <tr key={activity.id} className="transition hover:bg-muted/20"><td className="px-4 py-3"><button type="button" onClick={() => onActivityChange(activity.id)} className="max-w-52 text-left font-extrabold text-foreground hover:text-primary">{activity.name}</button></td><td className="px-4 py-3 text-xs"><strong className="block">{block?.shortName ?? 'Bloque'}</strong><span className="line-clamp-1 max-w-40 text-[10px] text-muted-foreground">{block?.name}</span></td><td className="px-4 py-3 text-xs font-bold">{period?.name?.split('—')[0]?.trim() ?? 'Actual'}</td><td className="px-4 py-3 text-xs text-muted-foreground">{formatShortDate(activity.date)}</td><td className="px-4 py-3 text-xs font-bold">{activity.maxScore} pts</td><td className="px-4 py-3 text-xs text-muted-foreground">{activityInstrumentLabel(activity.instrumentType)}</td><td className="px-4 py-3 text-xs">{activity.activityType === 'group' ? 'Grupal' : 'Individual'}</td><td className="px-4 py-3"><ActivityStatusBadge status={meta.state} /></td><td className="px-4 py-3"><div className="min-w-24"><span className="text-[10px] font-bold text-muted-foreground">{meta.graded} / {students.length}</span><div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${students.length ? (meta.graded / students.length) * 100 : 0}%` }} /></div></div></td><td className="px-4 py-3"><div className="flex justify-end gap-1"><button type="button" onClick={() => onActivityChange(activity.id)} aria-label={`Ver ${activity.name}`} className="grid size-9 place-items-center rounded-lg text-primary hover:bg-primary/8"><Eye className="size-4" /></button><Link to={buildActivityGradingHref(assignmentId, courseId, activity.id, 'edit')} aria-label={`Editar ${activity.name}`} className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted"><Edit3 className="size-4" /></Link><Link to={buildActivityGradingHref(assignmentId, courseId, activity.id, 'evaluate')} aria-label={`Evaluar ${activity.name}`} className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted"><ChartColumn className="size-4" /></Link></div></td></tr> })}</tbody></table><footer className="border-t border-border px-4 py-3 text-xs text-muted-foreground">Mostrando {visible.length} de {activities.length} actividades</footer></div>}
  </section>
}

function SubjectActivityDetail({ activity, records, students, teams, assignmentId, courseId, periodName, onBack }: { activity: GradingActivity; records: GradeRecordRow[]; students: StudentGradeRow[]; teams: CourseTeam[]; assignmentId: string; courseId: string; periodName: string; onBack: () => void }) {
  const [tab, setTab] = useState<'info' | 'instrument' | 'participants' | 'evaluation' | 'history'>('info')
  const block = competencyBlocks.find((item) => item.id === activity.competencyBlockId)
  const graded = students.filter((student) => Boolean(scoreForActivity(records, student.enrollmentId, activity.id))).length
  const status: SubjectActivityStatus = graded === 0 ? 'pending' : graded >= students.length && students.length > 0 ? 'graded' : 'partial'
  const selectedTeams = teams.filter((team) => activity.teamIds?.includes(team.id))
  const tabs = [['info', 'Información'], ['instrument', 'Instrumento'], ['participants', 'Estudiantes / Equipos'], ['evaluation', 'Evaluación'], ['history', 'Historial']] as const
  return <section className="space-y-4"><header className="rounded-2xl border border-border bg-card p-4 shadow-sm"><button type="button" onClick={onBack} className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-3 text-xs font-extrabold text-primary hover:bg-primary/[0.04]"><ArrowLeft className="size-4" /> Volver a actividades</button><div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start"><span className="flex size-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><FlaskConical className="size-5" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-extrabold">{activity.name}</h2><span className="rounded-full bg-primary/8 px-2 py-1 text-[10px] font-extrabold text-primary">{periodName.split('—')[0]?.trim()}</span><ActivityStatusBadge status={status} /></div><p className="mt-2 text-xs font-semibold text-muted-foreground">{activity.activityType === 'group' ? 'Grupal' : 'Individual'} · {activity.maxScore} puntos · {activityInstrumentLabel(activity.instrumentType)} · {formatShortDate(activity.date)}</p></div><Link to={buildActivityGradingHref(assignmentId, courseId, activity.id, 'edit')} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-xs font-extrabold hover:bg-muted"><Edit3 className="size-4" /> Editar actividad</Link></div><nav className="mt-4 flex gap-1 overflow-x-auto border-t border-border pt-2" aria-label="Secciones de la actividad">{tabs.map(([id, label]) => <button key={id} type="button" aria-current={tab === id ? 'page' : undefined} onClick={() => setTab(id)} className={cn('h-10 whitespace-nowrap rounded-lg px-3 text-xs font-extrabold', tab === id ? 'bg-primary/8 text-primary' : 'text-muted-foreground hover:bg-muted')}>{label}</button>)}</nav></header>
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

function EstudiantesTab({ students, loading, error, courseId, sectionId, canEnroll, gradingStudents, activities, gradeRecords, teams }: {
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
}) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'team' | 'no-team' | 'pending'>('all')
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string | null>(null)

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
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover active:scale-[0.98]"
                >
                  <Plus className="size-4" />
                  Matricular estudiante
                </Link>
                <Link
                  to={`/estudiantes?courseId=${encodeURIComponent(courseId)}&action=import`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-bold text-foreground transition hover:bg-muted active:scale-[0.98]"
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
  const pendingActivities = activities.filter((activity) => rows.some((row) => !scoreForActivity(row.records, row.enrollmentId, activity.id))).length
  const evaluatedRows = rows.filter((row) => row.average !== null)
  const courseAverage = evaluatedRows.length
    ? Math.round(evaluatedRows.reduce((sum, row) => sum + (row.average ?? 0), 0) / evaluatedRows.length)
    : null

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-foreground">Estudiantes de la asignatura</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Consulta el progreso general y abre el detalle de cada estudiante.</p>
        </div>
        <button type="button" disabled title="Próximamente" className="inline-flex h-9 cursor-not-allowed items-center gap-2 rounded-lg border border-border px-3 text-xs font-bold text-muted-foreground opacity-70"><FileText className="size-4" /> Exportar</button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
        <StudentMetric icon={<UsersRound className="size-4" />} value={rows.length} label="Estudiantes matriculados" tone="bg-blue-50 text-blue-700" />
        <StudentMetric icon={<UsersRound className="size-4" />} value={teams.length} label="Equipos" tone="bg-emerald-50 text-emerald-700" />
        <StudentMetric icon={<ClipboardList className="size-4" />} value={pendingActivities} label="Actividades pendientes" tone="bg-violet-50 text-violet-700" />
        <StudentMetric icon={<ChartColumn className="size-4" />} value={courseAverage === null ? '—' : `${courseAverage}%`} label="Promedio del curso" tone="bg-orange-50 text-orange-700" />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <label className="relative min-w-52 flex-1 sm:max-w-xs">
          <span className="sr-only">Buscar estudiante</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar estudiante..." className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10" />
        </label>
        {([
          ['all', 'Todos'],
          ['team', 'Con equipo'],
          ['no-team', 'Sin equipo'],
          ['pending', 'Con pendientes'],
        ] as const).map(([value, label]) => (
          <button key={value} type="button" onClick={() => setFilter(value)} className={cn('h-8 rounded-full border px-3 text-xs font-bold transition', filter === value ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-primary')}>{label}</button>
        ))}
      </div>

      <div className={cn('mt-4 grid gap-4', selected && 'xl:grid-cols-[minmax(0,1fr)_21rem]')}>
        <div className="min-w-0 overflow-hidden rounded-xl border border-border">
          <div className="max-h-[30rem] overflow-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead className="sticky top-0 z-10 border-b border-border bg-muted text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                <tr><th className="w-12 px-3 py-3 text-center">#</th><th className="px-3 py-3">Estudiante</th><th className="px-3 py-3">Equipo</th><th className="px-3 py-3">Actividades</th><th className="px-3 py-3">Promedio</th><th className="px-3 py-3">Asistencia</th><th className="px-3 py-3">Estado</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRows.map((row, index) => (
                  <tr key={row.enrollmentId} tabIndex={0} role="button" onClick={() => setSelectedEnrollmentId(row.enrollmentId)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setSelectedEnrollmentId(row.enrollmentId) }} className={cn('cursor-pointer text-foreground outline-none transition hover:bg-primary/[0.035] focus:bg-primary/[0.05]', selectedEnrollmentId === row.enrollmentId && 'bg-primary/[0.055]')}>
                    <td className="px-3 py-3 text-center font-bold text-muted-foreground">{index + 1}</td>
                    <td className="px-3 py-3 font-bold">{row.lastName}, {row.firstName}</td>
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

        {selected ? <StudentDetailPanel student={selected} activities={activities} journalHref={`/bitacora?${new URLSearchParams({ action: 'create', type: 'student_observation', sectionId, ...(courseId ? { sectionSubjectId: courseId } : {}), studentId: selected.studentId }).toString()}`} onClose={() => setSelectedEnrollmentId(null)} /> : null}
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-primary/[0.035] px-4 py-3 text-xs text-muted-foreground"><Sparkles className="size-4 text-primary" /><span><strong className="text-foreground">Consejo rápido:</strong> haz clic en cualquier estudiante para ver su progreso detallado.</span></div>
    </section>
  )
}

function StudentMetric({ icon, value, label, tone }: { icon: ReactNode; value: string | number; label: string; tone: string }) {
  return <div className="flex min-h-16 items-center gap-3 rounded-xl border border-border px-3 py-2.5"><span className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', tone)}>{icon}</span><span><strong className="block text-lg leading-none tabular-nums text-foreground">{value}</strong><span className="mt-1 block text-[10px] font-semibold text-muted-foreground">{label}</span></span></div>
}

function StudentStatusBadge({ status }: { status: 'Al día' | 'En progreso' | 'Sin actividad' }) {
  return <span className={cn('inline-flex rounded-full px-2 py-1 text-[10px] font-bold', status === 'Al día' ? 'bg-emerald-50 text-emerald-700' : status === 'En progreso' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600')}>{status}</span>
}

function StudentDetailPanel({ student, activities, journalHref, onClose }: {
  student: StudentAttendanceRow & { team: CourseTeam | null; records: GradeRecordRow[]; completed: number; average: number | null; progressStatus: 'Al día' | 'En progreso' | 'Sin actividad' }
  activities: GradingActivity[]
  journalHref: string
  onClose: () => void
}) {
  const blockAverages = competencyBlocks.map((block) => {
    const activityIds = new Set(activities.filter((activity) => activity.competencyBlockId === block.id).map((activity) => activity.id))
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
      <Link to={journalHref} className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-border text-xs font-extrabold text-primary hover:bg-primary/[0.04]"><BookMarked className="size-4" /> Agregar observación a bitácora</Link>
    </aside>
  )
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

function AsistenciaTab({ sectionSubjectId, students, courseId, courseLabel, subjectName, schoolYearName }: { sectionSubjectId: string | null; students: StudentAttendanceRow[]; courseId: string; courseLabel: string; subjectName: string; schoolYearName: string }) {
  const [history, setHistory] = useState<ClassAttendanceHistoryRecord[]>([])
  const [academicPeriodId, setAcademicPeriodId] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(todayKey)
  const [marks, setMarks] = useState<Record<string, MonthlyAttendanceMark>>({})
  const [editing, setEditing] = useState(false)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const roster = useMemo(() => sortStudentsForRoster(students), [students])

  const load = useCallback(async () => {
    if (!sectionSubjectId) return
    setLoading(true)
    setError(null)
    try {
      const [records, periodId] = await Promise.all([getClassAttendanceHistory(sectionSubjectId), getCurrentAcademicPeriodId()])
      setHistory(records)
      setAcademicPeriodId(periodId)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo cargar la asistencia.')
    } finally {
      setLoading(false)
    }
  }, [sectionSubjectId])

  useEffect(() => { void load() }, [load])

  const sessions = useMemo(() => summarizeAttendanceSessions(history, roster.length), [history, roster.length])
  const todaySession = sessions.find((session) => session.date === todayKey()) ?? null
  const periodAttendance = history.length ? Math.round((history.filter((record) => statusToMark(record.status, record.notes) === 'P').length / history.length) * 100) : null
  const currentCounts = countAttendanceMarks(Object.values(marks))
  const openSession = (date: string) => {
    const records = history.filter((record) => record.attendanceDate.slice(0, 10) === date)
    setSelectedDate(date)
    setMarks(Object.fromEntries(roster.map((student) => {
      const record = records.find((item) => item.enrollmentId === student.enrollmentId)
      return [student.enrollmentId, record ? statusToMark(record.status, record.notes) : records.length ? null : 'P']
    })))
    setSaved(false)
    setEditing(true)
  }

  if (!sectionSubjectId) return <EmptyState title="Sin asignatura" description="Este curso no tiene una asignatura asignada." />
  if (loading) return <div className="flex min-h-64 items-center justify-center text-sm font-semibold text-muted-foreground">Cargando asistencia…</div>
  if (error) return <ErrorState message={error} />

  const todayStats = todaySession?.counts
  return <section className="space-y-4" aria-labelledby="subject-attendance-title">
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 id="subject-attendance-title" className="text-xl font-extrabold">Asistencia</h2><p className="mt-1 text-sm text-muted-foreground">Registra y consulta la asistencia de esta asignatura.</p><p className="mt-1 text-xs font-semibold text-muted-foreground">{courseLabel} · {subjectName} · Año escolar {schoolYearName}</p></div><Button className="h-12 px-6" onClick={() => openSession(todayKey())}><CalendarCheck2 className="size-5" /> {todaySession ? 'Abrir asistencia de hoy' : 'Pasar lista'}</Button></header>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <AttendanceMetric label="Presentes hoy" value={todayStats ? String(todayStats.P) : '—'} tone="emerald" />
      <AttendanceMetric label="Ausentes hoy" value={todayStats ? String(todayStats.A) : '—'} tone="red" />
      <AttendanceMetric label="Retardos hoy" value={todayStats ? String(todayStats.R) : '—'} tone="amber" />
      <AttendanceMetric label="Asistencia hoy" value={todaySession ? `${todaySession.percentage}%` : 'Sin registrar'} tone="violet" />
      <AttendanceMetric label="Promedio del período" value={periodAttendance === null ? '—' : `${periodAttendance}%`} tone="blue" />
    </div>

    {!sessions.length && !editing ? <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 text-center"><span className="flex size-14 items-center justify-center rounded-2xl bg-primary/8 text-primary"><CalendarCheck2 className="size-6" /></span><h3 className="mt-4 text-lg font-extrabold">Todavía no hay registros de asistencia</h3><p className="mt-2 max-w-lg text-sm text-muted-foreground">Registra la primera asistencia de esta asignatura para comenzar a llevar el seguimiento.</p><Button className="mt-5" onClick={() => openSession(todayKey())}><CheckCircle2 className="size-4" /> Pasar primera lista</Button></div> : <div className={cn('grid gap-4', editing ? 'xl:grid-cols-[22rem_minmax(0,1fr)]' : '')}>
      {sessions.length ? <section className="rounded-2xl border border-border bg-card p-4 shadow-sm"><div className="flex items-center justify-between gap-3"><h3 className="text-sm font-extrabold">Asistencias recientes</h3><Link to={buildSubjectAttendanceHref(sectionSubjectId, courseId)} className="text-xs font-extrabold text-primary">Ver historial completo →</Link></div><div className="mt-3 space-y-2">{sessions.slice(0, 5).map((session) => <button key={session.date} type="button" onClick={() => openSession(session.date)} className={cn('flex w-full items-center gap-3 rounded-xl border p-3 text-left transition hover:border-primary/30 hover:bg-primary/[0.02]', selectedDate === session.date && editing ? 'border-primary/30 bg-primary/[0.03]' : 'border-border')}><CalendarDays className="size-4 shrink-0 text-primary" /><span className="min-w-0 flex-1"><strong className="block text-xs">{formatAttendanceDate(session.date)}</strong><span className="mt-1 block text-[10px] text-muted-foreground">{session.counts.P} P · {session.counts.A} A · {session.counts.E} E · {session.counts.R} R</span></span><strong className="text-sm text-primary">{session.percentage}%</strong></button>)}</div><p className="mt-4 rounded-xl bg-blue-50 px-3 py-2 text-[10px] leading-4 text-blue-700">Los porcentajes se calculan con las clases registradas en esta asignatura.</p></section> : null}
      {editing ? <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"><header className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center"><div className="min-w-0 flex-1"><h3 className="text-base font-extrabold">Pasar asistencia</h3><p className="mt-1 text-xs text-muted-foreground">{courseLabel} · {subjectName} · {formatAttendanceDate(selectedDate)}</p></div><input type="date" aria-label="Fecha de asistencia" value={selectedDate} onChange={(event) => openSession(event.target.value)} className="h-10 rounded-xl border border-border px-3 text-sm font-bold" /><Button variant="outline" className="h-10" onClick={() => setMarks(Object.fromEntries(roster.map((student) => [student.enrollmentId, 'P'])))}>Todos presentes</Button><Button variant="outline" className="h-10" onClick={() => setMarks(Object.fromEntries(roster.map((student) => [student.enrollmentId, null])))}>Limpiar</Button><Button disabled={saving || !academicPeriodId || Object.values(marks).some((mark) => !mark)} className="h-10" onClick={async () => { if (!academicPeriodId) return; setSaving(true); setError(null); try { await Promise.all(roster.map((student) => { const mark = marks[student.enrollmentId]; const status = markToStatus(mark); if (!status) return Promise.resolve(); return upsertAttendance({ type: 'class', enrollmentId: student.enrollmentId, academicPeriodId, sectionSubjectId, attendanceDate: selectedDate, status }) })); await load(); setSaved(true) } catch (caught) { setError(caught instanceof Error ? caught.message : 'No se pudo guardar la asistencia.') } finally { setSaving(false) } }}><CheckCircle2 className="size-4" /> {saving ? 'Guardando…' : 'Guardar asistencia'}</Button></header><div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/20 px-4 py-3"><AttendanceLegend /><p className="text-xs font-bold text-muted-foreground">{roster.length} estudiantes · {currentCounts.P} P · {currentCounts.A} A · {currentCounts.E} E · {currentCounts.R} R · {roster.length ? Math.round((currentCounts.P / roster.length) * 100) : 0}%</p></div>{saved ? <p role="status" className="border-b border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">Asistencia guardada correctamente.</p> : null}<div className="divide-y divide-border">{roster.map((student, index) => { const mark = marks[student.enrollmentId] ?? null; return <div key={student.enrollmentId} className="grid grid-cols-[2.5rem_minmax(0,1fr)_14rem] items-center gap-3 px-4 py-3 max-sm:grid-cols-[2rem_minmax(0,1fr)]"><span className="text-xs font-bold text-muted-foreground">{String(student.listNumber ?? index + 1).padStart(2, '0')}</span><button type="button" onClick={() => setSelectedStudentId(student.enrollmentId)} className="truncate text-left text-sm font-bold hover:text-primary">{student.firstName} {student.lastName}</button><div className="grid grid-cols-4 gap-2 max-sm:col-span-2">{(['P', 'A', 'E', 'R'] as const).map((value) => <button key={value} type="button" aria-label={`${value} ${student.firstName} ${student.lastName}`} aria-pressed={mark === value} onClick={() => setMarks((current) => ({ ...current, [student.enrollmentId]: value }))} className={cn('h-10 rounded-lg border text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', attendanceMarkClass(value, mark === value))}>{value}</button>)}</div></div> })}</div></section> : null}
    </div>}
    {selectedStudentId ? <AttendanceStudentSummary enrollmentId={selectedStudentId} students={roster} history={history} onClose={() => setSelectedStudentId(null)} /> : null}
  </section>
}

type AttendanceCounts = Record<'P' | 'A' | 'E' | 'R', number>
function countAttendanceMarks(marks: MonthlyAttendanceMark[]): AttendanceCounts { return marks.reduce<AttendanceCounts>((counts, mark) => { if (mark) counts[mark] += 1; return counts }, { P: 0, A: 0, E: 0, R: 0 }) }
function summarizeAttendanceSessions(records: ClassAttendanceHistoryRecord[], totalStudents: number) { const grouped = new Map<string, MonthlyAttendanceMark[]>(); records.forEach((record) => { const date = record.attendanceDate.slice(0, 10); grouped.set(date, [...(grouped.get(date) ?? []), statusToMark(record.status, record.notes)]) }); return [...grouped].map(([date, marks]) => { const counts = countAttendanceMarks(marks); return { date, counts, percentage: totalStudents ? Math.round((counts.P / totalStudents) * 100) : 0 } }).sort((left, right) => right.date.localeCompare(left.date)) }
function todayKey() { const today = new Date(); return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}` }
function formatAttendanceDate(value: string) { const date = new Date(`${value}T12:00:00`); return date.toLocaleDateString('es-DO', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) }
function attendanceMarkClass(mark: Exclude<MonthlyAttendanceMark, null>, active: boolean) { if (!active) return 'border-border text-muted-foreground hover:bg-muted'; return mark === 'P' ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : mark === 'A' ? 'border-red-300 bg-red-50 text-red-700' : mark === 'E' ? 'border-amber-300 bg-amber-50 text-amber-700' : 'border-violet-300 bg-violet-50 text-violet-700' }
function AttendanceLegend() { return <div className="flex flex-wrap gap-3">{([['P', 'Presente'], ['A', 'Ausente'], ['E', 'Excusa'], ['R', 'Retardo']] as const).map(([mark, label]) => <span key={mark} className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground"><strong className={cn('grid size-6 place-items-center rounded-md border', attendanceMarkClass(mark, true))}>{mark}</strong>{label}</span>)}</div> }
function AttendanceMetric({ label, value, tone }: { label: string; value: string; tone: 'emerald' | 'red' | 'amber' | 'violet' | 'blue' }) { const tones = { emerald: 'bg-emerald-50 text-emerald-700', red: 'bg-red-50 text-red-700', amber: 'bg-amber-50 text-amber-700', violet: 'bg-violet-50 text-violet-700', blue: 'bg-blue-50 text-blue-700' }; return <div className="rounded-2xl border border-border bg-card p-4 shadow-sm"><span className={cn('inline-flex rounded-lg px-2 py-1 text-[10px] font-extrabold', tones[tone])}>{label}</span><strong className="mt-3 block text-2xl leading-none">{value}</strong></div> }
function AttendanceStudentSummary({ enrollmentId, students, history, onClose }: { enrollmentId: string; students: StudentAttendanceRow[]; history: ClassAttendanceHistoryRecord[]; onClose: () => void }) { const student = students.find((item) => item.enrollmentId === enrollmentId); if (!student) return null; const records = history.filter((record) => record.enrollmentId === enrollmentId); const marks = records.map((record) => statusToMark(record.status, record.notes)); const counts = countAttendanceMarks(marks); const percentage = records.length ? Math.round((counts.P / records.length) * 100) : null; return <section className="rounded-2xl border border-primary/20 bg-card p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div><h3 className="font-extrabold">{student.firstName} {student.lastName}</h3><p className="mt-1 text-xs text-muted-foreground">Asistencia en esta asignatura · {percentage === null ? 'Sin registros' : `${percentage}%`}</p></div><button type="button" onClick={onClose} aria-label="Cerrar resumen del estudiante" className="grid size-10 place-items-center rounded-xl hover:bg-muted"><X className="size-4" /></button></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4"><AttendanceMetric label="Presentes" value={String(counts.P)} tone="emerald" /><AttendanceMetric label="Ausencias" value={String(counts.A)} tone="red" /><AttendanceMetric label="Excusas" value={String(counts.E)} tone="amber" /><AttendanceMetric label="Retardos" value={String(counts.R)} tone="violet" /></div><div className="mt-4 flex flex-wrap gap-2">{records.slice(0, 5).map((record) => <span key={record.id} className="rounded-lg bg-muted/40 px-3 py-2 text-xs"><strong>{formatAttendanceDate(record.attendanceDate.slice(0, 10))}</strong> · {statusToMark(record.status, record.notes)}</span>)}</div></section> }

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
  const blockActivities = activities.filter((activity) => activity.competencyBlockId === block.id)
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
  return <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"><header className="flex items-start gap-3 border-b border-border p-4"><button type="button" onClick={onBack} aria-label="Volver a las actividades" className="grid size-11 shrink-0 place-items-center rounded-xl border border-border text-primary hover:bg-muted"><ArrowLeft className="size-4" /></button><div className="min-w-0 flex-1"><p className="text-[10px] font-black uppercase tracking-wider text-primary">Detalle de la actividad</p><h3 className="mt-1 text-lg font-extrabold">{activity.name}</h3><p className="mt-1 text-xs text-muted-foreground">{block.shortName} · {block.name}</p></div><ActivityStatusBadge status={record ? 'graded' : 'pending'} /></header><div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_18rem]"><div><h4 className="text-xs font-extrabold uppercase text-muted-foreground">Descripción</h4><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">{activity.description || 'Sin descripción registrada.'}</p></div><dl className="space-y-3 rounded-xl bg-muted/25 p-4 text-xs"><ActivityDefinition label="Fecha" value={formatShortDate(activity.date)} /><ActivityDefinition label="Valor total" value={`${activity.maxScore} puntos`} /><ActivityDefinition label="Obtenido" value={record ? `${record.score} puntos` : 'Sin evaluar'} /><ActivityDefinition label="Estado" value={activityGradeState(record, activity)} /><ActivityDefinition label="Instrumento" value={activityInstrumentLabel(activity.instrumentType)} /></dl></div><footer className="flex justify-end border-t border-border p-4"><Button variant="outline" disabled={!record || !activity.instrumentType} onClick={onInstrument}><ClipboardList className="size-4" /> Ver instrumento evaluado</Button></footer></section>
}

function EvaluatedInstrument({ activity, record, studentName, onBack }: { activity: GradingActivity; record: GradeRecordRow | null; studentName: string; onBack: () => void }) {
  const configuration = activityRubricConfiguration(activity)
  const result = record?.instrumentResult
  const complete = Boolean(result && result.selections.length === configuration.criteria.length)
  return <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"><header className="flex items-start gap-3 border-b border-border p-4"><button type="button" onClick={onBack} aria-label="Volver al detalle de la actividad" className="grid size-11 shrink-0 place-items-center rounded-xl border border-border text-primary hover:bg-muted"><ArrowLeft className="size-4" /></button><div className="min-w-0 flex-1"><p className="text-[10px] font-black uppercase tracking-wider text-primary">Instrumento evaluado</p><h3 className="mt-1 text-lg font-extrabold">{activityInstrumentLabel(activity.instrumentType)}</h3><p className="mt-1 text-xs text-muted-foreground">{activity.name} · {studentName}</p></div><span className={cn('rounded-full px-3 py-1 text-[10px] font-extrabold', complete ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800')}>{complete ? 'Evaluado' : 'Sin desglose'}</span></header>{!record ? <p className="m-4 rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">Pendiente de evaluación.</p> : !result ? <div className="m-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"><strong className="block">No existe evidencia por criterio para esta calificación histórica.</strong>El sistema conserva el total real de {record.score} / {record.maxScore}, pero no inventará niveles ni selecciones que no fueron registrados.</div> : <div className="p-4"><div className="overflow-x-auto"><table className="w-full min-w-[36rem] text-sm"><thead className="bg-muted/30 text-[10px] font-black uppercase tracking-wide text-muted-foreground"><tr><th className="px-4 py-3 text-left">Criterio</th><th className="px-4 py-3 text-left">Nivel seleccionado</th><th className="px-4 py-3 text-right">Puntuación</th></tr></thead><tbody className="divide-y divide-border">{configuration.criteria.map((criterion, index) => { const selection = result.selections[index]; const level = Number.isInteger(selection) ? configuration.levels[selection] : null; const points = result.criterionScores[index]; return <tr key={`${criterion.title}-${index}`}><td className="px-4 py-4"><strong>{criterion.title}</strong><span className="mt-1 block text-xs text-muted-foreground">Máximo: {criterion.maximum} pts</span></td><td className="px-4 py-4"><span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-bold', level ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600')}>{level?.label ?? 'Sin seleccionar'}</span></td><td className="px-4 py-4 text-right font-extrabold text-primary">{Number.isFinite(points) ? `${points} / ${criterion.maximum}` : '—'}</td></tr> })}</tbody></table></div><div className="mt-4 flex items-center justify-between rounded-xl bg-primary/[0.045] px-4 py-3"><strong>Total</strong><strong className="text-xl text-primary">{record.score} / {record.maxScore}</strong></div></div>}</section>
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

function HorarioTab({ sectionId, sectionSubjectId }: { sectionId: string; sectionSubjectId: string | null }) {
  const [schedule, setSchedule] = useState<Array<{ dayOfWeek: number; subjectName: string; startTime: string; endTime: string; room: string | null }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const dayLabels = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']

  useEffect(() => {
    getScheduleEntries({ sectionId, ...(sectionSubjectId ? { sectionSubjectId } : {}) })
      .then((data) => setSchedule(data))
      .catch((e) => setError(e instanceof Error ? e.message : 'Error al cargar horario'))
      .finally(() => setLoading(false))
  }, [sectionId, sectionSubjectId])

  if (loading) return <div className="flex min-h-[200px] items-center justify-center text-sm text-muted-foreground">Cargando horario...</div>
  if (error) return <ErrorState message={error} />
  if (!schedule.length) return <EmptyState title="Sin horario" description="No hay horario registrado para esta seccion." />

  const sorted = [...schedule].sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime))

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted text-xs font-bold uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-5 py-3">Dia</th>
            <th className="px-5 py-3">Hora</th>
            <th className="px-5 py-3">Asignatura</th>
            <th className="px-5 py-3">Aula</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sorted.map((e, i) => (
            <tr key={i} className="text-foreground">
              <td className="px-5 py-3 font-bold">{dayLabels[e.dayOfWeek - 1] ?? `Dia ${e.dayOfWeek}`}</td>
              <td className="px-5 py-3 text-muted-foreground">{e.startTime} - {e.endTime}</td>
              <td className="px-5 py-3">{e.subjectName}</td>
              <td className="px-5 py-3 text-muted-foreground">{e.room ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
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
  const gradeNumber = item.grade.name.replace('.º', '')

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div
        className="flex flex-1 cursor-pointer flex-col p-4"
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
              className="flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-black text-primary-foreground"
              style={{ backgroundColor: levelStyle.color }}
            >
              {gradeNumber}
              <span className="ml-px text-xs font-bold opacity-80">{item.section.name}</span>
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-base font-black tracking-tight text-foreground">
                {item.grade.name} {item.section.name}
              </h3>
              <p className="mt-0.5 truncate text-xs font-medium text-muted-foreground">
                {item.cycleName} · {cleanLevelName(item.levelName)}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide', item.archived ? 'bg-muted text-muted-foreground' : 'bg-emerald-50 text-emerald-700')}>
              <span className={cn('size-1.5 rounded-full', item.archived ? 'bg-slate-400' : 'bg-emerald-500')} aria-hidden="true" /> {item.archived ? 'Archivado' : 'Activo'}
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 divide-x divide-border rounded-xl bg-muted/40 py-2.5 text-center">
          <span><strong className="block text-sm font-black text-foreground tabular-nums">{item.section.studentCount ?? 0}</strong><span className="text-[10px] text-muted-foreground">estudiantes</span></span>
          <span><strong className="block text-sm font-black text-foreground tabular-nums">{item.assignments.length}</strong><span className="text-[10px] text-muted-foreground">asignaturas</span></span>
          <span><strong className="block text-sm font-black text-foreground tabular-nums">{teamCount}</strong><span className="text-[10px] text-muted-foreground">equipos</span></span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2">
        <div className="flex min-w-0 items-center gap-1">
          {canManage ? (
            <FooterAction label="Sección" tooltip="Agregar nueva sección" onClick={() => onAddSection(item.grade)}><Plus className="h-3.5 w-3.5" /></FooterAction>
          ) : null}
        </div>
        {canManage ? (
          <div className="relative" ref={menuRef}>
            <button type="button" title="Más acciones" className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label="Más acciones" aria-haspopup="menu" aria-expanded={menuOpen} onClick={(event) => { event.stopPropagation(); setMenuOpen((open) => !open) }}>
              <MoreHorizontal className="size-4" />
            </button>
            {menuOpen ? (
              <div role="menu" className="absolute bottom-10 right-0 z-20 w-52 origin-bottom-right overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-xl motion-safe:animate-[fadeIn_140ms_ease-out]">
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

function FooterAction({
  label,
  tooltip,
  onClick,
  children,
}: {
  label: string
  tooltip: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-2 text-[11px] font-bold text-muted-foreground transition-all duration-150 hover:scale-[1.02] hover:bg-secondary hover:text-primary"
      aria-label={label}
      title={tooltip}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
    >
      {children}
      <span>{label}</span>
    </button>
  )
}

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
  return `${gradeName} ${sectionName}`.trim()
}

function getSubjectIcon(subjectName: string, appearanceIcon?: string | null) {
  if (appearanceIcon) return getAppearanceIcon(appearanceIcon)
  const normalized = normalizeText(subjectName)
  if (normalized.includes('matemat') || normalized.includes('algebra') || normalized.includes('geometr')) return <Calculator className="size-5" />
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
  if (!assignment.appearanceColor) return getSubjectColor(assignment.subjectName)
  return { color: assignment.appearanceColor, soft: `${assignment.appearanceColor}14` }
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
