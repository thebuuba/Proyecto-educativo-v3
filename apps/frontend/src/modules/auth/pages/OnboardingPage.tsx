import {
  Sparkles,
} from 'lucide-react'
import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'

import { SchoolSearchInput } from '@/modules/auth/components/SchoolSearchInput'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import type { CompleteOnboardingInput } from '@/modules/auth/types/auth'
import { FLOATING_ICONS } from '@/components/auth/AuthIcons'

const DRAFT_KEY = 'aulabase:onboarding-draft'
const REGISTRATION_NAME_KEY = 'aulabase:registration-name'
const totalSteps = 3
const inputClass = 'mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 transition-all focus:border-[#1E3D8F] focus:outline-none focus:ring-2 focus:ring-[#1E3D8F]/10'
const labelClass = 'text-sm font-semibold text-gray-700'
const optionRowClass = 'grid gap-3 py-4 md:grid-cols-[150px_1fr] md:items-start'
const optionListClass = 'flex flex-wrap gap-2'

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

function toIsoDate(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function detectSchoolYear(date = new Date()) {
  const startYear = date.getMonth() >= 6 ? date.getFullYear() : date.getFullYear() - 1
  const endYear = startYear + 1

  return {
    schoolYearName: `${startYear}-${endYear}`,
    schoolStartDate: toIsoDate(startYear, 7, 1),
    schoolEndDate: toIsoDate(endYear, 6, 30),
    periods: [
      { name: 'Periodo 1', startDate: toIsoDate(startYear, 7, 1), endDate: toIsoDate(startYear, 12, 15) },
      { name: 'Periodo 2', startDate: toIsoDate(endYear, 1, 8), endDate: toIsoDate(endYear, 3, 31) },
      { name: 'Periodo 3', startDate: toIsoDate(endYear, 4, 1), endDate: toIsoDate(endYear, 6, 30) },
    ],
  }
}

function createInitialDraft(fullName = ''): OnboardingDraft {
  const schoolYear = detectSchoolYear()

  return {
    fullName,
    schoolName: '',
    levels: ['secondary'],
    shifts: ['extended'],
    modalities: ['regular'],
    ...schoolYear,
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
      schoolYearName: initialDraft.schoolYearName,
      schoolStartDate: initialDraft.schoolStartDate,
      schoolEndDate: initialDraft.schoolEndDate,
      periods: initialDraft.periods,
      course: { ...initialDraft.course, ...parsed.course },
    }
  } catch {
    return initialDraft
  }
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
  const navigate = useNavigate()
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
  const [showWelcome, setShowWelcome] = useState(false)

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

  useEffect(() => {
    if (!showWelcome) return
    const timeout = window.setTimeout(() => {
      navigate('/inicio', { replace: true })
    }, 1800)
    return () => window.clearTimeout(timeout)
  }, [navigate, showWelcome])

  if (!showWelcome && !resetMode && !loading && isAuthenticated && onboardingComplete) {
    return <Navigate to="/inicio" replace />
  }

  if (!loading && !isAuthenticated && !profileRequired) {
    return <Navigate to="/registro" replace />
  }

  if (loading) {
    return (
      <main className="page-enter grid min-h-screen place-items-center px-4 text-center text-gray-900" style={{ backgroundColor: '#FAFBFC' }}>
        <div>
          <div
            className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-md"
            style={{ backgroundColor: '#1E3D8F', boxShadow: '0 4px 14px rgba(30,61,143,0.25)' }}
          >
            AB
          </div>
          <p className="text-sm font-semibold text-gray-500">Preparando tu entrada...</p>
        </div>
      </main>
    )
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

  function preventEnter(e: React.KeyboardEvent) {
    if (e.key === 'Enter') e.preventDefault()
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
      setShowWelcome(true)
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
              <input className={inputClass} value={draft.fullName} onChange={(event) => updateDraft({ fullName: event.target.value })} onKeyDown={preventEnter} />
              <FieldError message={errors.fullName} />
            </div>
          )}
          <div>
            <label className={labelClass}>Centro educativo</label>
            <SchoolSearchInput
              value={draft.schoolName}
              onChange={(value) => updateDraft({ schoolName: value })}
              onSelect={(school) => updateDraft({
                schoolName: school.name,
                levels: school.niveles.length ? school.niveles : draft.levels,
                shifts: school.tandas.length ? school.tandas : draft.shifts,
                modalities: school.modalidades.length ? school.modalidades : draft.modalities,
              })}
              placeholder="Busca tu centro educativo"
            />
            <FieldError message={errors.schoolName} />
          </div>
        </div>
      )
    }

    if (step === 1) {
      return (
        <div className="divide-y divide-gray-100">
          <div className={optionRowClass}>
            <h3 className={labelClass}>Nivel</h3>
            <div>
              <div className={optionListClass}>
                {levelOptions.map((option) => (
                  <ChoiceButton key={option.value} active={draft.levels.includes(option.value)} onClick={() => toggleListValue('levels', option.value)}>
                    {option.label}
                  </ChoiceButton>
                ))}
              </div>
              <FieldError message={errors.levels} />
            </div>
          </div>
          <div className={optionRowClass}>
            <h3 className={labelClass}>Tanda</h3>
            <div>
              <div className={optionListClass}>
                {shiftOptions.map((option) => (
                  <ChoiceButton key={option.value} active={draft.shifts.includes(option.value)} onClick={() => toggleListValue('shifts', option.value)}>
                    {option.label}
                  </ChoiceButton>
                ))}
              </div>
              <FieldError message={errors.shifts} />
            </div>
          </div>
          <div className={optionRowClass}>
            <h3 className={labelClass}>Modalidad</h3>
            <div>
              <div className={optionListClass}>
                {modalityOptions.map((option) => (
                  <ChoiceButton key={option.value} active={draft.modalities.includes(option.value)} onClick={() => toggleListValue('modalities', option.value)}>
                    {option.label}
                  </ChoiceButton>
                ))}
              </div>
              <FieldError message={errors.modalities} />
            </div>
          </div>
        </div>
      )
    }

    if (step === 2) {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Grado</label>
            <input className={inputClass} value={draft.course.gradeName} onChange={(event) => updateCourse({ gradeName: event.target.value })} onKeyDown={preventEnter} />
            <FieldError message={errors.gradeName} />
          </div>
          <div>
            <label className={labelClass}>Seccion</label>
            <input className={inputClass} value={draft.course.sectionName} onChange={(event) => updateCourse({ sectionName: event.target.value })} onKeyDown={preventEnter} />
            <FieldError message={errors.sectionName} />
          </div>
          <div>
            <label className={labelClass}>Area</label>
            <input className={inputClass} value={draft.course.area} onChange={(event) => updateCourse({ area: event.target.value })} onKeyDown={preventEnter} />
          </div>
          <div>
            <label className={labelClass}>Asignatura/Subarea</label>
            <input className={inputClass} value={draft.course.subjectName} onChange={(event) => updateCourse({ subjectName: event.target.value })} onKeyDown={preventEnter} />
            <FieldError message={errors.subjectName} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Codigo opcional</label>
            <input className={inputClass} value={draft.course.subjectCode} onChange={(event) => updateCourse({ subjectCode: event.target.value })} onKeyDown={preventEnter} />
          </div>
        </div>
      )
    }

    return null
  }

  const stepTitles = [
    'Datos del docente y centro',
    'Nivel, tanda y modalidad',
    'Primer curso/asignatura',
  ]

  if (showWelcome) {
    return (
      <main className="page-enter relative grid min-h-screen place-items-center overflow-hidden px-4 text-gray-900" style={{ backgroundColor: '#FAFBFC' }}>
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
                opacity: 0.08,
                transform: `translate(-50%, -50%) rotate(${item.rotate}deg)`,
              }}
              strokeWidth={1.5}
            />
          ))}
        </div>

        <div className="relative z-10 flex max-w-md flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 animate-ping rounded-full bg-[#1E3D8F]/20" />
            <div className="relative flex size-20 items-center justify-center rounded-3xl bg-[#1E3D8F] text-white shadow-[0_18px_45px_rgba(30,61,143,0.25)]">
              <Sparkles className="size-9 animate-pulse" strokeWidth={2.2} />
            </div>
          </div>
          <h1 className="animate-bounce text-4xl font-black tracking-tight text-gray-900">Bienvenido</h1>
          <p className="mt-3 text-base font-medium text-gray-500">Tu perfil esta listo. Entrando a Aula Base...</p>
        </div>
      </main>
    )
  }

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
