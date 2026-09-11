import { CalendarCheck2, Check, ClipboardList, Copy, Download, FileText, GraduationCap, TriangleAlert, UsersRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { MetricTile, ProgressIndicator, SectionHeader, StatusBadge } from '@/components/ui/SemanticUI'
import { ActivityInfoModal } from '@/modules/grading/components/ActivityInfoModal'
import { getGradingWorkspace } from '@/modules/grading/services/gradingService'
import type { AcademicPeriodOpt, GradeRecordRow, GradingActivity, StudentGradeRow } from '@/modules/grading/types'
import { getClassAttendanceHistory, type ClassAttendanceHistoryRecord } from '@/modules/attendance/services/attendanceService'
import { buildSubjectReport } from '@/modules/reports/utils/subjectReport'

type SectionKey = 'summary' | 'performance' | 'blocks' | 'activities' | 'attendance' | 'followup'

export function SubjectReportsPanel({ sectionSubjectId, courseLabel, subjectName, initialStudents, initialActivities, initialRecords, periods, initialPeriodId }: {
  sectionSubjectId: string | null
  courseLabel: string
  subjectName: string
  initialStudents: StudentGradeRow[]
  initialActivities: GradingActivity[]
  initialRecords: GradeRecordRow[]
  periods: AcademicPeriodOpt[]
  initialPeriodId: string | null
}) {
  const [periodId, setPeriodId] = useState(initialPeriodId)
  const [students, setStudents] = useState(initialStudents)
  const [activities, setActivities] = useState(initialActivities)
  const [records, setRecords] = useState(initialRecords)
  const [attendance, setAttendance] = useState<ClassAttendanceHistoryRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<GradingActivity | null>(null)
  const [exportOpen, setExportOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setPeriodId(initialPeriodId)
    setStudents(initialStudents)
    setActivities(initialActivities)
    setRecords(initialRecords)
  }, [initialActivities, initialPeriodId, initialRecords, initialStudents])

  useEffect(() => {
    if (!sectionSubjectId) return
    let active = true
    getClassAttendanceHistory(sectionSubjectId)
      .then((data) => { if (active) setAttendance(data) })
      .catch(() => { if (active) setAttendance([]) })
    return () => { active = false }
  }, [sectionSubjectId])

  async function changePeriod(nextPeriodId: string) {
    if (!sectionSubjectId || nextPeriodId === periodId) return
    setLoading(true)
    setError(null)
    try {
      const data = await getGradingWorkspace({ sectionSubjectId, academicPeriodId: nextPeriodId, includeOptions: false })
      setStudents(data.students)
      setActivities(data.activities)
      setRecords(data.gradeRecords)
      setPeriodId(data.selectedAcademicPeriodId)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo cargar el período seleccionado.')
    } finally { setLoading(false) }
  }

  const period = periods.find((item) => item.id === periodId) ?? null
  const report = useMemo(() => buildSubjectReport({ students, activities, records, attendance, periodStart: period?.startDate, periodEnd: period?.endDate }), [activities, attendance, period?.endDate, period?.startDate, records, students])
  const selectedRow = report.rows.find((row) => row.enrollmentId === selectedStudent) ?? null
  const selectedStudentData = students.find((student) => student.enrollmentId === selectedStudent) ?? null
  const evaluatedPairs = report.activities.reduce((sum, item) => sum + item.evaluated, 0)
  const possiblePairs = activities.length * students.length
  const completion = possiblePairs ? Math.round((evaluatedPairs / possiblePairs) * 100) : null
  const summary = buildSummary(report, period?.name ?? 'el período seleccionado')

  if (!sectionSubjectId) return <EmptyState title="Asignatura no disponible" description="No se encontró la asignatura necesaria para generar este reporte." />

  return (
    <section className="space-y-4" aria-busy={loading}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><h2 className="text-2xl font-extrabold text-foreground">Reportes</h2><p className="mt-1 text-sm text-muted-foreground">Analiza el rendimiento, la asistencia y el progreso de esta asignatura.</p></div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="min-w-64 text-xs font-bold text-muted-foreground">Período académico<Select aria-label="Período" className="mt-1" value={periodId ?? ''} disabled={loading || !periodId} onChange={(event) => void changePeriod(event.target.value)}>{periods.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Select></label>
          <Button className="self-end" onClick={() => setExportOpen(true)} disabled={loading}><Download className="size-4" aria-hidden="true" /> Exportar reporte</Button>
        </div>
      </div>
      {error ? <ErrorState message={error} /> : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MetricTile icon={UsersRound} label="Estudiantes" value={students.length} helper="Matrícula activa" />
        <MetricTile icon={GraduationCap} tone="success" label="Promedio del período" value={report.average === null ? 'Sin datos' : `${report.average}%`} helper={`${report.rows.filter((row) => row.average !== null).length} con calificaciones`} />
        <MetricTile icon={CalendarCheck2} tone="info" label="Asistencia" value={report.groupAttendance === null ? 'Sin datos' : `${report.groupAttendance}%`} helper={report.attendance.length ? `${new Set(report.attendance.map((item) => item.attendanceDate.slice(0, 10))).size} clases registradas` : 'No hay pases de lista'} />
        <MetricTile icon={Check} tone="success" label="Puntos evaluados" value={`${report.evaluatedPoints}/${report.totalPoints}`} helper="Actividades con calificación" />
        <MetricTile icon={ClipboardList} tone="warning" label="Pendientes" value={report.activities.reduce((sum, item) => sum + item.pending, 0)} helper="Calificaciones por registrar" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,.65fr)]">
        <article className="rounded-3xl bg-card p-5 shadow-sm">
          <SectionHeader title="Rendimiento del período" description="Promedio y distribución del grupo; los estudiantes sin evaluar se muestran por separado." meta={completion === null ? <StatusBadge>Sin actividades</StatusBadge> : <StatusBadge tone="info">{completion}% evaluado</StatusBadge>} />
          {!activities.length ? <EmptyState title="Aún no hay actividades" description="Crea actividades en este período para comenzar a medir el rendimiento." /> : <div className="mt-5 grid gap-6 md:grid-cols-2">
            <div className="flex min-h-44 flex-col items-center justify-center rounded-2xl bg-muted/35 text-center"><span className="text-5xl font-extrabold tabular-nums text-foreground">{report.average ?? '—'}</span><span className="mt-1 text-sm font-semibold text-muted-foreground">Promedio sobre 100</span><ProgressIndicator value={completion ?? 0} className="mt-5 w-44" /></div>
            <div className="space-y-3">{report.distribution.map((item) => <div key={item.label}><div className="mb-1 flex justify-between text-xs font-bold"><span>{item.label}</span><span className="tabular-nums text-muted-foreground">{item.count}</span></div><ProgressIndicator value={students.length ? (item.count / students.length) * 100 : 0} tone={item.label === 'Menos de 70' ? 'danger' : item.label === 'Sin evaluar' ? 'neutral' : 'success'} /></div>)}</div>
          </div>}
        </article>

        <article className="rounded-3xl bg-card p-5 shadow-sm">
          <SectionHeader title="Resumen automático" description="Redactado únicamente con los datos disponibles." />
          <p className="mt-4 text-sm leading-6 text-foreground">{summary}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => { void navigator.clipboard.writeText(summary); setCopied(true); window.setTimeout(() => setCopied(false), 2500) }}><Copy className="size-4" aria-hidden="true" /> {copied ? 'Copiado' : 'Copiar resumen'}</Button>
        </article>
      </div>

      <article className="rounded-3xl bg-card p-5 shadow-sm">
        <SectionHeader title="Desempeño por bloques" description="Resultados calculados solo con actividades calificadas en cada competencia." />
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{report.blocks.map((block) => <div key={block.id} className="rounded-2xl border border-border p-4"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="text-xs font-extrabold text-primary">{block.shortName}</p><p className="mt-1 text-sm font-bold leading-5 text-foreground">{block.name}</p></div><strong className="text-xl tabular-nums">{block.average === null ? '—' : block.average}</strong></div><p className="mt-3 text-xs text-muted-foreground">{block.activities} actividades · {block.evaluated}/{block.possible} calificaciones</p><ProgressIndicator className="mt-2" value={block.completion ?? 0} /></div>)}</div>
      </article>

      <article className="rounded-3xl bg-card p-5 shadow-sm">
        <SectionHeader title="Evolución del grupo" description="Promedio del grupo en cada actividad, en orden cronológico." />
        <div className="mt-4">{report.activities.filter((item) => item.average !== null).length < 2 ? <EmptyState title="Historial insuficiente" description="Se necesitan al menos dos actividades calificadas para mostrar una evolución." /> : <EvolutionChart activities={report.activities} />}</div>
      </article>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(20rem,.7fr)]">
        <article className="overflow-hidden rounded-3xl bg-card shadow-sm"><div className="p-5"><SectionHeader title="Rendimiento por actividad" description="Selecciona una actividad para consultar todos sus detalles." /></div>{!activities.length ? <EmptyState title="Sin actividades en este período" description="Cuando existan actividades aparecerán aquí." /> : <div className="overflow-x-auto"><table className="w-full min-w-[42rem] text-left text-sm"><thead className="bg-muted/45 text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="px-5 py-3">Actividad</th><th className="px-4 py-3">Bloque</th><th className="px-4 py-3 text-center">Promedio</th><th className="px-4 py-3 text-center">Evaluados</th><th className="px-5 py-3 text-center">Pendientes</th></tr></thead><tbody>{report.activities.map((activity) => <tr key={activity.id} tabIndex={0} role="button" className="cursor-pointer border-t border-border transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring" onClick={() => setSelectedActivity(activity)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedActivity(activity) } }}><td className="px-5 py-4 font-bold text-foreground">{activity.name}</td><td className="px-4 py-4 text-muted-foreground">{report.blocks.find((block) => block.id === activity.competencyBlockId)?.shortName ?? 'Sin bloque'}</td><td className="px-4 py-4 text-center font-bold tabular-nums">{activity.average === null ? '—' : `${activity.average}%`}</td><td className="px-4 py-4 text-center tabular-nums">{activity.evaluated}/{students.length}</td><td className="px-5 py-4 text-center"><StatusBadge tone={activity.pending ? 'warning' : 'success'}>{activity.pending}</StatusBadge></td></tr>)}</tbody></table></div>}</article>

        <article className="rounded-3xl bg-card p-5 shadow-sm"><SectionHeader title="Seguimiento recomendado" description="Criterios transparentes, sin inferir causas." />{!report.followUp.length ? <EmptyState title="Sin alertas de seguimiento" description="No se detectaron criterios pendientes con los datos disponibles." /> : <div className="mt-4 space-y-2">{report.followUp.map((student) => <button key={student.enrollmentId} type="button" className="flex w-full items-start gap-3 rounded-2xl border border-border p-3 text-left transition hover:border-warning/60 hover:bg-warning/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => setSelectedStudent(student.enrollmentId)}><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-warning/25 text-warning-foreground"><TriangleAlert className="size-4" aria-hidden="true" /></span><span className="min-w-0"><strong className="block text-sm text-foreground">{student.firstName} {student.lastName}</strong><span className="mt-1 block text-xs leading-5 text-muted-foreground">{student.reasons.join(' · ')}</span></span></button>)}</div>}</article>
      </div>

      {selectedActivity ? <ActivityInfoModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} /> : null}
      {selectedStudentData && selectedRow ? <StudentReportModal student={selectedStudentData} row={selectedRow} report={report} onClose={() => setSelectedStudent(null)} /> : null}
      {exportOpen ? <ExportReportModal courseLabel={courseLabel} subjectName={subjectName} periodName={period?.name ?? 'Período'} report={report} onClose={() => setExportOpen(false)} /> : null}
    </section>
  )
}

function EvolutionChart({ activities }: { activities: ReturnType<typeof buildSubjectReport>['activities'] }) {
  const points = activities.filter((item) => item.average !== null)
  const coords = points.map((item, index) => ({ item, x: points.length === 1 ? 50 : 6 + (index / (points.length - 1)) * 88, y: 92 - ((item.average ?? 0) * .8) }))
  return <div className="overflow-x-auto"><div className="min-w-[36rem]"><svg viewBox="0 0 100 100" className="h-56 w-full" role="img" aria-label="Evolución del promedio del grupo por actividad"><path d={`M ${coords.map((point) => `${point.x} ${point.y}`).join(' L ')}`} fill="none" stroke="currentColor" strokeWidth="1.8" className="text-primary" />{coords.map(({ item, x, y }) => <g key={item.id}><circle cx={x} cy={y} r="2.2" className="fill-primary" /><text x={x} y="98" textAnchor="middle" fontSize="3" className="fill-muted-foreground">{item.name.slice(0, 14)}</text><text x={x} y={y - 4} textAnchor="middle" fontSize="3.2" className="fill-foreground">{item.average}%</text></g>)}</svg></div></div>
}

function StudentReportModal({ student, row, report, onClose }: { student: StudentGradeRow; row: ReturnType<typeof buildSubjectReport>['rows'][number]; report: ReturnType<typeof buildSubjectReport>; onClose: () => void }) {
  const attendance = report.attendanceByStudent.get(student.enrollmentId) ?? null
  const pending = report.pendingByStudent.get(student.enrollmentId) ?? 0
  return <Modal title={`${student.firstName} ${student.lastName}`} description={`N.º ${String(row.listNumber).padStart(2, '0')} · Resumen del período`} icon={UsersRound} onClose={onClose}><div className="space-y-4 p-5"><div className="grid grid-cols-3 gap-3"><MetricTile label="Promedio" value={row.average === null ? '—' : `${row.average}%`} /><MetricTile label="Asistencia" value={attendance === null ? '—' : `${attendance}%`} /><MetricTile label="Pendientes" value={pending} /></div><div className="grid gap-3 sm:grid-cols-2">{report.blocks.map((block) => <div key={block.id} className="rounded-2xl border border-border p-3"><p className="text-xs font-bold text-muted-foreground">{block.shortName}</p><p className="mt-1 text-lg font-extrabold">{row.blockAverages[block.id] === null ? 'Sin evaluar' : `${row.blockAverages[block.id]}%`}</p></div>)}</div><div className="flex justify-end"><Button variant="outline" onClick={onClose}>Cerrar</Button></div></div></Modal>
}

function ExportReportModal({ courseLabel, subjectName, periodName, report, onClose }: { courseLabel: string; subjectName: string; periodName: string; report: ReturnType<typeof buildSubjectReport>; onClose: () => void }) {
  const labels: Record<SectionKey, string> = { summary: 'Resumen ejecutivo', performance: 'Rendimiento del período', blocks: 'Desempeño por bloques', activities: 'Actividades', attendance: 'Asistencia', followup: 'Seguimiento recomendado' }
  const [sections, setSections] = useState<Record<SectionKey, boolean>>({ summary: true, performance: true, blocks: true, activities: true, attendance: true, followup: true })
  return <Modal title="Exportar reporte" description="Selecciona las secciones que incluirá el documento imprimible en PDF." icon={FileText} onClose={onClose}><div className="space-y-4 p-5"><fieldset><legend className="text-sm font-extrabold text-foreground">Contenido del reporte</legend><div className="mt-3 grid gap-2 sm:grid-cols-2">{(Object.keys(labels) as SectionKey[]).map((key) => <label key={key} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-border px-3 text-sm font-semibold"><input type="checkbox" checked={sections[key]} onChange={(event) => setSections((current) => ({ ...current, [key]: event.target.checked }))} />{labels[key]}</label>)}</div></fieldset><div className="flex justify-end gap-2 border-t border-border pt-4"><Button variant="outline" onClick={onClose}>Cancelar</Button><Button disabled={!Object.values(sections).some(Boolean)} onClick={() => printReport({ courseLabel, subjectName, periodName, report, sections })}><Download className="size-4" aria-hidden="true" /> Preparar PDF</Button></div></div></Modal>
}

function buildSummary(report: ReturnType<typeof buildSubjectReport>, periodName: string) {
  const parts = [`En ${periodName}, el grupo tiene ${report.rows.length} estudiantes.`]
  if (report.average !== null) parts.push(`El promedio registrado es ${report.average}%.`)
  if (report.groupAttendance !== null) parts.push(`La asistencia equivalente es ${report.groupAttendance}%, considerando tres tardanzas como una ausencia.`)
  if (report.activities.length) parts.push(`Hay ${report.activities.length} actividades y ${report.activities.reduce((sum, item) => sum + item.pending, 0)} calificaciones pendientes.`)
  if (report.followUp.length) parts.push(`${report.followUp.length} estudiantes cumplen al menos un criterio de seguimiento.`)
  return parts.join(' ')
}

function escapeHtml(value: unknown) { return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character] ?? character) }

function printReport({ courseLabel, subjectName, periodName, report, sections }: { courseLabel: string; subjectName: string; periodName: string; report: ReturnType<typeof buildSubjectReport>; sections: Record<SectionKey, boolean> }) {
  const popup = window.open('', '_blank')
  if (!popup) return
  popup.opener = null
  const section = (title: string, body: string) => `<section><h2>${escapeHtml(title)}</h2>${body}</section>`
  const html = [
    sections.summary && section('Resumen', `<p>${escapeHtml(buildSummary(report, periodName))}</p>`),
    sections.performance && section('Rendimiento', `<p>Promedio: <strong>${report.average ?? 'Sin datos'}${report.average === null ? '' : '%'}</strong></p><p>Puntos evaluados: ${report.evaluatedPoints}/${report.totalPoints}</p>`),
    sections.blocks && section('Desempeño por bloques', `<table><tr><th>Bloque</th><th>Promedio</th><th>Avance</th></tr>${report.blocks.map((item) => `<tr><td>${escapeHtml(item.shortName)} — ${escapeHtml(item.name)}</td><td>${item.average ?? 'Sin datos'}${item.average === null ? '' : '%'}</td><td>${item.evaluated}/${item.possible}</td></tr>`).join('')}</table>`),
    sections.activities && section('Actividades', `<table><tr><th>Actividad</th><th>Promedio</th><th>Evaluados</th><th>Pendientes</th></tr>${report.activities.map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${item.average ?? 'Sin datos'}${item.average === null ? '' : '%'}</td><td>${item.evaluated}</td><td>${item.pending}</td></tr>`).join('')}</table>`),
    sections.attendance && section('Asistencia', `<p>${report.groupAttendance === null ? 'No hay asistencia registrada.' : `Asistencia equivalente: ${report.groupAttendance}%. Tres tardanzas equivalen a una ausencia.`}</p>`),
    sections.followup && section('Seguimiento recomendado', report.followUp.length ? `<ul>${report.followUp.map((item) => `<li><strong>${escapeHtml(`${item.firstName} ${item.lastName}`)}</strong>: ${escapeHtml(item.reasons.join(', '))}</li>`).join('')}</ul>` : '<p>No se detectaron criterios de seguimiento.</p>'),
  ].filter(Boolean).join('')
  popup.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Reporte de ${escapeHtml(subjectName)}</title><style>@page{size:A4;margin:18mm}body{font:14px Arial,sans-serif;color:#202938;line-height:1.5}header{border-bottom:3px solid #35afe0;margin-bottom:24px;padding-bottom:16px}h1{font-size:24px;margin:0}h2{font-size:16px;margin:24px 0 8px;color:#176f98}p{margin:5px 0}table{width:100%;border-collapse:collapse;font-size:12px}th,td{border:1px solid #d9dee5;padding:7px;text-align:left}th{background:#eef7fb}footer{margin-top:28px;border-top:1px solid #d9dee5;padding-top:8px;color:#687386;font-size:11px}</style></head><body><header><h1>Reporte por asignatura</h1><p><strong>${escapeHtml(courseLabel)} · ${escapeHtml(subjectName)}</strong></p><p>${escapeHtml(periodName)}</p></header>${html}<footer>Generado por AulaBase el ${escapeHtml(new Date().toLocaleDateString('es-DO'))}</footer><script>window.addEventListener('load',()=>window.print())</script></body></html>`)
  popup.document.close()
}
