import {
  Backpack,
  BookOpen,
  Calculator,
  GraduationCap,
  Library,
  Microscope,
  Palette,
  Pencil,
  Ruler,
} from 'lucide-react'
import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'

import { useAuth } from '@/modules/auth/hooks/useAuth'
import type { CompleteOnboardingInput } from '@/modules/auth/types/auth'

const DRAFT_KEY = 'aulabase:onboarding-draft'
const REGISTRATION_NAME_KEY = 'aulabase:registration-name'
const totalSteps = 5
const inputClass = 'mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 transition-all focus:border-[#1E3D8F] focus:outline-none focus:ring-2 focus:ring-[#1E3D8F]/10'
const labelClass = 'text-sm font-semibold text-gray-700'

const FLOATING_ICONS = [
  { Icon: BookOpen, top: '8%', left: '6%', size: 44, rotate: -12 },
  { Icon: Pencil, top: '18%', left: '88%', size: 36, rotate: 22 },
  { Icon: Backpack, top: '72%', left: '8%', size: 48, rotate: 8 },
  { Icon: Calculator, top: '82%', left: '84%', size: 40, rotate: -18 },
  { Icon: Ruler, top: '42%', left: '4%', size: 42, rotate: 45 },
  { Icon: Palette, top: '38%', left: '92%', size: 38, rotate: -25 },
  { Icon: Microscope, top: '58%', left: '90%', size: 40, rotate: 15 },
  { Icon: Library, top: '62%', left: '3%', size: 44, rotate: -8 },
  { Icon: GraduationCap, top: '5%', left: '45%', size: 32, rotate: -6 },
  { Icon: BookOpen, top: '90%', left: '48%', size: 30, rotate: 12 },
]

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
          ? 'border-[#1E3D8F] bg-[#1E3D8F]/10 text-[#1E3D8F]'
          : 'border-gray-200 bg-white text-gray-700 hover:border-[#1E3D8F]/40 hover:bg-[#1E3D8F]/5',
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
              <label className={labelClass}>Nombre del docente</label>
              <input className={inputClass} value={draft.fullName} onChange={(event) => updateDraft({ fullName: event.target.value })} />
              <FieldError message={errors.fullName} />
            </div>
          )}
          <div>
            <label className={labelClass}>Centro educativo</label>
            <input className={inputClass} value={draft.schoolName} onChange={(event) => updateDraft({ schoolName: event.target.value })} />
            <FieldError message={errors.schoolName} />
          </div>
        </div>
      )
    }

    if (step === 1) {
      return (
        <div className="space-y-5">
          <div>
            <h3 className={labelClass}>Nivel en que trabaja</h3>
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
            <h3 className={labelClass}>Tanda</h3>
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
            <h3 className={labelClass}>Modalidad</h3>
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
              <label className={labelClass}>Ano escolar</label>
              <input className={inputClass} value={draft.schoolYearName} onChange={(event) => updateDraft({ schoolYearName: event.target.value })} />
              <FieldError message={errors.schoolYearName} />
            </div>
            <div>
              <label className={labelClass}>Inicio</label>
              <input type="date" className={inputClass} value={draft.schoolStartDate} onChange={(event) => updateDraft({ schoolStartDate: event.target.value })} />
              <FieldError message={errors.schoolStartDate} />
            </div>
            <div>
              <label className={labelClass}>Cierre</label>
              <input type="date" className={inputClass} value={draft.schoolEndDate} onChange={(event) => updateDraft({ schoolEndDate: event.target.value })} />
              <FieldError message={errors.schoolEndDate} />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className={labelClass}>Periodos academicos</h3>
              <button type="button" onClick={addPeriod} className="rounded-lg border border-[#1E3D8F] px-3 py-2 text-sm font-bold text-[#1E3D8F]">Agregar</button>
            </div>
            <FieldError message={errors.periods} />
            {draft.periods.map((period, index) => (
              <div key={index} className="grid gap-2 rounded-lg border border-gray-100 p-3 md:grid-cols-[1fr_1fr_1fr_auto]">
                <div>
                  <input className={inputClass.replace('mt-2 ', '')} value={period.name} onChange={(event) => updatePeriod(index, { name: event.target.value })} />
                  <FieldError message={errors[`period-${index}-name`]} />
                </div>
                <div>
                  <input type="date" className={inputClass.replace('mt-2 ', '')} value={period.startDate} onChange={(event) => updatePeriod(index, { startDate: event.target.value })} />
                  <FieldError message={errors[`period-${index}-startDate`]} />
                </div>
                <div>
                  <input type="date" className={inputClass.replace('mt-2 ', '')} value={period.endDate} onChange={(event) => updatePeriod(index, { endDate: event.target.value })} />
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
            <label className={labelClass}>Grado</label>
            <input className={inputClass} value={draft.course.gradeName} onChange={(event) => updateCourse({ gradeName: event.target.value })} />
            <FieldError message={errors.gradeName} />
          </div>
          <div>
            <label className={labelClass}>Seccion</label>
            <input className={inputClass} value={draft.course.sectionName} onChange={(event) => updateCourse({ sectionName: event.target.value })} />
            <FieldError message={errors.sectionName} />
          </div>
          <div>
            <label className={labelClass}>Area</label>
            <input className={inputClass} value={draft.course.area} onChange={(event) => updateCourse({ area: event.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Asignatura/Subarea</label>
            <input className={inputClass} value={draft.course.subjectName} onChange={(event) => updateCourse({ subjectName: event.target.value })} />
            <FieldError message={errors.subjectName} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Codigo opcional</label>
            <input className={inputClass} value={draft.course.subjectCode} onChange={(event) => updateCourse({ subjectCode: event.target.value })} />
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4 text-sm text-gray-700">
        <div className="rounded-xl bg-gray-50 p-4"><strong>Docente:</strong> {knownFullName || draft.fullName}</div>
        <div className="rounded-xl bg-gray-50 p-4"><strong>Centro:</strong> {draft.schoolName}</div>
        <div className="rounded-xl bg-gray-50 p-4"><strong>Nivel:</strong> {labelsFor(levelOptions, draft.levels)}</div>
        <div className="rounded-xl bg-gray-50 p-4"><strong>Tanda:</strong> {labelsFor(shiftOptions, draft.shifts)}</div>
        <div className="rounded-xl bg-gray-50 p-4"><strong>Modalidad:</strong> {labelsFor(modalityOptions, draft.modalities)}</div>
        <div className="rounded-xl bg-gray-50 p-4"><strong>Ano escolar:</strong> {draft.schoolYearName}</div>
        <div className="rounded-xl bg-gray-50 p-4"><strong>Periodos:</strong> {draft.periods.map((period) => period.name).join(', ')}</div>
        <div className="rounded-xl bg-gray-50 p-4"><strong>Primer curso:</strong> {draft.course.gradeName} {draft.course.sectionName} - {draft.course.subjectName}</div>
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
    <main className="page-enter relative min-h-screen overflow-hidden px-4 py-10 text-gray-900" style={{ backgroundColor: '#FAFBFC' }}>
      <div className="pointer-events-none absolute inset-0">
        {FLOATING_ICONS.map((item, i) => (
          <item.Icon
            key={i}
            style={{
              position: 'absolute',
              top: item.top,
              left: item.left,
              width: item.size,
              height: item.size,
              color: '#1E3D8F',
              opacity: 0.06,
              transform: `translate(-50%, -50%) rotate(${item.rotate}deg)`,
            }}
            strokeWidth={1.5}
          />
        ))}
        <div
          className="absolute rounded-full blur-3xl"
          style={{
            top: '-10%',
            right: '-10%',
            width: 500,
            height: 500,
            background: 'radial-gradient(circle, rgba(30,61,143,0.08) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full blur-3xl"
          style={{
            bottom: '-15%',
            left: '-10%',
            width: 500,
            height: 500,
            background: 'radial-gradient(circle, rgba(30,61,143,0.06) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl flex-col justify-center">
        <div className="mb-8 flex flex-col items-center">
          <div
            className="mb-4 flex size-14 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-md"
            style={{ backgroundColor: '#1E3D8F', boxShadow: '0 4px 14px rgba(30,61,143,0.25)' }}
          >
            AB
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Aula Base</h1>
          <p className="mt-1 text-sm text-gray-500">Configurando tu entrada al sistema</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full rounded-2xl border border-gray-100 bg-white/95 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.10)] md:p-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{stepTitles[step]}</h2>
            <p className="mt-1 text-sm text-gray-500">
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
          <div className="mt-6 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
            <button type="button" onClick={goBack} disabled={step === 0 || submitting} className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-40">
              Atras
            </button>
            {step < totalSteps - 1 ? (
              <button type="button" onClick={goNext} className="rounded-xl bg-[#1E3D8F] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-100 hover:opacity-90 active:scale-[0.94] active:shadow-none">
                Siguiente
              </button>
            ) : (
              <button type="submit" disabled={submitting} className="rounded-xl bg-[#1E3D8F] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-100 hover:opacity-90 active:scale-[0.94] active:shadow-none disabled:opacity-60">
                {submitting ? 'Guardando...' : 'Entrar a AulaBase'}
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  )
}
