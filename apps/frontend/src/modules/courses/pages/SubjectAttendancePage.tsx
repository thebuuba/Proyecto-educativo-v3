import { CalendarCheck2, CalendarDays, CheckCircle2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
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
  const selectedStudent = roster.find((student) => student.enrollmentId === selectedStudentId)
  const studentMarks = monthRecords.filter((record) => record.enrollmentId === selectedStudentId).map((record) => statusToMark(record.status, record.notes))
  const studentPercentage = attendancePercentageFromMarks(studentMarks)

  function openSession(nextDate: string) {
    const records = history.filter((record) => record.attendanceDate.startsWith(nextDate))
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
  }

  function closeEditor() {
    setEditing(false)
    setSaved(false)
    setPending(null)
    setSelectedStudentId(null)
    setMarks({})
    setInitialMarks({})
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
        <h3 className="text-sm font-extrabold text-foreground">Últimas listas guardadas</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">Hasta cinco fechas con registros guardados. Abre una lista para revisarla o corregirla.</p>
        <div className={cn('mt-3 grid gap-2', !editing && 'sm:grid-cols-2 xl:grid-cols-5')}>{sessionDates.slice(0, 5).map((day) => {
          const values = history.filter((record) => record.attendanceDate.startsWith(day)).map((record) => statusToMark(record.status, record.notes))
          const counts = countMarks(values)
          return <button type="button" key={day} disabled={saving} onClick={() => requestOpen(day)} className="rounded-xl border border-border p-3 text-left transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50">
            <span className="flex items-center gap-2 text-sm font-bold text-foreground"><CalendarDays className="size-4 shrink-0 text-primary" aria-hidden="true" />{formatDate(day)}</span>
            <span className="mt-2 block text-xs text-muted-foreground">{counts.P} P · {counts.A} A · {counts.E} E · {counts.T} T</span><span className="mt-2 block text-xs text-muted-foreground">{values.length} registros · {dailyPercentage(values)}% de asistencia</span>
          </button>
        })}</div>
        <Link to={buildSubjectAttendanceHref(sectionSubjectId, courseId)} className="mt-3 inline-flex min-h-11 items-center text-sm font-bold text-primary-variant">Ver historial completo →</Link>
      </section> : !editing && !error && !failure ? <EmptyState title="Todavía no hay registros de asistencia" description="Pulsa Pasar lista para registrar la primera asistencia de esta asignatura." /> : null}
      {editing ? <section className="min-w-0 overflow-hidden rounded-3xl bg-card shadow-sm" aria-label="Pasar asistencia">
        <header className="space-y-3 border-b border-border p-4">
          <div className="flex items-start justify-between gap-3"><div><h3 className="text-base font-extrabold text-foreground">Pasar asistencia</h3><p className="mt-1 text-sm font-semibold text-foreground">{formatDate(selectedDate)}</p></div>
            <Button variant="outline" disabled={saving} onClick={() => dirty ? setPending('close') : closeEditor()}><X className="size-4" aria-hidden="true" /> Cerrar</Button>
          </div>
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
          <span className="text-xs font-bold text-muted-foreground">{String(student.listNumber ?? index + 1).padStart(2, '0')}</span><button type="button" className="min-h-11 text-left text-sm font-semibold text-foreground [overflow-wrap:anywhere] hover:text-primary-variant" onClick={() => setSelectedStudentId(student.enrollmentId)}>{student.firstName} {student.lastName}</button>
          <div className="col-span-2 grid grid-cols-4 gap-2 sm:col-span-1">{(Object.keys(markLabels) as Mark[]).map((mark) => <button type="button" key={mark} aria-label={markLabels[mark] + ' ' + student.firstName + ' ' + student.lastName} aria-pressed={marks[student.enrollmentId] === mark} disabled={saving} onClick={() => { setSaved(false); setMarks((current) => ({ ...current, [student.enrollmentId]: mark })) }} className={cn('min-h-11 rounded-xl border text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50', marks[student.enrollmentId] === mark ? markStyles[mark] : 'border-border text-muted-foreground hover:bg-muted')}>{mark}</button>)}</div>
        </div>)}</div>
      </section> : null}
    </div>
    <p className="text-xs leading-5 text-muted-foreground">Cada 3 tardanzas del mismo estudiante durante el mes equivalen a 1 ausencia para el porcentaje mensual. Las marcas T se conservan. Las excusas no descuentan asistencia.</p>
    {selectedStudent ? <section className="rounded-3xl bg-card p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold text-foreground">{selectedStudent.firstName} {selectedStudent.lastName}</h3><p className="mt-1 text-sm text-muted-foreground">{monthLabel} · {studentPercentage === null ? 'Sin registros' : Number(studentPercentage.toFixed(1)) + '% de asistencia'}</p></div><Button variant="ghost" aria-label="Cerrar resumen del estudiante" onClick={() => setSelectedStudentId(null)}><X className="size-4" /></Button></div><div className="mt-3 flex flex-wrap gap-4">{(Object.keys(markLabels) as Mark[]).map((mark) => <span key={mark} className="text-sm text-foreground">{markLabels[mark]}: <strong>{countMarks(studentMarks)[mark]}</strong></span>)}</div></section> : null}
    {pending ? <ConfirmDialog title="¿Descartar los cambios?" description="Hay cambios sin guardar en esta lista. Puedes seguir editando o descartarlos para continuar." confirmLabel={pending === 'close' ? 'Descartar y cerrar' : 'Descartar y cambiar fecha'} cancelLabel="Seguir editando" destructive onClose={() => setPending(null)} onConfirm={() => pending === 'close' ? closeEditor() : openSession(pending.date)} /> : null}
  </section>
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
