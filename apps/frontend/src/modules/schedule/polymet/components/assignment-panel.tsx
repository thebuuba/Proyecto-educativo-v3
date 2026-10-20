import { useMemo, useState } from "react";
import { AlertCircleIcon, CheckIcon, Clock3Icon, Loader2Icon, MapPinIcon, RefreshCwIcon, SearchIcon, SunriseIcon } from "lucide-react";

import { cn } from "../ui/utils";
import { Button } from "@/modules/schedule/polymet/ui/button";
import { Input } from "@/modules/schedule/polymet/ui/input";
import { Label } from "@/modules/schedule/polymet/ui/label";
import type { AssignableClassOption, ScheduleEntry } from "@/modules/schedule/polymet/lib/schedule-types";
import type { WeekCell } from "@/modules/schedule/polymet/lib/schedule-week-model";
import { dayMeta, formatDuration, formatRange, rangesOverlap, subjectAccent } from "@/modules/schedule/polymet/lib/schedule-time";

export type AssignmentSubmit = {
  option: AssignableClassOption;
  room: string | null;
  extraCells: WeekCell[];
};

type AssignmentPanelProps = {
  cell: WeekCell;
  mode: "assign" | "replace";
  initialEntry?: ScheduleEntry | null;
  options: AssignableClassOption[];
  optionsError: string | null;
  entries: ScheduleEntry[];
  siblings: WeekCell[];
  pending: boolean;
  onRetryOptions: () => void;
  onPreview: (option: AssignableClassOption | null) => void;
  onSubmit: (payload: AssignmentSubmit) => Promise<{ ok: boolean; message?: string }>;
  onCancel: () => void;
};

const optionKey = (o: AssignableClassOption) => `${o.sectionSubjectId}:${o.sectionId}`;

/** Selección de asignatura para un período: búsqueda, conflictos visibles y vista previa en el mapa. */
export function AssignmentPanel({
  cell,
  mode,
  initialEntry,
  options,
  optionsError,
  entries,
  siblings,
  pending,
  onRetryOptions,
  onPreview,
  onSubmit,
  onCancel,
}: AssignmentPanelProps) {
  const currentEntry = mode === "replace" ? cell.entry : initialEntry ?? null;
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(currentEntry ? `${currentEntry.sectionSubjectId}:${currentEntry.sectionId}` : null);
  const [room, setRoom] = useState(currentEntry?.room ?? "");
  const [extraDays, setExtraDays] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const conflictFor = (option: AssignableClassOption, target: WeekCell) =>
    entries.find(
      (e) =>
        e.id !== currentEntry?.id &&
        e.sectionId === option.sectionId &&
        e.dayOfWeek === target.day &&
        rangesOverlap(e.startTime, e.endTime, target.slot.startTime, target.slot.endTime),
    ) ?? null;

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = options.filter((o) =>
      !q ? true : `${o.subjectName} ${o.subjectCode ?? ""} ${o.gradeName} ${o.sectionName} ${o.academicLevelName}`.toLowerCase().includes(q),
    );
    const map = new Map<string, AssignableClassOption[]>();
    filtered.forEach((o) => map.set(o.subjectName, [...(map.get(o.subjectName) ?? []), o]));
    return Array.from(map.entries());
  }, [options, query]);

  const selectedOption = options.find((o) => optionKey(o) === selected) ?? null;
  const unchanged =
    mode === "replace" && selectedOption && currentEntry && optionKey(selectedOption) === `${currentEntry.sectionSubjectId}:${currentEntry.sectionId}` && (room.trim() || null) === (currentEntry.room ?? null);

  const choose = (option: AssignableClassOption) => {
    setSelected(optionKey(option));
    setError(null);
    onPreview(option);
    setExtraDays((days) => days.filter((d) => {
      const target = siblings.find((s) => s.day === d);
      return target ? !conflictFor(option, target) : false;
    }));
  };

  const submit = async () => {
    if (!selectedOption) return;
    setError(null);
    const result = await onSubmit({
      option: selectedOption,
      room: room.trim() || null,
      extraCells: siblings.filter((s) => extraDays.includes(s.day)),
    });
    if (!result.ok) setError(result.message ?? "No pudimos completar la operación.");
  };

  const day = dayMeta(cell.day);
  const totalTargets = 1 + extraDays.length;

  return (
    <div className="flex h-full flex-col">
      <div className="pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">{mode === "assign" ? "Asignar período" : "Cambiar clase"}</p>
        <h2 className="mt-1 text-lg font-semibold text-foreground">
          {day.long}, {cell.slot.name.toLowerCase().startsWith("período") ? cell.slot.name.toLowerCase() : cell.slot.name}
        </h2>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-foreground">
            <Clock3Icon className="size-3.5 text-muted-foreground" aria-hidden />
            <span className="tabular-nums">{formatRange(cell.slot.startTime, cell.slot.endTime)}</span>
            <span className="text-muted-foreground">· {formatDuration(cell.endMin - cell.startMin)}</span>
          </span>
          {cell.journey && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-foreground">
              <SunriseIcon className="size-3.5 text-muted-foreground" aria-hidden />
              {cell.journey.name}
            </span>
          )}
        </div>
      </div>

      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar asignatura, grado o sección"
          aria-label="Buscar asignatura"
          className="h-11 rounded-xl border-transparent bg-muted pl-10 focus-visible:bg-card"
        />
      </div>

      <div className="-mx-1 mt-3 min-h-0 flex-1 overflow-y-auto px-1 pb-2">
        {optionsError ? (
          <div className="flex flex-col items-start gap-3 rounded-2xl bg-destructive/10 p-4">
            <p className="text-xs text-foreground">{optionsError}</p>
            <Button size="sm" variant="outline" className="h-9 rounded-full bg-card" onClick={onRetryOptions}>
              <RefreshCwIcon className="size-3.5" /> Reintentar
            </Button>
          </div>
        ) : options.length === 0 ? (
          <p className="rounded-2xl bg-muted/70 p-4 text-xs leading-relaxed text-muted-foreground">
            No tienes asignaturas activas en ningún curso. Cuando coordinación te asigne cursos en el módulo <strong className="font-medium text-foreground">Cursos</strong>, aparecerán aquí.
          </p>
        ) : groups.length === 0 ? (
          <p className="px-1 py-6 text-center text-xs text-muted-foreground">No hay coincidencias para «{query}».</p>
        ) : (
          <div role="radiogroup" aria-label="Clases disponibles" className="flex flex-col gap-4">
            {groups.map(([subject, list]) => {
              const accent = subjectAccent(subject, list[0].appearanceColor);
              return (
                <div key={subject}>
                  <p className="mb-1.5 flex items-center gap-2 px-1 text-xs font-semibold text-foreground">
                    <span className="size-2 rounded-full" style={{ backgroundColor: accent }} aria-hidden />
                    {subject}
                  </p>
                  <div className="flex flex-col gap-1">
                    {list.map((option) => {
                      const key = optionKey(option);
                      const isSelected = key === selected;
                      const conflict = conflictFor(option, cell);
                      return (
                        <button
                          key={key}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          disabled={Boolean(conflict)}
                          onClick={() => choose(option)}
                          className={cn(
                            "flex min-h-[48px] w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-all duration-150",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            isSelected ? "border-primary bg-accent" : "border-transparent hover:bg-muted/80",
                            conflict && "cursor-not-allowed opacity-60 hover:bg-transparent",
                          )}
                        >
                          <span
                            className={cn(
                              "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                              isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border",
                            )}
                            aria-hidden
                          >
                            {isSelected && <CheckIcon className="size-3" strokeWidth={3} />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium text-foreground">
                              {option.gradeName} {option.sectionName}
                            </span>
                            <span className="block truncate text-[11.5px] text-muted-foreground">
                              {conflict ? `Ya tiene ${conflict.subjectName} contigo a esta hora` : option.academicLevelName}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedOption && (
        <div className="mt-2 flex flex-col gap-4 border-t border-border pt-4">
          <div className="grid gap-1.5">
            <Label htmlFor="assignment-room" className="text-xs font-medium text-muted-foreground">
              Aula o espacio <span className="font-normal">(opcional)</span>
            </Label>
            <div className="relative">
              <MapPinIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input id="assignment-room" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Ej. Aula 12, Laboratorio" maxLength={60} className="h-10 rounded-xl pl-10" />
            </div>
          </div>

          {mode === "assign" && siblings.length > 0 && (
            <fieldset className="grid gap-2">
              <legend className="mb-1.5 text-xs font-medium text-muted-foreground">También a la misma hora el…</legend>
              <div className="flex flex-wrap gap-1.5">
                {siblings.map((s) => {
                  const active = extraDays.includes(s.day);
                  const blocked = Boolean(conflictFor(selectedOption, s));
                  return (
                    <button
                      key={s.key}
                      type="button"
                      aria-pressed={active}
                      disabled={blocked}
                      title={blocked ? "La sección ya tiene clase a esa hora" : undefined}
                      onClick={() => setExtraDays((prev) => (active ? prev.filter((d) => d !== s.day) : [...prev, s.day]))}
                      className={cn(
                        "flex h-9 min-w-[52px] items-center justify-center gap-1 rounded-full border px-3 text-xs font-medium transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-muted",
                        blocked && "cursor-not-allowed line-through opacity-50",
                      )}
                    >
                      {active && <CheckIcon className="size-3" strokeWidth={3} aria-hidden />}
                      {dayMeta(s.day).short}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}
        </div>
      )}

      {error && (
        <div role="alert" className="mt-4 flex gap-2.5 rounded-2xl bg-destructive/10 p-3">
          <AlertCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
          <p className="text-xs leading-relaxed text-foreground">{error}</p>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
        <Button variant="ghost" className="h-11 rounded-full px-4" onClick={onCancel} disabled={pending}>
          Cancelar
        </Button>
        <Button className="h-11 flex-1 rounded-full font-semibold" disabled={!selectedOption || pending || Boolean(unchanged)} onClick={submit}>
          {pending ? (
            <>
              <Loader2Icon className="size-4 animate-spin" /> {mode === "assign" ? "Asignando…" : "Guardando…"}
            </>
          ) : mode === "assign" ? (
            totalTargets > 1 ? `Asignar en ${totalTargets} días` : `Asignar el ${day.long.toLowerCase()}`
          ) : (
            "Guardar cambio"
          )}
        </Button>
      </div>
    </div>
  );
}
