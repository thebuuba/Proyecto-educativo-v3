import { MinusIcon, PlusIcon, Trash2Icon, WandSparklesIcon } from "lucide-react";

import { cn } from "../ui/utils";
import { Button } from "@/modules/schedule/polymet/ui/button";
import { Input } from "@/modules/schedule/polymet/ui/input";
import { Label } from "@/modules/schedule/polymet/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/modules/schedule/polymet/ui/select";
import {
  draftKey,
  generateJourneyBlocks,
  type BreakType,
  type DraftIssue,
  type DraftJourney,
  type ScheduleDraft,
} from "@/modules/schedule/polymet/lib/schedule-draft";
import { BLOCK_META, BREAK_TYPES, JOURNEY_META, dayMeta, formatClock, fromMinutes, toMinutes } from "@/modules/schedule/polymet/lib/schedule-time";
import { BuilderDayTuner } from "@/modules/schedule/polymet/components/builder-day-tuner";

type BuilderPeriodsStepProps = {
  draft: ScheduleDraft;
  issues: DraftIssue[];
  onChange: (updater: (draft: ScheduleDraft) => ScheduleDraft) => void;
};

const PRESET_MINUTES = [40, 45, 50, 60];

function JourneyPattern({
  journey,
  issues,
  onPatch,
}: {
  journey: DraftJourney;
  issues: DraftIssue[];
  onPatch: (changes: Partial<DraftJourney>) => void;
}) {
  const meta = JOURNEY_META[journey.kind];
  const gen = generateJourneyBlocks(journey, journey.days[0] ?? 1);
  const lastEnd = gen.blocks.length ? gen.blocks[gen.blocks.length - 1].endTime : journey.startTime;
  const periodChoices = Math.max(1, gen.periods);
  const setMinutes = (value: number) => onPatch({ periodMinutes: Math.max(10, Math.min(240, value)) });
  const patchBreak = (key: string, changes: Partial<DraftJourney["breaks"][number]>) =>
    onPatch({ breaks: journey.breaks.map((b) => (b.key === key ? { ...b, ...changes } : b)) });

  return (
    <section className="rounded-3xl border border-border bg-card p-4 sm:p-5" aria-labelledby={`pat-${journey.key}`}>
      <header className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          <meta.icon className="size-[18px]" strokeWidth={1.9} aria-hidden />
        </span>
        <div className="min-w-0">
          <h4 id={`pat-${journey.key}`} className="truncate text-[15px] font-semibold text-foreground">
            {journey.name || meta.label}
          </h4>
          <p className="text-xs tabular-nums text-muted-foreground">
            {formatClock(journey.startTime)}–{formatClock(journey.endTime)} · {journey.days.map((d) => dayMeta(d).short).join(", ") || "sin días"}
          </p>
        </div>
      </header>

      <div className="mt-5 grid gap-2">
        <span className="text-xs font-medium text-muted-foreground" id={`dur-${journey.key}`}>
          Duración de cada período
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-full bg-muted p-1" role="group" aria-labelledby={`dur-${journey.key}`}>
            <Button variant="ghost" size="icon" className="size-9 rounded-full hover:bg-card" onClick={() => setMinutes(journey.periodMinutes - 5)} aria-label="Reducir 5 minutos">
              <MinusIcon className="size-4" />
            </Button>
            <span className="w-20 text-center text-sm font-semibold tabular-nums text-foreground" aria-live="polite">
              {journey.periodMinutes} min
            </span>
            <Button variant="ghost" size="icon" className="size-9 rounded-full hover:bg-card" onClick={() => setMinutes(journey.periodMinutes + 5)} aria-label="Aumentar 5 minutos">
              <PlusIcon className="size-4" />
            </Button>
          </div>
          {PRESET_MINUTES.map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={journey.periodMinutes === m}
              onClick={() => setMinutes(m)}
              className={cn(
                "h-9 rounded-full px-3 text-xs font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                journey.periodMinutes === m ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl bg-muted/60 px-4 py-3 text-xs">
        <span className="font-semibold text-foreground">
          {gen.periods} {gen.periods === 1 ? "período" : "períodos"}
        </span>
        <span className="text-muted-foreground">termina a las {formatClock(lastEnd)}</span>
        {gen.leftover > 0 && gen.periods > 0 && (
          <>
            <span className="text-amber-700 dark:text-warning">sobran {gen.leftover} min</span>
            <button
              type="button"
              onClick={() => onPatch({ endTime: fromMinutes(toMinutes(journey.endTime) - gen.leftover) })}
              className="ml-auto inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 font-medium text-primary shadow-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <WandSparklesIcon className="size-3.5" aria-hidden /> Terminar a las {formatClock(lastEnd)}
            </button>
          </>
        )}
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Descansos</p>
        {journey.breaks.length === 0 && <p className="mb-2 text-xs text-muted-foreground">Sin descansos: los períodos serán consecutivos.</p>}
        <ul className="flex flex-col gap-2">
          {journey.breaks.map((b) => (
            <li key={b.key} className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-2xl bg-muted/50 p-2 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_88px_auto]">
              <Select value={b.blockType} onValueChange={(v) => patchBreak(b.key, { blockType: v as BreakType })}>
                <SelectTrigger className="h-10 rounded-xl bg-card" aria-label="Tipo de descanso">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {BREAK_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {BLOCK_META[t].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                className="size-10 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive sm:order-last"
                onClick={() => onPatch({ breaks: journey.breaks.filter((x) => x.key !== b.key) })}
                aria-label="Eliminar descanso"
              >
                <Trash2Icon className="size-4" />
              </Button>
              <Select value={String(b.afterPeriod)} onValueChange={(v) => patchBreak(b.key, { afterPeriod: Number(v) })}>
                <SelectTrigger className="h-10 rounded-xl bg-card" aria-label="Ubicación del descanso">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {Array.from({ length: Math.max(periodChoices, b.afterPeriod) }, (_, i) => i + 1).map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      Tras el período {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative">
                <Label htmlFor={`bm-${b.key}`} className="sr-only">
                  Minutos
                </Label>
                <Input
                  id={`bm-${b.key}`}
                  type="number"
                  min={5}
                  max={180}
                  step={5}
                  value={b.minutes}
                  onChange={(e) => patchBreak(b.key, { minutes: Math.max(0, Math.min(180, Number(e.target.value) || 0)) })}
                  className="h-10 rounded-xl bg-card pr-10 tabular-nums"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">min</span>
              </div>
            </li>
          ))}
        </ul>
        <Button
          variant="ghost"
          className="mt-2 h-10 rounded-full px-3 text-primary hover:bg-accent hover:text-accent-foreground"
          onClick={() =>
            onPatch({
              breaks: [...journey.breaks, { key: draftKey("break"), afterPeriod: Math.min(periodChoices, Math.ceil(periodChoices / 2)), blockType: "BREAK", minutes: 15 }],
            })
          }
        >
          <PlusIcon className="size-4" /> Añadir descanso
        </Button>
      </div>

      {issues.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1">
          {issues.map((issue) => (
            <li key={issue.message} className={cn("text-xs", issue.level === "error" ? "text-destructive" : "text-amber-700 dark:text-warning")}>
              {issue.message}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function BuilderPeriodsStep({ draft, issues, onChange }: BuilderPeriodsStepProps) {
  const patchJourney = (key: string, changes: Partial<DraftJourney>) =>
    onChange((d) => ({ ...d, journeys: d.journeys.map((j) => (j.key === key ? { ...j, ...changes } : j)) }));

  const journeys = [...draft.journeys]
    .filter((j) => j.days.some((d) => draft.days.includes(d)))
    .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-xl font-semibold tracking-tight text-foreground">Períodos y descansos</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">Define un patrón por jornada: generaremos los períodos automáticamente. Luego puedes ajustar cualquier día por separado.</p>
      </div>

      {journeys.map((journey) => (
        <JourneyPattern
          key={journey.key}
          journey={{ ...journey, days: journey.days.filter((d) => draft.days.includes(d)) }}
          issues={issues.filter((i) => i.journeyKey === journey.key && i.step === "periods")}
          onPatch={(changes) => patchJourney(journey.key, changes)}
        />
      ))}

      <BuilderDayTuner draft={draft} issues={issues} onChange={onChange} />
    </div>
  );
}
