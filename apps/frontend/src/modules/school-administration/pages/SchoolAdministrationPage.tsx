/**
 * @file Página de Administración Escolar
 *
 * Vista principal de parámetros institucionales con secciones
 * para perfil del centro, años escolares y próximas funciones.
 */

import {
  AlertCircle,
  Building2,
  CalendarDays,
  FileSpreadsheet,
  ListChecks,
  RefreshCw,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'
import type { ComponentType } from 'react'

import { Button } from '@/components/ui/Button'
import { AcademicYearManager } from '@/modules/school-administration/components/AcademicYearManager'
import { SchoolProfileForm } from '@/modules/school-administration/components/SchoolProfileForm'
import { useSchoolAdministration } from '@/modules/school-administration/hooks/useSchoolAdministration'

/** Área de configuración disponible en la página */
type SettingsArea = {
  title: string
  description: string
  status: 'Disponible' | 'Próximo'
  href?: string
  icon: ComponentType<{ className?: string }>
}

const schoolAdministrationAreas: SettingsArea[] = [
  {
    title: 'Centro educativo',
    description: 'Identidad, código de centro, sector y jornada.',
    status: 'Disponible',
    href: '#centro-educativo',
    icon: Building2,
  },
  {
    title: 'Años escolares y calendario',
    description: 'Períodos, fechas, días lectivos y año escolar activo.',
    status: 'Disponible',
    href: '#anos-escolares',
    icon: CalendarDays,
  },
  {
    title: 'Usuarios y roles',
    description: 'Accesos internos, perfiles y permisos por función.',
    status: 'Próximo',
    icon: UsersRound,
  },
  {
    title: 'Reglas de evaluación',
    description: 'Promoción, recuperación y nota mínima por nivel o modalidad.',
    status: 'Próximo',
    icon: ShieldCheck,
  },
  {
    title: 'Catálogos RD',
    description: 'Niveles, ciclos, modalidades, subsistemas y competencias.',
    status: 'Próximo',
    icon: ListChecks,
  },
  {
    title: 'Exportables oficiales',
    description: 'Encabezados, formatos y plantillas operativas.',
    status: 'Próximo',
    icon: FileSpreadsheet,
  },
]

export function SchoolAdministrationPage() {
  const {
    profile,
    schoolYears,
    loading,
    error,
    refetch,
    saveProfile,
    addSchoolYear,
    activateSchoolYear,
  } = useSchoolAdministration()

  return (
    <section className="w-full min-w-0">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">
            Administración
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-none text-primary sm:text-5xl">
            Administración escolar
          </h1>
          <p className="mt-3 text-base leading-6 text-muted-foreground">
            Perfil institucional, años escolares y períodos académicos.
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
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {schoolAdministrationAreas.map((area) => (
              <SettingsAreaCard key={area.title} area={area} />
            ))}
          </div>

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
        </div>
      )}
    </section>
  )
}

/** Tarjeta de acceso a un área de configuración */
function SettingsAreaCard({ area }: { area: SettingsArea }) {
  const Icon = area.icon
  const content = (
    <>
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/12 text-accent">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{area.title}</span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            {area.status}
          </span>
        </span>
        <span className="mt-1 block text-sm leading-5 text-muted-foreground">
          {area.description}
        </span>
      </span>
    </>
  )

  const className =
    'flex min-h-28 items-start gap-3 rounded-lg border border-border bg-card p-4 text-left shadow-sm transition'

  if (area.href) {
    return (
      <a href={area.href} className={`${className} hover:border-ring/50 hover:bg-muted/40`}>
        {content}
      </a>
    )
  }

  return (
    <div className={`${className} opacity-80`}>
      {content}
    </div>
  )
}
