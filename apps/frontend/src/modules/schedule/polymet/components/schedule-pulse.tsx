import { AlertTriangleIcon, ArrowRightIcon, BookOpenIcon, Clock3Icon, LayersIcon, SparklesIcon, type LucideIcon } from "lucide-react";

import { cn } from "../ui/utils";
import type { NowState, WeekModel } from "@/modules/schedule/polymet/lib/schedule-week-model";
import { dayMeta, formatClock, formatDuration, formatHours, subjectAccent } from "@/modules/schedule/polymet/lib/schedule-time";

type SchedulePulseProps = {
  now: NowState;
  totals: WeekModel["totals"];
  highlightFree: boolean;
  onToggleFree: () => void;
  onShowReview: () => void;
  onOpenCell: (key: string) => void;
};

function describeNow(now: NowState) {
  switch (now.type) {
    case "in-class":
      return {
        eyebrow: "En clase ahora",
        live: true,
        cell: now.cell,
        sub: `Termina a las ${formatClock(now.cell.slot.endTime)} · quedan ${formatDuration(now.remaining)}`,
      };
    case "upcoming-today":
      return {
        eyebrow: `Próxima clase · en ${formatDuration(now.inMinutes)}`,
        live: false,
        cell: now.cell,
        sub: `Hoy, ${formatClock(now.cell.slot.startTime)}–${formatClock(now.cell.slot.endTime)}${now.cell.entry?.room ? ` · ${now.cell.entry.room}` : ""}`,
      };
    case "upcoming-later":
      return {
        eyebrow: `Próxima clase · ${now.daysAhead === 1 ? "mañana" : dayMeta(now.cell.day).long.toLowerCase()}`,
        live: false,
        cell: now.cell,
        sub: `${dayMeta(now.cell.day).long}, ${formatClock(now.cell.slot.startTime)}–${formatClock(now.cell.slot.endTime)}${now.cell.entry?.room ? ` · ${now.cell.entry.room}` : ""}`,
      };
    default:
      return null;
  }
}

function Metric({
  icon: Icon,
  label,
  value,
  hint,
  active,
  tone = "neutral",
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  active?: boolean;
  tone?: "neutral" | "primary" | "warning";
  onClick?: () => void;
}) {
  const content = (
    <>
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-xl",
          tone === "primary" && "bg-accent text-accent-foreground",
          tone === "warning" && "bg-warning/20 text-foreground",
          tone === "neutral" && "bg-muted text-muted-foreground",
        )}
      >
        <Icon className="size-4" strokeWidth={1.9} aria-hidden />
      </span>
      <span className="min-w-0 text-left">
        <span className="block text-lg font-semibold leading-tight tabular-nums text-foreground">{value}</span>
        <span className="block truncate text-[11.5px] text-muted-foreground">{label}</span>
      </span>
      {hint && <span className="sr-only">{hint}</span>}
    </>
  );
  const base = "flex min-w-0 items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors";
  if (!onClick) return <div className={base}>{content}</div>;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        base,
        "hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active && "bg-accent hover:bg-accent",
      )}
    >
      {content}
    </button>
  );
}

/** Franja de pulso semanal: estado actual + métricas calculadas desde datos reales. */
export function SchedulePulse({ now, totals, highlightFree, onToggleFree, onShowReview, onOpenCell }: SchedulePulseProps) {
  const info = describeNow(now);
  const entry = info?.cell.entry;
  const accent = entry ? subjectAccent(entry.subjectName, entry.appearanceColor) : undefined;

  return (
    <section aria-label="Resumen de la semana" className="grid gap-2 rounded-3xl bg-card p-2 shadow-sm lg:grid-cols-[minmax(0,1.25fr)_minmax(0,2fr)]">
      {info && entry ? (
        <button
          type="button"
          onClick={() => onOpenCell(info.cell.key)}
          className="group flex min-w-0 items-center gap-4 rounded-2xl bg-muted/60 p-3 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: `color-mix(in srgb, ${accent} 16%, transparent)` }}>
            <BookOpenIcon className="size-5" style={{ color: accent }} strokeWidth={1.9} aria-hidden />
            {info.live && (
              <span className="absolute -right-0.5 -top-0.5 flex size-3" aria-hidden>
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex size-3 rounded-full border-2 border-card bg-success" />
              </span>
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">{info.eyebrow}</span>
            <span className="mt-0.5 block truncate text-[15px] font-semibold text-foreground">
              {entry.subjectName} · {entry.gradeName} {entry.sectionName}
            </span>
            <span className="block truncate text-xs text-muted-foreground">{info.sub}</span>
          </span>
          <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
        </button>
      ) : (
        <div className="flex min-w-0 items-center gap-4 rounded-2xl bg-muted/60 p-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-card text-muted-foreground">
            <SparklesIcon className="size-5" strokeWidth={1.75} aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block text-[15px] font-semibold text-foreground">Aún no hay clases asignadas</span>
            <span className="block text-xs text-muted-foreground">Cuando asignes clases, aquí verás la que está en curso y la siguiente.</span>
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
        <Metric icon={BookOpenIcon} label="Clases por semana" value={String(totals.classes)} />
        <Metric icon={Clock3Icon} label="Horas lectivas" value={formatHours(totals.teachingMinutes)} />
        <Metric
          icon={LayersIcon}
          label={highlightFree ? "Mostrando libres" : "Períodos libres"}
          value={String(totals.freePeriods)}
          tone="primary"
          active={highlightFree}
          onClick={totals.freePeriods > 0 ? onToggleFree : undefined}
          hint="Resaltar los períodos libres en el horario"
        />
        <Metric
          icon={AlertTriangleIcon}
          label={totals.review === 1 ? "Requiere revisión" : "Requieren revisión"}
          value={String(totals.review)}
          tone={totals.review > 0 ? "warning" : "neutral"}
          onClick={totals.review > 0 ? onShowReview : undefined}
        />
      </div>
    </section>
  );
}
