import { CalendarCheck2, CalendarDays, CheckCircle2, UserRound, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { FeedbackBanner, StatusBadge, type SemanticTone } from '@/components/ui/SemanticUI'
import { getClassAttendanceHistory, getCurrentAcademicPeriodId, upsertAttendance, type ClassAttendanceHistoryRecord } from '@/modules/attendance/services/attendanceService'
import type { MonthlyAttendanceMark, StudentAttendanceRow } from '@/modules/attendance/types'
import { attendancePercentageFromMarks, markToStatus, sortStudentsForRoster, statusToMark } from '@/modules/attendance/utils/monthlyAttendance'
import { buildSubjectAttendanceHref } from '@/modules/courses/utils/subjectNavigation'
import { cn } from '@/utils/cn'

type Mark = 'P' | 'A' | 'E' | 'T'
const markLabels: Record<Mark, string> = { P: 'Presente', A: 'Ausente', E: 'Excusa', T: 'Tardanza' }
const markStyles: Record<Mark, string> = {
  P: 'border-success/40 bg-success/16 text-foreground',
  A: 'border-destructive/40 bg-destructive/14 text-foreground',
  E: 'border-warning/30 bg-warning/15 text-foreground',
  T: 'border-warning/50 bg-warning/25 text-foreground',
}
type Props = {
  sectionSubjectId: string | null
  students: StudentAttendanceRow[]
  loading?: boolean
  error?: string | null
  courseId: string
  courseLabel: string
  subjectName: string
  schoolYearName: string
}

export function SubjectAttendancePanel({ sectionSubjectId, students, loading = false, error = null, courseId, courseLabel, subjectName, schoolYearName }: Props) {
  const roster = useMemo(() => sortStudentsForRoster(students), [students])
  const attendanceEditorRef = useRef<HTMLElement | null>(null)
  const [history, setHistory] = useState<ClassAttendanceHistoryRecord[]>([])
  const [periodId, setPeriodId] = useState<string | null>(null)
  const [fetching, setFetching] = useState(true)
  const [failure, setFailure] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [selectedDate, setSelectedDate] = useState(todayKey)
  const [marks, setMarks] = useState<Record<string, MonthlyAttendanceMark>>({})
  const [initialMarks, setInitialMarks] = useState<Record<string, MonthlyAttendanceMark>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [pending, setPending] = useState<'close' | { date: string } | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [newListPrefilled, setNewListPrefilled] = useState(false)

  useEffect(() => {
    if (!sectionSubjectId) return
    let active = true
    setFetching(true)
    setFailure(null)
    Promise.all([getClassAttendanceHistory(sectionSubjectId), getCurrentAcademicPeriodId()])
      .then(([records, period]) => { if (active) { setHistory(records); setPeriodId(period) } })
      .catch((cause) => { if (active) setFailure(cause instanceof Error ? cause.message : 'No se pudo cargar la asistencia.') })
      .finally(() => { if (active) setFetching(false) })
    return () => { active = false }
  }, [sectionSubjectId])

  useEffect(() => {
    if (!selectedStudentId) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedStudentId(null)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [selectedStudentId])

  useEffect(() => {
    if (!editing) return
    const frame = window.requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      attendanceEditorRef.current?.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
        inline: 'nearest',
      })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [editing])

  const date = editing ? selectedDate : todayKey()
  const monthLabel = new Date(date + 'T12:00:00').toLocaleDateString('es-DO', { month: 'long', year: 'numeric' })
  const monthRecords = history.filter((record) => record.attendanceDate.startsWith(date.slice(0, 7)))
  const percentages = roster.map((student) => attendancePercentageFromMarks(monthRecords.filter((record) => record.enrollmentId === student.enrollmentId).map((record) => statusToMark(record.status, record.notes)))).filter((value): value is number => value !== null)
  const monthlyAverage = percentages.length ? Math.round(percentages.reduce((sum, value) => sum + value, 0) / percentages.length) : null
  const sessionDates = [...new Set(history.map((record) => record.attendanceDate.slice(0, 10)))].sort().reverse()
  const todayMarks = history.filter((record) => record.attendanceDate.startsWith(todayKey())).map((record) => statusToMark(record.status, record.notes))
  const todayCounts = countMarks(todayMarks)
  const dirty = roster.some((student) => marks[student.enrollmentId] !== initialMarks[student.enrollmentId])
  const currentCounts = countMarks(Object.values(marks))
  const complete = roster.length > 0 && roster.every((student) => Boolean(markToStatus(marks[student.enrollmentId] ?? null)))
  const selectedStudent = roster.find((student) => student.enrollmentId === selectedStudentId) ?? null
  const selectedStudentRecords = selectedStudent
    ? monthRecords.filter((record) => record.enrollmentId === selectedStudent.enrollmentId).sort((left, right) => right.attendanceDate.localeCompare(left.attendanceDate))
    : []
  const studentMarks = selectedStudentRecords.map((record) => statusToMark(record.status, record.notes))
  const studentPercentage = attendancePercentageFromMarks(studentMarks)

  function openSession(nextDate: string) {
    const records = history.filter((record) => record.attendanceDate.startsWith(nextDate))
    const isNewList = records.length === 0
    const nextMarks = Object.fromEntries(roster.map((student) => {
      const record = records.find((item) => item.enrollmentId === student.enrollmentId)
      return [student.enrollmentId, record ? statusToMark(record.status, record.notes) : records.length ? null : 'P']
    })) as Record<string, MonthlyAttendanceMark>
    setSelectedDate(nextDate)
    setMarks(nextMarks)
    setInitialMarks(nextMarks)
    setEditing(true)
    setSaved(false)
    setPending(null)
    setNewListPrefilled(isNewList)
  }

  function closeEditor() {
    setEditing(false)
    setSaved(false)
    setPending(null)
    setSelectedStudentId(null)
    setMarks({})
    setInitialMarks({})
    setNewListPrefilled(false)
  }

  function requestOpen(nextDate: string) {
    if (!nextDate || saving) return
    if (editing && dirty) setPending({ date: nextDate })
    else openSession(nextDate)
  }

  async function saveAttendance() {
    if (!periodId || !sectionSubjectId || !complete || saving) return
    setSaving(true)
    setFailure(null)
    setSaved(false)
    try {
      const results = await Promise.allSettled(roster.map((student) => upsertAttendance({
        type: 'class', enrollmentId: student.enrollmentId, academicPeriodId: periodId,
        sectionSubjectId, attendanceDate: selectedDate, status: markToStatus(marks[student.enrollmentId])!,
      })))
      const rejected = results.find((result) => result.status === 'rejected')
      if (rejected?.status === 'rejected') throw rejected.reason
      setHistory(await getClassAttendanceHistory(sectionSubjectId))
      setInitialMarks({ ...marks })
      setSaved(true)
      setNewListPrefilled(false)
    } catch (cause) {
      setFailure(cause instanceof Error ? cause.message : 'No se pudo guardar toda la lista. Tus selecciones se conservan para volver a intentarlo.')
    } finally { setSaving(false) }
  }

  if (!sectionSubjectId) return <EmptyState title="Sin asignatura" description="Selecciona una asignatura para registrar la asistencia." />
  if (loading || fetching) return <p className="py-12 text-center text-sm text-muted-foreground">Cargando asistencia…</p>

  return <section className="space-y-4" aria-labelledby="subject-attendance-title">
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div><h2 id="subject-attendance-title" className="text-xl font-extrabold text-foreground">Asistencia</h2><p className="mt-1 text-sm text-muted-foreground">{courseLabel} · {subjectName} · Año escolar {schoolYearName}</p>
        <p className="mt-4 text-xs font-semibold text-muted-foreground">Mes del registro</p><p className="mt-1 text-3xl font-black capitalize text-foreground sm:text-4xl">{monthLabel}</p>
      </div>
      {!editing ? <Button disabled={Boolean(error || failure) || !roster.length} onClick={() => requestOpen(todayKey())}><CalendarCheck2 className="size-4" aria-hidden="true" /> Pasar lista</Button> : null}
    </header>
    {error || failure ? <FeedbackBanner tone="danger">{error || failure}</FeedbackBanner> : null}
    {!periodId ? <FeedbackBanner tone="warning">No hay un período académico disponible para guardar asistencia.</FeedbackBanner> : null}
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <AttendanceMetric label="Presentes hoy" value={todayMarks.length ? String(todayCounts.P) : '—'} tone="success" />
      <AttendanceMetric label="Ausentes hoy" value={todayMarks.length ? String(todayCounts.A) : '—'} tone="danger" />
      <AttendanceMetric label="Tardanzas hoy" value={todayMarks.length ? String(todayCounts.T) : '—'} tone="warning" />
      <AttendanceMetric label="Asistencia hoy" value={todayMarks.length ? dailyPercentage(todayMarks) + '%' : 'Sin registrar'} />
      <AttendanceMetric label="Promedio mensual" value={monthlyAverage === null ? '—' : monthlyAverage + '%'} />
    </div>
    <div className={cn('grid items-start gap-4', editing && sessionDates.length > 0 && 'xl:grid-cols-[18rem_minmax(0,1fr)]')}>
      {sessionDates.length ? <section className="min-w-0 rounded-3xl bg-card p-4 shadow-sm" aria-label="Últimas listas guardadas">
        <h3 className="text-sm font-extrabold text-foreground">Últimas listas guardadas</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">Son las últimas fechas en las que pasaste lista y la guardaste. Aquí aparecen hasta cinco, ordenadas de la más reciente a la más antigua.</p>
        <div className={cn('mt-3 grid gap-2', !editing && 'sm:grid-cols-2 xl:grid-cols-5')}>{sessionDates.slice(0, 5).map((day) => {
          const values = history.filter((record) => record.attendanceDate.startsWith(day)).map((record) => statusToMark(record.status, record.notes))
          const counts = countMarks(values)
          return <button type="button" key={day} disabled={saving} onClick={() => requestOpen(day)} className="rounded-xl border border-border p-3 text-left transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50">
            <span className="flex items-center gap-2 text-sm font-bold text-foreground"><CalendarDays className="size-4 shrink-0 text-primary" aria-hidden="true" />{formatDate(day)}</span>
            <span className="mt-2 block text-xs text-muted-foreground">{counts.P} P · {counts.A} A · {counts.E} E · {counts.T} T</span><span className="mt-2 block text-xs text-muted-foreground">{values.length} registros · {dailyPercentage(values)}% de asistencia</span>
          </button>
        })}</div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2"><p className="text-[11px] leading-5 text-muted-foreground">Puedes abrir cualquiera para revisar o corregir lo que guardaste ese día.</p><Link to={buildSubjectAttendanceHref(sectionSubjectId, courseId)} className="inline-flex min-h-10 items-center text-sm font-bold text-primary-variant">Ver historial completo →</Link></div>
      </section> : !editing && !error && !failure ? <EmptyState title="Todavía no hay registros de asistencia" description="Pulsa Pasar lista para registrar la primera asistencia de esta asignatura." /> : null}
      {editing ? <section ref={attendanceEditorRef} className="min-w-0 scroll-mt-5 overflow-hidden rounded-3xl bg-card shadow-sm sm:scroll-mt-6" aria-label="Pasar asistencia">
        <header className="space-y-3 border-b border-border p-4">
          <div className="flex items-start justify-between gap-3"><div><h3 className="text-base font-extrabold text-foreground">Pasar asistencia</h3><p className="mt-1 text-sm font-semibold text-foreground">{formatDate(selectedDate)}</p></div>
            <Button variant="outline" disabled={saving} onClick={() => dirty ? setPending('close') : closeEditor()}><X className="size-4" aria-hidden="true" /> Cerrar</Button>
          </div>
          {newListPrefilled ? <div className="rounded-2xl border border-primary/15 bg-primary/[0.045] px-3.5 py-3 text-xs leading-5 text-foreground"><strong className="font-extrabold">Lista nueva preparada:</strong> todos los estudiantes se marcaron como presentes por defecto para agilizar el pase de lista. Revisa y cambia a A, E o T cuando corresponda antes de guardar.</div> : null}
          <div className="flex flex-wrap items-end gap-2"><label className="grid gap-1 text-xs font-semibold text-muted-foreground">Fecha de asistencia<Input type="date" aria-label="Fecha de asistencia" value={selectedDate} disabled={saving} onChange={(event) => requestOpen(event.target.value)} /></label>
            <Button variant="outline" disabled={saving} onClick={() => { setSaved(false); setMarks(Object.fromEntries(roster.map((student) => [student.enrollmentId, 'P']))) }}>Todos presentes</Button>
            <Button variant="outline" disabled={saving} onClick={() => { setSaved(false); setMarks(Object.fromEntries(roster.map((student) => [student.enrollmentId, null]))) }}>Limpiar</Button>
            <Button disabled={saving || !periodId || !complete || Boolean(error)} onClick={saveAttendance}><CheckCircle2 className="size-4" aria-hidden="true" />{saving ? 'Guardando…' : 'Guardar asistencia'}</Button>
          </div>
          {dirty ? <StatusBadge tone="warning">Cambios sin guardar</StatusBadge> : null}
        </header>
        <div className="space-y-2 border-b border-border px-4 py-3"><div className="flex flex-wrap gap-3">{(Object.keys(markLabels) as Mark[]).map((mark) => <span key={mark} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><strong className={cn('grid size-6 place-items-center rounded-md border', markStyles[mark])}>{mark}</strong>{markLabels[mark]}</span>)}</div><p className="text-xs text-muted-foreground">{roster.length} estudiantes · {currentCounts.P} P · {currentCounts.A} A · {currentCounts.E} E · {currentCounts.T} T</p></div>
        {saved ? <FeedbackBanner tone="success">Asistencia guardada correctamente.</FeedbackBanner> : null}
        <div className="divide-y divide-border">{roster.map((student, index) => <div key={student.enrollmentId} className="grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-3 px-4 py-3 sm:grid-cols-[2rem_minmax(0,1fr)_13rem]">
          <span className="text-xs font-bold text-muted-foreground">{String(student.listNumber ?? index + 1).padStart(2, '0')}</span><button type="button" className="group flex min-h-11 items-center gap-2 text-left text-sm font-semibold text-foreground [overflow-wrap:anywhere] hover:text-primary-variant" onClick={() => setSelectedStudentId(student.enrollmentId)}><span className="min-w-0 flex-1">{student.firstName} {student.lastName}</span><span className="hidden text-[10px] font-bold text-muted-foreground transition group-hover:text-primary sm:inline">Ver detalle</span></button>
          <div className="col-span-2 grid grid-cols-4 gap-2 sm:col-span-1">{(Object.keys(markLabels) as Mark[]).map((mark) => <button type="button" key={mark} aria-label={markLabels[mark] + ' ' + student.firstName + ' ' + student.lastName} aria-pressed={marks[student.enrollmentId] === mark} disabled={saving} onClick={() => { setSaved(false); setMarks((current) => ({ ...current, [student.enrollmentId]: mark })) }} className={cn('min-h-11 rounded-xl border text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50', marks[student.enrollmentId] === mark ? markStyles[mark] : 'border-border text-muted-foreground hover:bg-muted')}>{mark}</button>)}</div>
        </div>)}</div>
      </section> : null}
    </div>
    <p className="text-xs leading-5 text-muted-foreground">Cada 3 tardanzas del mismo estudiante durante el mes equivalen a 1 ausencia para el porcentaje mensual. Las marcas T se conservan. Las excusas no descuentan asistencia.</p>
    {selectedStudent ? <StudentAttendanceDrawer student={selectedStudent} monthLabel={monthLabel} records={selectedStudentRecords} percentage={studentPercentage} onClose={() => setSelectedStudentId(null)} /> : null}
    {pending ? <ConfirmDialog title="¿Descartar los cambios?" description="Hay cambios sin guardar en esta lista. Puedes seguir editando o descartarlos para continuar." confirmLabel={pending === 'close' ? 'Descartar y cerrar' : 'Descartar y cambiar fecha'} cancelLabel="Seguir editando" destructive onClose={() => setPending(null)} onConfirm={() => pending === 'close' ? closeEditor() : openSession(pending.date)} /> : null}
  </section>
}

function StudentAttendanceDrawer({ student, monthLabel, records, percentage, onClose }: { student: StudentAttendanceRow; monthLabel: string; records: ClassAttendanceHistoryRecord[]; percentage: number | null; onClose: () => void }) {
  const marks = records.map((record) => statusToMark(record.status, record.notes))
  const counts = countMarks(marks)
  const equivalentAbsences = counts.A + Math.floor(counts.T / 3)

  return <div className="fixed inset-0 z-[80] flex justify-end" role="dialog" aria-modal="true" aria-label={`Asistencia de ${student.firstName} ${student.lastName}`}>
    <button type="button" aria-label="Cerrar detalle del estudiante" className="absolute inset-0 bg-slate-950/25 backdrop-blur-[1px]" onClick={onClose} />
    <aside className="relative flex h-full w-full max-w-[31rem] flex-col border-l border-border bg-background shadow-2xl animate-in slide-in-from-right duration-200">
      <header className="border-b border-border bg-card px-5 py-5">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"><UserRound className="size-5" /></span>
          <div className="min-w-0 flex-1"><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">Detalle de asistencia</p><h3 className="mt-1 text-lg font-black text-foreground">{student.firstName} {student.lastName}</h3><p className="mt-1 text-xs capitalize text-muted-foreground">{monthLabel}</p></div>
          <button type="button" onClick={onClose} aria-label="Cerrar detalle" className="grid size-10 shrink-0 place-items-center rounded-xl border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><X className="size-4" /></button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <section className="rounded-3xl border border-primary/10 bg-card p-4 shadow-sm">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Asistencia del mes</p>
          <div className="mt-2 flex items-end justify-between gap-3"><strong className="text-4xl font-black tracking-tight text-foreground">{percentage === null ? '—' : `${Number(percentage.toFixed(1))}%`}</strong><span className="rounded-full bg-primary/8 px-2.5 py-1 text-[10px] font-extrabold text-primary">{records.length} {records.length === 1 ? 'clase registrada' : 'clases registradas'}</span></div>
        </section>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(['P', 'A', 'E', 'T'] as Mark[]).map((mark) => <div key={mark} className="rounded-2xl border border-border bg-card p-3"><span className={cn('grid size-7 place-items-center rounded-lg border text-[11px] font-black', markStyles[mark])}>{mark}</span><strong className="mt-3 block text-xl text-foreground">{counts[mark]}</strong><span className="mt-0.5 block text-[10px] text-muted-foreground">{markLabels[mark]}</span></div>)}
        </div>

        <div className="mt-3 rounded-2xl bg-muted/35 px-4 py-3 text-xs leading-5 text-muted-foreground"><strong className="text-foreground">Ausencias equivalentes: {equivalentAbsences}.</strong> Las excusas no descuentan asistencia y cada grupo completo de 3 tardanzas suma 1 ausencia al cálculo mensual.</div>

        <section className="mt-5">
          <div className="flex items-center justify-between gap-3"><div><h4 className="text-sm font-extrabold text-foreground">Detalle por fecha</h4><p className="mt-1 text-xs text-muted-foreground">Historial de este estudiante durante {monthLabel}.</p></div><CalendarDays className="size-5 text-primary" /></div>
          {records.length ? <div className="mt-3 space-y-2">{records.map((record) => {
            const mark = normalizeMark(statusToMark(record.status, record.notes))
            return <div key={record.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card px-3.5 py-3 shadow-sm"><span className={cn('grid size-9 shrink-0 place-items-center rounded-xl border text-xs font-black', markStyles[mark])}>{mark}</span><div className="min-w-0 flex-1"><strong className="block text-sm text-foreground">{formatDate(record.attendanceDate.slice(0, 10))}</strong><span className="mt-0.5 block text-xs text-muted-foreground">{markLabels[mark]}</span></div></div>
          })}</div> : <div className="mt-3 rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">Este estudiante todavía no tiene registros de asistencia en este mes.</div>}
        </section>
      </div>
    </aside>
  </div>
}

function AttendanceMetric({ label, value, tone = 'info' }: { label: string; value: string; tone?: SemanticTone }) {
  return <div className="rounded-3xl bg-card p-4 shadow-sm"><StatusBadge tone={tone} dot={false}>{label}</StatusBadge><strong className="mt-3 block text-2xl text-foreground">{value}</strong></div>
}
function countMarks(marks: MonthlyAttendanceMark[]) {
  return marks.reduce((counts, mark) => {
    if (mark === 'T' || mark === 'R') counts.T++
    else if (mark === 'P') counts.P++
    else if (mark === 'A') counts.A++
    else if (mark === 'E') counts.E++
    return counts
  }, { P: 0, A: 0, E: 0, T: 0 })
}
function normalizeMark(mark: MonthlyAttendanceMark): Mark {
  if (mark === 'A') return 'A'
  if (mark === 'E') return 'E'
  if (mark === 'T' || mark === 'R') return 'T'
  return 'P'
}
function dailyPercentage(marks: MonthlyAttendanceMark[]) {
  const recorded = marks.filter(Boolean)
  return recorded.length ? Math.round(100 * recorded.filter((mark) => mark !== 'A').length / recorded.length) : 0
}
function todayKey() {
  const today = new Date()
  return [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-')
}
function formatDate(date: string) {
  return new Date(date + 'T12:00:00').toLocaleDateString('es-DO', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
}