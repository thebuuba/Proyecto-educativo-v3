import { useMemo } from "react";
import { EyeIcon } from "lucide-react";

import { resolveDayBlocks, draftSummary, type ScheduleDraft } from "@/modules/schedule/polymet/lib/schedule-draft";
import { blockFromDraft, type TimeMapColumn } from "@/modules/schedule/polymet/lib/schedule-view";
import { dayMeta, formatHours, toMinutes } from "@/modules/schedule/polymet/lib/schedule-time";
import { WeekTimeMap } from "@/modules/schedule/polymet/components/week-time-map";

type BuilderPreviewProps = {
  draft: ScheduleDraft;
  dense?: boolean;
};

/** Vista previa en vivo: la misma gramática visual del horario real, sin interacción. */
export function BuilderPreview({ draft, dense = false }: BuilderPreviewProps) {
  const { columns, rangeStart, rangeEnd } = useMemo(() => {
    const journeyName = new Map(draft.journeys.map((j) => [j.key, j.name]));
    const cols: TimeMapColumn[] = draft.days.map((day) => {
      const blocks = resolveDayBlocks(draft, day).filter((b) => toMinutes(b.endTime) > toMinutes(b.startTime));
      const periods = blocks.filter((b) => b.blockType === "CLASS").length;
      const spans = new Map<string, { startMin: number; endMin: number }>();
      blocks.forEach((b) => {
        if (b.blockType === "GAP") return;
        const s = spans.get(b.journeyKey);
        const start = toMinutes(b.startTime);
        const end = toMinutes(b.endTime);
        spans.set(b.journeyKey, s ? { startMin: Math.min(s.startMin, start), endMin: Math.max(s.endMin, end) } : { startMin: start, endMin: end });
      });
      return {
        day,
        label: dayMeta(day).long,
        shortLabel: dayMeta(day).short,
        caption: `${periods} ${periods === 1 ? "período" : "períodos"}${draft.customBlocks[day] ? " · ajustado" : ""}`,
        isToday: false,
        load: 0,
        blocks: blocks.map((b) => blockFromDraft(b, journeyName.get(b.journeyKey) ?? null)),
        journeys: Array.from(spans.entries()).map(([key, span]) => ({
          journey: { id: key, name: journeyName.get(key) ?? "Jornada", kind: "CUSTOM" as const, startTime: "", endTime: "", sequence: 0, status: "ACTIVE" },
          label: journeyName.get(key) ?? "Jornada",
          ...span,
        })),
      };
    });
    const maxPeriods = Math.max(1, ...cols.map((c) => c.blocks.filter((b) => b.kind === "free").length));
    cols.forEach((c) => (c.load = c.blocks.filter((b) => b.kind === "free").length / maxPeriods));
    const all = cols.flatMap((c) => c.blocks);
    return {
      columns: cols,
      rangeStart: all.length ? Math.floor(Math.min(...all.map((b) => b.startMin)) / 60) * 60 : 7 * 60,
      rangeEnd: all.length ? Math.ceil(Math.max(...all.map((b) => b.endMin)) / 60) * 60 : 13 * 60,
    };
  }, [draft]);

  const summary = draftSummary(draft);
  const span = rangeEnd - rangeStart;
  const ppm = dense ? Math.min(1.1, 620 / Math.max(span, 60)) : Math.min(1.3, 680 / Math.max(span, 60));

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 px-1 pb-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <EyeIcon className="size-4 text-primary" aria-hidden /> Vista previa en vivo
        </p>
        <p className="text-xs tabular-nums text-muted-foreground" aria-live="polite">
          {summary.periods} períodos · {formatHours(summary.teachingMinutes)} lectivas
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-auto rounded-3xl bg-card p-3 shadow-sm sm:p-4">
        {columns.length === 0 ? (
          <div className="flex h-full min-h-[240px] items-center justify-center text-sm text-muted-foreground">Selecciona días para ver tu semana.</div>
        ) : (
          <WeekTimeMap columns={columns} rangeStart={rangeStart} rangeEnd={rangeEnd} pxPerMinute={ppm} interactive={false} dense={dense} />
        )}
      </div>
    </div>
  );
}
