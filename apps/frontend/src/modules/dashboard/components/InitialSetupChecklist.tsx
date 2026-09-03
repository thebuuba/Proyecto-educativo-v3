import { ArrowRight, CalendarCheck, CalendarClock, LibraryBig, NotebookPen, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { DashboardSetupProgress } from '@/modules/dashboard/types/dashboard'

type InitialSetupChecklistProps = {
  progress: DashboardSetupProgress
}

type SetupStep = {
  id: string
  title: string
  actionLabel: string
  path: string
  done: boolean
  icon: typeof LibraryBig
}

export function InitialSetupChecklist({ progress }: InitialSetupChecklistProps) {
  const steps: SetupStep[] = [
    {
      id: 'courses',
      title: 'Crea tu primer curso',
      actionLabel: 'Ir a cursos',
      path: '/cursos',
      done: progress.courseCount > 0,
      icon: LibraryBig,
    },
    {
      id: 'students',
      title: 'Agrega estudiantes',
      actionLabel: 'Ir a cursos',
      path: '/cursos',
      done: progress.studentCount > 0 || progress.activeEnrollments > 0,
      icon: UsersRound,
    },
    {
      id: 'schedule',
      title: 'Crea tu horario de clases',
      actionLabel: 'Ir a horario',
      path: '/horario',
      done: progress.scheduleEntryCount > 0,
      icon: CalendarClock,
    },
    {
      id: 'attendance',
      title: 'Registra tu primera asistencia',
      actionLabel: 'Ir a asistencia',
      path: '/asistencia',
      done: progress.attendanceCount > 0,
      icon: CalendarCheck,
    },
    {
      id: 'planning',
      title: 'Prepara una planificación',
      actionLabel: 'Ir a planificación',
      path: '/planificaciones',
      done: progress.planningCount > 0,
      icon: NotebookPen,
    },
  ]
  const completedCount = steps.filter((step) => step.done).length
  const nextStep = steps.find((step) => !step.done)

  if (!nextStep) return null
  const Icon = nextStep.icon

  return (
    <section className="setup-next-step dashboard-warm-shadow rounded-3xl bg-card p-4 text-card-foreground sm:p-5">
      <div className="flex min-w-0 items-center gap-3.5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-warning text-warning-foreground shadow-sm">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-accent">
            Para dejar todo listo
          </p>
          <h2 className="mt-1 text-xl font-extrabold leading-tight tracking-[-0.025em] text-foreground sm:text-[22px]">
            {nextStep.title}.
          </h2>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex gap-1.5" aria-label={`${completedCount} de ${steps.length} pasos completados`}>
          {steps.map((step) => (
            <span
              key={step.id}
              className={step.done ? 'h-1.5 flex-1 rounded-full bg-success' : 'h-1.5 flex-1 rounded-full bg-border'}
              aria-hidden="true"
            />
          ))}
        </div>
        <p className="mt-1.5 text-[11px] font-medium text-muted-foreground">
          {completedCount}/{steps.length} pasos completados
        </p>
      </div>

      <Link
        to={nextStep.path}
        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground transition-[background-color,transform,box-shadow] duration-200 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/25 active:translate-y-px"
      >
        {nextStep.actionLabel}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </section>
  )
}
