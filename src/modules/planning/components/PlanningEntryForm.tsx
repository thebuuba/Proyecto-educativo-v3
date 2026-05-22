import { AlertCircle, X } from 'lucide-react'
import type { FormEvent } from 'react'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import type { AcademicPeriodSummary } from '@/modules/planning/types'
import type { CreatePlanningEntryInput } from '@/modules/planning/types'

type PlanningEntryFormProps = {
  sectionSubjects: { id: string; subjectName: string; sectionName: string; gradeName: string }[]
  periods: AcademicPeriodSummary[]
  initial?: {
    entry: CreatePlanningEntryInput & { id?: string }
    sectionSubjectId?: string
    academicPeriodId?: string
  }
  submitting: boolean
  error: string | null
  onSubmit: (input: CreatePlanningEntryInput) => Promise<void>
  onClose: () => void
}

export function PlanningEntryForm({
  sectionSubjects,
  periods,
  initial,
  submitting,
  error,
  onSubmit,
  onClose,
}: PlanningEntryFormProps) {
  const [sectionSubjectId, setSectionSubjectId] = useState(
    initial?.sectionSubjectId ?? initial?.entry.sectionSubjectId ?? '',
  )
  const [academicPeriodId, setAcademicPeriodId] = useState(
    initial?.academicPeriodId ?? initial?.entry.academicPeriodId ?? '',
  )
  const [title, setTitle] = useState(initial?.entry.title ?? '')
  const [specificCompetence, setSpecificCompetence] = useState(
    initial?.entry.specificCompetence ?? '',
  )
  const [achievementIndicator, setAchievementIndicator] = useState(
    initial?.entry.achievementIndicator ?? '',
  )
  const [contentConceptual, setContentConceptual] = useState(
    initial?.entry.contentConceptual ?? '',
  )
  const [contentProcedural, setContentProcedural] = useState(
    initial?.entry.contentProcedural ?? '',
  )
  const [contentAttitudinal, setContentAttitudinal] = useState(
    initial?.entry.contentAttitudinal ?? '',
  )
  const [strategies, setStrategies] = useState(initial?.entry.strategies ?? '')
  const [inicio, setInicio] = useState(initial?.entry.activities?.inicio ?? '')
  const [desarrollo, setDesarrollo] = useState(
    initial?.entry.activities?.desarrollo ?? '',
  )
  const [cierre, setCierre] = useState(initial?.entry.activities?.cierre ?? '')
  const [resources, setResources] = useState(initial?.entry.resources ?? '')
  const [evaluationMethod, setEvaluationMethod] = useState(
    initial?.entry.evaluationMethod ?? '',
  )
  const [duration, setDuration] = useState(
    initial?.entry.durationMinutes?.toString() ?? '',
  )
  const [plannedDate, setPlannedDate] = useState(
    initial?.entry.plannedDate ?? '',
  )
  const [validationError, setValidationError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setValidationError('')

    if (!sectionSubjectId) {
      setValidationError('Selecciona un curso y materia.')
      return
    }

    if (!academicPeriodId) {
      setValidationError('Selecciona un período académico.')
      return
    }

    if (!title.trim()) {
      setValidationError('El título de la planificación es requerido.')
      return
    }

    await onSubmit({
      sectionSubjectId,
      academicPeriodId,
      title: title.trim(),
      specificCompetence,
      achievementIndicator,
      contentConceptual,
      contentProcedural,
      contentAttitudinal,
      strategies,
      activities: { inicio, desarrollo, cierre },
      resources,
      evaluationMethod,
      durationMinutes: duration ? Number(duration) : null,
      plannedDate: plannedDate || null,
    })
  }

  const dialogRef = useRef<HTMLDivElement>(null)
  useFocusTrap({ ref: dialogRef, active: true, onEscape: onClose })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/45 px-4 py-6">
      <div
        ref={dialogRef}
        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              {initial?.entry.id ? 'Editar planificación' : 'Nueva planificación'}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Planificación curricular siguiendo el modelo MINERD por competencias.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Cerrar formulario"
            onClick={onClose}
          >
            <X className="size-5" />
          </button>
        </div>

        <form
          className="flex-1 overflow-y-auto space-y-5 p-5"
          onSubmit={handleSubmit}
        >
          {validationError || error ? (
            <div className="flex gap-3 rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>{validationError || error}</p>
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Curso / Materia">
              <Select
                value={sectionSubjectId}
                onChange={(e) => setSectionSubjectId(e.target.value)}
              >
                <option value="">Selecciona...</option>
                {sectionSubjects.map((ss) => (
                  <option key={ss.id} value={ss.id}>
                    {ss.gradeName} {ss.sectionName} — {ss.subjectName}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Período académico">
              <Select
                value={academicPeriodId}
                onChange={(e) => setAcademicPeriodId(e.target.value)}
              >
                <option value="">Selecciona...</option>
                {periods.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Título de la planificación">
            <Input
              type="text"
              placeholder="Ej: Unidad I: Los números naturales"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Competencia específica">
              <Textarea
                placeholder="Competencia(s) a desarrollar"
                value={specificCompetence}
                onChange={(e) => setSpecificCompetence(e.target.value)}
                rows={3}
              />
            </Field>

            <Field label="Indicador de logro">
              <Textarea
                placeholder="¿Qué evidencias demostrarán el aprendizaje?"
                value={achievementIndicator}
                onChange={(e) => setAchievementIndicator(e.target.value)}
                rows={3}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Contenidos conceptuales">
              <Textarea
                placeholder="Conceptos, datos, hechos"
                value={contentConceptual}
                onChange={(e) => setContentConceptual(e.target.value)}
                rows={3}
              />
            </Field>

            <Field label="Contenidos procedimentales">
              <Textarea
                placeholder="Procedimientos, técnicas, métodos"
                value={contentProcedural}
                onChange={(e) => setContentProcedural(e.target.value)}
                rows={3}
              />
            </Field>

            <Field label="Contenidos actitudinales">
              <Textarea
                placeholder="Actitudes, valores, normas"
                value={contentAttitudinal}
                onChange={(e) => setContentAttitudinal(e.target.value)}
                rows={3}
              />
            </Field>
          </div>

          <Field label="Estrategias de enseñanza y aprendizaje">
            <Textarea
              placeholder="Estrategias metodológicas (ej: aprendizaje basado en problemas, trabajo colaborativo...)"
              value={strategies}
              onChange={(e) => setStrategies(e.target.value)}
              rows={2}
            />
          </Field>

          <div className="rounded-lg border border-border p-4">
            <p className="mb-3 text-xs font-medium uppercase text-muted-foreground">
              Momentos de la clase
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Inicio">
                <Textarea
                  placeholder="Activación de conocimientos previos, exploración, motivación"
                  value={inicio}
                  onChange={(e) => setInicio(e.target.value)}
                  rows={4}
                />
              </Field>

              <Field label="Desarrollo">
                <Textarea
                  placeholder="Construcción del aprendizaje, actividades principales"
                  value={desarrollo}
                  onChange={(e) => setDesarrollo(e.target.value)}
                  rows={4}
                />
              </Field>

              <Field label="Cierre">
                <Textarea
                  placeholder="Síntesis, reflexión, retroalimentación"
                  value={cierre}
                  onChange={(e) => setCierre(e.target.value)}
                  rows={4}
                />
              </Field>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Recursos">
              <Textarea
                placeholder="Materiales, tecnología, espacios"
                value={resources}
                onChange={(e) => setResources(e.target.value)}
                rows={2}
              />
            </Field>

            <Field label="Evaluación">
              <Textarea
                placeholder="Instrumentos y criterios de evaluación"
                value={evaluationMethod}
                onChange={(e) => setEvaluationMethod(e.target.value)}
                rows={2}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Duración (minutos)">
              <Input
                type="number"
                min={1}
                placeholder="Ej: 90"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </Field>

            <Field label="Fecha planificada">
              <Input
                type="date"
                value={plannedDate}
                onChange={(e) => setPlannedDate(e.target.value)}
              />
            </Field>
          </div>

          <div className="flex justify-end gap-3 border-t border-border pt-5">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting} loading={submitting}>
              {submitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-muted-foreground">
      {label}
      <span className="mt-2 block">{children}</span>
    </label>
  )
}
