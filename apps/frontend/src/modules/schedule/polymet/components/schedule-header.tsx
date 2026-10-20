import {
  CalendarCogIcon,
  ChevronDownIcon,
  DownloadIcon,
  LayoutGridIcon,
  ListIcon,
  PlusIcon,
  RefreshCwIcon,
  RotateCcwIcon,
  Settings2Icon,
} from "lucide-react";

import { cn } from "../ui/utils";
import { Button } from "@/modules/schedule/polymet/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/modules/schedule/polymet/ui/dropdown-menu";
import type { SchedulePermissions } from "@/modules/schedule/polymet/lib/schedule-types";

export type ScheduleView = "week" | "day";

type ScheduleHeaderProps = {
  schoolYearName: string | null;
  view: ScheduleView;
  onViewChange: (view: ScheduleView) => void;
  showViewToggle: boolean;
  permissions: SchedulePermissions;
  hasStructure: boolean;
  freeCount: number;
  refreshing: boolean;
  onAssignNext: () => void;
  onEditStructure: () => void;
  onReset: () => void;
  onRefresh: () => void;
  onExport: () => void;
};

export function ScheduleHeader({
  schoolYearName,
  view,
  onViewChange,
  showViewToggle,
  permissions,
  hasStructure,
  freeCount,
  refreshing,
  onAssignNext,
  onEditStructure,
  onReset,
  onRefresh,
  onExport,
}: ScheduleHeaderProps) {
  // Diferir hasta que el menú cierre evita conflictos de foco entre capas de Radix.
  const defer = (fn: () => void) => () => window.setTimeout(fn, 0);
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="inline-block size-1.5 rounded-full bg-primary" aria-hidden />
          {schoolYearName ?? "Sin año escolar activo"}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">Horario docente</h1>
      </div>

      {hasStructure && (
        <div className="flex flex-wrap items-center gap-2">
          {showViewToggle && (
            <div role="radiogroup" aria-label="Vista del horario" className="flex rounded-full bg-card p-1 shadow-xs">
              {(
                [
                  { value: "week", label: "Semana", icon: LayoutGridIcon },
                  { value: "day", label: "Día", icon: ListIcon },
                ] as const
              ).map((option) => {
                const active = view === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => onViewChange(option.value)}
                    className={cn(
                      "flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <option.icon className="size-4" strokeWidth={1.9} aria-hidden />
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}

          <Button
            variant="outline"
            onClick={onExport}
            className="h-11 rounded-full border-transparent bg-card px-4 shadow-xs hover:bg-accent"
            aria-label="Exportar horario como PDF o imagen"
          >
            <DownloadIcon className="size-4" strokeWidth={1.9} />
            <span className="hidden sm:inline">Exportar</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11 rounded-full border-transparent bg-card px-4 shadow-xs hover:bg-accent">
                <Settings2Icon className="size-4" strokeWidth={1.9} />
                Estructura
                <ChevronDownIcon className="size-3.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-2xl p-1.5">
              <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Estructura del horario</DropdownMenuLabel>
              <DropdownMenuItem disabled={!permissions.canEditStructure} onSelect={defer(onEditStructure)} className="gap-2.5 rounded-xl py-2.5">
                <CalendarCogIcon className="size-4" />
                <span className="flex flex-col">
                  <span>Editar días, jornadas y períodos</span>
                  {!permissions.canEditStructure && <span className="text-[11px] text-muted-foreground">Requiere permiso de edición</span>}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={onRefresh} disabled={refreshing} className="gap-2.5 rounded-xl py-2.5">
                <RefreshCwIcon className={cn("size-4", refreshing && "animate-spin")} />
                Actualizar desde el servidor
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={!permissions.canEditStructure}
                onSelect={defer(onReset)}
                className="gap-2.5 rounded-xl py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <RotateCcwIcon className="size-4" />
                Crear un horario nuevo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {permissions.canAssign && (
            <Button onClick={onAssignNext} disabled={freeCount === 0} className="h-11 rounded-full px-5 font-semibold shadow-md shadow-primary/20">
              <PlusIcon className="size-4" strokeWidth={2.25} />
              {freeCount === 0 ? "Sin períodos libres" : "Asignar clase"}
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
