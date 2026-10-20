import { useMemo, useState } from "react";
import * as DialogPrimitive from "@/modules/schedule/polymet/ui/dialog-primitive";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  CheckIcon,
  Clock4Icon,
  EyeIcon,
  Loader2Icon,
  PencilLineIcon,
  SaveIcon,
  SunriseIcon,
  XIcon,
} from "lucide-react";

import { cn } from "../ui/utils";
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
import type { SaveScheduleStructureInput, ScheduleWorkspace } from "@/modules/schedule/polymet/lib/schedule-types";
import {
  structureImpact,
  toStructureInput,
  validateDraft,
  type DraftStep,
  type ScheduleDraft,
} from "@/modules/schedule/polymet/lib/schedule-draft";
import { BuilderDaysStep } from "@/modules/schedule/polymet/components/builder-days-step";
import { BuilderJourneysStep } from "@/modules/schedule/polymet/components/builder-journeys-step";
import { BuilderPeriodsStep } from "@/modules/schedule/polymet/components/builder-periods-step";
import { BuilderReviewStep } from "@/modules/schedule/polymet/components/builder-review-step";
import { BuilderPreview } from "@/modules/schedule/polymet/components/builder-preview";

type ScheduleBuilderProps = {
  open: boolean;
  mode: "create" | "edit";
  initialDraft: ScheduleDraft;
  workspace: ScheduleWorkspace | null;
  saving: boolean;
  onSave: (input: SaveScheduleStructureInput) => Promise<{ ok: boolean; message?: string }>;
  onClose: () => void;
};

const STEPS: Array<{ id: DraftStep; label: string; icon: typeof CalendarDaysIcon }> = [
  { id: "days", label: "Días", icon: CalendarDaysIcon },
  { id: "journeys", label: "Jornadas", icon: SunriseIcon },
  { id: "periods", label: "Períodos", icon: Clock4Icon },
  { id: "review", label: "Guardar", icon: SaveIcon },
];

/**
 * Estudio de estructura: configuración progresiva a la izquierda y la semana
 * resultante a la derecha, actualizada en cada cambio.
 */
export function ScheduleBuilder({ open, mode, initialDraft, workspace, saving, onSave, onClose }: ScheduleBuilderProps) {
  const [draft, setDraft] = useState<ScheduleDraft>(initialDraft);
  const [step, setStep] = useState<DraftStep>(mode === "edit" ? "periods" : "days");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [pane, setPane] = useState<"edit" | "preview">("edit");

  const initialSnapshot = useMemo(() => JSON.stringify(initialDraft), [initialDraft]);
  const dirty = JSON.stringify(draft) !== initialSnapshot;
  const issues = useMemo(() => validateDraft(draft), [draft]);
  const input = useMemo(() => toStructureInput(draft, workspace?.timeSlots ?? []), [draft, workspace]);
  const impact = useMemo(() => (mode === "edit" ? structureImpact(input, workspace) : null), [input, mode, workspace]);

  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const errorsIn = (id: DraftStep) => issues.filter((i) => i.level === "error" && i.step === id).length;
  const reachable = (index: number) => STEPS.slice(0, index).every((s) => s.id === "review" || errorsIn(s.id) === 0);
  const canAdvance = errorsIn(step) === 0;
  const totalErrors = issues.filter((i) => i.level === "error").length;

  const update = (updater: (d: ScheduleDraft) => ScheduleDraft) => {
    setSaveError(null);
    setDraft((d) => updater(d));
  };

  const requestClose = () => {
    if (saving) return;
    if (dirty) setConfirmDiscard(true);
    else onClose();
  };

  const goTo = (id: DraftStep) => {
    setStep(id);
    setPane("edit");
  };

  const save = async () => {
    setSaveError(null);
    const result = await onSave(input);
    if (!result.ok) setSaveError(result.message ?? "No pudimos guardar el horario.");
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && requestClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/25 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-0 z-50 flex flex-col overflow-hidden bg-background shadow-2xl outline-none sm:inset-3 sm:rounded-[2rem] lg:inset-5",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4 duration-300",
          )}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
            requestClose();
          }}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          {/* Encabezado */}
          <header className="flex items-center gap-4 border-b border-border bg-card px-4 py-3 sm:px-6 lg:px-8">
            <span className="hidden size-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground sm:flex">
              {mode === "edit" ? <PencilLineIcon className="size-[18px]" /> : <CalendarDaysIcon className="size-[18px]" />}
            </span>
            <div className="min-w-0 flex-1 lg:flex-none">
              <DialogPrimitive.Title className="truncate text-base font-semibold text-foreground sm:text-lg">
                {mode === "edit" ? "Editar estructura" : "Nuevo horario"}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="truncate text-xs text-muted-foreground">
                {mode === "edit" ? "Los cambios se aplican al guardar" : "Paso " + (stepIndex + 1) + " de 4"}
              </DialogPrimitive.Description>
            </div>

            <nav aria-label="Pasos del constructor" className="mx-auto hidden md:block">
              <ol className="flex items-center gap-1">
                {STEPS.map((s, i) => {
                  const active = s.id === step;
                  const done = i < stepIndex && errorsIn(s.id) === 0;
                  const enabled = reachable(i) && !saving;
                  return (
                    <li key={s.id} className="flex items-center gap-1">
                      {i > 0 && <span className={cn("h-px w-6 lg:w-10", i <= stepIndex ? "bg-primary/50" : "bg-border")} aria-hidden />}
                      <button
                        type="button"
                        onClick={() => enabled && goTo(s.id)}
                        disabled={!enabled}
                        aria-current={active ? "step" : undefined}
                        className={cn(
                          "flex h-10 items-center gap-2 rounded-full pl-1.5 pr-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:hover:text-muted-foreground",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-7 items-center justify-center rounded-full text-xs font-semibold",
                            active ? "bg-primary text-primary-foreground" : done ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                            errorsIn(s.id) > 0 && !active && i < stepIndex && "bg-destructive/15 text-destructive",
                          )}
                        >
                          {done ? <CheckIcon className="size-3.5" strokeWidth={3} /> : i + 1}
                        </span>
                        {s.label}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>

            <button
              type="button"
              onClick={requestClose}
              disabled={saving}
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              aria-label="Cerrar constructor"
            >
              <XIcon className="size-5" />
            </button>
          </header>

          {/* Progreso móvil */}
          <div className="flex gap-1 bg-card px-4 pb-3 md:hidden" aria-hidden>
            {STEPS.map((s, i) => (
              <span key={s.id} className={cn("h-1 flex-1 rounded-full transition-colors", i <= stepIndex ? "bg-primary" : "bg-muted")} />
            ))}
          </div>

          {/* Cuerpo */}
          <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,540px)_minmax(0,1fr)]">
            <div className={cn("min-h-0 overflow-y-auto bg-card px-4 py-6 sm:px-6 lg:px-8 lg:py-8", pane === "preview" && "hidden lg:block")}>
              <div key={step} className="mx-auto max-w-xl animate-in fade-in slide-in-from-bottom-2 duration-300 motion-reduce:animate-none">
                {step === "days" && <BuilderDaysStep draft={draft} onChange={update} />}
                {step === "journeys" && <BuilderJourneysStep draft={draft} issues={issues} onChange={update} />}
                {step === "periods" && <BuilderPeriodsStep draft={draft} issues={issues} onChange={update} />}
                {step === "review" && <BuilderReviewStep draft={draft} issues={issues} impact={impact} saveError={saveError} onGoTo={goTo} />}
              </div>
            </div>
            <div className={cn("min-h-0 bg-background p-4 sm:p-6 lg:block lg:p-8", pane === "edit" ? "hidden" : "block")}>
              <BuilderPreview draft={draft} />
            </div>
          </div>

          {/* Pie */}
          <footer className="flex items-center gap-2 border-t border-border bg-card px-4 py-3 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              className="h-11 rounded-full px-4"
              onClick={() => (stepIndex === 0 ? requestClose() : goTo(STEPS[stepIndex - 1].id))}
              disabled={saving}
            >
              <ArrowLeftIcon className="size-4" />
              <span className="hidden sm:inline">{stepIndex === 0 ? "Cancelar" : "Atrás"}</span>
            </Button>

            <Button
              variant="outline"
              className="h-11 rounded-full bg-card px-4 lg:hidden"
              onClick={() => setPane((p) => (p === "edit" ? "preview" : "edit"))}
              aria-pressed={pane === "preview"}
            >
              <EyeIcon className="size-4" />
              {pane === "edit" ? "Vista previa" : "Seguir editando"}
            </Button>

            <div className="ml-auto flex items-center gap-3">
              {step === "review" && totalErrors > 0 && (
                <span className="hidden text-xs text-destructive sm:inline">
                  {totalErrors} {totalErrors === 1 ? "problema" : "problemas"} por resolver
                </span>
              )}
              {step !== "review" ? (
                <Button className="h-11 rounded-full px-5 font-semibold" disabled={!canAdvance} onClick={() => goTo(STEPS[stepIndex + 1].id)}>
                  Continuar
                  <ArrowRightIcon className="size-4" />
                </Button>
              ) : (
                <Button className="h-11 rounded-full px-5 font-semibold shadow-md shadow-primary/20" disabled={totalErrors > 0 || saving} onClick={save}>
                  {saving ? <Loader2Icon className="size-4 animate-spin" /> : <SaveIcon className="size-4" />}
                  {saving ? "Guardando…" : mode === "edit" ? "Guardar cambios" : "Guardar y asignar clases"}
                </Button>
              )}
            </div>
          </footer>

          <AlertDialog open={confirmDiscard} onOpenChange={setConfirmDiscard}>
            <AlertDialogContent className="rounded-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle>¿Descartar los cambios?</AlertDialogTitle>
                <AlertDialogDescription>Todavía no has guardado esta estructura. Si sales ahora, se perderán los ajustes que hiciste.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-full">Seguir editando</AlertDialogCancel>
                <AlertDialogAction className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={onClose}>
                  Descartar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
