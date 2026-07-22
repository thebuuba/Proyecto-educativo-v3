import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ClipboardList,
  Link2,
  School,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react'
import type { FormEvent, ReactNode } from 'react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { getEvaluationActivities } from '@/modules/grading/services/gradingService'
import {
  findCurriculumSubject,
  secondaryGradeFromName,
} from '@/modules/competency-matrix/data/secondaryCurriculumCatalog'
import type { GradingActivity } from '@/modules/grading/types'
import { generatePlanningEntry } from '@/modules/planning/services/planningService'
import type {
  AcademicPeriodSummary,
  CompetencyOption,
  CreatePlanningEntryInput,
  GeneratedPlanningEntry,
} from '@/modules/planning/types'
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
  onGenerateAndCreate,
  onClose,
}: PlanningEntryFormProps) {
  const { appUser } = useAuth()
  const [step, setStep] = useState(1)
  const [sectionSubjectId, setSectionSubjectId] = useState(initial?.sectionSubjectId ?? initial?.entry.sectionSubjectId ?? '')
  const [academicPeriodId, setAcademicPeriodId] = useState(initial?.academicPeriodId ?? initial?.entry.academicPeriodId ?? '')
  const [fundamentalCompetenceId, setFundamentalCompetenceId] = useState(initial?.entry.fundamentalCompetenceId ?? '')
  const [fundamentalCompetencies, setFundamentalCompetencies] = useState<string[]>(initial?.entry.fundamentalCompetencies ?? [])
  const [title, setTitle] = useState(initial?.entry.title ?? '')
  const [topic, setTopic] = useState(initial?.entry.topic ?? '')
  const [schoolNameValue, setSchoolNameValue] = useState(initial?.entry.schoolNameSnapshot ?? schoolName ?? '')
  const [teacherName, setTeacherName] = useState(initial?.entry.teacherNameSnapshot ?? appUser?.fullName ?? '')
  const [curricularArea, setCurricularArea] = useState(initial?.entry.curricularArea ?? '')
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
  const [resources, setResources] = useState(initial?.entry.resources ?? '')
  const [evaluationMethod, setEvaluationMethod] = useState(initial?.entry.evaluationMethod ?? '')
  const [evidence, setEvidence] = useState(initial?.entry.evidence ?? '')
  const [evaluationInstruments, setEvaluationInstruments] = useState(initial?.entry.evaluationInstruments ?? '')
  const [duration, setDuration] = useState(initial?.entry.durationMinutes?.toString() ?? '')
  const [plannedDate, setPlannedDate] = useState(initial?.entry.plannedDate ?? '')
  const [validationError, setValidationError] = useState('')
  const [generating, setGenerating] = useState(false)
  const [availableActivities, setAvailableActivities] = useState<GradingActivity[]>([])
  const [linkedActivityIds, setLinkedActivityIds] = useState<string[]>(initial?.entry.linkedActivityIds ?? [])

  const selectedSectionSubject = sectionSubjects.find((item) => item.id === sectionSubjectId)
  const courseOptions = Array.from(new Map(sectionSubjects.map((item) => [courseKeyFor(item), { key: courseKeyFor(item), gradeName: item.gradeName, sectionName: item.sectionName, level: item.level }])).values())
  const [courseKey, setCourseKey] = useState(selectedSectionSubject ? courseKeyFor(selectedSectionSubject) : '')
  const areaOptions = Array.from(new Set(sectionSubjects.map((item) => curricularAreaFor(item.subjectName)))).sort()
  const subjectOptions = sectionSubjects.filter((item) => {
    const matchesCourse = !courseKey || courseKeyFor(item) === courseKey
    const matchesArea = !curricularArea || curricularAreaFor(item.subjectName) === curricularArea
    return matchesCourse && matchesArea
  })
  const referencedGrade = curriculumReference ? secondaryGradeFromName(curriculumReference.grade) : null
  const curriculumGrade = selectedSectionSubject
    ? secondaryGradeFromName(selectedSectionSubject.gradeName)
    : referencedGrade
  const preferredCurriculumId = curriculumGrade === referencedGrade ? curriculumReference?.subjectId : undefined
  const curriculumSubject = curriculumGrade && selectedSectionSubject
    ? findCurriculumSubject(curriculumGrade, selectedSectionSubject.subjectName, preferredCurriculumId)
    : curriculumGrade && curriculumReference
      ? findCurriculumSubject(curriculumGrade, '', curriculumReference.subjectId)
      : null

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
    return {
      sectionSubjectId,
      academicPeriodId,
      fundamentalCompetenceId: fundamentalCompetenceId || null,
      fundamentalCompetencies,
      title: title.trim(),
      schoolNameSnapshot: schoolNameValue.trim() || null,
      teacherNameSnapshot: teacherName.trim() || null,
      curricularArea: curricularArea || null,
      educationLevel: selectedSectionSubject ? educationLevelFor(selectedSectionSubject.gradeName, selectedSectionSubject.level) : null,
      topic: topic.trim() || null,
      transversalAxis: transversalAxis || null,
      specificCompetence,
      achievementIndicator,
      contentConceptual,
      contentProcedural,
      contentAttitudinal,
      strategies,
      activities: { inicio, desarrollo, cierre },
      resources,
      evaluationMethod,
      evidence,
      evaluationInstruments,
      durationMinutes: duration ? Number(duration) : null,
      plannedDate: plannedDate || null,
      linkedActivityIds,
    }
  }

  function validateStep(targetStep: number) {
    setValidationError('')
    if (targetStep >= 1 && !sectionSubjectId) return 'Selecciona el área curricular y la asignatura.'
    if (targetStep >= 1 && !courseKey) return 'Selecciona el curso.'
    if (targetStep >= 1 && !curricularArea) return 'Selecciona el área curricular.'
    if (targetStep >= 1 && !academicPeriodId) return 'Selecciona el período académico.'
    if (targetStep >= 1 && !plannedDate) return 'Selecciona la fecha de la planificación.'
    if (targetStep >= 1 && !title.trim()) return 'Escribe el título de la unidad de aprendizaje.'
    if (targetStep >= 1 && !topic.trim()) return 'Escribe el tema que se trabajará.'
    if (targetStep >= 1 && !transversalAxis) return 'Selecciona un eje transversal.'
    if (targetStep >= 2 && !fundamentalCompetencies.length) return 'Selecciona al menos una competencia fundamental.'
    if (targetStep >= 2 && !specificCompetence.trim()) return 'Escribe las competencias específicas.'
    if (targetStep >= 2 && !achievementIndicator.trim()) return 'Escribe los indicadores de logro.'
    return ''
  }

  async function goNext() {
    const message = validateStep(step)
    if (message) {
      setValidationError(message)
      return
    }
    if (step === 1 && !initial?.entry.id && !specificCompetence && !achievementIndicator) {
      setGenerating(true)
      try { applyDraft(await requestDraft()) }
      catch (caught) { setValidationError(caught instanceof Error ? caught.message : 'No se pudieron cargar las sugerencias curriculares. Puedes completar los campos manualmente.') }
      finally { setGenerating(false) }
    }
    setStep((current) => Math.min(3, current + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const message = validateStep(2)
    if (message) {
      setValidationError(message)
      setStep(message.includes('competencia') || message.includes('indicadores') ? 2 : 1)
      return
    }
    await onSubmit(buildInput())
  }

  function applyDraft(draft: GeneratedPlanningEntry) {
    if (draft.fundamentalCompetencies?.length) {
      const suggested = competencies.filter((option) => draft.fundamentalCompetencies?.some((name) => name.toLowerCase().includes(option.name.toLowerCase()) || option.name.toLowerCase().includes(name.toLowerCase())))
      const names = suggested.length ? suggested.map((option) => option.name) : draft.fundamentalCompetencies
      setFundamentalCompetencies(names)
      setFundamentalCompetenceId(suggested[0]?.id ?? '')
    }
    if (!title.trim()) setTitle(draft.title)
    setSpecificCompetence(draft.specificCompetence)
    setAchievementIndicator(draft.achievementIndicator)
    setContentConceptual(draft.contentConceptual)
    setContentProcedural(draft.contentProcedural)
    setContentAttitudinal(draft.contentAttitudinal)
    setStrategies(draft.strategies)
    setInicio(draft.activities.inicio)
    setDesarrollo(draft.activities.desarrollo)
    setCierre(draft.activities.cierre)
    setResources(draft.resources)
    setEvaluationMethod(draft.evaluationMethod)
    setEvidence(draft.evidence)
    setEvaluationInstruments(draft.evaluationInstruments)
    setDuration(draft.durationMinutes ? String(draft.durationMinutes) : duration)
  }

  async function requestDraft() {
    if (!sectionSubjectId) throw new Error('Selecciona un área curricular y una asignatura para generar la planificación.')
    const competence = competencies.find((item) => item.id === fundamentalCompetenceId)
    return generatePlanningEntry({
      sectionSubjectId,
      title,
      topic: topic.trim(),
      curricularArea,
      educationLevel: selectedSectionSubject ? educationLevelFor(selectedSectionSubject.gradeName, selectedSectionSubject.level) : undefined,
      transversalAxis,
      durationMinutes: duration ? Number(duration) : null,
      specificCompetence,
      achievementIndicator,
      subjectName: selectedSectionSubject?.subjectName,
      sectionName: selectedSectionSubject?.sectionName,
      gradeName: selectedSectionSubject?.gradeName,
      fundamentalCompetenceName: competence?.name,
    })
  }

  async function handleGenerate() {
    setValidationError('')
    setGenerating(true)
    try { applyDraft(await requestDraft()) }
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
    } finally { setGenerating(false) }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button type="button" className="font-medium text-primary hover:underline" onClick={onClose}>Planificaciones</button>
            <span>›</span><span>{initial?.entry.id ? 'Editar planificación' : 'Nueva planificación'}</span>
          </div>
          <h1 className="mt-3 text-3xl font-black text-primary">{initial?.entry.id ? 'Editar planificación' : 'Crear planificación'}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Completa las tres partes de la planificación docente.</p>
        </div>
        <Button type="button" variant="outline" onClick={onClose}><ArrowLeft className="size-4" />Volver</Button>
      </header>

      <nav className="grid overflow-hidden rounded-xl border border-border bg-card shadow-sm md:grid-cols-3" aria-label="Pasos de la planificación">
        {steps.map((item) => {
          const Icon = item.icon
          const active = step === item.number
          const complete = step > item.number
          return (
            <button key={item.number} type="button" className={cn('flex items-center gap-3 border-b border-border px-4 py-4 text-left transition last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0', active && 'bg-primary text-primary-foreground', !active && 'hover:bg-muted/50')} onClick={() => setStep(item.number)}>
              <span className={cn('grid size-10 shrink-0 place-items-center rounded-full border font-black', active ? 'border-primary-foreground/30 bg-primary-foreground/15' : complete ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-border bg-muted text-muted-foreground')}>
                {complete ? <Check className="size-5" /> : <Icon className="size-5" />}
              </span>
              <span><span className="block text-xs font-bold opacity-75">Parte {item.number}</span><span className="block font-black">{item.title}</span><span className="block text-xs opacity-75">{item.description}</span></span>
            </button>
          )
        })}
      </nav>

      {validationError || error ? <div className="flex gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" /><p>{validationError || error}</p></div> : null}

      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4"><p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Parte {step} de 3</p><h2 className="mt-1 text-xl font-black text-foreground">{steps[step - 1]?.title}</h2></div>

        {step === 1 ? <div className="grid gap-5 p-5 md:grid-cols-2">
          <Field label="Centro educativo" required><Input value={schoolNameValue} onChange={(event) => setSchoolNameValue(event.target.value)} placeholder="Nombre del centro educativo" /></Field>
          <Field label="Nombre del docente" required><Input value={teacherName} onChange={(event) => setTeacherName(event.target.value)} placeholder="Nombre completo del docente" /></Field>
          <Field label="Curso" required><Select value={courseKey} onChange={(event) => { setCourseKey(event.target.value); setSectionSubjectId('') }}><option value="">Selecciona...</option><optgroup label="Primaria">{courseOptions.filter((item) => educationLevelFor(item.gradeName, item.level) === 'Primaria').map((item) => <option key={item.key} value={item.key}>{item.gradeName} {item.sectionName}</option>)}</optgroup><optgroup label="Secundaria">{courseOptions.filter((item) => educationLevelFor(item.gradeName, item.level) === 'Secundaria').map((item) => <option key={item.key} value={item.key}>{item.gradeName} {item.sectionName}</option>)}</optgroup></Select></Field>
          <Field label="Área curricular" required><Select value={curricularArea} onChange={(event) => { setCurricularArea(event.target.value); setSectionSubjectId('') }}><option value="">Selecciona...</option>{areaOptions.map((area) => <option key={area} value={area}>{area}</option>)}</Select></Field>
          <div className="md:col-span-2"><Field label="Asignatura" required><Select value={sectionSubjectId} onChange={(event) => setSectionSubjectId(event.target.value)}><option value="">Selecciona...</option><optgroup label="Primaria">{subjectOptions.filter((item) => educationLevelFor(item.gradeName, item.level) === 'Primaria').map((item) => <option key={item.id} value={item.id}>{item.subjectName} — {item.gradeName} {item.sectionName}</option>)}</optgroup><optgroup label="Secundaria">{subjectOptions.filter((item) => educationLevelFor(item.gradeName, item.level) === 'Secundaria').map((item) => <option key={item.id} value={item.id}>{item.subjectName} — {item.gradeName} {item.sectionName}</option>)}</optgroup></Select></Field></div>
          <Field label="Período académico" required><Select value={academicPeriodId} onChange={(event) => setAcademicPeriodId(event.target.value)}><option value="">Selecciona...</option>{periods.map((period) => <option key={period.id} value={period.id}>{period.name}</option>)}</Select></Field>
          <Field label="Fecha" required><Input type="date" value={plannedDate} onChange={(event) => setPlannedDate(event.target.value)} /></Field>
          <div className="md:col-span-2"><Field label="Título de la unidad de aprendizaje" required><Input value={title} placeholder="Ej.: El sistema solar y nuestro lugar en el universo" onChange={(event) => setTitle(event.target.value)} /></Field></div>
          <div className="md:col-span-2"><Field label="Tema" required><Input value={topic} placeholder="Ej.: La célula" onChange={(event) => setTopic(event.target.value)} /></Field></div>
          <div className="md:col-span-2"><Field label="Eje transversal" required><Select value={transversalAxis} onChange={(event) => setTransversalAxis(event.target.value)}><option value="">Selecciona...</option>{transversalAxes.map((axis) => <option key={axis} value={axis}>{axis}</option>)}</Select></Field></div>
        </div> : null}

        {step === 2 ? <div className="grid gap-5 p-5">
          {curriculumGrade && curriculumSubject ? (
            <div className="flex flex-col gap-3 rounded-xl border border-primary/15 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-foreground">Malla oficial vinculada</p>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                  {curriculumSubject.courseNames?.[curriculumGrade] || curriculumSubject.subject} · {curriculumGrade}.º de Secundaria
                </p>
              </div>
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
          ) : null}
          <Field label="Competencias fundamentales" required><div className="grid gap-2 rounded-xl border border-border p-3 md:grid-cols-2">{competencies.map((item) => { const checked = fundamentalCompetencies.includes(item.name); return <label key={item.id} className={cn('flex cursor-pointer items-start gap-2 rounded-lg border p-3 text-sm transition', checked ? 'border-primary/40 bg-primary/5' : 'border-border')}><input type="checkbox" className="mt-0.5 size-4 accent-primary" checked={checked} onChange={(event) => { setFundamentalCompetencies((current) => event.target.checked ? [...current, item.name] : current.filter((name) => name !== item.name)); if (event.target.checked && !fundamentalCompetenceId) setFundamentalCompetenceId(item.id); if (!event.target.checked && fundamentalCompetenceId === item.id) setFundamentalCompetenceId('') }} /><span>{item.name}</span></label> })}</div></Field>
          <Field label="Competencias específicas" required><Textarea rows={4} value={specificCompetence} placeholder="Competencias específicas que se desarrollarán" onChange={(event) => setSpecificCompetence(event.target.value)} /></Field>
          <div className="grid gap-4 lg:grid-cols-3">
            <Field label="Contenidos conceptuales"><Textarea rows={5} value={contentConceptual} placeholder="Conceptos, datos y hechos" onChange={(event) => setContentConceptual(event.target.value)} /></Field>
            <Field label="Contenidos procedimentales"><Textarea rows={5} value={contentProcedural} placeholder="Procedimientos, técnicas y métodos" onChange={(event) => setContentProcedural(event.target.value)} /></Field>
            <Field label="Contenidos actitudinales"><Textarea rows={5} value={contentAttitudinal} placeholder="Actitudes, valores y normas" onChange={(event) => setContentAttitudinal(event.target.value)} /></Field>
          </div>
          <Field label="Indicadores de logro" required><Textarea rows={4} value={achievementIndicator} placeholder="Resultados observables que demostrarán el aprendizaje" onChange={(event) => setAchievementIndicator(event.target.value)} /></Field>
        </div> : null}

        {step === 3 ? <div className="grid gap-5 p-5">
          <div className="grid gap-4 lg:grid-cols-3">
            <MomentField title="Inicio" hint="Motivación, recuperación de saberes previos y propósito" value={inicio} onChange={setInicio} />
            <MomentField title="Desarrollo" hint="Construcción del aprendizaje y actividades principales" value={desarrollo} onChange={setDesarrollo} />
            <MomentField title="Cierre" hint="Síntesis, reflexión, evaluación y retroalimentación" value={cierre} onChange={setCierre} />
          </div>
          <div className="grid gap-4 md:grid-cols-2"><Field label="Recursos"><Textarea rows={3} value={resources} onChange={(event) => setResources(event.target.value)} placeholder="Materiales, tecnología y espacios" /></Field><Field label="Evaluación"><Textarea rows={3} value={evaluationMethod} onChange={(event) => setEvaluationMethod(event.target.value)} placeholder="Métodos y criterios de evaluación" /></Field><Field label="Evidencias de aprendizaje"><Textarea rows={3} value={evidence} onChange={(event) => setEvidence(event.target.value)} placeholder="Productos y desempeños observables" /></Field><Field label="Instrumentos"><Textarea rows={3} value={evaluationInstruments} onChange={(event) => setEvaluationInstruments(event.target.value)} placeholder="Rúbrica, lista de cotejo, portafolio..." /></Field></div>
          <Field label="Duración total (minutos)"><Input type="number" min={1} value={duration} onChange={(event) => setDuration(event.target.value)} placeholder="Ej.: 90" /></Field>
          <div className="rounded-xl border border-border bg-muted/20 p-4"><div className="flex items-center justify-between gap-3"><div><h3 className="flex items-center gap-2 font-black"><Link2 className="size-4 text-primary" />Actividades evaluativas vinculadas</h3><p className="mt-1 text-xs text-muted-foreground">Selecciona actividades existentes para integrarlas a esta planificación.</p></div><span className="text-xs font-bold text-primary">{linkedActivityIds.length} seleccionada{linkedActivityIds.length === 1 ? '' : 's'}</span></div><div className="mt-3 grid gap-2">{availableActivities.length ? availableActivities.map((activity) => <label key={activity.id} className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-3"><input type="checkbox" className="mt-1 size-4 accent-primary" checked={linkedActivityIds.includes(activity.id)} onChange={(event) => setLinkedActivityIds((current) => event.target.checked ? [...new Set([...current, activity.id])] : current.filter((id) => id !== activity.id))} /><span><span className="block text-sm font-bold">{activity.name}</span><span className="text-xs text-muted-foreground">{activity.maxScore} puntos · {activity.planningMoment || 'Sin momento'}</span></span></label>) : <p className="rounded-lg border border-dashed border-border bg-card p-3 text-sm text-muted-foreground">No hay actividades disponibles para el curso y período seleccionados.</p>}</div></div>
        </div> : null}
      </section>

      <footer className="flex flex-col-reverse gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2"><Button type="button" variant="outline" onClick={step === 1 ? onClose : () => setStep((current) => current - 1)}><ArrowLeft className="size-4" />{step === 1 ? 'Cancelar' : 'Anterior'}</Button>{step === 3 ? <Button type="button" variant="secondary" disabled={generating || submitting} loading={generating} onClick={handleGenerateAndSave}><Sparkles className="size-4" />Generar con IA y guardar</Button> : null}</div>
        <div className="flex gap-2">{step > 1 ? <Button type="button" variant="outline" disabled={generating || submitting} loading={generating} onClick={handleGenerate}><Sparkles className="size-4" />Completar con IA</Button> : null}{step < 3 ? <Button type="button" onClick={goNext}>Continuar<ArrowRight className="size-4" /></Button> : <Button type="submit" disabled={submitting || generating} loading={submitting}><Check className="size-4" />Guardar planificación</Button>}</div>
      </footer>
    </form>
  )
}

function Field({ children, label, required = false }: { children: ReactNode; label: string; required?: boolean }) {
  return <label className="grid gap-1.5 text-sm font-bold text-foreground"><span>{label}{required ? <span className="text-destructive"> *</span> : null}</span>{children}</label>
}

function MomentField({ title, hint, value, onChange }: { title: string; hint: string; value: string; onChange: (value: string) => void }) {
  return <div className="overflow-hidden rounded-xl border border-border bg-card"><div className="border-b border-border bg-primary/5 px-4 py-3"><h3 className="font-black text-primary">{title}</h3><p className="mt-0.5 text-xs text-muted-foreground">{hint}</p></div><Textarea className="min-h-48 resize-y rounded-none border-0 shadow-none focus:ring-0" value={value} onChange={(event) => onChange(event.target.value)} placeholder={`Describe las actividades de ${title.toLowerCase()}...`} /></div>
}
