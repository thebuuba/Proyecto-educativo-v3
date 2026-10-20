import {
  ArrowDownUpIcon,
  BookOpenIcon,
  CoffeeIcon,
  CroissantIcon,
  HourglassIcon,
  MoonStarIcon,
  PauseIcon,
  SlidersHorizontalIcon,
  SunIcon,
  SunriseIcon,
  SunsetIcon,
  UtensilsCrossedIcon,
  type LucideIcon,
} from "lucide-react";

import type {
  ScheduleBlockType,
  ScheduleJourneyKind,
} from "@/modules/schedule/polymet/lib/schedule-types";

/* ───────────────────────────── Tiempo ───────────────────────────── */

export function toMinutes(time: string): number {
  const [h = "0", m = "0"] = time.split(":");
  return Number(h) * 60 + Number(m);
}

export function fromMinutes(total: number): string {
  const clamped = Math.max(0, Math.min(24 * 60 - 1, Math.round(total)));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Normaliza "7:30:00" → "07:30". */
export function normalizeTime(time: string): string {
  return fromMinutes(toMinutes(time));
}

export function durationMinutes(start: string, end: string): number {
  return toMinutes(end) - toMinutes(start);
}

/** "07:30" → "7:30" (formato compacto para cuadrícula). */
export function formatClock(time: string): string {
  const [h, m] = normalizeTime(time).split(":");
  return `${Number(h)}:${m}`;
}

export function formatRange(start: string, end: string): string {
  return `${formatClock(start)}–${formatClock(end)}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export function formatHours(minutes: number): string {
  const hours = minutes / 60;
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1).replace(".", ",")} h`;
}

export function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return toMinutes(aStart) < toMinutes(bEnd) && toMinutes(bStart) < toMinutes(aEnd);
}

/* ───────────────────────────── Días ───────────────────────────── */

export type DayMeta = {
  value: number;
  short: string;
  long: string;
  letter: string;
};

/** dayOfWeek sigue la convención del backend: 1 = lunes … 7 = domingo. */
export const WEEK_DAYS: DayMeta[] = [
  { value: 1, short: "Lun", long: "Lunes", letter: "L" },
  { value: 2, short: "Mar", long: "Martes", letter: "M" },
  { value: 3, short: "Mié", long: "Miércoles", letter: "X" },
  { value: 4, short: "Jue", long: "Jueves", letter: "J" },
  { value: 5, short: "Vie", long: "Viernes", letter: "V" },
  { value: 6, short: "Sáb", long: "Sábado", letter: "S" },
  { value: 7, short: "Dom", long: "Domingo", letter: "D" },
];

export function dayMeta(day: number): DayMeta {
  return WEEK_DAYS.find((d) => d.value === day) ?? WEEK_DAYS[0];
}

export function scheduleDayFromDate(date: Date): number {
  return ((date.getDay() + 6) % 7) + 1;
}

export function minutesFromDate(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

/* ─────────────────────────── Bloques ─────────────────────────── */

export type BlockMeta = {
  label: string;
  short: string;
  icon: LucideIcon;
  lective: boolean;
};

export const BLOCK_META: Record<ScheduleBlockType, BlockMeta> = {
  CLASS: { label: "Período de clase", short: "Clase", icon: BookOpenIcon, lective: true },
  BREAK: { label: "Recreo", short: "Recreo", icon: CoffeeIcon, lective: false },
  BREAKFAST: { label: "Desayuno", short: "Desayuno", icon: CroissantIcon, lective: false },
  LUNCH: { label: "Almuerzo", short: "Almuerzo", icon: UtensilsCrossedIcon, lective: false },
  PAUSE: { label: "Pausa", short: "Pausa", icon: PauseIcon, lective: false },
  FREE: { label: "Hora no lectiva", short: "No lectiva", icon: HourglassIcon, lective: false },
  GAP: { label: "Entre jornadas", short: "Entre jornadas", icon: ArrowDownUpIcon, lective: false },
};

export const BREAK_TYPES: Array<Exclude<ScheduleBlockType, "CLASS" | "GAP">> = [
  "BREAK",
  "BREAKFAST",
  "LUNCH",
  "PAUSE",
  "FREE",
];

export function isLective(type: ScheduleBlockType): boolean {
  return BLOCK_META[type].lective;
}

/* ─────────────────────────── Jornadas ─────────────────────────── */

export type JourneyMeta = {
  label: string;
  icon: LucideIcon;
  defaultStart: string;
  defaultEnd: string;
};

export const JOURNEY_META: Record<ScheduleJourneyKind, JourneyMeta> = {
  MORNING: { label: "Matutina", icon: SunriseIcon, defaultStart: "07:30", defaultEnd: "12:30" },
  AFTERNOON: { label: "Vespertina", icon: SunIcon, defaultStart: "13:30", defaultEnd: "17:30" },
  NIGHT: { label: "Nocturna", icon: MoonStarIcon, defaultStart: "18:00", defaultEnd: "21:30" },
  EXTENDED: { label: "Extendida", icon: SunsetIcon, defaultStart: "08:00", defaultEnd: "16:00" },
  CUSTOM: { label: "Personalizada", icon: SlidersHorizontalIcon, defaultStart: "08:00", defaultEnd: "12:00" },
};

export const JOURNEY_KINDS: ScheduleJourneyKind[] = [
  "MORNING",
  "AFTERNOON",
  "NIGHT",
  "EXTENDED",
  "CUSTOM",
];

/* ───────────────────────── Color de asignatura ───────────────────────── */

/**
 * Acentos para identificar asignaturas. Se evitan azul (selección), verde (éxito),
 * ámbar (aviso) y coral (error) para no confundir asignaturas con estados.
 */
const SUBJECT_ACCENTS = [
  "#8b5cf6", // violet
  "#14b8a6", // teal
  "#f97316", // orange
  "#0ea5e9", // sky
  "#6366f1", // indigo
  "#d946ef", // fuchsia
  "#06b6d4", // cyan
  "#64748b", // slate
];

export function subjectAccent(subjectName: string, appearanceColor?: string | null): string {
  if (appearanceColor && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(appearanceColor)) {
    return appearanceColor;
  }
  let hash = 0;
  for (let i = 0; i < subjectName.length; i++) {
    hash = (hash * 31 + subjectName.charCodeAt(i)) >>> 0;
  }
  return SUBJECT_ACCENTS[hash % SUBJECT_ACCENTS.length];
}

export function tint(color: string, percent: number): string {
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}
