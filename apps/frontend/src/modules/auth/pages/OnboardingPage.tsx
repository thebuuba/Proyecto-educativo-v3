import { Check, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'

import { FLOATING_ICONS } from '@/components/auth/AuthIcons'
import { SchoolSearchInput } from '@/modules/auth/components/SchoolSearchInput'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import type { CompleteOnboardingInput } from '@/modules/auth/types/auth'

const DRAFT_KEY = 'aulabase:onboarding-draft'
const REGISTRATION_NAME_KEY = 'aulabase:registration-name'
const totalSteps = 2
const inputClass = 'auth-input mt-2'
const labelClass = 'text-sm font-semibold text-foreground'
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
]

const shiftOptionValues = new Set(shiftOptions.map((option) => option.value))

function getAllowedShifts(shifts?: string[]) {
  return (shifts ?? []).filter((shift) => shiftOptionValues.has(shift))
}

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
}

type StepErrors = Record<string, string>

function toIsoDate(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function detectSchoolYear(date = new Date()) {
  const startYear = date.getMonth() >= 6 ? date.getFullYear() : date.getFullYear() - 1
  return createSchoolYear(startYear)
}

function createSchoolYear(startYear: number) {
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

const defaultSchoolYearStart = Number(detectSchoolYear().schoolYearName.split('-')[0])
const schoolYearOptions = Array.from({ length: 5 }, (_, index) => {
  const startYear = defaultSchoolYearStart - 1 + index
  const endYear = startYear + 1
  const value = `${startYear}-${endYear}`
  return { value, label: value, startYear }
})

function getSchoolYearByName(name?: string) {
  const option = schoolYearOptions.find((item) => item.value === name)
  return createSchoolYear(option?.startYear ?? defaultSchoolYearStart)
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
  }
}

function loadDraft(fallbackFullName = ''): OnboardingDraft {
  const initialDraft = createInitialDraft(fallbackFullName)
  try {
    const rawDraft = localStorage.getItem(DRAFT_KEY)
    if (!rawDraft) return initialDraft
    const parsed = JSON.parse(rawDraft) as Partial<OnboardingDraft> & { level?: string; schoolYearName?: string }
    return {
      ...initialDraft,
      ...parsed,
      fullName: parsed.fullName?.trim() || fallbackFullName || initialDraft.fullName,
      levels: parsed.level ? [parsed.level] : parsed.levels?.length ? parsed.levels : initialDraft.levels,
      shifts: getAllowedShifts(parsed.shifts).length ? getAllowedShifts(parsed.shifts) : initialDraft.shifts,
      modalities: parsed.modalities?.length ? parsed.modalities : initialDraft.modalities,
      ...getSchoolYearByName(parsed.schoolYearName),
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
  }
}

function validateStep(step: number, draft: OnboardingDraft): StepErrors {
  const errors: StepErrors = {}
  if (step === 0) {
    if (!draft.fullName.trim()) errors.fullName = 'Escribe el nombre del docente.'
    if (!draft.schoolYearName.trim()) errors.schoolYearName = 'Selecciona el año escolar.'
    if (!draft.schoolName.trim()) errors.schoolName = 'Escribe el centro educativo.'
  }
  if (step === 1) {
    if (!draft.levels.length) errors.levels = 'Selecciona al menos un nivel.'
    if (!draft.shifts.length) errors.shifts = 'Selecciona al menos una tanda.'
    if (!draft.modalities.length) errors.modalities = 'Selecciona al menos una modalidad.'
  }
  return errors
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-xs font-semibold text-foreground"><span className="mr-1 inline-block size-1.5 rounded-full bg-destructive" />{message}</p> : null
}

function ChoiceButton({ active, children, onClick }: { active: boolean; children: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${active ? 'border-primary/35 bg-primary/12 text-foreground' : 'border-border bg-card text-muted-foreground hover:bg-muted'}`}
    >
      <span className="inline-flex items-center gap-1.5">
        {active ? <Check className="size-3.5" /> : null}
        {children}
      </span>
    </button>
  )
}

export function OnboardingPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const resetMode = searchParams.get('reset') === '1'
  const { appUser, completeOnboarding, isAuthenticated, loading, profileRequired, onboardingComplete } = useAuth()
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
    const timeout = window.setTimeout(() => navigate('/inicio', { replace: true }), 1800)
    return () => window.clearTimeout(timeout)
  }, [navigate, showWelcome])

  if (!showWelcome && !resetMode && !loading && isAuthenticated && onboardingComplete) return <Navigate to="/inicio" replace />
  if (!loading && !isAuthenticated && !profileRequired) return <Navigate to="/registro" replace />

  if (loading) {
    return (
      <main className="page-enter grid min-h-screen place-items-center bg-background px-4 text-center text-foreground">
        <div>
          <BrandMark />
          <p className="mt-3 text-sm font-semibold text-muted-foreground">Preparando tu entrada...</p>
        </div>
      </main>
    )
  }

  function updateDraft(patch: Partial<OnboardingDraft>) {
    setDraft((current) => ({ ...current, ...patch }))
  }

  function updateSchoolYear(schoolYearName: string) {
    setDraft((current) => ({ ...current, ...getSchoolYearByName(schoolYearName) }))
  }

  function toggleListValue(key: 'levels' | 'shifts' | 'modalities', value: string) {
    setDraft((current) => {
      const values = current[key]
      const nextValues = values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
      return { ...current, [key]: nextValues }
    })
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

  function preventEnter(event: React.KeyboardEvent) {
    if (event.key === 'Enter') event.preventDefault()
  }

  async function handleSubmit() {
    setSubmitError('')
    for (let stepIndex = 0; stepIndex < totalSteps; stepIndex += 1) {
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
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'No se pudo completar la configuración.')
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
            <label className={labelClass}>Año escolar</label>
            <select className={inputClass} value={draft.schoolYearName} onChange={(event) => updateSchoolYear(event.target.value)}>
              {schoolYearOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <FieldError message={errors.schoolYearName} />
          </div>
          <div>
            <label className={labelClass}>Centro educativo</label>
            <SchoolSearchInput
              value={draft.schoolName}
              onChange={(value) => updateDraft({ schoolName: value })}
              onSelect={(school) => updateDraft({
                schoolName: school.name,
                levels: school.niveles.length ? school.niveles : draft.levels,
                shifts: getAllowedShifts(school.tandas).length ? getAllowedShifts(school.tandas) : draft.shifts,
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
        <div className="divide-y divide-border">
          <OptionGroup label="Nivel" error={errors.levels}>{levelOptions.map((option) => <ChoiceButton key={option.value} active={draft.levels.includes(option.value)} onClick={() => toggleListValue('levels', option.value)}>{option.label}</ChoiceButton>)}</OptionGroup>
          <OptionGroup label="Tanda" error={errors.shifts}>{shiftOptions.map((option) => <ChoiceButton key={option.value} active={draft.shifts.includes(option.value)} onClick={() => toggleListValue('shifts', option.value)}>{option.label}</ChoiceButton>)}</OptionGroup>
          <OptionGroup label="Modalidad" error={errors.modalities}>{modalityOptions.map((option) => <ChoiceButton key={option.value} active={draft.modalities.includes(option.value)} onClick={() => toggleListValue('modalities', option.value)}>{option.label}</ChoiceButton>)}</OptionGroup>
        </div>
      )
    }
    return null
  }

  const stepTitles = ['Datos del docente y centro', 'Nivel, tanda y modalidad']

  if (showWelcome) {
    return (
      <main className="page-enter relative grid min-h-screen place-items-center overflow-hidden bg-background px-4 text-foreground">
        <AuthBackdrop opacity={0.07} />
        <div className="relative z-10 flex max-w-md flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 animate-ping rounded-3xl bg-success/20" />
            <div className="relative flex size-20 items-center justify-center rounded-3xl bg-success/24 text-foreground shadow-lg">
              <Sparkles className="size-9 animate-pulse" strokeWidth={2.2} />
              <span className="absolute -right-1 -top-1 size-4 rounded-full bg-warning" />
            </div>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">Bienvenido</h1>
          <p className="mt-3 text-base font-medium text-muted-foreground">Tu perfil está listo. Entrando a Aula Base...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="page-enter relative min-h-screen overflow-hidden bg-background px-4 py-10 text-foreground">
      <AuthBackdrop />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl flex-col justify-center">
        <div className="mb-6 flex flex-col items-center">
          <BrandMark />
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground">Aula Base</h1>
          <p className="mt-1 text-sm text-muted-foreground">Configurando tu espacio docente</p>
        </div>

        <form onSubmit={(event) => event.preventDefault()} className="dashboard-warm-shadow w-full rounded-3xl bg-card p-5 md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-secondary">Configuración inicial</p>
              <h2 className="mt-1 text-xl font-extrabold text-foreground">{stepTitles[step]}</h2>
            </div>
            <StepProgress step={step} />
          </div>

          {submitError ? <div className="mt-4 rounded-2xl border border-destructive/25 bg-destructive/14 px-4 py-3 text-sm font-semibold text-foreground">{submitError}</div> : null}

          <div className="mt-5 max-h-[58vh] overflow-y-auto pr-1">{renderStep()}</div>

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
            <button type="button" onClick={goBack} disabled={step === 0 || submitting} className="rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted disabled:opacity-40">Atrás</button>
            {step < totalSteps - 1 ? (
              <button type="button" onClick={goNext} className="rounded-xl bg-primary px-5 py-3 text-sm font-extrabold text-primary-foreground shadow-sm transition hover:bg-primary-hover active:scale-[0.985]">Siguiente</button>
            ) : (
              <button type="button" onClick={() => void handleSubmit()} disabled={submitting} className="rounded-xl bg-primary px-5 py-3 text-sm font-extrabold text-primary-foreground shadow-sm transition hover:bg-primary-hover active:scale-[0.985] disabled:opacity-60">{submitting ? 'Guardando...' : 'Entrar a AulaBase'}</button>
            )}
          </div>
        </form>
      </div>
    </main>
  )
}

function OptionGroup({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div className={optionRowClass}><h3 className={labelClass}>{label}</h3><div><div className={optionListClass}>{children}</div><FieldError message={error} /></div></div>
}

function StepProgress({ step }: { step: number }) {
  return <div className="flex items-center gap-2" aria-label={`Paso ${step + 1} de ${totalSteps}`}>
    {Array.from({ length: totalSteps }, (_, index) => {
      const completed = index < step
      const active = index === step
      return <span key={index} className={`flex size-8 items-center justify-center rounded-full text-xs font-extrabold ${completed ? 'bg-success/24 text-foreground' : active ? 'bg-primary/16 text-foreground' : 'bg-muted text-muted-foreground'}`}>{completed ? <Check className="size-4" /> : index + 1}</span>
    })}
  </div>
}

function BrandMark() {
  return <div className="relative mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/16 text-lg font-extrabold text-foreground"><span>AB</span><span className="absolute -right-1 -top-1 size-3 rounded-full bg-warning" /></div>
}

function AuthBackdrop({ opacity = 0.055 }: { opacity?: number }) {
  return <div className="pointer-events-none absolute inset-0">
    {FLOATING_ICONS.map((item, index) => <item.Icon key={index} style={{ position: 'absolute', top: item.top, left: item.left, width: item.size, height: item.size, color: 'var(--primary)', opacity, transform: `translate(-50%, -50%) rotate(${item.rotate}deg)` }} strokeWidth={1.5} />)}
    <div className="absolute -right-32 -top-32 size-[30rem] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--primary) 18%, transparent) 0%, transparent 70%)' }} />
    <div className="absolute -bottom-36 -left-32 size-[30rem] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--warning) 16%, transparent) 0%, transparent 70%)' }} />
  </div>
}
