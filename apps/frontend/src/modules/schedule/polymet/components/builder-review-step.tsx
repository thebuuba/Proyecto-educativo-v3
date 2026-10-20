import { AlertCircleIcon, AlertTriangleIcon, ArrowUpRightIcon, CheckCircle2Icon, InfoIcon } from "lucide-react";

import { cn } from "../ui/utils";
import { draftSummary, type DraftIssue, type DraftStep, type ScheduleDraft, type StructureImpact } from "@/modules/schedule/polymet/lib/schedule-draft";
import { formatHours } from "@/modules/schedule/polymet/lib/schedule-time";

type BuilderReviewStepProps = {
  draft: ScheduleDraft;
  issues: DraftIssue[];
  impact: StructureImpact | null;
  saveError: string | null;
  onGoTo: (step: DraftStep) => void;
};

const STEP_LABEL: Record<DraftStep, string> = { days: "Días", journeys: "Jornadas", periods: "Períodos", review: "Guardar" };

export function BuilderReviewStep({ draft, issues, impact, saveError, onGoTo }: BuilderReviewStepProps) {
  const summary = draftSummary(draft);
  const errors = issues.filter((i) => i.level === "error");
  const warnings = issues.filter((i) => i.level === "warning");
  const activeJourneys = draft.journeys.filter((j) => j.days.some((d) => draft.days.includes(d)));

  const stats = [
    { label: "Días", value: String(draft.days.length) },
    { label: activeJourneys.length === 1 ? "Jornada" : "Jornadas", value: String(activeJourneys.length) },
    { label: "Períodos de clase", value: String(summary.periods) },
    { label: "Horas lectivas", value: formatHours(summary.teachingMinutes) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-xl font-semibold tracking-tight text-foreground">Revisa y guarda</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">Al guardar, la estructura quedará disponible para asignar tus clases y para los módulos que usan tu horario.</p>
      </div>

      <dl className="grid grid-cols-2 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-muted/60 p-4">
            <dt className="text-xs text-muted-foreground">{s.label}</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{s.value}</dd>
          </div>
        ))}
      </dl>

      {impact && (impact.kept > 0 || impact.displaced > 0) && (
        <div className="flex gap-3 rounded-2xl border border-border bg-card p-4">
          <InfoIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          <div className="text-xs leading-relaxed text-foreground">
            <p className="font-medium">Efecto sobre tus clases asignadas</p>
            <ul className="mt-1.5 space-y-1 text-muted-foreground">
              {impact.kept > 0 && (
                <li>
                  Se conservan <strong className="font-semibold text-foreground">{impact.kept}</strong> {impact.kept === 1 ? "clase" : "clases"}
                  {impact.retimed > 0 && <> ({impact.retimed} con horario actualizado)</>}.
                </li>
              )}
              {impact.displaced > 0 && (
                <li className="text-amber-700 dark:text-warning">
                  {impact.displaced} {impact.displaced === 1 ? "clase quedará" : "clases quedarán"} sin período y {impact.displaced === 1 ? "aparecerá" : "aparecerán"} en «Requiere revisión».
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {errors.length === 0 && warnings.length === 0 ? (
        <div className="flex items-center gap-3 rounded-2xl bg-success/10 p-4">
          <CheckCircle2Icon className="size-5 shrink-0 text-success" aria-hidden />
          <p className="text-sm text-foreground">Todo está listo para guardar.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {[...errors, ...warnings].map((issue) => (
            <li
              key={`${issue.level}-${issue.message}`}
              className={cn(
                "flex items-start gap-3 rounded-2xl p-3.5",
                issue.level === "error" ? "bg-destructive/10" : "border border-warning/40 bg-warning/[0.08]",
              )}
            >
              {issue.level === "error" ? (
                <AlertCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
              ) : (
                <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-warning" aria-hidden />
              )}
              <p className="flex-1 text-xs leading-relaxed text-foreground">{issue.message}</p>
              <button
                type="button"
                onClick={() => onGoTo(issue.step)}
                className="inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium text-primary hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {STEP_LABEL[issue.step]} <ArrowUpRightIcon className="size-3" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      {saveError && (
        <div role="alert" className="flex gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4">
          <AlertCircleIcon className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden />
          <div>
            <p className="text-sm font-medium text-foreground">No se guardó la estructura</p>
            <p className="mt-1 text-xs leading-relaxed text-foreground/80">{saveError}</p>
            <p className="mt-1 text-xs text-muted-foreground">Tus cambios siguen aquí; puedes corregirlos o intentarlo de nuevo.</p>
          </div>
        </div>
      )}
    </div>
  );
}
