import { useEffect, useMemo, useState } from "react";
import { toast } from "@/modules/schedule/polymet/ui/feedback";
import { AlertCircleIcon, CalendarDaysIcon, CalendarRangeIcon, DownloadIcon, FileTextIcon, ImageIcon, Loader2Icon } from "lucide-react";

import { cn } from "../ui/utils";
import { Button } from "@/modules/schedule/polymet/ui/button";
import { Label } from "@/modules/schedule/polymet/ui/label";
import { Switch } from "@/modules/schedule/polymet/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/modules/schedule/polymet/ui/dialog";
import type { TimeMapColumn } from "@/modules/schedule/polymet/lib/schedule-view";
import { exportFilename, exportSchedule, renderScheduleSheet, type ExportFormat, type ExportOptions } from "@/modules/schedule/polymet/lib/schedule-export";

type ScheduleExportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: TimeMapColumn[];
  schoolYearName: string | null;
  teacherName: string | null;
  defaultDay: number | null;
};

const FORMATS: Array<{ value: ExportFormat; label: string; hint: string; icon: typeof FileTextIcon }> = [
  { value: "pdf", label: "PDF", hint: "Hoja A4 lista para imprimir", icon: FileTextIcon },
  { value: "png", label: "Imagen PNG", hint: "Para compartir o fijar", icon: ImageIcon },
];

function OptionCard({ active, onClick, icon: Icon, label, hint }: { active: boolean; onClick: () => void; icon: typeof FileTextIcon; label: string; hint: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "flex min-h-[64px] items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active ? "border-primary bg-accent" : "border-border bg-card hover:bg-muted/70",
      )}
    >
      <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
        <Icon className="size-[18px]" strokeWidth={1.9} aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-foreground">{label}</span>
        <span className="block truncate text-[11.5px] text-muted-foreground">{hint}</span>
      </span>
    </button>
  );
}

/** Exporta el horario como PDF o PNG con vista previa exacta del archivo. */
export function ScheduleExportDialog({ open, onOpenChange, columns, schoolYearName, teacherName, defaultDay }: ScheduleExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>("pdf");
  const [scope, setScope] = useState<"week" | "day">("week");
  const [pickedDay, setPickedDay] = useState<number | null>(null);
  const [includeFree, setIncludeFree] = useState(false);
  const [includeRooms, setIncludeRooms] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const day = pickedDay && columns.some((c) => c.day === pickedDay) ? pickedDay : defaultDay && columns.some((c) => c.day === defaultDay) ? defaultDay : columns[0]?.day ?? null;
  const dayColumn = columns.find((c) => c.day === day) ?? null;

  const options = useMemo<ExportOptions>(() => {
    const exportColumns = (scope === "week" ? columns : dayColumn ? [dayColumn] : []).map((c) => ({ ...c, isToday: false }));
    return {
      columns: exportColumns,
      title: scope === "week" ? "Horario docente" : `Horario del ${dayColumn?.label.toLowerCase() ?? "día"}`,
      subtitle: [teacherName, schoolYearName].filter(Boolean).join(" · ") || "AulaBase",
      includeFree,
      includeRooms,
      orientation: scope === "week" ? "landscape" : "portrait",
    };
  }, [columns, dayColumn, includeFree, includeRooms, schoolYearName, scope, teacherName]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    renderScheduleSheet(options, 0.55)
      .then((canvas) => !cancelled && setPreview(canvas.toDataURL("image/png")))
      .catch(() => !cancelled && setPreview(null));
    return () => {
      cancelled = true;
    };
  }, [open, options]);

  const scopeLabel = scope === "week" ? "semana" : dayColumn?.label ?? "dia";

  const handleExport = async () => {
    setError(null);
    setExporting(true);
    try {
      const filename = exportFilename(scopeLabel, format);
      await exportSchedule(options, format, filename);
      toast.success(format === "pdf" ? "PDF descargado" : "Imagen descargada", { description: filename });
      onOpenChange(false);
    } catch {
      setError("No pudimos generar el archivo en este navegador. Inténtalo de nuevo o prueba con el otro formato.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !exporting && onOpenChange(next)}>
      <DialogContent className="max-h-[92dvh] w-[calc(100vw-1.5rem)] max-w-4xl gap-0 overflow-y-auto rounded-[2rem] border-0 p-0 sm:rounded-[2rem]">
        <div className="grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          {/* Vista previa */}
          <div className="flex items-center justify-center bg-muted/60 p-5 sm:p-8">
            <div className={cn("w-full overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-foreground/5 transition-all duration-300", options.orientation === "landscape" ? "aspect-[1.414/1]" : "mx-auto aspect-[1/1.414] max-w-[260px]")}>
              {preview ? (
                <img src={preview} alt={`Vista previa del archivo: ${options.title}`} className="size-full object-contain animate-in fade-in duration-300" />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <Loader2Icon className="size-5 animate-spin text-muted-foreground" aria-label="Generando vista previa" />
                </div>
              )}
            </div>
          </div>

          {/* Opciones */}
          <div className="flex flex-col p-5 sm:p-7">
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="text-lg font-semibold">Exportar horario</DialogTitle>
              <DialogDescription className="text-xs">El archivo se genera con los datos actuales de tu horario.</DialogDescription>
            </DialogHeader>

            <div className="mt-6 grid gap-2">
              <span className="text-xs font-medium text-muted-foreground" id="export-format">
                Formato
              </span>
              <div role="radiogroup" aria-labelledby="export-format" className="grid grid-cols-2 gap-2">
                {FORMATS.map((f) => (
                  <OptionCard key={f.value} active={format === f.value} onClick={() => setFormat(f.value)} icon={f.icon} label={f.label} hint={f.hint} />
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-2">
              <span className="text-xs font-medium text-muted-foreground" id="export-scope">
                Contenido
              </span>
              <div role="radiogroup" aria-labelledby="export-scope" className="grid grid-cols-2 gap-2">
                <OptionCard active={scope === "week"} onClick={() => setScope("week")} icon={CalendarRangeIcon} label="Semana" hint={`${columns.length} días · horizontal`} />
                <OptionCard active={scope === "day"} onClick={() => setScope("day")} icon={CalendarDaysIcon} label="Un día" hint="Vertical" />
              </div>
              {scope === "day" && (
                <div role="radiogroup" aria-label="Día a exportar" className="mt-1 flex flex-wrap gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                  {columns.map((c) => (
                    <button
                      key={c.day}
                      type="button"
                      role="radio"
                      aria-checked={c.day === day}
                      onClick={() => setPickedDay(c.day)}
                      className={cn(
                        "h-9 min-w-[52px] rounded-full px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        c.day === day ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-accent",
                      )}
                    >
                      {c.shortLabel}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 divide-y divide-border rounded-2xl border border-border">
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <Label htmlFor="export-free" className="text-sm font-normal">
                  Mostrar períodos libres
                </Label>
                <Switch id="export-free" checked={includeFree} onCheckedChange={setIncludeFree} />
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <Label htmlFor="export-rooms" className="text-sm font-normal">
                  Incluir aulas
                </Label>
                <Switch id="export-rooms" checked={includeRooms} onCheckedChange={setIncludeRooms} />
              </div>
            </div>

            {error && (
              <div role="alert" className="mt-4 flex gap-2.5 rounded-2xl bg-destructive/10 p-3">
                <AlertCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
                <p className="text-xs leading-relaxed text-foreground">{error}</p>
              </div>
            )}

            <div className="mt-6 flex items-center gap-2 pt-1 md:mt-auto">
              <Button variant="ghost" className="h-11 rounded-full px-4" onClick={() => onOpenChange(false)} disabled={exporting}>
                Cancelar
              </Button>
              <Button className="h-11 flex-1 rounded-full font-semibold" onClick={handleExport} disabled={exporting || options.columns.length === 0}>
                {exporting ? <Loader2Icon className="size-4 animate-spin" /> : <DownloadIcon className="size-4" />}
                {exporting ? "Generando…" : format === "pdf" ? "Descargar PDF" : "Descargar imagen"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
