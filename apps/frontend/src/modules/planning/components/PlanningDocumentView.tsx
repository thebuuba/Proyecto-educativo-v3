import { Download, FileText, Printer, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useRef } from 'react'

import { Button } from '@/components/ui/Button'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import type { PlanningEntryWithDetails } from '@/modules/planning/types'
import {
  exportPlanningToPdf,
  exportPlanningToWord,
} from '@/modules/planning/utils/planningDocumentExport'

type PlanningDocumentViewProps = {
  entry: PlanningEntryWithDetails
  onClose: () => void
}

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

function Section({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <section className="border-t border-border pt-4">
      <h4 className="text-sm font-bold text-primary">{title}</h4>
      <div className="mt-2 whitespace-pre-line text-sm leading-6 text-foreground">
        {children || 'Pendiente'}
      </div>
    </section>
  )
}

export function PlanningDocumentView({ entry, onClose }: PlanningDocumentViewProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const course = `${entry.gradeName} ${entry.sectionName}`.trim()

  useFocusTrap({ ref: dialogRef, active: true, onEscape: onClose })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/45 px-4 py-6">
      <div
        ref={dialogRef}
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-border bg-background shadow-xl"
      >
        <div className="flex shrink-0 flex-col gap-3 border-b border-border bg-card px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
              Vista documento
            </p>
            <h3 className="mt-1 text-lg font-semibold text-foreground">
              {entry.title}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => exportPlanningToPdf(entry)}>
              <Printer className="size-4" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportPlanningToWord(entry)}>
              <Download className="size-4" />
              Word
            </Button>
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Cerrar vista documento"
              onClick={onClose}
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto bg-muted/35 p-4 sm:p-6">
          <article className="mx-auto max-w-4xl rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
            <header className="border-b-4 border-primary pb-5">
              <div className="flex items-start gap-3">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <FileText className="size-5" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
                    Planificación docente
                  </p>
                  <h1 className="mt-2 text-2xl font-bold text-primary">
                    {entry.title}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {entry.subjectName} · {course} · {entry.periodName}
                  </p>
                </div>
              </div>
            </header>

            <div className="my-6 grid gap-3 sm:grid-cols-2">
              <Meta label="Centro educativo" value={entry.schoolName || 'AulaBase'} />
              <Meta label="Docente" value={entry.teacherName || 'Docente'} />
              <Meta label="Grado y sección" value={course || 'Pendiente'} />
              <Meta label="Asignatura" value={entry.subjectName || 'Pendiente'} />
              <Meta label="Fecha" value={formatDate(entry.plannedDate)} />
              <Meta
                label="Duración"
                value={entry.durationMinutes ? `${entry.durationMinutes} minutos` : 'Pendiente'}
              />
              <Meta label="Período" value={entry.periodName || 'Pendiente'} />
              <Meta label="Año escolar" value={entry.schoolYearName || 'Activo'} />
              <Meta label="Creada" value={formatDate(entry.createdAt)} />
              <Meta label="Última modificación" value={formatDate(entry.updatedAt)} />
            </div>

            <div className="space-y-4">
              <Section title="Competencias">
                {entry.specificCompetence || entry.fundamentalCompetenceName}
              </Section>
              <Section title="Contenidos conceptuales">{entry.contentConceptual}</Section>
              <Section title="Contenidos procedimentales">{entry.contentProcedural}</Section>
              <Section title="Actitudes y valores">{entry.contentAttitudinal}</Section>
              <Section title="Indicadores de logro">{entry.achievementIndicator}</Section>
              <Section title="Intención pedagógica">{entry.evidence}</Section>
              <Section title="Estrategia de enseñanza">{entry.strategies}</Section>

              <section className="border-t border-border pt-4">
                <h4 className="text-sm font-bold text-primary">Momentos de clase</h4>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <Moment title="Inicio" value={entry.activities?.inicio} />
                  <Moment title="Desarrollo" value={entry.activities?.desarrollo} />
                  <Moment title="Cierre" value={entry.activities?.cierre} />
                </div>
              </section>

              <Section title="Actividades">
                {[entry.activities?.inicio, entry.activities?.desarrollo, entry.activities?.cierre]
                  .filter(Boolean)
                  .join('\n\n')}
              </Section>
              <Section title="Técnicas de evaluación">{entry.evaluationMethod}</Section>
              <Section title="Instrumentos">{entry.evaluationInstruments}</Section>
              <Section title="Recursos">{entry.resources}</Section>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background px-4 py-3">
      <span className="block text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      <span className="mt-1 block text-sm font-semibold text-foreground">{value}</span>
    </div>
  )
}

function Moment({ title, value }: { title: string; value?: string | null }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
        {title}
      </p>
      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-foreground">
        {value || 'Pendiente'}
      </p>
    </div>
  )
}
