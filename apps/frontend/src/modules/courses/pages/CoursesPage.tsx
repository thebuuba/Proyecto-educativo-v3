import {
  AlertCircle,
  Archive,
  ArchiveRestore,
  ArrowLeft,
  Bookmark,
  BookOpen,
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  CheckSquare,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Library,
  LogIn,
  MapPin,
  MoreHorizontal,
  Plus,
  Power,
  RotateCcw,
  Search,
  SearchX,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  UsersRound,
  X,
} from 'lucide-react'
import { memo, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Modal } from '@/components/ui/Modal'

import { useAuth } from '@/modules/auth/hooks/useAuth'
import { SectionForm } from '@/modules/courses/components/SectionForm'
import { SubjectAssignmentForm } from '@/modules/courses/components/SubjectAssignmentForm'
import { TeacherAssignmentForm } from '@/modules/courses/components/TeacherAssignmentForm'
import { CourseTeamsPanel } from '@/modules/courses/components/CourseTeamsPanel'
import {
  CoursesAdvancedFiltersDrawer,
  countAdvancedFilters,
  type CourseAdvancedFilters,
} from '@/modules/courses/components/CoursesAdvancedFiltersDrawer'
import { getStudentsBySection } from '@/modules/attendance/services/attendanceService'
import type { StudentAttendanceRow } from '@/modules/attendance/types'
import { getStudentsForGrading, getAcademicPeriods } from '@/modules/grading/services/gradingService'
import { getPlanningEntries } from '@/modules/planning/services/planningService'
import { getScheduleEntries } from '@/modules/schedule/services/scheduleService'
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
  assignments: SectionSubjectAssignment[]
  assignment: SectionSubjectAssignment | null
  subjectName: string
  levelName: string
  cycleName: string
}

type SavedCourseView = {
  id: string
  name: string
  search: string
  filters: CourseAdvancedFilters
}

type SubjectPalette = { color: string; soft: string }

// El orden importa: primero se detectan las materias específicas y después
// sus familias generales. Así, por ejemplo, Educación Física no hereda
// accidentalmente el color de Ciencias Físicas.
const subjectColorRules: Array<{ terms: string[]; palette: SubjectPalette }> = [
  { terms: ['educacion fisica', 'deporte'], palette: { color: '#e23f49', soft: '#e23f491a' } },
  { terms: ['ciencias de la vida', 'biologia', 'ecologia'], palette: { color: '#06945c', soft: '#06945c1a' } },
  { terms: ['ciencias de la tierra', 'tierra y del universo', 'geologia', 'astronomia'], palette: { color: '#008d82', soft: '#008d821a' } },
  { terms: ['quimica'], palette: { color: '#00869b', soft: '#00869b1a' } },
  { terms: ['ciencias fisicas', 'fisica'], palette: { color: '#7040dc', soft: '#7040dc1a' } },
  { terms: ['ciencias naturales', 'ciencias de la naturaleza'], palette: { color: '#138a4b', soft: '#138a4b1a' } },
  { terms: ['matematica', 'algebra', 'geometria'], palette: { color: '#6734d1', soft: '#6734d11a' } },
  { terms: ['lengua espanola', 'literatura', 'comunicacion'], palette: { color: '#1d61c7', soft: '#1d61c71a' } },
  { terms: ['ingles', 'frances', 'idioma', 'lenguas modernas'], palette: { color: '#0086a6', soft: '#0086a61a' } },
  { terms: ['ciencias sociales', 'historia', 'geografia', 'civica'], palette: { color: '#d96008', soft: '#d960081a' } },
  { terms: ['educacion artistica', 'arte', 'musica'], palette: { color: '#d12f7c', soft: '#d12f7c1a' } },
  { terms: ['tecnologia', 'informatica', 'computacion'], palette: { color: '#007fb8', soft: '#007fb81a' } },
  { terms: ['formacion integral', 'etica', 'religion'], palette: { color: '#4f54ca', soft: '#4f54ca1a' } },
  { terms: ['orientacion', 'tutoria'], palette: { color: '#b87500', soft: '#b875001a' } },
]

const defaultSubjectColor: SubjectPalette = { color: '#3f5872', soft: '#3f587218' }

const levelStyles: Record<string, { color: string; soft: string }> = {
  'Primaria': { color: '#1e4f8f', soft: 'hsl(224 62% 33% / 0.08)' },
  'Secundaria': { color: '#6f3cc3', soft: 'hsl(262 52% 47% / 0.08)' },
}

const defaultLevelStyle = { color: '#1e4f8f', soft: 'hsl(224 62% 33% / 0.08)' }

function getSubjectColor(subjectName: string) {
  const normalized = normalizeText(subjectName)
  const match = subjectColorRules.find(({ terms }) => terms.some((term) => normalized.includes(term)))
  return match?.palette ?? defaultSubjectColor
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

function loadSavedCourseViews(): SavedCourseView[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = window.localStorage.getItem('aulabase:courses:saved-views')
    const parsed = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
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
    restoreSubjectAssignment,
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
    kind: 'grade' | 'section' | 'assignment' | 'permanent-assignment'
    id: string
    label: string
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
  const [gradeFilter, setGradeFilter] = useState('all')
  const [sectionFilter, setSectionFilter] = useState('all')
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false)
  const [saveViewOpen, setSaveViewOpen] = useState(false)
  const [savedViews, setSavedViews] = useState<SavedCourseView[]>(loadSavedCourseViews)
  const [advancedFilters, setAdvancedFilters] = useState<CourseAdvancedFilters>(defaultAdvancedFilters)
  const [advancedDraft, setAdvancedDraft] = useState<CourseAdvancedFilters>(defaultAdvancedFilters)
  const [advancedInitial, setAdvancedInitial] = useState<CourseAdvancedFilters>(defaultAdvancedFilters)
  const moreFiltersButtonRef = useRef<HTMLButtonElement>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)

  function openAdvancedFilters() {
    const snapshot: CourseAdvancedFilters = {
      ...advancedFilters,
      level: levelFilter,
      cycle: cycleFilter,
      subject: subjectFilter,
      grade: gradeFilter,
      section: sectionFilter,
    }
    setAdvancedDraft(snapshot)
    setAdvancedInitial(snapshot)
    setMoreFiltersOpen(true)
  }

  function closeAdvancedFilters() {
    setMoreFiltersOpen(false)
    requestAnimationFrame(() => moreFiltersButtonRef.current?.focus())
  }

  function resetCourseFilters() {
    setSearchQuery('')
    setLevelFilter('all')
    setCycleFilter('all')
    setSubjectFilter('all')
    setGradeFilter('all')
    setSectionFilter('all')
    setAdvancedFilters(defaultAdvancedFilters)
  }

  function applySavedView(view: SavedCourseView) {
    setSearchQuery(view.search)
    setLevelFilter(view.filters.level)
    setCycleFilter(view.filters.cycle)
    setSubjectFilter(view.filters.subject)
    setGradeFilter(view.filters.grade)
    setSectionFilter(view.filters.section)
    setAdvancedFilters(view.filters)
  }

  function saveCurrentView(name: string) {
    const view: SavedCourseView = {
      id: crypto.randomUUID(),
      name,
      search: searchQuery,
      filters: {
        ...advancedFilters,
        level: levelFilter,
        cycle: cycleFilter,
        subject: subjectFilter,
        grade: gradeFilter,
        section: sectionFilter,
      },
    }
    const next = [...savedViews, view]
    setSavedViews(next)
    localStorage.setItem('aulabase:courses:saved-views', JSON.stringify(next))
    setSaveViewOpen(false)
  }

  function removeSavedView(id: string) {
    const next = savedViews.filter((view) => view.id !== id)
    setSavedViews(next)
    localStorage.setItem('aulabase:courses:saved-views', JSON.stringify(next))
  }

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
      } else if (deleteTarget.kind === 'assignment') {
        await removeSubjectAssignment(deleteTarget.id)
      } else {
        await permanentlyDeleteSubjectAssignment(deleteTarget.id)
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

  const handleOpen = useCallback((id: string) => setSelectedCourseId(id), [])
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
  const handleDeleteArchivedAssignment = useCallback((assignment: SectionSubjectAssignment) =>
    setDeleteTarget({ kind: 'permanent-assignment', id: assignment.id, label: assignment.subjectName }), [])
  const handleRestoreAssignment = useCallback(async (assignment: SectionSubjectAssignment) => {
    try {
      await restoreSubjectAssignment(assignment.id)
      setActionError(null)
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'No se pudo restaurar la asignatura.')
    }
  }, [restoreSubjectAssignment])

  const courseCards = useMemo(() => buildCourseCards(grades), [grades])
  const appliedCourseFilters = useMemo<CourseAdvancedFilters>(() => ({
    ...advancedFilters,
    level: levelFilter,
    cycle: cycleFilter,
    subject: subjectFilter,
    grade: gradeFilter,
    section: sectionFilter,
  }), [advancedFilters, cycleFilter, gradeFilter, levelFilter, sectionFilter, subjectFilter])
  const filteredCourseCards = useMemo(
    () => applyCourseFilters(courseCards, appliedCourseFilters, debouncedSearch),
    [appliedCourseFilters, courseCards, debouncedSearch],
  )
  const levelFilters = useMemo(() => uniqueValues(courseCards.map((item) => item.levelName)), [courseCards])
  const cycleFilters = useMemo(() => uniqueValues(courseCards.map((item) => item.cycleName)), [courseCards])
  const subjectFilters = useMemo(
    () => uniqueValues(courseCards.flatMap((item) => item.assignments.map((assignment) => assignment.subjectName))),
    [courseCards],
  )
  const gradeFilters = useMemo(
    () => Array.from(new Map(courseCards.map((item) => [item.grade.id, item.grade])).values()),
    [courseCards],
  )
  const sectionFilters = useMemo(
    () => Array.from(new Map(
      courseCards
        .filter((item) => gradeFilter === 'all' || item.grade.id === gradeFilter)
        .map((item) => [item.section.id, item.section]),
    ).values()),
    [courseCards, gradeFilter],
  )
  const drawerCycleFilters = useMemo(
    () => uniqueValues(courseCards.filter((item) => advancedDraft.level === 'all' || item.levelName === advancedDraft.level).map((item) => item.cycleName)),
    [advancedDraft.level, courseCards],
  )
  const drawerGradeFilters = useMemo(
    () => Array.from(new Map(courseCards.filter((item) => (advancedDraft.level === 'all' || item.levelName === advancedDraft.level) && (advancedDraft.cycle === 'all' || item.cycleName === advancedDraft.cycle)).map((item) => [item.grade.id, item.grade])).values()),
    [advancedDraft.cycle, advancedDraft.level, courseCards],
  )
  const drawerSectionFilters = useMemo(
    () => Array.from(new Map(courseCards.filter((item) => advancedDraft.grade === 'all' || item.grade.id === advancedDraft.grade).map((item) => [item.section.id, item.section])).values()),
    [advancedDraft.grade, courseCards],
  )
  const advancedPreviewCount = useMemo(
    () => applyCourseFilters(courseCards, advancedDraft, debouncedSearch).length,
    [advancedDraft, courseCards, debouncedSearch],
  )
  const maximumStudents = useMemo(() => Math.max(0, ...courseCards.map((item) => item.section.studentCount ?? 0)), [courseCards])
  const groupedCourses = useMemo(() => groupCoursesByLevel(filteredCourseCards), [filteredCourseCards])
  const selectedCourse = useMemo(
    () => courseCards.find((item) => item.id === selectedCourseId) ?? null,
    [courseCards, selectedCourseId],
  )

  const totalStudents = useMemo(
    () => {
      const sections = new Map<string, number>()
      courseCards.forEach((item) => sections.set(item.section.id, toSafeCount(item.section.studentCount)))
      return Array.from(sections.values()).reduce((sum, count) => sum + count, 0)
    },
    [courseCards],
  )
  const totalAssignments = useMemo(
    () => courseCards.reduce((total, item) => total + item.assignments.length, 0),
    [courseCards],
  )
  const totalTeams = useMemo(
    () => courseCards.reduce(
      (total, item) => total + item.assignments.reduce(
        (sum, assignment) => sum + toSafeCount(assignment.teamCount),
        0,
      ),
      0,
    ),
    [courseCards],
  )

  return (
    <div className="w-full min-w-0 space-y-6">
      {selectedCourse ? (
        <CourseWorkspace
          item={selectedCourse}
          schoolYearName={currentSchoolYear?.name ?? ''}
          schoolYearId={currentSchoolYear?.id ?? null}
          canEnroll={canEnroll}
          canManage={canManage}
          onAssignSubject={handleOpenAssignSubject}
          onArchiveSubject={handleDeleteAssignment}
          onRestoreSubject={handleRestoreAssignment}
          onDeleteArchivedSubject={handleDeleteArchivedAssignment}
          onBack={() => setSelectedCourseId(null)}
        />
      ) : (
        <>
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="sr-only">Mis cursos</h1>
              <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{courseCards.length} cursos</span>
                <span aria-hidden="true">·</span>
                <span className="font-bold text-foreground">{totalStudents} estudiantes</span>
                {currentSchoolYear ? <><span aria-hidden="true">·</span><span>Año escolar {currentSchoolYear.name}</span></> : null}
              </p>
            </div>

            {canManage ? (
              <Button
                className="h-10 justify-center rounded-lg border-0 px-5 text-white shadow-md"
                style={{ background: 'linear-gradient(135deg, #6538e8, #4f25d0)' }}
                onClick={openCreateAssignmentFlow}
              >
                <Plus className="h-4 w-4" /> Nuevo curso
              </Button>
            ) : null}
          </header>

          <section aria-labelledby="courses-summary-title">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <h2 id="courses-summary-title" className="text-sm font-extrabold text-foreground">Resumen general</h2>
              <span className="text-xs text-muted-foreground">Año escolar {currentSchoolYear?.name ?? 'sin configurar'}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
              <CourseStatCard icon={<Library className="size-5" />} value={courseCards.length} label="Cursos" detail="Todos los niveles" tone="blue" />
              <CourseStatCard icon={<UsersRound className="size-5" />} value={totalStudents} label="Estudiantes" detail="Matriculados" tone="green" />
              <CourseStatCard icon={<BookOpen className="size-5" />} value={totalAssignments} label="Asignaturas" detail="En todas las secciones" tone="violet" />
              <CourseStatCard icon={<UsersRound className="size-5" />} value={totalTeams} label="Equipos" detail="Por asignatura" tone="orange" />
              <CourseStatCard icon={<CheckCircle2 className="size-5" />} value={courseCards.length} label="Cursos activos" detail="En este momento" tone="emerald" />
              <CourseStatCard icon={<CalendarCheck2 className="size-5" />} value={currentSchoolYear?.name ?? '—'} label="Año escolar" detail="Actual" tone="sky" />
            </div>
          </section>

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

          <section className="relative rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-white to-slate-50/80 p-4 shadow-[0_10px_30px_-22px_rgba(15,45,90,0.55)] ring-1 ring-slate-100">
            <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-[repeat(6,minmax(8.5rem,1fr))_auto]">
              <FilterSelect label="Nivel" value={levelFilter} onChange={setLevelFilter} options={levelFilters.map((value) => ({ value, label: cleanLevelName(value) }))} />
              <FilterSelect label="Ciclo" value={cycleFilter} onChange={setCycleFilter} options={cycleFilters.map((value) => ({ value, label: value }))} />
              <FilterSelect label="Asignatura" value={subjectFilter} onChange={setSubjectFilter} options={subjectFilters.map((value) => ({ value, label: value }))} />
              <FilterSelect label="Grado" value={gradeFilter} onChange={(value) => { setGradeFilter(value); setSectionFilter('all') }} options={gradeFilters.map((grade) => ({ value: grade.id, label: grade.name }))} />
              <FilterSelect label="Sección" value={sectionFilter} onChange={setSectionFilter} options={sectionFilters.map((section) => ({ value: section.id, label: section.name }))} />
              <FilterSelect label="Año" value={currentSchoolYear?.id ?? 'all'} onChange={() => undefined} options={currentSchoolYear ? [{ value: currentSchoolYear.id, label: currentSchoolYear.name }] : []} />
              <button
                ref={moreFiltersButtonRef}
                type="button"
                aria-expanded={moreFiltersOpen}
                aria-controls="course-advanced-filters"
                onClick={openAdvancedFilters}
                className={cn('inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-xs font-extrabold transition-all', moreFiltersOpen ? 'border-primary/30 bg-primary text-white shadow-md shadow-primary/15' : 'border-slate-200 bg-white text-slate-600 shadow-sm hover:border-primary/30 hover:text-primary')}
              >
                <SlidersHorizontal className="size-4" /> Más filtros
                {countAdvancedFilters(advancedFilters) ? <span className={cn('flex size-5 items-center justify-center rounded-full text-[10px]', moreFiltersOpen ? 'bg-white text-primary' : 'bg-primary text-white')}>{countAdvancedFilters(advancedFilters)}</span> : null}
              </button>
            </div>

            {levelFilter !== 'all' || cycleFilter !== 'all' || subjectFilter !== 'all' || gradeFilter !== 'all' || sectionFilter !== 'all' || countAdvancedFilters(advancedFilters) ? (
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                {levelFilter !== 'all' ? <ActiveFilter label={`Nivel: ${cleanLevelName(levelFilter)}`} onRemove={() => setLevelFilter('all')} /> : null}
                {cycleFilter !== 'all' ? <ActiveFilter label={`Ciclo: ${cycleFilter}`} onRemove={() => setCycleFilter('all')} /> : null}
                {subjectFilter !== 'all' ? <ActiveFilter label={`Asignatura: ${subjectFilter}`} onRemove={() => setSubjectFilter('all')} /> : null}
                {gradeFilter !== 'all' ? <ActiveFilter label={`Grado: ${gradeFilters.find((grade) => grade.id === gradeFilter)?.name ?? ''}`} onRemove={() => { setGradeFilter('all'); setSectionFilter('all') }} /> : null}
                {sectionFilter !== 'all' ? <ActiveFilter label={`Sección: ${sectionFilters.find((section) => section.id === sectionFilter)?.name ?? ''}`} onRemove={() => setSectionFilter('all')} /> : null}
                {advancedFilters.minStudents || advancedFilters.maxStudents ? <ActiveFilter label={`${advancedFilters.minStudents || 0}–${advancedFilters.maxStudents || maximumStudents} estudiantes`} onRemove={() => setAdvancedFilters((current) => ({ ...current, minStudents: '', maxStudents: '' }))} /> : null}
                {advancedFilters.studentPresence !== 'any' ? <ActiveFilter label={advancedFilters.studentPresence === 'with' ? 'Con estudiantes' : 'Sin estudiantes'} onRemove={() => setAdvancedFilters((current) => ({ ...current, studentPresence: 'any' }))} /> : null}
                {advancedFilters.teamPresence !== 'any' ? <ActiveFilter label={advancedFilters.teamPresence === 'with' ? 'Con equipos' : 'Sin equipos'} onRemove={() => setAdvancedFilters((current) => ({ ...current, teamPresence: 'any' }))} /> : null}
                {advancedFilters.setupStatus !== 'any' ? <ActiveFilter label={{ 'with-teacher': 'Con docente', 'without-teacher': 'Sin docente', 'without-subject': 'Sin asignatura' }[advancedFilters.setupStatus]} onRemove={() => setAdvancedFilters((current) => ({ ...current, setupStatus: 'any' }))} /> : null}
                {advancedFilters.sortBy !== 'recent' ? <ActiveFilter label="Orden personalizado" onRemove={() => setAdvancedFilters((current) => ({ ...current, sortBy: 'recent' }))} /> : null}
                <button type="button" className="ml-1 text-xs font-bold text-primary hover:underline" onClick={resetCourseFilters}>Limpiar filtros</button>
              </div>
            ) : null}

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-3">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                {savedViews.length ? (
                  <>
                    <span className="text-[11px] font-extrabold uppercase tracking-wide text-muted-foreground">Vistas guardadas</span>
                    {savedViews.map((view) => (
                      <span key={view.id} className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 text-violet-700">
                        <button type="button" className="px-3 py-1.5 text-xs font-bold hover:text-violet-900" onClick={() => applySavedView(view)}>{view.name}</button>
                        <button type="button" className="mr-1 rounded-full p-1 hover:bg-violet-100" aria-label={`Eliminar vista ${view.name}`} onClick={() => removeSavedView(view.id)}><X className="size-3" /></button>
                      </span>
                    ))}
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">Guarda una combinaciÃ³n para reutilizarla.</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-extrabold text-slate-700 shadow-sm transition hover:border-primary/25 hover:text-primary" onClick={() => setSaveViewOpen(true)}><Bookmark className="size-4" /> Guardar vista</button>
                <button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-extrabold text-slate-700 shadow-sm transition hover:border-primary/25 hover:text-primary" onClick={resetCourseFilters}><RotateCcw className="size-4" /> Restablecer filtros</button>
              </div>
            </div>
          </section>

          <CoursesAdvancedFiltersDrawer
            open={moreFiltersOpen}
            filters={advancedDraft}
            initialFilters={advancedInitial}
            levelOptions={levelFilters.map((value) => ({ value, label: cleanLevelName(value) }))}
            cycleOptions={drawerCycleFilters.map((value) => ({ value, label: value }))}
            subjectOptions={subjectFilters.map((value) => ({ value, label: value }))}
            gradeOptions={drawerGradeFilters.map((grade) => ({ value: grade.id, label: grade.name }))}
            sectionOptions={drawerSectionFilters.map((section) => ({ value: section.id, label: section.name }))}
            schoolYearName={currentSchoolYear?.name ?? 'Sin año activo'}
            studentMaximum={maximumStudents}
            resultCount={advancedPreviewCount}
            onChange={setAdvancedDraft}
            onReset={() => setAdvancedDraft(defaultAdvancedFilters)}
            onClose={closeAdvancedFilters}
            onApply={() => {
              setLevelFilter(advancedDraft.level)
              setCycleFilter(advancedDraft.cycle)
              setSubjectFilter(advancedDraft.subject)
              setGradeFilter(advancedDraft.grade)
              setSectionFilter(advancedDraft.section)
              setAdvancedFilters(advancedDraft)
              closeAdvancedFilters()
            }}
          />

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
                    <span className="flex size-9 items-center justify-center rounded-xl text-white shadow-sm" style={{ backgroundColor: getLevelStyle(group.levelName).color }}><BookOpen className="size-4" /></span>
                    <h2 className="text-base font-extrabold text-foreground">Nivel {cleanLevelName(group.levelName)}</h2>
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
                              schoolYearName={currentSchoolYear?.name ?? ''}
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

      {saveViewOpen ? (
        <SaveCourseViewDialog
          onSave={saveCurrentView}
          onClose={() => setSaveViewOpen(false)}
        />
      ) : null}

      {deleteTarget ? (
        <ConfirmDialog
          title={
            deleteTarget.kind === 'grade'
              ? 'Inactivar curso'
              : deleteTarget.kind === 'section'
                ? 'Inactivar seccion'
              : deleteTarget.kind === 'assignment'
                ? 'Archivar asignatura'
                : 'Eliminar asignatura definitivamente'
          }
          description={
            deleteTarget.kind === 'grade'
              ? `Inactivar el curso "${deleteTarget.label}"? Se conservara el historial relacionado.`
              : deleteTarget.kind === 'section'
                ? `Inactivar la seccion "${deleteTarget.label}"? Se conservara el historial relacionado.`
                : deleteTarget.kind === 'assignment'
                  ? `¿Archivar la asignatura "${deleteTarget.label}"? Dejará de aparecer entre las asignaturas activas, pero su historial se conservará.`
                  : `¿Eliminar definitivamente "${deleteTarget.label}"? Se borrarán sus actividades, calificaciones, asistencias, horarios y planificaciones. Esta acción no se puede deshacer.`
          }
          confirmLabel={deleteTarget.kind === 'assignment' ? 'Archivar asignatura' : deleteTarget.kind === 'permanent-assignment' ? 'Eliminar definitivamente' : 'Inactivar'}
          destructive
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      ) : null}
    </div>
  )
}

function CourseStatCard({
  icon,
  value,
  label,
  detail,
  tone,
}: {
  icon: ReactNode
  value: string | number
  label: string
  detail: string
  tone: 'blue' | 'green' | 'violet' | 'orange' | 'emerald' | 'sky'
}) {
  const tones = {
    blue: 'bg-blue-50 text-blue-700 ring-blue-100',
    green: 'bg-green-50 text-green-700 ring-green-100',
    violet: 'bg-violet-50 text-violet-700 ring-violet-100',
    orange: 'bg-orange-50 text-orange-700 ring-orange-100',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    sky: 'bg-sky-50 text-sky-700 ring-sky-100',
  }

  return (
    <article className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_10px_28px_-24px_rgba(15,45,90,0.7)]">
      <span className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl ring-1', tones[tone])}>{icon}</span>
      <div className="min-w-0">
        <p className="truncate text-xl font-extrabold leading-none text-foreground tabular-nums">{value}</p>
        <p className="mt-1 text-xs font-extrabold text-foreground">{label}</p>
        <p className="truncate text-[10px] text-muted-foreground">{detail}</p>
      </div>
    </article>
  )
}

function SaveCourseViewDialog({ onSave, onClose }: { onSave: (name: string) => void; onClose: () => void }) {
  const [name, setName] = useState('')
  const validName = name.trim().length > 0

  return (
    <Modal title="Guardar vista" description="Ponle un nombre a esta combinaciÃ³n de filtros." onClose={onClose} className="max-w-md rounded-2xl" contentClassName="overflow-visible">
      <form className="space-y-5 p-5" onSubmit={(event) => { event.preventDefault(); if (validName) onSave(name.trim()) }}>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-foreground">Nombre de la vista</span>
          <input autoFocus value={name} maxLength={40} onChange={(event) => setName(event.target.value)} placeholder="Ejemplo: Secundaria con equipos" className="h-11 w-full rounded-xl border border-border bg-card px-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" />
        </label>
        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={!validName}><Bookmark className="size-4" /> Guardar vista</Button>
        </div>
      </form>
    </Modal>
  )
}

function CourseWorkspace({
  item,
  schoolYearName,
  schoolYearId,
  canEnroll,
  canManage,
  onAssignSubject,
  onArchiveSubject,
  onRestoreSubject,
  onDeleteArchivedSubject,
  onBack,
}: {
  item: CourseCardItem
  schoolYearName: string
  schoolYearId: string | null
  canEnroll: boolean
  canManage: boolean
  onAssignSubject: (grade: GradeWithSections, sectionId: string) => void
  onArchiveSubject: (assignment: SectionSubjectAssignment) => void
  onRestoreSubject: (assignment: SectionSubjectAssignment) => void | Promise<void>
  onDeleteArchivedSubject: (assignment: SectionSubjectAssignment) => void
  onBack: () => void
}) {
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null)
  const [subjectInitialTab, setSubjectInitialTab] = useState('resumen')
  const [workspaceView, setWorkspaceView] = useState<'subjects' | 'teams' | 'archived'>('subjects')
  const selectedAssignment = item.assignments.find((assignment) => assignment.id === selectedAssignmentId) ?? null
  const levelStyle = getLevelStyle(item.levelName)
  const teamCount = item.section.teamCount ?? 0
  const archivedAssignments = item.section.assignments.filter((assignment) => assignment.status === 'inactive')

  useEffect(() => setSelectedAssignmentId(null), [item.section.id])
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
        onBack={() => setSelectedAssignmentId(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <header className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="h-1.5" style={{ backgroundColor: levelStyle.color }} />
        <div className="p-6">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:opacity-75">
            <ArrowLeft className="size-4" /> Mis cursos
          </button>
          <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div className="flex items-center gap-4">
              <span className="flex size-16 items-center justify-center rounded-2xl text-xl font-extrabold text-white shadow-md" style={{ backgroundColor: levelStyle.color }}>
                {item.grade.name}{item.section.name}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-extrabold tracking-tight">{item.grade.name} {item.section.name}</h1>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700">Activo</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-muted-foreground">{cleanLevelName(item.levelName)} · {item.cycleName}{schoolYearName ? ` · Año escolar ${schoolYearName}` : ''}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 lg:min-w-[27rem]">
              <MetricBox value={String(item.section.studentCount ?? 0)} label="Estudiantes" />
              <MetricBox value={String(item.assignments.length)} label="Asignaturas" />
              <MetricBox value={String(teamCount)} label="Equipos" />
            </div>
          </div>
        </div>
      </header>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-foreground">{workspaceView === 'subjects' ? 'Asignaturas' : workspaceView === 'teams' ? 'Equipos del curso' : 'Asignaturas archivadas'}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{workspaceView === 'subjects' ? 'Selecciona una asignatura para entrar a su espacio académico independiente.' : workspaceView === 'teams' ? 'Selecciona una asignatura para administrar sus equipos propios.' : 'Restaura una asignatura o elimina definitivamente su historial académico.'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => setWorkspaceView(workspaceView === 'teams' ? 'subjects' : 'teams')} className="h-11 rounded-xl px-5">
              {workspaceView === 'teams' ? <><BookOpen className="size-4" /> Ver asignaturas</> : <><UsersRound className="size-4" /> Ver equipos</>}
            </Button>
            {canManage ? (
              <Button type="button" variant="outline" onClick={() => setWorkspaceView(workspaceView === 'archived' ? 'subjects' : 'archived')} className="h-11 rounded-xl px-5">
                {workspaceView === 'archived' ? <><BookOpen className="size-4" /> Ver activas</> : <><Archive className="size-4" /> Archivadas {archivedAssignments.length ? `(${archivedAssignments.length})` : ''}</>}
              </Button>
            ) : null}
            {canManage && workspaceView === 'subjects' ? (
              <Button type="button" onClick={() => onAssignSubject(item.grade, item.section.id)} className="h-11 rounded-xl bg-primary px-5 text-white">
                <Plus className="size-4" /> Agregar asignatura al curso
              </Button>
            ) : null}
          </div>
        </div>

        {workspaceView === 'teams' ? (
          item.assignments.length ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {item.assignments.map((assignment) => {
                const palette = getSubjectColor(assignment.subjectName)
                return (
                  <button key={assignment.id} type="button" onClick={() => { setSubjectInitialTab('equipos'); setSelectedAssignmentId(assignment.id) }} className="group rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg">
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex size-11 items-center justify-center rounded-xl text-white" style={{ backgroundColor: palette.color }}><UsersRound className="size-5" /></span>
                      <span className="rounded-full px-2.5 py-1 text-xs font-extrabold" style={{ backgroundColor: palette.soft, color: palette.color }}>{assignment.teamCount} equipos</span>
                    </div>
                    <h3 className="mt-4 font-extrabold text-foreground">{assignment.subjectName}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{assignment.teacherName ?? 'Sin docente asignado'}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary">Administrar equipos <ArrowLeft className="size-3.5 rotate-180" /></span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center text-sm text-muted-foreground">Agrega una asignatura antes de crear equipos.</div>
          )
        ) : workspaceView === 'archived' ? (
          archivedAssignments.length ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {archivedAssignments.map((assignment) => {
                const palette = getSubjectColor(assignment.subjectName)
                return (
                  <article key={assignment.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                    <div className="h-1.5 opacity-60" style={{ backgroundColor: palette.color }} />
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex size-11 items-center justify-center rounded-xl text-white opacity-75" style={{ backgroundColor: palette.color }}><Archive className="size-5" /></span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold uppercase text-slate-600">Archivada</span>
                      </div>
                      <h3 className="mt-4 text-base font-extrabold text-foreground">{assignment.subjectName}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{assignment.teacherName ?? 'Sin docente asignado'}</p>
                    </div>
                    <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/35 px-3 py-2.5">
                      <button type="button" onClick={() => void onRestoreSubject(assignment)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-primary transition hover:bg-primary/10"><ArchiveRestore className="size-4" /> Restaurar</button>
                      <button type="button" onClick={() => onDeleteArchivedSubject(assignment)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-destructive transition hover:bg-destructive/10"><Trash2 className="size-4" /> Eliminar</button>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
              <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground"><Archive className="size-7" /></span>
              <h3 className="mt-4 font-extrabold">No hay asignaturas archivadas</h3>
              <p className="mt-1 text-sm text-muted-foreground">Las asignaturas que archives aparecerán aquí.</p>
            </div>
          )
        ) : item.assignments.length ? (
          <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_19rem]">
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {item.assignments.map((assignment) => {
              const palette = getSubjectColor(assignment.subjectName)
              return (
                <article key={assignment.id} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="h-1.5" style={{ backgroundColor: palette.color }} />
                  <button type="button" onClick={() => { setSubjectInitialTab('resumen'); setSelectedAssignmentId(assignment.id) }} className="w-full p-5 text-left">
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: palette.color }}><BookOpen className="size-5" /></span>
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-extrabold uppercase text-emerald-700">Activo</span>
                    </div>
                    <h3 className="mt-4 line-clamp-2 min-h-12 text-base font-extrabold leading-6" style={{ color: palette.color }}>{assignment.subjectName}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{assignment.teacherName ?? 'Sin docente asignado'}</p>
                    <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-xs">
                      <span><strong className="block text-base text-foreground">{item.section.studentCount ?? 0}</strong><span className="text-muted-foreground">estudiantes</span></span>
                      <span><strong className="block text-base text-foreground">{assignment.teamCount ?? 0}</strong><span className="text-muted-foreground">equipos</span></span>
                      <span><strong className="block text-base text-foreground">{assignment.activityCount ?? 0}</strong><span className="text-muted-foreground">actividades</span></span>
                    </div>
                    <div className="mt-3 space-y-1 text-[11px] text-muted-foreground">
                      <p>Asistencia: <strong className="text-foreground">{assignment.lastAttendanceDate ? formatCompactDate(assignment.lastAttendanceDate) : 'Sin registrar'}</strong></p>
                      <p>Promedio: <strong className="text-foreground">{assignment.averageScore === null ? 'Sin calificar' : formatScore(assignment.averageScore)}</strong></p>
                    </div>
                  </button>
                  {canManage ? (
                    <div className="flex justify-end border-t border-border px-3 py-2" style={{ backgroundColor: palette.soft }}>
                      <button type="button" onClick={() => onArchiveSubject(assignment)} className="rounded-lg px-3 py-1.5 text-xs font-bold text-destructive transition hover:bg-destructive/10">Archivar asignatura</button>
                    </div>
                  ) : null}
                </article>
              )
              })}
            </div>
            <CourseInsights assignments={item.assignments} />
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><BookOpen className="size-7" /></span>
            <h3 className="mt-4 font-extrabold">Este curso todavía no tiene asignaturas</h3>
            <p className="mt-1 text-sm text-muted-foreground">Agrega la primera asignatura para crear su espacio académico.</p>
            {canManage ? <Button type="button" onClick={() => onAssignSubject(item.grade, item.section.id)} className="mt-5"><Plus className="size-4" /> Agregar asignatura</Button> : null}
          </div>
        )}
      </section>
    </div>
  )
}

function CourseInsights({ assignments }: { assignments: SectionSubjectAssignment[] }) {
  const recentItems = assignments
    .flatMap((assignment) => [
      assignment.lastAttendanceDate ? { id: `${assignment.id}-attendance`, date: assignment.lastAttendanceDate, title: 'Asistencia registrada', detail: assignment.subjectName, icon: <CheckCircle2 className="size-4" /> } : null,
      assignment.lastPlanningDate ? { id: `${assignment.id}-planning`, date: assignment.lastPlanningDate, title: assignment.lastPlanningTitle || 'PlanificaciÃ³n actualizada', detail: assignment.subjectName, icon: <ClipboardList className="size-4" /> } : null,
    ])
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
    .slice(0, 4)

  const upcoming = assignments
    .filter((assignment) => assignment.lastPlanningDate && new Date(assignment.lastPlanningDate).getTime() >= startOfToday())
    .sort((left, right) => new Date(left.lastPlanningDate!).getTime() - new Date(right.lastPlanningDate!).getTime())
    .slice(0, 3)

  return (
    <aside className="space-y-4 xl:sticky xl:top-4">
      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-extrabold text-foreground"><Sparkles className="size-4 text-primary" /> Actividad reciente</div>
        {recentItems.length ? (
          <div className="mt-3 divide-y divide-border">
            {recentItems.map((item) => (
              <div key={item.id} className="flex gap-3 py-3 first:pt-1 last:pb-0">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">{item.icon}</span>
                <div className="min-w-0"><p className="text-xs font-bold text-foreground">{item.title}</p><p className="truncate text-[11px] text-muted-foreground">{item.detail}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{formatCompactDate(item.date)}</p></div>
              </div>
            ))}
          </div>
        ) : <p className="mt-3 text-xs leading-5 text-muted-foreground">La actividad del curso aparecerÃ¡ aquÃ­ cuando registres asistencia o planificaciones.</p>}
      </section>

      <section className="rounded-2xl border border-border bg-gradient-to-br from-white to-violet-50/60 p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-extrabold text-foreground"><CalendarDays className="size-4 text-violet-600" /> PrÃ³ximas tareas</div>
        {upcoming.length ? (
          <div className="mt-3 space-y-2">
            {upcoming.map((assignment) => <div key={assignment.id} className="rounded-xl border border-violet-100 bg-white p-3"><p className="text-xs font-bold text-foreground">{assignment.lastPlanningTitle || assignment.subjectName}</p><p className="mt-1 text-[10px] text-violet-700">{formatCompactDate(assignment.lastPlanningDate!)}</p></div>)}
          </div>
        ) : <p className="mt-3 text-xs leading-5 text-muted-foreground">No hay planificaciones prÃ³ximas registradas.</p>}
      </section>
    </aside>
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
  const palette = getSubjectColor(item.subjectName)
  const courseLabel = `${item.grade.name}.º ${item.section.name}`
  const [activeTab, setActiveTab] = useState(initialTab ?? 'resumen')
  const [students, setStudents] = useState<StudentAttendanceRow[]>([])
  const [studentsLoading, setStudentsLoading] = useState(true)
  const [studentsError, setStudentsError] = useState<string | null>(null)

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

  const capacity = item.section.capacity
  const availableSeats = capacity === null ? null : Math.max(capacity - students.length, 0)
  const attendanceRows = students.filter((student) => student.status)
  const presentRows = attendanceRows.filter((student) => student.status === 'present')
  const attendance = attendanceRows.length
    ? `${Math.round((presentRows.length / attendanceRows.length) * 100)}%`
    : 'Sin registrar'

  return (
    <div className="space-y-6">
      <header className="overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/10 via-card to-violet-500/10 px-6 pt-5 shadow-sm">
        <button
          type="button"
          className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:opacity-75"
          onClick={onBack}
        >
          <ArrowLeft className="size-4" />
          {backLabel}
        </button>

        <div className="flex flex-col gap-5 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 gap-6">
            <div
              className="flex size-16 shrink-0 items-center justify-center rounded-2xl text-xl font-extrabold text-white shadow-lg"
              style={{ backgroundColor: palette.color }}
            >
              {item.grade.name}{item.section.name}
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
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

          <div className="grid grid-cols-3 gap-2 lg:min-w-[26rem]">
            <MetricBox
              value={studentsLoading ? '…' : capacity === null ? String(students.length) : `${students.length}/${capacity}`}
              label={capacity === null ? 'Estudiantes' : 'Matrícula'}
              detail={availableSeats === null ? 'Sin límite definido' : `${availableSeats} cupos disponibles`}
            />
            <MetricBox value={studentsLoading ? '…' : attendance} label="Asistencia" detail="Último registro" />
            <MetricBox value="Sin notas" label="Promedio" detail="Período actual" />
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto border-t border-border pt-2">
          <DetailTab active={activeTab === 'resumen'} icon={<LayoutDashboard className="size-4" />} label="Resumen" onClick={() => setActiveTab('resumen')} />
          <DetailTab active={activeTab === 'estudiantes'} icon={<UsersRound className="size-4" />} label="Estudiantes" onClick={() => setActiveTab('estudiantes')} />
          <DetailTab active={activeTab === 'equipos'} icon={<UsersRound className="size-4" />} label="Equipos" onClick={() => setActiveTab('equipos')} />
          <DetailTab active={activeTab === 'asistencia'} icon={<CheckSquare className="size-4" />} label="Asistencia" onClick={() => setActiveTab('asistencia')} />
          <DetailTab active={activeTab === 'calificaciones'} icon={<GraduationCap className="size-4" />} label="Calificaciones" onClick={() => setActiveTab('calificaciones')} />
          <DetailTab active={activeTab === 'planificaciones'} icon={<ClipboardList className="size-4" />} label="Planificaciones" onClick={() => setActiveTab('planificaciones')} />
          <DetailTab active={activeTab === 'horario'} icon={<CalendarDays className="size-4" />} label="Horario" onClick={() => setActiveTab('horario')} />
        </nav>
      </header>

      {activeTab === 'resumen' ? (
        <CourseSummary
          students={students.length}
          teams={item.assignment?.teamCount ?? 0}
          subjectName={item.subjectName}
          teacherName={item.assignment?.teacherName ?? null}
          onNavigate={setActiveTab}
        />
      ) : activeTab === 'estudiantes' ? (
        <EstudiantesTab
          students={students}
          loading={studentsLoading}
          error={studentsError}
          courseId={item.assignment?.id ?? null}
          canEnroll={canEnroll}
        />
      ) : activeTab === 'equipos' ? (
        <CourseTeamsPanel sectionSubjectId={item.assignment?.id ?? null} students={students} canManage={canEnroll} />
      ) : activeTab === 'asistencia' ? (
        <AsistenciaTab sectionSubjectId={item.assignment?.id ?? null} sectionId={item.section.id} schoolYearId={schoolYearId} />
      ) : activeTab === 'calificaciones' ? (
        <CalificacionesTab sectionSubjectId={item.assignment?.id ?? null} schoolYearId={schoolYearId} />
      ) : activeTab === 'planificaciones' ? (
        <PlanificacionesTab sectionSubjectId={item.assignment?.id ?? null} />
      ) : (
        <HorarioTab sectionId={item.section.id} sectionSubjectId={item.assignment?.id ?? null} />
      )}
    </div>
  )
}

function CourseSummary({ students, teams, subjectName, teacherName, onNavigate }: {
  students: number
  teams: number
  subjectName: string
  teacherName: string | null
  onNavigate: (tab: string) => void
}) {
  const quickActions = [
    { label: 'Ver estudiantes', tab: 'estudiantes', icon: <UsersRound className="size-5" /> },
    { label: 'Organizar equipos', tab: 'equipos', icon: <UsersRound className="size-5" /> },
    { label: 'Pasar asistencia', tab: 'asistencia', icon: <CheckSquare className="size-5" /> },
    { label: 'Ver calificaciones', tab: 'calificaciones', icon: <GraduationCap className="size-5" /> },
  ]
  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_1fr]">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-base font-extrabold">Acciones rápidas</h2>
        <p className="mt-1 text-sm text-muted-foreground">Accede a las tareas más frecuentes de este curso.</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <button key={action.tab} type="button" onClick={() => onNavigate(action.tab)} className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-left text-sm font-bold transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </section>
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-base font-extrabold">Resumen del curso</h2>
        <div className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border">
          <SummaryRow label="Asignatura" value={subjectName} />
          <SummaryRow label="Docente" value={teacherName ?? 'Sin docente asignado'} />
          <SummaryRow label="Matrícula activa" value={`${students} estudiantes`} />
          <SummaryRow label="Equipos creados" value={`${teams} equipos`} />
        </div>
      </section>
    </div>
  )
}

const defaultAdvancedFilters: CourseAdvancedFilters = {
  level: 'all',
  cycle: 'all',
  subject: 'all',
  grade: 'all',
  section: 'all',
  minStudents: '',
  maxStudents: '',
  studentPresence: 'any',
  teamPresence: 'any',
  setupStatus: 'any',
  sortBy: 'recent',
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 px-4 py-3"><span className="text-sm text-muted-foreground">{label}</span><span className="text-right text-sm font-bold">{value}</span></div>
}

function MetricBox({ value, label, detail }: { value: string; label: string; detail?: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card px-4 py-4 text-center shadow-sm">
      <p className="text-2xl font-extrabold tabular-nums text-foreground">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase text-muted-foreground">{label}</p>
      {detail ? <p className="mt-1 text-[11px] font-medium text-muted-foreground/80">{detail}</p> : null}
    </div>
  )
}

function DetailTab({ active, icon, label, onClick }: { active?: boolean; icon: ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      className={cn(
        'flex h-12 shrink-0 items-center gap-2 border-b-4 border-transparent px-3 text-sm font-bold text-muted-foreground transition',
        active && 'border-primary text-primary',
      )}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  )
}

function EstudiantesTab({ students, loading, error, courseId, canEnroll }: {
  students: Array<{ firstName: string; lastName: string; studentCode: string }>
  loading: boolean
  error: string | null
  courseId: string | null
  canEnroll: boolean
}) {
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

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted text-xs font-bold uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-5 py-3">Codigo</th>
            <th className="px-5 py-3">Nombre</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {students.map((s) => (
            <tr key={s.studentCode} className="text-foreground">
              <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{s.studentCode}</td>
              <td className="px-5 py-3 font-medium">{s.firstName} {s.lastName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EmptyStep({ number, text }: { number: string; text: string }) {
  return (
    <li className="flex items-start gap-3 text-sm leading-5 text-muted-foreground">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-card font-bold text-primary shadow-sm">{number}</span>
      <span className="pt-1">{text}</span>
    </li>
  )
}

function AsistenciaTab({ sectionSubjectId, sectionId, schoolYearId }: { sectionSubjectId: string | null; sectionId: string; schoolYearId: string | null }) {
  const [stats, setStats] = useState<{ present: number; absent: number; total: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!schoolYearId) {
      setLoading(false)
      setError('No hay ano escolar activo.')
      return
    }
    getStudentsBySection(sectionId, schoolYearId)
      .then((data) => {
        setStats({
          present: data.filter((s) => s.status === 'present').length,
          absent: data.filter((s) => s.status === 'absent').length,
          total: data.length,
        })
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Error al cargar asistencia'))
      .finally(() => setLoading(false))
  }, [sectionId, schoolYearId, sectionSubjectId])

  if (loading) return <div className="flex min-h-[200px] items-center justify-center text-sm text-muted-foreground">Cargando asistencia...</div>
  if (error) return <ErrorState message={error} />
  if (!stats || !stats.total) return <EmptyState title="Sin datos" description="No hay datos de asistencia para esta seccion." />

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard label="Presentes" value={stats.present} total={stats.total} color="text-success" />
      <StatCard label="Ausentes" value={stats.absent} total={stats.total} color="text-destructive" />
      <StatCard label="Asistencia" value={stats.present} total={stats.total} color="text-primary" percentage />
    </div>
  )
}

function StatCard({ label, value, total, color, percentage }: { label: string; value: number; total: number; color: string; percentage?: boolean }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
      <p className={cn('text-3xl font-extrabold', color)}>
        {percentage ? `${pct}%` : value}
      </p>
      <p className="mt-1 text-xs font-bold uppercase text-muted-foreground">{label}</p>
    </div>
  )
}

function CalificacionesTab({ sectionSubjectId, schoolYearId }: { sectionSubjectId: string | null; schoolYearId: string | null }) {
  const [periods, setPeriods] = useState<Array<{ id: string; name: string }>>([])
  const [selectedPeriod, setSelectedPeriod] = useState<string>('')
  const [records, setRecords] = useState<Array<{ firstName: string; lastName: string; studentCode: string; score: number }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    getStudentsForGrading(sectionSubjectId, selectedPeriod)
      .then((data) => {
        const scores = data.students.map((s) => {
          const studentRecords = data.gradeRecords.filter((r) => r.enrollmentId === s.enrollmentId)
          const avg = studentRecords.length > 0
            ? Math.round(studentRecords.reduce((sum, r) => sum + r.score, 0) / studentRecords.length)
            : 0
          return { firstName: s.firstName, lastName: s.lastName, studentCode: s.studentCode, score: avg }
        })
        setRecords(scores)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Error al cargar calificaciones'))
      .finally(() => setLoading(false))
  }, [selectedPeriod, sectionSubjectId])

  if (!sectionSubjectId) return <EmptyState title="Sin asignatura" description="Este curso no tiene una asignatura asignada." />
  if (error && !periods.length) return <ErrorState message={error} />

  return (
    <div className="space-y-4">
      {periods.length > 0 ? (
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase text-muted-foreground">Periodo:</span>
          <select
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground outline-none"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            {periods.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      ) : null}
      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center text-sm text-muted-foreground">Cargando calificaciones...</div>
      ) : records.length === 0 ? (
        <EmptyState title="Sin calificaciones" description="No hay calificaciones registradas para este periodo." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Codigo</th>
                <th className="px-5 py-3">Nombre</th>
                <th className="px-5 py-3 text-right">Promedio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {records.map((r) => (
                <tr key={r.studentCode} className="text-foreground">
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{r.studentCode}</td>
                  <td className="px-5 py-3 font-medium">{r.firstName} {r.lastName}</td>
                  <td className={cn('px-5 py-3 text-right font-bold', r.score >= 70 ? 'text-success' : 'text-destructive')}>{r.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function PlanificacionesTab({ sectionSubjectId }: { sectionSubjectId: string | null }) {
  const [entries, setEntries] = useState<Array<{ id: string; title: string; subjectName: string; plannedDate: string | null }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sectionSubjectId) {
      setLoading(false)
      setError('El curso no tiene asignatura asignada.')
      return
    }
    getPlanningEntries({ sectionSubjectId })
      .then((data) => setEntries(data))
      .catch((e) => setError(e instanceof Error ? e.message : 'Error al cargar planificaciones'))
      .finally(() => setLoading(false))
  }, [sectionSubjectId])

  if (loading) return <div className="flex min-h-[200px] items-center justify-center text-sm text-muted-foreground">Cargando planificaciones...</div>
  if (!sectionSubjectId) return <EmptyState title="Sin asignatura" description="Este curso no tiene una asignatura asignada." />
  if (error) return <ErrorState message={error} />
  if (!entries.length) return <EmptyState title="Sin planificaciones" description="No hay planificaciones registradas para este curso." />

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {entries.map((e) => (
        <div key={e.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="font-extrabold text-foreground">{e.title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{e.subjectName}</p>
          {e.plannedDate ? (
            <p className="mt-2 text-xs font-bold text-muted-foreground">{new Date(e.plannedDate).toLocaleDateString('es-DO')}</p>
          ) : null}
        </div>
      ))}
    </div>
  )
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
  schoolYearName,
  canManage,
  onOpen,
  onAddSection,
  onEditSection,
  onDeleteSection,
  onAssignSubject,
}: {
  item: CourseCardItem
  schoolYearName: string
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
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-2 hover:ring-slate-200/80"
    >
      <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: levelStyle.color }} aria-hidden="true" />
      <div
        className="flex flex-1 cursor-pointer flex-col p-5 pb-4 pt-6"
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
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-xl text-base font-extrabold text-white"
              style={{ backgroundColor: levelStyle.color }}
            >
              {gradeNumber}
              <span className="ml-px text-xs font-bold opacity-80">{item.section.name}</span>
            </span>
            <div>
              <h3 className="text-lg font-extrabold tracking-tight text-foreground">
                {item.grade.name} {item.section.name}
              </h3>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">{item.cycleName}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-100">
              <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" /> Activo
            </span>
            <span
              className="rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide"
              style={{ backgroundColor: levelStyle.soft, color: levelStyle.color }}
            >
              {cleanLevelName(item.levelName)}
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-muted/55 p-3 text-center">
          <span><strong className="block text-base text-foreground">{item.section.studentCount ?? 0}</strong><span className="text-[11px] text-muted-foreground">estudiantes</span></span>
          <span className="border-x border-border"><strong className="block text-base text-foreground">{item.assignments.length}</strong><span className="text-[11px] text-muted-foreground">asignaturas</span></span>
          <span><strong className="block text-base text-foreground">{teamCount}</strong><span className="text-[11px] text-muted-foreground">equipos</span></span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          {schoolYearName ? (
            <>
              <span>Año escolar {schoolYearName}</span>
            </>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2.5" style={{ backgroundColor: levelStyle.soft }}>
        <div className="flex min-w-0 items-center gap-1">
          {canManage ? (
            <FooterAction label="Agregar sección" tooltip="Agregar nueva sección" onClick={() => onAddSection(item.grade)}><Plus className="h-3.5 w-3.5" /></FooterAction>
          ) : null}
          <FooterAction label="Entrar al curso" tooltip="Entrar al curso" onClick={() => onOpen(item.id)}><LogIn className="h-3.5 w-3.5" /></FooterAction>
        </div>
        {canManage ? (
          <div className="relative" ref={menuRef}>
            <button type="button" title="Más acciones" className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-[11px] font-bold text-muted-foreground transition-all duration-150 hover:scale-[1.02] hover:bg-card hover:text-foreground" aria-label="Más acciones" aria-haspopup="menu" aria-expanded={menuOpen} onClick={(event) => { event.stopPropagation(); setMenuOpen((open) => !open) }}>
              <MoreHorizontal className="size-4" /> <span className="hidden 2xl:inline">Más acciones</span>
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
      }
    }),
  )
}

function FilterSelect({ label, value, options, onChange }: {
  label: string
  value: string
  options: Array<{ value: string; label: string }>
  onChange: (value: string) => void
}) {
  return (
    <label className="relative min-w-0">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full min-w-0 appearance-none truncate rounded-xl border border-slate-200 bg-white py-0 pl-3.5 pr-9 text-xs font-extrabold text-slate-800 shadow-sm outline-none transition hover:border-primary/25 focus:border-primary/45 focus:ring-2 focus:ring-primary/10">
        <option value="all">{label}: Todos</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">⌄</span>
    </label>
  )
}

function ActiveFilter({ label, onRemove }: { label: string; onRemove: () => void }) {
  return <span className="inline-flex max-w-xs items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1.5 text-xs font-bold text-primary"><span className="truncate">{label}</span><button type="button" onClick={onRemove} className="rounded-full p-0.5 hover:bg-primary/10" aria-label={`Quitar ${label}`}><X className="size-3" /></button></span>
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

function formatCompactDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-DO', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

function formatScore(value: number) {
  return new Intl.NumberFormat('es-DO', { maximumFractionDigits: 1 }).format(value)
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
  const query = normalizeText(searchValue)
  const minimumStudents = filters.minStudents === '' ? null : Number(filters.minStudents)
  const maximumStudents = filters.maxStudents === '' ? null : Number(filters.maxStudents)

  const filtered = items.filter((item) => {
    const students = item.section.studentCount ?? 0
    const teams = item.section.teamCount ?? 0
    const searchableName = normalizeText(
      `${item.grade.name} ${item.section.name} ${item.assignments.map((assignment) => `${assignment.subjectName} ${assignment.teacherName ?? ''}`).join(' ')}`,
    )

    if (query && !searchableName.includes(query)) return false
    if (filters.level !== 'all' && item.levelName !== filters.level) return false
    if (filters.cycle !== 'all' && item.cycleName !== filters.cycle) return false
    if (filters.subject !== 'all' && !item.assignments.some((assignment) => assignment.subjectName === filters.subject)) return false
    if (filters.grade !== 'all' && item.grade.id !== filters.grade) return false
    if (filters.section !== 'all' && item.section.id !== filters.section) return false
    if (minimumStudents !== null && students < minimumStudents) return false
    if (maximumStudents !== null && students > maximumStudents) return false
    if (filters.studentPresence === 'with' && students === 0) return false
    if (filters.studentPresence === 'without' && students > 0) return false
    if (filters.teamPresence === 'with' && teams === 0) return false
    if (filters.teamPresence === 'without' && teams > 0) return false
    if (filters.setupStatus === 'with-teacher' && !item.assignments.some((assignment) => assignment.teacherName)) return false
    if (filters.setupStatus === 'without-teacher' && item.assignments.some((assignment) => assignment.teacherName)) return false
    if (filters.setupStatus === 'without-subject' && item.assignments.length > 0) return false
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
      case 'name-asc': return compareName(left, right)
      case 'name-desc': return compareName(right, left)
      case 'grade-asc': return compareGrade(left, right)
      case 'grade-desc': return compareGrade(right, left)
      case 'students-desc': return (right.section.studentCount ?? 0) - (left.section.studentCount ?? 0)
      case 'students-asc': return (left.section.studentCount ?? 0) - (right.section.studentCount ?? 0)
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
