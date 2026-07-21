/**
 * @file Página de Administración Escolar
 *
 * Vista principal de parámetros institucionales con secciones
 * para perfil del centro, años escolares y próximas funciones.
 */

import {
  AlertCircle,
  CalendarRange,
  RefreshCw,
  Settings2,
} from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { PeriodManager } from '@/modules/planning/components/PeriodManager'
import { AcademicYearManager } from '@/modules/school-administration/components/AcademicYearManager'
import { SchoolProfileForm } from '@/modules/school-administration/components/SchoolProfileForm'
import { useSchoolAdministration } from '@/modules/school-administration/hooks/useSchoolAdministration'

export function SchoolAdministrationPage() {
  const {
    profile,
    schoolYears,
    academicPeriods,
    loading,
    error,
    refetch,
    saveProfile,
    addSchoolYear,
    activateSchoolYear,
  } = useSchoolAdministration()
  const [periodManagerOpen, setPeriodManagerOpen] = useState(false)
  const currentSchoolYear = schoolYears.find((year) => year.isCurrent) ?? schoolYears[0] ?? null

  return (
    <section className="teacher-dashboard mx-auto w-full min-w-0 max-w-[1440px] space-y-5">
      <header className="dashboard-warm-shadow relative overflow-hidden rounded-3xl border border-border bg-card px-5 py-6 sm:px-7 lg:px-8">
        <div className="dashboard-paper-lines pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] opacity-70 sm:block" aria-hidden="true" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-accent">
              <Settings2 className="size-4" aria-hidden="true" />
              Configuración
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Administración escolar
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Gestiona la identidad institucional, el calendario y las reglas operativas del centro.
            </p>
          </div>

          <Button variant="outline" className="h-11 bg-card px-5" onClick={() => void refetch()}>
            <RefreshCw className="size-4" />
            Actualizar
          </Button>
        </div>
      </header>

      {error ? (
        <div className="mb-6 flex gap-3 rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>{error}</p>
        </div>
      ) : null}

      {loading && !profile ? (
        <div className="flex min-h-[280px] items-center justify-center text-sm font-medium text-muted-foreground">
          Cargando configuración...
        </div>
      ) : (
        <div className="space-y-5">
          <section id="centro-educativo" className="scroll-mt-6">
            <SchoolProfileForm profile={profile} onSave={saveProfile} />
          </section>

          <section id="anos-escolares" className="scroll-mt-6">
            <AcademicYearManager
              schoolYears={schoolYears}
              onAdd={addSchoolYear}
              onActivate={activateSchoolYear}
            />
          </section>

          <section id="periodos-academicos" className="scroll-mt-6">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>Períodos académicos</CardTitle>
                  <CardDescription>
                    Trimestres o períodos del año escolar activo.
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  disabled={!currentSchoolYear}
                  onClick={() => setPeriodManagerOpen(true)}
                >
                  <CalendarRange className="size-4" />
                  Gestionar
                </Button>
              </CardHeader>
              <CardContent>
                {!currentSchoolYear ? (
                  <p className="text-sm text-muted-foreground">Crea un año escolar para configurar sus períodos.</p>
                ) : academicPeriods.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No hay períodos registrados para {currentSchoolYear.name}.</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {academicPeriods.map((period) => (
                      <div key={period.id} className="rounded-xl border border-border bg-muted/35 p-4">
                        <p className="text-sm font-bold text-foreground">{period.sequence}. {period.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{period.startDate} — {period.endDate}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      )}

      {periodManagerOpen && currentSchoolYear ? (
        <PeriodManager
          schoolYearId={currentSchoolYear.id}
          periods={academicPeriods}
          onRefresh={() => void refetch()}
          onClose={() => setPeriodManagerOpen(false)}
        />
      ) : null}
    </section>
  )
}
