import { AlertCircle, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { AcademicYearManager } from '@/modules/settings/components/AcademicYearManager'
import { SchoolProfileForm } from '@/modules/settings/components/SchoolProfileForm'
import { useSettings } from '@/modules/settings/hooks/useSettings'

export function SettingsPage() {
  const {
    profile,
    schoolYears,
    loading,
    error,
    refetch,
    saveProfile,
    addSchoolYear,
    activateSchoolYear,
  } = useSettings()

  return (
    <section className="mx-auto w-full max-w-4xl">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">
            Administración
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-none text-primary sm:text-5xl">
            Configuración
          </h1>
          <p className="mt-3 text-base leading-6 text-muted-foreground">
            Parámetros institucionales, preferencias generales e integración del sistema.
          </p>
        </div>

        <Button variant="outline" className="h-12 px-5" onClick={() => void refetch()}>
          <RefreshCw className="size-4" />
          Actualizar
        </Button>
      </div>

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
        <div className="space-y-8">
          <SchoolProfileForm profile={profile} onSave={saveProfile} />
          <AcademicYearManager
            schoolYears={schoolYears}
            onAdd={addSchoolYear}
            onActivate={activateSchoolYear}
          />
        </div>
      )}
    </section>
  )
}
