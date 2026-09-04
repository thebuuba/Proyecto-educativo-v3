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
import { useEffect, useMemo, useRef, useState } from 'react'
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
import { curriculumUnitsFor } from '@/modules/planning/data/secondaryCurriculum'
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
  sectionSubjects: { id: string; subjectName: string; sectionName: string; gradeName: string; level?: string; gradeSequence?: number }[]
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
  onGenerateAndCreate: (input: CreatePlanningEntryInput & {
    subjectName?: string
    sectionName?: string
    gradeName?: string
    fundamentalCompetenceName?: string
  }) => Promise<void>
  onClose: () => void
}

const steps = [
  { number: 1, title: 'Datos generales', description: 'Contexto de la unidad', icon: School },
  { number: 2, title: 'Secuencia curricular', description: 'Competencias y contenidos', icon: BookOpen },
  { number: 3, title: 'Secuencia didáctica', description: 'Desarrollo de la clase', icon: ClipboardList },
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

const courseCollator = new Intl.Collator('es', { numeric: true, sensitivity: 'base' })

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
  onGenerateAndCreate,
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
  const [learningSituation, setLearningSituation] = useState(initial?.entry.activities?.learningSituation ?? '')
  const [inicio, setInicio] = useState(initial?.entry.activities?.inicio ?? '')
  const [desarrollo, setDesarrollo] = useState(initial?.entry.activities?.desarrollo ?? '')
  const [cierre, setCierre] = useState(initial?.entry.activities?.cierre ?? '')
  const [metacognition, setMetacognition] = useState(initial?.entry.activities?.metacognition ?? '')
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
  const courseOptions = useMemo(() => Array.from(
    new Map(sectionSubjects.map((item) => [courseKeyFor(item), {
      key: courseKeyFor(item),
      gradeName: item.gradeName,
      sectionName: item.sectionName,
      level: item.level,
      gradeSequence: item.gradeSequence,
    }])).values(),
  ).sort((left, right) => {
    const levelOrder = (level: string) => level === 'Primaria' ? 0 : level === 'Secundaria' ? 1 : 2
    return levelOrder(educationLevelFor(left.gradeName, left.level))
      - levelOrder(educationLevelFor(right.gradeName, right.level))
      || (left.gradeSequence ?? Number.MAX_SAFE_INTEGER) - (right.gradeSequence ?? Number.MAX_SAFE_INTEGER)
      || courseCollator.compare(left.gradeName, right.gradeName)
      || courseCollator.compare(left.sectionName, right.sectionName)
  }), [sectionSubjects])
  const [courseKey, setCourseKey] = useState(selectedSectionSubject ? courseKeyFor(selectedSectionSubject) : '')
  const courseSubjectOptions = useMemo(
    () => sectionSubjects.filter((item) => !courseKey || courseKeyFor(item) === courseKey),
    [courseKey, sectionSubjects],
  )
  const areaOptions = useMemo(
    () => Array.from(new Set(courseSubjectOptions.map((item) => curricularAreaFor(item.subjectName)))).sort(),
    [courseSubjectOptions],
  )
  const subjectOptions = useMemo(
    () => courseSubjectOptions.filter((item) => !curricularArea || curricularAreaFor(item.subjectName) === curricularArea),
    [courseSubjectOptions, curricularArea],
  )
  const curriculumUnits = selectedSectionSubject
    ? curriculumUnitsFor(
        selectedSectionSubject.gradeName,
        curricularArea,
        selectedSectionSubject.level,
        selectedSectionSubject.subjectName,
      )
    : []
  const selectedCurriculumUnit = curriculumUnits.find((unit) => unit.title === title)
  const topicOptions = selectedCurriculumUnit?.topics ?? []
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
    if (!curricularArea) return
    if (subjectOptions.length === 1 && !sectionSubjectId) {
      setSectionSubjectId(subjectOptions[0]?.id ?? '')
    } else if (sectionSubjectId && !subjectOptions.some((item) => item.id === sectionSubjectId)) {
      setSectionSubjectId('')
      setTitle('')
      setTopic('')
    }
  }, [curricularArea, sectionSubjectId, subjectOptions])

  useEffect(() => {
    if (topicOptions.length === 1 && !topic) setTopic(topicOptions[0] ?? '')
  }, [topic, topicOptions])

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
        ? { learningSituation, inicio, desarrollo, cierre, metacognition }
        : {
            learningSituation,
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
      setStep(curriculumError ? 2 : activitiesError ? 3 : 1)
      return
    }
    await onSubmit(buildInput())
  }

  function applyActivitySuggestion(draft: GeneratedPlanningEntry) {
    if (!title.trim()) setTitle(draft.title)
    setStrategies(draft.strategies)
    setLearningSituation(draft.activities.learningSituation ?? '')
    setInicio(draft.activities.inicio)
    setDesarrollo(draft.activities.desarrollo)
    setCierre(draft.activities.cierre)
    setMetacognition(draft.activities.metacognition ?? '')
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

  async function handleGenerateAndSave() {
    const message = validateStep(1)
    if (message) {
      setValidationError(message)
      setStep(1)
      return
    }
    const competence = competencies.find((item) => item.id === fundamentalCompetenceId)
    setGenerating(true)
    setValidationError('')
    try {
      await onGenerateAndCreate({
        ...buildInput(),
        subjectName: selectedSectionSubject?.subjectName,
        sectionName: selectedSectionSubject?.sectionName,
        gradeName: selectedSectionSubject?.gradeName,
        fundamentalCompetenceName: competence?.name,
      })
    } catch (caught) {
      setValidationError(caught instanceof Error ? caught.message : 'No se pudo generar la planificación.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <form className="mx-auto w-full min-w-0 max-w-[1440px] space-y-5" onSubmit={handleSubmit}>
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <button type="button" className="font-medium text-primary hover:underline" onClick={onClose}>Planificaciones</button>
            <span>›</span><span>{initial?.entry.id ? 'Editar planificación' : 'Nueva planificación'}</span>
          </div>
          <h1 className="mt-3 text-3xl font-black text-foreground">{initial?.entry.id ? 'Editar planificación' : 'Crear planificación'}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Completa las tres partes de la planificación docente.</p>
        </div>
        <Button type="button" variant="outline" onClick={onClose}><ArrowLeft className="size-4" />Volver</Button>
      </header>

      <nav className="grid overflow-hidden rounded-3xl bg-card shadow-sm md:grid-cols-3" aria-label="Pasos de la planificación">
        {steps.map((item) => {
          const Icon = item.icon
          const active = step === item.number
          const complete = step > item.number
          return (
            <button key={item.number} type="button" className={cn('flex items-center gap-3 border-b border-border px-4 py-4 text-left transition last:border-b-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-ring/20 md:border-b-0 md:border-r md:last:border-r-0', active && 'bg-warning/30 text-foreground', !active && 'hover:bg-muted/50')} onClick={() => setStep(item.number)} aria-current={active ? 'step' : undefined}>
              <span className={cn('grid size-10 shrink-0 place-items-center rounded-full border font-black', active ? 'border-warning/60 bg-warning text-warning-foreground' : complete ? 'border-success/35 bg-success/16 text-foreground' : 'border-border bg-muted text-muted-foreground')}>
                {complete ? <Check className="size-5" /> : <Icon className="size-5" />}
              </span>
              <span className="min-w-0"><span className="block text-xs font-bold opacity-75">Parte {item.number}</span><span className="block truncate font-black">{item.title}</span><span className="hidden truncate text-xs opacity-75 sm:block">{item.description}</span></span>
            </button>
          )
        })}
      </nav>

      {validationError || error ? <div className="flex gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" /><p>{validationError || error}</p></div> : null}

      <section className="overflow-hidden rounded-3xl bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4"><p className="inline-flex rounded-full bg-warning/25 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-foreground">Parte {step} de 3</p><h2 className="mt-2 text-xl font-black text-foreground">{steps[step - 1]?.title}</h2></div>

        {step === 1 ? <div className="grid gap-5 p-5 md:grid-cols-2">
          <Field label="Centro educativo"><Input value={schoolNameValue} onChange={(event) => setSchoolNameValue(event.target.value)} placeholder="Nombre del centro educativo" /></Field>
          <Field label="Nombre del docente"><Input value={teacherName} onChange={(event) => setTeacherName(event.target.value)} placeholder="Nombre completo del docente" /></Field>
          <Field label="Curso" required><Select value={courseKey} onChange={(event) => { setCourseKey(event.target.value); setSectionSubjectId(''); setCurricularArea(''); setTitle(''); setTopic('') }}><option value="">Selecciona...</option><optgroup label="Primaria">{courseOptions.filter((item) => educationLevelFor(item.gradeName, item.level) === 'Primaria').map((item) => <option key={item.key} value={item.key}>{item.gradeName} {item.sectionName}</option>)}</optgroup><optgroup label="Secundaria">{courseOptions.filter((item) => educationLevelFor(item.gradeName, item.level) === 'Secundaria').map((item) => <option key={item.key} value={item.key}>{item.gradeName} {item.sectionName}</option>)}</optgroup></Select></Field>
          <Field label="Área curricular" required><Select value={curricularArea} disabled={!courseKey} onChange={(event) => { setCurricularArea(event.target.value); setSectionSubjectId(''); setTitle(''); setTopic('') }}><option value="">{courseKey ? 'Selecciona...' : 'Selecciona primero el curso'}</option>{areaOptions.map((area) => <option key={area} value={area}>{area}</option>)}</Select></Field>
          <div className="md:col-span-2"><Field label="Asignatura" required><Select value={sectionSubjectId} disabled={!courseKey || !curricularArea} onChange={(event) => { setSectionSubjectId(event.target.value); setTitle(''); setTopic('') }}><option value="">{curricularArea ? 'Selecciona...' : 'Selecciona primero el área curricular'}</option>{subjectOptions.map((item) => <option key={item.id} value={item.id}>{item.subjectName}</option>)}</Select></Field></div>
          <Field label="Período académico" required><Select value={academicPeriodId} onChange={(event) => setAcademicPeriodId(event.target.value)}><option value="">Selecciona...</option>{periods.map((period) => <option key={period.id} value={period.id}>{period.name}</option>)}</Select></Field>
          <Field label="Fecha" required><Input type="date" min={selectedPeriod?.startDate.slice(0, 10)} max={selectedPeriod?.endDate.slice(0, 10)} value={plannedDate} onChange={(event) => setPlannedDate(event.target.value)} /></Field>
          <div className="md:col-span-2">{curriculumUnits.length ? <Field label="Unidad de aprendizaje"><Select value={title} onChange={(event) => { setTitle(event.target.value); setTopic('') }}><option value="">Selecciona una unidad...</option>{title && !curriculumUnits.some((unit) => unit.title === title) ? <option value={title}>{title}</option> : null}{curriculumUnits.map((unit) => <option key={unit.title} value={unit.title}>{unit.title}</option>)}</Select><p className="text-xs font-normal text-muted-foreground">Unidades oficiales disponibles para el grado y la asignatura seleccionados.</p></Field> : <Field label="Título de la unidad de aprendizaje"><Input value={title} placeholder="Ej.: El sistema solar y nuestro lugar en el universo" onChange={(event) => setTitle(event.target.value)} /></Field>}</div>
          <div className="md:col-span-2">{curriculumUnits.length ? <Field label="Tema o subtema" required><Select value={topic} disabled={!title} onChange={(event) => setTopic(event.target.value)}><option value="">{title ? 'Selecciona un tema...' : 'Selecciona primero la unidad'}</option>{topic && !topicOptions.includes(topic) ? <option value={topic}>{topic}</option> : null}{topicOptions.map((item) => <option key={item} value={item}>{item}</option>)}</Select><p className="text-xs font-normal text-muted-foreground">Temas vinculados a la unidad curricular seleccionada.</p></Field> : <Field label="Tema" required><Input value={topic} placeholder="Ej.: La célula" onChange={(event) => setTopic(event.target.value)} /></Field>}</div>
          <div className="md:col-span-2"><Field label="Eje transversal"><Select value={transversalAxis} onChange={(event) => setTransversalAxis(event.target.value)}><option value="">Sin especificar</option>{transversalAxes.map((axis) => <option key={axis} value={axis}>{axis}</option>)}</Select></Field></div>
          <Field label="Tipo de planificación" required><Select value={planningType} onChange={(event) => setPlanningType(event.target.value as PlanningType)}><option value="DAILY">Planificación diaria</option><option value="UNIT">Unidad de aprendizaje</option><option value="SEQUENCE">Secuencia didáctica</option></Select></Field>
          <Field label="Duración total (minutos)" required><Input type="number" min={1} value={duration} onChange={(event) => setDuration(event.target.value)} placeholder="Ej.: 90" /></Field>
          {planningType !== 'DAILY' ? <Field label="Cantidad de días" required><Input type="number" min={1} max={30} value={durationDays} onChange={(event) => setDurationDays(event.target.value)} /></Field> : null}
          <div className="md:col-span-2 flex flex-col gap-1 rounded-xl border border-border bg-card p-4 text-xs leading-5 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>La fecha y la duración se validan contra el período académico activo; las unidades y secuencias distribuyen automáticamente los días lectivos.</span>
            <a className="shrink-0 font-bold text-primary hover:underline" href="https://minerd.gob.do/comunicaciones/noticias/consejo-nacional-de-educacion-aprueba-calendario-escolar-2026-2027-y-oficializa-estrategia-nacional-de-competencias-digitales" target="_blank" rel="noreferrer">Ver calendario</a>
          </div>
        </div> : null}

        {step === 2 ? <div className="grid gap-5 p-5">
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
                  href={`/planificaciones?${new URLSearchParams({ tab: 'curriculo', level: 'secondary', grade: String(curriculumGrade), subjectId: curriculumSubject.id }).toString()}`}
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
          <Field label="Competencias fundamentales" required><div className="grid gap-2 rounded-xl border border-border p-3 md:grid-cols-2">{competencies.map((item) => { const checked = fundamentalCompetencies.includes(item.name); return <label key={item.id} className={cn('flex cursor-pointer items-start gap-2 rounded-lg border p-3 text-sm transition', checked ? 'border-primary/40 bg-primary/5' : 'border-border')}><input type="checkbox" className="mt-0.5 size-4 accent-primary" checked={checked} onChange={(event) => { setFundamentalCompetencies((current) => event.target.checked ? [...current, item.name] : current.filter((name) => name !== item.name)); if (event.target.checked && !fundamentalCompetenceId) setFundamentalCompetenceId(item.id); if (!event.target.checked && fundamentalCompetenceId === item.id) setFundamentalCompetenceId('') }} /><span>{item.name}</span></label> })}</div></Field>
          <Field label="Competencias específicas" required><Textarea rows={5} value={specificCompetence} onChange={(event) => setSpecificCompetence(event.target.value)} /></Field>
          <div className="grid gap-4 lg:grid-cols-3"><Field label="Contenidos conceptuales" required><Textarea rows={6} value={contentConceptual} onChange={(event) => setContentConceptual(event.target.value)} /></Field><Field label="Contenidos procedimentales" required><Textarea rows={6} value={contentProcedural} onChange={(event) => setContentProcedural(event.target.value)} /></Field><Field label="Contenidos actitudinales" required><Textarea rows={6} value={contentAttitudinal} onChange={(event) => setContentAttitudinal(event.target.value)} /></Field></div>
          <Field label="Indicadores de logro" required><Textarea rows={5} value={achievementIndicator} onChange={(event) => setAchievementIndicator(event.target.value)} /></Field>
          <div className="rounded-2xl border border-primary/15 bg-primary/[0.035] p-4 sm:p-5">
            <p className="text-sm font-extrabold text-foreground">Enfoques nacionales incorporados en las sugerencias</p>
            <div className="mt-3 grid gap-2 text-xs leading-5 text-muted-foreground md:grid-cols-2">
              <p className="rounded-xl border border-border bg-card p-3"><span className="block font-bold text-primary">Moral, Cívica y Ética Ciudadana</span>Aplicación transversal conforme a la Ordenanza 02-2025, sin agregar otra asignatura ni carga horaria.</p>
              <p className="rounded-xl border border-border bg-card p-3"><span className="block font-bold text-primary">Competencias digitales e IA</span>Pensamiento computacional, ciudadanía digital y uso ético de la IA, integrados cuando sean pertinentes.</p>
            </div>
          </div>
        </div> : null}

        {step === 3 ? <div className="grid gap-5 p-5">
          <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
            <ReviewItem label="Tipo" value={planningTypeLabels[planningType]} />
            <ReviewItem label="Curso y asignatura" value={selectedSectionSubject ? `${selectedSectionSubject.gradeName} ${selectedSectionSubject.sectionName} · ${selectedSectionSubject.subjectName}` : 'Sin seleccionar'} />
            <ReviewItem label="Tema" value={topic || 'Sin tema'} />
            <ReviewItem label="Fecha" value={plannedDate || 'Sin fecha'} />
            <ReviewItem label="Duración" value={duration ? planningType === 'DAILY' ? `${duration} minutos` : `${durationDays} días · ${duration} minutos` : 'Sin duración'} />
          </div>
          <div className="rounded-xl bg-warning/20 p-4"><p className="font-black text-foreground">Desarrolla la secuencia didáctica</p><p className="mt-1 text-sm text-muted-foreground">Puedes completarla manualmente o usar la IA como borrador editable.</p></div>
          {alignmentWarning ? <div className="rounded-xl border border-warning/45 bg-warning/20 p-4 text-sm text-foreground"><p className="font-extrabold">Revisa la coherencia del tema</p><p className="mt-1 leading-6">{alignmentWarning}</p><label className="mt-3 flex cursor-pointer items-start gap-2 font-bold"><input type="checkbox" className="mt-0.5 size-4 accent-primary" checked={alignmentConfirmed} onChange={(event) => setAlignmentConfirmed(event.target.checked)} /><span>Confirmo que este tema corresponde a la asignatura seleccionada.</span></label></div> : null}
          <Field label="Situación de aprendizaje"><Textarea rows={4} value={learningSituation} onChange={(event) => setLearningSituation(event.target.value)} placeholder="Contexto, reto o problema que dará sentido a lo que aprenderán los estudiantes." /></Field>
          {planningType === 'DAILY' ? <div className="grid gap-4 lg:grid-cols-3"><MomentField title="Inicio" hint="Motivación, saberes previos y propósito" value={inicio} onChange={setInicio} /><MomentField title="Desarrollo" hint="Actividad principal y construcción del aprendizaje" value={desarrollo} onChange={setDesarrollo} /><MomentField title="Cierre" hint="Síntesis, reflexión y retroalimentación" value={cierre} onChange={setCierre} /></div> : <div className="grid gap-4">{days.map((day, index) => <PlanningDayField key={day.day} day={day} date={plannedDate ? addWeekdays(plannedDate, index) : ''} onChange={(field, value) => setDays((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item))} />)}</div>}
          {planningType === 'DAILY' ? <Field label="Metacognición"><Textarea rows={3} value={metacognition} onChange={(event) => setMetacognition(event.target.value)} placeholder="Ej.: ¿Qué aprendí?, ¿cómo lo aprendí? y ¿dónde puedo aplicarlo?" /></Field> : null}
          <Field label="Evidencias de aprendizaje" required><Textarea rows={4} value={evidence} onChange={(event) => setEvidence(event.target.value)} placeholder="Productos y desempeños observables" /></Field>
          <div className="grid gap-4 md:grid-cols-2"><Field label="Estrategias"><Textarea rows={3} value={strategies} onChange={(event) => setStrategies(event.target.value)} /></Field><Field label="Recursos"><Textarea rows={3} value={resources} onChange={(event) => setResources(event.target.value)} /></Field><Field label="Evaluación"><Textarea rows={3} value={evaluationMethod} onChange={(event) => setEvaluationMethod(event.target.value)} placeholder={evidence} /></Field><Field label="Instrumentos"><Textarea rows={3} value={evaluationInstruments} onChange={(event) => setEvaluationInstruments(event.target.value)} placeholder="Rúbrica, lista de cotejo, portafolio..." /></Field></div>
          <div className="rounded-xl border border-border bg-muted/20 p-4"><div className="flex items-center justify-between gap-3"><div><h3 className="flex items-center gap-2 font-black"><Link2 className="size-4 text-primary" />Actividades evaluativas vinculadas</h3><p className="mt-1 text-xs text-muted-foreground">Selecciona actividades existentes para integrarlas a esta planificación.</p></div><span className="text-xs font-bold text-primary">{linkedActivityIds.length} seleccionada{linkedActivityIds.length === 1 ? '' : 's'}</span></div><div className="mt-3 grid gap-2">{availableActivities.length ? availableActivities.map((activity) => <label key={activity.id} className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-3"><input type="checkbox" className="mt-1 size-4 accent-primary" checked={linkedActivityIds.includes(activity.id)} onChange={(event) => setLinkedActivityIds((current) => event.target.checked ? [...new Set([...current, activity.id])] : current.filter((id) => id !== activity.id))} /><span><span className="block text-sm font-bold">{activity.name}</span><span className="text-xs text-muted-foreground">{activity.maxScore} puntos · {activity.planningMoment || 'Sin momento'}</span></span></label>) : <p className="rounded-lg border border-dashed border-border bg-card p-3 text-sm text-muted-foreground">No hay actividades disponibles para el curso y período seleccionados.</p>}</div></div>
        </div> : null}
      </section>

      <footer className="flex flex-col-reverse gap-3 rounded-3xl bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-2 sm:flex"><Button type="button" variant="outline" onClick={step === 1 ? onClose : () => setStep((current) => current - 1)}><ArrowLeft className="size-4" />{step === 1 ? 'Cancelar' : 'Anterior'}</Button>{step === 3 && !initial?.entry.id ? <Button type="button" variant="secondary" disabled={generating || submitting} loading={generating} onClick={handleGenerateAndSave}><Sparkles className="size-4" />Generar con IA y guardar</Button> : null}</div>
        <div className="grid gap-2 sm:flex">{step === 3 ? <Button type="button" variant="outline" disabled={generating || submitting} loading={generating} onClick={handleGenerate}><Sparkles className="size-4" />Completar con IA</Button> : null}{step < 3 ? <Button type="button" onClick={goNext}>Continuar<ArrowRight className="size-4" /></Button> : <Button type="submit" disabled={submitting || generating} loading={submitting}><Check className="size-4" />Guardar planificación</Button>}</div>
      </footer>
    </form>
  )
}

function Field({ children, label, required = false }: { children: ReactNode; label: string; required?: boolean }) {
  return <label className="grid gap-1.5 text-sm font-bold text-foreground"><span>{label}{required ? <span className="text-destructive"> *</span> : null}</span>{children}</label>
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 bg-card p-4"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</p><p className="mt-1 line-clamp-2 text-sm font-extrabold text-foreground" title={value}>{value}</p></div>
}

function MomentField({ title, hint, value, onChange }: { title: string; hint: string; value: string; onChange: (value: string) => void }) {
  return <div className="overflow-hidden rounded-2xl border border-border bg-card"><div className="border-b border-border bg-warning/18 px-4 py-3"><h3 className="font-black text-foreground">{title}</h3><p className="mt-0.5 text-xs text-muted-foreground">{hint}</p></div><Textarea className="min-h-48 resize-y rounded-none border-0 shadow-none focus:ring-0" value={value} onChange={(event) => onChange(event.target.value)} placeholder={`Describe las actividades de ${title.toLowerCase()}...`} /></div>
}

function PlanningDayField({ day, date, onChange }: {
  day: PlanningDay
  date: string
  onChange: (field: 'inicio' | 'desarrollo' | 'cierre' | 'evidence' | 'evaluationMethod' | 'evaluationInstruments' | 'metacognition' | 'resources', value: string) => void
}) {
  return <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"><header className="flex items-center justify-between gap-3 border-b border-border bg-warning/18 px-4 py-3"><h3 className="font-extrabold text-foreground">Día {day.day}</h3><span className="text-xs font-bold text-muted-foreground">{date || 'Fecha pendiente'}</span></header><div className="grid gap-4 p-4 lg:grid-cols-3"><Field label="Inicio" required><Textarea rows={4} value={day.inicio} onChange={(event) => onChange('inicio', event.target.value)} /></Field><Field label="Desarrollo" required><Textarea rows={4} value={day.desarrollo} onChange={(event) => onChange('desarrollo', event.target.value)} /></Field><Field label="Cierre" required><Textarea rows={4} value={day.cierre} onChange={(event) => onChange('cierre', event.target.value)} /></Field><Field label="Evidencia" required><Textarea rows={3} value={day.evidence} onChange={(event) => onChange('evidence', event.target.value)} /></Field><Field label="Técnica de evaluación" required><Textarea rows={3} value={day.evaluationMethod} onChange={(event) => onChange('evaluationMethod', event.target.value)} /></Field><Field label="Instrumento"><Textarea rows={3} value={day.evaluationInstruments ?? ''} onChange={(event) => onChange('evaluationInstruments', event.target.value)} /></Field><Field label="Metacognición"><Textarea rows={3} value={day.metacognition ?? ''} onChange={(event) => onChange('metacognition', event.target.value)} placeholder="Preguntas de reflexión" /></Field><div className="lg:col-span-2"><Field label="Recursos"><Textarea rows={3} value={day.resources ?? ''} onChange={(event) => onChange('resources', event.target.value)} /></Field></div></div></section>
}
