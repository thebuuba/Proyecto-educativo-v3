import { AlertTriangleIcon, ArrowUpRightIcon, CalendarCheck2Icon, Trash2Icon } from "lucide-react";

import { cn } from "../ui/utils";
import { Button } from "@/modules/schedule/polymet/ui/button";
import type { ReviewItem, WeekModel } from "@/modules/schedule/polymet/lib/schedule-week-model";
import { dayMeta, formatClock, formatHours, subjectAccent } from "@/modules/schedule/polymet/lib/schedule-time";

type ScheduleOverviewPanelProps = {
  model: WeekModel;
  today: number;
  nowMinute: number;
  canAssign: boolean;
  reviewRef?: React.Ref<HTMLDivElement>;
  onOpenCell: (key: string) => void;
  onRemoveOrphan: (item: ReviewItem) => void;
  onPlaceOrphan?: (item: ReviewItem) => void;
};

function SectionTitle({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-2">
      <h3 className="text-[13px] font-semibold text-foreground">{children}</h3>
      {aside && <span className="text-[11px] text-muted-foreground">{aside}</span>}
    </div>
  );
}

/** Panel contextual cuando no hay nada seleccionado: hoy, carga semanal y revisión. */
export function ScheduleOverviewPanel({ model, today, nowMinute, canAssign, reviewRef, onOpenCell, onRemoveOrphan, onPlaceOrphan }: ScheduleOverviewPanelProps) {
  const todayDay = model.days.find((d) => d.day === today);
  const todayClasses = todayDay?.cells.filter((c) => c.kind === "class") ?? [];
  const maxMinutes = Math.max(60, ...model.days.map((d) => d.teachingMinutes));

  return (
    <div className="flex flex-col gap-7">
      <section aria-labelledby="overview-today">
        <SectionTitle aside={todayClasses.length ? `${todayClasses.length} clases` : undefined}>
          <span id="overview-today">Hoy · {dayMeta(today).long}</span>
        </SectionTitle>
        {!todayDay ? (
          <p className="rounded-2xl bg-muted/60 px-4 py-3 text-xs text-muted-foreground">Hoy no es un día de clases en tu estructura.</p>
        ) : todayClasses.length === 0 ? (
          <p className="rounded-2xl bg-muted/60 px-4 py-3 text-xs text-muted-foreground">No tienes clases asignadas hoy.</p>
        ) : (
          <ol className="relative flex flex-col gap-1 before:absolute before:bottom-3 before:left-[7px] before:top-3 before:w-px before:bg-border">
            {todayClasses.map((cell) => {
              const entry = cell.entry!;
              const accent = subjectAccent(entry.subjectName, entry.appearanceColor);
              const isNow = nowMinute >= cell.startMin && nowMinute < cell.endMin;
              const isPast = nowMinute >= cell.endMin;
              return (
                <li key={cell.key}>
                  <button
                    type="button"
                    onClick={() => onOpenCell(cell.key)}
                    className={cn(
                      "relative flex w-full items-center gap-3 rounded-xl py-2 pl-0 pr-2 text-left transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isPast && "opacity-55",
                    )}
                  >
                    <span
                      className={cn("relative z-10 ml-[3px] size-[9px] shrink-0 rounded-full ring-[3px] ring-card", isNow && "ring-primary/25")}
                      style={{ backgroundColor: accent }}
                      aria-hidden
                    />
                    <span className="w-10 shrink-0 text-xs font-semibold tabular-nums text-foreground">{formatClock(cell.slot.startTime)}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium text-foreground">{entry.subjectName}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {entry.gradeName} {entry.sectionName}
                        {entry.room ? ` · ${entry.room}` : ""}
                      </span>
                    </span>
                    {isNow && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">Ahora</span>}
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <section aria-labelledby="overview-load">
        <SectionTitle aside={formatHours(model.totals.teachingMinutes)}>
          <span id="overview-load">Carga semanal</span>
        </SectionTitle>
        <ul className="flex flex-col gap-2.5">
          {model.days.map((d) => (
            <li key={d.day} className="grid grid-cols-[34px_1fr_44px] items-center gap-3">
              <span className={cn("text-xs font-medium", d.day === today ? "text-primary" : "text-muted-foreground")}>{d.meta.short}</span>
              <span className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden>
                <span className="block h-full rounded-full bg-primary/70 transition-[width] duration-500" style={{ width: `${(d.teachingMinutes / maxMinutes) * 100}%` }} />
              </span>
              <span className="text-right text-xs tabular-nums text-foreground">
                {formatHours(d.teachingMinutes)}
                <span className="sr-only"> de clase el {d.meta.long}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="overview-review" ref={reviewRef} tabIndex={-1} className="scroll-mt-24 outline-none">
        <SectionTitle aside={model.review.length ? `${model.review.length}` : undefined}>
          <span id="overview-review">Requiere revisión</span>
        </SectionTitle>
        {model.review.length === 0 ? (
          <div className="flex items-center gap-3 rounded-2xl bg-success/10 px-4 py-3">
            <CalendarCheck2Icon className="size-4 shrink-0 text-success" strokeWidth={1.9} aria-hidden />
            <p className="text-xs text-foreground">Todo en orden. No hay clases con problemas.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {model.review.map((item) => (
              <li key={item.id} className="rounded-2xl border border-warning/40 bg-warning/[0.08] p-3">
                <div className="flex gap-2.5">
                  <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-warning" strokeWidth={1.9} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium leading-snug text-foreground">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{item.message}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.cellKey && (
                        <Button size="sm" variant="ghost" className="h-8 rounded-full bg-card px-3 text-xs shadow-xs" onClick={() => onOpenCell(item.cellKey!)}>
                          Ver en el horario
                          <ArrowUpRightIcon className="size-3.5" />
                        </Button>
                      )}
                      {item.kind === "orphan" && canAssign && (
                        <Button size="sm" variant="ghost" className="h-8 rounded-full bg-card px-3 text-xs shadow-xs" onClick={() => onPlaceOrphan?.(item)}>Reubicar clase<ArrowUpRightIcon className="size-3.5" /></Button>
                      )}
                      {item.kind === "orphan" && canAssign && (
                        <Button size="sm" variant="ghost" className="h-8 rounded-full bg-card px-3 text-xs text-destructive shadow-xs hover:text-destructive" onClick={() => onRemoveOrphan(item)}>
                          <Trash2Icon className="size-3.5" />
                          Quitar clase
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-label="Leyenda" className="flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-5 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-4 rounded bg-card shadow-xs ring-1 ring-foreground/10" aria-hidden /> Clase
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-4 rounded border border-dashed border-muted-foreground/50" aria-hidden /> Libre
        </span>
        <span className="flex items-center gap-1.5">
          <span className="schedule-break-pattern h-3 w-4 rounded bg-muted" aria-hidden /> Descanso
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-warning" aria-hidden /> Revisión
        </span>
      </section>
    </div>
  );
}
