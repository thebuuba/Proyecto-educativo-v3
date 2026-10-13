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
  InstrumentSummaryItem,
  InstrumentTable,
  InstrumentTextarea,
} from '@/modules/activities/components/editor/instrumentEditorShared'
import { cn } from '@/utils/cn'
import { AlertCircle, CheckCircle2, Dices, Plus, Settings } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import {
  duplicateInstrumentRow,
  rebalanceInstrumentRows,
  shiftInstrumentRows,
  swapInstrumentRows,
} from './instrumentEditorShared'

export const weightedLabelTemplates = [
  { id: 'standard', title: 'Sí / Parcial / No', yes: 'Sí', partial: 'Parcial', no: 'No' },
  {
    id: 'cumplimiento',
    title: 'Cumple / Parcialmente / No cumple',
    yes: 'Cumple',
    partial: 'Cumple parcialmente',
    no: 'No cumple',
  },
  {
    id: 'logro',
    title: 'Logrado / En proceso / No logrado',
    yes: 'Logrado',
    partial: 'En proceso',
    no: 'No logrado',
  },
  {
    id: 'completo',
    title: 'Completo / Incompleto / No realizado',
    yes: 'Completo',
    partial: 'Incompleto',
    no: 'No realizado',
  },
  { id: 'personalizadas', title: 'Personalizadas', yes: '', partial: '', no: '' },
] as const

export type WeightedLabelTemplateId = (typeof weightedLabelTemplates)[number]['id']

export type WeightedLabels = { yes: string; partial: string; no: string }

export function inferWeightedLabelTemplate(labels: WeightedLabels): WeightedLabelTemplateId {
  const match = weightedLabelTemplates.find(
    (template) =>
      template.id !== 'personalizadas' &&
      template.yes === labels.yes &&
      template.partial === labels.partial &&
      template.no === labels.no,
  )
  return match?.id ?? 'personalizadas'
}

export function weightedStatus(total: number) {
  if (!Number.isFinite(total))
    return {
      label: 'Inválido',
      detail: 'Revisa los porcentajes: hay un valor no válido.',
      tone: 'error' as const,
    }
  if (Math.abs(total - 100) < 0.001)
    return { label: 'Correcto', detail: 'Configuración correcta.', tone: 'success' as const }
  if (total < 100)
    return {
      label: 'Incompleto',
      detail: `Falta distribuir ${formatInstrumentNumber(100 - total)} %.`,
      tone: 'warning' as const,
    }
  return {
    label: 'Excedido',
    detail: `Se excede por ${formatInstrumentNumber(total - 100)} %.`,
    tone: 'error' as const,
  }
}

export function WeightedListSettingsDrawer({
  accent,
  criteriaCount,
  decimals,
  fields,
  labels,
  maxScore,
  onApply,
  onClose,
  partial,
  partialValue,
}: {
  accent: (typeof blockAccents)[number]
  criteriaCount: number
  decimals: boolean
  fields: Record<string, string>
  labels: WeightedLabels
  maxScore: number
  onApply: (settings: {
    decimals: boolean
    labels: WeightedLabels
    partial: boolean
    partialValue: number
    redistribute: boolean
    template: WeightedLabelTemplateId
  }) => void
  onClose: () => void
  partial: boolean
  partialValue: number
}) {
  const [draftPartial, setDraftPartial] = useState(partial)
  const [draftPartialValue, setDraftPartialValue] = useState(partialValue)
  const [draftDecimals, setDraftDecimals] = useState(decimals)
  const [draftLabels, setDraftLabels] = useState<WeightedLabels>(labels)
  const [draftTemplate, setDraftTemplate] = useState<WeightedLabelTemplateId>(() => {
    const stored = fields['lista-ponderada:meta:labelTemplate'] as WeightedLabelTemplateId
    return weightedLabelTemplates.some((template) => template.id === stored)
      ? stored
      : inferWeightedLabelTemplate(labels)
  })
  const [redistribute, setRedistribute] = useState(false)
  const weights = redistribute
    ? distributeScore(100, criteriaCount)
    : Array.from({ length: criteriaCount }, (_, index) =>
        Number(fields[instrumentFieldKey('lista-ponderada', 'weight', index)] || 0),
      )
  const effectiveTotal = Number(weights.reduce((sum, value) => sum + value, 0).toFixed(2))
  const status = weightedStatus(effectiveTotal)
  const firstCriterionIndex =
    Array.from({ length: criteriaCount }, (_, index) => index).find((index) =>
      fields[instrumentFieldKey('lista-ponderada', 'criterion', index)]?.trim(),
    ) ?? 0
  const exampleWeight = weights[firstCriterionIndex] ?? 0
  const exampleMaximum = (exampleWeight / 100) * maxScore
  const formatPoints = (value: number) =>
    draftDecimals ? formatInstrumentNumber(value) : String(Math.round(value))
  const labelsValid = Boolean(
    draftLabels.yes.trim() &&
    draftLabels.no.trim() &&
    (!draftPartial || draftLabels.partial.trim()),
  )
  const partialValid =
    !draftPartial ||
    (Number.isFinite(draftPartialValue) && draftPartialValue > 0 && draftPartialValue < 100)
  const configurationValid = labelsValid && partialValid

  function selectTemplate(templateId: WeightedLabelTemplateId) {
    setDraftTemplate(templateId)
    const template = weightedLabelTemplates.find((item) => item.id === templateId)
    if (template && template.id !== 'personalizadas')
      setDraftLabels({ yes: template.yes, partial: template.partial, no: template.no })
  }

  return (
    <InstrumentSettingsDrawer
      accent={accent}
      applyDisabled={!configurationValid}
      description="Define el cumplimiento parcial, las etiquetas y las reglas de ponderación."
      onApply={() =>
        onApply({
          decimals: draftDecimals,
          labels: draftLabels,
          partial: draftPartial,
          partialValue: draftPartialValue,
          redistribute,
          template: draftTemplate,
        })
      }
      onClose={onClose}
      panelClassName="max-w-[43rem]"
      title="Configurar lista ponderada"
    >
      <div className="space-y-6">
        <section>
          <p className={cn('mb-2 text-xs font-black uppercase tracking-[0.12em]', accent.text)}>
            1. Resumen
          </p>
          <div
            className={cn(
              'grid grid-cols-2 gap-2 rounded-xl border p-2 sm:grid-cols-4',
              accent.card,
            )}
          >
            <InstrumentSummaryItem label="Criterios" value={String(criteriaCount)} />
            <InstrumentSummaryItem
              label="Actividad"
              value={maxScore <= 0 ? '—' : `${formatInstrumentNumber(maxScore)} puntos`}
            />
            <InstrumentSummaryItem
              label="Ponderación"
              value={`${formatInstrumentNumber(effectiveTotal)}/100 %`}
              good={Math.abs(effectiveTotal - 100) < 0.001}
            />
            <InstrumentSummaryItem
              label="Estado"
              value={status.label}
              good={status.tone === 'success'}
            />
          </div>
        </section>

        <section className="space-y-3">
          <p className={cn('text-xs font-black uppercase tracking-[0.12em]', accent.text)}>
            2. Grados de cumplimiento
          </p>
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
            <span>
              <span className="block text-sm font-black text-foreground">
                Permitir cumplimiento parcial
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                Agrega una respuesta intermedia entre el cumplimiento total y el no cumplimiento.
              </span>
            </span>
            <input
              className="peer sr-only"
              type="checkbox"
              checked={draftPartial}
              onChange={(event) => setDraftPartial(event.target.checked)}
            />
            <span
              className={cn(
                'relative h-6 w-11 shrink-0 rounded-full bg-muted/30 transition-colors after:absolute after:left-1 after:top-1 after:size-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-focus-visible:ring-2',
                accent.ring,
                draftPartial ? `${accent.progress} after:translate-x-5` : '',
              )}
            />
          </label>
          {draftPartial ? (
            <label className="block text-xs font-bold text-muted-foreground">
              Valor del cumplimiento parcial (%)
              <div className="relative mt-1.5">
                <Input
                  className="h-11 pr-10"
                  type="number"
                  min={1}
                  max={99}
                  value={draftPartialValue}
                  onChange={(event) => setDraftPartialValue(Number(event.target.value))}
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-black text-muted-foreground">
                  %
                </span>
              </div>
              {!partialValid ? (
                <span className="mt-1 block text-destructive">
                  Debe ser mayor que 0 % y menor que 100 %.
                </span>
              ) : null}
            </label>
          ) : null}
          <div className={cn('rounded-xl border p-3 text-xs leading-5', accent.card)}>
            <div className="flex gap-2">
              <AlertCircle className={cn('mt-0.5 size-4 shrink-0', accent.text)} />
              <div>
                <p>
                  <strong>{draftLabels.yes || 'Respuesta positiva'}</strong> otorga el 100 % del
                  valor del criterio.
                </p>
                {draftPartial ? (
                  <p>
                    <strong>{draftLabels.partial || 'Respuesta parcial'}</strong> otorga el{' '}
                    {formatInstrumentNumber(draftPartialValue)} %.
                  </p>
                ) : null}
                <p>
                  <strong>{draftLabels.no || 'Respuesta negativa'}</strong> no otorga puntos.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div>
            <p className={cn('text-xs font-black uppercase tracking-[0.12em]', accent.text)}>
              3. Etiquetas de respuesta
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Selecciona una plantilla o crea etiquetas personalizadas.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {weightedLabelTemplates.map((template) => {
              const active = draftTemplate === template.id
              const summary =
                template.id === 'personalizadas'
                  ? 'Define tus propios términos'
                  : draftPartial
                    ? template.title
                    : `${template.yes} / ${template.no}`
              return (
                <button
                  key={template.id}
                  type="button"
                  className={cn(
                    'flex min-h-16 items-start gap-3 rounded-xl border bg-card p-3 text-left transition-colors hover:bg-muted/20',
                    active ? accent.border : 'border-border',
                  )}
                  style={
                    active
                      ? {
                          backgroundColor: accent.cardTint,
                          boxShadow: `inset 0 0 0 1px ${accent.progressColor}`,
                        }
                      : undefined
                  }
                  onClick={() => selectTemplate(template.id)}
                >
                  <span
                    className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2"
                    style={{ borderColor: active ? accent.progressColor : 'var(--border)' }}
                  >
                    {active ? (
                      <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: accent.progressColor }}
                      />
                    ) : null}
                  </span>
                  <span>
                    <span className="block text-xs font-black text-foreground">
                      {template.title}
                    </span>
                    <span className="mt-1 block text-[11px] leading-4 text-muted-foreground">
                      {summary}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
          {draftTemplate === 'personalizadas' ? (
            <div
              className={cn(
                'grid gap-2 rounded-xl border p-3',
                accent.card,
                draftPartial ? 'sm:grid-cols-3' : 'sm:grid-cols-2',
              )}
            >
              <label className="text-[11px] font-bold text-muted-foreground">
                Respuesta positiva
                <Input
                  className="mt-1 h-10 bg-card"
                  value={draftLabels.yes}
                  onChange={(event) =>
                    setDraftLabels((current) => ({ ...current, yes: event.target.value }))
                  }
                />
              </label>
              {draftPartial ? (
                <label className="text-[11px] font-bold text-muted-foreground">
                  Respuesta parcial
                  <Input
                    className="mt-1 h-10 bg-card"
                    value={draftLabels.partial}
                    onChange={(event) =>
                      setDraftLabels((current) => ({ ...current, partial: event.target.value }))
                    }
                  />
                </label>
              ) : null}
              <label className="text-[11px] font-bold text-muted-foreground">
                Respuesta negativa
                <Input
                  className="mt-1 h-10 bg-card"
                  value={draftLabels.no}
                  onChange={(event) =>
                    setDraftLabels((current) => ({ ...current, no: event.target.value }))
                  }
                />
              </label>
            </div>
          ) : null}
          {!labelsValid ? (
            <p className="text-xs font-bold text-destructive">
              Completa todas las etiquetas visibles.
            </p>
          ) : null}
        </section>

        <section className="space-y-3">
          <div>
            <p className={cn('text-xs font-black uppercase tracking-[0.12em]', accent.text)}>
              4. Ponderación
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              La suma de los pesos debe ser exactamente 100 %.
            </p>
          </div>
          <div
            className={cn(
              'rounded-xl border p-4 transition-colors',
              status.tone === 'success'
                ? 'border-success/30 bg-success/10'
                : status.tone === 'warning'
                  ? 'border-warning/30 bg-warning/10'
                  : 'border-destructive/30 bg-destructive/10',
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p
                  className={cn(
                    'text-sm font-black',
                    status.tone === 'success'
                      ? 'text-success'
                      : status.tone === 'warning'
                        ? 'text-warning-foreground'
                        : 'text-destructive',
                  )}
                >
                  Ponderación actual: {formatInstrumentNumber(effectiveTotal)}/100 %
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{status.detail}</p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setRedistribute(true)}
              >
                <Dices className="size-4" />
                Redistribuir equitativamente
              </Button>
            </div>
          </div>
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
            <span>
              <span className="block text-sm font-black text-foreground">
                Permitir valores decimales
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                Muestra hasta dos decimales en porcentajes y puntos equivalentes.
              </span>
            </span>
            <input
              className="peer sr-only"
              type="checkbox"
              checked={draftDecimals}
              onChange={(event) => setDraftDecimals(event.target.checked)}
            />
            <span
              className={cn(
                'relative h-6 w-11 shrink-0 rounded-full bg-muted/30 transition-colors after:absolute after:left-1 after:top-1 after:size-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-focus-visible:ring-2',
                accent.ring,
                draftDecimals ? `${accent.progress} after:translate-x-5` : '',
              )}
            />
          </label>
        </section>

        <section className="space-y-2">
          <div>
            <p className={cn('text-xs font-black uppercase tracking-[0.12em]', accent.text)}>
              5. Vista previa de la ponderación
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Ejemplo de cómo se calculará un criterio durante la evaluación.
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-border bg-card p-1">
            <div
              className="grid min-w-[37rem] gap-1 text-[10px]"
              style={{
                gridTemplateColumns: `minmax(10rem,1.5fr) 5rem 6rem repeat(${draftPartial ? 3 : 2}, minmax(5rem,1fr))`,
              }}
            >
              {[
                'Criterio',
                'Peso',
                'Valor máx.',
                draftLabels.yes || 'Positiva',
                ...(draftPartial ? [draftLabels.partial || 'Parcial'] : []),
                draftLabels.no || 'Negativa',
              ].map((label) => (
                <div
                  key={label}
                  className={cn(
                    'rounded-lg border px-2 py-2 text-center font-black first:text-left',
                    accent.card,
                    accent.border,
                  )}
                >
                  {label}
                </div>
              ))}
              <div className="rounded-lg border border-border px-2 py-3 font-bold">
                {fields[instrumentFieldKey('lista-ponderada', 'criterion', firstCriterionIndex)] ||
                  'Criterio de ejemplo'}
              </div>
              <div className="rounded-lg border border-border px-2 py-3 text-center font-black">
                {formatInstrumentNumber(exampleWeight)} %
              </div>
              <div
                className={cn(
                  'rounded-lg border px-2 py-3 text-center font-black',
                  accent.card,
                  accent.border,
                  accent.text,
                )}
              >
                {maxScore <= 0 ? '—' : formatPoints(exampleMaximum)} pts
              </div>
              <div className="rounded-lg border border-success/30 bg-success/10 px-2 py-3 text-center font-black text-success">
                {maxScore <= 0 ? '—' : formatPoints(exampleMaximum)} pts
              </div>
              {draftPartial ? (
                <div className="rounded-lg border border-warning/30 bg-warning/10 px-2 py-3 text-center font-black text-warning-foreground">
                  {maxScore <= 0 ? '—' : formatPoints((exampleMaximum * draftPartialValue) / 100)}{' '}
                  pts
                </div>
              ) : null}
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-2 py-3 text-center font-black text-destructive">
                {maxScore <= 0 ? '—' : '0'} pts
              </div>
            </div>
          </div>
        </section>
      </div>
    </InstrumentSettingsDrawer>
  )
}

export function WeightedListInstrument({
  accent,
  addingCriterion,
  onCompleteCriterion,
  completingCriterionId,
  criterionRequestBusy = false,
  criteriaCount,
  fields,
  hasPartial,
  maxScore,
  onFieldChange,
  onAddCriterion,
  onCriteriaCountChange,
  onFieldsChange,
  onHasPartialChange,
  typographyControls,
}: {
  accent: (typeof blockAccents)[number]
  addingCriterion: boolean
  onCompleteCriterion?: (row: number) => void
  completingCriterionId?: string | null
  criterionRequestBusy?: boolean
  criteriaCount: number
  fields: Record<string, string>
  hasPartial: boolean
  maxScore: number
  onFieldChange: (key: string, value: string) => void
  onAddCriterion: () => void
  onCriteriaCountChange: (value: number) => void
  onFieldsChange: (fields: Record<string, string>) => void
  onHasPartialChange: (value: boolean) => void
  typographyControls: ReactNode
}) {
  const scorePending = maxScore <= 0
  const totalWeight = Number(
    Array.from({ length: criteriaCount }, (_, index) =>
      Number(fields[instrumentFieldKey('lista-ponderada', 'weight', index)] || 0),
    )
      .reduce((sum, value) => sum + value, 0)
      .toFixed(2),
  )
  const [configuring, setConfiguring] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<number | null>(null)
  const [highlightedRow] = useState<number | null>(null)
  const labels = {
    yes: fields['lista-ponderada:meta:yesLabel'] || 'Sí',
    partial: fields['lista-ponderada:meta:partialLabel'] || 'Parcial',
    no: fields['lista-ponderada:meta:noLabel'] || 'No',
  }
  const decimals = fields['lista-ponderada:meta:decimals'] !== 'false'
  const partialValue = Number(fields['lista-ponderada:meta:partialValue'] || 50)
  const status = weightedStatus(totalWeight)

  function removeCriterion(index: number) {
    if (criteriaCount <= 1) return
    onFieldsChange(
      rebalanceInstrumentRows(
        shiftInstrumentRows(fields, 'lista-ponderada', index, criteriaCount),
        'lista-ponderada',
        maxScore,
      ),
    )
    onCriteriaCountChange(criteriaCount - 1)
  }

  function applyConfiguration(settings: {
    decimals: boolean
    labels: WeightedLabels
    partial: boolean
    partialValue: number
    redistribute: boolean
    template: WeightedLabelTemplateId
  }) {
    const next: Record<string, string> = {
      ...fields,
      'lista-ponderada:meta:partial': String(settings.partial),
      'lista-ponderada:meta:partialValue': String(settings.partialValue),
      'lista-ponderada:meta:observations': 'false',
      'lista-ponderada:meta:decimals': String(settings.decimals),
      'lista-ponderada:meta:labelTemplate': settings.template,
      'lista-ponderada:meta:yesLabel': settings.labels.yes.trim(),
      'lista-ponderada:meta:partialLabel': settings.labels.partial.trim(),
      'lista-ponderada:meta:noLabel': settings.labels.no.trim(),
    }
    Object.keys(next)
      .filter((key) => key.startsWith('lista-ponderada:observation:'))
      .forEach((key) => delete next[key])
    if (settings.redistribute)
      distributeScore(100, criteriaCount).forEach((weight, row) => {
        next[instrumentFieldKey('lista-ponderada', 'weight', row)] = String(weight)
      })
    onFieldsChange(next)
    onHasPartialChange(settings.partial)
    setConfiguring(false)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className={cn('font-black', accent.text)}>Criterios y ponderaciones</p>
          <p className="text-xs text-muted-foreground">
            Define los criterios, sus indicadores y el peso de cada uno dentro de la actividad.
          </p>
        </div>
        <div className="instrument-structure-controls flex flex-wrap items-center gap-2">
          {typographyControls}
          <Button type="button" size="sm" variant="outline" onClick={() => setConfiguring(true)}>
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
        <WeightedListSettingsDrawer
          accent={accent}
          criteriaCount={criteriaCount}
          decimals={decimals}
          fields={fields}
          labels={labels}
          maxScore={maxScore}
          onApply={applyConfiguration}
          onClose={() => setConfiguring(false)}
          partial={hasPartial}
          partialValue={partialValue}
        />
      ) : null}
      <InstrumentTable>
        <thead className="sticky top-0 z-20 text-[10px] font-bold uppercase text-muted-foreground">
          <tr>
            <th className={cn('w-10 border px-2 py-2 text-center', accent.card, accent.border)}>
              #
            </th>
            <th className={cn('w-[25%] border px-3 py-2', accent.card, accent.border)}>Criterio</th>
            <th className={cn('w-[39%] border px-3 py-2', accent.card, accent.border)}>
              Indicador observable
            </th>
            <th className={cn('w-28 border px-3 py-2 text-center', accent.card, accent.border)}>
              Ponderación
            </th>
            <th className={cn('w-28 border px-3 py-2 text-center', accent.card, accent.border)}>
              Valor máximo
            </th>
            <th className={cn('w-12 border px-2 py-2 text-center', accent.card, accent.border)}>
              Acciones
            </th>
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
              <td className={cn('border bg-card text-center', accent.border)}>
                <span
                  className={cn(
                    'mx-auto grid size-7 place-items-center rounded-full text-xs font-black text-white',
                    accent.progress,
                  )}
                >
                  {index + 1}
                </span>
              </td>
              <td className={cn('border bg-card p-1.5', accent.border)}>
                <InstrumentTextarea
                  className="font-bold"
                  dataInstrumentRow={`lista-ponderada-${index}`}
                  ariaLabel={`Criterio ${index + 1}`}
                  placeholder={`Criterio ${index + 1}`}
                  value={fields[instrumentFieldKey('lista-ponderada', 'criterion', index)] ?? ''}
                  onChange={(value) =>
                    onFieldChange(instrumentFieldKey('lista-ponderada', 'criterion', index), value)
                  }
                />
              </td>
              <td className={cn('border bg-card p-1.5', accent.border)}>
                <InstrumentTextarea
                  className="text-muted-foreground"
                  ariaLabel={`Indicador del criterio ${index + 1}`}
                  placeholder="Describe la evidencia observable de este criterio"
                  value={fields[instrumentFieldKey('lista-ponderada', 'indicator', index)] ?? ''}
                  onChange={(value) =>
                    onFieldChange(instrumentFieldKey('lista-ponderada', 'indicator', index), value)
                  }
                />
              </td>
              <td className={cn('border bg-card p-1.5', accent.border)}>
                <div className="relative">
                  <InstrumentInput
                    placeholder="0"
                    value={fields[instrumentFieldKey('lista-ponderada', 'weight', index)] ?? ''}
                    onChange={(value) =>
                      onFieldChange(instrumentFieldKey('lista-ponderada', 'weight', index), value)
                    }
                  />
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground">
                    %
                  </span>
                </div>
              </td>
              <td className={cn('border p-1.5 text-center', accent.card, accent.border)}>
                <span
                  className={cn(
                    'inline-flex min-w-20 items-center justify-center rounded-lg bg-card px-2 py-2 font-black shadow-sm',
                    accent.text,
                  )}
                >
                  {scorePending
                    ? '—'
                    : decimals
                      ? formatInstrumentNumber(
                          Number(
                            fields[instrumentFieldKey('lista-ponderada', 'points', index)] ??
                              (Number(
                                fields[instrumentFieldKey('lista-ponderada', 'weight', index)] || 0,
                              ) /
                                100) *
                                maxScore,
                          ),
                        )
                      : Math.round(
                          Number(
                            fields[instrumentFieldKey('lista-ponderada', 'points', index)] ??
                              (Number(
                                fields[instrumentFieldKey('lista-ponderada', 'weight', index)] || 0,
                              ) /
                                100) *
                                maxScore,
                          ),
                        )}{' '}
                  pts
                </span>
              </td>
              <td className={cn('border bg-card', accent.border)}>
                <InstrumentRowMenu
                  onComplete={onCompleteCriterion ? () => onCompleteCriterion(index) : undefined}
                  completing={completingCriterionId === fields['lista-ponderada:criterion-id:' + index]}
                  completionDisabled={criterionRequestBusy}
                  canMoveDown={index < criteriaCount - 1}
                  canMoveUp={index > 0}
                  onDelete={() =>
                    fields[instrumentFieldKey('lista-ponderada', 'criterion', index)]?.trim() ||
                    fields[instrumentFieldKey('lista-ponderada', 'indicator', index)]?.trim()
                      ? setPendingDelete(index)
                      : removeCriterion(index)
                  }
                  onDuplicate={() => {
                    if (criteriaCount >= 20) return
                    onFieldsChange(
                      rebalanceInstrumentRows(
                        duplicateInstrumentRow(fields, 'lista-ponderada', index),
                        'lista-ponderada',
                        maxScore,
                      ),
                    )
                    onCriteriaCountChange(criteriaCount + 1)
                  }}
                  onMoveDown={() =>
                    onFieldsChange(
                      swapInstrumentRows(fields, 'lista-ponderada', index, index + 1, [
                        'criterion',
                        'indicator',
                        'weight',
                        'observation',
                      ]),
                    )
                  }
                  onMoveUp={() =>
                    onFieldsChange(
                      swapInstrumentRows(fields, 'lista-ponderada', index, index - 1, [
                        'criterion',
                        'indicator',
                        'weight',
                        'observation',
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
              colSpan={3}
            >
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4" />
                Ponderación máxima total
              </span>
              <span className="ml-2 text-[10px] font-medium text-muted-foreground">
                {status.detail}
              </span>
            </td>
            <td
              className={cn(
                'border px-2 py-2 text-center',
                accent.card,
                accent.border,
                status.tone === 'success'
                  ? 'text-success'
                  : status.tone === 'warning'
                    ? 'text-warning-foreground'
                    : 'text-destructive',
              )}
            >
              {formatInstrumentNumber(totalWeight)}/100 %
            </td>
            <td
              className={cn(
                'border px-2 py-2 text-center font-black',
                accent.card,
                accent.border,
                accent.text,
              )}
            >
              {scorePending ? '—' : formatInstrumentNumber(maxScore)} pts
            </td>
            <td className={cn('border', accent.card, accent.border)} />
          </tr>
        </tbody>
      </InstrumentTable>
      {pendingDelete !== null ? (
        <ConfirmDialog
          title="¿Eliminar este criterio?"
          description={`Se eliminará “${fields[instrumentFieldKey('lista-ponderada', 'criterion', pendingDelete)]}”, su indicador y ponderación.`}
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
