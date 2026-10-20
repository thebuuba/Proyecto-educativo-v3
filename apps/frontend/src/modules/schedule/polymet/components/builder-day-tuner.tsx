import { useState } from "react";
import { CopyIcon, PlusIcon, RotateCcwIcon, Trash2Icon } from "lucide-react";

import { cn } from "../ui/utils";
import { Button } from "@/modules/schedule/polymet/ui/button";
import { Input } from "@/modules/schedule/polymet/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/modules/schedule/polymet/ui/select";
import type { ScheduleBlockType } from "@/modules/schedule/polymet/lib/schedule-types";
import {
  draftKey,
  journeysForDay,
  resolveDayBlocks,
  type DraftBlock,
  type DraftIssue,
  type ScheduleDraft,
} from "@/modules/schedule/polymet/lib/schedule-draft";
import { BLOCK_META, dayMeta, fromMinutes, toMinutes } from "@/modules/schedule/polymet/lib/schedule-time";

type BuilderDayTunerProps = {
  draft: ScheduleDraft;
  issues: DraftIssue[];
  onChange: (updater: (draft: ScheduleDraft) => ScheduleDraft) => void;
};

const EDITABLE_TYPES: ScheduleBlockType[] = ["CLASS", "BREAK", "BREAKFAST", "LUNCH", "PAUSE", "FREE"];

/** Ajustes finos por día: convierte el día en personalizado al editar cualquier bloque. */
export function BuilderDayTuner({ draft, issues, onChange }: BuilderDayTunerProps) {
  const [picked, setPicked] = useState<number | null>(null);
  const activeDay = picked && draft.days.includes(picked) ? picked : draft.days[0];
  if (!activeDay) return null;

  const blocks = resolveDayBlocks(draft, activeDay);
  const isCustom = Boolean(draft.customBlocks[activeDay]);
  const dayIssues = issues.filter((i) => i.day === activeDay);

  const editDay = (fn: (blocks: DraftBlock[]) => DraftBlock[]) =>
    onChange((d) => ({ ...d, customBlocks: { ...d.customBlocks, [activeDay]: fn(resolveDayBlocks(d, activeDay)) } }));

  const patchBlock = (key: string, changes: Partial<DraftBlock>) =>
    editDay((list) =>
      list.map((b) => {
        if (b.key !== key) return b;
        const next = { ...b, ...changes };
        if (changes.blockType && changes.blockType !== b.blockType && b.name === BLOCK_META[b.blockType].label) {
          next.name = changes.blockType === "CLASS" ? "Período" : BLOCK_META[changes.blockType].label;
        }
        return next;
      }),
    );

  const addBlock = () =>
    editDay((list) => {
      const last = list[list.length - 1];
      const journey = journeysForDay(draft, activeDay)[0] ?? draft.journeys[0];
      const start = last ? toMinutes(last.endTime) : toMinutes(journey?.startTime ?? "08:00");
      const minutes = journey?.periodMinutes ?? 45;
      const classCount = list.filter((b) => b.blockType === "CLASS").length;
      return [
        ...list,
        {
          key: draftKey("block"),
          name: `Período ${classCount + 1}`,
          startTime: fromMinutes(start),
          endTime: fromMinutes(start + minutes),
          blockType: "CLASS",
          journeyKey: last?.journeyKey ?? journey?.key ?? "",
          blockSource: "MANUAL",
        },
      ];
    });

  const copyToAll = () =>
    onChange((d) => {
      const source = resolveDayBlocks(d, activeDay);
      const customBlocks = { ...d.customBlocks };
      d.days.forEach((day) => {
        customBlocks[day] = source.map((b) => ({ ...b, id: day === activeDay ? b.id : undefined, key: day === activeDay ? b.key : draftKey("block") }));
      });
      return { ...d, customBlocks };
    });

  const resetDay = () =>
    onChange((d) => {
      const customBlocks = { ...d.customBlocks };
      delete customBlocks[activeDay];
      return { ...d, customBlocks };
    });

  return (
    <section aria-labelledby="day-tuner" className="rounded-3xl bg-muted/50 p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4 id="day-tuner" className="text-[15px] font-semibold text-foreground">
          Ajustar un día
        </h4>
        <span className="text-xs text-muted-foreground">Ideal para días con salida temprana o actividades especiales</span>
      </div>

      <div role="tablist" aria-label="Día a ajustar" className="scrollbar-none mt-3 flex gap-1.5 overflow-x-auto pb-1">
        {draft.days.map((day) => (
          <button
            key={day}
            type="button"
            role="tab"
            aria-selected={day === activeDay}
            onClick={() => setPicked(day)}
            className={cn(
              "relative h-9 shrink-0 rounded-full px-3.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              day === activeDay ? "bg-foreground text-background" : "bg-card text-foreground hover:bg-accent",
            )}
          >
            {dayMeta(day).short}
            {draft.customBlocks[day] && <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-primary ring-2 ring-muted" aria-label="personalizado" />}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-medium", isCustom ? "bg-primary/15 text-accent-foreground" : "bg-card text-muted-foreground")}>
          {isCustom ? `${dayMeta(activeDay).long} personalizado` : `${dayMeta(activeDay).long} sigue el patrón`}
        </span>
        <div className="ml-auto flex gap-1">
          {isCustom && (
            <Button variant="ghost" size="sm" className="h-9 rounded-full text-xs" onClick={resetDay}>
              <RotateCcwIcon className="size-3.5" /> Volver al patrón
            </Button>
          )}
          {draft.days.length > 1 && (
            <Button variant="ghost" size="sm" className="h-9 rounded-full text-xs" onClick={copyToAll}>
              <CopyIcon className="size-3.5" /> Usar en todos los días
            </Button>
          )}
        </div>
      </div>

      <ul className="mt-3 flex flex-col gap-1.5">
        {blocks.map((block) => {
          const Icon = BLOCK_META[block.blockType].icon;
          if (block.blockType === "GAP") {
            return (
              <li key={block.key} className="schedule-break-pattern flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] text-muted-foreground">
                <Icon className="size-3.5" aria-hidden /> {block.name} · {block.startTime}–{block.endTime}
              </li>
            );
          }
          return (
            <li key={block.key} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-1.5 rounded-2xl bg-card p-1.5 sm:grid-cols-[150px_minmax(0,1fr)_84px_84px_auto]">
              <Select value={block.blockType} onValueChange={(v) => patchBlock(block.key, { blockType: v as ScheduleBlockType })}>
                <SelectTrigger className="h-9 rounded-xl border-transparent bg-muted/60 text-xs" aria-label="Tipo de bloque">
                  <span className="flex items-center gap-1.5 truncate">
                    <Icon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                    <SelectValue />
                  </span>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {EDITABLE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {BLOCK_META[t].short}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input value={block.name} onChange={(e) => patchBlock(block.key, { name: e.target.value })} aria-label="Nombre del bloque" maxLength={40} className="h-9 rounded-xl border-transparent bg-muted/60 text-xs" />
              <Button
                variant="ghost"
                size="icon"
                className="size-9 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive sm:order-last"
                onClick={() => editDay((list) => list.filter((b) => b.key !== block.key))}
                aria-label={`Eliminar ${block.name}`}
              >
                <Trash2Icon className="size-3.5" />
              </Button>
              <Input type="time" step={300} value={block.startTime} onChange={(e) => e.target.value && patchBlock(block.key, { startTime: e.target.value })} aria-label={`Inicio de ${block.name}`} className="h-9 rounded-xl border-transparent bg-muted/60 text-xs tabular-nums" />
              <Input type="time" step={300} value={block.endTime} onChange={(e) => e.target.value && patchBlock(block.key, { endTime: e.target.value })} aria-label={`Fin de ${block.name}`} className="h-9 rounded-xl border-transparent bg-muted/60 text-xs tabular-nums" />
            </li>
          );
        })}
      </ul>

      {dayIssues.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1" role="alert">
          {dayIssues.map((issue) => (
            <li key={issue.message} className="text-xs text-destructive">
              {issue.message}
            </li>
          ))}
        </ul>
      )}

      <Button variant="ghost" className="mt-2 h-10 rounded-full px-3 text-primary hover:bg-card hover:text-accent-foreground" onClick={addBlock}>
        <PlusIcon className="size-4" /> Añadir bloque al final
      </Button>
    </section>
  );
}
