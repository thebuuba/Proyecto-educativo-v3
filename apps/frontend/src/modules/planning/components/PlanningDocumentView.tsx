import { Download, FileText, Printer, X } from 'lucide-react'
import { useRef } from 'react'

import { Button } from '@/components/ui/Button'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import type { PlanningDay, PlanningEntryWithDetails } from '@/modules/planning/types'
import {
  exportPlanningToPdf,
  exportPlanningToWord,
} from '@/modules/planning/utils/planningDocumentExport'

type PlanningDocumentViewProps = {
  entry: PlanningEntryWithDetails
  onClose: () => void
}

const planningTypeLabels = {
  DAILY: 'Planificación diaria',
  UNIT: 'Unidad de aprendizaje',
  SEQUENCE: 'Secuencia didáctica',
} as const

function formatDate(value?: string | null) {
  if (!value) return 'Pendiente'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-DO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function planningRows(entry: PlanningEntryWithDetails): PlanningDay[] {
  if (entry.activities?.days?.length) return entry.activities.days
  return [{
    day: 1,
    date: entry.plannedDate,
    inicio: entry.activities?.inicio ?? '',
    desarrollo: entry.activities?.desarrollo ?? '',
    cierre: entry.activities?.cierre ?? '',
    evidence: entry.evidence,
    evaluationMethod: entry.evaluationMethod,
    evaluationInstruments: entry.evaluationInstruments,
    metacognition: entry.activities?.metacognition,
    resources: entry.resources,
  }]
}

export function PlanningDocumentView({ entry, onClose }: PlanningDocumentViewProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const course = `${entry.gradeName} ${entry.sectionName}`.trim()
  const rows = planningRows(entry)

  useFocusTrap({ ref: dialogRef, active: true, onEscape: onClose })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/45 px-3 py-4 sm:px-4 sm:py-6">
      <div ref={dialogRef} className="flex max-h-[94vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-xl">
        <div className="flex shrink-0 flex-col gap-3 border-b border-border bg-card px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Vista documental</p>
            <h3 className="mt-1 text-base font-extrabold text-foreground">{entry.title}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => exportPlanningToPdf(entry)}><Printer className="size-4" />PDF</Button>
            <Button variant="outline" size="sm" onClick={() => exportPlanningToWord(entry)}><Download className="size-4" />Word</Button>
            <button type="button" className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Cerrar vista documento" onClick={onClose}><X className="size-5" /></button>
          </div>
        </div>

        <div className="overflow-y-auto bg-muted/35 p-3 sm:p-5">
          <article className="mx-auto max-w-[1180px] overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <header className="flex flex-col gap-4 bg-primary px-5 py-5 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/15"><FileText className="size-5" /></span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary-foreground/75">Planificación docente</p>
                  <h1 className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">{entry.title}</h1>
                </div>
              </div>
              <div className="text-left text-xs leading-5 text-primary-foreground/80 sm:text-right">
                <p className="font-bold text-primary-foreground">{entry.schoolNameSnapshot || entry.schoolName || 'AulaBase'}</p>
                <p>{planningTypeLabels[entry.planningType ?? 'DAILY']}</p>
              </div>
            </header>

            <div className="p-4 sm:p-6">
              <DocumentBand title="Datos generales" />
              <div className="grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-4">
                <InfoCell label="Docente" value={entry.teacherNameSnapshot || entry.teacherName || 'Docente'} />
                <InfoCell label="Área / asignatura" value={`${entry.curricularArea || entry.subjectName} · ${entry.subjectName}`} />
                <InfoCell label="Grado y sección" value={course || 'Pendiente'} />
                <InfoCell label="Período" value={`${entry.periodName} · ${entry.schoolYearName || 'Año activo'}`} />
                <InfoCell label="Tema" value={entry.topic || entry.title} />
                <InfoCell label="Fecha" value={formatDate(entry.plannedDate)} />
                <InfoCell label="Duración" value={entry.planningType && entry.planningType !== 'DAILY' ? `${entry.durationDays ?? rows.length} días · ${entry.durationMinutes ?? '—'} min.` : `${entry.durationMinutes ?? '—'} minutos`} />
                <InfoCell label="Eje transversal" value={entry.transversalAxis || 'No especificado'} />
              </div>

              <DocumentBand title="Articulación curricular" className="mt-5" />
              <div className="grid border-l border-t border-border lg:grid-cols-3">
                <CurriculumCell title="Competencias fundamentales" value={entry.fundamentalCompetencies?.join('\n') || entry.fundamentalCompetenceName} />
                <CurriculumCell title="Competencias específicas" value={entry.specificCompetence} />
                <CurriculumCell title="Indicadores de logro" value={entry.achievementIndicator} />
                <CurriculumCell title="Contenidos conceptuales" value={entry.contentConceptual} />
                <CurriculumCell title="Contenidos procedimentales" value={entry.contentProcedural} />
                <CurriculumCell title="Actitudes y valores" value={entry.contentAttitudinal} />
              </div>

              <div className="mt-5 grid border-l border-t border-border lg:grid-cols-2">
                <CurriculumCell title="Situación de aprendizaje" value={entry.activities?.learningSituation || entry.topic || entry.evidence} />
                <CurriculumCell title="Estrategia de enseñanza y aprendizaje" value={entry.strategies} />
              </div>

              <DocumentBand title="Secuencia didáctica" className="mt-5" />
              <div className="overflow-x-auto border-x border-b border-border">
                <table className="w-full min-w-[1040px] table-fixed border-collapse text-left text-[11px] leading-[1.45] text-foreground">
                  <thead className="bg-primary/[0.07] text-[10px] uppercase tracking-[0.08em] text-primary">
                    <tr>
                      <th className="w-[10%] border-r border-border p-2.5">Fecha</th>
                      <th className="w-[34%] border-r border-border p-2.5">Actividades de aprendizaje</th>
                      <th className="w-[14%] border-r border-border p-2.5">Evidencias</th>
                      <th className="w-[16%] border-r border-border p-2.5">Evaluación</th>
                      <th className="w-[13%] border-r border-border p-2.5">Metacognición</th>
                      <th className="w-[13%] p-2.5">Recursos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((day) => <SequenceRow key={day.day} day={day} entry={entry} />)}
                  </tbody>
                </table>
              </div>

              <footer className="mt-4 flex flex-col gap-1 border-t border-border pt-3 text-[10px] leading-4 text-muted-foreground sm:flex-row sm:justify-between">
                <p>Fuente curricular: MINERD {entry.curriculumVersion || 'currículo vigente'} · {entry.curriculumOrdinance || 'normativa aplicable'}{entry.curriculumSourcePages ? ` · páginas ${entry.curriculumSourcePages}` : ''}</p>
                <p>Generada en AulaBase · {formatDate(entry.updatedAt)}</p>
              </footer>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}

function DocumentBand({ title, className = '' }: { title: string; className?: string }) {
  return <h2 className={`bg-primary px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-primary-foreground ${className}`}>{title}</h2>
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return <div className="border-b border-r border-border p-3"><span className="block text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</span><span className="mt-1 block text-xs font-bold leading-5 text-foreground">{value}</span></div>
}

function CurriculumCell({ title, value }: { title: string; value?: string | null }) {
  return <section className="border-b border-r border-border p-3"><h3 className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-primary">{title}</h3><p className="mt-1.5 whitespace-pre-line text-[11px] leading-5 text-foreground">{value || 'Pendiente'}</p></section>
}

function SequenceRow({ day, entry }: { day: PlanningDay; entry: PlanningEntryWithDetails }) {
  return (
    <tr className="align-top odd:bg-card even:bg-muted/20">
      <td className="border-r border-t border-border p-2.5 font-bold"><span className="block text-primary">Día {day.day}</span><span className="mt-1 block font-normal text-muted-foreground">{formatDate(day.date)}</span></td>
      <td className="border-r border-t border-border p-2.5"><ActivityMoment label="Inicio" value={day.inicio} /><ActivityMoment label="Desarrollo" value={day.desarrollo} /><ActivityMoment label="Cierre" value={day.cierre} /></td>
      <td className="whitespace-pre-line border-r border-t border-border p-2.5">{day.evidence || entry.evidence || 'Pendiente'}</td>
      <td className="border-r border-t border-border p-2.5"><strong className="text-primary">Técnica</strong><p className="mt-1 whitespace-pre-line">{day.evaluationMethod || entry.evaluationMethod || 'Pendiente'}</p><strong className="mt-2 block text-primary">Instrumento</strong><p className="mt-1 whitespace-pre-line">{day.evaluationInstruments || entry.evaluationInstruments || 'Pendiente'}</p></td>
      <td className="whitespace-pre-line border-r border-t border-border p-2.5">{day.metacognition || day.cierre || 'Pendiente'}</td>
      <td className="whitespace-pre-line border-t border-border p-2.5">{day.resources || entry.resources || 'Pendiente'}</td>
    </tr>
  )
}

function ActivityMoment({ label, value }: { label: string; value?: string | null }) {
  return <div className="mb-2 last:mb-0"><strong className="text-primary">{label}:</strong><span className="ml-1 whitespace-pre-line">{value || 'Pendiente'}</span></div>
}
