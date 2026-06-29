import type { FormEvent } from 'react'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from '@/modules/auth/hooks/useAuth'
import type { CompleteOnboardingInput } from '@/modules/auth/types/auth'

function isoToday() {
  return new Date().toISOString().slice(0, 10)
}

export function OnboardingPage() {
  const {
    appUser,
    completeOnboarding,
    isAuthenticated,
    loading,
    profileRequired,
    onboardingComplete,
  } = useAuth()
  const [fullName, setFullName] = useState(appUser?.fullName ?? '')
  const [schoolName, setSchoolName] = useState('')
  const [regionalName, setRegionalName] = useState('')
  const [districtName, setDistrictName] = useState('')
  const [enabledSubsystems, setEnabledSubsystems] = useState<string[]>(['regular'])
  const [schoolShift, setSchoolShift] = useState('extended')
  const [schoolYearName, setSchoolYearName] = useState('2026-2027')
  const [schoolStartDate, setSchoolStartDate] = useState(isoToday())
  const [schoolEndDate, setSchoolEndDate] = useState('2027-06-30')
  const [periods, setPeriods] = useState([
    { name: 'Periodo 1', startDate: isoToday(), endDate: '2026-12-15' },
    { name: 'Periodo 2', startDate: '2027-01-08', endDate: '2027-03-31' },
    { name: 'Periodo 3', startDate: '2027-04-01', endDate: '2027-06-30' },
  ])
  const [gradeName, setGradeName] = useState('3ro Secundaria')
  const [sectionName, setSectionName] = useState('A')
  const [subjectName, setSubjectName] = useState('Lengua Española')
  const [subjectCode, setSubjectCode] = useState('LEN-001')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && isAuthenticated && onboardingComplete) {
    return <Navigate to="/" replace />
  }

  if (!loading && !isAuthenticated && !profileRequired) {
    return <Navigate to="/registro" replace />
  }

  function setSubsystem(value: string, checked: boolean) {
    setEnabledSubsystems((current) => {
      const next = checked ? [...current, value] : current.filter((item) => item !== value)
      return next.length ? Array.from(new Set(next)) : ['regular']
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    const input: CompleteOnboardingInput = {
      fullName: fullName.trim(),
      school: {
        name: schoolName.trim(),
        regionalName: regionalName.trim() || undefined,
        districtName: districtName.trim() || undefined,
        primaryModality: 'general',
        schoolShift,
        enabledSubsystems,
      },
      schoolYear: {
        name: schoolYearName.trim(),
        startDate: schoolStartDate,
        endDate: schoolEndDate,
      },
      periods: periods.map((period) => ({
        name: period.name.trim(),
        startDate: period.startDate,
        endDate: period.endDate,
      })),
      courses: [
        {
          gradeName: gradeName.trim(),
          sectionName: sectionName.trim(),
          subjectName: subjectName.trim(),
          subjectCode: subjectCode.trim().toUpperCase(),
        },
      ],
    }

    if (!input.fullName || !input.school.name || !input.schoolYear.name) {
      setError('Completa los datos generales.')
      setSubmitting(false)
      return
    }

    try {
      await completeOnboarding(input)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la configuración.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F0F1F3] px-4 py-8 text-[#111827]">
      <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-5">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2D6977]">
            Configuración inicial
          </p>
          <h1 className="mt-2 text-3xl font-extrabold">Prepara tu año escolar</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#6B7280]">
            Primero estructura académica. Luego podrás crear horario, matrícula,
            planificación, asistencia y reportes con datos útiles.
          </p>
        </header>

        {error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        ) : null}

        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <h2 className="text-lg font-bold">Centro y docente</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input className="rounded-xl border border-[#E5E7EB] px-4 py-3" placeholder="Nombre del docente" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
            <input className="rounded-xl border border-[#E5E7EB] px-4 py-3" placeholder="Centro educativo" value={schoolName} onChange={(event) => setSchoolName(event.target.value)} required />
            <input className="rounded-xl border border-[#E5E7EB] px-4 py-3" placeholder="Regional" value={regionalName} onChange={(event) => setRegionalName(event.target.value)} />
            <input className="rounded-xl border border-[#E5E7EB] px-4 py-3" placeholder="Distrito educativo" value={districtName} onChange={(event) => setDistrictName(event.target.value)} />
            <select className="rounded-xl border border-[#E5E7EB] px-4 py-3" value={schoolShift} onChange={(event) => setSchoolShift(event.target.value)}>
              <option value="morning">Matutina</option>
              <option value="afternoon">Vespertina</option>
              <option value="extended">Extendida</option>
              <option value="both">Ambas tandas</option>
            </select>
            <div className="flex flex-wrap items-center gap-3 text-sm text-[#374151]">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={enabledSubsystems.includes('regular')} onChange={(event) => setSubsystem('regular', event.target.checked)} />
                Primaria/Secundaria
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={enabledSubsystems.includes('adultos')} onChange={(event) => setSubsystem('adultos', event.target.checked)} />
                Adultos
              </label>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <h2 className="text-lg font-bold">Año escolar y períodos</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <input className="rounded-xl border border-[#E5E7EB] px-4 py-3" placeholder="Año escolar" value={schoolYearName} onChange={(event) => setSchoolYearName(event.target.value)} required />
            <input type="date" className="rounded-xl border border-[#E5E7EB] px-4 py-3" value={schoolStartDate} onChange={(event) => setSchoolStartDate(event.target.value)} required />
            <input type="date" className="rounded-xl border border-[#E5E7EB] px-4 py-3" value={schoolEndDate} onChange={(event) => setSchoolEndDate(event.target.value)} required />
          </div>
          <div className="mt-4 space-y-3">
            {periods.map((period, index) => (
              <div key={index} className="grid gap-3 md:grid-cols-3">
                <input className="rounded-xl border border-[#E5E7EB] px-4 py-3" value={period.name} onChange={(event) => setPeriods((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item))} required />
                <input type="date" className="rounded-xl border border-[#E5E7EB] px-4 py-3" value={period.startDate} onChange={(event) => setPeriods((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, startDate: event.target.value } : item))} required />
                <input type="date" className="rounded-xl border border-[#E5E7EB] px-4 py-3" value={period.endDate} onChange={(event) => setPeriods((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, endDate: event.target.value } : item))} required />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <h2 className="text-lg font-bold">Primer curso</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <input className="rounded-xl border border-[#E5E7EB] px-4 py-3" placeholder="Grado" value={gradeName} onChange={(event) => setGradeName(event.target.value)} required />
            <input className="rounded-xl border border-[#E5E7EB] px-4 py-3" placeholder="Sección" value={sectionName} onChange={(event) => setSectionName(event.target.value)} required />
            <input className="rounded-xl border border-[#E5E7EB] px-4 py-3" placeholder="Asignatura" value={subjectName} onChange={(event) => setSubjectName(event.target.value)} required />
            <input className="rounded-xl border border-[#E5E7EB] px-4 py-3" placeholder="Código" value={subjectCode} onChange={(event) => setSubjectCode(event.target.value)} required />
          </div>
        </section>

        <button type="submit" disabled={submitting} className="w-full rounded-xl bg-[#1F4E5F] py-4 font-bold text-white disabled:opacity-60">
          {submitting ? 'Guardando configuración...' : 'Entrar a Aula Base'}
        </button>
      </form>
    </main>
  )
}
