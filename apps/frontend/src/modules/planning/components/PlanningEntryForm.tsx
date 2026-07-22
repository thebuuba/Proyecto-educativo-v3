import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ClipboardList,
  FileCheck2,
  Link2,
  School,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react'
import type { FormEvent, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { addWeekdays } from '@aula/shared'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { getEvaluationActivities } from '@/modules/grading/services/gradingService'
import {
  findCurriculumSubject,
  secondaryGradeFromCourse,
  secondaryGradeFromName,
} from '@/modules/competency-matrix/data/secondaryCurriculumCatalog'
import {
  curriculumFieldsAreEmpty,
  curriculumFieldsMatch,
  currentMinerdPolicyContext,
  getSecondaryCurriculumContent,
  secondaryCurriculumSource,
} from '@/modules/competency-matrix/data/secondaryCurriculumContent'
import type { SecondaryCurriculumContent } from '@/modules/competency-matrix/data/secondaryCurriculumContent'
import type { GradingActivity } from '@/modules/grading/types'
import { generatePlanningEntry } from '@/modules/planning/services/planningService'
import type {
  AcademicPeriodSummary,
  CompetencyOption,
  CreatePlanningEntryInput,
  GeneratedPlanningEntry,
  PlanningDay,
  PlanningType,
} from '@/modules/planning/types'
import {
  curriculumPromptExcerpt,
  quickPlanningValidationError,
} from '@/modules/planning/utils/quickPlanningValidation'
import { cn } from '@/utils/cn'

type PlanningEntryFormProps = {
  sectionSubjects: { id: string; subjectName: string; sectionName: string; gradeName: string; level?: string }[]
  periods: AcademicPeriodSummary[]
  competencies: CompetencyOption[]
  schoolName?: string
  initial?: {
    entry: CreatePlanningEntryInput & { id?: string }
    sectionSubjectId?: string
    academicPeriodId?: string
  }
  submitting: boolean
  error: string | null
  curriculumReference?: { grade: string; subjectId: string }
  onSubmit: (input: CreatePlanningEntryInput) => Promise<void>
  onClose: () => void
}

const steps = [
  { number: 1, title: 'Enfoque de la clase', description: 'Curso, tema y tiempo', icon: School },
  { number: 2, title: 'Desarrollo', description: 'Actividades y evidencia', icon: ClipboardList },
  { number: 3, title: 'Revisar y guardar', description: 'Currículo y detalles', icon: BookOpen },
] as const

const transversalAxes = [
  'Salud y Bienestar',
  'Desarrollo Sostenible',
  'Desarrollo Personal y Profesional',
  'Alfabetización Imprescindible',
  'Ciudadanía y Convivencia',
]

const planningTypeLabels: Record<PlanningType, string> = {
  DAILY: 'Planificación diaria',
  UNIT: 'Unidad de aprendizaje',
  SEQUENCE: 'Secuencia didáctica',
}

function curricularAreaFor(subjectName: string) {
  const name = subjectName.toLowerCase()
  if (name.includes('matem')) return 'Matemática'
  if (name.includes('lengua española')) return 'Lengua Española'
  if (name.includes('inglés') || name.includes('francés') || name.includes('lengua moderna')) return 'Lenguas Extranjeras'
  if (name.includes('biolog') || name.includes('quím') || name.includes('físic') || name.includes('naturaleza') || name.includes('tierra') || name.includes('vida')) return 'Ciencias de la Naturaleza'
  if (name.includes('social') || name.includes('historia') || name.includes('geograf')) return 'Ciencias Sociales'
  if (name.includes('art')) return 'Educación Artística'
  if (name.includes('educación física') || name.includes('deporte')) return 'Educación Física'
  if (name.includes('relig') || name.includes('humana')) return 'Formación Integral Humana y Religiosa'
  return 'Otras áreas curriculares'
}

function educationLevelFor(gradeName: string, explicitLevel?: string) {
  if (explicitLevel) return explicitLevel.toLowerCase().includes('prim') ? 'Primaria' : explicitLevel.toLowerCase().includes('sec') ? 'Secundaria' : explicitLevel
  const name = gradeName.toLowerCase()
  if (name.includes('prim')) return 'Primaria'
  if (name.includes('sec') || /[1-6](ro|do|to|mo|er|\.º)/.test(name)) return 'Secundaria'
  return 'Nivel no especificado'
}

function courseKeyFor(item: { gradeName: string; sectionName: string; level?: string }) {
  return `${educationLevelFor(item.gradeName, item.level)}::${item.gradeName}::${item.sectionName}`
}

export function PlanningEntryForm({
  sectionSubjects,
  periods,
  competencies,
  schoolName,
  initial,
  submitting,
  error,
  curriculumReference,
  onSubmit,
  onClose,
}: PlanningEntryFormProps) {
  const { appUser } = useAuth()
  const initialSectionSubjectId = initial?.sectionSubjectId ?? initial?.entry.sectionSubjectId ?? ''
  const initialSectionSubject = sectionSubjects.find((item) => item.id === initialSectionSubjectId)
  const [step, setStep] = useState(1)
  const [sectionSubjectId, setSectionSubjectId] = useState(initialSectionSubjectId)
  const [academicPeriodId, setAcademicPeriodId] = useState(initial?.academicPeriodId ?? initial?.entry.academicPeriodId ?? '')
  const [fundamentalCompetenceId, setFundamentalCompetenceId] = useState(initial?.entry.fundamentalCompetenceId ?? '')
  const [fundamentalCompetencies, setFundamentalCompetencies] = useState<string[]>(initial?.entry.fundamentalCompetencies ?? [])
  const [title, setTitle] = useState(initial?.entry.title ?? '')
  const [planningType, setPlanningType] = useState<PlanningType>(initial?.entry.planningType ?? 'DAILY')
  const [durationDays, setDurationDays] = useState(String(initial?.entry.durationDays ?? 1))
  const [topic, setTopic] = useState(initial?.entry.topic ?? '')
  const [schoolNameValue, setSchoolNameValue] = useState(initial?.entry.schoolNameSnapshot ?? schoolName ?? '')
  const [teacherName, setTeacherName] = useState(initial?.entry.teacherNameSnapshot ?? appUser?.fullName ?? '')
  const [curricularArea, setCurricularArea] = useState(initial?.entry.curricularArea ?? (initialSectionSubject ? curricularAreaFor(initialSectionSubject.subjectName) : ''))
  const [transversalAxis, setTransversalAxis] = useState(initial?.entry.transversalAxis ?? '')
  const [specificCompetence, setSpecificCompetence] = useState(initial?.entry.specificCompetence ?? '')
  const [achievementIndicator, setAchievementIndicator] = useState(initial?.entry.achievementIndicator ?? '')
  const [contentConceptual, setContentConceptual] = useState(initial?.entry.contentConceptual ?? '')
  const [contentProcedural, setContentProcedural] = useState(initial?.entry.contentProcedural ?? '')
  const [contentAttitudinal, setContentAttitudinal] = useState(initial?.entry.contentAttitudinal ?? '')
  const [strategies, setStrategies] = useState(initial?.entry.strategies ?? '')
  const [inicio, setInicio] = useState(initial?.entry.activities?.inicio ?? '')
  const [desarrollo, setDesarrollo] = useState(initial?.entry.activities?.desarrollo ?? '')
  const [cierre, setCierre] = useState(initial?.entry.activities?.cierre ?? '')
  const [days, setDays] = useState<PlanningDay[]>(initial?.entry.activities?.days ?? [])
  const [resources, setResources] = useState(initial?.entry.resources ?? '')
  const [evaluationMethod, setEvaluationMethod] = useState(initial?.entry.evaluationMethod ?? '')
  const [evidence, setEvidence] = useState(initial?.entry.evidence ?? '')
  const [evaluationInstruments, setEvaluationInstruments] = useState(initial?.entry.evaluationInstruments ?? '')
  const [duration, setDuration] = useState(initial?.entry.durationMinutes?.toString() ?? '')
  const [plannedDate, setPlannedDate] = useState(initial?.entry.plannedDate ?? '')
  const [validationError, setValidationError] = useState('')
  const [generating, setGenerating] = useState(false)
  const [alignmentWarning, setAlignmentWarning] = useState('')
  const [alignmentConfirmed, setAlignmentConfirmed] = useState(false)
  const [availableActivities, setAvailableActivities] = useState<GradingActivity[]>([])
  const [linkedActivityIds, setLinkedActivityIds] = useState<string[]>(initial?.entry.linkedActivityIds ?? [])
  const lastAppliedCurriculum = useRef<SecondaryCurriculumContent | null>(null)

  const selectedSectionSubject = sectionSubjects.find((item) => item.id === sectionSubjectId)
  const courseOptions = Array.from(new Map(sectionSubjects.map((item) => [courseKeyFor(item), { key: courseKeyFor(item), gradeName: item.gradeName, sectionName: item.sectionName, level: item.level }])).values())
  const [courseKey, setCourseKey] = useState(selectedSectionSubject ? courseKeyFor(selectedSectionSubject) : '')
  const subjectOptions = sectionSubjects.filter((item) => !courseKey || courseKeyFor(item) === courseKey)
  const selectedPeriod = periods.find((period) => period.id === academicPeriodId)
  const referencedGrade = curriculumReference ? secondaryGradeFromName(curriculumReference.grade) : null
  const curriculumGrade = selectedSectionSubject
    ? secondaryGradeFromCourse(
        selectedSectionSubject.gradeName,
        educationLevelFor(selectedSectionSubject.gradeName, selectedSectionSubject.level),
      )
    : referencedGrade
  const preferredCurriculumId = curriculumGrade === referencedGrade ? curriculumReference?.subjectId : undefined
  const curriculumSubject = curriculumGrade && selectedSectionSubject
    ? findCurriculumSubject(curriculumGrade, selectedSectionSubject.subjectName, preferredCurriculumId)
    : curriculumGrade && curriculumReference
      ? findCurriculumSubject(curriculumGrade, '', curriculumReference.subjectId)
      : null
  const curriculumContent = curriculumGrade && curriculumSubject
    ? getSecondaryCurriculumContent(curriculumGrade, curriculumSubject.id)
    : null

  useEffect(() => {
    if (planningType === 'DAILY') return
    const count = Math.min(30, Math.max(1, Number(durationDays) || 1))
    setDays((current) => Array.from({ length: count }, (_, index) => current[index] ?? {
      day: index + 1,
      inicio: '',
      desarrollo: '',
      cierre: '',
      evidence: '',
      evaluationMethod: '',
    }).map((day, index) => ({ ...day, day: index + 1 })))
  }, [durationDays, planningType])

  useEffect(() => {
    setAlignmentWarning('')
    setAlignmentConfirmed(false)
  }, [sectionSubjectId, topic])

  useEffect(() => {
    if (!selectedPeriod) return
    const startDate = selectedPeriod.startDate.slice(0, 10)
    const endDate = selectedPeriod.endDate.slice(0, 10)
    if (!plannedDate || plannedDate < startDate || plannedDate > endDate) {
      setPlannedDate(startDate)
      setValidationError('')
    }
  }, [plannedDate, selectedPeriod])

  function applyOfficialCurriculum(source = curriculumContent) {
    if (!source) return

    const officialNames = source.fundamentalCompetencies.map((name) => name.toLowerCase())
    const matchingCompetencies = competencies.filter((option) => {
      const optionName = option.name.toLowerCase()
      return officialNames.some((name) => name.includes(optionName) || optionName.includes(name))
    })

    setFundamentalCompetencies(
      matchingCompetencies.length
        ? matchingCompetencies.map((option) => option.name)
        : source.fundamentalCompetencies,
    )
    setFundamentalCompetenceId(matchingCompetencies[0]?.id ?? '')
    setSpecificCompetence(source.specificCompetence)
    setContentConceptual(source.contentConceptual)
    setContentProcedural(source.contentProcedural)
    setContentAttitudinal(source.contentAttitudinal)
    setAchievementIndicator(source.achievementIndicator)
    lastAppliedCurriculum.current = source
  }

  useEffect(() => {
    if (!curriculumContent || initial?.entry.id) return

    const fields = {
      specificCompetence,
      contentConceptual,
      contentProcedural,
      contentAttitudinal,
      achievementIndicator,
    }
    const previous = lastAppliedCurriculum.current
    const canReplace = curriculumFieldsAreEmpty(fields)
      || Boolean(previous && curriculumFieldsMatch(fields, previous))

    if (canReplace) {
      const officialNames = curriculumContent.fundamentalCompetencies.map((name) => name.toLowerCase())
      const matchingCompetencies = competencies.filter((option) => {
        const optionName = option.name.toLowerCase()
        return officialNames.some((name) => name.includes(optionName) || optionName.includes(name))
      })
      setFundamentalCompetencies(matchingCompetencies.length ? matchingCompetencies.map((option) => option.name) : curriculumContent.fundamentalCompetencies)
      setFundamentalCompetenceId(matchingCompetencies[0]?.id ?? '')
      setSpecificCompetence(curriculumContent.specificCompetence)
      setContentConceptual(curriculumContent.contentConceptual)
      setContentProcedural(curriculumContent.contentProcedural)
      setContentAttitudinal(curriculumContent.contentAttitudinal)
      setAchievementIndicator(curriculumContent.achievementIndicator)
      lastAppliedCurriculum.current = curriculumContent
    }
  }, [
    achievementIndicator,
    competencies,
    contentAttitudinal,
    contentConceptual,
    contentProcedural,
    curriculumContent,
    initial?.entry.id,
    specificCompetence,
  ])

  useEffect(() => {
    let ignore = false
    if (!sectionSubjectId || !academicPeriodId) {
      setAvailableActivities([])
      return
    }
    getEvaluationActivities(sectionSubjectId, academicPeriodId)
      .then((items) => { if (!ignore) setAvailableActivities(items) })
      .catch(() => { if (!ignore) setAvailableActivities([]) })
    return () => { ignore = true }
  }, [academicPeriodId, sectionSubjectId])

  function buildInput(): CreatePlanningEntryInput {
    const sourcePages = curriculumContent?.sourcePages
    const plannedDays = planningType === 'DAILY' ? undefined : days.map((day, index) => ({
      ...day,
      day: index + 1,
      date: plannedDate ? addWeekdays(plannedDate, index) : null,
    }))
    const summarizeDays = (field: 'inicio' | 'desarrollo' | 'cierre') => plannedDays
      ?.map((day) => `Día ${day.day}: ${day[field]}`)
      .join('\n\n') ?? ''
    return {
      sectionSubjectId,
      academicPeriodId,
      fundamentalCompetenceId: fundamentalCompetenceId || null,
      fundamentalCompetencies,
      title: title.trim() || topic.trim(),
      planningType,
      durationDays: planningType === 'DAILY' ? 1 : Number(durationDays),
      schoolNameSnapshot: schoolNameValue.trim() || null,
      teacherNameSnapshot: teacherName.trim() || null,
      curricularArea: curricularArea || null,
      educationLevel: selectedSectionSubject ? educationLevelFor(selectedSectionSubject.gradeName, selectedSectionSubject.level) : null,
      topic: topic.trim() || null,
      transversalAxis: transversalAxis || null,
      curriculumVersion: curriculumContent ? secondaryCurriculumSource.version : initial?.entry.curriculumVersion ?? null,
      curriculumOrdinance: curriculumContent ? secondaryCurriculumSource.ordinance : initial?.entry.curriculumOrdinance ?? null,
      curriculumSourcePages: sourcePages ? `${sourcePages.start}-${sourcePages.end}` : initial?.entry.curriculumSourcePages ?? null,
      specificCompetence,
      achievementIndicator,
      contentConceptual,
      contentProcedural,
      contentAttitudinal,
      strategies,
      activities: planningType === 'DAILY'
        ? { inicio, desarrollo, cierre }
        : {
            inicio: summarizeDays('inicio'),
            desarrollo: summarizeDays('desarrollo'),
            cierre: summarizeDays('cierre'),
            days: plannedDays,
          },
      resources,
      evaluationMethod: evaluationMethod.trim() || evidence.trim(),
      evidence,
      evaluationInstruments,
      durationMinutes: duration ? Number(duration) : null,
      plannedDate: plannedDate || null,
      linkedActivityIds,
    }
  }

  function validateStep(targetStep: number) {
    setValidationError('')
    return quickPlanningValidationError(targetStep, {
      courseKey, sectionSubjectId, academicPeriodId, plannedDate, topic, duration,
      planningType, durationDays, days,
      periodStartDate: selectedPeriod?.startDate.slice(0, 10),
      periodEndDate: selectedPeriod?.endDate.slice(0, 10),
      inicio, desarrollo, cierre, evidence, fundamentalCompetencies,
      specificCompetence, achievementIndicator, contentConceptual,
      contentProcedural, contentAttitudinal,
    })
  }

  async function goNext() {
    const message = validateStep(step)
    if (message) {
      setValidationError(message)
      return
    }
    setStep((current) => Math.min(3, current + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (alignmentWarning && !alignmentConfirmed) {
      setValidationError('Confirma que deseas continuar con el tema señalado antes de guardar.')
      return
    }
    const message = validateStep(3)
    if (message) {
      setValidationError(message)
      const curriculumError = message.includes('curriculares') || message.includes('competencia') || message.includes('indicadores')
      const activitiesError = message.includes('iniciarás') || message.includes('actividad principal')
        || message.includes('cerrarás') || message.includes('estudiantes')
        || message.includes('actividades') || message.includes('evaluación') || message.includes('días')
      setStep(curriculumError ? 3 : activitiesError ? 2 : 1)
      return
    }
    await onSubmit(buildInput())
  }

  function applyActivitySuggestion(draft: GeneratedPlanningEntry) {
    if (!title.trim()) setTitle(draft.title)
    setStrategies(draft.strategies)
    setInicio(draft.activities.inicio)
    setDesarrollo(draft.activities.desarrollo)
    setCierre(draft.activities.cierre)
    if (planningType !== 'DAILY' && draft.activities.days) {
      setDays(draft.activities.days.map((day, index) => ({
        ...day,
        day: index + 1,
        date: plannedDate ? addWeekdays(plannedDate, index) : null,
      })))
    }
    setResources(draft.resources)
    setEvaluationMethod(draft.evaluationMethod)
    setEvidence(draft.evidence)
    setEvaluationInstruments(draft.evaluationInstruments)
  }

  async function requestDraft() {
    if (!sectionSubjectId) throw new Error('Selecciona un área curricular y una asignatura para generar la planificación.')
    const competence = competencies.find((item) => item.id === fundamentalCompetenceId)
    return generatePlanningEntry({
      sectionSubjectId,
      planningType,
      durationDays: planningType === 'DAILY' ? 1 : Number(durationDays),
      title,
      topic: topic.trim(),
      curricularArea,
      educationLevel: selectedSectionSubject ? educationLevelFor(selectedSectionSubject.gradeName, selectedSectionSubject.level) : undefined,
      transversalAxis,
      curricularPolicyContext: currentMinerdPolicyContext,
      durationMinutes: duration ? Number(duration) : null,
      specificCompetence: curriculumPromptExcerpt(specificCompetence),
      achievementIndicator: curriculumPromptExcerpt(achievementIndicator),
      contentConceptual: curriculumPromptExcerpt(contentConceptual),
      contentProcedural: curriculumPromptExcerpt(contentProcedural),
      contentAttitudinal: curriculumPromptExcerpt(contentAttitudinal),
      subjectName: selectedSectionSubject?.subjectName,
      sectionName: selectedSectionSubject?.sectionName,
      gradeName: selectedSectionSubject?.gradeName,
      fundamentalCompetenceName: competence?.name,
    })
  }

  async function handleGenerate() {
    setValidationError('')
    setGenerating(true)
    try {
      const draft = await requestDraft()
      applyActivitySuggestion(draft)
      setAlignmentWarning(draft.alignmentWarning ?? '')
      setAlignmentConfirmed(false)
      if (draft.alignmentWarning) setValidationError(`Revisa la coherencia curricular: ${draft.alignmentWarning}`)
    }
    catch (caught) { setValidationError(caught instanceof Error ? caught.message : 'No se pudo generar la planificación.') }
    finally { setGenerating(false) }
  }

  const ActiveStepIcon = steps[step - 1]?.icon ?? School

  return (
    <form className="mx-auto w-full max-w-[1440px] space-y-5 pb-4" onSubmit={handleSubmit}>
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <button type="button" className="font-medium text-primary hover:underline" onClick={onClose}>Planificaciones</button>
            <span>›</span><span>{initial?.entry.id ? 'Editar planificación' : 'Nueva planificación'}</span>
          </div>
          <h1 className="mt-3 text-2xl font-extrabold tracking-[-0.025em] text-primary sm:text-[28px]">{initial?.entry.id ? 'Editar planificación' : 'Crear planificación'}</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">Tú defines la clase; el sistema completa la información curricular y administrativa.</p>
        </div>
        <Button type="button" variant="outline" size="sm" className="w-fit" onClick={onClose}><ArrowLeft className="size-4" />Volver</Button>
      </header>

      <nav className="grid gap-1 rounded-2xl border border-border bg-card p-1.5 shadow-sm md:grid-cols-3" aria-label="Pasos de la planificación">
        {steps.map((item) => {
          const Icon = item.icon
          const active = step === item.number
          const complete = step > item.number
          return (
            <button key={item.number} type="button" className={cn('flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-[color,background-color,box-shadow,transform] duration-150 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20 sm:px-4', active ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'hover:bg-muted/70')} onClick={() => setStep(item.number)} aria-current={active ? 'step' : undefined}>
              <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl font-black', active ? 'bg-primary-foreground/15 text-primary-foreground' : complete ? 'bg-primary-light text-primary' : 'bg-muted text-muted-foreground')}>
                {complete ? <Check className="size-4" /> : <Icon className="size-4" />}
              </span>
              <span className="min-w-0"><span className="block text-[10px] font-bold uppercase tracking-[0.14em] opacity-70">Parte {item.number}</span><span className="block truncate text-sm font-extrabold sm:text-base">{item.title}</span><span className="hidden truncate text-xs opacity-70 sm:block">{item.description}</span></span>
            </button>
          )
        })}
      </nav>

      {validationError || error ? <div className="flex gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" /><p>{validationError || error}</p></div> : null}

      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-4 border-b border-border bg-primary/[0.035] px-5 py-5 sm:px-7">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20"><ActiveStepIcon className="size-5" /></span>
          <div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary/70">Parte {step} de 3</p><h2 className="mt-0.5 text-xl font-extrabold tracking-tight text-foreground">{steps[step - 1]?.title}</h2></div>
        </div>

        {step === 1 ? <div className="grid gap-x-6 gap-y-5 p-5 sm:p-7 md:grid-cols-2">
          <div className="md:col-span-2 rounded-2xl bg-primary-light/70 p-4 text-sm leading-6 text-primary">
            <p className="font-extrabold">Completa solo las decisiones esenciales.</p>
            <p className="text-primary/80">El centro, docente, período, área, competencias, contenidos e indicadores se incorporan automáticamente.</p>
          </div>
          <div className="md:col-span-2"><Field label="Tipo de planificación" required><Select value={planningType} onChange={(event) => setPlanningType(event.target.value as PlanningType)}><option value="DAILY">Planificación diaria</option><option value="UNIT">Unidad de aprendizaje</option><option value="SEQUENCE">Secuencia didáctica</option></Select></Field></div>
          <Field label="Curso" required><Select value={courseKey} onChange={(event) => { setCourseKey(event.target.value); setSectionSubjectId(''); setCurricularArea('') }}><option value="">Selecciona...</option><optgroup label="Primaria">{courseOptions.filter((item) => educationLevelFor(item.gradeName, item.level) === 'Primaria').map((item) => <option key={item.key} value={item.key}>{item.gradeName} {item.sectionName}</option>)}</optgroup><optgroup label="Secundaria">{courseOptions.filter((item) => educationLevelFor(item.gradeName, item.level) === 'Secundaria').map((item) => <option key={item.key} value={item.key}>{item.gradeName} {item.sectionName}</option>)}</optgroup></Select></Field>
          <Field label="Asignatura" required><Select value={sectionSubjectId} disabled={!courseKey} onChange={(event) => { const value = event.target.value; setSectionSubjectId(value); const subject = sectionSubjects.find((item) => item.id === value); setCurricularArea(subject ? curricularAreaFor(subject.subjectName) : '') }}><option value="">{courseKey ? 'Selecciona...' : 'Selecciona primero el curso'}</option>{subjectOptions.map((item) => <option key={item.id} value={item.id}>{item.subjectName}</option>)}</Select></Field>
          <div className="md:col-span-2"><Field label="Tema o propósito de la clase" required><Input value={topic} placeholder="Ej.: La célula y sus funciones" onChange={(event) => setTopic(event.target.value)} /></Field></div>
          <Field label="Fecha" required><Input type="date" min={selectedPeriod?.startDate.slice(0, 10)} max={selectedPeriod?.endDate.slice(0, 10)} value={plannedDate} onChange={(event) => setPlannedDate(event.target.value)} /></Field>
          <Field label="Duración total (minutos)" required><Input type="number" min={1} value={duration} onChange={(event) => setDuration(event.target.value)} placeholder="Ej.: 90" /></Field>
          {planningType !== 'DAILY' ? <Field label="Cantidad de días" required><Input type="number" min={1} max={30} value={durationDays} onChange={(event) => setDurationDays(event.target.value)} /></Field> : null}
          {!academicPeriodId ? <div className="md:col-span-2"><Field label="Período académico" required><Select value={academicPeriodId} onChange={(event) => setAcademicPeriodId(event.target.value)}><option value="">Selecciona...</option>{periods.map((period) => <option key={period.id} value={period.id}>{period.name}</option>)}</Select></Field></div> : null}
          <div className="md:col-span-2 grid gap-3 rounded-2xl border border-border bg-muted/40 p-4 text-sm sm:grid-cols-3">
            <AutoContext label="Centro" value={schoolNameValue || 'Se completará automáticamente'} />
            <AutoContext label="Docente" value={teacherName || 'Se completará automáticamente'} />
            <AutoContext label="Período" value={selectedPeriod?.name || 'Se completará automáticamente'} />
          </div>
          <div className="md:col-span-2 flex flex-col gap-1 rounded-2xl border border-border bg-card p-4 text-xs leading-5 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>Calendario 2026–2027 aprobado: el centro conserva sus períodos configurables e incorpora un banco de recuperación de dos semanas cuando MINERD publique la versión final.</span>
            <a className="shrink-0 font-bold text-primary hover:underline" href="https://minerd.gob.do/comunicaciones/noticias/consejo-nacional-de-educacion-aprueba-calendario-escolar-2026-2027-y-oficializa-estrategia-nacional-de-competencias-digitales" target="_blank" rel="noreferrer">Ver comunicado</a>
          </div>
        </div> : null}

        {step === 2 ? <div className="grid gap-5 p-5 sm:p-7">
          <div className="flex flex-col gap-3 rounded-2xl bg-primary-light/70 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="font-extrabold text-primary">Describe la experiencia de aprendizaje</p><p className="mt-0.5 text-xs leading-5 text-primary/75">Puedes escribirla directamente o usar “Completar con IA” como punto de partida editable.</p></div>
            <Button type="button" variant="outline" size="sm" disabled={generating || submitting} loading={generating} onClick={handleGenerate}><Sparkles className="size-4" />Sugerir actividades</Button>
          </div>
          {alignmentWarning ? <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"><p className="font-extrabold">Revisa la coherencia del tema</p><p className="mt-1 leading-6">{alignmentWarning}</p><label className="mt-3 flex cursor-pointer items-start gap-2 font-bold"><input type="checkbox" className="mt-0.5 size-4 accent-primary" checked={alignmentConfirmed} onChange={(event) => setAlignmentConfirmed(event.target.checked)} /><span>Confirmo que este tema corresponde a la asignatura seleccionada.</span></label></div> : null}
          {planningType === 'DAILY' ? <div className="grid gap-4 lg:grid-cols-3">
            <MomentField title="Inicio" hint="Motivación, saberes previos y propósito" value={inicio} onChange={setInicio} />
            <MomentField title="Desarrollo" hint="Actividad principal y construcción del aprendizaje" value={desarrollo} onChange={setDesarrollo} />
            <MomentField title="Cierre" hint="Síntesis, reflexión y retroalimentación" value={cierre} onChange={setCierre} />
          </div> : <div className="grid gap-4">{days.map((day, index) => <PlanningDayField key={day.day} day={day} date={plannedDate ? addWeekdays(plannedDate, index) : ''} onChange={(field, value) => setDays((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item))} />)}</div>}
          <Field label="¿Cómo demostrarán los estudiantes lo aprendido?" required><Textarea rows={4} value={evidence} onChange={(event) => setEvidence(event.target.value)} placeholder="Ej.: Elaborarán un modelo de la célula y explicarán la función de sus partes mediante una lista de cotejo." /></Field>
        </div> : null}

        {step === 3 ? <div className="grid gap-5 p-5 sm:p-7">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
            <ReviewItem label="Tipo" value={planningTypeLabels[planningType]} />
            <ReviewItem label="Curso y asignatura" value={selectedSectionSubject ? `${selectedSectionSubject.gradeName} ${selectedSectionSubject.sectionName} · ${selectedSectionSubject.subjectName}` : 'Sin seleccionar'} />
            <ReviewItem label="Tema" value={topic || 'Sin tema'} />
            <ReviewItem label="Fecha" value={plannedDate || 'Sin fecha'} />
            <ReviewItem label="Duración" value={duration ? planningType === 'DAILY' ? `${duration} minutos` : `${durationDays} días · ${duration} minutos` : 'Sin duración'} />
          </div>
          {curriculumGrade && curriculumSubject ? (
            <div className="flex flex-col gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div>
                <p className="flex items-center gap-2 text-sm font-bold text-foreground"><FileCheck2 className="size-4 text-primary" />Malla oficial vinculada</p>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                  {curriculumSubject.courseNames?.[curriculumGrade] || curriculumSubject.subject} · {curriculumGrade}.º de Secundaria · páginas {curriculumContent?.sourcePages.start}-{curriculumContent?.sourcePages.end}
                </p>
                {curriculumContent ? <p className="mt-1 text-xs font-medium text-primary">MINERD {secondaryCurriculumSource.version} · {secondaryCurriculumSource.ordinance}. Competencias, contenidos e indicadores cargados desde el PDF oficial.</p> : null}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                {curriculumContent ? <button type="button" className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20" onClick={() => applyOfficialCurriculum()}>Recargar datos oficiales</button> : null}
                <a
                  href={`/matriz?${new URLSearchParams({ grado: String(curriculumGrade), malla: curriculumSubject.id }).toString()}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-bold text-foreground shadow-sm transition hover:bg-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
                >
                  Consultar fuente
                  <ArrowUpRight className="size-4" />
                </a>
              </div>
            </div>
          ) : null}
          <div className="rounded-2xl border border-primary/15 bg-primary/[0.035] p-4 sm:p-5">
            <p className="text-sm font-extrabold text-foreground">Enfoques nacionales incorporados en las sugerencias</p>
            <div className="mt-3 grid gap-2 text-xs leading-5 text-muted-foreground md:grid-cols-2">
              <p className="rounded-xl border border-border bg-card p-3"><span className="block font-bold text-primary">Moral, Cívica y Ética Ciudadana</span>Aplicación transversal conforme a la Ordenanza 02-2025, sin agregar otra asignatura ni carga horaria.</p>
              <p className="rounded-xl border border-border bg-card p-3"><span className="block font-bold text-primary">Competencias digitales e IA</span>Pensamiento computacional, ciudadanía digital y uso ético de la IA, integrados cuando sean pertinentes.</p>
            </div>
          </div>
          <details className="group overflow-hidden rounded-2xl border border-border bg-card">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-muted/45 px-4 py-4 font-extrabold text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-ring/20 sm:px-5"><span>Revisar datos curriculares oficiales</span><span className="text-xs font-bold text-primary group-open:hidden">Mostrar</span><span className="hidden text-xs font-bold text-primary group-open:inline">Ocultar</span></summary>
            <div className="grid gap-5 border-t border-border p-4 sm:p-5">
              <Field label="Competencias fundamentales" required><div className="grid gap-2 rounded-2xl bg-muted/55 p-2 md:grid-cols-2">{competencies.map((item) => { const checked = fundamentalCompetencies.includes(item.name); return <label key={item.id} className={cn('flex cursor-pointer items-start gap-2 rounded-xl border bg-card p-3 text-sm transition-[border-color,background-color,box-shadow] duration-150', checked ? 'border-primary/35 bg-primary/5 shadow-sm' : 'border-border hover:border-primary/20')}><input type="checkbox" className="mt-0.5 size-4 accent-primary" checked={checked} onChange={(event) => { setFundamentalCompetencies((current) => event.target.checked ? [...current, item.name] : current.filter((name) => name !== item.name)); if (event.target.checked && !fundamentalCompetenceId) setFundamentalCompetenceId(item.id); if (!event.target.checked && fundamentalCompetenceId === item.id) setFundamentalCompetenceId('') }} /><span>{item.name}</span></label> })}</div></Field>
              <Field label="Competencias específicas" required><Textarea rows={5} value={specificCompetence} onChange={(event) => setSpecificCompetence(event.target.value)} /></Field>
              <div className="grid gap-4 lg:grid-cols-3"><Field label="Contenidos conceptuales"><Textarea rows={6} value={contentConceptual} onChange={(event) => setContentConceptual(event.target.value)} /></Field><Field label="Contenidos procedimentales"><Textarea rows={6} value={contentProcedural} onChange={(event) => setContentProcedural(event.target.value)} /></Field><Field label="Contenidos actitudinales"><Textarea rows={6} value={contentAttitudinal} onChange={(event) => setContentAttitudinal(event.target.value)} /></Field></div>
              <Field label="Indicadores de logro" required><Textarea rows={5} value={achievementIndicator} onChange={(event) => setAchievementIndicator(event.target.value)} /></Field>
            </div>
          </details>
          <details className="group overflow-hidden rounded-2xl border border-border bg-card">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-muted/45 px-4 py-4 font-extrabold text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-ring/20 sm:px-5"><span>Opciones adicionales</span><span className="text-xs font-bold text-primary group-open:hidden">Mostrar</span><span className="hidden text-xs font-bold text-primary group-open:inline">Ocultar</span></summary>
            <div className="grid gap-4 border-t border-border p-4 sm:grid-cols-2 sm:p-5">
              <Field label="Título de la planificación"><Input value={title} placeholder={topic || 'Título'} onChange={(event) => setTitle(event.target.value)} /></Field>
              <Field label="Eje transversal"><Select value={transversalAxis} onChange={(event) => setTransversalAxis(event.target.value)}><option value="">Sin especificar</option>{transversalAxes.map((axis) => <option key={axis} value={axis}>{axis}</option>)}</Select></Field>
              <Field label="Centro educativo"><Input value={schoolNameValue} onChange={(event) => setSchoolNameValue(event.target.value)} /></Field>
              <Field label="Nombre del docente"><Input value={teacherName} onChange={(event) => setTeacherName(event.target.value)} /></Field>
              <Field label="Período académico"><Select value={academicPeriodId} onChange={(event) => setAcademicPeriodId(event.target.value)}>{periods.map((period) => <option key={period.id} value={period.id}>{period.name}</option>)}</Select></Field>
              <Field label="Estrategias"><Textarea rows={3} value={strategies} onChange={(event) => setStrategies(event.target.value)} /></Field>
              <Field label="Recursos"><Textarea rows={3} value={resources} onChange={(event) => setResources(event.target.value)} /></Field>
              <Field label="Evaluación"><Textarea rows={3} value={evaluationMethod} onChange={(event) => setEvaluationMethod(event.target.value)} placeholder={evidence} /></Field>
              <Field label="Instrumentos"><Textarea rows={3} value={evaluationInstruments} onChange={(event) => setEvaluationInstruments(event.target.value)} placeholder="Rúbrica, lista de cotejo, portafolio..." /></Field>
              <div className="sm:col-span-2 rounded-xl border border-border bg-muted/20 p-4"><div className="flex items-center justify-between gap-3"><div><h3 className="flex items-center gap-2 font-extrabold"><Link2 className="size-4 text-primary" />Actividades evaluativas vinculadas</h3><p className="mt-1 text-xs text-muted-foreground">Selecciona actividades existentes para integrarlas a esta planificación.</p></div><span className="text-xs font-bold text-primary">{linkedActivityIds.length} seleccionada{linkedActivityIds.length === 1 ? '' : 's'}</span></div><div className="mt-3 grid gap-2">{availableActivities.length ? availableActivities.map((activity) => <label key={activity.id} className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-3"><input type="checkbox" className="mt-1 size-4 accent-primary" checked={linkedActivityIds.includes(activity.id)} onChange={(event) => setLinkedActivityIds((current) => event.target.checked ? [...new Set([...current, activity.id])] : current.filter((id) => id !== activity.id))} /><span><span className="block text-sm font-bold">{activity.name}</span><span className="text-xs text-muted-foreground">{activity.maxScore} puntos · {activity.planningMoment || 'Sin momento'}</span></span></label>) : <p className="rounded-lg border border-dashed border-border bg-card p-3 text-sm text-muted-foreground">No hay actividades disponibles para el curso y período seleccionados.</p>}</div></div>
            </div>
          </details>
        </div> : null}
      </section>

      <footer className="sticky bottom-3 z-20 flex flex-col-reverse gap-3 rounded-2xl border border-border bg-card/95 p-3 shadow-[0_16px_40px_-24px_rgba(30,79,143,.45)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="grid gap-2 sm:flex"><Button type="button" variant="outline" onClick={step === 1 ? onClose : () => setStep((current) => current - 1)}><ArrowLeft className="size-4" />{step === 1 ? 'Cancelar' : 'Anterior'}</Button></div>
        <div className="grid gap-2 sm:flex">{step < 3 ? <Button type="button" onClick={goNext}>Continuar<ArrowRight className="size-4" /></Button> : <Button type="submit" disabled={submitting || generating} loading={submitting}><Check className="size-4" />Guardar planificación</Button>}</div>
      </footer>
    </form>
  )
}

function Field({ children, label, required = false }: { children: ReactNode; label: string; required?: boolean }) {
  return <label className="grid gap-2 text-[13px] font-bold text-foreground"><span>{label}{required ? <span className="text-destructive"> *</span> : null}</span>{children}</label>
}

function AutoContext({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</p><p className="mt-1 truncate font-bold text-foreground" title={value}>{value}</p></div>
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 bg-card p-4"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</p><p className="mt-1 line-clamp-2 text-sm font-extrabold text-foreground" title={value}>{value}</p></div>
}

function MomentField({ title, hint, value, onChange }: { title: string; hint: string; value: string; onChange: (value: string) => void }) {
  return <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"><div className="border-b border-border bg-primary/[0.045] px-4 py-3"><h3 className="font-extrabold text-primary">{title}</h3><p className="mt-0.5 text-xs leading-5 text-muted-foreground">{hint}</p></div><Textarea className="min-h-48 resize-y rounded-none border-0 shadow-none focus:ring-0" value={value} onChange={(event) => onChange(event.target.value)} placeholder={`Describe las actividades de ${title.toLowerCase()}...`} /></div>
}

function PlanningDayField({ day, date, onChange }: {
  day: PlanningDay
  date: string
  onChange: (field: 'inicio' | 'desarrollo' | 'cierre' | 'evidence' | 'evaluationMethod', value: string) => void
}) {
  return <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"><header className="flex items-center justify-between gap-3 border-b border-border bg-primary/[0.045] px-4 py-3"><h3 className="font-extrabold text-primary">Día {day.day}</h3><span className="text-xs font-bold text-muted-foreground">{date || 'Fecha pendiente'}</span></header><div className="grid gap-4 p-4 lg:grid-cols-3"><Field label="Inicio" required><Textarea rows={4} value={day.inicio} onChange={(event) => onChange('inicio', event.target.value)} /></Field><Field label="Desarrollo" required><Textarea rows={4} value={day.desarrollo} onChange={(event) => onChange('desarrollo', event.target.value)} /></Field><Field label="Cierre" required><Textarea rows={4} value={day.cierre} onChange={(event) => onChange('cierre', event.target.value)} /></Field><Field label="Evidencia" required><Textarea rows={3} value={day.evidence} onChange={(event) => onChange('evidence', event.target.value)} /></Field><div className="lg:col-span-2"><Field label="Evaluación" required><Textarea rows={3} value={day.evaluationMethod} onChange={(event) => onChange('evaluationMethod', event.target.value)} /></Field></div></div></section>
}
