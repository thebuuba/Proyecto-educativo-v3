import { AlertCircleIcon, PlusIcon, Trash2Icon } from "lucide-react";

import { cn } from "../ui/utils";
import { Button } from "@/modules/schedule/polymet/ui/button";
import { Input } from "@/modules/schedule/polymet/ui/input";
import { Label } from "@/modules/schedule/polymet/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/schedule/polymet/ui/dropdown-menu";
import type { ScheduleJourneyKind } from "@/modules/schedule/polymet/lib/schedule-types";
import { createJourney, type DraftIssue, type DraftJourney, type ScheduleDraft } from "@/modules/schedule/polymet/lib/schedule-draft";
import {
  JOURNEY_KINDS,
  JOURNEY_META,
  dayMeta,
  durationMinutes,
  formatDuration,
  formatRange,
  rangesOverlap,
  toMinutes,
} from "@/modules/schedule/polymet/lib/schedule-time";

type BuilderJourneysStepProps = {
  draft: ScheduleDraft;
  issues: DraftIssue[];
  onChange: (updater: (draft: ScheduleDraft) => ScheduleDraft) => void;
};

const STRIP_START = 5 * 60;
const STRIP_END = 23 * 60;
const pct = (m: number) => ((Math.min(Math.max(m, STRIP_START), STRIP_END) - STRIP_START) / (STRIP_END - STRIP_START)) * 100;

/** Franja de 5:00 a 23:00 que muestra las jornadas y sus solapamientos. */
function JourneyStrip({ journeys }: { journeys: DraftJourney[] }) {
  return (
    <div aria-hidden className="rounded-2xl bg-muted/60 p-4">
      <div className="relative h-9 rounded-xl bg-card">
        {[6, 9, 12, 15, 18, 21].map((h) => (
          <span key={h} className="absolute inset-y-0 w-px bg-border" style={{ left: `${pct(h * 60)}%` }} />
        ))}
        {journeys.map((j, i) => {
          const start = toMinutes(j.startTime);
          const end = toMinutes(j.endTime);
          if (end <= start) return null;
          const clash = journeys.some(
            (o, k) => k !== i && o.days.some((d) => j.days.includes(d)) && rangesOverlap(j.startTime, j.endTime, o.startTime, o.endTime),
          );
          const Icon = JOURNEY_META[j.kind].icon;
          return (
            <span
              key={j.key}
              className={cn(
                "absolute inset-y-1 flex items-center gap-1 overflow-hidden rounded-lg px-2 text-[11px] font-medium transition-all duration-300",
                clash ? "bg-destructive/15 text-destructive ring-1 ring-destructive/50" : "bg-primary/15 text-accent-foreground",
              )}
              style={{ left: `${pct(start)}%`, width: `${pct(end) - pct(start)}%` }}
            >
              <Icon className="size-3 shrink-0" />
              <span className="truncate">{j.name}</span>
            </span>
          );
        })}
      </div>
      <div className="relative mt-1.5 h-3">
        {[6, 9, 12, 15, 18, 21].map((h) => (
          <span key={h} className="absolute -translate-x-1/2 text-[10px] tabular-nums text-muted-foreground" style={{ left: `${pct(h * 60)}%` }}>
            {h}:00
          </span>
        ))}
      </div>
    </div>
  );
}

export function BuilderJourneysStep({ draft, issues, onChange }: BuilderJourneysStepProps) {
  const patch = (key: string, changes: Partial<DraftJourney>) =>
    onChange((d) => ({ ...d, journeys: d.journeys.map((j) => (j.key === key ? { ...j, ...changes } : j)) }));

  const remove = (key: string) =>
    onChange((d) => {
      const customBlocks = Object.fromEntries(
        Object.entries(d.customBlocks).map(([day, blocks]) => [day, blocks.filter((b) => b.journeyKey !== key)]),
      );
      return { ...d, journeys: d.journeys.filter((j) => j.key !== key), customBlocks };
    });

  const add = (kind: ScheduleJourneyKind) =>
    onChange((d) => {
      const journey = createJourney(kind, d.days);
      const last = [...d.journeys].sort((a, b) => toMinutes(b.endTime) - toMinutes(a.endTime))[0];
      if (last && kind === "CUSTOM") {
        const start = toMinutes(last.endTime) + 30;
        journey.startTime = `${String(Math.floor(start / 60) % 24).padStart(2, "0")}:${String(start % 60).padStart(2, "0")}`;
        journey.endTime = `${String(Math.min(23, Math.floor(start / 60) + 3)).padStart(2, "0")}:${String(start % 60).padStart(2, "0")}`;
      }
      return { ...d, journeys: [...d.journeys, journey] };
    });

  const sorted = [...draft.journeys].sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-xl font-semibold tracking-tight text-foreground">Tus jornadas</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">Indica cuándo empieza y termina cada jornada y qué días se imparte. Las jornadas no pueden superponerse.</p>
      </div>

      <JourneyStrip journeys={sorted.map((j) => ({ ...j, days: j.days.filter((d) => draft.days.includes(d)) }))} />

      <ul className="flex flex-col gap-3">
        {sorted.map((journey) => {
          const meta = JOURNEY_META[journey.kind];
          const own = issues.filter((i) => i.journeyKey === journey.key && i.step === "journeys");
          const minutes = durationMinutes(journey.startTime, journey.endTime);
          return (
            <li key={journey.key} className={cn("rounded-3xl border bg-card p-4 transition-colors", own.length ? "border-destructive/50" : "border-border")}>
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <meta.icon className="size-[18px]" strokeWidth={1.9} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <Label htmlFor={`jn-${journey.key}`} className="sr-only">
                    Nombre de la jornada
                  </Label>
                  <Input
                    id={`jn-${journey.key}`}
                    value={journey.name}
                    onChange={(e) => patch(journey.key, { name: e.target.value })}
                    maxLength={40}
                    className="h-9 border-transparent bg-transparent px-2 text-[15px] font-semibold shadow-none hover:bg-muted focus-visible:bg-card"
                  />
                  <p className="px-2 text-[11px] text-muted-foreground">
                    {meta.label} · {minutes > 0 ? formatDuration(minutes) : "horario inválido"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-10 shrink-0 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => remove(journey.key)}
                  disabled={draft.journeys.length === 1}
                  aria-label={`Eliminar ${journey.name || "jornada"}`}
                >
                  <Trash2Icon className="size-4" />
                </Button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor={`js-${journey.key}`} className="text-xs text-muted-foreground">
                    Empieza
                  </Label>
                  <Input id={`js-${journey.key}`} type="time" step={300} value={journey.startTime} onChange={(e) => e.target.value && patch(journey.key, { startTime: e.target.value })} className="h-11 rounded-xl tabular-nums" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor={`je-${journey.key}`} className="text-xs text-muted-foreground">
                    Termina
                  </Label>
                  <Input id={`je-${journey.key}`} type="time" step={300} value={journey.endTime} onChange={(e) => e.target.value && patch(journey.key, { endTime: e.target.value })} className="h-11 rounded-xl tabular-nums" />
                </div>
              </div>

              {draft.days.length > 1 && (
                <fieldset className="mt-4">
                  <legend className="mb-2 text-xs text-muted-foreground">Se imparte el</legend>
                  <div className="flex flex-wrap gap-1.5">
                    {draft.days.map((day) => {
                      const active = journey.days.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          aria-pressed={active}
                          onClick={() =>
                            patch(journey.key, {
                              days: active ? journey.days.filter((d) => d !== day) : [...journey.days, day].sort((a, b) => a - b),
                            })
                          }
                          className={cn(
                            "h-9 min-w-[48px] rounded-full px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                          )}
                        >
                          {dayMeta(day).short}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              {own.length > 0 && (
                <ul className="mt-3 flex flex-col gap-1">
                  {own.map((issue) => (
                    <li key={issue.message} className="flex items-start gap-1.5 text-xs text-destructive">
                      <AlertCircleIcon className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                      {issue.message}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-12 rounded-2xl border-dashed bg-transparent text-muted-foreground hover:border-primary hover:bg-accent hover:text-accent-foreground">
            <PlusIcon className="size-4" /> Agregar jornada
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64 rounded-2xl p-1.5">
          {JOURNEY_KINDS.map((kind) => {
            const meta = JOURNEY_META[kind];
            return (
              <DropdownMenuItem key={kind} onSelect={() => add(kind)} className="gap-3 rounded-xl py-2.5">
                <meta.icon className="size-4 text-muted-foreground" />
                <span className="flex-1">{meta.label}</span>
                {kind !== "CUSTOM" && <span className="text-[11px] tabular-nums text-muted-foreground">{formatRange(meta.defaultStart, meta.defaultEnd)}</span>}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
