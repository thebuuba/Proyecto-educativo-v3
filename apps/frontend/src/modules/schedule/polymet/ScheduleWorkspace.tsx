import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "@/modules/schedule/polymet/ui/feedback";
import { AlertCircleIcon, Loader2Icon, LockIcon, RefreshCwIcon } from "lucide-react";

import { Button } from "@/modules/schedule/polymet/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/modules/schedule/polymet/ui/sheet";
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
import type { AssignableClassOption, SaveScheduleStructureInput, SchedulePermissions, ScheduleEntry } from "@/modules/schedule/polymet/lib/schedule-types";
import type { ScheduleDataSource } from "@/modules/schedule/polymet/lib/schedule-data-source";
import {
  buildWeekModel,
  computeNow,
  findSiblingFreeCells,
  firstFreeCell,
  type ReviewItem,
  type WeekCell,
} from "@/modules/schedule/polymet/lib/schedule-week-model";
import { columnsFromModel } from "@/modules/schedule/polymet/lib/schedule-view";
import { createEmptyDraft, draftFromWorkspace, type ScheduleDraft } from "@/modules/schedule/polymet/lib/schedule-draft";
import { dayMeta, minutesFromDate, scheduleDayFromDate, subjectAccent } from "@/modules/schedule/polymet/lib/schedule-time";
import { useScheduleWorkspace } from "@/modules/schedule/polymet/hooks/use-schedule-workspace";
import { useMediaQuery, useMinuteClock } from "@/modules/schedule/polymet/hooks/use-schedule-environment";
import { ScheduleHeader, type ScheduleView } from "@/modules/schedule/polymet/components/schedule-header";
import { SchedulePulse } from "@/modules/schedule/polymet/components/schedule-pulse";
import { WeekTimeMap } from "@/modules/schedule/polymet/components/week-time-map";
import { DayAgenda, DaySwitcher } from "@/modules/schedule/polymet/components/day-agenda";
import { ScheduleOverviewPanel } from "@/modules/schedule/polymet/components/schedule-overview-panel";
import { AssignmentPanel, type AssignmentSubmit } from "@/modules/schedule/polymet/components/assignment-panel";
import { EntryPanel } from "@/modules/schedule/polymet/components/entry-panel";
import { ScheduleBuilder } from "@/modules/schedule/polymet/components/schedule-builder";
import { ScheduleExportDialog } from "@/modules/schedule/polymet/components/schedule-export-dialog";
import {
  ScheduleEmptyState,
  ScheduleErrorState,
  ScheduleLoadingState,
  StructureReadyBanner,
} from "@/modules/schedule/polymet/components/schedule-states";

type SchedulePageProps = {
  dataSource: ScheduleDataSource;
  permissions?: SchedulePermissions;
};

type Selection = { key: string; mode: "auto" | "replace" };
type BuilderState = { open: boolean; mode: "create" | "edit"; draft: ScheduleDraft; nonce: number };

const FULL_PERMISSIONS: SchedulePermissions = { canEditStructure: true, canAssign: true };

export default function SchedulePage({ dataSource, permissions = FULL_PERMISSIONS }: SchedulePageProps) {
  const ctrl = useScheduleWorkspace(dataSource);
  const now = useMinuteClock();
  const isDesktop = useMediaQuery("(min-width: 1440px)");
  const isTabletUp = useMediaQuery("(min-width: 768px)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const model = useMemo(() => buildWeekModel(ctrl.workspace), [ctrl.workspace]);
  const today = scheduleDayFromDate(now);
  const nowMinute = minutesFromDate(now);
  const nowState = useMemo(() => computeNow(model, now), [model, now]);
  const columns = useMemo(() => columnsFromModel(model, today), [model, today]);

  const [view, setView] = useState<ScheduleView>("week");
  const effectiveView: ScheduleView = isTabletUp ? view : "day";
  const [pickedDay, setPickedDay] = useState<number | null>(null);
  const activeDay =
    pickedDay && model.days.some((d) => d.day === pickedDay)
      ? pickedDay
      : model.days.some((d) => d.day === today)
        ? today
        : model.days[0]?.day ?? null;

  const [selection, setSelection] = useState<Selection | null>(null);
  const [ghostOption, setGhostOption] = useState<AssignableClassOption | null>(null);
  const [highlightFree, setHighlightFree] = useState(false);
  const [builder, setBuilder] = useState<BuilderState>({ open: false, mode: "create", draft: createEmptyDraft(), nonce: 0 });
  const [resetOpen, setResetOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [orphan, setOrphan] = useState<ReviewItem | null>(null);
  const [orphanError, setOrphanError] = useState<string | null>(null);
  const [relocating, setRelocating] = useState<ScheduleEntry | null>(null);
  const reviewRef = useRef<HTMLDivElement>(null);
  const assigningRef = useRef(false);
  const [assigningCell, setAssigningCell] = useState<WeekCell | null>(null);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);
  const removingOrphanRef = useRef(false);
  const [removingOrphan, setRemovingOrphan] = useState(false);

  const selectedCell: WeekCell | null = selection ? model.cells.get(selection.key) ?? null : null;
  const freeCells = model.totals.freePeriods;

  /* ───────── Navegación ───────── */

  const revealCell = useCallback(
    (key: string) => {
      requestAnimationFrame(() => {
        const el = document.querySelector<HTMLElement>(`[data-block-key="${CSS.escape(key)}"]`);
        el?.scrollIntoView({ block: "center", inline: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
        el?.focus({ preventScroll: true });
      });
    },
    [reduceMotion],
  );

  const openCell = useCallback(
    (key: string, mode: Selection["mode"] = "auto") => {
      if (assigningRef.current) return;
      const cell = model.cells.get(key);
      if (!cell) return;
      if (cell.kind !== 'free') setRelocating(null);
      setSelection({ key, mode });
      setGhostOption(null);
      setPickedDay(cell.day);
      revealCell(key);
    },
    [model, revealCell],
  );

  const closeSelection = () => {
    if (assigningRef.current) return;
    setSelection(null);
    setGhostOption(null);
    setRelocating(null);
  };

  const assignNext = () => {
    const cell = firstFreeCell(model, today);
    if (cell) openCell(cell.key);
  };

  const showReview = () => {
    closeSelection();
    requestAnimationFrame(() => {
      reviewRef.current?.scrollIntoView({ block: "start", behavior: reduceMotion ? "auto" : "smooth" });
      reviewRef.current?.focus({ preventScroll: true });
    });
  };

  const openBuilder = (mode: BuilderState["mode"]) => {
    if (assigningRef.current) return;
    closeSelection();
    setBuilder((b) => ({
      open: true,
      mode,
      draft: mode === "edit" ? draftFromWorkspace(ctrl.workspace) : createEmptyDraft(),
      nonce: b.nonce + 1,
    }));
  };

  /* ───────── Mutaciones (siempre confirmadas por el servidor) ───────── */

  const handleAssign = async ({ option, room, extraCells }: AssignmentSubmit) => {
    if (assigningRef.current) return { ok: false, message: "Espera a que termine la asignación." };
    if (!selectedCell) return { ok: false, message: "El período ya no está disponible. Actualiza el horario." };
    const schoolYearId = ctrl.workspace?.currentSchoolYear?.id;
    if (!schoolYearId) return { ok: false, message: "No hay un año escolar activo. Pide a coordinación que lo active para asignar clases." };
    if (relocating) {
      const result = await ctrl.replace(selectedCell.key, relocating.id, { timeSlotId: selectedCell.slot.id, dayOfWeek: selectedCell.day, sectionSubjectId: option.sectionSubjectId, sectionId: option.sectionId, room });
      if (result.ok) { toast.success('Clase reubicada'); closeSelection(); }
      return result;
    }

    assigningRef.current = true;
    setAssigningCell(selectedCell);
    setAssignmentError(null);
    try {
      const targets = [selectedCell, ...extraCells];
      const succeeded: WeekCell[] = [];
      const failed: Array<{ cell: WeekCell; message: string }> = [];
      for (const target of targets) {
        const result = await ctrl.assign(target.key, {
          schoolYearId,
          sectionSubjectId: option.sectionSubjectId,
          sectionId: option.sectionId,
          timeSlotId: target.slot.id,
          dayOfWeek: target.day,
          room,
        });
        if (result.ok) succeeded.push(target);
        else failed.push({ cell: target, message: result.message });
      }

      assigningRef.current = false;
      const label = `${option.subjectName} · ${option.gradeName} ${option.sectionName}`;
      if (failed.length === 0) {
        toast.success(`${label} asignada`, {
          description: succeeded.map((c) => dayMeta(c.day).long).join(", ") + ` · ${selectedCell.slot.startTime}`,
        });
        closeSelection();
        return { ok: true };
      }
      if (succeeded.length > 0) {
        toast.warning(`${label} se asignó en ${succeeded.length} de ${targets.length} días`);
        closeSelection();
        setAssignmentError(failed.map((f) => `${dayMeta(f.cell.day).long}: ${f.message}`).join(" "));
      }
      return {
        ok: false,
        message: failed.map((f) => `${dayMeta(f.cell.day).long}: ${f.message}`).join(" "),
      };
    } finally {
      assigningRef.current = false;
      setAssigningCell(null);
    }
  };

  const handleReplace = async ({ option, room }: AssignmentSubmit) => {
    const entry = selectedCell?.entry;
    if (!selectedCell || !entry) return { ok: false, message: "La clase ya no existe. Actualiza el horario." };
    const result = await ctrl.replace(selectedCell.key, entry.id, { sectionSubjectId: option.sectionSubjectId, sectionId: option.sectionId, room });
    if (!result.ok) return result;
    toast.success("Clase actualizada", { description: `${option.subjectName} · ${option.gradeName} ${option.sectionName}` });
    setSelection({ key: selectedCell.key, mode: "auto" });
    setGhostOption(null);
    return { ok: true };
  };

  const handleRemove = async () => {
    const entry = selectedCell?.entry;
    if (!selectedCell || !entry) return { ok: false, message: "La clase ya no existe." };
    const result = await ctrl.unassign(selectedCell.key, entry.id);
    if (!result.ok) return result;
    toast.success("Clase quitada del horario", { description: `${entry.subjectName} · ${dayMeta(selectedCell.day).long}` });
    closeSelection();
    return { ok: true };
  };

  const handleRemoveOrphan = async () => {
    if (!orphan || removingOrphanRef.current) return;
    removingOrphanRef.current = true;
    setRemovingOrphan(true);
    setOrphanError(null);
    try {
      for (const id of orphan.entryIds) {
        const result = await ctrl.unassign(`orphan:${id}`, id);
        if (!result.ok) {
          setOrphanError(result.message);
          return;
        }
        setOrphan(current => current ? { ...current, entryIds: current.entryIds.filter(entryId => entryId !== id) } : null);
      }
      toast.success("Clase quitada", { description: orphan.title });
      setOrphan(null);
    } finally {
      removingOrphanRef.current = false;
      setRemovingOrphan(false);
    }
  };

  const handleSaveStructure = async (input: SaveScheduleStructureInput) => {
    const result = await ctrl.saveStructure(input);
    if (!result.ok) return result;
    const wasCreate = builder.mode === "create";
    setBuilder((b) => ({ ...b, open: false }));
    toast.success(wasCreate ? "Horario creado" : "Estructura actualizada", {
      description: wasCreate ? "Ahora ubica tus asignaturas en los períodos libres." : "Tus clases se mantienen en sus períodos.",
    });
    if (wasCreate) setHighlightFree(true);
    return { ok: true };
  };

  const handleReset = async () => {
    setResetError(null);
    setResetOpen(false);
    openBuilder("create");
  };

  /* ───────── Inspector ───────── */

  const ghost =
    ghostOption && selectedCell
      ? {
          name: ghostOption.subjectName,
          detail: `${ghostOption.gradeName} ${ghostOption.sectionName} · ${ghostOption.academicLevelName}`,
          accent: subjectAccent(ghostOption.subjectName, ghostOption.appearanceColor),
        }
      : null;

  const liveCell = selectedCell;
  const inspectorBody = (() => {
    const inspectorCell = assigningCell ?? liveCell;
    if (!inspectorCell) return null;
    const selectedCell = inspectorCell;
    const pending = Boolean(assigningCell) || ctrl.pending.has(selectedCell.key);
    const wantsPicker = Boolean(assigningCell) || selectedCell.kind === "free" || (selection?.mode === "replace" && selectedCell.entry);
    if (wantsPicker && !permissions.canAssign) {
      return (
        <div className="flex flex-col items-start gap-3">
          <h2 className="text-lg font-semibold text-foreground">{selectedCell.slot.name} libre</h2>
          <p className="flex items-start gap-2 rounded-2xl bg-muted/70 p-4 text-xs leading-relaxed text-muted-foreground">
            <LockIcon className="mt-0.5 size-3.5 shrink-0" aria-hidden /> No tienes permiso para asignar clases en este horario.
          </p>
        </div>
      );
    }
    if (wantsPicker) {
      const mode = selectedCell.kind === "free" ? "assign" : "replace";
      return (
        <AssignmentPanel
          key={`${selectedCell.key}:${mode}`}
          cell={relocating ? { ...selectedCell, entry: relocating } : selectedCell}
          mode={mode}
          initialEntry={relocating}
          options={ctrl.assignables}
          optionsError={ctrl.assignablesError}
          entries={ctrl.workspace?.entries.filter(entry => !entry.needsPlacement) ?? []}
          siblings={mode === "assign" && !relocating ? findSiblingFreeCells(model, selectedCell) : []}
          pending={pending}
          onRetryOptions={ctrl.reloadAssignables}
          onPreview={setGhostOption}
          onSubmit={mode === "assign" ? handleAssign : handleReplace}
          onCancel={() => (mode === "replace" ? setSelection({ key: selectedCell.key, mode: "auto" }) : closeSelection())}
        />
      );
    }
    if (selectedCell.entry) {
      return (
        <EntryPanel
          key={selectedCell.entry.id}
          cell={selectedCell}
          canAssign={permissions.canAssign}
          pending={pending}
          onReplace={() => setSelection({ key: selectedCell.key, mode: "replace" })}
          onRemove={handleRemove}
        />
      );
    }
    return null;
  })();

  const overview = (
    <ScheduleOverviewPanel
      model={model}
      today={today}
      nowMinute={nowMinute}
      canAssign={permissions.canAssign}
      reviewRef={reviewRef}
      onOpenCell={(key) => openCell(key)}
      onRemoveOrphan={(item) => {
        setOrphanError(null);
        setOrphan(item);
      }}
      onPlaceOrphan={(item) => {
        const entry = ctrl.workspace?.entries.find(entry => item.entryIds.includes(entry.id));
        const target = firstFreeCell(model);
        if (!entry || !target) { toast.warning('Añade un período libre para reubicar esta clase.'); return; }
        setRelocating(entry);
        openCell(target.key);
      }}
    />
  );

  /* ───────── Render ───────── */

  if (ctrl.status === "loading") return <ScheduleLoadingState />;
  if (!ctrl.workspace) {
    return <ScheduleErrorState message={ctrl.error ?? "No pudimos cargar tu horario."} retrying={ctrl.refreshing} onRetry={() => void ctrl.reload()} />;
  }

  const span = model.rangeEnd - model.rangeStart;
  const ppm = Math.min(1.75, Math.max(1.25, 860 / Math.max(span, 60)));
  const activeColumn = columns.find((c) => c.day === activeDay) ?? null;

  const builderNode = builder.open && (
    <ScheduleBuilder
      key={builder.nonce}
      open
      mode={builder.mode}
      initialDraft={builder.draft}
      workspace={ctrl.workspace}
      saving={ctrl.pending.has("structure")}
      onSave={handleSaveStructure}
      onClose={() => setBuilder((b) => ({ ...b, open: false }))}
    />
  );

  return (
    <div className="flex flex-col gap-5">
      <ScheduleHeader
        schoolYearName={ctrl.workspace.currentSchoolYear ? `Año escolar ${ctrl.workspace.currentSchoolYear.name.replace(/^Año escolar\s*/i, '')}` : null}
        view={effectiveView}
        onViewChange={setView}
        showViewToggle={isTabletUp}
        permissions={permissions}
        hasStructure={model.hasStructure}
        freeCount={freeCells}
        refreshing={ctrl.refreshing}
        onAssignNext={assignNext}
        onEditStructure={() => openBuilder("edit")}
        onReset={() => {
          if (assigningRef.current) return;
          setResetError(null);
          setResetOpen(true);
        }}
        onRefresh={() => void ctrl.reload()}
        onExport={() => setExportOpen(true)}
      />

      {assignmentError && (
        <div role="alert" className="flex flex-col gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 sm:flex-row sm:items-center">
          <AlertCircleIcon className="size-5 shrink-0 text-destructive" aria-hidden />
          <p className="flex-1 text-sm text-foreground">{assignmentError}</p>
          <Button variant="outline" className="h-10 rounded-full bg-card" onClick={() => setAssignmentError(null)}>Cerrar aviso</Button>
        </div>
      )}

      {ctrl.error && (
        <div role="alert" className="flex flex-col gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 sm:flex-row sm:items-center">
          <AlertCircleIcon className="size-5 shrink-0 text-destructive" aria-hidden />
          <p className="flex-1 text-sm text-foreground">
            {ctrl.error} <span className="text-muted-foreground">Mostramos la última versión cargada.</span>
          </p>
          <Button variant="outline" className="h-10 rounded-full bg-card" onClick={() => void ctrl.reload()} disabled={ctrl.refreshing}>
            {ctrl.refreshing ? <Loader2Icon className="size-4 animate-spin" /> : <RefreshCwIcon className="size-4" />} Reintentar
          </Button>
        </div>
      )}

      {!model.hasStructure ? (
        <><ScheduleEmptyState canEditStructure={permissions.canEditStructure} onCreate={() => openBuilder("create")} />{model.review.length > 0 && <section className="rounded-3xl bg-card p-5 shadow-sm">{overview}</section>}</>
      ) : (
        <>
          {model.totals.classes === 0 ? (
            <StructureReadyBanner freePeriods={freeCells} canAssign={permissions.canAssign} onStart={assignNext} />
          ) : (
            <SchedulePulse
              now={nowState}
              totals={model.totals}
              highlightFree={highlightFree}
              onToggleFree={() => setHighlightFree((v) => !v)}
              onShowReview={showReview}
              onOpenCell={(key) => openCell(key)}
            />
          )}

          <div className="grid items-start gap-5 min-[1440px]:grid-cols-[minmax(0,1fr)_340px]">
            <section aria-label="Horario" className="min-w-0">
              {effectiveView === "week" ? (
                <div className="relative overflow-x-auto rounded-3xl bg-card p-3 shadow-sm sm:p-5">
                  {ctrl.refreshing && (
                    <span className="absolute right-5 top-5 z-20 flex items-center gap-1.5 rounded-full bg-card px-2.5 py-1 text-[11px] text-muted-foreground shadow-xs">
                      <Loader2Icon className="size-3 animate-spin" aria-hidden /> Sincronizando
                    </span>
                  )}
                  <WeekTimeMap
                    columns={columns}
                    rangeStart={model.rangeStart}
                    rangeEnd={model.rangeEnd}
                    pxPerMinute={ppm}
                    selectedKey={selection?.key ?? null}
                    highlightFree={highlightFree}
                    pendingKeys={ctrl.pending}
                    ghost={ghost}
                    nowMinute={nowMinute}
                    onSelectBlock={(key) => openCell(key)}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="sticky top-16 z-10 -mx-1 bg-background/85 px-1 py-1 backdrop-blur-md">
                    <DaySwitcher columns={columns} activeDay={activeDay} onChange={setPickedDay} />
                  </div>
                  <div className="rounded-3xl bg-card p-3 shadow-sm sm:p-5">
                    <div className="mb-4 flex items-baseline justify-between px-1">
                      <h2 className="text-base font-semibold text-foreground">
                        {activeColumn?.label}
                        {activeColumn?.isToday && <span className="ml-2 text-xs font-medium text-primary">Hoy</span>}
                      </h2>
                      <span className="text-xs text-muted-foreground">{activeColumn?.caption}</span>
                    </div>
                    <DayAgenda
                      column={activeColumn}
                      selectedKey={selection?.key ?? null}
                      highlightFree={highlightFree}
                      pendingKeys={ctrl.pending}
                      ghost={ghost}
                      nowMinute={nowMinute}
                      onSelectBlock={(key) => openCell(key)}
                    />
                  </div>
                </div>
              )}
            </section>

            {isDesktop ? (
              <aside aria-label="Panel contextual" className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-3xl bg-card p-5 shadow-sm">
                {inspectorBody ? (
                  <div className="flex min-h-[520px] flex-col animate-in fade-in slide-in-from-right-2 duration-200 motion-reduce:animate-none">
                    <button type="button" onClick={closeSelection} disabled={Boolean(assigningCell)} className="mb-4 self-start rounded-full px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      ← Volver al resumen
                    </button>
                    {inspectorBody}
                  </div>
                ) : (
                  overview
                )}
              </aside>
            ) : (
              <section aria-label="Resumen" className="rounded-3xl bg-card p-5 shadow-sm">
                {overview}
              </section>
            )}
          </div>
        </>
      )}

      {!isDesktop && (
        <Sheet open={Boolean(inspectorBody)} onOpenChange={(open) => !open && closeSelection()}>
          <SheetContent
            side={isTabletUp ? "right" : "bottom"}
            className={isTabletUp ? "flex w-[420px] flex-col overflow-y-auto border-l-0 bg-card p-6 sm:max-w-[420px]" : "flex max-h-[90dvh] flex-col overflow-y-auto rounded-t-[2rem] border-t-0 bg-card px-5 pb-6 pt-8"}
          >
            {!isTabletUp && <span className="absolute left-1/2 top-3 h-1 w-10 -translate-x-1/2 rounded-full bg-border" aria-hidden />}
            <SheetHeader className="sr-only">
              <SheetTitle>{selectedCell ? `${dayMeta(selectedCell.day).long}, ${selectedCell.slot.name}` : "Período"}</SheetTitle>
              <SheetDescription>Detalle y acciones del período seleccionado</SheetDescription>
            </SheetHeader>
            {inspectorBody}
          </SheetContent>
        </Sheet>
      )}

      {builderNode}

      {model.hasStructure && (
        <ScheduleExportDialog
          open={exportOpen}
          onOpenChange={setExportOpen}
          columns={columns}
          schoolYearName={ctrl.workspace.currentSchoolYear?.name ?? null}
          teacherName={ctrl.workspace.entries[0]?.teacherName ?? null}
          defaultDay={activeDay}
        />
      )}

      <AlertDialog open={resetOpen} onOpenChange={(open) => !ctrl.pending.has("reset") && setResetOpen(open)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Crear un horario nuevo?</AlertDialogTitle>
            <AlertDialogDescription>
              Definirás una nueva estructura para tu semana. Las clases que pierdan su período se conservarán en Requiere revisión para que puedas reubicarlas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {resetError && (
            <p role="alert" className="rounded-2xl bg-destructive/10 p-3 text-xs text-foreground">
              {resetError}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full" disabled={ctrl.pending.has("reset")}>
              Conservar mi horario
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={ctrl.pending.has("reset")}
              onClick={(e) => {
                e.preventDefault();
                void handleReset();
              }}
            >
              {ctrl.pending.has("reset") && <Loader2Icon className="size-4 animate-spin" />}
              Crear nueva estructura
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={Boolean(orphan)} onOpenChange={(open) => !open && !removingOrphanRef.current && setOrphan(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Quitar esta clase?</AlertDialogTitle>
            <AlertDialogDescription>{orphan?.message} Podrás volver a asignarla en un período libre.</AlertDialogDescription>
          </AlertDialogHeader>
          {orphanError && (
            <p role="alert" className="rounded-2xl bg-destructive/10 p-3 text-xs text-foreground">
              {orphanError}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full" disabled={removingOrphan}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={removingOrphan}
              onClick={(e) => {
                e.preventDefault();
                void handleRemoveOrphan();
              }}
            >
              Quitar clase
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
