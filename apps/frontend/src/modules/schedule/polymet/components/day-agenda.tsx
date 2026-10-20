import { Fragment } from "react";
import { CalendarOffIcon } from "lucide-react";

import { cn } from "../ui/utils";
import type { TimeMapBlock, TimeMapColumn } from "@/modules/schedule/polymet/lib/schedule-view";
import { formatClock, formatRange, fromMinutes } from "@/modules/schedule/polymet/lib/schedule-time";
import { ScheduleBlock, type BlockGhost } from "@/modules/schedule/polymet/components/schedule-block";

type DayAgendaProps = {
  column: TimeMapColumn | null;
  selectedKey?: string | null;
  highlightFree?: boolean;
  pendingKeys?: Set<string>;
  ghost?: BlockGhost | null;
  nowMinute?: number | null;
  interactive?: boolean;
  onSelectBlock?: (key: string) => void;
};

function journeyHeaderFor(column: TimeMapColumn, block: TimeMapBlock, prev: TimeMapBlock | undefined) {
  if (block.kind === "gap") return null;
  const span = column.journeys.find((j) => block.startMin >= j.startMin && block.endMin <= j.endMin);
  if (!span) return null;
  const prevSpan = prev ? column.journeys.find((j) => prev.startMin >= j.startMin && prev.endMin <= j.endMin) : undefined;
  return prevSpan === span ? null : span;
}

/** Agenda del día: lectura vertical cómoda, pensada para móvil y para la vista de día. */
export function DayAgenda({ column, selectedKey, highlightFree, pendingKeys, ghost, nowMinute, interactive = true, onSelectBlock }: DayAgendaProps) {
  if (!column || column.blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border px-6 py-14 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <CalendarOffIcon className="size-5" strokeWidth={1.75} />
        </span>
        <p className="text-sm font-medium text-foreground">Este día no tiene períodos configurados</p>
        <p className="max-w-xs text-xs text-muted-foreground">Agrega el día desde la estructura del horario si impartes clases en él.</p>
      </div>
    );
  }

  return (
    <ol className="flex flex-col gap-2" aria-label={`Agenda del ${column.label.toLowerCase()}`}>
      {column.blocks.map((block, index) => {
        const header = journeyHeaderFor(column, block, column.blocks[index - 1]);
        const isNow = column.isToday && nowMinute != null && nowMinute >= block.startMin && nowMinute < block.endMin;
        const isRest = block.kind === "rest" || block.kind === "gap";
        return (
          <Fragment key={block.key}>
            {header && (
              <li className={cn("flex items-baseline justify-between px-1", index > 0 ? "pt-4" : "pt-0")} aria-hidden>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/80">{header.label}</span>
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {formatRange(fromMinutes(header.startMin), fromMinutes(header.endMin))}
                </span>
              </li>
            )}
            <li className="grid grid-cols-[52px_1fr] items-stretch gap-3 sm:grid-cols-[60px_1fr]">
              <div className={cn("flex flex-col items-end pt-3 text-right", isRest && "justify-center pt-0")}>
                <span className={cn("text-[13px] font-semibold tabular-nums", isNow ? "text-primary" : "text-foreground", isRest && "text-xs font-medium text-muted-foreground")}>
                  {formatClock(block.startTime)}
                </span>
                {!isRest && <span className="text-[11px] tabular-nums text-muted-foreground">{formatClock(block.endTime)}</span>}
                {isNow && <span className="mt-1 rounded-full bg-primary/10 px-1.5 text-[10px] font-semibold text-primary">Ahora</span>}
              </div>
              <ScheduleBlock
                block={block}
                variant="agenda"
                selected={selectedKey === block.key}
                highlighted={highlightFree && block.kind === "free"}
                pending={pendingKeys?.has(block.key)}
                ghost={selectedKey === block.key && block.kind === "free" ? ghost : null}
                interactive={interactive}
                onSelect={onSelectBlock}
                className={cn(isNow && block.kind === "class" && "ring-2 ring-primary/40")}
              />
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}

type DaySwitcherProps = {
  columns: TimeMapColumn[];
  activeDay: number | null;
  onChange: (day: number) => void;
  className?: string;
};

/** Selector de día con recuento de clases; táctil y navegable con teclado. */
export function DaySwitcher({ columns, activeDay, onChange, className }: DaySwitcherProps) {
  return (
    <div role="tablist" aria-label="Días de la semana" className={cn("scrollbar-none -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1", className)}>
      {columns.map((col) => {
        const active = col.day === activeDay;
        const classCount = col.blocks.filter((b) => b.kind === "class").length;
        const freeCount = col.blocks.filter((b) => b.kind === "free").length;
        return (
          <button
            key={col.day}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={`${col.label}: ${classCount} clases${freeCount ? `, ${freeCount} libres` : ""}`}
            onClick={() => onChange(col.day)}
            className={cn(
              "relative flex min-h-[60px] min-w-[60px] flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-2 transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              active ? "bg-primary text-primary-foreground shadow-md" : "bg-card text-foreground shadow-xs hover:bg-accent",
            )}
          >
            <span className={cn("text-[11px] font-medium uppercase tracking-wide", active ? "text-primary-foreground/85" : "text-muted-foreground")}>
              {col.shortLabel}
            </span>
            <span className="text-base font-semibold tabular-nums leading-none">{classCount}</span>
            {col.isToday && (
              <span className={cn("absolute right-2 top-2 size-1.5 rounded-full", active ? "bg-primary-foreground" : "bg-primary")} aria-hidden />
            )}
          </button>
        );
      })}
    </div>
  );
}
