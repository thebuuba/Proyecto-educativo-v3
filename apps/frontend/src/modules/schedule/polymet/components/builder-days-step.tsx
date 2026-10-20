import { CheckIcon } from "lucide-react";

import { cn } from "../ui/utils";
import type { ScheduleDraft } from "@/modules/schedule/polymet/lib/schedule-draft";
import { WEEK_DAYS } from "@/modules/schedule/polymet/lib/schedule-time";

type BuilderDaysStepProps = {
  draft: ScheduleDraft;
  onChange: (updater: (draft: ScheduleDraft) => ScheduleDraft) => void;
};

function setDraftDays(draft: ScheduleDraft, days: number[]): ScheduleDraft {
  const sorted = [...new Set(days)].sort((a, b) => a - b);
  const added = sorted.filter((d) => !draft.days.includes(d));
  const removed = draft.days.filter((d) => !sorted.includes(d));
  const journeys = draft.journeys.map((j, index) => {
    const global = draft.days.length > 0 && draft.days.every((d) => j.days.includes(d));
    const shouldGain = global || (index === 0 && draft.journeys.every((o) => !o.days.length));
    return {
      ...j,
      days: [...j.days.filter((d) => !removed.includes(d)), ...(shouldGain ? added : [])].sort((a, b) => a - b),
    };
  });
  if (journeys.length && added.length && journeys.every((j) => !added.some((d) => j.days.includes(d)))) {
    journeys[0] = { ...journeys[0], days: [...journeys[0].days, ...added].sort((a, b) => a - b) };
  }
  const customBlocks = { ...draft.customBlocks };
  removed.forEach((d) => delete customBlocks[d]);
  return { ...draft, days: sorted, journeys, customBlocks };
}

const PRESETS = [
  { label: "Lunes a viernes", days: [1, 2, 3, 4, 5] },
  { label: "Lunes a sábado", days: [1, 2, 3, 4, 5, 6] },
];

export function BuilderDaysStep({ draft, onChange }: BuilderDaysStepProps) {
  const toggle = (day: number) =>
    onChange((d) => setDraftDays(d, d.days.includes(day) ? d.days.filter((x) => x !== day) : [...d.days, day]));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-xl font-semibold tracking-tight text-foreground">¿Qué días impartes clases?</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">Cada día podrá tener sus propias jornadas y períodos; lo ajustarás en los siguientes pasos.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => {
          const active = preset.days.length === draft.days.length && preset.days.every((d) => draft.days.includes(d));
          return (
            <button
              key={preset.label}
              type="button"
              aria-pressed={active}
              onClick={() => onChange((d) => setDraftDays(d, preset.days))}
              className={cn(
                "h-9 rounded-full border px-4 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active ? "border-primary bg-accent text-accent-foreground" : "border-border bg-card text-foreground hover:bg-muted",
              )}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      <fieldset>
        <legend className="sr-only">Días de clase</legend>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
          {WEEK_DAYS.map((day) => {
            const selected = draft.days.includes(day.value);
            return (
              <button
                key={day.value}
                type="button"
                role="checkbox"
                aria-checked={selected}
                aria-label={day.long}
                onClick={() => toggle(day.value)}
                className={cn(
                  "group relative flex aspect-[4/5] flex-col items-center justify-center gap-1 rounded-2xl transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                  selected
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "bg-muted/70 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <span className={cn("text-2xl font-semibold leading-none", !selected && "text-foreground/70")}>{day.short.slice(0, 2)}</span>
                <span className={cn("text-[11px] font-medium", selected ? "text-primary-foreground/85" : "")}>{day.long}</span>
                <span
                  className={cn(
                    "absolute right-2 top-2 flex size-5 items-center justify-center rounded-full transition-all duration-200",
                    selected ? "scale-100 bg-primary-foreground text-primary opacity-100" : "scale-75 border border-border opacity-60",
                  )}
                  aria-hidden
                >
                  {selected && <CheckIcon className="size-3" strokeWidth={3} />}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <p className="text-xs text-muted-foreground" aria-live="polite">
        {draft.days.length === 0
          ? "Selecciona al menos un día para continuar."
          : `${draft.days.length} ${draft.days.length === 1 ? "día seleccionado" : "días seleccionados"}.`}
      </p>
    </div>
  );
}
