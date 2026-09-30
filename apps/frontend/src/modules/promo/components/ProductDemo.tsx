import {
  GraduationCapIcon,
  LayoutGridIcon,
  BookOpenIcon,
  Clock3Icon,
  CalendarCheckIcon,
  ClipboardListIcon,
  NotebookPenIcon,
  BarChart3Icon,
  SearchIcon,
  BellIcon,
  FlaskConicalIcon,
  PlayIcon,
  AlertTriangleIcon,
  FlagIcon,
  MonitorPlayIcon,
} from 'lucide-react'
import { cn } from '@/utils/cn'

interface ProductDemoProps {
  className?: string
}

const navItems = [
  { label: 'Inicio', icon: LayoutGridIcon, active: true },
  { label: 'Cursos', icon: BookOpenIcon },
  { label: 'Horario', icon: Clock3Icon },
  { label: 'Asistencia', icon: CalendarCheckIcon },
  { label: 'Evaluación', icon: ClipboardListIcon },
  { label: 'Bitácora', icon: NotebookPenIcon },
  { label: 'Reportes', icon: BarChart3Icon },
]

const grading = [
  { course: '3.º A', subject: 'Ciencias Físicas', done: 18, total: 25 },
  { course: '2.º A', subject: 'Ciencias de la Vida', done: 40, total: 75 },
  { course: '4.º A', subject: 'Biología', done: 6, total: 15 },
]

const attention = [
  {
    initials: 'AR',
    name: 'Ana R.',
    course: '4.º A',
    tag: 'Asistencia',
    tone: 'warning' as const,
    score: 58,
  },
  {
    initials: 'KA',
    name: 'Kevin A.',
    course: '2.º A',
    tag: 'Promedio',
    tone: 'incident' as const,
    score: 64,
  },
  {
    initials: 'LG',
    name: 'Luis G.',
    course: '4.º A',
    tag: 'Conducta',
    tone: 'warning' as const,
    score: 71,
  },
]

/**
 * Demostración visual fiel de la pantalla de inicio de Aula Base.
 * Contiene datos ficticios y se anuncia como imagen para lectores de pantalla.
 */
export function ProductDemo({ className }: ProductDemoProps) {
  return (
    <figure className={cn('relative', className)}>
      <div
        className="absolute -inset-x-6 -bottom-6 top-10 -z-10 rounded-[40px] bg-primary/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        role="img"
        aria-label="Demostración de la pantalla de inicio de Aula Base con datos ficticios: clase en curso, avance de calificaciones, asistencia del día y estudiantes que requieren atención."
        className="overflow-hidden rounded-[28px] border border-border bg-card p-2 shadow-xl sm:p-2.5"
      >
        {/* Barra de ventana */}
        <div className="flex items-center gap-1.5 px-3 pb-2 pt-1">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
          <span className="ml-3 hidden h-5 flex-1 max-w-[220px] rounded-full bg-muted sm:block" />
        </div>

        <div className="flex overflow-hidden rounded-[22px] bg-background">
          {/* Sidebar */}
          <aside className="hidden w-44 shrink-0 flex-col gap-1 border-r border-border bg-card p-3 md:flex">
            <div className="mb-3 flex items-center gap-2 px-1">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-white">
                <GraduationCapIcon className="h-3.5 w-3.5" />
              </span>
              <span className="text-[12px] font-semibold">Aula Base</span>
            </div>
            {navItems.map((n) => (
              <div
                key={n.label}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-2 py-1.5 text-[11px]',
                  n.active
                    ? 'bg-accent font-medium text-accent-foreground'
                    : 'text-muted-foreground',
                )}
              >
                <n.icon className="h-3.5 w-3.5" />
                {n.label}
              </div>
            ))}
          </aside>

          {/* Contenido */}
          <div className="min-w-0 flex-1 space-y-3 p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 flex-1 items-center gap-2 rounded-full bg-card px-3 text-[10px] text-muted-foreground shadow-xs sm:max-w-xs">
                <SearchIcon className="h-3 w-3" />
                Buscar estudiantes, cursos…
              </div>
              <span className="relative grid h-8 w-8 place-items-center rounded-full bg-card shadow-xs">
                <BellIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive" />
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/12 text-[10px] font-semibold text-primary">
                MP
              </span>
            </div>

            <div>
              <p className="text-[15px] font-semibold sm:text-lg">
                Buenos días, <span className="text-primary">María</span>
              </p>
              <p className="text-[10px] text-muted-foreground sm:text-[11px]">
                Jueves · 5 clases hoy · 3 estudiantes por revisar
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
              {/* Clase en curso */}
              <div className="relative overflow-hidden rounded-2xl bg-primary p-3.5 text-white shadow-lg">
                <div className="absolute -bottom-8 -right-6 h-24 w-24 rounded-full bg-white/10" />
                <div className="flex items-start justify-between">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20">
                    <FlaskConicalIcon className="h-3.5 w-3.5" />
                  </span>
                  <span className="grid h-11 w-11 place-items-center rounded-full border-[3px] border-white/40 border-t-white text-center text-[9px] font-semibold leading-none">
                    5:10
                  </span>
                </div>
                <p className="mt-2 text-[9px] font-semibold uppercase tracking-wider text-white/85">
                  Clase en curso · 3.º A
                </p>
                <p className="text-[12px] font-semibold leading-snug">Ciencias de la Naturaleza</p>
                <p className="mt-0.5 text-[10px] text-white/85">10:00 – 10:40 · 25 est.</p>
                <span className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-primary">
                  <PlayIcon className="h-2.5 w-2.5" /> Iniciar clase
                </span>
              </div>

              {/* Cierre de período */}
              <div className="rounded-2xl bg-card p-3.5 shadow-sm">
                <p className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <FlagIcon className="h-2.5 w-2.5" /> Cierre de período
                </p>
                <p className="text-[12px] font-semibold">
                  P1 cierra en <span className="text-primary">36 días</span>
                </p>
                <div className="mt-2 space-y-2">
                  {grading.map((g, i) => (
                    <div key={g.course}>
                      <div className="flex justify-between text-[9.5px]">
                        <span>
                          <b className="font-semibold">{g.course}</b> {g.subject}
                        </span>
                        <span className="text-muted-foreground">
                          {g.done}/{g.total}
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 rounded-full bg-muted">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            i === 0 ? 'bg-primary' : i === 1 ? 'bg-primary' : 'bg-warning',
                          )}
                          style={{ width: `${(g.done / g.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Asistencia */}
              <div className="hidden rounded-2xl bg-card p-3.5 shadow-sm 2xl:block">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-success/15 text-success">
                    <CalendarCheckIcon className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Asistencia de hoy
                    </p>
                    <p className="text-[12px] font-semibold">1 de 5 clases</p>
                  </div>
                </div>
                <div className="mt-2.5 flex gap-1">
                  <span className="h-1.5 flex-1 rounded-full bg-success" />
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} className="h-1.5 flex-1 rounded-full bg-muted" />
                  ))}
                </div>
                <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-[9.5px]">
                  <span className="flex items-center gap-1 rounded-lg bg-muted/70 px-2 py-1">
                    <i className="h-1.5 w-1.5 rounded-full bg-success" /> 23 presentes
                  </span>
                  <span className="flex items-center gap-1 rounded-lg bg-muted/70 px-2 py-1">
                    <i className="h-1.5 w-1.5 rounded-full bg-destructive" /> 2 ausentes
                  </span>
                  <span className="flex items-center gap-1 rounded-lg bg-muted/70 px-2 py-1">
                    <i className="h-1.5 w-1.5 rounded-full bg-primary" /> 0 justificadas
                  </span>
                  <span className="flex items-center gap-1 rounded-lg bg-muted/70 px-2 py-1">
                    <i className="h-1.5 w-1.5 rounded-full bg-warning" /> 1 tardanza
                  </span>
                </div>
              </div>
            </div>

            {/* Requieren atención */}
            <div className="rounded-2xl bg-card p-3.5 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-warning/25 text-foreground">
                  <AlertTriangleIcon className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-[12px] font-semibold">Requieren atención</p>
                  <p className="text-[9.5px] text-muted-foreground">Mínimo de aprobación 70</p>
                </div>
              </div>
              <ul className="mt-2 divide-y divide-border">
                {attention.map((s) => (
                  <li key={s.initials} className="flex items-center gap-2 py-1.5">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-muted text-[9px] font-semibold">
                      {s.initials}
                    </span>
                    <span className="text-[10.5px] font-medium">{s.name}</span>
                    <span className="text-[9px] text-muted-foreground">{s.course}</span>
                    <span
                      className={cn(
                        'rounded-full px-1.5 py-0.5 text-[8.5px] font-medium',
                        s.tone === 'warning'
                          ? 'bg-warning/25 text-foreground'
                          : 'bg-destructive/12 text-destructive',
                      )}
                    >
                      {s.tag}
                    </span>
                    <span
                      className={cn(
                        'ml-auto text-[11px] font-semibold',
                        s.score < 70 ? 'text-destructive' : 'text-foreground',
                      )}
                    >
                      {s.score}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <MonitorPlayIcon className="h-3.5 w-3.5" aria-hidden="true" />
        Demostración ilustrativa. Nombres y datos ficticios.
      </figcaption>
    </figure>
  )
}
