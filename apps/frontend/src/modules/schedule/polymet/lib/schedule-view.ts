import type { ScheduleBlockType } from "@/modules/schedule/polymet/lib/schedule-types";
import type { DraftBlock } from "@/modules/schedule/polymet/lib/schedule-draft";
import type { JourneySpan, WeekCell, WeekCellKind, WeekModel } from "@/modules/schedule/polymet/lib/schedule-week-model";
import { durationMinutes, subjectAccent, toMinutes } from "@/modules/schedule/polymet/lib/schedule-time";

/** Unidad visual del horario, independiente de si viene del servidor o del constructor. */
export type TimeMapBlock = {
  key: string;
  kind: WeekCellKind;
  blockType: ScheduleBlockType;
  name: string;
  startTime: string;
  endTime: string;
  startMin: number;
  endMin: number;
  journeyLabel: string | null;
  subject: {
    name: string;
    detail: string;
    accent: string;
    room: string | null;
  } | null;
  flagged: boolean;
};

export type TimeMapColumn = {
  day: number;
  label: string;
  shortLabel: string;
  caption: string;
  isToday: boolean;
  load: number;
  blocks: TimeMapBlock[];
  journeys: JourneySpan[];
};

export function blockFromCell(cell: WeekCell): TimeMapBlock {
  const entry = cell.entry;
  return {
    key: cell.key,
    kind: cell.kind,
    blockType: cell.slot.blockType,
    name: cell.slot.name,
    startTime: cell.slot.startTime,
    endTime: cell.slot.endTime,
    startMin: cell.startMin,
    endMin: cell.endMin,
    journeyLabel: cell.journey?.name ?? null,
    subject: entry
      ? {
          name: entry.subjectName,
          detail: `${entry.gradeName} ${entry.sectionName} · ${entry.academicLevelName}`,
          accent: subjectAccent(entry.subjectName, entry.appearanceColor),
          room: entry.room,
        }
      : null,
    flagged: Boolean(cell.issue) || cell.doubleBooked || (Boolean(entry) && cell.kind !== "class"),
  };
}

export function columnsFromModel(model: WeekModel, today: number | null): TimeMapColumn[] {
  const maxTeaching = Math.max(1, ...model.days.map((d) => d.teachingMinutes));
  return model.days.map((d) => ({
    day: d.day,
    label: d.meta.long,
    shortLabel: d.meta.short,
    caption:
      d.classCount === 0
        ? d.freeCount > 0
          ? `${d.freeCount} libres`
          : "Sin clases"
        : `${d.classCount} ${d.classCount === 1 ? "clase" : "clases"}`,
    isToday: d.day === today,
    load: d.teachingMinutes / maxTeaching,
    blocks: d.cells.map(blockFromCell),
    journeys: d.journeys,
  }));
}

export function blockFromDraft(block: DraftBlock, journeyLabel: string | null): TimeMapBlock {
  const kind: WeekCellKind = block.blockType === "CLASS" ? "free" : block.blockType === "GAP" ? "gap" : "rest";
  return {
    key: block.key,
    kind,
    blockType: block.blockType,
    name: block.name,
    startTime: block.startTime,
    endTime: block.endTime,
    startMin: toMinutes(block.startTime),
    endMin: toMinutes(block.endTime),
    journeyLabel,
    subject: null,
    flagged: durationMinutes(block.startTime, block.endTime) <= 0,
  };
}
