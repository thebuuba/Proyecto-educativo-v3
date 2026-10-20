import { useState } from "react";
import { AlertCircleIcon, AlertTriangleIcon, ArrowLeftRightIcon, Loader2Icon, LockIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/modules/schedule/polymet/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/modules/schedule/polymet/ui/alert-dialog";
import type { WeekCell } from "@/modules/schedule/polymet/lib/schedule-week-model";
import { dayMeta, formatDuration, formatRange, subjectAccent } from "@/modules/schedule/polymet/lib/schedule-time";

type EntryPanelProps = {
  cell: WeekCell;
  canAssign: boolean;
  pending: boolean;
  onReplace: () => void;
  onRemove: () => Promise<{ ok: boolean; message?: string }>;
};

/** Detalle de una clase asignada con acciones de cambio y eliminación confirmada. */
export function EntryPanel({ cell, canAssign, pending, onReplace, onRemove }: EntryPanelProps) {
  const entry = cell.entry!;
  const accent = subjectAccent(entry.subjectName, entry.appearanceColor);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const day = dayMeta(cell.day);

  const remove = async () => {
    setError(null);
    const result = await onRemove();
    setConfirmOpen(false);
    if (!result.ok) setError(result.message ?? "No pudimos quitar la clase.");
  };

  const details: Array<[string, string]> = [
    ["Día", day.long],
    ["Horario", `${formatRange(cell.slot.startTime, cell.slot.endTime)} · ${formatDuration(cell.endMin - cell.startMin)}`],
    ["Período", cell.slot.name],
    ["Jornada", cell.journey?.name ?? "—"],
    ["Curso", `${entry.gradeName} ${entry.sectionName}`],
    ["Nivel", entry.academicLevelName],
    ["Aula", entry.room ?? "Sin asignar"],
  ];

  const reviewMessage =
    cell.issue?.message ??
    (cell.doubleBooked ? "Otra clase está asignada en este mismo período." : cell.kind !== "class" ? "Esta clase está en un bloque no lectivo." : null);

  return (
    <div className="flex h-full flex-col">
      <div className="relative overflow-hidden rounded-3xl p-5" style={{ backgroundColor: `color-mix(in srgb, ${accent} 10%, hsl(var(--card)))` }}>
        <span className="absolute inset-y-5 left-0 w-1 rounded-r-full" style={{ backgroundColor: accent }} aria-hidden />
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: `color-mix(in srgb, ${accent} 70%, hsl(var(--foreground)))` }}>
          {day.long} · {formatRange(cell.slot.startTime, cell.slot.endTime)}
        </p>
        <h2 className="mt-1.5 text-xl font-semibold leading-tight text-foreground">{entry.subjectName}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {entry.gradeName} {entry.sectionName} · {entry.academicLevelName}
        </p>
      </div>

      {reviewMessage && (
        <div className="mt-4 flex gap-2.5 rounded-2xl border border-warning/40 bg-warning/[0.08] p-3">
          <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-warning" aria-hidden />
          <p className="text-xs leading-relaxed text-foreground">{reviewMessage}</p>
        </div>
      )}

      <dl className="mt-5 divide-y divide-border">
        {details.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-4 py-2.5">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="text-right text-[13px] font-medium text-foreground">{value}</dd>
          </div>
        ))}
      </dl>

      {error && (
        <div role="alert" className="mt-4 flex gap-2.5 rounded-2xl bg-destructive/10 p-3">
          <AlertCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
          <p className="text-xs leading-relaxed text-foreground">{error}</p>
        </div>
      )}

      <div className="mt-auto pt-6">
        {canAssign ? (
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="h-11 rounded-full bg-card" onClick={onReplace} disabled={pending}>
              <ArrowLeftRightIcon className="size-4" /> Cambiar clase
            </Button>
            <Button
              variant="ghost"
              className="h-11 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setConfirmOpen(true)}
              disabled={pending}
            >
              {pending ? <Loader2Icon className="size-4 animate-spin" /> : <Trash2Icon className="size-4" />}
              {pending ? "Quitando…" : "Quitar del horario"}
            </Button>
          </div>
        ) : (
          <p className="flex items-center gap-2 rounded-2xl bg-muted/70 px-4 py-3 text-xs text-muted-foreground">
            <LockIcon className="size-3.5 shrink-0" aria-hidden /> Solo lectura: no tienes permiso para modificar clases.
          </p>
        )}
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={(open) => !pending && setConfirmOpen(open)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Quitar {entry.subjectName} del {day.long.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>
              El período de {formatRange(cell.slot.startTime, cell.slot.endTime)} quedará libre. La asignatura sigue vinculada a {entry.gradeName} {entry.sectionName} y podrás volver a ubicarla cuando quieras.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full" disabled={pending}>
              Conservar
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={pending}
              onClick={(event) => {
                event.preventDefault();
                void remove();
              }}
            >
              {pending && <Loader2Icon className="size-4 animate-spin" />}
              Quitar clase
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
