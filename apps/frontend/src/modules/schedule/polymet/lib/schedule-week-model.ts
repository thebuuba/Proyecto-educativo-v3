import type {
  ScheduleEntry,
  ScheduleIntegrityIssue,
  ScheduleJourney,
  ScheduleWorkspace,
  TimeSlot,
} from "@/modules/schedule/polymet/lib/schedule-types";
import {
  dayMeta,
  durationMinutes,
  isLective,
  minutesFromDate,
  normalizeTime,
  rangesOverlap,
  scheduleDayFromDate,
  toMinutes,
  type DayMeta,
} from "@/modules/schedule/polymet/lib/schedule-time";

export type WeekCellKind = "class" | "free" | "rest" | "gap";

export type WeekCell = {
  key: string;
  day: number;
  slot: TimeSlot;
  kind: WeekCellKind;
  entry: ScheduleEntry | null;
  journey: ScheduleJourney | null;
  issue: ScheduleIntegrityIssue | null;
  doubleBooked: boolean;
  startMin: number;
  endMin: number;
};

export type JourneySpan = {
  journey: ScheduleJourney | null;
  label: string;
  startMin: number;
  endMin: number;
};

export type WeekDay = {
  day: number;
  meta: DayMeta;
  cells: WeekCell[];
  journeys: JourneySpan[];
  teachingMinutes: number;
  classCount: number;
  freeCount: number;
};

export type ReviewItem = {
  id: string;
  kind: "integrity" | "orphan" | "non-lective" | "double-booked";
  title: string;
  message: string;
  entryIds: string[];
  entries: ScheduleEntry[];
  cellKey: string | null;
};

export type WeekModel = {
  days: WeekDay[];
  rangeStart: number;
  rangeEnd: number;
  hasStructure: boolean;
  totals: {
    classes: number;
    teachingMinutes: number;
    sections: number;
    freePeriods: number;
    review: number;
  };
  review: ReviewItem[];
  cells: Map<string, WeekCell>;
};

export function cellKey(day: number, slotId: string) {
  return `${day}:${slotId}`;
}

function cellKindFor(slot: TimeSlot, entry: ScheduleEntry | null): WeekCellKind {
  if (slot.blockType === "GAP") return "gap";
  if (!isLective(slot.blockType)) return "rest";
  return entry ? "class" : "free";
}

function isActive(value: { status: string }) {
  return !["ARCHIVED", "INACTIVE"].includes(value.status.toUpperCase());
}

export function buildWeekModel(workspace: ScheduleWorkspace | null): WeekModel {
  const empty: WeekModel = {
    days: [],
    rangeStart: 7 * 60,
    rangeEnd: 13 * 60,
    hasStructure: false,
    totals: { classes: 0, teachingMinutes: 0, sections: 0, freePeriods: 0, review: 0 },
    review: [],
    cells: new Map(),
  };
  if (!workspace) return empty;

  const slots = workspace.timeSlots.filter(isActive);
  if (slots.length === 0 && workspace.entries.length === 0) return empty;

  const entries = workspace.entries.filter(isActive);
  const entryById = new Map(entries.map(entry => [entry.id, entry]));
  const journeys = new Map((workspace.journeys ?? []).filter(isActive).map((j) => [j.id, j]));
  const issues = (workspace.integrityIssues ?? []).filter(issue => issue.entryIds.some(id => entryById.has(id)));
  const placementIssueIds = new Set(issues.filter(issue => issue.code === "NEEDS_PLACEMENT").flatMap(issue => issue.entryIds));
  const issueByEntry = new Map<string, ScheduleIntegrityIssue>();
  issues.forEach((issue) => issue.entryIds.forEach((id) => issueByEntry.set(id, issue)));

  // Días configurados: los bloques con día explícito; los bloques sin día (legado) aplican de lunes a viernes.
  const explicitDays = new Set<number>();
  slots.forEach((s) => s.dayOfWeek && explicitDays.add(s.dayOfWeek));
  const hasGlobalSlots = slots.some((s) => s.dayOfWeek === null);
  const daySet = new Set<number>(explicitDays);
  if (hasGlobalSlots && daySet.size === 0) [1, 2, 3, 4, 5].forEach((d) => daySet.add(d));
  const dayList = Array.from(daySet).sort((a, b) => a - b);

  const entriesByCell = new Map<string, ScheduleEntry[]>();
  entries.filter(entry => !entry.needsPlacement && !placementIssueIds.has(entry.id)).forEach((entry) => {
    const key = cellKey(entry.dayOfWeek, entry.timeSlotId);
    entriesByCell.set(key, [...(entriesByCell.get(key) ?? []), entry]);
  });

  const cells = new Map<string, WeekCell>();
  const placedEntryIds = new Set<string>();
  const review: ReviewItem[] = [];

  const days: WeekDay[] = dayList.map((day) => {
    const daySlots = slots
      .filter((s) => s.dayOfWeek === day || (s.dayOfWeek === null && !explicitDays.has(day)))
      .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime) || a.sequence - b.sequence);

    const dayCells: WeekCell[] = daySlots.map((slot) => {
      const key = cellKey(day, slot.id);
      const found = entriesByCell.get(key) ?? [];
      const entry = found[0] ?? null;
      found.forEach((e) => placedEntryIds.add(e.id));
      const cell: WeekCell = {
        key,
        day,
        slot: { ...slot, startTime: normalizeTime(slot.startTime), endTime: normalizeTime(slot.endTime) },
        kind: cellKindFor(slot, entry),
        entry,
        journey: slot.journeyId ? journeys.get(slot.journeyId) ?? null : null,
        issue: entry ? issueByEntry.get(entry.id) ?? null : null,
        doubleBooked: found.length > 1,
        startMin: toMinutes(slot.startTime),
        endMin: toMinutes(slot.endTime),
      };

      if (entry && !isLective(slot.blockType)) {
        review.push({
          id: `non-lective-${key}`,
          kind: "non-lective",
          title: `${entry.subjectName} en un bloque no lectivo`,
          message: `${slot.name} es un bloque de descanso. Mueve o quita esta clase.`,
          entryIds: found.map((e) => e.id),
          entries: found,
          cellKey: key,
        });
      }
      if (found.length > 1) {
        review.push({
          id: `double-${key}`,
          kind: "double-booked",
          title: "Dos clases en el mismo período",
          message: `${found.map((e) => `${e.subjectName} ${e.gradeName} ${e.sectionName}`).join(" y ")} coinciden el ${dayMeta(day).long.toLowerCase()} a las ${normalizeTime(slot.startTime)}.`,
          entryIds: found.map((e) => e.id),
          entries: found,
          cellKey: key,
        });
      }
      cells.set(key, cell);
      return cell;
    });

    // Tramos de jornada por día
    const spans = new Map<string, JourneySpan>();
    dayCells.forEach((c) => {
      if (c.kind === "gap") return;
      const id = c.journey?.id ?? "__none";
      const current = spans.get(id);
      if (current) {
        current.startMin = Math.min(current.startMin, c.startMin);
        current.endMin = Math.max(current.endMin, c.endMin);
      } else {
        spans.set(id, {
          journey: c.journey,
          label: c.journey?.name ?? "Jornada",
          startMin: c.startMin,
          endMin: c.endMin,
        });
      }
    });

    const classCells = dayCells.filter((c) => c.kind === "class");
    return {
      day,
      meta: dayMeta(day),
      cells: dayCells,
      journeys: Array.from(spans.values()).sort((a, b) => a.startMin - b.startMin),
      teachingMinutes: classCells.reduce((sum, c) => sum + durationMinutes(c.slot.startTime, c.slot.endTime), 0),
      classCount: classCells.length,
      freeCount: dayCells.filter((c) => c.kind === "free").length,
    };
  });

  // Clases cuyo período ya no existe
  entries
    .filter((e) => !placedEntryIds.has(e.id) && !placementIssueIds.has(e.id))
    .forEach((entry) => {
      review.push({
        id: `orphan-${entry.id}`,
        kind: "orphan",
        title: `${entry.subjectName} · ${entry.gradeName} ${entry.sectionName}`,
        message: `Estaba programada el ${dayMeta(entry.dayOfWeek).long.toLowerCase()} de ${normalizeTime(entry.startTime)} a ${normalizeTime(entry.endTime)}, pero ese período ya no existe en tu estructura.`,
        entryIds: [entry.id],
        entries: [entry],
        cellKey: null,
      });
    });

  // Problemas de integridad informados por el servidor
  issues.forEach((issue, index) => {
    const firstPlaced = issue.entryIds
      .map((id) => Array.from(cells.values()).find((c) => c.entry?.id === id))
      .find(Boolean);
    review.push({
      id: `integrity-${index}-${issue.code}`,
      kind: issue.code === "NEEDS_PLACEMENT" ? "orphan" : "integrity",
      title: `${issue.subjectName} · ${issue.gradeName} ${issue.sectionName}`,
      message: issue.message,
      entryIds: issue.entryIds.filter(id => entryById.has(id)),
      entries: issue.entryIds.flatMap(id => entryById.get(id) ? [entryById.get(id)!] : []),
      cellKey: firstPlaced?.key ?? null,
    });
  });

  const allCells = days.flatMap((d) => d.cells);
  const starts = allCells.map((c) => c.startMin);
  const ends = allCells.map((c) => c.endMin);
  const rangeStart = starts.length ? Math.floor(Math.min(...starts) / 60) * 60 : empty.rangeStart;
  const rangeEnd = ends.length ? Math.ceil(Math.max(...ends) / 60) * 60 : empty.rangeEnd;

  const classCells = allCells.filter((c) => c.kind === "class");
  return {
    days,
    rangeStart,
    rangeEnd,
    hasStructure: allCells.length > 0,
    totals: {
      classes: classCells.length,
      teachingMinutes: days.reduce((sum, d) => sum + d.teachingMinutes, 0),
      sections: new Set(classCells.map((c) => c.entry?.sectionId)).size,
      freePeriods: allCells.filter((c) => c.kind === "free").length,
      review: review.length,
    },
    review,
    cells,
  };
}

/* ───────────────────────── Ahora / próxima clase ───────────────────────── */

export type NowState =
  | { type: "in-class"; cell: WeekCell; remaining: number; next: WeekCell | null }
  | { type: "upcoming-today"; cell: WeekCell; inMinutes: number }
  | { type: "upcoming-later"; cell: WeekCell; daysAhead: number }
  | { type: "none" };

export function computeNow(model: WeekModel, date: Date): NowState {
  const today = scheduleDayFromDate(date);
  const now = minutesFromDate(date);
  const classCellsOf = (day: number) =>
    model.days.find((d) => d.day === day)?.cells.filter((c) => c.kind === "class") ?? [];

  const todays = classCellsOf(today);
  const current = todays.find((c) => c.startMin <= now && now < c.endMin);
  if (current) {
    const next = todays.find((c) => c.startMin >= current.endMin) ?? null;
    return { type: "in-class", cell: current, remaining: current.endMin - now, next };
  }
  const laterToday = todays.find((c) => c.startMin > now);
  if (laterToday) return { type: "upcoming-today", cell: laterToday, inMinutes: laterToday.startMin - now };

  for (let offset = 1; offset <= 7; offset++) {
    const day = ((today - 1 + offset) % 7) + 1;
    const first = classCellsOf(day)[0];
    if (first) return { type: "upcoming-later", cell: first, daysAhead: offset };
  }
  return { type: "none" };
}

/* ───────────────────────── Validación de asignación ───────────────────────── */

/** Clase propia que se superpone con el período (excluye la entrada que se reemplaza). */
export function findOverlap(
  entries: ScheduleEntry[],
  cell: WeekCell,
  ignoreEntryId?: string,
): ScheduleEntry | null {
  return (
    entries.find(
      (e) =>
        isActive(e) &&
        !e.needsPlacement &&
        e.id !== ignoreEntryId &&
        e.dayOfWeek === cell.day &&
        !(e.timeSlotId === cell.slot.id && e.id === ignoreEntryId) &&
        rangesOverlap(e.startTime, e.endTime, cell.slot.startTime, cell.slot.endTime),
    ) ?? null
  );
}

/** Períodos libres en otros días con exactamente el mismo horario. */
export function findSiblingFreeCells(model: WeekModel, cell: WeekCell): WeekCell[] {
  return model.days
    .filter((d) => d.day !== cell.day)
    .map((d) =>
      d.cells.find(
        (c) => c.kind === "free" && c.startMin === cell.startMin && c.endMin === cell.endMin,
      ),
    )
    .filter((c): c is WeekCell => Boolean(c));
}

export function firstFreeCell(model: WeekModel, fromDay?: number): WeekCell | null {
  const ordered = fromDay
    ? [...model.days.filter((d) => d.day >= fromDay), ...model.days.filter((d) => d.day < fromDay)]
    : model.days;
  for (const d of ordered) {
    const free = d.cells.find((c) => c.kind === "free");
    if (free) return free;
  }
  return null;
}
