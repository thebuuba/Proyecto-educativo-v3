import type {
  AssignableClassOption,
  CreateScheduleEntryInput,
  SaveScheduleStructureInput,
  ScheduleEntry,
  ScheduleWorkspace,
  UpdateScheduleEntryInput,
} from "@/modules/schedule/polymet/lib/schedule-types";

/**
 * Contrato de datos del módulo. Cada método corresponde 1:1 con una función real
 * de `apps/frontend/src/modules/schedule/services/scheduleService.ts`:
 *
 * | Método             | scheduleService            | Endpoint                         |
 * | ------------------ | -------------------------- | -------------------------------- |
 * | getWorkspace       | getScheduleWorkspace       | GET    /schedule/workspace       |
 * | saveStructure      | saveScheduleStructure      | POST   /schedule/structure       |
 * | deleteStructure    | deleteScheduleStructure    | DELETE /schedule/structure       |
 * | createEntry        | createScheduleEntry        | POST   /schedule/entries         |
 * | updateEntry        | updateScheduleEntry        | PATCH  /schedule/entries/:id     |
 * | deleteEntry        | deleteScheduleEntry        | DELETE /schedule/entries/:id     |
 * | getAssignable      | (fuente usada hoy por el formulario de asignación en useSchedule) |
 */
export interface ScheduleDataSource {
  getWorkspace(): Promise<ScheduleWorkspace>;
  getAssignableClasses(): Promise<AssignableClassOption[]>;
  saveStructure(input: SaveScheduleStructureInput): Promise<{ saved: true }>;
  deleteStructure(): Promise<{
    deleted: { assignments: number; blocks: number; journeys: number };
  }>;
  createEntry(input: CreateScheduleEntryInput): Promise<ScheduleEntry>;
  updateEntry(id: string, input: UpdateScheduleEntryInput): Promise<ScheduleEntry>;
  deleteEntry(id: string): Promise<void>;
}

/** Forma compatible con `ApiError` de `@/services/apiClient`. */
export class ScheduleRequestError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

function statusOf(cause: unknown): number | null {
  if (cause && typeof cause === "object" && "status" in cause) {
    const status = (cause as { status: unknown }).status;
    return typeof status === "number" ? status : null;
  }
  return null;
}

function detailOf(cause: unknown): string {
  return cause instanceof Error ? cause.message.trim() : "";
}

export type ScheduleAction = "load" | "save-structure" | "delete-structure" | "assign" | "update" | "unassign";

/**
 * Mensajes accionables. Para `save-structure` replica `scheduleSaveErrorMessage`;
 * para el resto sigue el mismo criterio por código de estado.
 */
export function describeScheduleError(cause: unknown, action: ScheduleAction): string {
  const status = statusOf(cause);
  const detail = detailOf(cause);

  if (cause instanceof TypeError || status === 0) {
    return "No pudimos conectar con el servidor. Revisa tu conexión y vuelve a intentarlo.";
  }
  if (status === 401) return "Tu sesión venció. Inicia sesión nuevamente para continuar.";
  if (status === 403) {
    if (action === "save-structure") return "No tienes permiso para guardar la estructura de este horario.";
    if (action === "delete-structure") return "No tienes permiso para reiniciar este horario.";
    return "No tienes permiso para modificar las clases de este horario.";
  }

  if (action === "save-structure" && (status === 400 || status === 422)) {
    if (/property (blockSource|sourceKey) should not exist/i.test(detail) || (/blockType must be one of the following values/i.test(detail) && !detail.includes("GAP"))) {
      return "El horario incluye espacios entre jornadas, pero el servicio que los guarda todavía no está actualizado. Reinicia o actualiza el servidor de AulaBase y vuelve a intentarlo. Tus cambios permanecen en pantalla.";
    }
    return detail
      ? `No pudimos guardar el horario porque hay información que necesita revisión. Revisa: ${detail}`
      : "No pudimos guardar el horario porque hay información que necesita revisión.";
  }

  if (status === 409) {
    return detail || "Ese período ya está ocupado. Actualiza el horario y elige otro período.";
  }
  if (status === 400 || status === 422) {
    return detail || "La solicitud tiene información que necesita revisión.";
  }

  switch (action) {
    case "load":
      return "No pudimos cargar tu horario en este momento.";
    case "delete-structure":
      return "No pudimos reiniciar el horario. Tu horario actual sigue intacto.";
    case "assign":
      return "No pudimos asignar la clase. El período sigue libre.";
    case "update":
      return "No pudimos cambiar la clase. Se mantiene la asignación anterior.";
    case "unassign":
      return "No pudimos quitar la clase. Sigue en tu horario.";
    default:
      return "No pudimos guardar el horario en este momento. Inténtalo nuevamente.";
  }
}
