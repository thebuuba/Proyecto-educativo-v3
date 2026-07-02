import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'

import { useAuth } from '@/modules/auth/hooks/useAuth'
import type { CompleteOnboardingInput } from '@/modules/auth/types/auth'

const DRAFT_KEY = 'aulabase:onboarding-draft'
const REGISTRATION_NAME_KEY = 'aulabase:registration-name'
const totalSteps = 5

const levelOptions = [
  { value: 'primary', label: 'Primaria' },
  { value: 'secondary', label: 'Secundaria' },
]

const shiftOptions = [
  { value: 'morning', label: 'Matutina' },
  { value: 'afternoon', label: 'Vespertina' },
  { value: 'night', label: 'Nocturna' },
  { value: 'extended', label: 'Extendida' },
  { value: 'multiple', label: 'Multiple' },
]

const modalityOptions = [
  { value: 'regular', label: 'Primaria/Secundaria' },
  { value: 'adultos', label: 'Adultos' },
  { value: 'other', label: 'Otra' },
]

type PeriodDraft = {
  name: string
  startDate: string
  endDate: string
}

type CourseDraft = {
  gradeName: string
  sectionName: string
  area: string
  subjectName: string
  subjectCode: string
}

type OnboardingDraft = {
  fullName: string
  schoolName: string
  regionalName: string
  districtName: string
  levels: string[]
  shifts: string[]
  modalities: string[]
  schoolYearName: string
  schoolStartDate: string
  schoolEndDate: string
  periods: PeriodDraft[]
  course: CourseDraft
}

type StepErrors = Record<string, string>

function isoToday() {
  return new Date().toISOString().slice(0, 10)
}

function createInitialDraft(fullName = ''): OnboardingDraft {
  return {
    fullName,
    schoolName: '',
    regionalName: '',
    districtName: '',
    levels: ['secondary'],
    shifts: ['extended'],
    modalities: ['regular'],
    schoolYearName: '2026-2027',
    schoolStartDate: isoToday(),
    schoolEndDate: '2027-06-30',
    periods: [
      { name: 'Periodo 1', startDate: isoToday(), endDate: '2026-12-15' },
      { name: 'Periodo 2', startDate: '2027-01-08', endDate: '2027-03-31' },
      { name: 'Periodo 3', startDate: '2027-04-01', endDate: '2027-06-30' },
    ],
    course: {
      gradeName: '3ro Secundaria',
      sectionName: 'A',
      area: 'Lengua Espanola',
      subjectName: 'Lengua Espanola',
      subjectCode: '',
    },
  }
}

function loadDraft(fallbackFullName = ''): OnboardingDraft {
  const initialDraft = createInitialDraft(fallbackFullName)

  try {
    const rawDraft = localStorage.getItem(DRAFT_KEY)
    if (!rawDraft) return initialDraft
    const parsed = JSON.parse(rawDraft) as Partial<OnboardingDraft> & {
      level?: string
      schoolYearName?: string
    }

    return {
      ...initialDraft,
      ...parsed,
      fullName: parsed.fullName?.trim() || fallbackFullName || initialDraft.fullName,
      levels: parsed.level ? [parsed.level] : parsed.levels?.length ? parsed.levels : initialDraft.levels,
      shifts: parsed.shifts?.length ? parsed.shifts : initialDraft.shifts,
      modalities: parsed.modalities?.length ? parsed.modalities : initialDraft.modalities,
      periods: parsed.periods?.length ? parsed.periods : initialDraft.periods,
      course: { ...initialDraft.course, ...parsed.course },
    }
  } catch {
    return initialDraft
  }
}

function labelsFor(options: { value: string; label: string }[], values: string[]) {
  return values.map((value) => options.find((option) => option.value === value)?.label ?? value).join(', ')
}

function toOnboardingInput(draft: OnboardingDraft): CompleteOnboardingInput {
  const primaryModality = draft.modalities.includes('adultos')
    ? 'adultos'
    : draft.modalities.includes('other')
      ? 'other'
      : 'general'

  return {
    fullName: draft.fullName.trim(),
    school: {
      name: draft.schoolName.trim(),
      regionalName: draft.regionalName.trim() || undefined,
      districtName: draft.districtName.trim() || undefined,
      primaryModality,
      schoolShift: draft.shifts.join(','),
      enabledSubsystems: draft.levels.length ? draft.levels : ['secondary'],
    },
    schoolYear: {
      name: draft.schoolYearName.trim(),
      startDate: draft.schoolStartDate,
      endDate: draft.schoolEndDate,
    },
    periods: draft.periods.map((period) => ({
      name: period.name.trim(),
      startDate: period.startDate,
      endDate: period.endDate,
    })),
    courses: [
      {
        gradeName: draft.course.gradeName.trim(),
        sectionName: draft.course.sectionName.trim(),
        subjectName: draft.course.subjectName.trim(),
        subjectCode: draft.course.subjectCode.trim().toUpperCase(),
      },
    ],
  }
}

function validateDateRange(startDate: string, endDate: string) {
  if (!startDate || !endDate) return false
  return new Date(startDate) <= new Date(endDate)
}

function validateStep(step: number, draft: OnboardingDraft): StepErrors {
  const errors: StepErrors = {}

  if (step === 0) {
    if (!draft.fullName.trim()) errors.fullName = 'Escribe el nombre del docente.'
    if (!draft.schoolName.trim()) errors.schoolName = 'Escribe el centro educativo.'
  }

  if (step === 1) {
    if (!draft.levels.length) errors.levels = 'Selecciona al menos un nivel.'
    if (!draft.shifts.length) errors.shifts = 'Selecciona al menos una tanda.'
    if (!draft.modalities.length) errors.modalities = 'Selecciona al menos una modalidad.'
  }

  if (step === 2) {
    if (!draft.schoolYearName.trim()) errors.schoolYearName = 'Escribe el ano escolar.'
    if (!draft.schoolStartDate) errors.schoolStartDate = 'Selecciona la fecha de inicio.'
    if (!draft.schoolEndDate) errors.schoolEndDate = 'Selecciona la fecha de cierre.'
    if (draft.schoolStartDate && draft.schoolEndDate && !validateDateRange(draft.schoolStartDate, draft.schoolEndDate)) {
      errors.schoolEndDate = 'La fecha de cierre debe ser posterior al inicio.'
    }
    if (!draft.periods.length) errors.periods = 'Agrega al menos un periodo academico.'
    draft.periods.forEach((period, index) => {
      if (!period.name.trim()) errors[`period-${index}-name`] = 'Nombre requerido.'
      if (!period.startDate) errors[`period-${index}-startDate`] = 'Inicio requerido.'
      if (!period.endDate) errors[`period-${index}-endDate`] = 'Final requerido.'
      if (period.startDate && period.endDate && !validateDateRange(period.startDate, period.endDate)) {
        errors[`period-${index}-endDate`] = 'Final posterior al inicio.'
      }
    })
  }

  if (step === 3) {
    if (!draft.course.gradeName.trim()) errors.gradeName = 'Escribe el grado.'
    if (!draft.course.sectionName.trim()) errors.sectionName = 'Escribe la seccion.'
    if (!draft.course.subjectName.trim()) errors.subjectName = 'Escribe la asignatura o subarea.'
  }

  return errors
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-xs font-medium text-red-600">{message}</p> : null
}

function StepProgress({ step }: { step: number }) {
  const progress = ((step + 1) / totalSteps) * 100
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-bold uppercase text-[#2D6977]">
        <span>Configuracion inicial</span>
        <span>
          Paso {step + 1} de {totalSteps}
        </span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-[#E5E7EB]">
        <div className="h-2 rounded-full bg-[#1F4E5F]" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

function DashboardPreview() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#EEF2F5] text-[#111827] blur-[2px]">
      <div className="flex h-full">
        <aside className="hidden w-64 border-r border-white/70 bg-white/80 p-6 lg:block">
          <div className="text-xl font-black text-[#1F4E5F]">AulaBase</div>
          <div className="mt-10 space-y-3">
            {['Inicio', 'Estudiantes', 'Asistencia', 'Calificaciones', 'Planificacion'].map((item) => (
              <div key={item} className="rounded-lg bg-[#F3F4F6] px-4 py-3 text-sm font-semibold text-[#6B7280]">
                {item}
              </div>
            ))}
          </div>
        </aside>
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 w-36 rounded bg-[#CBD5E1]" />
              <div className="mt-3 h-8 w-64 rounded bg-white" />
            </div>
            <div className="h-10 w-10 rounded-full bg-white" />
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-32 rounded-lg border border-white/80 bg-white/80 shadow-sm" />
            ))}
          </div>
          <div className="mt-6 h-72 rounded-lg border border-white/80 bg-white/80 shadow-sm" />
        </main>
      </div>
    </div>
  )
}

function ChoiceButton({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-lg border px-3 py-2 text-sm font-semibold transition',
        active
          ? 'border-[#1F4E5F] bg-[#E8F3F5] text-[#1F4E5F]'
          : 'border-[#E5E7EB] bg-white text-[#374151] hover:border-[#A7B8C0]',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

export function OnboardingPage() {
  const [searchParams] = useSearchParams()
  const resetMode = searchParams.get('reset') === '1'
  const {
    appUser,
    completeOnboarding,
    isAuthenticated,
    loading,
    profileRequired,
    onboardingComplete,
  } = useAuth()
  const [step, setStep] = useState(0)
  const knownFullName = appUser?.fullName || localStorage.getItem(REGISTRATION_NAME_KEY)?.trim() || ''
  const [draft, setDraft] = useState(() => loadDraft(knownFullName))
  const [errors, setErrors] = useState<StepErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!resetMode) return
    const initialDraft = createInitialDraft(knownFullName)
    localStorage.setItem(DRAFT_KEY, JSON.stringify(initialDraft))
    setDraft(initialDraft)
    setStep(0)
    setErrors({})
    setSubmitError('')
  }, [knownFullName, resetMode])

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  }, [draft])

  if (!resetMode && !loading && isAuthenticated && onboardingComplete) {
    return <Navigate to="/" replace />
  }

  if (!loading && !isAuthenticated && !profileRequired) {
    return <Navigate to="/registro" replace />
  }

  function updateDraft(patch: Partial<OnboardingDraft>) {
    setDraft((current) => ({ ...current, ...patch }))
  }

  function toggleListValue(key: 'levels' | 'shifts' | 'modalities', value: string) {
    setDraft((current) => {
      const values = current[key]
      const nextValues = values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value]
      return { ...current, [key]: nextValues }
    })
  }

  function updatePeriod(index: number, patch: Partial<PeriodDraft>) {
    setDraft((current) => ({
      ...current,
      periods: current.periods.map((period, periodIndex) =>
        periodIndex === index ? { ...period, ...patch } : period,
      ),
    }))
  }

  function addPeriod() {
    setDraft((current) => ({
      ...current,
      periods: [
        ...current.periods,
        {
          name: `Periodo ${current.periods.length + 1}`,
          startDate: current.schoolStartDate,
          endDate: current.schoolEndDate,
        },
      ],
    }))
  }

  function removePeriod(index: number) {
    setDraft((current) => ({
      ...current,
      periods: current.periods.filter((_, periodIndex) => periodIndex !== index),
    }))
  }

  function updateCourse(patch: Partial<CourseDraft>) {
    setDraft((current) => ({ ...current, course: { ...current.course, ...patch } }))
  }

  function goNext() {
    const nextErrors = validateStep(step, draft)
    setErrors(nextErrors)
    setSubmitError('')
    if (Object.keys(nextErrors).length) return
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    setStep((current) => Math.min(current + 1, totalSteps - 1))
  }

  function goBack() {
    setErrors({})
    setSubmitError('')
    setStep((current) => Math.max(current - 1, 0))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError('')

    for (let stepIndex = 0; stepIndex < totalSteps - 1; stepIndex += 1) {
      const nextErrors = validateStep(stepIndex, draft)
      if (Object.keys(nextErrors).length) {
        setErrors(nextErrors)
        setStep(stepIndex)
        return
      }
    }

    setSubmitting(true)
    try {
      await completeOnboarding(toOnboardingInput({ ...draft, fullName: knownFullName || draft.fullName }))
      localStorage.removeItem(DRAFT_KEY)
      localStorage.removeItem(REGISTRATION_NAME_KEY)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'No se pudo completar la configuracion.')
    } finally {
      setSubmitting(false)
    }
  }

  function renderStep() {
    if (step === 0) {
      return (
        <div className="space-y-4">
          {knownFullName ? null : (
            <div>
              <label className="text-sm font-bold text-[#374151]">Nombre del docente</label>
              <input className="mt-2 w-full rounded-lg border border-[#D1D5DB] px-3 py-2" value={draft.fullName} onChange={(event) => updateDraft({ fullName: event.target.value })} />
              <FieldError message={errors.fullName} />
            </div>
          )}
          <div>
            <label className="text-sm font-bold text-[#374151]">Centro educativo</label>
            <input className="mt-2 w-full rounded-lg border border-[#D1D5DB] px-3 py-2" value={draft.schoolName} onChange={(event) => updateDraft({ schoolName: event.target.value })} />
            <FieldError message={errors.schoolName} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-bold text-[#374151]">Regional</label>
              <input className="mt-2 w-full rounded-lg border border-[#D1D5DB] px-3 py-2" value={draft.regionalName} onChange={(event) => updateDraft({ regionalName: event.target.value })} />
            </div>
            <div>
              <label className="text-sm font-bold text-[#374151]">Distrito educativo</label>
              <input className="mt-2 w-full rounded-lg border border-[#D1D5DB] px-3 py-2" value={draft.districtName} onChange={(event) => updateDraft({ districtName: event.target.value })} />
            </div>
          </div>
        </div>
      )
    }

    if (step === 1) {
      return (
        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-bold text-[#374151]">Nivel en que trabaja</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {levelOptions.map((option) => (
                <ChoiceButton key={option.value} active={draft.levels.includes(option.value)} onClick={() => toggleListValue('levels', option.value)}>
                  {option.label}
                </ChoiceButton>
              ))}
            </div>
            <FieldError message={errors.levels} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#374151]">Tanda</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {shiftOptions.map((option) => (
                <ChoiceButton key={option.value} active={draft.shifts.includes(option.value)} onClick={() => toggleListValue('shifts', option.value)}>
                  {option.label}
                </ChoiceButton>
              ))}
            </div>
            <FieldError message={errors.shifts} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#374151]">Modalidad</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {modalityOptions.map((option) => (
                <ChoiceButton key={option.value} active={draft.modalities.includes(option.value)} onClick={() => toggleListValue('modalities', option.value)}>
                  {option.label}
                </ChoiceButton>
              ))}
            </div>
            <FieldError message={errors.modalities} />
          </div>
        </div>
      )
    }

    if (step === 2) {
      return (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-bold text-[#374151]">Ano escolar</label>
              <input className="mt-2 w-full rounded-lg border border-[#D1D5DB] px-3 py-2" value={draft.schoolYearName} onChange={(event) => updateDraft({ schoolYearName: event.target.value })} />
              <FieldError message={errors.schoolYearName} />
            </div>
            <div>
              <label className="text-sm font-bold text-[#374151]">Inicio</label>
              <input type="date" className="mt-2 w-full rounded-lg border border-[#D1D5DB] px-3 py-2" value={draft.schoolStartDate} onChange={(event) => updateDraft({ schoolStartDate: event.target.value })} />
              <FieldError message={errors.schoolStartDate} />
            </div>
            <div>
              <label className="text-sm font-bold text-[#374151]">Cierre</label>
              <input type="date" className="mt-2 w-full rounded-lg border border-[#D1D5DB] px-3 py-2" value={draft.schoolEndDate} onChange={(event) => updateDraft({ schoolEndDate: event.target.value })} />
              <FieldError message={errors.schoolEndDate} />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#374151]">Periodos academicos</h3>
              <button type="button" onClick={addPeriod} className="rounded-lg border border-[#1F4E5F] px-3 py-2 text-sm font-bold text-[#1F4E5F]">Agregar</button>
            </div>
            <FieldError message={errors.periods} />
            {draft.periods.map((period, index) => (
              <div key={index} className="grid gap-2 rounded-lg border border-[#E5E7EB] p-3 md:grid-cols-[1fr_1fr_1fr_auto]">
                <div>
                  <input className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2" value={period.name} onChange={(event) => updatePeriod(index, { name: event.target.value })} />
                  <FieldError message={errors[`period-${index}-name`]} />
                </div>
                <div>
                  <input type="date" className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2" value={period.startDate} onChange={(event) => updatePeriod(index, { startDate: event.target.value })} />
                  <FieldError message={errors[`period-${index}-startDate`]} />
                </div>
                <div>
                  <input type="date" className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2" value={period.endDate} onChange={(event) => updatePeriod(index, { endDate: event.target.value })} />
                  <FieldError message={errors[`period-${index}-endDate`]} />
                </div>
                <button type="button" onClick={() => removePeriod(index)} className="rounded-lg px-3 py-2 text-sm font-bold text-red-600 disabled:opacity-40" disabled={draft.periods.length === 1}>Quitar</button>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (step === 3) {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-bold text-[#374151]">Grado</label>
            <input className="mt-2 w-full rounded-lg border border-[#D1D5DB] px-3 py-2" value={draft.course.gradeName} onChange={(event) => updateCourse({ gradeName: event.target.value })} />
            <FieldError message={errors.gradeName} />
          </div>
          <div>
            <label className="text-sm font-bold text-[#374151]">Seccion</label>
            <input className="mt-2 w-full rounded-lg border border-[#D1D5DB] px-3 py-2" value={draft.course.sectionName} onChange={(event) => updateCourse({ sectionName: event.target.value })} />
            <FieldError message={errors.sectionName} />
          </div>
          <div>
            <label className="text-sm font-bold text-[#374151]">Area</label>
            <input className="mt-2 w-full rounded-lg border border-[#D1D5DB] px-3 py-2" value={draft.course.area} onChange={(event) => updateCourse({ area: event.target.value })} />
          </div>
          <div>
            <label className="text-sm font-bold text-[#374151]">Asignatura/Subarea</label>
            <input className="mt-2 w-full rounded-lg border border-[#D1D5DB] px-3 py-2" value={draft.course.subjectName} onChange={(event) => updateCourse({ subjectName: event.target.value })} />
            <FieldError message={errors.subjectName} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-bold text-[#374151]">Codigo opcional</label>
            <input className="mt-2 w-full rounded-lg border border-[#D1D5DB] px-3 py-2" value={draft.course.subjectCode} onChange={(event) => updateCourse({ subjectCode: event.target.value })} />
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4 text-sm text-[#374151]">
        <div className="rounded-lg bg-[#F8FAFC] p-4"><strong>Docente:</strong> {knownFullName || draft.fullName}</div>
        <div className="rounded-lg bg-[#F8FAFC] p-4"><strong>Centro:</strong> {draft.schoolName}</div>
        <div className="rounded-lg bg-[#F8FAFC] p-4"><strong>Nivel:</strong> {labelsFor(levelOptions, draft.levels)}</div>
        <div className="rounded-lg bg-[#F8FAFC] p-4"><strong>Tanda:</strong> {labelsFor(shiftOptions, draft.shifts)}</div>
        <div className="rounded-lg bg-[#F8FAFC] p-4"><strong>Modalidad:</strong> {labelsFor(modalityOptions, draft.modalities)}</div>
        <div className="rounded-lg bg-[#F8FAFC] p-4"><strong>Ano escolar:</strong> {draft.schoolYearName}</div>
        <div className="rounded-lg bg-[#F8FAFC] p-4"><strong>Periodos:</strong> {draft.periods.map((period) => period.name).join(', ')}</div>
        <div className="rounded-lg bg-[#F8FAFC] p-4"><strong>Primer curso:</strong> {draft.course.gradeName} {draft.course.sectionName} - {draft.course.subjectName}</div>
      </div>
    )
  }

  const stepTitles = [
    'Datos del docente y centro',
    'Nivel, tanda y modalidad',
    'Ano escolar y periodos',
    'Primer curso/asignatura',
    'Confirmacion',
  ]

  return (
    <main className="relative min-h-screen overflow-hidden text-[#111827]">
      <DashboardPreview />
      <div className="absolute inset-0 bg-[#111827]/35" />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-6">
        <form onSubmit={handleSubmit} className="w-full max-w-3xl rounded-lg border border-white/60 bg-white p-5 shadow-2xl md:p-6">
          <StepProgress step={step} />
          <div className="mt-5">
            <h1 className="text-xl font-black text-[#111827]">{stepTitles[step]}</h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              Completa esta configuracion inicial para preparar AulaBase.
            </p>
          </div>
          {submitError ? (
            <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {submitError}
            </div>
          ) : null}
          <div className="mt-5 max-h-[58vh] overflow-y-auto pr-1">
            {renderStep()}
          </div>
          <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#E5E7EB] pt-4">
            <button type="button" onClick={goBack} disabled={step === 0 || submitting} className="rounded-lg px-4 py-2 text-sm font-bold text-[#374151] disabled:opacity-40">
              Atras
            </button>
            {step < totalSteps - 1 ? (
              <button type="button" onClick={goNext} className="rounded-lg bg-[#1F4E5F] px-5 py-2 text-sm font-bold text-white">
                Siguiente
              </button>
            ) : (
              <button type="submit" disabled={submitting} className="rounded-lg bg-[#1F4E5F] px-5 py-2 text-sm font-bold text-white disabled:opacity-60">
                {submitting ? 'Guardando...' : 'Entrar a AulaBase'}
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  )
}
