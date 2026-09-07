import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Eye,
  GraduationCap,
  LayoutDashboard,
  Library,
  SlidersHorizontal,
  UsersRound,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { getGradingWorkspace } from '@/modules/grading/services/gradingService'
import type { AcademicPeriodOpt, GradeRecordRow, GradingActivity, StudentGradeRow } from '@/modules/grading/types'
import {
  buildCompactGradeRows,
  competencyBlocks,
  scoreForActivity,
  type CompactGradeRow,
} from '@/modules/grading/utils/competencyGrades'
import { cn } from '@/utils/cn'

type Workspace = {
  students: StudentGradeRow[]
  activities: GradingActivity[]
  records: GradeRecordRow[]
  periods: AcademicPeriodOpt[]
  selectedPeriodId: string | null
  gradeName: string
  sectionName: string
  subjectName: string
  schoolYearName: string
}

const emptyWorkspace: Workspace = {
  students: [], activities: [], records: [], periods: [], selectedPeriodId: null,
  gradeName: '', sectionName: '', subjectName: 'Asignatura', schoolYearName: '',
}

const blockAccents = [
  { border: 'border-blue-200', soft: 'bg-blue-50/70', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700 ring-blue-200', gradient: 'linear-gradient(90deg,#60a5fa,#2563eb,#1d4ed8)' },
  { border: 'border-emerald-200', soft: 'bg-emerald-50/70', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700 ring-emerald-200', gradient: 'linear-gradient(90deg,#34d399,#059669,#047857)' },
  { border: 'border-amber-200', soft: 'bg-amber-50/70', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700 ring-amber-200', gradient: 'linear-gradient(90deg,#fcd34d,#f59e0b,#d97706)' },
  { border: 'border-violet-200', soft: 'bg-violet-50/70', text: 'text-violet-700', badge: 'bg-violet-100 text-violet-700 ring-violet-200', gradient: 'linear-gradient(90deg,#a78bfa,#7c3aed,#6d28d9)' },
]

export function SubjectGradesPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const courseId = searchParams.get('courseId') ?? ''
  const subjectId = searchParams.get('subjectId') ?? ''
  const [workspace, setWorkspace] = useState<Workspace>(emptyWorkspace)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [selectedBlockId, setSelectedBlockId] = useState('b1')
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)
  const [instrumentActivity, setInstrumentActivity] = useState<GradingActivity | null>(null)

  useEffect(() => {
    if (!subjectId) return
    let active = true
    setLoading(true)
    setError(null)
    getGradingWorkspace({ sectionSubjectId: subjectId, includeOptions: true })
      .then((data) => {
        if (!active) return
        const selected = data.sectionSubjects.find((item) => item.id === subjectId)
        setWorkspace({
          students: data.students,
          activities: data.activities,
          records: data.gradeRecords,
          periods: data.academicPeriods,
          selectedPeriodId: data.selectedAcademicPeriodId,
          gradeName: selected?.gradeName ?? '',
          sectionName: selected?.sectionName ?? '',
          subjectName: selected?.subjectName ?? 'Asignatura',
          schoolYearName: selected?.schoolYearName ?? '',
        })
      })
      .catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : 'No se pudieron cargar las calificaciones.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [subjectId])

  async function changePeriod(periodId: string) {
    if (!subjectId || periodId === workspace.selectedPeriodId) return
    setLoading(true)
    setError(null)
    try {
      const data = await getGradingWorkspace({ sectionSubjectId: subjectId, academicPeriodId: periodId, includeOptions: false })
      setWorkspace((current) => ({ ...current, students: data.students, activities: data.activities, records: data.gradeRecords, selectedPeriodId: data.selectedAcademicPeriodId }))
      setSelectedStudentId(null)
      setSelectedActivityId(null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo cambiar de período.')
    } finally { setLoading(false) }
  }

  const rows = useMemo(() => buildCompactGradeRows(workspace.students, workspace.activities, workspace.records), [workspace.activities, workspace.records, workspace.students])
  const evaluatedActivities = workspace.activities.filter((activity) => workspace.records.some((record) => Boolean(scoreForActivity([record], record.enrollmentId, activity.id)))).length
  const courseAverageRows = rows.filter((row) => row.average !== null)
  const courseAverage = courseAverageRows.length ? Math.round(courseAverageRows.reduce((sum, row) => sum + (row.average ?? 0), 0) / courseAverageRows.length) : null
  const withoutGrades = rows.filter((row) => row.average === null).length
  const periodName = workspace.periods.find((period) => period.id === workspace.selectedPeriodId)?.name ?? 'Período actual'
  const selectedStudent = workspace.students.find((student) => student.enrollmentId === selectedStudentId) ?? null
  const selectedRow = rows.find((row) => row.enrollmentId === selectedStudentId) ?? null
  const selectedActivity = workspace.activities.find((activity) => activity.id === selectedActivityId) ?? null
  const selectedRecord = selectedStudent && selectedActivity ? scoreForActivity(workspace.records, selectedStudent.enrollmentId, selectedActivity.id) : null

  const setTab = (tab: string) => {
    const next = new URLSearchParams(searchParams)
    next.set('tab', tab)
    setSearchParams(next)
  }

  const back = () => {
    const next = new URLSearchParams(searchParams)
    next.delete('subjectId')
    next.delete('tab')
    setSearchParams(next)
  }

  if (loading && !workspace.periods.length) return <div className="flex min-h-[28rem] items-center justify-center text-sm font-semibold text-muted-foreground">Cargando calificaciones…</div>
  if (error && !workspace.periods.length) return <ErrorState message={error} />

  const tabs = [
    ['resumen', 'Resumen', LayoutDashboard], ['estudiantes', 'Estudiantes', UsersRound], ['equipos', 'Equipos', UsersRound],
    ['actividades', 'Actividades', ClipboardList], ['asistencia', 'Asistencia', CalendarDays], ['calificaciones', 'Calificaciones', GraduationCap],
    ['horario', 'Horario', CalendarDays], ['recursos', 'Recursos', Library], ['reportes', 'Reportes', LayoutDashboard], ['configuracion', 'Configuración', SlidersHorizontal],
  ] as const

  return <div className="space-y-3">
    <header className="rounded-2xl bg-card shadow-sm">
      <div className="flex min-h-[76px] items-center gap-3 px-4 py-3 sm:px-5">
        <button type="button" onClick={back} className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-border bg-card px-3 text-xs font-extrabold text-primary transition hover:bg-primary/[0.04]"><ArrowLeft className="size-4" /> Volver</button>
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm"><BookOpen className="size-6" /></span>
        <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h1 className="truncate text-base font-extrabold">{workspace.gradeName} {workspace.sectionName} – {workspace.subjectName}</h1><Badge tone="success">Activa</Badge></div><p className="mt-1 text-[11px] font-semibold text-muted-foreground">{workspace.schoolYearName ? `Año escolar ${workspace.schoolYearName}` : 'Asignatura activa'}</p></div>
      </div>
    </header>

    <nav className="grid w-full grid-cols-2 gap-1 rounded-2xl bg-card p-1.5 shadow-sm sm:grid-cols-3 md:grid-cols-5" aria-label="Secciones de la asignatura">
      {tabs.map(([id, label, Icon]) => <button key={id} type="button" onClick={() => setTab(id)} aria-current={id === 'calificaciones' ? 'page' : undefined} className={cn('relative flex h-10 items-center justify-center gap-2 rounded-xl px-2 text-sm font-bold text-muted-foreground transition hover:bg-primary/5 hover:text-primary', id === 'calificaciones' && 'bg-primary/[0.055] text-primary after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:rounded-full after:bg-primary')}><Icon className="size-4" />{label}</button>)}
    </nav>

    <section className="overflow-hidden rounded-3xl bg-card shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">Seguimiento académico</p><h2 className="mt-1 text-xl font-extrabold">Libro de calificaciones</h2><p className="mt-1 text-sm text-muted-foreground">Consulta el progreso por estudiante y entra al detalle sin salir de la asignatura.</p></div>
        <div className="flex flex-col gap-2 sm:flex-row"><Select aria-label="Período" value={workspace.selectedPeriodId ?? ''} disabled={loading} onChange={(event) => void changePeriod(event.target.value)}>{workspace.periods.map((period) => <option key={period.id} value={period.id}>{period.name}</option>)}</Select><Button variant="outline" onClick={() => navigate(`/calificaciones?${new URLSearchParams({ sectionSubjectId: subjectId, origin: 'subject', returnCourseId: courseId, returnSubjectId: subjectId, returnTab: 'calificaciones' }).toString()}`)}>Abrir libro completo</Button></div>
      </div>
      {error ? <div className="px-5 pt-4"><ErrorState message={error} /></div> : null}
      <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Actividades evaluadas" value={`${evaluatedActivities}`} helper={`${workspace.activities.length} creadas`} /><Metric label="Actividades creadas" value={`${workspace.activities.length}`} helper={periodName} /><Metric label="Promedio del curso" value={courseAverage === null ? '—' : `${courseAverage}`} helper="Escala de 100" /><Metric label="Sin calificar" value={`${withoutGrades}`} helper="Estudiantes" /></div>
      {!rows.length ? <div className="p-5"><EmptyState compact title="Sin estudiantes" description="Aún no hay estudiantes disponibles para este período." /></div> : <div className="overflow-x-auto border-t border-border"><table className="min-w-[58rem] w-full text-sm"><thead className="bg-muted/30 text-[10px] uppercase tracking-[0.12em] text-muted-foreground"><tr><th className="px-5 py-3 text-left">#</th><th className="px-5 py-3 text-left">Estudiante</th>{competencyBlocks.map((block) => <th key={block.id} className="px-4 py-3 text-center">{block.shortName}</th>)}<th className="px-4 py-3 text-center">Promedio</th><th className="px-5 py-3 text-right">Estado</th></tr></thead><tbody className="divide-y divide-border">{rows.map((row) => <tr key={row.enrollmentId} tabIndex={0} onClick={() => { setSelectedStudentId(row.enrollmentId); setSelectedBlockId('b1'); setSelectedActivityId(null) }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedStudentId(row.enrollmentId); setSelectedBlockId('b1'); setSelectedActivityId(null) } }} className="cursor-pointer transition hover:bg-primary/[0.03] focus-visible:bg-primary/[0.05]"><td className="px-5 py-4 font-bold text-muted-foreground">{row.listNumber}</td><td className="px-5 py-4"><strong>{row.lastName}, {row.firstName}</strong></td>{competencyBlocks.map((block) => <td key={block.id} className="px-4 py-4 text-center font-extrabold">{row.blockAverages[block.id] ?? '—'}</td>)}<td className="px-4 py-4 text-center text-base font-black text-primary">{row.average ?? '—'}</td><td className="px-5 py-4 text-right"><GradeStateBadge state={row.status} /></td></tr>)}</tbody></table></div>}
    </section>

    {selectedStudent && selectedRow ? <StudentGradesDrawer
      student={selectedStudent}
      row={selectedRow}
      students={workspace.students}
      activities={workspace.activities}
      records={workspace.records}
      periodName={periodName}
      courseLabel={`${workspace.gradeName} ${workspace.sectionName}`.trim()}
      subjectName={workspace.subjectName}
      blockId={selectedBlockId}
      activity={selectedActivity}
      record={selectedRecord}
      onBlockChange={(id) => { setSelectedBlockId(id); setSelectedActivityId(null) }}
      onActivityChange={setSelectedActivityId}
      onStudentChange={(id) => { setSelectedStudentId(id); setSelectedActivityId(null) }}
      onInstrument={(activity) => setInstrumentActivity(activity)}
      onClose={() => { setSelectedStudentId(null); setSelectedActivityId(null) }}
    /> : null}
    {instrumentActivity ? <InstrumentPreviewModal activity={instrumentActivity} onClose={() => setInstrumentActivity(null)} /> : null}
  </div>
}

function StudentGradesDrawer({ student, row, students, activities, records, periodName, courseLabel, subjectName, blockId, activity, record, onBlockChange, onActivityChange, onStudentChange, onInstrument, onClose }: {
  student: StudentGradeRow; row: CompactGradeRow; students: StudentGradeRow[]; activities: GradingActivity[]; records: GradeRecordRow[]; periodName: string; courseLabel: string; subjectName: string; blockId: string; activity: GradingActivity | null; record: GradeRecordRow | null; onBlockChange: (id: string) => void; onActivityChange: (id: string | null) => void; onStudentChange: (id: string) => void; onInstrument: (activity: GradingActivity) => void; onClose: () => void
}) {
  const block = competencyBlocks.find((item) => item.id === blockId) ?? competencyBlocks[0]
  const accent = blockAccents[competencyBlocks.findIndex((item) => item.id === block.id)] ?? blockAccents[0]
  const blockActivities = activities.filter((item) => item.competencyBlockId === block.id)

  return <Modal title="Detalle de calificaciones" onClose={onClose} hideHeader overlayClassName="items-stretch justify-end p-0 bg-slate-950/35" className="h-full max-h-none max-w-[54rem] rounded-none border-y-0 border-r-0" contentClassName="p-0">
    <div className="flex min-h-full flex-col bg-slate-50/70">
      <div className="h-1.5 shrink-0 bg-primary" />
      <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border bg-card px-5 py-4"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">Seguimiento del estudiante</p><h2 className="mt-1 text-lg font-black">Detalle de calificaciones</h2><p className="mt-1 text-xs text-muted-foreground">Consulta cómo se construyen sus notas por bloque y actividad.</p></div><Button variant="ghost" size="icon" aria-label="Cerrar" onClick={onClose}><X className="size-5" /></Button></header>
      <div className="space-y-4 p-5">
        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm"><div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"><span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-lg font-black text-primary">{student.firstName[0]}{student.lastName[0]}</span><div className="min-w-0 flex-1"><h3 className="text-base font-black">{student.lastName}, {student.firstName}</h3><p className="mt-1 text-xs text-muted-foreground">N.º de lista: {String(student.listNumber ?? row.listNumber).padStart(2, '0')}{student.studentCode ? ` · Matrícula: ${student.studentCode}` : ''}</p><p className="mt-1 text-xs text-muted-foreground">{courseLabel} · {subjectName}</p><p className="mt-1 text-xs font-bold text-primary">{periodName}</p></div><label className="grid min-w-60 gap-1 text-[9px] font-black uppercase tracking-wide text-muted-foreground">Cambiar estudiante<Select value={student.enrollmentId} onChange={(event) => onStudentChange(event.target.value)}>{students.map((item) => <option key={item.enrollmentId} value={item.enrollmentId}>{item.lastName}, {item.firstName}</option>)}</Select></label></div></section>
        <section className="rounded-3xl border border-border bg-card p-4 shadow-sm"><div className="grid grid-cols-2 gap-2 sm:grid-cols-5">{competencyBlocks.map((item) => <GradeTile key={item.id} label={item.shortName} value={row.blockAverages[item.id]} />)}<GradeTile label="Promedio" value={row.average} emphasized /></div></section>
        {activity ? <StudentActivityDetail activity={activity} record={record} accent={accent} onBack={() => onActivityChange(null)} onInstrument={() => onInstrument(activity)} /> : <>
          <nav className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm sm:grid-cols-4" aria-label="Bloques">{competencyBlocks.map((item, index) => { const selected = item.id === block.id; const visual = blockAccents[index]; return <button key={item.id} type="button" onClick={() => onBlockChange(item.id)} className={cn('h-11 rounded-xl border px-3 text-xs font-extrabold transition', selected ? cn(visual.soft, visual.border, visual.text, 'shadow-sm') : 'border-transparent text-muted-foreground hover:bg-muted')}>{item.shortName}</button> })}</nav>
          <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm"><div className={cn('border-b p-5', accent.soft, accent.border)}><p className={cn('text-[10px] font-black uppercase tracking-[0.14em]', accent.text)}>{block.shortName}</p><h3 className="mt-1 text-base font-black">{block.name}</h3><p className="mt-2 text-sm font-semibold text-muted-foreground">Calificación del bloque: <strong className={accent.text}>{row.blockAverages[block.id] === null ? 'Sin evaluar' : `${row.blockAverages[block.id]} / 100`}</strong></p></div><div className="p-4"><p className="mb-3 text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">Actividades del bloque</p>{blockActivities.length ? <div className="space-y-2">{blockActivities.map((item) => { const itemRecord = scoreForActivity(records, student.enrollmentId, item.id); return <button key={item.id} type="button" onClick={() => onActivityChange(item.id)} className="group flex min-h-16 w-full items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left transition duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"><span className={cn('grid size-10 shrink-0 place-items-center rounded-xl', accent.soft, accent.text)}><ClipboardList className="size-4" /></span><span className="min-w-0 flex-1"><strong className="block truncate text-sm">{item.name}</strong><span className="mt-1 block text-xs text-muted-foreground">{itemRecord ? `${itemRecord.score} / ${itemRecord.maxScore} · Evaluada` : `— / ${item.maxScore} · Pendiente de evaluación`}</span></span><ChevronRight className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" /></button> })}</div> : <p className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">Aún no hay actividades registradas en este bloque.</p>}</div></section>
        </>}
      </div>
    </div>
  </Modal>
}

function StudentActivityDetail({ activity, record, accent, onBack, onInstrument }: { activity: GradingActivity; record: GradeRecordRow | null; accent: (typeof blockAccents)[number]; onBack: () => void; onInstrument: () => void }) {
  const block = competencyBlocks.find((item) => item.id === activity.competencyBlockId) ?? competencyBlocks[0]
  const description = cleanDescription(activity.description)
  return <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
    <div className="h-1.5" style={{ background: accent.gradient }} />
    <header className="flex items-start gap-3 border-b border-border px-5 py-4"><button type="button" onClick={onBack} aria-label="Volver a actividades" className="grid size-10 shrink-0 place-items-center rounded-xl border border-border text-primary transition hover:bg-muted"><ArrowLeft className="size-4" /></button><div className="min-w-0 flex-1"><p className={cn('text-[10px] font-black uppercase tracking-[0.14em]', accent.text)}>Detalle de la actividad</p><h3 className="mt-1 text-lg font-black">{activity.name}</h3><p className="mt-1 text-xs text-muted-foreground">{block.shortName} · {block.name}</p></div><Badge tone={record ? 'success' : 'muted'}>{record ? 'Evaluada' : 'Pendiente'}</Badge></header>
    <div className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <section className="overflow-hidden rounded-2xl border border-border bg-card"><div className="border-b border-border bg-muted/20 px-4 py-3"><p className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">Descripción</p></div><div className="p-4"><p className="whitespace-pre-line text-sm leading-7 text-foreground">{description || 'Sin descripción registrada.'}</p>{activity.resources?.length ? <div className="mt-5"><p className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">Recursos</p><div className="mt-2 flex flex-wrap gap-2">{activity.resources.map((resource) => <span key={resource} className="rounded-lg border border-border bg-muted/20 px-2.5 py-1.5 text-xs font-bold">{resource}</span>)}</div></div> : null}</div></section>
      <aside className="space-y-3"><div className="grid grid-cols-2 gap-2"><MiniStat label="Valor" value={`${activity.maxScore} pts`} /><MiniStat label="Obtenido" value={record ? `${record.score} pts` : '—'} /><MiniStat label="Fecha" value={formatDate(activity.date)} /><MiniStat label="Modalidad" value={activity.activityType === 'group' ? 'Grupal' : 'Individual'} /></div><div className={cn('rounded-2xl border p-4', accent.soft, accent.border)}><p className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">Instrumento</p><p className={cn('mt-1 text-sm font-black', accent.text)}>{instrumentLabel(activity.instrumentType)}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Puedes consultar el instrumento aunque la actividad todavía no haya sido evaluada.</p><Button className="mt-4 w-full" variant="outline" disabled={!activity.instrumentType || !activity.instrumentCriteria || Object.keys(activity.instrumentCriteria).length === 0} onClick={onInstrument}><Eye className="size-4" /> Ver instrumento</Button></div></aside>
    </div>
  </section>
}

function InstrumentPreviewModal({ activity, onClose }: { activity: GradingActivity; onClose: () => void }) {
  const blockIndex = Math.max(0, competencyBlocks.findIndex((item) => item.id === activity.competencyBlockId))
  const accent = blockAccents[blockIndex] ?? blockAccents[0]
  const fields = activity.instrumentCriteria ?? {}
  const type = activity.instrumentType ?? ''
  const title = fields[`${type}:title`] || `${instrumentLabel(type)} para ${activity.name}`
  return <Modal title="Vista previa del instrumento" onClose={onClose} hideHeader className="max-h-[92vh] max-w-[94vw] rounded-2xl">
    <div className="flex max-h-[92vh] flex-col"><div className="h-1.5 shrink-0" style={{ background: accent.gradient }} /><header className="flex shrink-0 items-start justify-between gap-4 border-b border-border bg-card px-6 py-4"><div><p className={cn('text-[10px] font-black uppercase tracking-[0.15em]', accent.text)}>Vista previa · Solo lectura</p><h3 className="mt-1 text-xl font-black">{title}</h3><p className="mt-1 text-sm text-muted-foreground">Actividad: {activity.name} · {activity.maxScore} puntos</p></div><Button variant="ghost" size="icon" aria-label="Cerrar" onClick={onClose}><X className="size-5" /></Button></header><div className="min-h-0 flex-1 overflow-auto bg-muted/10 p-6"><ReadOnlyInstrument type={type} fields={fields} maxScore={activity.maxScore} accent={accent} /></div><footer className="flex shrink-0 justify-end border-t border-border bg-card px-6 py-4"><Button onClick={onClose}>Cerrar</Button></footer></div>
  </Modal>
}

function ReadOnlyInstrument({ type, fields, maxScore, accent }: { type: string; fields: Record<string, string>; maxScore: number; accent: (typeof blockAccents)[number] }) {
  const criterionEntries = Object.entries(fields).filter(([key, value]) => key.startsWith(`${type}:criterion:`) && value.trim())
  const indexes = [...new Set(criterionEntries.map(([key]) => Number(key.split(':')[2])).filter(Number.isFinite))].sort((a, b) => a - b)
  if (!type || !indexes.length) return <EmptyState compact title="Instrumento sin contenido" description="No hay criterios guardados para mostrar." />
  if (type === 'rubrica') {
    const levelCount = Number(fields['rubrica:meta:levelCount']) || inferLevels(fields, 'rubrica') || 4
    const levels = Array.from({ length: levelCount }, (_, index) => levelCount - index)
    return <div className="space-y-3"><InstrumentTable><thead><tr><th className="border border-border bg-slate-50 px-3 py-3">Criterios</th>{levels.map((level, index) => { const visual = rubricVisual(index, levels.length); return <th key={level} className="border px-3 py-3 text-center" style={{ backgroundColor: visual.background, borderColor: visual.border, color: visual.foreground }}><span className="block font-black">{fields[fieldKey(type, 'level-name', level)] || `Nivel ${level}`}</span><span className="text-[10px] font-bold opacity-80">{fields[fieldKey(type, 'level-points', level)] || level} pts</span></th> })}<th className="border border-border bg-slate-50 px-3 py-3 text-center">Valor</th></tr></thead><tbody>{indexes.map((index) => <tr key={index}><td className="border border-border bg-card px-3 py-4 font-black">{fields[fieldKey(type, 'criterion', index)]}</td>{levels.map((level) => <td key={level} className="border border-border bg-card px-3 py-4 leading-5 text-muted-foreground">{fields[fieldKey(type, 'descriptor', index, level)] || '—'}</td>)}<td className="border border-border bg-card px-3 py-4 text-center font-black">{fields[fieldKey(type, 'points', index)] || '—'} pts</td></tr>)}</tbody></InstrumentTable><p className={cn('text-right text-sm font-black', accent.text)}>Puntuación máxima: {maxScore} pts</p></div>
  }
  if (type === 'lista-cotejo') {
    const hasNa = fields['lista-cotejo:meta:noApply'] === 'true'
    const options = [fields['lista-cotejo:meta:yesLabel'] || 'Sí', fields['lista-cotejo:meta:noLabel'] || 'No', ...(hasNa ? [fields['lista-cotejo:meta:naLabel'] || 'No aplica'] : [])]
    return <div className="space-y-3"><InstrumentTable><thead><tr><th className={cn('border px-3 py-3', accent.soft, accent.border, accent.text)}>Criterios</th>{options.map((label, index) => <th key={label} className={cn('border px-3 py-3 text-center', index === 0 ? 'border-emerald-300 bg-emerald-100 text-emerald-800' : index === 1 ? 'border-red-300 bg-red-100 text-red-700' : 'border-amber-300 bg-amber-100 text-amber-800')}>{label}</th>)}<th className={cn('border px-3 py-3 text-center', accent.soft, accent.border, accent.text)}>Valor</th></tr></thead><tbody>{indexes.map((index) => <tr key={index}><td className="border border-border px-3 py-4 font-black">{fields[fieldKey(type, 'criterion', index)]}</td>{options.map((label, optionIndex) => <td key={label} className={cn('border text-center', optionIndex === 0 ? 'border-emerald-200 bg-emerald-50/50' : optionIndex === 1 ? 'border-red-200 bg-red-50/50' : 'border-amber-200 bg-amber-50/50')}><span className="mx-auto block size-4 rounded border-2 border-current bg-card opacity-60" /></td>)}<td className={cn('border px-3 py-4 text-center font-black', accent.soft, accent.border, accent.text)}>{fields[fieldKey(type, 'points', index)] || 0} pts</td></tr>)}</tbody></InstrumentTable><p className={cn('text-right text-sm font-black', accent.text)}>Puntuación máxima: {maxScore} pts</p></div>
  }
  if (type === 'escala') {
    const levelCount = Number(fields['escala:meta:levelCount']) || inferLevels(fields, 'escala') || 4
    const levels = Array.from({ length: levelCount }, (_, index) => levelCount - index)
    return <div className="space-y-3"><InstrumentTable><thead><tr><th className={cn('border px-3 py-3', accent.soft, accent.border, accent.text)}>Indicadores</th>{levels.map((level, index) => { const visual = rubricVisual(index, levels.length); return <th key={level} className="border px-3 py-3 text-center" style={{ backgroundColor: visual.background, borderColor: visual.border, color: visual.foreground }}>{fields[fieldKey(type, 'level-name', level)] || `Nivel ${level}`}<span className="block text-[10px]">{fields[fieldKey(type, 'level-points', level)] || level} pts</span></th> })}<th className={cn('border px-3 py-3 text-center', accent.soft, accent.border, accent.text)}>Máximo</th></tr></thead><tbody>{indexes.map((index) => <tr key={index}><td className="border border-border px-3 py-4 font-black">{fields[fieldKey(type, 'criterion', index)]}</td>{levels.map((level) => <td key={level} className="border border-border bg-card text-center"><span className="mx-auto block size-4 rounded-full border-2 border-slate-300" /></td>)}<td className={cn('border px-3 py-4 text-center font-black', accent.soft, accent.border, accent.text)}>{fields[fieldKey(type, 'points', index)] || 0} pts</td></tr>)}</tbody></InstrumentTable><p className={cn('text-right text-sm font-black', accent.text)}>Puntuación máxima: {maxScore} pts</p></div>
  }
  const hasPartial = fields['lista-ponderada:meta:partial'] !== 'false'
  return <div className="space-y-3"><InstrumentTable><thead><tr><th className={cn('border px-3 py-3', accent.soft, accent.border)}>Criterio</th><th className={cn('border px-3 py-3', accent.soft, accent.border)}>Indicador observable</th><th className={cn('border px-3 py-3 text-center', accent.soft, accent.border)}>Ponderación</th><th className="border border-emerald-200 bg-emerald-50 px-3 py-3 text-center text-emerald-700">Sí</th>{hasPartial ? <th className="border border-amber-200 bg-amber-50 px-3 py-3 text-center text-amber-700">Parcial</th> : null}<th className="border border-red-200 bg-red-50 px-3 py-3 text-center text-red-700">No</th></tr></thead><tbody>{indexes.map((index) => <tr key={index}><td className="border border-border px-3 py-4 font-black">{fields[fieldKey(type, 'criterion', index)]}</td><td className="border border-border px-3 py-4 text-muted-foreground">{fields[fieldKey(type, 'indicator', index)] || '—'}</td><td className="border border-border px-3 py-4 text-center font-black">{fields[fieldKey(type, 'weight', index)] || 0}%</td><td className="border border-emerald-200 bg-emerald-50/40 text-center"><span className="mx-auto block size-4 rounded-full border-2 border-emerald-500" /></td>{hasPartial ? <td className="border border-amber-200 bg-amber-50/40 text-center"><span className="mx-auto block size-4 rounded-full border-2 border-amber-500" /></td> : null}<td className="border border-red-200 bg-red-50/40 text-center"><span className="mx-auto block size-4 rounded-full border-2 border-red-400" /></td></tr>)}</tbody></InstrumentTable><p className={cn('text-right text-sm font-black', accent.text)}>Puntuación máxima: {maxScore} pts</p></div>
}

function InstrumentTable({ children }: { children: ReactNode }) { return <div className="overflow-x-auto rounded-xl border border-border bg-card"><table className="w-full min-w-[48rem] border-collapse text-sm">{children}</table></div> }
function Metric({ label, value, helper }: { label: string; value: string; helper: string }) { return <div className="rounded-2xl border border-border bg-card p-4"><p className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-black text-foreground">{value}</p><p className="mt-1 text-xs text-muted-foreground">{helper}</p></div> }
function GradeTile({ label, value, emphasized }: { label: string; value: number | null; emphasized?: boolean }) { return <div className={cn('rounded-2xl border p-3 text-center', emphasized ? 'border-primary/20 bg-primary/[0.045]' : 'border-border bg-muted/20')}><span className="block text-[10px] font-black text-muted-foreground">{label}</span><strong className={cn('mt-1 block text-xl', emphasized ? 'text-primary' : 'text-foreground')}>{value ?? '—'}</strong></div> }
function MiniStat({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-border bg-card p-3"><p className="text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground">{label}</p><p className="mt-1 text-sm font-black">{value}</p></div> }
function GradeStateBadge({ state }: { state: CompactGradeRow['status'] }) { return <Badge tone={state === 'Calificado' ? 'success' : state === 'En proceso' ? 'warning' : 'muted'}>{state}</Badge> }
function cleanDescription(value?: string) { if (!value) return ''; return value.replace(/<br\s*\/?\s*>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<\/h[1-6]>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\n{3,}/g, '\n\n').trim() }
function formatDate(value?: string) { if (!value) return 'Sin fecha'; const date = new Date(value); return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' }) }
function instrumentLabel(value?: string) { return ({ rubrica: 'Rúbrica de evaluación', 'lista-cotejo': 'Lista de cotejo', escala: 'Escala estimativa', 'lista-ponderada': 'Lista ponderada' } as Record<string, string>)[value ?? ''] ?? value ?? 'Sin instrumento' }
function fieldKey(type: string, field: string, index?: number, level?: number) { return [type, field, index, level].filter((value) => value !== undefined).join(':') }
function inferLevels(fields: Record<string, string>, type: string) { const found = Object.keys(fields).filter((key) => key.startsWith(`${type}:level-name:`)).map((key) => Number(key.split(':').pop())).filter(Number.isFinite); return found.length ? Math.max(...found) : 0 }
const rubricPalette = [
  { background: '#059669', border: '#047857', foreground: '#fff' }, { background: '#22b87a', border: '#10a369', foreground: '#fff' }, { background: '#72cf78', border: '#4fbd65', foreground: '#123524' }, { background: '#c7df72', border: '#aacb52', foreground: '#334019' }, { background: '#f6c453', border: '#e9a92c', foreground: '#51350b' }, { background: '#f59e0b', border: '#df8305', foreground: '#4a2703' },
]
function rubricVisual(index: number, count: number) { const paletteIndex = count <= 1 ? 0 : Math.round(index * (rubricPalette.length - 1) / (count - 1)); return rubricPalette[Math.min(rubricPalette.length - 1, Math.max(0, paletteIndex))] }
