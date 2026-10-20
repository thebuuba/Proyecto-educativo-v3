import { forwardRef, type CSSProperties } from "react";
import { AlertTriangleIcon, Loader2Icon, MapPinIcon, PlusIcon } from "lucide-react";

import { cn } from "../ui/utils";
import type { TimeMapBlock } from "@/modules/schedule/polymet/lib/schedule-view";
import {
  BLOCK_META,
  formatClock,
  formatDuration,
  formatRange,
  tint,
} from "@/modules/schedule/polymet/lib/schedule-time";

export type BlockGhost = { name: string; detail: string; accent: string };

type ScheduleBlockProps = {
  block: TimeMapBlock;
  variant: "grid" | "agenda";
  height?: number;
  selected?: boolean;
  highlighted?: boolean;
  pending?: boolean;
  ghost?: BlockGhost | null;
  interactive?: boolean;
  onSelect?: (key: string) => void;
  tabIndex?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Pieza visual del horario. Las clases llevan el acento de su asignatura,
 * los períodos libres un contorno discontinuo y los descansos una trama diagonal.
 */
export const ScheduleBlock = forwardRef<HTMLElement, ScheduleBlockProps>(function ScheduleBlock(
  { block, variant, height = 64, selected, highlighted, pending, ghost, interactive = true, onSelect, tabIndex, className, style },
  ref,
) {
  const minutes = block.endMin - block.startMin;
  const isGrid = variant === "grid";
  const tiny = isGrid && height < 30;
  const compact = isGrid && height < 50;

  /* ── Descansos y espacios entre jornadas ── */
  if (block.kind === "rest" || block.kind === "gap") {
    const meta = BLOCK_META[block.blockType];
    const Icon = meta.icon;
    const isGap = block.kind === "gap";
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        style={style}
        role="note"
        aria-label={`${block.name}, ${formatRange(block.startTime, block.endTime)}`}
        className={cn(
          "schedule-break-pattern flex items-center gap-2 text-muted-foreground",
          isGrid ? "justify-center rounded-lg px-2" : "rounded-xl px-4 py-2.5",
          isGap ? "bg-transparent opacity-80" : "bg-muted/70",
          className,
        )}
      >
        <Icon className={cn("shrink-0", tiny ? "size-3" : "size-3.5")} strokeWidth={1.75} aria-hidden />
        {!tiny || !isGrid ? (
          <span className={cn("truncate font-medium", isGrid ? "text-[11px]" : "text-xs")}>
            {block.name}
            <span className="font-normal opacity-80"> · {formatDuration(minutes)}</span>
          </span>
        ) : (
          <span className="truncate text-[10px] font-medium">{block.name}</span>
        )}
      </div>
    );
  }

  const handleClick = () => interactive && onSelect?.(block.key);
  const Tag = interactive ? "button" : "div";
  const sharedProps = {
    ref: ref as React.Ref<HTMLButtonElement & HTMLDivElement>,
    style,
    "data-block-key": block.key,
    tabIndex: interactive ? tabIndex : undefined,
    onClick: interactive ? handleClick : undefined,
    type: interactive ? ("button" as const) : undefined,
    "aria-pressed": interactive ? Boolean(selected) : undefined,
  };

  /* ── Período libre ── */
  if (block.kind === "free" && !ghost) {
    return (
      <Tag
        {...sharedProps}
        aria-label={`${block.name} libre, ${formatRange(block.startTime, block.endTime)}${block.journeyLabel ? `, jornada ${block.journeyLabel}` : ""}. ${interactive ? "Asignar clase" : ""}`}
        className={cn(
          "group/free relative flex w-full rounded-xl border border-dashed text-left transition-all duration-200 ease-out",
          "border-border bg-card/50 text-muted-foreground",
          interactive &&
            "cursor-pointer hover:border-primary/60 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          highlighted && "border-primary/50 bg-accent/70 text-accent-foreground",
          selected && "border-solid border-primary bg-accent text-accent-foreground ring-2 ring-primary/25",
          isGrid ? "items-center px-2.5" : "items-center gap-3 px-4 py-3.5",
          className,
        )}
      >
        <span className="min-w-0 flex-1">
          <span className={cn("block truncate font-medium", isGrid ? "text-[12px]" : "text-sm")}>
            {isGrid && compact ? "Libre" : block.name}
          </span>
          {!compact && (
            <span className={cn("block truncate tabular-nums opacity-80", isGrid ? "text-[11px]" : "text-xs")}>
              {isGrid ? formatRange(block.startTime, block.endTime) : `Libre · ${formatDuration(minutes)}`}
            </span>
          )}
        </span>
        {interactive && (
          <span
            className={cn(
              "flex shrink-0 items-center gap-1 rounded-full font-medium text-primary transition-opacity",
              isGrid ? "size-6 justify-center bg-primary/10 opacity-0 group-hover/free:opacity-100 group-focus-visible/free:opacity-100" : "bg-primary/10 px-3 py-1 text-xs",
              (selected || highlighted) && "opacity-100",
            )}
            aria-hidden
          >
            {pending ? <Loader2Icon className="size-3.5 animate-spin" /> : <PlusIcon className="size-3.5" strokeWidth={2.25} />}
            {!isGrid && "Asignar"}
          </span>
        )}
      </Tag>
    );
  }

  /* ── Clase asignada (o vista previa de asignación) ── */
  const subject = ghost
    ? { name: ghost.name, detail: ghost.detail, accent: ghost.accent, room: null }
    : block.subject!;
  const accent = subject.accent;

  return (
    <Tag
      {...sharedProps}
      aria-label={`${subject.name}, ${subject.detail}, ${formatRange(block.startTime, block.endTime)}${subject.room ? `, ${subject.room}` : ""}${block.flagged ? ". Requiere revisión" : ""}${ghost ? ". Vista previa sin guardar" : ""}`}
      style={{
        ...style,
        backgroundColor: ghost ? tint(accent, 6) : `color-mix(in srgb, ${accent} 7%, hsl(var(--card)))`,
        borderColor: ghost ? accent : undefined,
      }}
      className={cn(
        "group/class relative flex w-full overflow-hidden text-left transition-all duration-200 ease-out",
        ghost ? "border-2 border-dashed" : "shadow-sm ring-1 ring-foreground/[0.04]",
        interactive && "cursor-pointer hover:-translate-y-px hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:hover:translate-y-0",
        selected && !ghost && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        block.flagged && !selected && "ring-1 ring-warning/70",
        pending && "opacity-60",
        isGrid ? "rounded-xl pl-3 pr-2" : "rounded-2xl py-3 pl-5 pr-4",
        isGrid && (compact ? "items-center" : "flex-col justify-center py-1.5"),
        className,
      )}
    >
      <span
        aria-hidden
        className={cn("absolute rounded-full", isGrid ? "inset-y-1.5 left-1 w-[3px]" : "inset-y-3 left-2 w-1")}
        style={{ backgroundColor: accent }}
      />
      {isGrid && compact ? (
        <span className="flex min-w-0 flex-1 items-baseline gap-1.5">
          <span className="truncate text-[12px] font-semibold text-foreground">{subject.name}</span>
          <span className="truncate text-[11px] text-muted-foreground">{subject.detail.split(" · ")[0]}</span>
        </span>
      ) : isGrid ? (
        <>
          <span className="block truncate text-[12.5px] font-semibold leading-tight text-foreground">{subject.name}</span>
          <span className="mt-0.5 block truncate text-[11px] leading-tight text-muted-foreground">{subject.detail}</span>
          {height >= 66 && (
            <span className="mt-1 flex items-center gap-1.5 text-[11px] tabular-nums text-muted-foreground">
              {formatRange(block.startTime, block.endTime)}
              {subject.room && (
                <>
                  <span aria-hidden className="size-0.5 rounded-full bg-current" />
                  <span className="truncate">{subject.room}</span>
                </>
              )}
            </span>
          )}
        </>
      ) : (
        <span className="flex min-w-0 flex-1 items-center gap-3">
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[15px] font-semibold text-foreground">{subject.name}</span>
            <span className="mt-0.5 block truncate text-[13px] text-muted-foreground">{subject.detail}</span>
          </span>
          <span className="hidden shrink-0 flex-col items-end gap-0.5 text-xs text-muted-foreground min-[400px]:flex">
            <span className="tabular-nums">{formatDuration(minutes)}</span>
            {subject.room && (
              <span className="flex items-center gap-1">
                <MapPinIcon className="size-3" aria-hidden />
                {subject.room}
              </span>
            )}
          </span>
        </span>
      )}

      {ghost && (
        <span className="absolute right-1.5 top-1.5 rounded-full bg-card px-1.5 py-px text-[10px] font-medium text-muted-foreground shadow-xs">
          Vista previa
        </span>
      )}
      {block.flagged && !ghost && (
        <span className="absolute right-1.5 top-1.5 flex size-[18px] items-center justify-center rounded-full bg-warning text-warning-foreground shadow-xs" aria-hidden>
          <AlertTriangleIcon className="size-2.5" strokeWidth={2.5} />
        </span>
      )}
      {pending && (
        <span className="absolute inset-0 flex items-center justify-center bg-card/40" aria-hidden>
          <Loader2Icon className="size-4 animate-spin text-primary" />
        </span>
      )}
      {!isGrid && !ghost && <span className="sr-only">{formatClock(block.startTime)}</span>}
    </Tag>
  );
});
