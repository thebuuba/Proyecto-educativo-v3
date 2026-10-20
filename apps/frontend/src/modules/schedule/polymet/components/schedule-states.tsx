import { ArrowRightIcon, CalendarDaysIcon, Clock4Icon, LayersIcon, Loader2Icon, LockIcon, RefreshCwIcon, SunriseIcon, WifiOffIcon } from "lucide-react";

import { cn } from "../ui/utils";
import { Button } from "@/modules/schedule/polymet/ui/button";
import { Skeleton } from "@/modules/schedule/polymet/ui/skeleton";

/* ───────────────────────── Ilustración ───────────────────────── */

const MINI_WEEK: Array<Array<"c" | "f" | "r" | "x">> = [
  ["c", "c", "r", "f", "c"],
  ["f", "c", "r", "c", "c"],
  ["c", "f", "r", "c", "x"],
  ["c", "c", "r", "f", "c"],
  ["f", "c", "r", "c", "x"],
];
const MINI_ACCENTS = ["#6366f1", "#14b8a6", "#f97316", "#d946ef", "#0ea5e9"];

function MiniWeek() {
  return (
    <div aria-hidden className="relative mx-auto grid w-full max-w-[260px] grid-cols-5 gap-1.5 rounded-3xl bg-card p-3 shadow-lg">
      {MINI_WEEK.map((col, c) => (
        <div key={c} className="flex flex-col gap-1.5">
          <span className="mx-auto mb-0.5 h-1.5 w-5 rounded-full bg-muted" />
          {col.map((cell, r) => (
            <span
              key={r}
              className={cn(
                "block rounded-md",
                cell === "r" ? "schedule-break-pattern h-2.5 bg-muted" : "h-7",
                cell === "f" && "border border-dashed border-border",
                cell === "x" && "opacity-0",
                "schedule-mini-week-cell",
              )}
              style={{
                animationDelay: `${(c * 5 + r) * 35}ms`,
                ...(cell === "c" ? { backgroundColor: `color-mix(in srgb, ${MINI_ACCENTS[(c + r) % 5]} 22%, transparent)` } : {}),
              }}
            />
          ))}
        </div>
      ))}
      <span className="absolute -right-3 -top-3 flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
        <CalendarDaysIcon className="size-5" strokeWidth={1.9} />
      </span>
    </div>
  );
}

/* ───────────────────────── Sin horario ───────────────────────── */

type ScheduleEmptyStateProps = {
  canEditStructure: boolean;
  onCreate: () => void;
};

const STEPS = [
  { icon: CalendarDaysIcon, title: "Días", text: "Qué días impartes clases" },
  { icon: SunriseIcon, title: "Jornadas", text: "Matutina, vespertina, nocturna…" },
  { icon: Clock4Icon, title: "Períodos", text: "Duración, recreos y pausas" },
  { icon: LayersIcon, title: "Clases", text: "Ubica cada asignatura" },
];

export function ScheduleEmptyState({ canEditStructure, onCreate }: ScheduleEmptyStateProps) {
  return (
    <section className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-card p-6 shadow-sm sm:p-8 lg:grid-cols-[1.1fr_1fr]">
      <div className="order-2 lg:order-1">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Tu semana, en orden</p>
        <h2 className="mt-3 max-w-md text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">Construyamos tu horario en cuatro pasos</h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Define cuándo enseñas y AulaBase generará los períodos por ti. Después solo tendrás que ubicar tus asignaturas; Inicio, Cursos y Asistencia usarán este horario automáticamente.
        </p>

        <ol className="mt-7 grid gap-2 sm:grid-cols-2">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex items-center gap-3 rounded-2xl bg-muted/60 p-3">
              <span className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-primary shadow-xs">
                <step.icon className="size-[18px]" strokeWidth={1.9} aria-hidden />
                <span className="absolute -left-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">{i + 1}</span>
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-semibold text-foreground">{step.title}</span>
                <span className="block truncate text-[11.5px] text-muted-foreground">{step.text}</span>
              </span>
            </li>
          ))}
        </ol>

        {canEditStructure ? (
          <Button onClick={onCreate} className="mt-8 h-12 rounded-full px-6 text-[15px] font-semibold shadow-md shadow-primary/25">
            Crear mi horario
            <ArrowRightIcon className="size-4" />
          </Button>
        ) : (
          <p className="mt-8 flex max-w-md items-start gap-2.5 rounded-2xl bg-muted/70 p-4 text-xs leading-relaxed text-muted-foreground">
            <LockIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
            Tu cuenta no tiene permiso para configurar la estructura del horario. Pide a coordinación que la configure; podrás consultarla aquí en cuanto esté lista.
          </p>
        )}
      </div>
      <div className="order-1 px-4 lg:order-2">
        <MiniWeek />
      </div>
    </section>
  );
}

/* ───────────────────────── Carga ───────────────────────── */

export function ScheduleLoadingState() {
  return (
    <div className="flex flex-col gap-5" role="status" aria-live="polite" aria-label="Cargando horario">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-40 rounded-full" />
          <Skeleton className="h-8 w-56 rounded-xl" />
        </div>
        <Skeleton className="hidden h-11 w-72 rounded-full md:block" />
      </div>
      <Skeleton className="h-[76px] w-full rounded-3xl" />
      <div className="grid gap-5 min-[1440px]:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-3xl bg-card p-5 shadow-sm">
          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, c) => (
              <div key={c} className="flex flex-col gap-2">
                <Skeleton className="mb-3 h-4 w-16 rounded-full" />
                {Array.from({ length: 6 }).map((__, r) => (
                  <Skeleton key={r} className={cn("w-full rounded-xl", r === 2 ? "h-5" : "h-14")} style={{ animationDelay: `${(c + r) * 80}ms` }} />
                ))}
              </div>
            ))}
          </div>
        </div>
        <Skeleton className="hidden h-[520px] rounded-3xl min-[1440px]:block" />
      </div>
      <span className="sr-only">Cargando tu horario…</span>
    </div>
  );
}

/* ───────────────────────── Error ───────────────────────── */

type ScheduleErrorStateProps = {
  message: string;
  retrying: boolean;
  onRetry: () => void;
};

export function ScheduleErrorState({ message, retrying, onRetry }: ScheduleErrorStateProps) {
  return (
    <section role="alert" className="mx-auto flex max-w-lg flex-col items-center rounded-[2rem] bg-card px-6 py-12 text-center shadow-sm sm:px-12">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <WifiOffIcon className="size-6" strokeWidth={1.75} aria-hidden />
      </span>
      <h2 className="mt-5 text-lg font-semibold text-foreground">No pudimos abrir tu horario</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{message}</p>
      <p className="mt-1 text-xs text-muted-foreground">Ningún dato se ha modificado.</p>
      <Button onClick={onRetry} disabled={retrying} className="mt-6 h-11 rounded-full px-6 font-semibold">
        {retrying ? <Loader2Icon className="size-4 animate-spin" /> : <RefreshCwIcon className="size-4" />}
        {retrying ? "Reintentando…" : "Reintentar"}
      </Button>
    </section>
  );
}

/* ───────────────────────── Estructura lista sin clases ───────────────────────── */

type StructureReadyBannerProps = {
  freePeriods: number;
  canAssign: boolean;
  onStart: () => void;
};

export function StructureReadyBanner({ freePeriods, canAssign, onStart }: StructureReadyBannerProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-primary p-5 text-primary-foreground shadow-md shadow-primary/20 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div>
        <p className="text-[15px] font-semibold">Tu estructura está lista</p>
        <p className="mt-0.5 text-sm text-primary-foreground/85">
          Tienes {freePeriods} {freePeriods === 1 ? "período libre" : "períodos libres"}. {canAssign ? "Toca cualquiera para ubicar una asignatura." : "Aún no hay clases asignadas."}
        </p>
      </div>
      {canAssign && (
        <Button onClick={onStart} variant="secondary" className="h-11 shrink-0 rounded-full bg-card px-5 font-semibold text-primary hover:bg-card/90">
          Asignar la primera clase
          <ArrowRightIcon className="size-4" />
        </Button>
      )}
    </div>
  );
}
