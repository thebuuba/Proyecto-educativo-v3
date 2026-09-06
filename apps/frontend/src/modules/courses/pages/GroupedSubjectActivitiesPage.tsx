import {
  ArrowLeft,
  BookMarked,
  BookOpen,
  Brain,
  CalendarCheck2,
  CalendarDays,
  ChartColumn,
  CheckSquare,
  ChevronDown,
  ClipboardList,
  Edit3,
  Eye,
  FlaskConical,
  GraduationCap,
  HandHeart,
  LayoutDashboard,
  Library,
  Plus,
  Search,
  SlidersHorizontal,
  UsersRound,
} from 'lucide-react'
import { useEffect, useMemo, useState, type ComponentType } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Input } from '@/components/ui/Input'
import { useCourses } from '@/modules/courses/hooks/useCourses'
import { getGradingWorkspace } from '@/modules/grading/services/gradingService'
import type {
  AcademicPeriodOpt,
  GradeRecordRow,
  GradingActivity,
  StudentGradeRow,
} from '@/modules/grading/types'
import { competencyBlocks, scoreForActivity } from '@/modules/grading/utils/competencyGrades'
import { cn } from '@/utils/cn'
import { getSubjectPalette } from '@/utils/subjectPalette'

import { ActivityBlockPickerDialog } from './CoursesPageBase'

type SubjectActivityStatus = 'pending' | 'partial' | 'graded'
type BlockFilter = 'all' | string

type WorkspaceState = {
  students: StudentGradeRow[]
  activities: GradingActivity[]
  gradeRecords: GradeRecordRow[]
  academicPeriods: AcademicPeriodOpt[]
  selectedAcademicPeriodId: string | null
}

type BlockVisual = {
  icon: ComponentType<{ className?: string }>
  iconClass: string
  borderClass: string
  selectedClass: string
  headerClass: string
  lineClass: string
}

const emptyWorkspace: WorkspaceState = {
  students: [],
  activities: [],
  gradeRecords: [],
  academicPeriods: [],
  selectedAcademicPeriodId: null,
}

const blockVisuals: BlockVisual[] = [
  {
    icon: BookOpen,
    iconClass: 'bg-blue-50 text-blue-700 ring-blue-100',
    borderClass: 'border-blue-200 hover:border-blue-300',
    selectedClass: 'border-blue-400 bg-blue-50/70 ring-2 ring-blue-100',
    headerClass: 'bg-blue-50/55',
    lineClass: 'bg-blue-500',
  },
  {
    icon: Brain,
    iconClass: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    borderClass: 'border-emerald-200 hover:border-emerald-300',
    selectedClass: 'border-emerald-400 bg-emerald-50/70 ring-2 ring-emerald-100',
    headerClass: 'bg-emerald-50/55',
    lineClass: 'bg-emerald-500',
  },
  {
    icon: HandHeart,
    iconClass: 'bg-amber-50 text-amber-700 ring-amber-100',
    borderClass: 'border-amber-200 hover:border-amber-300',
    selectedClass: 'border-amber-400 bg-amber-50/70 ring-2 ring-amber-100',
    headerClass: 'bg-amber-50/55',
    lineClass: 'bg-amber-500',
  },
  {
    icon: FlaskConical,
    iconClass: 'bg-violet-50 text-violet-700 ring-violet-100',
    borderClass: 'border-violet-200 hover:border-violet-300',
    selectedClass: 'border-violet-400 bg-violet-50/70 ring-2 ring-violet-100',
    headerClass: 'bg-violet-50/55',
    lineClass: 'bg-violet-500',
  },
]

export function GroupedSubjectActivitiesPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const courseId = searchParams.get('courseId') ?? ''
  const subjectId = searchParams.get('subjectId') ?? ''
  const activityId = searchParams.get('activityId')
  const { grades, currentSchoolYear, loading: coursesLoading, error: coursesError } = useCourses()
  const [workspace, setWorkspace] = useState<WorkspaceState>(emptyWorkspace)
  const [workspaceLoading, setWorkspaceLoading] = useState(true)
  const [workspaceError, setWorkspaceError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | SubjectActivityStatus>('all')
  const [sort, setSort] = useState<'recent' | 'oldest' | 'name'>('recent')
  const [blockFilter, setBlockFilter] = useState<BlockFilter>('all')
  const [collapsedBlocks, setCollapsedBlocks] = useState<Set<string>>(() => new Set())
  const [blockPickerOpen, setBlockPickerOpen] = useState(false)

  const context = useMemo(() => {
    for (const grade of grades) {
      const section = grade.sections.find((item) => item.id === courseId)
      if (!section) continue
      const assignment = section.assignments.find((item) => item.id === subjectId)
      if (!assignment) return { grade, section, assignment: null }
      return { grade, section, assignment }
    }
    return null
  }, [courseId, grades, subjectId])

  useEffect(() => {
    if (!subjectId) {
      setWorkspaceLoading(false)
      setWorkspaceError('No se encontró la asignatura seleccionada.')
      return
    }

    let active = true
    setWorkspaceLoading(true)
    setWorkspaceError(null)
    getGradingWorkspace({ sectionSubjectId: subjectId })
      .then((data) => {
        if (!active) return
        setWorkspace({
          students: data.students,
          activities: data.activities,
          gradeRecords: data.gradeRecords,
          academicPeriods: data.academicPeriods,
          selectedAcademicPeriodId: data.selectedAcademicPeriodId,
        })
      })
      .catch((cause) => {
        if (!active) return
        setWorkspaceError(cause instanceof Error ? cause.message : 'No se pudieron cargar las actividades.')
      })
      .finally(() => {
        if (active) setWorkspaceLoading(false)
      })

    return () => {
      active = false
    }
  }, [subjectId])

  const assignment = context?.assignment ?? null
  const subjectName = assignment?.subjectName ?? 'Asignatura'
  const courseLabel = context ? `${context.grade.name} ${context.section.name}`.trim() : 'Curso'
  const levelName = context?.grade.academicLevelName ?? context?.grade.level ?? ''
  const cycleName = context?.grade.academicCycleName ?? ''
  const subjectPalette = assignment?.appearanceColor
    ? { color: assignment.appearanceColor, soft: `${assignment.appearanceColor}14` }
    : getSubjectPalette(subjectName)
  const period = workspace.academicPeriods.find((item) => item.id === workspace.selectedAcademicPeriodId)
    ?? workspace.academicPeriods[0]
  const selectedActivity = workspace.activities.find((activity) => activity.id === activityId) ?? null

  const activityMeta = (activity: GradingActivity) => {
    const graded = workspace.students.filter((student) =>
      Boolean(scoreForActivity(workspace.gradeRecords, student.enrollmentId, activity.id)),
    ).length
    const state: SubjectActivityStatus = graded === 0
      ? 'pending'
      : graded >= workspace.students.length && workspace.students.length > 0
        ? 'graded'
        : 'partial'
    return { graded, state }
  }

  const filteredActivities = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('es')
    return [...workspace.activities]
      .filter((activity) =>
        !normalizedQuery
        || `${activity.name} ${activity.description ?? ''}`
          .toLocaleLowerCase('es')
          .includes(normalizedQuery),
      )
      .filter((activity) => status === 'all' || activityMeta(activity).state === status)
      .sort((left, right) => sort === 'name'
        ? left.name.localeCompare(right.name, 'es')
        : sort === 'oldest'
          ? (left.date ?? '').localeCompare(right.date ?? '')
          : (right.date ?? '').localeCompare(left.date ?? ''))
  }, [query, sort, status, workspace.activities, workspace.gradeRecords, workspace.students])

  const groups = competencyBlocks
    .map((block, index) => ({
      block,
      visual: blockVisuals[index] ?? blockVisuals[0],
      allActivities: workspace.activities.filter((activity) => activity.competencyBlockId === block.id),
      visibleActivities: filteredActivities.filter((activity) => activity.competencyBlockId === block.id),
    }))

  const visibleGroups = groups.filter(({ block, visibleActivities }) =>
    (blockFilter === 'all' || blockFilter === block.id) && visibleActivities.length > 0,
  )

  const fullyEvaluatedStudents = (activities: GradingActivity[]) => {
    if (!activities.length || !workspace.students.length) return 0
    return workspace.students.filter((student) =>
      activities.every((activity) =>
        Boolean(scoreForActivity(workspace.gradeRecords, student.enrollmentId, activity.id)),
      ),
    ).length
  }

  const setSubjectTab = (tab: string) => {
    const next = new URLSearchParams(searchParams)
    next.set('tab', tab)
    next.delete('activityId')
    setSearchParams(next)
  }

  const backToSubjects = () => {
    const next = new URLSearchParams(searchParams)
    next.delete('subjectId')
    next.delete('tab')
    next.delete('activityId')
    setSearchParams(next)
  }

  const openActivity = (nextActivityId: string | null) => {
    const next = new URLSearchParams(searchParams)
    next.set('tab', 'actividades')
    if (nextActivityId) next.set('activityId', nextActivityId)
    else next.delete('activityId')
    setSearchParams(next)
  }

  const createActivity = () => {
    if (!assignment) return
    if (blockFilter !== 'all') {
      navigate(`/calificaciones?${new URLSearchParams({
        sectionSubjectId: assignment.id,
        action: 'create-activity',
        competencyBlockId: blockFilter,
        origin: 'subject',
        returnCourseId: courseId,
        returnSubjectId: assignment.id,
        returnTab: 'actividades',
      }).toString()}`)
      return
    }
    setBlockPickerOpen(true)
  }

  const toggleBlock = (blockId: string) => {
    setCollapsedBlocks((current) => {
      const next = new Set(current)
      if (next.has(blockId)) next.delete(blockId)
      else next.add(blockId)
      return next
    })
  }

  const tabs = [
    { id: 'resumen', label: 'Resumen', icon: LayoutDashboard },
    { id: 'estudiantes', label: 'Estudiantes', icon: UsersRound },
    { id: 'equipos', label: 'Equipos', icon: UsersRound },
    { id: 'actividades', label: 'Actividades', icon: CheckSquare },
    { id: 'asistencia', label: 'Asistencia', icon: CalendarCheck2 },
    { id: 'calificaciones', label: 'Calificaciones', icon: GraduationCap },
    { id: 'horario', label: 'Horario', icon: CalendarDays },
    { id: 'recursos', label: 'Recursos', icon: Library },
    { id: 'reportes', label: 'Reportes', icon: ChartColumn },
    { id: 'configuracion', label: 'Configuración', icon: SlidersHorizontal },
    { id: 'planificaciones', label: 'Planificaciones', icon: ClipboardList, badge: 'Próximamente' },
  ]

  if (coursesLoading) {
    return <div className="flex min-h-[24rem] items-center justify-center text-sm font-semibold text-muted-foreground">Cargando asignatura…</div>
  }
  if (coursesError) return <ErrorState message={coursesError} />
  if (!context || !assignment) return <ErrorState message="No se encontró esta asignatura dentro del curso." />

  return (
    <div className="space-y-3">
      <header className="w-full overflow-visible rounded-2xl bg-card shadow-sm">
        <div className="flex min-h-[76px] items-center gap-3 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              onClick={backToSubjects}
              className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-extrabold text-primary transition hover:border-primary/25 hover:bg-primary/[0.04]"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Volver</span>
            </button>
            <span
              className="flex size-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
              style={{ backgroundColor: subjectPalette.color }}
            >
              <BookOpen className="size-6" />
            </span>
            <div className="min-w-0">
              <div className="flex min-w-0 flex-nowrap items-center gap-2 overflow-hidden">
                <h1 className="truncate text-base font-extrabold leading-tight text-foreground">{courseLabel} – {subjectName}</h1>
                <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">Activa</span>
              </div>
              <p className="mt-1.5 flex min-w-0 flex-nowrap items-center gap-x-1.5 overflow-hidden whitespace-nowrap text-[11px] font-semibold text-muted-foreground">
                {levelName ? <span>{levelName.replace(/^nivel\s+/i, '')}</span> : null}
                {cycleName ? <><span>·</span><span>{cycleName}</span></> : null}
                <span>·</span><span>Sección {context.section.name}</span>
                {currentSchoolYear?.name ? <><span>·</span><span className="truncate">Año escolar {currentSchoolYear.name}</span></> : null}
              </p>
            </div>
          </div>

          <details className="group relative shrink-0">
            <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover [&::-webkit-details-marker]:hidden">
              Acciones <ChevronDown className="size-4 transition group-open:rotate-180" />
            </summary>
            <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-border bg-card p-2 shadow-xl">
              <button type="button" onClick={createActivity} className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold hover:bg-muted"><span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><Plus className="size-4" /></span>Nueva actividad</button>
              <button type="button" onClick={() => navigate(`/bitacora?${new URLSearchParams({ action: 'create', sectionId: courseId, sectionSubjectId: subjectId }).toString()}`)} className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold hover:bg-muted"><span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><BookMarked className="size-4" /></span>Agregar a bitácora</button>
              <button type="button" onClick={() => setSubjectTab('asistencia')} className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold hover:bg-muted"><span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><CalendarCheck2 className="size-4" /></span>Registrar asistencia</button>
              <button type="button" onClick={() => setSubjectTab('calificaciones')} className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold hover:bg-muted"><span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><GraduationCap className="size-4" /></span>Gestionar calificaciones</button>
            </div>
          </details>
        </div>
      </header>

      <nav className="grid w-full grid-cols-2 gap-1 rounded-2xl bg-card p-1.5 shadow-sm sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" aria-label="Secciones de la asignatura">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = tab.id === 'actividades'
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubjectTab(tab.id)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative flex h-10 min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-2 text-sm font-bold text-muted-foreground transition hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active && 'bg-primary/[0.055] text-primary after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:rounded-t-full after:bg-primary',
                tab.badge && !active && 'bg-muted/40 text-muted-foreground/70',
              )}
            >
              <Icon className="size-4" />
              {tab.label}
              {tab.badge ? <span className="hidden rounded-full bg-slate-100 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide text-slate-500 2xl:inline">{tab.badge}</span> : null}
            </button>
          )
        })}
      </nav>

      {workspaceLoading ? (
        <div className="flex min-h-[24rem] items-center justify-center rounded-2xl border border-border bg-card text-sm font-semibold text-muted-foreground">Cargando actividades…</div>
      ) : workspaceError ? (
        <ErrorState message={workspaceError} />
      ) : selectedActivity ? (
        <ActivityDetail
          activity={selectedActivity}
          students={workspace.students}
          records={workspace.gradeRecords}
          assignmentId={subjectId}
          courseId={courseId}
          periodName={period?.name ?? 'Período actual'}
          onBack={() => openActivity(null)}
        />
      ) : (
        <section className="space-y-4" aria-labelledby="subject-activities-title">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="subject-activities-title" className="text-xl font-extrabold tracking-tight">Actividades</h2>
              <p className="mt-1 text-sm text-muted-foreground">Gestiona las actividades de esta asignatura organizadas por bloque de competencias.</p>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">{courseLabel} · {subjectName} · {period?.name ?? 'Período actual'}</p>
            </div>
            <Button className="h-11 px-5" onClick={createActivity}><Plus className="size-4" /> Crear actividad</Button>
          </header>

          <div className="grid gap-2 rounded-2xl border border-border bg-card p-3 shadow-sm lg:grid-cols-[minmax(0,12rem)_minmax(0,12rem)_minmax(14rem,1fr)_minmax(0,12rem)]">
            <label className="grid min-w-0 gap-1 text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">
              Período
              <select disabled title={period?.name ?? 'Período actual'} className="h-10 w-full min-w-0 truncate rounded-xl border border-border bg-muted/30 px-3 text-sm font-bold text-foreground"><option>{period?.name ?? 'Período actual'}</option></select>
            </label>
            <label className="grid min-w-0 gap-1 text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">
              Estado
              <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="h-10 w-full min-w-0 rounded-xl border border-border bg-card px-3 text-sm font-bold text-foreground">
                <option value="all">Todas</option>
                <option value="pending">Pendientes</option>
                <option value="partial">Parcialmente calificadas</option>
                <option value="graded">Calificadas</option>
              </select>
            </label>
            <label className="relative self-end">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input aria-label="Buscar actividad" value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 pl-9" placeholder="Buscar actividad..." />
            </label>
            <label className="grid min-w-0 gap-1 text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">
              Ordenar
              <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} className="h-10 w-full min-w-0 rounded-xl border border-border bg-card px-3 text-sm font-bold text-foreground">
                <option value="recent">Más recientes</option>
                <option value="oldest">Más antiguas</option>
                <option value="name">Nombre A-Z</option>
              </select>
            </label>
          </div>

          {workspace.activities.length ? (
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5" aria-label="Filtrar por bloque de competencias">
              <button
                type="button"
                aria-pressed={blockFilter === 'all'}
                onClick={() => setBlockFilter('all')}
                className={cn(
                  'flex min-h-[5.5rem] items-center gap-3 rounded-2xl border bg-card p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                  blockFilter === 'all' ? 'border-primary/45 bg-primary/[0.045] ring-2 ring-primary/10' : 'border-border',
                )}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/10"><ClipboardList className="size-5" /></span>
                <span className="min-w-0"><strong className="block text-sm text-foreground">Todos</strong><span className="mt-1 block text-[11px] font-semibold text-muted-foreground">{workspace.activities.length} {workspace.activities.length === 1 ? 'actividad' : 'actividades'}</span></span>
              </button>

              {groups.map(({ block, visual, allActivities }) => {
                const Icon = visual.icon
                const selected = blockFilter === block.id
                return (
                  <button
                    key={block.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setBlockFilter(block.id)}
                    title={block.name}
                    className={cn(
                      'flex min-h-[5.5rem] items-center gap-3 rounded-2xl border bg-card p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                      visual.borderClass,
                      selected && visual.selectedClass,
                    )}
                  >
                    <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl ring-1', visual.iconClass)}><Icon className="size-5" /></span>
                    <span className="min-w-0"><strong className="block text-sm text-foreground">{block.shortName}</strong><span className="mt-0.5 block truncate text-[10px] font-semibold text-muted-foreground">{block.name}</span><span className="mt-1 block text-[11px] font-bold text-foreground">{allActivities.length} {allActivities.length === 1 ? 'actividad' : 'actividades'}</span></span>
                  </button>
                )
              })}
            </div>
          ) : null}

          {!workspace.activities.length ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/8 text-primary"><CheckSquare className="size-6" /></span>
              <h3 className="mt-4 text-lg font-extrabold">Aún no hay actividades</h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">Crea la primera actividad de esta asignatura para comenzar a evaluarla.</p>
              <Button className="mt-5" onClick={createActivity}><Plus className="size-4" /> Crear primera actividad</Button>
            </div>
          ) : !filteredActivities.length || !visibleGroups.length ? (
            <EmptyState title="Sin coincidencias" description="Prueba con otro texto, estado o bloque de competencias." />
          ) : (
            <div className="space-y-3">
              {visibleGroups.map(({ block, visual, visibleActivities }) => {
                const Icon = visual.icon
                const collapsed = collapsedBlocks.has(block.id)
                const evaluatedStudents = fullyEvaluatedStudents(visibleActivities)
                return (
                  <section key={block.id} className={cn('overflow-hidden rounded-2xl border bg-card shadow-sm', visual.borderClass)}>
                    <button
                      type="button"
                      aria-expanded={!collapsed}
                      onClick={() => toggleBlock(block.id)}
                      className={cn('flex w-full items-center gap-3 px-4 py-3 text-left transition hover:brightness-[0.99]', visual.headerClass)}
                    >
                      <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/80 ring-1', visual.iconClass)}><Icon className="size-5" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1"><strong className="text-sm text-foreground">{block.shortName}</strong><span className="text-xs font-semibold text-muted-foreground">{block.name}</span></span>
                        <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-semibold text-muted-foreground">
                          <span>{visibleActivities.length} {visibleActivities.length === 1 ? 'actividad' : 'actividades'}</span>
                          {workspace.students.length ? <span>{evaluatedStudents}/{workspace.students.length} estudiantes evaluados</span> : <span>Sin estudiantes</span>}
                        </span>
                      </span>
                      <ChevronDown className={cn('size-4 shrink-0 text-muted-foreground transition-transform', !collapsed && 'rotate-180')} />
                    </button>

                    {!collapsed ? (
                      <div className="border-t border-border/70">
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[62rem] text-left text-sm">
                            <thead className="bg-muted/35 text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">
                              <tr>
                                <th className="px-4 py-3">Actividad</th>
                                <th className="px-4 py-3">Período</th>
                                <th className="px-4 py-3">Fecha</th>
                                <th className="px-4 py-3">Valor</th>
                                <th className="px-4 py-3">Instrumento</th>
                                <th className="px-4 py-3">Modalidad</th>
                                <th className="px-4 py-3">Estado</th>
                                <th className="px-4 py-3">Progreso</th>
                                <th className="px-4 py-3 text-right">Acciones</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {visibleActivities.map((activity) => {
                                const meta = activityMeta(activity)
                                return (
                                  <tr
                                    key={activity.id}
                                    tabIndex={0}
                                    aria-label={`Abrir actividad ${activity.name}`}
                                    onClick={() => openActivity(activity.id)}
                                    onKeyDown={(event) => {
                                      if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
                                        event.preventDefault()
                                        openActivity(activity.id)
                                      }
                                    }}
                                    className="relative z-0 cursor-pointer outline-none transition-[transform,box-shadow,background-color] duration-200 ease-out hover:z-10 hover:-translate-y-1 hover:bg-primary/[0.025] hover:shadow-lg focus-visible:z-10 focus-visible:-translate-y-0.5 focus-visible:bg-primary/[0.04] focus-visible:shadow-md focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary motion-reduce:transform-none motion-reduce:transition-none"
                                  >
                                    <td className="px-4 py-3"><span className="block max-w-64 font-extrabold text-foreground">{activity.name}</span></td>
                                    <td className="px-4 py-3 text-xs font-bold">{period?.name?.split('—')[0]?.trim() ?? 'Actual'}</td>
                                    <td className="px-4 py-3 text-xs text-muted-foreground">{formatShortDate(activity.date)}</td>
                                    <td className="px-4 py-3 text-xs font-bold">{activity.maxScore} pts</td>
                                    <td className="px-4 py-3 text-xs text-muted-foreground">{activityInstrumentLabel(activity.instrumentType)}</td>
                                    <td className="px-4 py-3 text-xs">{activity.activityType === 'group' ? 'Grupal' : 'Individual'}</td>
                                    <td className="px-4 py-3"><ActivityStatusBadge status={meta.state} /></td>
                                    <td className="px-4 py-3">
                                      <div className="min-w-24">
                                        <span className="text-[10px] font-bold text-muted-foreground">{meta.graded} / {workspace.students.length}</span>
                                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"><div className={cn('h-full rounded-full', visual.lineClass)} style={{ width: `${workspace.students.length ? (meta.graded / workspace.students.length) * 100 : 0}%` }} /></div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="flex justify-end gap-1">
                                        <button type="button" onClick={(event) => { event.stopPropagation(); openActivity(activity.id) }} aria-label={`Ver ${activity.name}`} className="grid size-9 place-items-center rounded-lg text-primary hover:bg-primary/8"><Eye className="size-4" /></button>
                                        <Link onClick={(event) => event.stopPropagation()} to={buildActivityGradingHref(subjectId, courseId, activity.id, 'edit')} aria-label={`Editar ${activity.name}`} className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted"><Edit3 className="size-4" /></Link>
                                        <Link onClick={(event) => event.stopPropagation()} to={buildActivityGradingHref(subjectId, courseId, activity.id, 'evaluate')} aria-label={`Evaluar ${activity.name}`} className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted"><ChartColumn className="size-4" /></Link>
                                      </div>
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : null}
                  </section>
                )
              })}

              <p className="px-1 text-xs text-muted-foreground">Mostrando {filteredActivities.length} de {workspace.activities.length} actividades.</p>
            </div>
          )}
        </section>
      )}

      {blockPickerOpen ? (
        <ActivityBlockPickerDialog
          assignmentId={subjectId}
          courseId={courseId}
          courseName={courseLabel}
          subjectName={subjectName}
          onClose={() => setBlockPickerOpen(false)}
        />
      ) : null}
    </div>
  )
}

function ActivityDetail({ activity, students, records, assignmentId, courseId, periodName, onBack }: {
  activity: GradingActivity
  students: StudentGradeRow[]
  records: GradeRecordRow[]
  assignmentId: string
  courseId: string
  periodName: string
  onBack: () => void
}) {
  const block = competencyBlocks.find((item) => item.id === activity.competencyBlockId)
  const graded = students.filter((student) => Boolean(scoreForActivity(records, student.enrollmentId, activity.id))).length
  const state: SubjectActivityStatus = graded === 0 ? 'pending' : graded >= students.length && students.length > 0 ? 'graded' : 'partial'

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <button type="button" onClick={onBack} className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-3 text-xs font-extrabold text-primary hover:bg-primary/[0.04]"><ArrowLeft className="size-4" /> Volver a actividades</button>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><ClipboardList className="size-5" /></span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-extrabold">{activity.name}</h2><ActivityStatusBadge status={state} /></div>
            <p className="mt-2 text-xs font-semibold text-muted-foreground">{block?.shortName ?? 'Sin bloque'} · {block?.name ?? 'Sin competencia asociada'}</p>
          </div>
          <Link to={buildActivityGradingHref(assignmentId, courseId, activity.id, 'edit')} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-xs font-extrabold hover:bg-muted"><Edit3 className="size-4" /> Editar actividad</Link>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-extrabold">Descripción</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{activity.description || 'Sin descripción.'}</p>
          {activity.resources?.length ? <><h3 className="mt-5 text-sm font-extrabold">Recursos</h3><div className="mt-2 flex flex-wrap gap-2">{activity.resources.map((resource) => <span key={resource} className="rounded-lg border border-border px-3 py-2 text-xs font-bold">{resource}</span>)}</div></> : null}
        </section>
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-extrabold">Detalles</h3>
          <dl className="mt-4 space-y-3 text-xs">
            <Definition label="Período" value={periodName} />
            <Definition label="Bloque" value={block?.shortName ?? 'Sin bloque'} />
            <Definition label="Fecha" value={formatShortDate(activity.date)} />
            <Definition label="Valor" value={`${activity.maxScore} puntos`} />
            <Definition label="Instrumento" value={activityInstrumentLabel(activity.instrumentType)} />
            <Definition label="Modalidad" value={activity.activityType === 'group' ? 'Grupal' : 'Individual'} />
            <Definition label="Progreso" value={`${graded} de ${students.length} estudiantes`} />
          </dl>
          <Link to={buildActivityGradingHref(assignmentId, courseId, activity.id, 'evaluate')} className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-extrabold text-primary-foreground"><ChartColumn className="size-4" /> Ir a evaluar / calificar</Link>
        </section>
      </div>
    </section>
  )
}

function Definition({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-3"><dt className="font-bold text-foreground">{label}</dt><dd className="max-w-44 text-right leading-5 text-muted-foreground">{value}</dd></div>
}

function ActivityStatusBadge({ status }: { status: SubjectActivityStatus }) {
  const styles = status === 'graded'
    ? 'bg-emerald-50 text-emerald-700'
    : status === 'partial'
      ? 'bg-amber-50 text-amber-700'
      : 'bg-slate-100 text-slate-600'
  return <span className={cn('inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-extrabold', styles)}>{status === 'graded' ? 'Calificada' : status === 'partial' ? 'Parcialmente calificada' : 'Pendiente'}</span>
}

function activityInstrumentLabel(value?: string) {
  return ({
    rubrica: 'Rúbrica',
    'lista-cotejo': 'Lista de cotejo',
    escala: 'Escala estimativa',
    'lista-ponderada': 'Lista ponderada',
  } as Record<string, string>)[value ?? ''] ?? value ?? 'Sin instrumento'
}

function buildActivityGradingHref(assignmentId: string, courseId: string, activityId: string | undefined, mode: 'edit' | 'evaluate') {
  return `/calificaciones?${new URLSearchParams({
    sectionSubjectId: assignmentId,
    activityId: activityId ?? '',
    activityMode: mode,
    origin: 'subject',
    returnCourseId: courseId,
    returnSubjectId: assignmentId,
    returnTab: 'actividades',
  }).toString()}`
}

function formatShortDate(value?: string | null) {
  if (!value) return 'Sin fecha'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })
}