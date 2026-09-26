import { ArrowRight, Building2, CalendarDays, Check, ClipboardCheck, ChevronDown, ChevronLeft, Clock3, GraduationCap, Layers, LogOut, Pencil, School, Sparkles, UserRound, UsersRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'

import { FLOATING_ICONS } from '@/components/auth/AuthIcons'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatSchoolLocation, SchoolSearchInput, type SchoolResult } from '@/modules/auth/components/SchoolSearchInput'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { AccessFooter } from '@/modules/auth/components/RegistrationLayout'
import { supabase } from '@/modules/auth/services/supabaseClient'
import type { CompleteOnboardingInput } from '@/modules/auth/types/auth'

const REGISTRATION_NAME_KEY = 'aulabase:registration-name'
const totalSteps = 3

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
const modalityOptions = [
  { value: 'regular', label: 'Educación regular' },
  { value: 'adultos', label: 'Jóvenes y adultos' },
  { value: 'other', label: 'Otra oferta' },
]

type SchoolYearDraft = { name: string; startDate: string; endDate: string; historical: boolean }
type OnboardingDraft = {
  fullName: string
  schoolQuery: string
  selectedSchool: SchoolResult | null
  schoolYear: SchoolYearDraft
  levels: string[]
  shifts: string[]
  modalities: string[]
  correctingOffer: boolean
}
type StepErrors = Record<string, string>

function toIsoDate(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

// eslint-disable-next-line react-refresh/only-export-components
export function resolveCurrentSchoolYear(date = new Date()): SchoolYearDraft {
  const startYear = date.getMonth() >= 6 ? date.getFullYear() : date.getFullYear() - 1
  return {
    name: `${startYear}-${startYear + 1}`,
    startDate: toIsoDate(startYear, 7, 1),
    endDate: toIsoDate(startYear + 1, 6, 30),
    historical: false,
  }
}

function previousSchoolYear(current: SchoolYearDraft): SchoolYearDraft {
  const startYear = Number(current.name.split('-')[0]) - 1
  return { name: `${startYear}-${startYear + 1}`, startDate: toIsoDate(startYear, 7, 1), endDate: toIsoDate(startYear + 1, 6, 30), historical: true }
}

function currentYearFromSchool(school: SchoolResult): SchoolYearDraft | null {
  if (!school.schoolYearName || !school.schoolYearStartDate || !school.schoolYearEndDate) return null
  return {
    name: school.schoolYearName,
    startDate: school.schoolYearStartDate.slice(0, 10),
    endDate: school.schoolYearEndDate.slice(0, 10),
    historical: false,
  }
}

function createInitialDraft(fullName = ''): OnboardingDraft {
  return { fullName, schoolQuery: '', selectedSchool: null, schoolYear: resolveCurrentSchoolYear(), levels: [], shifts: [], modalities: [], correctingOffer: false }
}

function optionLabel(options: Array<{ value: string; label: string }>, value: string) {
  return options.find((option) => option.value === value)?.label ?? value
}

function availableValues(official: string[] | undefined, options: Array<{ value: string }>, correcting: boolean) {
  const validOfficial = (official ?? []).filter((value) => options.some((option) => option.value === value))
  return correcting || !validOfficial.length ? options.map((option) => option.value) : validOfficial
}

function validateStep(step: number, draft: OnboardingDraft): StepErrors {
  const errors: StepErrors = {}
  if (step === 0) {
    if (!draft.fullName.trim()) errors.fullName = 'Confirma el nombre del docente.'
    if (!draft.schoolYear.name) errors.schoolYear = 'No pudimos determinar el año escolar vigente.'
    if (!draft.selectedSchool?.id) errors.school = 'Selecciona un centro de la lista de resultados.'
  }
  if (step === 1) {
    if (!draft.levels.length) errors.levels = 'Selecciona al menos un nivel.'
    if (!draft.shifts.length) errors.shifts = 'Selecciona al menos una tanda.'
    if (!draft.modalities.length) errors.modalities = 'Selecciona el tipo de oferta en el que trabajarás.'
  }
  return errors
}

export function OnboardingPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const resetMode = searchParams.get('reset') === '1'
  const { appUser, completeOnboarding, isAuthenticated, loading, profileRequired, onboardingComplete, logout } = useAuth()
  const registrationName = localStorage.getItem(REGISTRATION_NAME_KEY)?.trim() || ''
  const [draft, setDraft] = useState(() => createInitialDraft(appUser?.fullName || registrationName))
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<StepErrors>({})
  const [editingName, setEditingName] = useState(!draft.fullName)
  const [showHistorical, setShowHistorical] = useState(draft.schoolYear.historical)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    if (draft.fullName) return
    void supabase.auth.getUser().then(({ data }) => {
      const metadataName = String(data.user?.user_metadata?.full_name ?? data.user?.user_metadata?.name ?? '').trim()
      if (metadataName) setDraft((current) => ({ ...current, fullName: metadataName }))
    })
  }, [draft.fullName])

  useEffect(() => {
    if (!resetMode) return
    const resetDraft = createInitialDraft(appUser?.fullName || registrationName)
    setDraft(resetDraft)
    setStep(0)
    setErrors({})
  }, [appUser?.fullName, registrationName, resetMode])

  useEffect(() => {
    if (!showWelcome) return
    const timeout = window.setTimeout(() => navigate('/inicio', { replace: true }), 1400)
    return () => window.clearTimeout(timeout)
  }, [navigate, showWelcome])

  const school = draft.selectedSchool
  const allowedLevels = useMemo(() => availableValues(school?.niveles, levelOptions, draft.correctingOffer), [draft.correctingOffer, school?.niveles])
  const allowedShifts = useMemo(() => availableValues(school?.tandas, shiftOptions, draft.correctingOffer), [draft.correctingOffer, school?.tandas])
  const allowedModalities = useMemo(() => availableValues(school?.modalidades, modalityOptions, draft.correctingOffer), [draft.correctingOffer, school?.modalidades])

  if (!showWelcome && !resetMode && !loading && isAuthenticated && onboardingComplete) return <Navigate to="/inicio" replace />
  if (!loading && !isAuthenticated && !profileRequired) return <Navigate to="/registro" replace />
  if (loading) return <LoadingScreen />

  function update(patch: Partial<OnboardingDraft>) {
    setDraft((current) => ({ ...current, ...patch }))
  }

  function selectSchool(selected: SchoolResult) {
    const modalities = availableValues(selected.modalidades, modalityOptions, false)
    update({
      selectedSchool: selected,
      schoolQuery: selected.name,
      schoolYear: currentYearFromSchool(selected) ?? resolveCurrentSchoolYear(),
      levels: [],
      shifts: [],
      modalities: modalities.length === 1 ? modalities : [],
      correctingOffer: false,
    })
    setErrors((current) => ({ ...current, school: '' }))
  }

  function changeSchoolQuery(value: string) {
    setDraft((current) => ({ ...current, schoolQuery: value, selectedSchool: value === current.selectedSchool?.name ? current.selectedSchool : null }))
  }

  function toggleValue(key: 'levels' | 'shifts' | 'modalities', value: string) {
    setDraft((current) => ({ ...current, [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value] }))
  }

  function goNext() {
    const nextErrors = validateStep(step, draft)
    setErrors(nextErrors)
    setSubmitError('')
    if (Object.keys(nextErrors).length) return
    setStep((current) => Math.min(current + 1, totalSteps - 1))
  }

  async function submit() {
    const allErrors = { ...validateStep(0, draft), ...validateStep(1, draft) }
    if (Object.keys(allErrors).length || !school) {
      setErrors(allErrors)
      setStep(allErrors.fullName || allErrors.school ? 0 : 1)
      return
    }
    const input: CompleteOnboardingInput = {
      fullName: draft.fullName.trim(),
      school: { id: school.id, name: school.name },
      schoolYear: { name: draft.schoolYear.name, startDate: draft.schoolYear.startDate, endDate: draft.schoolYear.endDate },
      teacherContext: { levels: draft.levels, shifts: draft.shifts, modalities: draft.modalities },
    }
    setSubmitting(true)
    setSubmitError('')
    try {
      await completeOnboarding(input)
      localStorage.removeItem(REGISTRATION_NAME_KEY)
      setShowWelcome(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'No se pudo completar la configuración. Intenta nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (showWelcome) return <WelcomeScreen />

  return (
    <main className="setup-shell page-enter">
      <header className="setup-header">
        <div className="setup-header-inner">
          <div className="setup-brand"><span><GraduationCap size={21} /></span><div><strong>Aula Base</strong><small>Configuración inicial</small></div></div>
          <button type="button" className="setup-exit" disabled={submitting} onClick={() => { setSubmitting(true); void logout().then(() => navigate('/login', { replace: true })).catch(() => { setSubmitError('No se pudo cerrar la sesión. Intenta nuevamente.'); setSubmitting(false) }) }}><LogOut size={14} />Salir</button>
        </div>
      </header>
      <div className="setup-content">
        <OnboardingStepper step={step} />
        <section>
          <div>
            {step === 0 ? <CenterStep draft={draft} errors={errors} editingName={editingName} setEditingName={setEditingName} showHistorical={showHistorical} setShowHistorical={setShowHistorical} update={update} changeSchoolQuery={changeSchoolQuery} selectSchool={selectSchool} /> : null}
            {step === 1 && school ? <ContextStep draft={draft} school={school} errors={errors} allowedLevels={allowedLevels} allowedShifts={allowedShifts} allowedModalities={allowedModalities} toggleValue={toggleValue} update={update} /> : null}
            {step === 2 && school ? <ConfirmationStep draft={draft} school={school} /> : null}
          </div>

          {submitError ? <div role="alert" className="mt-5 rounded-2xl border border-destructive/25 bg-destructive/12 px-4 py-3 text-sm font-semibold">{submitError}</div> : null}

          <footer className="setup-actions">
            {step > 0 && <Button variant="ghost" onClick={() => { setErrors({}); setSubmitError(''); setStep((current) => Math.max(0, current - 1)) }} disabled={submitting}>
              <ChevronLeft className="size-4" />{step === 2 ? 'Volver y editar' : 'Atrás'}
            </Button>}
            {step < 2 ? <Button onClick={goNext}>Continuar<ArrowRight size={16} /></Button> : <Button loading={submitting} onClick={() => void submit()}>{submitting ? 'Entrando a AulaBase…' : 'Entrar a AulaBase'}</Button>}
          </footer>
        </section>
        <AccessFooter />
      </div>
    </main>
  )
}

function CenterStep({ draft, errors, editingName, setEditingName, showHistorical, setShowHistorical, update, changeSchoolQuery, selectSchool }: {
  draft: OnboardingDraft; errors: StepErrors; editingName: boolean; setEditingName: (value: boolean) => void; showHistorical: boolean; setShowHistorical: (value: boolean) => void; update: (patch: Partial<OnboardingDraft>) => void; changeSchoolQuery: (value: string) => void; selectSchool: (school: SchoolResult) => void
}) {
  const current = resolveCurrentSchoolYear()
  return <div>
    <StepHeading title="Tu centro educativo" description="Confirma tus datos y selecciona el centro donde trabajas." />
    <section className="setup-card">
      <div className="setup-card-heading"><span><UserRound size={18} /></span><div><h2>Tus datos</h2><p>Así aparecerás en Aula Base.</p></div></div>
      <div className="setup-personal-grid">
      <div className="setup-personal-card setup-teacher">
        <span className="setup-teacher-avatar">{draft.fullName.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase() || <UserRound size={20} />}</span>
        <div className="setup-teacher-name"><small>DOCENTE · DEL REGISTRO</small>
        {editingName || !draft.fullName ? <div><Input aria-label="Nombre del docente" autoFocus={!draft.fullName} value={draft.fullName} onChange={(event) => update({ fullName: event.target.value })} placeholder="Tu nombre completo" /><FieldError message={errors.fullName} /></div> : <strong title={draft.fullName}>{draft.fullName}</strong>}</div>
        <Button variant="outline" size="sm" onClick={() => setEditingName(!editingName)}>{editingName ? <Check size={14} /> : <Pencil size={14} />}{editingName ? 'Listo' : 'Editar'}</Button>
      </div>
      <div className="setup-personal-card setup-year">
        <div className="setup-year-heading"><span><CalendarDays size={21} /></span><div><small>AÑO ESCOLAR</small><p><strong>{draft.schoolYear.name.replace('-', '–')}</strong><span className={draft.schoolYear.historical ? 'is-historical' : ''}>{draft.schoolYear.historical ? 'Histórico' : 'Actual'}</span></p></div></div>
        <button type="button" className="setup-year-toggle" aria-expanded={showHistorical} onClick={() => { const next = !showHistorical; setShowHistorical(next); if (!next) update({ schoolYear: draft.selectedSchool ? currentYearFromSchool(draft.selectedSchool) ?? current : current }) }}>¿Necesitas trabajar con información de otro año?<ChevronDown size={14} /></button>
        {showHistorical ? <div className="mt-3 rounded-xl border border-warning/45 bg-warning/10 p-3"><button type="button" aria-pressed={draft.schoolYear.historical} onClick={() => update({ schoolYear: previousSchoolYear(current) })} className={`w-full rounded-lg border px-3 py-2 text-sm font-bold ${draft.schoolYear.historical ? 'border-primary bg-primary/10' : 'border-border bg-card'}`}>{previousSchoolYear(current).name.replace('-', '–')}</button><p className="mt-2 text-xs leading-5 text-muted-foreground">Utiliza esta opción solo para migrar o registrar información anterior.</p></div> : null}
        <FieldError message={errors.schoolYear} />
      </div>
      </div>
    </section>

    <section className="setup-card">
      <div className="setup-card-heading"><span><Building2 size={18} /></span><div><h2><label htmlFor="school-search">Centro educativo</label></h2><p>Busca y selecciona el centro donde trabajas.</p></div></div>
      {draft.selectedSchool ? <SelectedSchoolCard school={draft.selectedSchool} onChange={() => update({ selectedSchool: null, schoolQuery: '', levels: [], shifts: [], modalities: [] })} /> : <SchoolSearchInput value={draft.schoolQuery} onChange={changeSchoolQuery} onSelect={selectSchool} error={errors.school} />}
    </section>
  </div>
}

function ContextStep({ draft, school, errors, allowedLevels, allowedShifts, allowedModalities, toggleValue, update }: {
  draft: OnboardingDraft; school: SchoolResult; errors: StepErrors; allowedLevels: string[]; allowedShifts: string[]; allowedModalities: string[]; toggleValue: (key: 'levels' | 'shifts' | 'modalities', value: string) => void; update: (patch: Partial<OnboardingDraft>) => void
}) {
  return <div>
    <StepHeading title="Tu contexto académico" description="Confirma la oferta del centro e indícanos dónde trabajarás." />
    <section className="setup-card setup-offer">
      <div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary"><School className="size-5" /></span><div><h3 className="font-extrabold">Oferta del centro</h3><p className="mt-1 text-xs text-muted-foreground">Esta información corresponde a {school.name}.</p></div></div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <OfferItem label="Niveles educativos" values={school.niveles} options={levelOptions} />
        <OfferItem label="Tandas" values={school.tandas} options={shiftOptions} />
        <OfferItem label="Tipo de oferta" values={school.modalidades} options={modalityOptions} />
      </div>
      <button type="button" className="mt-4 text-xs font-bold text-primary hover:underline" onClick={() => update({ correctingOffer: !draft.correctingOffer, levels: [], shifts: [], modalities: [] })}>¿La información del centro no coincide?</button>
      {draft.correctingOffer ? <p className="mt-2 text-xs leading-5 text-muted-foreground">Puedes indicar tu contexto real. Esto no modificará la ficha oficial del centro.</p> : null}
    </section>

    <section className="setup-card setup-workspace">
      <div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary"><UserRound className="size-5" /></span><div><h3 className="font-extrabold">Tu espacio de trabajo</h3><p className="mt-1 text-sm text-muted-foreground">Selecciona los niveles y las tandas en los que trabajarás.</p></div></div>
      <div className="mt-4 space-y-3">
        <ChoiceGroup icon={GraduationCap} title="Nivel" values={allowedLevels} selected={draft.levels} options={levelOptions} onToggle={(value) => toggleValue('levels', value)} error={errors.levels} />
        <ChoiceGroup icon={Clock3} title="Tanda en la que trabajas" values={allowedShifts} selected={draft.shifts} options={shiftOptions} onToggle={(value) => toggleValue('shifts', value)} error={errors.shifts} />
        {allowedModalities.length === 1 ? <ReadOnlyChoice icon={UsersRound} title="Tipo de oferta" value={optionLabel(modalityOptions, allowedModalities[0])} /> : <ChoiceGroup icon={UsersRound} title="Tipo de oferta" values={allowedModalities} selected={draft.modalities} options={modalityOptions} onToggle={(value) => toggleValue('modalities', value)} error={errors.modalities} />}
      </div>
    </section>
  </div>
}

function ConfirmationStep({ draft, school }: { draft: OnboardingDraft; school: SchoolResult }) {
  return <div>
    <StepHeading title="Revisa tu configuración" description="Confirma que todo esté correcto antes de comenzar." />
    <div className="setup-card overflow-hidden !p-0">
      <div className="bg-primary/8 px-5 py-3 text-xs font-extrabold uppercase tracking-[0.16em] text-primary">Tu espacio en AulaBase</div>
      <div className="grid gap-0 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <div className="space-y-5 p-5"><SummaryItem label="Docente" value={draft.fullName} /><SummaryItem label="Año escolar" value={draft.schoolYear.name.replace('-', '–')} badge={draft.schoolYear.historical ? 'Histórico' : 'Actual'} /><SummaryItem label="Centro educativo" value={school.name} details={[...formatSchoolLocation(school), school.centerCode ? `Código ${school.centerCode}` : null]} /></div>
        <div className="space-y-5 p-5"><SummaryItem label="Oferta del centro" value={(school.niveles ?? []).map((value) => optionLabel(levelOptions, value)).join(' · ') || 'Sin información registrada'} details={[(school.tandas ?? []).map((value) => optionLabel(shiftOptions, value)).join(' · '), (school.modalidades ?? []).map((value) => optionLabel(modalityOptions, value)).join(' · ')]} /><SummaryItem label="Tu espacio de trabajo" value={draft.levels.map((value) => optionLabel(levelOptions, value)).join(' · ')} details={[draft.shifts.map((value) => optionLabel(shiftOptions, value)).join(' · '), draft.modalities.map((value) => optionLabel(modalityOptions, value)).join(' · ')]} /></div>
      </div>
    </div>
  </div>
}

function OnboardingStepper({ step }: { step: number }) {
  const labels = ['Centro', 'Contexto', 'Confirmación']
  const descriptions = ['Centro y año escolar', 'Niveles, tandas y oferta', 'Revisa y entra']
  const icons = [Building2, Layers, ClipboardCheck]
  return <div className="setup-stepper" aria-label={`Paso ${step + 1} de ${totalSteps}`}>
    <ol aria-label="Progreso de la configuración">
      {labels.map((label, index) => { const Icon = icons[index]; return <li key={label} aria-current={index === step ? 'step' : undefined} className={index < step ? 'is-complete' : index === step ? 'is-current' : ''}><div className="setup-step-item"><span className="setup-step-number">{index < step ? <Check size={18} /> : <Icon size={18} />}</span><div><span className="setup-step-label">PASO {index + 1}</span><strong>{label}</strong><small>{descriptions[index]}</small></div></div></li> })}
    </ol>
  </div>
}

function StepHeading({ title, description }: { title: string; description: string }) { return <div className="setup-heading"><h1>{title}</h1><p>{description}</p></div> }
function SelectedSchoolCard({ school, onChange }: { school: SchoolResult; onChange: () => void }) { return <div className="rounded-2xl border border-primary/25 bg-primary/6 p-4"><div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/14 text-primary"><Building2 className="size-5" /></span><div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-wide text-primary">Centro seleccionado</p><p className="mt-1 font-extrabold">{school.name}</p><p className="mt-1 text-xs text-muted-foreground">{[...formatSchoolLocation(school), school.centerCode ? `Código ${school.centerCode}` : null].filter(Boolean).join(' · ') || (school.sector === 'public' ? 'Centro público' : 'Centro privado')}</p></div><Button variant="ghost" size="sm" onClick={onChange}>Cambiar</Button></div></div> }
function OfferItem({ label, values, options }: { label: string; values: string[]; options: Array<{ value: string; label: string }> }) { return <div><p className="text-xs font-bold text-muted-foreground">{label}</p><div className="mt-2 flex flex-wrap gap-1.5">{values?.length ? values.map((value) => <span key={value} className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold">{optionLabel(options, value)}</span>) : <span className="text-xs text-muted-foreground">Sin información registrada</span>}</div></div> }
function ChoiceGroup({ icon: Icon, title, values, selected, options, onToggle, error }: { icon: typeof UserRound; title: string; values: string[]; selected: string[]; options: Array<{ value: string; label: string }>; onToggle: (value: string) => void; error?: string }) { return <div className="setup-choice-group"><div className="flex items-center gap-2"><Icon className="size-4 text-primary" /><h4 className="text-sm font-bold">{title}</h4></div><div className="mt-3 flex flex-wrap gap-2">{values.map((value) => { const active = selected.includes(value); return <button key={value} type="button" aria-pressed={active} onClick={() => onToggle(value)} className={`setup-choice ${active ? 'is-selected' : ''}`}><span className="setup-choice-check" aria-hidden="true">{active && <Check size={12} />}</span>{optionLabel(options, value)}</button> })}</div><FieldError message={error} /></div> }
function ReadOnlyChoice({ icon: Icon, title, value }: { icon: typeof UserRound; title: string; value: string }) { return <div className="setup-choice-group"><div className="flex items-center gap-2"><Icon className="size-4 text-primary" /><h4 className="text-sm font-bold">{title}</h4></div><p className="setup-fixed-choice"><Check className="size-3.5" />{value}</p></div> }
function SummaryItem({ label, value, details = [], badge }: { label: string; value: string; details?: Array<string | null | undefined>; badge?: string }) { return <div><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">{label}</p><div className="mt-1 flex flex-wrap items-center gap-2"><p className="font-extrabold">{value}</p>{badge ? <span className="rounded-full bg-success/15 px-2 py-1 text-[10px] font-extrabold">{badge}</span> : null}</div>{details.filter(Boolean).map((detail) => <p key={detail} className="mt-1 text-xs text-muted-foreground">{detail}</p>)}</div> }
function FieldError({ message }: { message?: string }) { return message ? <p className="mt-2 text-xs font-semibold"><span className="mr-1 inline-block size-1.5 rounded-full bg-destructive" />{message}</p> : null }
function LoadingScreen() { return <main className="grid min-h-screen place-items-center bg-background"><div className="text-center"><BrandMark /><p className="mt-3 text-sm font-semibold text-muted-foreground">Preparando tu entrada…</p></div></main> }
function WelcomeScreen() { return <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-4"><AuthBackdrop /><div className="relative z-10 text-center"><div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-success/20 text-success"><Sparkles className="size-9" /></div><h1 className="mt-6 text-4xl font-black">Bienvenido</h1><p className="mt-3 text-muted-foreground">Tu espacio está listo. Entrando a AulaBase…</p></div></main> }
function BrandMark() { return <div className="relative mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/16 text-lg font-extrabold"><span>AB</span><span className="absolute -right-1 -top-1 size-3 rounded-full bg-warning" /></div> }
function AuthBackdrop() { return <div className="pointer-events-none absolute inset-0">{FLOATING_ICONS.map((item, index) => <item.Icon key={index} style={{ position: 'absolute', top: item.top, left: item.left, width: item.size, height: item.size, color: 'var(--primary)', opacity: 0.045, transform: `translate(-50%, -50%) rotate(${item.rotate}deg)` }} strokeWidth={1.5} />)}</div> }
