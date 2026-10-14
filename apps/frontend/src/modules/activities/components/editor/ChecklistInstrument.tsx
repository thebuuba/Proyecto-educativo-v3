import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Input } from '@/components/ui/Input'
import { blockAccents } from '@/modules/activities/components/editor/editorPresentation'
import {
  distributeScore,
  formatInstrumentNumber,
  instrumentFieldKey,
  InstrumentInput,
  InstrumentRowMenu,
  InstrumentSettingsDrawer,
  InstrumentTable,
  InstrumentTextarea,
  ToggleControl,
} from '@/modules/activities/components/editor/instrumentEditorShared'
import { cn } from '@/utils/cn'
import {
  CheckCircle2,
  CircleDot,
  ClipboardList,
  Grid3X3,
  PenLine,
  Plus,
  Settings,
  Target,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import {
  duplicateInstrumentRow,
  rebalanceInstrumentRows,
  shiftInstrumentRows,
  swapInstrumentRows,
} from './instrumentEditorShared'

export const checklistResponsePresets = [
  { id: 'yes-no', positive: 'Sí', negative: 'No' },
  { id: 'compliance', positive: 'Cumple', negative: 'No cumple' },
  { id: 'achievement', positive: 'Logrado', negative: 'No logrado' },
  { id: 'correctness', positive: 'Correcto', negative: 'Incorrecto' },
  { id: 'completion', positive: 'Realizado', negative: 'No realizado' },
] as const

export type ChecklistLabelMode = (typeof checklistResponsePresets)[number]['id'] | 'custom'

export function checklistLabelMode(positive: string, negative: string): ChecklistLabelMode {
  return (
    checklistResponsePresets.find(
      (preset) => preset.positive === positive && preset.negative === negative,
    )?.id ?? 'custom'
  )
}

export function ChecklistInstrument({
  accent,
  addingCriterion,
  onCompleteCriterion,
  completingCriterionId,
  criterionRequestBusy = false,
  criteriaCount,
  fields,
  maxScore,
  onFieldChange,
  onAddCriterion,
  onCriteriaCountChange,
  onFieldsChange,
  typographyControls,
}: {
  accent: (typeof blockAccents)[number]
  addingCriterion: boolean
  onCompleteCriterion?: (row: number) => void
  completingCriterionId?: string | null
  criterionRequestBusy?: boolean
  criteriaCount: number
  fields: Record<string, string>
  maxScore: number
  onFieldChange: (key: string, value: string) => void
  onAddCriterion: () => void
  onCriteriaCountChange: (value: number) => void
  onFieldsChange: (fields: Record<string, string>) => void
  typographyControls: ReactNode
}) {
  const scorePending = maxScore <= 0
  const total = Number(
    Array.from({ length: criteriaCount }, (_, index) =>
      Number(fields[instrumentFieldKey('lista-cotejo', 'points', index)] || 0),
    )
      .reduce((sum, value) => sum + value, 0)
      .toFixed(2),
  )
  const [configuring, setConfiguring] = useState(false)
  const [draftNoApply, setDraftNoApply] = useState(fields['lista-cotejo:meta:noApply'] === 'true')
  const [draftUniformPoints, setDraftUniformPoints] = useState(
    fields['lista-cotejo:meta:pointsMode'] !== 'individual',
  )
  const [draftLabels, setDraftLabels] = useState({
    yes: fields['lista-cotejo:meta:yesLabel'] || 'Sí',
    no: fields['lista-cotejo:meta:noLabel'] || 'No',
    na: fields['lista-cotejo:meta:naLabel'] || 'No aplica',
  })
  const [draftLabelMode, setDraftLabelMode] = useState<ChecklistLabelMode>(() =>
    checklistLabelMode(
      fields['lista-cotejo:meta:yesLabel'] || 'Sí',
      fields['lista-cotejo:meta:noLabel'] || 'No',
    ),
  )
  const [draftPoints, setDraftPoints] = useState<string[]>(() =>
    Array.from(
      { length: criteriaCount },
      (_, index) => fields[instrumentFieldKey('lista-cotejo', 'points', index)] || '0',
    ),
  )
  const [pendingDelete, setPendingDelete] = useState<number | null>(null)
  const [highlightedRow] = useState<number | null>(null)
  const hasNoApply = fields['lista-cotejo:meta:noApply'] === 'true'
  const uniformPoints = fields['lista-cotejo:meta:pointsMode'] !== 'individual'
  const labels = {
    yes: fields['lista-cotejo:meta:yesLabel'] || 'Sí',
    no: fields['lista-cotejo:meta:noLabel'] || 'No',
    na: fields['lista-cotejo:meta:naLabel'] || 'No aplica',
  }
  const uniformDraftPoints = distributeScore(maxScore, criteriaCount)
  const configuredDraftPoints = draftUniformPoints
    ? uniformDraftPoints
    : Array.from({ length: criteriaCount }, (_, index) => Number(draftPoints[index] || 0))
  const draftTotal = Number(configuredDraftPoints.reduce((sum, value) => sum + value, 0).toFixed(2))
  const customLabelsValid =
    draftLabelMode !== 'custom' ||
    Boolean(
      draftLabels.yes.trim() &&
      draftLabels.no.trim() &&
      draftLabels.yes.trim().toLocaleLowerCase() !== draftLabels.no.trim().toLocaleLowerCase(),
    )
  const customPointsValid = configuredDraftPoints.every(
    (value) => Number.isFinite(value) && value >= 0,
  )
  const distributionValid =
    scorePending ||
    draftUniformPoints ||
    (customPointsValid && Math.abs(draftTotal - maxScore) < 0.001)
  const configurationValid = customLabelsValid && distributionValid

  function removeCriterion(index: number) {
    if (criteriaCount <= 1) return
    onFieldsChange(
      rebalanceInstrumentRows(
        shiftInstrumentRows(fields, 'lista-cotejo', index, criteriaCount),
        'lista-cotejo',
        maxScore,
      ),
    )
    onCriteriaCountChange(criteriaCount - 1)
  }
  function openConfiguration() {
    setDraftNoApply(hasNoApply)
    setDraftUniformPoints(uniformPoints)
    setDraftLabels(labels)
    setDraftLabelMode(checklistLabelMode(labels.yes, labels.no))
    setDraftPoints(
      Array.from(
        { length: criteriaCount },
        (_, index) => fields[instrumentFieldKey('lista-cotejo', 'points', index)] || '',
      ),
    )
    setConfiguring(true)
  }
  function applyConfiguration() {
    if (!configurationValid) return
    const next: Record<string, string> = {
      ...fields,
      'lista-cotejo:meta:observations': 'false',
      'lista-cotejo:meta:noApply': String(draftNoApply),
      'lista-cotejo:meta:pointsMode': draftUniformPoints ? 'uniform' : 'individual',
      'lista-cotejo:meta:yesLabel': draftLabels.yes.trim(),
      'lista-cotejo:meta:noLabel': draftLabels.no.trim(),
      'lista-cotejo:meta:naLabel': draftLabels.na.trim() || 'No aplica',
    }
    Object.keys(next)
      .filter((key) => key.startsWith('lista-cotejo:observation:'))
      .forEach((key) => delete next[key])
    configuredDraftPoints.forEach((points, row) => {
      next[instrumentFieldKey('lista-cotejo', 'points', row)] = scorePending ? '' : String(points)
    })
    onFieldsChange(next)
    setConfiguring(false)
  }
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className={cn('font-black', accent.text)}>Criterios de cumplimiento</p>
          <p className="text-xs text-muted-foreground">
            Verifica el cumplimiento de criterios específicos.
          </p>
        </div>
        <div className="instrument-structure-controls flex flex-wrap items-center gap-2">
          {typographyControls}
          <Button type="button" size="sm" variant="outline" onClick={openConfiguration}>
            <Settings className="size-4" />
            Configurar lista
          </Button>
          <Button
            type="button"
            size="sm"
            className={accent.button}
            onClick={onAddCriterion}
            disabled={criteriaCount >= 20 || addingCriterion || criterionRequestBusy}
          >
            <Plus className="size-4" />
            {addingCriterion ? 'Añadiendo…' : 'Agregar criterio'}
          </Button>
        </div>
      </div>
      {configuring ? (
        <InstrumentSettingsDrawer
          accent={accent}
          applyDisabled={!configurationValid}
          description="Personaliza las respuestas, la distribución de puntos y el comportamiento de este instrumento."
          onClose={() => setConfiguring(false)}
          onApply={applyConfiguration}
          panelClassName="max-w-[42rem]"
          title="Configurar lista de cotejo"
        >
          <div className="space-y-4">
            <div
              className={cn(
                'grid grid-cols-2 gap-2 rounded-xl border p-2 sm:grid-cols-4',
                accent.card,
              )}
            >
              {[
                {
                  icon: <Target className="size-4" />,
                  label: 'Actividad',
                  value: scorePending ? '—' : `${maxScore} puntos`,
                },
                {
                  icon: <Grid3X3 className="size-4" />,
                  label: 'Criterios',
                  value: String(criteriaCount),
                },
                {
                  icon: <ClipboardList className="size-4" />,
                  label: 'Instrumento',
                  value: 'Lista de cotejo',
                },
                {
                  icon: <CheckCircle2 className="size-4" />,
                  label: 'Puntuación configurada',
                  value: scorePending
                    ? '—'
                    : `${formatInstrumentNumber(draftTotal)}/${formatInstrumentNumber(maxScore)} pts`,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="min-w-0 rounded-lg border border-border bg-card/90 p-2.5 shadow-sm"
                >
                  <p className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground">
                    <span className={accent.text}>{item.icon}</span>
                    {item.label}
                  </p>
                  <p
                    className={cn(
                      'mt-1 truncate text-xs font-black',
                      item.label === 'Puntuación configurada' && distributionValid && !scorePending
                        ? 'text-success'
                        : 'text-foreground',
                    )}
                    title={item.value}
                  >
                    {item.value}
                    {item.label === 'Puntuación configurada' && distributionValid && !scorePending
                      ? ' ✓'
                      : ''}
                  </p>
                </div>
              ))}
            </div>

            <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div>
                <p className={cn('text-sm font-black', accent.text)}>1. Etiquetas de respuesta</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Elige cómo se representará el cumplimiento de cada criterio.
                </p>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {checklistResponsePresets.map((preset) => {
                  const selected = draftLabelMode === preset.id
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      aria-pressed={selected}
                      className={cn(
                        'relative min-h-16 rounded-xl border bg-card px-3 py-2 text-left text-xs transition hover:shadow-sm',
                        selected
                          ? cn(accent.card, accent.border, accent.text, 'ring-1')
                          : 'border-border text-foreground',
                      )}
                      onClick={() => {
                        setDraftLabelMode(preset.id)
                        setDraftLabels((current) => ({
                          ...current,
                          yes: preset.positive,
                          no: preset.negative,
                        }))
                      }}
                    >
                      <span className="block font-black">{preset.positive}</span>
                      <span className="mt-0.5 block text-[10px] text-muted-foreground">
                        {preset.negative}
                      </span>
                      {selected ? (
                        <CheckCircle2
                          className={cn('absolute right-2 top-2 size-4', accent.text)}
                        />
                      ) : null}
                    </button>
                  )
                })}
                <button
                  type="button"
                  aria-pressed={draftLabelMode === 'custom'}
                  className={cn(
                    'relative min-h-16 rounded-xl border bg-card px-3 py-2 text-left text-xs transition hover:shadow-sm',
                    draftLabelMode === 'custom'
                      ? cn(accent.card, accent.border, accent.text, 'ring-1')
                      : 'border-border text-foreground',
                  )}
                  onClick={() => setDraftLabelMode('custom')}
                >
                  <PenLine className="mb-1 size-4" />
                  <span className="font-black">Personalizadas</span>
                  {draftLabelMode === 'custom' ? (
                    <CheckCircle2 className={cn('absolute right-2 top-2 size-4', accent.text)} />
                  ) : null}
                </button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-muted/25 px-3 py-2 text-[10px] font-bold">
                <span className="text-muted-foreground">Vista previa:</span>
                <span className="rounded-full bg-success/10 px-2 py-1 text-success">
                  {draftLabels.yes} (positivo)
                </span>
                <span className="rounded-full bg-destructive/10 px-2 py-1 text-destructive">
                  {draftLabels.no} (negativo)
                </span>
              </div>
              {draftLabelMode === 'custom' ? (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="text-xs font-bold text-muted-foreground">
                    Etiqueta positiva
                    <Input
                      className="mt-1"
                      value={draftLabels.yes}
                      placeholder="Ej. Demostrado"
                      onChange={(event) =>
                        setDraftLabels((current) => ({ ...current, yes: event.target.value }))
                      }
                    />
                  </label>
                  <label className="text-xs font-bold text-muted-foreground">
                    Etiqueta negativa
                    <Input
                      className="mt-1"
                      value={draftLabels.no}
                      placeholder="Ej. No demostrado"
                      onChange={(event) =>
                        setDraftLabels((current) => ({ ...current, no: event.target.value }))
                      }
                    />
                  </label>
                  {!customLabelsValid ? (
                    <p className="text-xs font-bold text-destructive sm:col-span-2">
                      Las etiquetas deben tener contenido y ser diferentes entre sí.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </section>

            <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <p className={cn('text-sm font-black', accent.text)}>2. Opción “No aplica”</p>
              <div className="mt-2">
                <ToggleControl
                  label="Permitir No aplica"
                  checked={draftNoApply}
                  onChange={setDraftNoApply}
                />
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Permite marcar un criterio que no corresponde al estudiante o a la situación
                evaluada.
              </p>
              {draftNoApply ? (
                <div
                  className={cn(
                    'mt-3 flex items-start gap-2 rounded-lg border p-3 text-xs leading-5',
                    accent.card,
                    accent.border,
                  )}
                >
                  <CircleDot className={cn('mt-0.5 size-4 shrink-0', accent.text)} />
                  <p>
                    Los criterios marcados como <strong>No aplica</strong> serán excluidos del
                    cálculo y la puntuación se reajustará proporcionalmente para no perjudicar al
                    estudiante.
                  </p>
                </div>
              ) : null}
            </section>

            <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <p className={cn('text-sm font-black', accent.text)}>3. Distribución de puntos</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Define cómo se asignan los puntos de la actividad entre los criterios.
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  aria-pressed={draftUniformPoints}
                  className={cn(
                    'rounded-xl border p-3 text-left transition hover:shadow-sm',
                    draftUniformPoints ? cn(accent.card, accent.border, 'ring-1') : 'border-border',
                  )}
                  onClick={() => setDraftUniformPoints(true)}
                >
                  <span
                    className={cn(
                      'block text-sm font-black',
                      draftUniformPoints ? accent.text : 'text-foreground',
                    )}
                  >
                    Distribución uniforme
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    AulaBase distribuye automáticamente el valor total.
                  </span>
                </button>
                <button
                  type="button"
                  aria-pressed={!draftUniformPoints}
                  className={cn(
                    'rounded-xl border p-3 text-left transition hover:shadow-sm',
                    !draftUniformPoints
                      ? cn(accent.card, accent.border, 'ring-1')
                      : 'border-border',
                  )}
                  onClick={() => setDraftUniformPoints(false)}
                >
                  <span
                    className={cn(
                      'block text-sm font-black',
                      !draftUniformPoints ? accent.text : 'text-foreground',
                    )}
                  >
                    Valores personalizados
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    Asigna manualmente un valor diferente a cada criterio.
                  </span>
                </button>
              </div>
              {draftUniformPoints ? (
                <div className={cn('mt-3 rounded-xl border p-3', accent.card, accent.border)}>
                  <p className="text-sm font-black">
                    {scorePending ? '—' : formatInstrumentNumber(maxScore)} puntos entre{' '}
                    {criteriaCount} criterios
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    ≈{' '}
                    {scorePending
                      ? '—'
                      : formatInstrumentNumber(maxScore / Math.max(1, criteriaCount))}{' '}
                    pts por criterio. Los centésimos se ajustan para conservar el total exacto.
                  </p>
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  {Array.from({ length: criteriaCount }, (_, index) => (
                    <label
                      key={index}
                      className="grid grid-cols-[minmax(0,1fr)_7rem] items-center gap-3 rounded-lg border border-border bg-muted/10 px-3 py-2 text-xs"
                    >
                      <span className="truncate font-bold text-foreground">
                        {fields[instrumentFieldKey('lista-cotejo', 'criterion', index)] ||
                          `${index + 1}. Criterio`}
                      </span>
                      <span className="relative">
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          className="h-9 pr-9"
                          disabled={scorePending}
                          value={scorePending ? '' : draftPoints[index] || ''}
                          placeholder="—"
                          onChange={(event) =>
                            setDraftPoints((current) => {
                              const next = [...current]
                              next[index] = event.target.value
                              return next
                            })
                          }
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">
                          pts
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              )}
              <div
                className={cn(
                  'mt-3 flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-bold',
                  distributionValid && !scorePending
                    ? 'border-success/30 bg-success/10 text-success'
                    : 'border-warning/30 bg-warning/10 text-warning-foreground',
                )}
              >
                <span>Puntuación configurada</span>
                <span>
                  {scorePending
                    ? '—'
                    : `${formatInstrumentNumber(draftTotal)}/${formatInstrumentNumber(maxScore)}`}{' '}
                  pts {!scorePending && distributionValid ? '✓' : ''}
                </span>
              </div>
              <div className="mt-2 rounded-lg bg-muted/25 px-3 py-2 text-[11px] leading-5 text-muted-foreground">
                <strong className="text-foreground">Cálculo:</strong> {draftLabels.yes} otorga el
                valor completo del criterio; {draftLabels.no} otorga 0 puntos.
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <p className={cn('text-sm font-black', accent.text)}>4. Vista previa</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Así se verá la lista de cotejo con la configuración actual.
              </p>
              <div className="mt-3 rounded-xl border border-border bg-muted/30 p-1">
                <table className="w-full table-fixed border-separate border-spacing-1 text-[10px] sm:text-xs">
                  <thead>
                    <tr>
                      <th className="w-[38%] rounded-lg border border-border bg-card px-2 py-2 text-left sm:px-3">
                        Criterio
                      </th>
                      <th className="break-words rounded-lg border border-success/30 bg-success/10 px-1 py-2 text-success sm:px-3">
                        {draftLabels.yes}
                        <span className="block text-[8px] sm:text-[9px]">(valor completo)</span>
                      </th>
                      <th className="break-words rounded-lg border border-destructive/30 bg-destructive/10 px-1 py-2 text-destructive sm:px-3">
                        {draftLabels.no}
                        <span className="block text-[8px] sm:text-[9px]">(0 pts)</span>
                      </th>
                      {draftNoApply ? (
                        <th className="break-words rounded-lg border border-border bg-muted/30 px-1 py-2 text-muted-foreground sm:px-3">
                          No aplica
                          <span className="block text-[8px] sm:text-[9px]">(excluido)</span>
                        </th>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: Math.min(criteriaCount, 3) }, (_, index) => (
                      <tr key={index}>
                        <td className="break-words rounded-lg border border-border bg-card px-2 py-2 font-bold sm:px-3">
                          {fields[instrumentFieldKey('lista-cotejo', 'criterion', index)] ||
                            `${index + 1}. Criterio`}
                        </td>
                        <td className="rounded-lg border border-success/30 bg-card text-center text-success">
                          ✓
                        </td>
                        <td className="rounded-lg border border-destructive/30 bg-card text-center text-destructive">
                          ×
                        </td>
                        {draftNoApply ? (
                          <td className="rounded-lg border border-border bg-card text-center text-muted-foreground">
                            —
                          </td>
                        ) : null}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {criteriaCount > 3 ? (
                  <p className="px-3 py-2 text-[10px] font-bold text-muted-foreground">
                    Y {criteriaCount - 3} criterios más…
                  </p>
                ) : null}
              </div>
            </section>
          </div>
        </InstrumentSettingsDrawer>
      ) : null}
      <InstrumentTable>
        <thead className="sticky top-0 z-20 text-[10px] font-bold uppercase">
          <tr>
            <th
              className={cn(
                'sticky left-0 z-30 w-[48%] border px-3 py-3',
                accent.card,
                accent.border,
                accent.text,
              )}
            >
              Criterios
            </th>
            <th className="border border-success/30 bg-success/10 px-3 py-3 text-center text-success">
              {labels.yes}
            </th>
            <th className="border border-destructive/30 bg-destructive/10 px-3 py-3 text-center text-destructive">
              {labels.no}
            </th>
            {hasNoApply ? (
              <th className="border border-warning/30 bg-warning/10 px-3 py-3 text-center text-warning-foreground">
                {labels.na}
              </th>
            ) : null}
            <th
              className={cn(
                'w-24 border px-3 py-3 text-center',
                accent.card,
                accent.border,
                accent.text,
              )}
            >
              Valor
            </th>
            <th className={cn('w-10 border', accent.card, accent.border)} />
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: criteriaCount }, (_, index) => (
            <tr
              key={index}
              className={cn(
                'transition-colors motion-safe:duration-200',
                highlightedRow === index ? accent.panel : '',
              )}
            >
              <td className="sticky left-0 z-10 border border-border bg-card p-1.5">
                <InstrumentTextarea
                  dataInstrumentRow={`lista-cotejo-${index}`}
                  ariaLabel={`Criterio ${index + 1}`}
                  placeholder={`${index + 1}. Criterio`}
                  value={fields[instrumentFieldKey('lista-cotejo', 'criterion', index)] ?? ''}
                  onChange={(value) =>
                    onFieldChange(instrumentFieldKey('lista-cotejo', 'criterion', index), value)
                  }
                />
              </td>
              <td className="border border-success/30 bg-success/55 text-center">
                <span className="mx-auto block size-5 rounded-md border-2 border-success/30 bg-white shadow-sm" />
              </td>
              <td className="border border-destructive/30 bg-destructive/55 text-center">
                <span className="mx-auto block size-5 rounded-md border-2 border-destructive/30 bg-white shadow-sm" />
              </td>
              {hasNoApply ? (
                <td className="border border-warning/30 bg-warning/55 text-center">
                  <span className="mx-auto block size-5 rounded-md border-2 border-warning/30 bg-white shadow-sm" />
                </td>
              ) : null}
              <td className={cn('border p-1.5 text-center', accent.card, accent.border)}>
                {uniformPoints ? (
                  <span
                    className={cn(
                      'inline-flex rounded-lg px-2 py-2 font-black shadow-sm',
                      accent.panel,
                      accent.text,
                    )}
                  >
                    {scorePending
                      ? '—'
                      : (fields[instrumentFieldKey('lista-cotejo', 'points', index)] ?? '—')}{' '}
                    pts
                  </span>
                ) : (
                  <InstrumentInput
                    value={fields[instrumentFieldKey('lista-cotejo', 'points', index)] ?? ''}
                    onChange={(value) =>
                      onFieldChange(instrumentFieldKey('lista-cotejo', 'points', index), value)
                    }
                    placeholder="—"
                  />
                )}
              </td>
              <td className={cn('border bg-card', accent.border)}>
                <InstrumentRowMenu
                  onComplete={onCompleteCriterion ? () => onCompleteCriterion(index) : undefined}
                  completing={completingCriterionId === fields['lista-cotejo:criterion-id:' + index]}
                  completionDisabled={criterionRequestBusy}
                  canMoveDown={index < criteriaCount - 1}
                  canMoveUp={index > 0}
                  onDelete={() =>
                    fields[instrumentFieldKey('lista-cotejo', 'criterion', index)]?.trim()
                      ? setPendingDelete(index)
                      : removeCriterion(index)
                  }
                  onDuplicate={() => {
                    if (criteriaCount >= 20) return
                    onFieldsChange(
                      rebalanceInstrumentRows(
                        duplicateInstrumentRow(fields, 'lista-cotejo', index),
                        'lista-cotejo',
                        maxScore,
                      ),
                    )
                    onCriteriaCountChange(criteriaCount + 1)
                  }}
                  onMoveDown={() =>
                    onFieldsChange(
                      swapInstrumentRows(fields, 'lista-cotejo', index, index + 1, [
                        'criterion',
                        'points',
                      ]),
                    )
                  }
                  onMoveUp={() =>
                    onFieldsChange(
                      swapInstrumentRows(fields, 'lista-cotejo', index, index - 1, [
                        'criterion',
                        'points',
                      ]),
                    )
                  }
                />
              </td>
            </tr>
          ))}
          <tr className="font-bold">
            <td
              className={cn('border px-3 py-3', accent.card, accent.border, accent.text)}
              colSpan={3 + (hasNoApply ? 1 : 0)}
            >
              Puntuación máxima total
            </td>
            <td
              className={cn(
                'border px-2 py-2 text-center',
                accent.card,
                accent.border,
                scorePending
                  ? 'text-muted-foreground'
                  : Math.abs(total - maxScore) < 0.001
                    ? 'text-success'
                    : 'text-destructive',
              )}
            >
              {scorePending
                ? '—'
                : `${formatInstrumentNumber(total)} / ${formatInstrumentNumber(maxScore)}`}{' '}
              pts
            </td>
            <td className={cn('border', accent.card, accent.border)} />
          </tr>
        </tbody>
      </InstrumentTable>
      {pendingDelete !== null ? (
        <ConfirmDialog
          title="¿Eliminar este criterio?"
          description={`Se eliminará “${fields[instrumentFieldKey('lista-cotejo', 'criterion', pendingDelete)]}” y sus datos asociados.`}
          confirmLabel="Eliminar criterio"
          destructive
          onClose={() => setPendingDelete(null)}
          onConfirm={() => {
            removeCriterion(pendingDelete)
            setPendingDelete(null)
          }}
        />
      ) : null}
    </div>
  )
}
