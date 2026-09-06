import {
  ArrowLeft,
  BookOpen,
  CalendarCheck2,
  CalendarDays,
  ChartColumn,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Library,
  SlidersHorizontal,
  UsersRound,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { useCourses } from '@/modules/courses/hooks/useCourses'
import {
  getClassAttendanceHistory,
  getCurrentAcademicPeriodId,
  getStudentsBySection,
  upsertAttendance,
  type ClassAttendanceHistoryRecord,
} from '@/modules/attendance/services/attendanceService'
import type { MonthlyAttendanceMark, StudentAttendanceRow } from '@/modules/attendance/types'
import {
  attendancePercentageFromMarks,
  markToStatus,
  sortStudentsForRoster,
  statusToMark,
} from '@/modules/attendance/utils/monthlyAttendance'
import { cn } from '@/utils/cn'
import { getSubjectPalette } from '@/utils/subjectPalette'

type AttendanceCounts = Record<Exclude<MonthlyAttendanceMark, null>, number>

type SessionSummary = {
  date: string
  counts: AttendanceCounts
  percentage: number
}

export function SubjectAttendancePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const courseId = searchParams.get('courseId') ?? ''
  const subjectId = searchParams.get('subjectId') ?? ''
  const { grades, currentSchoolYear, loading: coursesLoading, error: coursesError } = useCourses()

  const [roster, setRoster] = useState<StudentAttendanceRow[]>([])
  const [history, setHistory] = useState<ClassAttendanceHistoryRecord[]>([])
  const [academicPeriodId, setAcademicPeriodId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [selectedDate, setSelectedDate] = useState(todayKey())
  const [marks, setMarks] = useState<Record<string, MonthlyAttendanceMark>>({})
  const [initialMarks, setInitialMarks] = useState<Record<string, MonthlyAttendanceMark>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [closeConfirm, setCloseConfirm] = useState(false)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)

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

  const assignment = context?.assignment ?? null
  const subjectName = assignment?.subjectName ?? 'Asignatura'
  const courseLabel = context ? `${context.grade.name} ${context.section.name}`.trim() : 'Curso'
  const levelName = context?.grade.academicLevelName ?? context?.grade.level ?? ''
  const cycleName = context?.grade.academicCycleName ?? ''
  const subjectPalette = assignment?.appearanceColor
    ? { color: assignment.appearanceColor }
    : getSubjectPalette(subjectName)

  useEffect(() => {
    if (!courseId || !subjectId || !currentSchoolYear?.id) return
    let active = true
    setLoading(true)
    setError(null)
    Promise.all([
      getStudentsBySection(courseId, currentSchoolYear.id),
      getClassAttendanceHistory(subjectId),
      getCurrentAcademicPeriodId(),
    ])
      .then(([students, attendanceHistory, periodId]) => {
        if (!active) return
        setRoster(sortStudentsForRoster(students))
        setHistory(attendanceHistory)
        setAcademicPeriodId(periodId)
      })
      .catch((cause) => {
        if (!active) return
        setError(cause instanceof Error ? cause.message : 'No se pudo cargar la asistencia de esta asignatura.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [courseId, currentSchoolYear?.id, subjectId])

  const sessions = useMemo(() => summarizeSessions(history, roster.length), [history, roster.length])
  const todaySession = sessions.find((session) => session.date === todayKey()) ?? null
  const currentCounts = useMemo(() => countAttendanceMarks(Object.values(marks)), [marks])
  const periodAttendance = useMemo(() => {
    if (!roster.length) return null
    const percentages = roster
      .map((student) => {
        const studentMarks = history
          .filter((record) => record.enrollmentId === student.enrollmentId)
          .map((record) => statusToMark(record.status, record.notes))
        return attendancePercentageFromMarks(studentMarks)
      })
      .filter((value): value is number => value !== null)
    if (!percentages.length) return null
    return Math.round(percentages.reduce((sum, value) => sum + value, 0) / percentages.length)
  }, [history, roster])

  const dirty = useMemo(() => marksSignature(marks, roster) !== marksSignature(initialMarks, roster), [initialMarks, marks, roster])
  const activeMonthLabel = formatAttendanceMonth(editing ? selectedDate : todayKey())

  function setSubjectTab(tab: string) {
    if (tab === 'asistencia') return
    const next = new URLSearchParams(searchParams)
    next.set('tab', tab)
    next.delete('activityId')
    setSearchParams(next)
  }

  function backToSubjects() {
    const next = new URLSearchParams(searchParams)
    next.delete('subjectId')
    next.delete('tab')
    next.delete('activityId')
    setSearchParams(next)
  }

  function openSession(date: string) {
    const nextMarks: Record<string, MonthlyAttendanceMark> = {}
    roster.forEach((student) => {
      const record = history.find((item) => item.enrollmentId === student.enrollmentId && item.attendanceDate.slice(0, 10) === date)
      nextMarks[student.enrollmentId] = record ? statusToMark(record.status, record.notes) : null
    })
    setSelectedDate(date)
    setMarks(nextMarks)
    setInitialMarks(nextMarks)
    setEditing(true)
    setSaved(false)
    setCloseConfirm(false)
  }

  function requestClose() {
    if (dirty) {
      setCloseConfirm(true)
      return
    }
    closeEditor()
  }

  function closeEditor() {
    setEditing(false)
    setSaved(false)
    setCloseConfirm(false)
    setSelectedStudentId(null)
    setMarks({})
    setInitialMarks({})
  }

  async function saveAttendance() {
    if (!academicPeriodId) return
    setSaving(true)
    setError(null)
    try {
      await Promise.all(roster.map((student) => {
        const mark = marks[student.enrollmentId]
        const status = markToStatus(mark)
        if (!status) return Promise.resolve()
        return upsertAttendance({
          type: 'class',
          enrollmentId: student.enrollmentId,
          academicPeriodId,
          sectionSubjectId: subjectId,
          attendanceDate: selectedDate,
          status,
        })
      }))
      const refreshedHistory = await getClassAttendanceHistory(subjectId)
      setHistory(refreshedHistory)
      setInitialMarks({ ...marks })
      setSaved(true)
      setCloseConfirm(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar la asistencia.')
    } finally {
      setSaving(false)
    }
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

  if (coursesLoading) return <div className="flex min-h-[24rem] items-center justify-center text-sm font-semibold text-muted-foreground">Cargando asignatura…</div>
  if (coursesError) return <ErrorState message={coursesError} />
  if (!context || !assignment) return <ErrorState message="No se encontró esta asignatura dentro del curso." />

  return (
    <div className="space-y-3">
      <header className="w-full overflow-visible rounded-2xl bg-card shadow-sm">
        <div className="flex min-h-[76px] items-center gap-3 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button type="button" onClick={backToSubjects} className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-extrabold text-primary transition hover:border-primary/25 hover:bg-primary/[0.04]">
              <ArrowLeft className="size-4" /><span className="hidden sm:inline">Volver</span>
            </button>
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm" style={{ backgroundColor: subjectPalette.color }}><BookOpen className="size-6" /></span>
            <div className="min-w-0">
              <div className="flex min-w-0 flex-nowrap items-center gap-2 overflow-hidden"><h1 className="truncate text-base font-extrabold leading-tight text-foreground">{courseLabel} – {subjectName}</h1><span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">Activa</span></div>
              <p className="mt-1.5 flex min-w-0 flex-nowrap items-center gap-x-1.5 overflow-hidden whitespace-nowrap text-[11px] font-semibold text-muted-foreground">
                {levelName ? <span>{levelName.replace(/^nivel\s+/i, '')}</span> : null}
                {cycleName ? <><span>·</span><span>{cycleName}</span></> : null}
                <span>·</span><span>Sección {context.section.name}</span>
                {currentSchoolYear?.name ? <><span>·</span><span className="truncate">Año escolar {currentSchoolYear.name}</span></> : null}
              </p>
            </div>
          </div>
          {!editing ? <Button className="h-10" onClick={() => openSession(todayKey())}><CheckCircle2 className="size-4" /> Pasar lista</Button> : null}
        </div>
      </header>

      <nav className="grid w-full grid-cols-2 gap-1 rounded-2xl bg-card p-1.5 shadow-sm sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" aria-label="Secciones de la asignatura">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = tab.id === 'asistencia'
          return <button key={tab.id} type="button" onClick={() => setSubjectTab(tab.id)} aria-current={active ? 'page' : undefined} className={cn('relative flex h-10 min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-2 text-sm font-bold text-muted-foreground transition hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', active && 'bg-primary/[0.055] text-primary after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:rounded-t-full after:bg-primary', tab.badge && !active && 'bg-muted/40 text-muted-foreground/70')}>
            <Icon className="size-4" />{tab.label}{tab.badge ? <span className="hidden rounded-full bg-slate-100 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide text-slate-500 2xl:inline">{tab.badge}</span> : null}
          </button>
        })}
      </nav>

      {loading ? (
        <div className="flex min-h-[24rem] items-center justify-center rounded-2xl border border-border bg-card text-sm font-semibold text-muted-foreground">Cargando asistencia…</div>
      ) : error && !roster.length ? (
        <ErrorState message={error} />
      ) : (
        <section className="space-y-4">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Asistencia</h2>
              <p className="mt-1 text-sm text-muted-foreground">Pasa lista y consulta los registros de esta asignatura.</p>
            </div>
            <div className="min-w-[15rem] rounded-2xl border border-primary/15 bg-card px-5 py-3 shadow-sm">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">Mes del registro</p>
              <p className="mt-1 text-2xl font-black uppercase tracking-tight text-foreground">{activeMonthLabel}</p>
            </div>
          </header>

          {error ? <ErrorState message={error} /> : null}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <AttendanceMetric label="Registros" value={String(sessions.length)} tone="emerald" />
            <AttendanceMetric label="Estudiantes" value={String(roster.length)} tone="amber" />
            <AttendanceMetric label="Asistencia hoy" value={todaySession ? `${todaySession.percentage}%` : 'Sin registrar'} tone="violet" />
            <AttendanceMetric label="Promedio del período" value={periodAttendance === null ? '—' : `${periodAttendance}%`} tone="blue" />
          </div>

          {!editing ? (
            !sessions.length ? (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/8 text-primary"><CalendarCheck2 className="size-6" /></span>
                <h3 className="mt-4 text-lg font-extrabold">Todavía no hay registros de asistencia</h3>
                <p className="mt-2 max-w-lg text-sm text-muted-foreground">Registra la primera asistencia de esta asignatura para comenzar el seguimiento.</p>
                <Button className="mt-5" onClick={() => openSession(todayKey())}><CheckCircle2 className="size-4" /> Pasar primera lista</Button>
              </div>
            ) : (
              <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="text-sm font-extrabold">Últimos registros</h3><p className="mt-1 text-[11px] text-muted-foreground">Selecciona un registro para revisarlo o corregirlo.</p></div><span className="text-xs font-extrabold text-primary">Últimos 5</span></div>
                <div className="mt-3 grid gap-2 lg:grid-cols-5">
                  {sessions.slice(0, 5).map((session) => <button key={session.date} type="button" onClick={() => openSession(session.date)} className="rounded-xl border border-border p-3 text-left transition duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/[0.02] hover:shadow-md">
                    <div className="flex items-center gap-2"><CalendarDays className="size-4 shrink-0 text-primary" /><strong className="text-xs">{formatAttendanceDate(session.date)}</strong></div>
                    <p className="mt-2 text-[10px] text-muted-foreground">{session.counts.P} P · {session.counts.A} A · {session.counts.E} E · {session.counts.T} T</p>
                    <strong className="mt-2 block text-sm text-primary">{session.percentage}%</strong>
                  </button>)}
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-semibold text-muted-foreground"><span className="rounded-lg bg-blue-50 px-3 py-2 text-blue-700">3 tardanzas equivalen a 1 ausencia para el porcentaje.</span><span className="rounded-lg bg-amber-50 px-3 py-2 text-amber-700">Por ahora, una excusa no reduce el porcentaje de asistencia.</span></div>
              </section>
            )
          ) : (
            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <header className="border-b border-border p-4">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><h3 className="text-base font-extrabold">Pasar asistencia</h3>{dirty ? <span className="rounded-full bg-amber-50 px-2 py-1 text-[9px] font-extrabold text-amber-700">Cambios sin guardar</span> : null}</div>
                    <p className="mt-1 text-xs text-muted-foreground">{courseLabel} · {subjectName}</p>
                    <p className="mt-1 text-sm font-extrabold text-foreground">{formatAttendanceDateLong(selectedDate)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <input type="date" aria-label="Fecha de asistencia" value={selectedDate} onChange={(event) => openSession(event.target.value)} className="h-10 rounded-xl border border-border px-3 text-sm font-bold" />
                    <Button variant="outline" className="h-10" onClick={() => setMarks(Object.fromEntries(roster.map((student) => [student.enrollmentId, 'P'])))}>Todos presentes</Button>
                    <Button variant="outline" className="h-10" onClick={() => setMarks(Object.fromEntries(roster.map((student) => [student.enrollmentId, null])))}>Limpiar</Button>
                    <Button disabled={saving || !academicPeriodId || Object.values(marks).some((mark) => !mark)} className="h-10" onClick={saveAttendance}><CheckCircle2 className="size-4" /> {saving ? 'Guardando…' : 'Guardar asistencia'}</Button>
                    <Button variant="outline" className="h-10" onClick={requestClose}><X className="size-4" /> Cerrar</Button>
                  </div>
                </div>
                {closeConfirm ? <div className="mt-3 flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs sm:flex-row sm:items-center"><p className="flex-1 font-semibold text-amber-800">Hay cambios sin guardar. Si cierras ahora, se descartarán.</p><Button variant="outline" className="h-9 bg-white" onClick={() => setCloseConfirm(false)}>Seguir editando</Button><Button className="h-9" onClick={closeEditor}>Descartar y cerrar</Button></div> : null}
              </header>

              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/20 px-4 py-3"><AttendanceLegend /><p className="text-xs font-bold text-muted-foreground">{roster.length} estudiantes · {currentCounts.P} P · {currentCounts.A} A · {currentCounts.E} E · {currentCounts.T} T · {sessionPercentage(currentCounts, roster.length)}%</p></div>
              {saved ? <p role="status" className="border-b border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">Asistencia guardada correctamente.</p> : null}
              <div className="divide-y divide-border">
                {roster.map((student, index) => {
                  const mark = marks[student.enrollmentId] ?? null
                  return <div key={student.enrollmentId} className="grid grid-cols-[2.5rem_minmax(0,1fr)_14rem] items-center gap-3 px-4 py-3 max-sm:grid-cols-[2rem_minmax(0,1fr)]">
                    <span className="text-xs font-bold text-muted-foreground">{String(student.listNumber ?? index + 1).padStart(2, '0')}</span>
                    <button type="button" onClick={() => setSelectedStudentId(student.enrollmentId)} className="truncate text-left text-sm font-bold hover:text-primary">{student.firstName} {student.lastName}</button>
                    <div className="grid grid-cols-4 gap-2 max-sm:col-span-2">{(['P', 'A', 'E', 'T'] as const).map((value) => <button key={value} type="button" aria-label={`${attendanceMarkLabel(value)} ${student.firstName} ${student.lastName}`} aria-pressed={mark === value} onClick={() => { setSaved(false); setMarks((current) => ({ ...current, [student.enrollmentId]: value })) }} className={cn('h-10 rounded-lg border text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', attendanceMarkClass(value, mark === value))}>{value}</button>)}</div>
                  </div>
                })}
              </div>
            </section>
          )}

          {selectedStudentId ? <AttendanceStudentSummary enrollmentId={selectedStudentId} students={roster} history={history} onClose={() => setSelectedStudentId(null)} /> : null}
        </section>
      )}
    </div>
  )
}

function countAttendanceMarks(marks: MonthlyAttendanceMark[]): AttendanceCounts {
  return marks.reduce<AttendanceCounts>((counts, mark) => {
    if (mark) counts[mark] += 1
    return counts
  }, { P: 0, A: 0, E: 0, T: 0 })
}

function summarizeSessions(records: ClassAttendanceHistoryRecord[], totalStudents: number): SessionSummary[] {
  const grouped = new Map<string, MonthlyAttendanceMark[]>()
  records.forEach((record) => {
    const date = record.attendanceDate.slice(0, 10)
    grouped.set(date, [...(grouped.get(date) ?? []), statusToMark(record.status, record.notes)])
  })
  return [...grouped].map(([date, marks]) => {
    const counts = countAttendanceMarks(marks)
    return { date, counts, percentage: sessionPercentage(counts, totalStudents) }
  }).sort((left, right) => right.date.localeCompare(left.date))
}

function sessionPercentage(counts: AttendanceCounts, totalStudents: number) {
  if (!totalStudents) return 0
  return Math.round(((counts.P + counts.E + counts.T) / totalStudents) * 100)
}

function marksSignature(value: Record<string, MonthlyAttendanceMark>, roster: StudentAttendanceRow[]) {
  return JSON.stringify(roster.map((student) => [student.enrollmentId, value[student.enrollmentId] ?? null]))
}

function todayKey() {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

function formatAttendanceDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })
}

function formatAttendanceDateLong(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('es-DO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function formatAttendanceMonth(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('es-DO', { month: 'long', year: 'numeric' })
}

function attendanceMarkClass(mark: Exclude<MonthlyAttendanceMark, null>, active: boolean) {
  if (!active) return 'border-border text-muted-foreground hover:bg-muted'
  if (mark === 'P') return 'border-emerald-300 bg-emerald-50 text-emerald-700'
  if (mark === 'A') return 'border-red-300 bg-red-50 text-red-700'
  if (mark === 'E') return 'border-amber-300 bg-amber-50 text-amber-700'
  return 'border-violet-300 bg-violet-50 text-violet-700'
}

function attendanceMarkLabel(mark: Exclude<MonthlyAttendanceMark, null>) {
  return mark === 'P' ? 'Presente' : mark === 'A' ? 'Ausente' : mark === 'E' ? 'Excusa' : 'Tardanza'
}

function AttendanceLegend() {
  return <div className="flex flex-wrap gap-3">{([['P', 'Presente'], ['A', 'Ausente'], ['E', 'Excusa'], ['T', 'Tardanza']] as const).map(([mark, label]) => <span key={mark} className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground"><strong className={cn('grid size-6 place-items-center rounded-md border', attendanceMarkClass(mark, true))}>{mark}</strong>{label}</span>)}</div>
}

function AttendanceMetric({ label, value, tone }: { label: string; value: string; tone: 'emerald' | 'amber' | 'violet' | 'blue' }) {
  const tones = { emerald: 'bg-emerald-50 text-emerald-700', amber: 'bg-amber-50 text-amber-700', violet: 'bg-violet-50 text-violet-700', blue: 'bg-blue-50 text-blue-700' }
  return <div className="rounded-2xl border border-border bg-card p-4 shadow-sm"><span className={cn('inline-flex rounded-lg px-2 py-1 text-[10px] font-extrabold', tones[tone])}>{label}</span><strong className="mt-3 block text-2xl leading-none">{value}</strong></div>
}

function AttendanceStudentSummary({ enrollmentId, students, history, onClose }: { enrollmentId: string; students: StudentAttendanceRow[]; history: ClassAttendanceHistoryRecord[]; onClose: () => void }) {
  const student = students.find((item) => item.enrollmentId === enrollmentId)
  if (!student) return null
  const records = history.filter((record) => record.enrollmentId === enrollmentId)
  const marks = records.map((record) => statusToMark(record.status, record.notes))
  const counts = countAttendanceMarks(marks)
  const percentage = attendancePercentageFromMarks(marks)
  return <section className="rounded-2xl border border-primary/20 bg-card p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div><h3 className="font-extrabold">{student.firstName} {student.lastName}</h3><p className="mt-1 text-xs text-muted-foreground">Asistencia en esta asignatura · {percentage === null ? 'Sin registros' : `${Number(percentage.toFixed(1))}%`}</p></div><button type="button" onClick={onClose} aria-label="Cerrar resumen del estudiante" className="grid size-10 place-items-center rounded-xl hover:bg-muted"><X className="size-4" /></button></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4"><AttendanceMetric label="Presentes" value={String(counts.P)} tone="emerald" /><AttendanceMetric label="Ausencias" value={String(counts.A)} tone="amber" /><AttendanceMetric label="Excusas" value={String(counts.E)} tone="amber" /><AttendanceMetric label="Tardanzas" value={String(counts.T)} tone="violet" /></div><p className="mt-3 text-[10px] font-semibold text-muted-foreground">Regla aplicada: cada 3 tardanzas equivalen a 1 ausencia. Las excusas no reducen el porcentaje por ahora.</p></section>
}
