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
      actionLabel: 'Ir a matricula',
      path: '/estudiantes',
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
      title: 'Prepara una planificacion',
      actionLabel: 'Ir a planificacion',
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
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Icon className="size-5" />
          </span>
          <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
            Siguiente paso
          </p>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {nextStep.title}.
          </h2>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {completedCount}/{steps.length} completados
          </p>
          </div>
        </div>
        <Link
          to={nextStep.path}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:opacity-90"
        >
          {nextStep.actionLabel}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}
