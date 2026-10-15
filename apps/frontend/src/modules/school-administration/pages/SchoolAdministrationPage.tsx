import { ArrowRight, BookOpen, CalendarClock, CalendarRange, CreditCard, GraduationCap, LayoutDashboard, RefreshCw, Settings2, SlidersHorizontal, UsersRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { FeedbackBanner, PageHero, SemanticIcon, StatusBadge } from '@/components/ui/SemanticUI'
import { PeriodManager } from '@/modules/planning/components/PeriodManager'
import { ProfilePage } from '@/modules/profile/pages/ProfilePage'
import { AcademicYearManager } from '@/modules/school-administration/components/AcademicYearManager'
import { SchoolProfileForm } from '@/modules/school-administration/components/SchoolProfileForm'
import { SchoolUsersPanel } from '@/modules/school-administration/components/SchoolUsersPanel'
import { useSchoolAdministration } from '@/modules/school-administration/hooks/useSchoolAdministration'
import { cn } from '@/utils/cn'
import '../settings-design.css'

const categories = [
  { id: 'centro', label: 'Centro educativo', icon: BookOpen },
  { id: 'calendario', label: 'Calendario', icon: CalendarRange },
  { id: 'usuarios', label: 'Usuarios', icon: UsersRound },
  { id: 'cuenta', label: 'Cuenta e interfaz', icon: SlidersHorizontal },
  { id: 'modulos', label: 'Módulos', icon: LayoutDashboard },
] as const
const moduleSettings = [
  { title: 'Inicio', description: 'Organiza tus widgets y accesos rápidos.', href: '/inicio?ajustes=widgets', icon: LayoutDashboard },
  { title: 'Cursos', description: 'Grados, secciones, asignaturas y equipos.', href: '/cursos', icon: BookOpen },
  { title: 'Evaluación', description: 'Reglas de cálculo y configuración del libro de calificaciones.', href: '/calificaciones?ajustes=calculo', icon: GraduationCap },
  { title: 'Horario', description: 'Días, jornadas y períodos de clase.', href: '/horario', icon: CalendarClock },
  { title: 'Planificación', description: 'Planes, recursos y currículo de tus cursos.', href: '/planificaciones', icon: CalendarRange },
  { title: 'Reportes', description: 'Filtros, contenido y formatos de exportación.', href: '/reportes', icon: Settings2 },
]

export function SchoolAdministrationPage() {
  const { profile, schoolYears, academicPeriods, loading, error, refetch, saveProfile, addSchoolYear, editSchoolYear, activateSchoolYear } = useSchoolAdministration()
  const [periodManagerOpen, setPeriodManagerOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const requested = searchParams.get('tab')
  const fallback = ['#anos-escolares', '#periodos-academicos'].includes(location.hash) ? 'calendario' : 'centro'
  const category = categories.find((item) => item.id === requested)?.id ?? fallback
  const currentSchoolYear = schoolYears.find((year) => year.isCurrent) ?? null

  useEffect(() => {
    if (!loading && location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView?.({ block: 'start' })
  }, [loading, location.hash, category])

  function selectCategory(id: string) {
    const next = new URLSearchParams(searchParams)
    next.set('tab', id)
    setSearchParams(next, { replace: true })
  }

  return (
    <section className="settings-workspace w-full min-w-0 space-y-5">
      <PageHero title="Configuración" description="Administra tu centro y personaliza tu experiencia en AulaBase." icon={Settings2} tone="info"
        eyebrow={<span className="text-muted-foreground">Tu espacio de trabajo</span>} actions={<Button variant="outline" size="sm" className="rounded-full" disabled={loading} onClick={() => void refetch()}><RefreshCw className={cn('size-4', loading && 'animate-spin')} /> Actualizar</Button>}>
        <div className="flex flex-wrap items-center gap-2">
          {profile ? <StatusBadge tone="info">{profile.name}</StatusBadge> : null}
          {currentSchoolYear ? <StatusBadge tone="success">{currentSchoolYear.name} activo</StatusBadge> : <StatusBadge tone="neutral">Sin año escolar activo</StatusBadge>}
        </div>
      </PageHero>
      {error ? <FeedbackBanner tone="danger" role="alert">{error}</FeedbackBanner> : null}

      <div className="grid min-w-0 gap-5 lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="min-w-0 space-y-4">
          <Card className="p-2">
            <nav aria-label="Categorías de configuración" className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
              {categories.map(({ id, label, icon: Icon }) => <button key={id} type="button" aria-current={category === id ? 'page' : undefined}
                onClick={() => selectCategory(id)}
                className={cn('flex min-h-11 items-center gap-3 rounded-full px-4 py-3 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', category === id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
                <Icon className="size-4 shrink-0" aria-hidden="true" /><span>{label}</span>
              </button>)}
            </nav>
          </Card>
          <Card className="hidden lg:block"><CardContent>
            <p className="text-xs font-medium text-muted-foreground">Configuración del centro</p>
            <p className="mt-2 text-sm font-semibold text-foreground">{profile?.name ?? 'AulaBase'}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">La información institucional se comparte en tu centro. Las preferencias de interfaz se guardan en este navegador.</p>
          </CardContent></Card>
        </aside>

        <div className="min-w-0 space-y-5">
          {loading && !profile ? <Card><CardContent><p role="status" className="py-12 text-center text-sm text-muted-foreground">Cargando configuración...</p></CardContent></Card> : <>
            <section id="centro-educativo" hidden={category !== 'centro'} className="scroll-mt-28">
              <SchoolProfileForm profile={profile} onSave={saveProfile} />
            </section>
            {category === 'calendario' ? <div className="space-y-5">
              <section id="anos-escolares" className="scroll-mt-28"><AcademicYearManager schoolYears={schoolYears} onAdd={addSchoolYear} onEdit={editSchoolYear} onActivate={activateSchoolYear} /></section>
              <section id="periodos-academicos" className="scroll-mt-28">
                <Card><CardHeader className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3"><SemanticIcon icon={CalendarRange} tone="neutral" /><div><CardTitle>Períodos académicos</CardTitle><CardDescription>{currentSchoolYear ? 'Períodos del año escolar ' + currentSchoolYear.name + '.' : 'Selecciona un año activo para gestionar sus períodos.'}</CardDescription></div></div>
                  <Button size="sm" className="rounded-full" disabled={!currentSchoolYear} onClick={() => setPeriodManagerOpen(true)}>Gestionar períodos</Button>
                </CardHeader><CardContent>
                  {!currentSchoolYear ? <p className="text-sm text-muted-foreground">Activa un año escolar para configurar sus períodos.</p> : !academicPeriods.length ? <p className="text-sm text-muted-foreground">Todavía no hay períodos registrados para este año.</p> :
                    <div className="grid gap-3 sm:grid-cols-2">{academicPeriods.map((period) => <div key={period.id} className="rounded-2xl border border-border p-4">
                      <div className="flex items-center gap-2"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold">{period.sequence}</span><p className="text-sm font-semibold">{period.name}</p></div>
                      <p className="mt-2 text-xs text-muted-foreground">{period.startDate.slice(0, 10)} — {period.endDate.slice(0, 10)}</p>
                    </div>)}</div>}
                </CardContent></Card>
              </section>
            </div> : null}
            {category === 'usuarios' ? <SchoolUsersPanel /> : null}
            {category === 'cuenta' ? <div className="space-y-5">
              <Card>
                <CardHeader className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3"><SemanticIcon icon={CreditCard} tone="info" /><div><CardTitle>Suscripción y pagos</CardTitle><CardDescription>Consulta tu cobertura, tu forma de pago y el historial registrado.</CardDescription></div></div>
                  <Link to="/cuenta/suscripcion" aria-label="Gestionar suscripción y pagos" className="inline-flex min-h-10 items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Gestionar suscripción <ArrowRight className="size-4" aria-hidden="true" /></Link>
                </CardHeader>
              </Card>
              <ProfilePage embedded />
            </div> : null}
            {category === 'modulos' ? <div className="space-y-4">
              <div><h2 className="text-lg font-semibold">Configuración por módulo</h2><p className="mt-1 text-sm text-muted-foreground">Abre cada espacio para ajustar sus opciones específicas.</p></div>
              <div className="grid gap-4 xl:grid-cols-2">{moduleSettings.map(({ title, description, href, icon }) => <Card key={title}><CardContent className="flex h-full flex-col">
                <div className="flex items-start gap-3"><SemanticIcon icon={icon} tone="neutral" /><div className="min-w-0"><h3 className="text-base font-semibold">{title}</h3><p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p></div></div>
                <Link to={href} aria-label={'Configurar ' + title} className="mt-5 inline-flex min-h-10 items-center justify-between gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Abrir ajustes <ArrowRight className="size-4" aria-hidden="true" /></Link>
              </CardContent></Card>)}</div>
            </div> : null}
          </>}
        </div>
      </div>
      {periodManagerOpen && currentSchoolYear ? <PeriodManager schoolYearId={currentSchoolYear.id} periods={academicPeriods} onRefresh={() => void refetch()} onClose={() => setPeriodManagerOpen(false)} /> : null}
    </section>
  )
}
