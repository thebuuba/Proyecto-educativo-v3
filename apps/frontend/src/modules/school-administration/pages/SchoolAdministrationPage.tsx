/**
 * @file Página de Administración Escolar
 */

import { CalendarRange, RefreshCw, Settings2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { FeedbackBanner, PageHero, SemanticIcon, StatusBadge } from '@/components/ui/SemanticUI'
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
    <section className="app-content-frame teacher-dashboard space-y-5">
      <PageHero
        title="Administración escolar"
        description="Gestiona la identidad institucional, el calendario y las reglas operativas del centro."
        icon={Settings2}
        tone="info"
        eyebrow="Configuración"
        actions={
          <Button variant="outline" onClick={() => void refetch()}>
            <RefreshCw className="size-4" /> Actualizar
          </Button>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          {currentSchoolYear ? <StatusBadge tone="success">{currentSchoolYear.name} activo</StatusBadge> : <StatusBadge tone="warning">Sin año activo</StatusBadge>}
          <span className="text-xs text-muted-foreground">{academicPeriods.length} período{academicPeriods.length === 1 ? '' : 's'} configurado{academicPeriods.length === 1 ? '' : 's'}</span>
        </div>
      </PageHero>

      {error ? <FeedbackBanner tone="danger">{error}</FeedbackBanner> : null}

      {loading && !profile ? (
        <Card><CardContent className="flex min-h-[220px] items-center justify-center text-sm font-medium text-muted-foreground">Cargando configuración...</CardContent></Card>
      ) : (
        <div className="space-y-5">
          <section id="centro-educativo" className="scroll-mt-6">
            <SchoolProfileForm profile={profile} onSave={saveProfile} />
          </section>

          <section id="anos-escolares" className="scroll-mt-6">
            <AcademicYearManager schoolYears={schoolYears} onAdd={addSchoolYear} onActivate={activateSchoolYear} />
          </section>

          <section id="periodos-academicos" className="scroll-mt-6">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4 border-b-0 pb-2">
                <div className="flex items-start gap-3">
                  <SemanticIcon icon={CalendarRange} tone="warning" className="size-10 rounded-xl" iconClassName="size-4" />
                  <div>
                    <CardTitle>Períodos académicos</CardTitle>
                    <CardDescription>Trimestres o períodos del año escolar activo.</CardDescription>
                  </div>
                </div>
                <Button size="sm" disabled={!currentSchoolYear} onClick={() => setPeriodManagerOpen(true)}>
                  <CalendarRange className="size-4" /> Gestionar
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
                      <div key={period.id} className="rounded-2xl bg-warning/14 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-extrabold text-foreground">{period.sequence}. {period.name}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{period.startDate} — {period.endDate}</p>
                          </div>
                          {currentSchoolYear.isCurrent ? <span className="size-2 rounded-full bg-warning" /> : null}
                        </div>
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
