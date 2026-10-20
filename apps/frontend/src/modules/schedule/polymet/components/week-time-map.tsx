import { useCallback, useMemo, useRef, type KeyboardEvent } from "react";

import { cn } from "../ui/utils";
import type { TimeMapColumn } from "@/modules/schedule/polymet/lib/schedule-view";
import type { JourneySpan } from "@/modules/schedule/polymet/lib/schedule-week-model";
import { formatRange, fromMinutes, formatClock } from "@/modules/schedule/polymet/lib/schedule-time";
import { ScheduleBlock, type BlockGhost } from "@/modules/schedule/polymet/components/schedule-block";

type WeekTimeMapProps = {
  columns: TimeMapColumn[];
  rangeStart: number;
  rangeEnd: number;
  pxPerMinute?: number;
  selectedKey?: string | null;
  highlightFree?: boolean;
  pendingKeys?: Set<string>;
  ghost?: BlockGhost | null;
  nowMinute?: number | null;
  interactive?: boolean;
  dense?: boolean;
  onSelectBlock?: (key: string) => void;
  className?: string;
};

type GutterSpan = { id: string; label: string; startMin: number; endMin: number };

function unionJourneys(columns: TimeMapColumn[]): GutterSpan[] {
  const map = new Map<string, GutterSpan>();
  columns.forEach((c) =>
    c.journeys.forEach((j: JourneySpan) => {
      const id = j.journey?.id ?? j.label;
      const current = map.get(id);
      if (current) {
        current.startMin = Math.min(current.startMin, j.startMin);
        current.endMin = Math.max(current.endMin, j.endMin);
      } else map.set(id, { id, label: j.label, startMin: j.startMin, endMin: j.endMin });
    }),
  );
  return Array.from(map.values()).sort((a, b) => a.startMin - b.startMin);
}

/**
 * Mapa semanal proporcional al tiempo real: cada día conserva sus propias horas,
 * de modo que estructuras distintas por día se leen con exactitud.
 */
export function WeekTimeMap({
  columns,
  rangeStart,
  rangeEnd,
  pxPerMinute = 1.5,
  selectedKey,
  highlightFree,
  pendingKeys,
  ghost,
  nowMinute,
  interactive = true,
  dense = false,
  onSelectBlock,
  className,
}: WeekTimeMapProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const height = (rangeEnd - rangeStart) * pxPerMinute;
  const hours = useMemo(() => {
    const list: number[] = [];
    for (let m = rangeStart; m <= rangeEnd; m += 60) list.push(m);
    return list;
  }, [rangeStart, rangeEnd]);
  const spans = useMemo(() => unionJourneys(columns), [columns]);

  const focusables = useMemo(
    () =>
      columns.map((c) =>
        c.blocks.filter((b) => b.kind === "class" || b.kind === "free").map((b) => ({ key: b.key, start: b.startMin })),
      ),
    [columns],
  );

  const firstFocusable = focusables.flat()[0]?.key;
  const activeKey = selectedKey && focusables.flat().some((f) => f.key === selectedKey) ? selectedKey : firstFocusable;

  const focusKey = (key: string) => {
    rootRef.current?.querySelector<HTMLElement>(`[data-block-key="${CSS.escape(key)}"]`)?.focus();
  };

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      const key = target.dataset.blockKey;
      if (!key) return;
      const col = focusables.findIndex((list) => list.some((f) => f.key === key));
      if (col < 0) return;
      const idx = focusables[col].findIndex((f) => f.key === key);
      const current = focusables[col][idx];
      let next: string | undefined;
      if (event.key === "ArrowDown") next = focusables[col][idx + 1]?.key;
      if (event.key === "ArrowUp") next = focusables[col][idx - 1]?.key;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        const step = event.key === "ArrowRight" ? 1 : -1;
        for (let c = col + step; c >= 0 && c < focusables.length; c += step) {
          if (!focusables[c].length) continue;
          next = [...focusables[c]].sort((a, b) => Math.abs(a.start - current.start) - Math.abs(b.start - current.start))[0].key;
          break;
        }
      }
      if (next) {
        event.preventDefault();
        focusKey(next);
      }
    },
    [focusables],
  );

  const gutter = dense ? 52 : 76;
  const minCol = dense ? 92 : 108;

  return (
    <div
      ref={rootRef}
      onKeyDown={interactive ? onKeyDown : undefined}
      className={cn("relative", className)}
      role={interactive ? "group" : "img"}
      aria-label={interactive ? "Horario semanal. Usa las flechas para moverte entre períodos." : "Vista previa del horario semanal"}
    >
      <div className="flex" style={{ minWidth: gutter + columns.length * minCol }}>
        {/* Regla horaria con jornadas */}
        <div className="relative shrink-0" style={{ width: gutter }}>
          <div className={cn(dense ? "h-12" : "h-[68px]")} />
          <div className="relative" style={{ height }}>
            {hours.map((m) => (
              <span
                key={m}
                className="absolute right-3 -translate-y-1/2 text-[11px] font-medium tabular-nums text-muted-foreground"
                style={{ top: (m - rangeStart) * pxPerMinute }}
              >
                {formatClock(fromMinutes(m))}
              </span>
            ))}
            {!dense &&
              spans.map((s) => (
                <div
                  key={s.id}
                  className="absolute left-1.5 flex w-4 justify-center"
                  style={{ top: (s.startMin - rangeStart) * pxPerMinute + 2, height: (s.endMin - s.startMin) * pxPerMinute - 4 }}
                  title={`${s.label} · ${formatRange(fromMinutes(s.startMin), fromMinutes(s.endMin))}`}
                >
                  <span className="absolute inset-y-0 w-[3px] rounded-full bg-primary/15" aria-hidden />
                  <span className="mt-2 rounded-full bg-card px-0.5 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-primary/80 [writing-mode:vertical-rl] rotate-180">
                    {s.label}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Columnas por día */}
        <div className="grid flex-1" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(${minCol}px, 1fr))` }}>
          {columns.map((col) => (
            <div key={col.day} role={interactive ? "group" : undefined} aria-label={interactive ? col.label : undefined} className="relative min-w-0">
              <div className={cn("flex flex-col justify-end px-1.5 pb-3", dense ? "h-12" : "h-[68px]")}>
                <div className="flex items-center gap-2">
                  <span className={cn("truncate font-semibold", dense ? "text-xs" : "text-sm", col.isToday ? "text-primary" : "text-foreground")}>
                    {dense ? col.shortLabel : col.label}
                  </span>
                  {col.isToday && !dense && (
                    <span className="rounded-full bg-primary px-2 py-px text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">Hoy</span>
                  )}
                </div>
                {!dense && (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="truncate text-[11px] text-muted-foreground">{col.caption}</span>
                    <span className="h-1 flex-1 overflow-hidden rounded-full bg-muted" aria-hidden>
                      <span className="block h-full rounded-full bg-primary/60 transition-[width] duration-500" style={{ width: `${Math.round(col.load * 100)}%` }} />
                    </span>
                  </div>
                )}
              </div>

              <div
                className={cn("schedule-hour-lines relative border-l border-border/70", col.isToday && "bg-primary/[0.035]")}
                style={{ height, backgroundSize: `100% ${60 * pxPerMinute}px` }}
              >
                {col.blocks.map((block) => {
                  const top = (block.startMin - rangeStart) * pxPerMinute;
                  const h = Math.max(14, (block.endMin - block.startMin) * pxPerMinute);
                  const isSelected = selectedKey === block.key;
                  return (
                    <ScheduleBlock
                      key={block.key}
                      block={block}
                      variant="grid"
                      height={h}
                      selected={isSelected}
                      highlighted={highlightFree && block.kind === "free"}
                      pending={pendingKeys?.has(block.key)}
                      ghost={isSelected && block.kind === "free" ? ghost : null}
                      interactive={interactive}
                      onSelect={onSelectBlock}
                      tabIndex={block.key === activeKey ? 0 : -1}
                      className="absolute"
                      style={{ position: 'absolute', top: top + 1.5, height: h - 3, left: 6, right: 6, width: "auto" }}
                    />
                  );
                })}

                {col.isToday && nowMinute != null && nowMinute >= rangeStart && nowMinute <= rangeEnd && (
                  <div
                    className="pointer-events-none absolute inset-x-0 z-10 flex items-center"
                    style={{ top: (nowMinute - rangeStart) * pxPerMinute }}
                    aria-hidden
                  >
                    <span className="-ml-1 size-2 rounded-full bg-primary ring-2 ring-card" />
                    <span className="h-[1.5px] flex-1 bg-primary" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
