import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ChecklistInstrument } from '@/modules/activities/components/editor/ChecklistInstrument'
import {
  blockAccents,
  instrumentTitle,
  transientHighlightClass,
} from '@/modules/activities/components/editor/editorPresentation'
import {
  defaultRubricLevelPoints,
  defaultRubricStructure,
  distributeScore,
  EmptyInstrumentState,
  formatInstrumentNumber,
  inferInstrumentCount,
  inferRubricLevels,
  instrumentConfiguredValue,
  instrumentFieldKey,
  InstrumentSummaryItem,
  instrumentTextAlign,
  instrumentTextSize,
  instrumentTypographyClass,
  InstrumentTypographyControls,
  isInstrumentComplete,
  rubricDefaultLevelNames,
  scaleTemplateLevels,
} from '@/modules/activities/components/editor/instrumentEditorShared'
import { ReadOnlyInstrument } from '@/modules/activities/components/editor/ReadOnlyInstrument'
import { RubricInstrument } from '@/modules/activities/components/editor/RubricInstrument'
import { ScaleInstrument } from '@/modules/activities/components/editor/ScaleInstrument'
import { WeightedListInstrument } from '@/modules/activities/components/editor/WeightedListInstrument'
import { appendInstrumentCriterion } from '@/modules/activities/services/instrumentCriterionAddition'
import { competencyBlocks } from '@/modules/grading/utils/competencyGrades'
import { cn } from '@/utils/cn'
import { type InstrumentRecommendation } from '@aula/shared'
import { Eye, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function InstrumentPreview({
  accent,
  addingCriterion = false,
  onCompleteCriterion,
  completingCriterionId,
  criterionRequestBusy = false,
  activityName,
  block,
  completed,
  fields,
  highlight,
  instrumentType,
  maxScore,
  onAddCriterion,
  skipDefaults = false,
  onCompletedChange,
  onFieldsChange,
}: {
  accent: (typeof blockAccents)[number]
  addingCriterion?: boolean
  onCompleteCriterion?: (row: number) => void
  completingCriterionId?: string | null
  criterionRequestBusy?: boolean
  activityName: string
  block: (typeof competencyBlocks)[number]
  completed: boolean
  fields: Record<string, string>
  highlight?: boolean
  instrumentType: string
  maxScore: number
  onAddCriterion?: (onAdded: () => void) => void
  skipDefaults?: boolean
  onCompletedChange: (completed: boolean) => void
  onFieldsChange: (fields: Record<string, string>, automatic?: boolean) => void
}) {
  const title = instrumentTitle(instrumentType)
  const scorePending = fields[`${instrumentType}:meta:scorePending`] === 'true' || maxScore <= 0
  const rubricDefaults = defaultRubricStructure(maxScore)
  const [rubricCriteria, setRubricCriteria] = useState(
    () =>
      Number(fields['rubrica:meta:criteriaCount']) ||
      inferInstrumentCount(fields, 'rubrica', 'criterion', rubricDefaults.criteria),
  )
  const [rubricLevels, setRubricLevels] = useState(
    () =>
      Number(fields['rubrica:meta:levelCount']) || inferRubricLevels(fields, rubricDefaults.levels),
  )
  const [scaleCriteria, setScaleCriteria] = useState(
    () =>
      Number(fields['escala:meta:criteriaCount']) ||
      inferInstrumentCount(fields, 'escala', 'criterion', 5),
  )
  const [scaleLevels, setScaleLevels] = useState(
    () => Number(fields['escala:meta:levelCount']) || 4,
  )
  const [checklistCriteria, setChecklistCriteria] = useState(
    () =>
      Number(fields['lista-cotejo:meta:criteriaCount']) ||
      inferInstrumentCount(fields, 'lista-cotejo', 'criterion', 6),
  )
  const [weightedCriteria, setWeightedCriteria] = useState(
    () =>
      Number(fields['lista-ponderada:meta:criteriaCount']) ||
      inferInstrumentCount(fields, 'lista-ponderada', 'criterion', 5),
  )
  const [weightedHasPartial, setWeightedHasPartial] = useState(
    () => fields['lista-ponderada:meta:partial'] !== 'false',
  )
  const [showInstrumentPreview, setShowInstrumentPreview] = useState(false)
  const addCriterion = (onAdded: () => void) => {
    if (onAddCriterion) onAddCriterion(onAdded)
    else {
      const next = appendInstrumentCriterion(
        fields,
        instrumentType as InstrumentRecommendation['instrumentType'],
        maxScore > 0 ? maxScore : null,
        undefined,
        null,
      )
      onFieldsChange(next.fields)
      onAdded()
    }
  }
  const editorRef = useRef<HTMLElement>(null)
  const isComplete = isInstrumentComplete({
    checklistCriteria,
    fields,
    instrumentType,
    maxScore,
    rubricCriteria,
    rubricLevels,
    scaleCriteria,
    weightedCriteria,
  })

  useEffect(() => {
    if (completed !== isComplete) {
      onCompletedChange(isComplete)
    }
  }, [completed, isComplete, onCompletedChange])

  useEffect(() => {
    if (!instrumentType || skipDefaults) return
    const next = { ...fields }
    const titleKey = instrumentFieldKey(instrumentType, 'title')
    if (!next[titleKey])
      next[titleKey] =
        `${instrumentTitle(instrumentType).replace(' de evaluación', '')} para ${activityName.trim() || 'la actividad'}`
    if (instrumentType === 'rubrica') {
      next['rubrica:meta:criteriaCount'] = String(rubricCriteria)
      next['rubrica:meta:levelCount'] = String(rubricLevels)
      const automaticPoints = distributeScore(maxScore, rubricCriteria)
      for (let index = 0; index < rubricCriteria; index += 1) {
        const pointsKey = instrumentFieldKey('rubrica', 'points', index)
        if (!scorePending && next[pointsKey] === undefined)
          next[pointsKey] = String(automaticPoints[index])
      }
      for (let index = 0; index < rubricLevels; index += 1) {
        const score = rubricLevels - index
        const nameKey = instrumentFieldKey('rubrica', 'level-name', score)
        if (!next[nameKey]) next[nameKey] = rubricDefaultLevelNames(rubricLevels)[index]
        const levelPointsKey = instrumentFieldKey('rubrica', 'level-points', score)
        if (next[levelPointsKey] === undefined)
          next[levelPointsKey] = String(
            defaultRubricLevelPoints(automaticPoints[0] || maxScore, rubricLevels)[index],
          )
      }
    }
    if (instrumentType === 'escala') {
      next['escala:meta:criteriaCount'] = String(scaleCriteria)
      next['escala:meta:levelCount'] = String(scaleLevels)
      distributeScore(maxScore, scaleCriteria).forEach((points, index) => {
        const key = instrumentFieldKey('escala', 'points', index)
        if (!scorePending && next[key] === undefined) next[key] = String(points)
      })
      const scaleDefaults = scaleTemplateLevels(next['escala:meta:template'] || 'frecuencia')
      for (let index = 0; index < scaleLevels; index += 1) {
        const score = scaleLevels - index
        if (!next[instrumentFieldKey('escala', 'level-name', score)])
          next[instrumentFieldKey('escala', 'level-name', score)] =
            scaleDefaults[index]?.name || `Nivel ${index + 1}`
        if (!next[instrumentFieldKey('escala', 'level-points', score)])
          next[instrumentFieldKey('escala', 'level-points', score)] = String(
            scaleDefaults[index]?.points ?? score,
          )
      }
    }
    if (instrumentType === 'lista-cotejo') {
      next['lista-cotejo:meta:criteriaCount'] = String(checklistCriteria)
      distributeScore(maxScore, checklistCriteria).forEach((points, index) => {
        const key = instrumentFieldKey('lista-cotejo', 'points', index)
        if (!scorePending && next[key] === undefined) next[key] = String(points)
      })
    }
    if (instrumentType === 'lista-ponderada') {
      next['lista-ponderada:meta:criteriaCount'] = String(weightedCriteria)
      distributeScore(100, weightedCriteria).forEach((weight, index) => {
        const key = instrumentFieldKey('lista-ponderada', 'weight', index)
        if (!next[key]) next[key] = String(weight)
      })
    }
    if (JSON.stringify(next) !== JSON.stringify(fields)) onFieldsChange(next, true)
  }, [
    activityName,
    checklistCriteria,
    fields,
    instrumentType,
    maxScore,
    onFieldsChange,
    rubricCriteria,
    rubricLevels,
    scaleCriteria,
    scaleLevels,
    scorePending,
    weightedCriteria,
  ])

  useEffect(() => {
    if (!highlight) return
    const timeout = window.setTimeout(() => {
      const emptyField = Array.from(
        editorRef.current?.querySelectorAll<HTMLTextAreaElement>('textarea') ?? [],
      ).find((field) => !field.value.trim())
      emptyField?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'center',
      })
      emptyField?.focus()
    }, 80)
    return () => window.clearTimeout(timeout)
  }, [highlight, instrumentType])

  function updateField(key: string, value: string) {
    onFieldsChange({ ...fields, [key]: value })
  }

  const criterionCount =
    instrumentType === 'rubrica'
      ? rubricCriteria
      : instrumentType === 'escala'
        ? scaleCriteria
        : instrumentType === 'lista-cotejo'
          ? checklistCriteria
          : weightedCriteria
  const configuredValue = instrumentConfiguredValue(instrumentType, fields, criterionCount)
  const configuredTarget = instrumentType === 'lista-ponderada' ? 100 : maxScore
  const configuredMatches = scorePending
    ? instrumentType === 'lista-ponderada' && Math.abs(configuredValue - 100) < 0.001
    : Math.abs(configuredValue - configuredTarget) < 0.001
  const textSize = instrumentTextSize(instrumentType, fields)
  const boldText = fields[`${instrumentType}:meta:bold`] === 'true'
  const textAlign = instrumentTextAlign(instrumentType, fields)
  const typographyControls = (
    <InstrumentTypographyControls
      textSize={textSize}
      textAlign={textAlign}
      bold={boldText}
      onTextSizeChange={(value) => updateField(`${instrumentType}:meta:textSize`, value)}
      onTextAlignChange={(value) => updateField(`${instrumentType}:meta:textAlign`, value)}
      onBoldChange={(value) => updateField(`${instrumentType}:meta:bold`, String(value))}
    />
  )

  return (
    <section
      ref={editorRef}
      className={cn(
        'overflow-hidden rounded-xl border bg-card shadow-sm',
        accent.border,
        highlight ? transientHighlightClass : '',
      )}
    >
      <div className="h-1" style={{ background: accent.gradient }} />
      <div className="px-4 py-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">
            Instrumento seleccionado
          </p>
          <h3 className={cn('mt-1 text-xl font-black', accent.text)}>{title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Construye el instrumento que utilizarás para evaluar esta actividad.
          </p>
        </div>
      </div>

      {instrumentType ? (
        <div className="border-y border-border bg-muted/10 px-4 py-3">
          <div className="grid items-end gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
            <label className="block text-xs font-black text-muted-foreground">
              Título del instrumento
              <Input
                className="mt-1.5 h-10 bg-card"
                value={fields[instrumentFieldKey(instrumentType, 'title')] ?? ''}
                onChange={(event) =>
                  updateField(instrumentFieldKey(instrumentType, 'title'), event.target.value)
                }
                placeholder={`Ej. ${title} para la actividad`}
              />
            </label>
            <Button
              type="button"
              variant="outline"
              className="h-10"
              onClick={() => setShowInstrumentPreview(true)}
            >
              <Eye className="size-4" />
              Vista previa
            </Button>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
            <InstrumentSummaryItem
              label="Actividad"
              value={scorePending ? '—' : `${formatInstrumentNumber(maxScore)} puntos`}
            />
            <InstrumentSummaryItem
              label={instrumentType === 'escala' ? 'Indicadores' : 'Criterios'}
              value={String(criterionCount)}
            />
            <InstrumentSummaryItem
              label={instrumentType === 'lista-ponderada' ? 'Ponderación actual' : 'Niveles'}
              value={
                instrumentType === 'lista-ponderada'
                  ? `${configuredValue}/100 %`
                  : instrumentType === 'rubrica'
                    ? String(rubricLevels)
                    : instrumentType === 'escala'
                      ? String(scaleLevels)
                      : 'No aplica'
              }
              good={instrumentType === 'lista-ponderada' ? configuredMatches : undefined}
            />
            <InstrumentSummaryItem
              label="Puntuación configurada"
              value={
                scorePending
                  ? '—'
                  : instrumentType === 'lista-ponderada'
                    ? `${formatInstrumentNumber(maxScore)} pts`
                    : `${configuredValue}/${formatInstrumentNumber(maxScore)} pts`
              }
              good={scorePending ? undefined : configuredMatches}
            />
            <InstrumentSummaryItem
              label="Estado"
              value={
                scorePending
                  ? isComplete
                    ? 'Listo para revisar'
                    : 'Faltan contenidos'
                  : isComplete
                    ? 'Listo para revisar'
                    : configuredMatches
                      ? 'Faltan contenidos'
                      : `Faltan ${formatInstrumentNumber(Math.max(0, configuredTarget - configuredValue))}${instrumentType === 'lista-ponderada' ? '%' : ' pts'}`
              }
              good={scorePending ? undefined : isComplete}
            />
          </div>
        </div>
      ) : null}

      <div className={cn('p-4', instrumentTypographyClass(instrumentType, fields))}>
        {instrumentType === 'rubrica' ? (
          <RubricInstrument
            addingCriterion={addingCriterion}
            onCompleteCriterion={onCompleteCriterion}
            completingCriterionId={completingCriterionId}
            criterionRequestBusy={criterionRequestBusy}
            criteriaCount={rubricCriteria}
            fields={fields}
            levelCount={rubricLevels}
            maxScore={maxScore}
            accent={accent}
            onFieldChange={updateField}
            onAddCriterion={() => addCriterion(() => setRubricCriteria((value) => value + 1))}
            onCriteriaCountChange={setRubricCriteria}
            onFieldsChange={onFieldsChange}
            onLevelCountChange={setRubricLevels}
            typographyControls={typographyControls}
          />
        ) : null}
        {instrumentType === 'escala' ? (
          <ScaleInstrument
            addingCriterion={addingCriterion}
            onCompleteCriterion={onCompleteCriterion}
            completingCriterionId={completingCriterionId}
            criterionRequestBusy={criterionRequestBusy}
            criteriaCount={scaleCriteria}
            fields={fields}
            levelCount={scaleLevels}
            maxScore={maxScore}
            accent={accent}
            onFieldsChange={onFieldsChange}
            onFieldChange={updateField}
            onAddCriterion={() => addCriterion(() => setScaleCriteria((value) => value + 1))}
            onCriteriaCountChange={setScaleCriteria}
            onLevelCountChange={setScaleLevels}
            typographyControls={typographyControls}
          />
        ) : null}
        {instrumentType === 'lista-cotejo' ? (
          <ChecklistInstrument
            addingCriterion={addingCriterion}
            onCompleteCriterion={onCompleteCriterion}
            completingCriterionId={completingCriterionId}
            criterionRequestBusy={criterionRequestBusy}
            criteriaCount={checklistCriteria}
            fields={fields}
            maxScore={maxScore}
            accent={accent}
            onFieldsChange={onFieldsChange}
            onFieldChange={updateField}
            onAddCriterion={() => addCriterion(() => setChecklistCriteria((value) => value + 1))}
            onCriteriaCountChange={setChecklistCriteria}
            typographyControls={typographyControls}
          />
        ) : null}
        {instrumentType === 'lista-ponderada' ? (
          <WeightedListInstrument
            addingCriterion={addingCriterion}
            onCompleteCriterion={onCompleteCriterion}
            completingCriterionId={completingCriterionId}
            criterionRequestBusy={criterionRequestBusy}
            criteriaCount={weightedCriteria}
            fields={fields}
            hasPartial={weightedHasPartial}
            maxScore={maxScore}
            accent={accent}
            onFieldsChange={onFieldsChange}
            onFieldChange={updateField}
            onAddCriterion={() => addCriterion(() => setWeightedCriteria((value) => value + 1))}
            onCriteriaCountChange={setWeightedCriteria}
            onHasPartialChange={setWeightedHasPartial}
            typographyControls={typographyControls}
          />
        ) : null}
        {!instrumentType ? <EmptyInstrumentState /> : null}
      </div>
      {showInstrumentPreview ? (
        <InstrumentPreviewModal
          accent={accent}
          activityName={activityName}
          block={block}
          fields={fields}
          instrumentType={instrumentType}
          maxScore={maxScore}
          onClose={() => setShowInstrumentPreview(false)}
        />
      ) : null}
    </section>
  )
}

export function InstrumentPreviewModal({
  accent,
  activityName,
  block,
  fields,
  instrumentType,
  maxScore,
  onClose,
  returnLabel = 'Volver a editar',
}: {
  accent: (typeof blockAccents)[number]
  activityName: string
  block: (typeof competencyBlocks)[number]
  fields: Record<string, string>
  instrumentType: string
  maxScore: number
  onClose: () => void
  returnLabel?: string
}) {
  const scoreLabel =
    maxScore > 0 && fields[`${instrumentType}:meta:scorePending`] !== 'true'
      ? formatInstrumentNumber(maxScore)
      : '—'
  const title =
    fields[instrumentFieldKey(instrumentType, 'title')] || instrumentTitle(instrumentType)
  const criteriaCount =
    Number(fields[`${instrumentType}:meta:criteriaCount`]) ||
    inferInstrumentCount(fields, instrumentType, 'criterion', 0)
  const levelCount =
    instrumentType === 'rubrica'
      ? Number(fields['rubrica:meta:levelCount']) || inferRubricLevels(fields, 0)
      : instrumentType === 'escala'
        ? Number(fields['escala:meta:levelCount']) || 0
        : 0
  return (
    <Modal
      title={`Vista previa de ${instrumentTitle(instrumentType).toLocaleLowerCase()}`}
      onClose={onClose}
      className="max-h-[90vh] max-w-[94vw] rounded-xl"
      hideHeader
    >
      <div className="flex max-h-[90vh] flex-col">
        <div className="h-1.5 shrink-0" style={{ background: accent.gradient }} />
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div>
            <p className={cn('text-xs font-black uppercase tracking-[0.14em]', accent.text)}>
              Vista previa · Solo lectura
            </p>
            <h3 className="mt-1 text-xl font-black text-foreground">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Actividad: {activityName || 'Sin nombre'} · {block.shortName} · {scoreLabel} puntos ·{' '}
              {criteriaCount} {instrumentType === 'escala' ? 'indicadores' : 'criterios'}
              {levelCount ? ` · ${levelCount} niveles` : ''}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Cerrar vista previa"
            onClick={onClose}
          >
            <X className="size-5" />
          </Button>
        </header>
        <div className="min-h-0 flex-1 overflow-auto bg-muted/10 p-6">
          <ReadOnlyInstrument
            type={instrumentType}
            fields={fields}
            maxScore={maxScore}
            accent={accent}
          />
        </div>
        <footer className="flex shrink-0 justify-end border-t border-border bg-card px-6 py-4">
          <Button type="button" className={accent.button} onClick={onClose}>
            {returnLabel}
          </Button>
        </footer>
      </div>
    </Modal>
  )
}
