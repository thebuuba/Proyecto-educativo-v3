import type {
  SaveScheduleStructureInput,
  ScheduleBlockSource,
  ScheduleBlockType,
  ScheduleJourneyKind,
  ScheduleStructureBlockInput,
  ScheduleWorkspace,
  TimeSlot,
} from "@/modules/schedule/polymet/lib/schedule-types";
import {
  BLOCK_META,
  JOURNEY_META,
  dayMeta,
  fromMinutes,
  normalizeTime,
  rangesOverlap,
  toMinutes,
} from "@/modules/schedule/polymet/lib/schedule-time";

export type BreakType = Exclude<ScheduleBlockType, "CLASS" | "GAP">;

export type DraftBreak = {
  key: string;
  afterPeriod: number;
  blockType: BreakType;
  minutes: number;
};

export type DraftJourney = {
  key: string;
  persisted: boolean;
  name: string;
  kind: ScheduleJourneyKind;
  startTime: string;
  endTime: string;
  days: number[];
  periodMinutes: number;
  breaks: DraftBreak[];
};

export type DraftBlock = {
  key: string;
  id?: string;
  name: string;
  startTime: string;
  endTime: string;
  blockType: ScheduleBlockType;
  journeyKey: string;
  blockSource?: ScheduleBlockSource;
  sourceKey?: string;
};

export type ScheduleDraft = {
  days: number[];
  journeys: DraftJourney[];
  /** Días personalizados manualmente: no se regeneran desde el patrón. */
  customBlocks: Record<number, DraftBlock[]>;
  /** Identidad del patrón cargado; nunca se aplica a bloques manuales nuevos. */
  initialPatternBlocks?: Record<number, DraftBlock[]>;
};

export type DraftStep = "days" | "journeys" | "periods" | "review";

export type DraftIssue = {
  level: "error" | "warning";
  step: DraftStep;
  message: string;
  journeyKey?: string;
  day?: number;
};

let keySeed = 0;
export function draftKey(prefix: string) {
  keySeed += 1;
  return `${prefix}-${Date.now().toString(36)}-${keySeed}`;
}

/* ───────────────────────── Creación ───────────────────────── */

export function createJourney(kind: ScheduleJourneyKind, days: number[]): DraftJourney {
  const meta = JOURNEY_META[kind];
  const periodMinutes = kind === "NIGHT" ? 40 : 45;
  return {
    key: draftKey("journey"),
    persisted: false,
    name: meta.label,
    kind,
    startTime: meta.defaultStart,
    endTime: meta.defaultEnd,
    days: [...days],
    periodMinutes,
    breaks:
      kind === "EXTENDED"
        ? [
            { key: draftKey("break"), afterPeriod: 2, blockType: "BREAK", minutes: 20 },
            { key: draftKey("break"), afterPeriod: 5, blockType: "LUNCH", minutes: 60 },
          ]
        : [{ key: draftKey("break"), afterPeriod: 3, blockType: "BREAK", minutes: 20 }],
  };
}

export function createEmptyDraft(): ScheduleDraft {
  const days = [1, 2, 3, 4, 5];
  return { days, journeys: [createJourney("MORNING", days)], customBlocks: {} };
}

/* ───────────────────────── Generación ───────────────────────── */

export type JourneyGeneration = {
  blocks: DraftBlock[];
  periods: number;
  leftover: number;
};

export function generateJourneyBlocks(journey: DraftJourney, day: number): JourneyGeneration {
  const blocks: DraftBlock[] = [];
  const end = toMinutes(journey.endTime);
  let cursor = toMinutes(journey.startTime);
  let period = 1;
  const pm = Math.max(5, journey.periodMinutes);
  if (cursor >= end) return { blocks, periods: 0, leftover: 0 };

  while (cursor + pm <= end) {
    blocks.push({
      key: `${day}-${journey.key}-p${period}`,
      name: `Período ${period}`,
      startTime: fromMinutes(cursor),
      endTime: fromMinutes(cursor + pm),
      blockType: "CLASS",
      journeyKey: journey.key,
      blockSource: "MANUAL",
    });
    cursor += pm;
    journey.breaks
      .filter((b) => b.afterPeriod === period)
      .forEach((b) => {
        if (cursor + b.minutes <= end && b.minutes > 0) {
          blocks.push({
            key: `${day}-${journey.key}-${b.key}`,
            name: BLOCK_META[b.blockType].label,
            startTime: fromMinutes(cursor),
            endTime: fromMinutes(cursor + b.minutes),
            blockType: b.blockType,
            journeyKey: journey.key,
            blockSource: "MANUAL",
          });
          cursor += b.minutes;
        }
      });
    period += 1;
  }
  return { blocks, periods: period - 1, leftover: end - cursor };
}

export function journeysForDay(draft: ScheduleDraft, day: number): DraftJourney[] {
  return draft.journeys
    .filter((j) => j.days.includes(day))
    .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));
}

export function generateDayBlocks(draft: ScheduleDraft, day: number): DraftBlock[] {
  const journeys = journeysForDay(draft, day);
  const blocks: DraftBlock[] = [];
  journeys.forEach((journey, index) => {
    const prev = journeys[index - 1];
    if (prev && toMinutes(prev.endTime) < toMinutes(journey.startTime)) {
      blocks.push({
        key: `${day}-gap-${prev.key}-${journey.key}`,
        name: BLOCK_META.GAP.label,
        startTime: prev.endTime,
        endTime: journey.startTime,
        blockType: "GAP",
        journeyKey: prev.key,
        blockSource: "INTER_JOURNEY_GAP",
        sourceKey: `${prev.key}:${journey.key}`,
      });
    }
    blocks.push(...generateJourneyBlocks(journey, day).blocks);
  });
  return blocks;
}

export function resolveDayBlocks(draft: ScheduleDraft, day: number): DraftBlock[] {
  const custom = draft.customBlocks[day];
  const blocks = custom ?? generateDayBlocks(draft, day).map((block) => {
    const original = draft.initialPatternBlocks?.[day]?.find((b) =>
      b.key === block.key && b.journeyKey === block.journeyKey &&
      b.startTime === block.startTime && b.endTime === block.endTime && b.blockType === block.blockType,
    );
    return original ? { ...block, id: original.id } : block;
  });
  return [...blocks].sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));
}

function sameShape(a: DraftBlock[], b: DraftBlock[]) {
  if (a.length !== b.length) return false;
  return a.every(
    (block, i) =>
      block.name === b[i].name &&
      block.journeyKey === b[i].journeyKey &&
      block.startTime === b[i].startTime &&
      block.endTime === b[i].endTime &&
      block.blockType === b[i].blockType,
  );
}

/* ───────────────────────── Validación ───────────────────────── */

export function validateDraft(draft: ScheduleDraft): DraftIssue[] {
  const issues: DraftIssue[] = [];
  if (draft.days.length === 0) {
    issues.push({ level: "error", step: "days", message: "Selecciona al menos un día de clases." });
  }
  if (draft.journeys.length === 0) {
    issues.push({ level: "error", step: "journeys", message: "Agrega al menos una jornada." });
  }

  draft.journeys.forEach((j) => {
    const label = j.name.trim() || "Jornada sin nombre";
    if (!j.name.trim()) {
      issues.push({ level: "error", step: "journeys", journeyKey: j.key, message: "Escribe un nombre para la jornada." });
    }
    if (toMinutes(j.startTime) >= toMinutes(j.endTime)) {
      issues.push({ level: "error", step: "journeys", journeyKey: j.key, message: `${label}: la hora de fin debe ser posterior al inicio.` });
      return;
    }
    const activeDays = j.days.filter((d) => draft.days.includes(d));
    if (activeDays.length === 0) {
      issues.push({ level: "error", step: "journeys", journeyKey: j.key, message: `${label} no se imparte ningún día seleccionado.` });
    }
    if (j.periodMinutes < 10 || j.periodMinutes > 240) {
      issues.push({ level: "error", step: "periods", journeyKey: j.key, message: `${label}: la duración del período debe estar entre 10 y 240 minutos.` });
      return;
    }
    const gen = generateJourneyBlocks(j, activeDays[0] ?? 1);
    if (gen.periods === 0) {
      issues.push({ level: "error", step: "periods", journeyKey: j.key, message: `${label}: no cabe ningún período de ${j.periodMinutes} min.` });
    } else if (gen.leftover > 0) {
      issues.push({ level: "warning", step: "periods", journeyKey: j.key, message: `${label}: quedan ${gen.leftover} min sin usar al final de la jornada.` });
    }
    const skipped = j.breaks.filter((b) => b.afterPeriod >= gen.periods && gen.periods > 0);
    if (skipped.length > 0) {
      issues.push({ level: "warning", step: "periods", journeyKey: j.key, message: `${label}: hay descansos programados después del último período.` });
    }
  });

  for (let i = 0; i < draft.journeys.length; i++) {
    for (let k = i + 1; k < draft.journeys.length; k++) {
      const a = draft.journeys[i];
      const b = draft.journeys[k];
      const shared = a.days.filter((d) => b.days.includes(d) && draft.days.includes(d));
      if (shared.length && rangesOverlap(a.startTime, a.endTime, b.startTime, b.endTime)) {
        issues.push({
          level: "error",
          step: "journeys",
          journeyKey: b.key,
          message: `${a.name || "Una jornada"} y ${b.name || "otra jornada"} se superponen (${shared.map((d) => dayMeta(d).short).join(", ")}).`,
        });
      }
    }
  }

  let lectiveCount = 0;
  draft.days.forEach((day) => {
    const blocks = resolveDayBlocks(draft, day);
    lectiveCount += blocks.filter((b) => b.blockType === "CLASS").length;
    blocks.forEach((block, i) => {
      if (toMinutes(block.startTime) >= toMinutes(block.endTime)) {
        issues.push({ level: "error", step: "periods", day, message: `${dayMeta(day).long}: «${block.name}» termina antes de empezar.` });
      }
      const next = blocks[i + 1];
      if (next && toMinutes(next.startTime) < toMinutes(block.endTime)) {
        issues.push({ level: "error", step: "periods", day, message: `${dayMeta(day).long}: «${block.name}» y «${next.name}» se superponen.` });
      }
      if (!block.name.trim()) {
        issues.push({ level: "error", step: "periods", day, message: `${dayMeta(day).long}: hay un bloque sin nombre.` });
      }
    });
  });
  if (draft.days.length && draft.journeys.length && lectiveCount === 0) {
    issues.push({ level: "error", step: "periods", message: "La estructura no tiene ningún período de clase." });
  }
  return issues;
}

/* ───────────────────────── Serialización ───────────────────────── */

/** Sólo una identidad explícita del mismo día y jornada puede conservar clases. */
function attachExistingIds(blocks: DraftBlock[], day: number, existing: TimeSlot[]): DraftBlock[] {
  const used = new Set<string>();
  return blocks.map((block) => {
    const match = existing.find((slot) => slot.id === block.id && !used.has(slot.id) &&
      slot.status === "ACTIVE" && slot.dayOfWeek === day &&
      (slot.journeyId === block.journeyKey || slot.journeyId === null) &&
      (slot.blockType !== "CLASS" || block.blockType === "CLASS"));
    if (match) used.add(match.id);
    return { ...block, id: match?.id };
  });
}

export function toStructureInput(draft: ScheduleDraft, existing: TimeSlot[]): SaveScheduleStructureInput {
  const activeJourneys = draft.journeys
    .filter((j) => j.days.some((d) => draft.days.includes(d)))
    .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));

  const blocks: ScheduleStructureBlockInput[] = [];
  const validGapSources = new Map(activeJourneys.slice(0, -1).map((j, i) => [
    `${j.key}:${activeJourneys[i + 1].key}`, { journey: j, next: activeJourneys[i + 1] },
  ]));
  [...draft.days]
    .sort((a, b) => a - b)
    .forEach((day) => {
      attachExistingIds(resolveDayBlocks(draft, day), day, existing)
        .filter((b) => activeJourneys.some((j) => j.key === b.journeyKey && j.days.includes(day)))
        .forEach((b, i) => {
          const gap = b.sourceKey ? validGapSources.get(b.sourceKey) : undefined;
          const generatedGap = b.blockSource === "INTER_JOURNEY_GAP" && b.blockType !== "CLASS" &&
            gap?.journey.key === b.journeyKey && gap.journey.endTime === b.startTime && gap.next.startTime === b.endTime;
          blocks.push({
            ...(b.id ? { id: b.id } : {}),
            name: b.name.trim(),
            startTime: b.startTime,
            endTime: b.endTime,
            sequence: i + 1,
            dayOfWeek: day,
            blockType: b.blockType,
            journeyKey: b.journeyKey,
            blockSource: generatedGap ? "INTER_JOURNEY_GAP" : "MANUAL",
            ...(generatedGap ? { sourceKey: b.sourceKey } : {}),
          });
        });
    });

  return {
    journeys: activeJourneys.map((j, i) => ({
      id: j.key,
      name: j.name.trim(),
      kind: j.kind,
      startTime: j.startTime,
      endTime: j.endTime,
      sequence: i + 1,
    })),
    blocks,
  };
}

export type StructureImpact = { kept: number; displaced: number; retimed: number };

export function structureImpact(input: SaveScheduleStructureInput, workspace: ScheduleWorkspace | null): StructureImpact {
  const impact: StructureImpact = { kept: 0, displaced: 0, retimed: 0 };
  if (!workspace) return impact;
  const source = workspace as ScheduleWorkspace & { pendingEntries?: Array<ScheduleWorkspace["entries"][number] & { needsPlacement?: boolean }> };
  const pendingIds = new Set((source.pendingEntries ?? []).map((entry) => entry.id));
  const entries = new Map([...source.entries, ...(source.pendingEntries ?? [])].map((entry) => [entry.id, entry]));
  entries.forEach((entry) => {
    if (pendingIds.has(entry.id) || (entry as typeof entry & { needsPlacement?: boolean }).needsPlacement) {
      impact.displaced += 1;
      return;
    }
    const block = input.blocks.find((b) => b.id === entry.timeSlotId && b.dayOfWeek === entry.dayOfWeek);
    if (!block || block.blockType !== "CLASS") {
      impact.displaced += 1;
      return;
    }
    impact.kept += 1;
    if (block.startTime !== normalizeTime(entry.startTime) || block.endTime !== normalizeTime(entry.endTime)) {
      impact.retimed += 1;
    }
  });
  return impact;
}

/* ───────────────────────── Desde el horario existente ───────────────────────── */

export function draftFromWorkspace(workspace: ScheduleWorkspace | null): ScheduleDraft {
  if (!workspace || workspace.timeSlots.length === 0) return createEmptyDraft();
  const slots = workspace.timeSlots
    .filter((s) => s.status === "ACTIVE")
    .map((s) => ({ ...s, startTime: normalizeTime(s.startTime), endTime: normalizeTime(s.endTime) }));
  if (slots.length === 0) return createEmptyDraft();
  const explicit = Array.from(new Set(slots.map((s) => s.dayOfWeek).filter((d): d is number => d !== null)));
  const days = (explicit.length ? explicit : [1, 2, 3, 4, 5]).sort((a, b) => a - b);
  const slotsOfDay = (day: number) =>
    slots
      .filter((s) => s.dayOfWeek === day || (s.dayOfWeek === null && !explicit.includes(day)))
      .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));

  const persistedJourneys = (workspace.journeys ?? []).filter((j) => j.status === "ACTIVE");
  const slotJourney = (slot: TimeSlot) => persistedJourneys.some((j) => j.id === slot.journeyId)
    ? slot.journeyId : persistedJourneys[0]?.id;
  let journeys: DraftJourney[] = persistedJourneys
    .sort((a, b) => a.sequence - b.sequence)
    .map((j) => {
      const activeDays = days.filter((d) => slotsOfDay(d).some((s) => slotJourney(s) === j.id));
      const sampleDay = activeDays[0] ?? days[0];
      const own = slotsOfDay(sampleDay).filter((s) => slotJourney(s) === j.id && s.blockType !== "GAP");
      const classDurations = own.filter((s) => s.blockType === "CLASS").map((s) => toMinutes(s.endTime) - toMinutes(s.startTime));
      const breaks: DraftBreak[] = [];
      let classCount = 0;
      own.forEach((s) => {
        if (s.blockType === "CLASS") classCount += 1;
        else
          breaks.push({
            key: draftKey("break"),
            afterPeriod: classCount,
            blockType: s.blockType as BreakType,
            minutes: toMinutes(s.endTime) - toMinutes(s.startTime),
          });
      });
      return {
        key: j.id,
        persisted: true,
        name: j.name,
        kind: j.kind,
        startTime: normalizeTime(j.startTime),
        endTime: normalizeTime(j.endTime),
        days: activeDays,
        periodMinutes: classDurations[0] ?? 45,
        breaks,
      };
    })
    .filter((j) => j.days.length > 0);

  if (journeys.length === 0) {
    const starts = slots.map((s) => toMinutes(s.startTime));
    const ends = slots.map((s) => toMinutes(s.endTime));
    journeys = [
      {
        key: draftKey("journey"),
        persisted: false,
        name: "Jornada",
        kind: "CUSTOM",
        startTime: fromMinutes(Math.min(...starts)),
        endTime: fromMinutes(Math.max(...ends)),
        days: [...days],
        periodMinutes: 45,
        breaks: [],
      },
    ];
  }

  const base: ScheduleDraft = { days, journeys, customBlocks: {}, initialPatternBlocks: {} };
  const fallbackJourney = journeys[0].key;
  days.forEach((day) => {
    const actual: DraftBlock[] = slotsOfDay(day).map((s) => ({
      key: s.id,
      id: s.dayOfWeek === day ? s.id : undefined,
      name: s.name,
      startTime: s.startTime,
      endTime: s.endTime,
      blockType: s.blockType,
      journeyKey: journeys.some((j) => j.key === s.journeyId) ? s.journeyId! : fallbackJourney,
      blockSource: s.blockSource,
      sourceKey: s.sourceKey ?? undefined,
    }));
    const generated = generateDayBlocks(base, day);
    if (!sameShape(actual, generated)) base.customBlocks[day] = actual;
    else base.initialPatternBlocks![day] = actual.map((block, index) => ({ ...block, key: generated[index].key }));
  });
  return base;
}

export function draftSummary(draft: ScheduleDraft) {
  let periods = 0;
  let rests = 0;
  let teaching = 0;
  draft.days.forEach((day) => {
    resolveDayBlocks(draft, day).forEach((b) => {
      if (b.blockType === "CLASS") {
        periods += 1;
        teaching += toMinutes(b.endTime) - toMinutes(b.startTime);
      } else if (b.blockType !== "GAP") rests += 1;
    });
  });
  return { periods, rests, teachingMinutes: teaching };
}
