import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { ResourcePicker } from '@/modules/activities/components/editor/ActivityResources'
import {
  type ActivityCompletionTarget,
  type ActivityDraft,
} from '@/modules/activities/components/editor/editorModel'
import {
  blockAccents,
  transientHighlightClass,
} from '@/modules/activities/components/editor/editorPresentation'
import { type ActivityInterpretation } from '@/modules/activities/services/instrumentPreparation'
import type { CourseTeam } from '@/modules/courses/types'
import { ActivityDescriptionEditor as StructuredActivityDescriptionEditor } from '@/modules/grading/components/ActivityDescriptionEditor'
import { useActivityEditorProfile } from './ActivityEditorProfile'

import { cn } from '@/utils/cn'
import { Blocks, Box, CheckCircle2, FileText, Target, Users } from 'lucide-react'
import { type ReactNode } from 'react'
import { evaluationTechniqueOptions } from './editorPresentation'

export { evaluationTechniqueOptions } from './editorPresentation'

export function CompetencyDistributionField({
  activityDraft,
  highlight,
  onChangeDraft,
}: {
  activityDraft: ActivityDraft
  highlight?: string
  onChangeDraft: (draft: ActivityDraft) => void
}) {
  const competencyBlocks = useActivityEditorProfile().blocks
  const weights = activityDraft.competencyBlockWeights
  const selectedBlocks = competencyBlocks.filter((block) => (weights[block.id] ?? 0) > 0)
  const weighted = selectedBlocks.some((block) => weights[block.id] !== 1)
  const total = selectedBlocks.reduce((sum, block) => sum + weights[block.id], 0)

  function changeWeights(next: Record<string, number>) {
    onChangeDraft({ ...activityDraft, competencyBlockWeights: next })
  }

  function toggleBlock(blockId: string, checked: boolean) {
    const next = { ...weights }
    if (checked) next[blockId] = weighted ? 0 : 1
    else delete next[blockId]
    if (weighted) {
      const ids = Object.keys(next)
      const equalWeight = 1 / ids.length
      ids.forEach((id) => {
        next[id] = equalWeight
      })
    }
    changeWeights(next)
  }

  function setMode(mode: 'same' | 'weighted') {
    const ids = selectedBlocks.map((block) => block.id)
    const value = mode === 'same' ? 1 : 1 / ids.length
    changeWeights(Object.fromEntries(ids.map((id) => [id, value])))
  }

  return (
    <div className={cn('space-y-3', highlight)}>
      <div>
        <p className="text-sm font-bold text-foreground">Selecciona uno o varios bloques</p>
        <p className="mt-1 text-xs text-muted-foreground">
          El bloque desde el que abriste la actividad se mantiene como principal.
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {competencyBlocks.map((block) => {
          const selected = (weights[block.id] ?? 0) > 0
          const primary = block.id === activityDraft.competencyBlockId
          return (
            <label
              key={block.id}
              className={cn(
                'flex min-h-14 items-start gap-3 rounded-xl border p-3 transition',
                selected
                  ? 'border-primary/40 bg-primary/8'
                  : 'border-border bg-card hover:border-primary/30',
              )}
            >
              <input
                type="checkbox"
                className="mt-0.5 size-4 accent-primary"
                checked={selected}
                disabled={primary}
                onChange={(event) => toggleBlock(block.id, event.target.checked)}
              />
              <span className="min-w-0">
                <strong className="block text-sm text-foreground">{block.shortName}</strong>
                <span className="line-clamp-2 text-xs text-muted-foreground">{block.name}</span>
                {primary ? (
                  <span className="mt-1 block text-[10px] font-bold text-primary">Principal</span>
                ) : null}
              </span>
            </label>
          )
        })}
      </div>

      {selectedBlocks.length > 1 ? (
        <div className="rounded-xl border border-border bg-muted/20 p-3">
          <p className="text-sm font-bold text-foreground">¿Cómo se distribuye la calificación?</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              aria-pressed={!weighted}
              onClick={() => setMode('same')}
              className={cn(
                'min-h-11 rounded-xl border px-3 text-left text-sm transition',
                !weighted
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/30',
              )}
            >
              <strong className="block">Misma calificación</strong>
              <span className="text-xs">La nota completa cuenta en cada bloque.</span>
            </button>
            <button
              type="button"
              aria-pressed={weighted}
              onClick={() => setMode('weighted')}
              className={cn(
                'min-h-11 rounded-xl border px-3 text-left text-sm transition',
                weighted
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/30',
              )}
            >
              <strong className="block">Ponderar por bloque</strong>
              <span className="text-xs">Distribuye el 100 % entre las competencias.</span>
            </button>
          </div>
          {weighted ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {selectedBlocks.map((block) => (
                <label
                  key={block.id}
                  className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 text-xs font-bold text-foreground"
                >
                  <span>{block.shortName}</span>
                  <span className="flex items-center gap-1">
                    <Input
                      aria-label={`Peso de ${block.shortName}`}
                      className="h-9 w-20 text-right"
                      type="number"
                      min={1}
                      max={100}
                      step={1}
                      value={Math.round(weights[block.id] * 1000) / 10}
                      onChange={(event) =>
                        changeWeights({ ...weights, [block.id]: Number(event.target.value) / 100 })
                      }
                    />
                    <span>%</span>
                  </span>
                </label>
              ))}
              <p
                className={cn(
                  'sm:col-span-2 text-right text-xs font-bold',
                  Math.abs(total - 1) < 0.001 ? 'text-success' : 'text-destructive',
                )}
              >
                Total: {Math.round(total * 1000) / 10} %
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export const pedagogicalActivityLabels: Record<string, string> = {
  NEWSCAST: 'Noticiero',
  NEWS_ANALYSIS: 'Análisis de noticia',
  NEWS_COMPARISON: 'Comparación de noticias',
  NEWS_WRITING: 'Redacción de noticia',
  TOURIST_GUIDE_CREATION: 'Elaboración de guía turística',
  TOURIST_GUIDE_ANALYSIS: 'Análisis de guía turística',
  TOURIST_GUIDE_PRESENTATION: 'Presentación de guía turística',
  TOURIST_GUIDE_COMPARISON: 'Comparación de guías turísticas',
  READING_REPORT_WRITING: 'Elaboración de informe de lectura',
  READING_REPORT_ANALYSIS: 'Análisis de informe de lectura',
  READING_REPORT_PRESENTATION: 'Presentación de informe de lectura',
  READING_REPORT_COMPARISON: 'Comparación de informes de lectura',
  POSTER_CREATION: 'Elaboración de afiche',
  POSTER_ANALYSIS: 'Análisis de afiche',
  POSTER_COMPARISON: 'Comparación de afiches',
  POSTER_PRESENTATION: 'Presentación de afiche',
  DETECTIVE_STORY_WRITING: 'Escritura de cuento policíaco',
  DETECTIVE_STORY_ANALYSIS: 'Análisis de cuento policíaco',
  DETECTIVE_STORY_NARRATION: 'Narración de cuento policíaco',
  DETECTIVE_STORY_COMPARISON: 'Comparación de cuentos policíacos',
  DETECTIVE_STORY_ANALYSIS_PRESENTATION: 'Presentación del análisis del cuento',
  CALLIGRAM_CREATION: 'Creación de caligrama',
  CALLIGRAM_ANALYSIS: 'Análisis de caligrama',
  CALLIGRAM_COMPARISON: 'Comparación de caligramas',
  CALLIGRAM_RECITATION: 'Recitación de caligrama',
  CALLIGRAM_EXPLANATION: 'Explicación de caligrama',
  EXPOSITION: 'Exposición',
  ORAL_PRESENTATION: 'Presentación oral',
  DEBATE: 'Debate',
  EXPERIMENT: 'Experimento',
  LAB_PRACTICE: 'Práctica de laboratorio',
  WRITTEN_PRODUCTION: 'Producción escrita',
  ESSAY: 'Ensayo',
  REPORT: 'Informe',
  ANALYSIS: 'Análisis',
  COMPARISON: 'Comparación',
  RESEARCH: 'Investigación',
  PROJECT: 'Proyecto',
  PROBLEM_SOLVING: 'Resolución de problemas',
  EXERCISE_SET: 'Ejercicios',
  CONCEPT_MAP: 'Mapa conceptual',
  PORTFOLIO: 'Portafolio',
  ARTISTIC_PRODUCTION: 'Producción artística',
  PERFORMANCE: 'Representación',
  MOTOR_SPORTS_PRACTICE: 'Práctica motriz',
  OBSERVATION: 'Observación',
  QUIZ_TEST: 'Prueba',
  OTHER: 'Otra actividad',
}

export function availablePedagogicalActivityType(
  id: string,
  firstSecondaryLanguage: boolean,
  secondSecondaryLanguage: boolean,
) {
  return (
    firstSecondaryLanguage ||
    (secondSecondaryLanguage
      ? !/^(?:POSTER|DETECTIVE_STORY|CALLIGRAM)/.test(id)
      : !/^(?:NEWS|TOURIST_GUIDE|READING_REPORT|POSTER|DETECTIVE_STORY|CALLIGRAM)/.test(id))
  )
}

export function ActivityDataSections({
  activityDraft,
  teams,
  accent,
  highlightTarget,
  onChangeDraft,
  onScoreChange,
  onInstrumentTypeChange,
  requiredFieldError,
  firstSecondaryLanguage,
  secondSecondaryLanguage,
  structuralLocked = false,
}: {
  structuralLocked?: boolean
  activityDraft: ActivityDraft
  teams: CourseTeam[]
  accent: (typeof blockAccents)[number]
  highlightTarget: ActivityCompletionTarget | null
  onChangeDraft: (draft: ActivityDraft) => void
  onScoreChange: (value: string) => void
  onInstrumentTypeChange?: (instrumentType: string) => void
  interpretation: ActivityInterpretation | null
  requiredFieldError: string
  firstSecondaryLanguage?: boolean
  secondSecondaryLanguage?: boolean
}) {
  const highlight = (target: ActivityCompletionTarget) =>
    highlightTarget === target ? transientHighlightClass : ''
  return (
    <div className="space-y-4">
      <CreationFormSection
        icon={<Blocks className="size-4" />}
        number={1}
        title="Bloques de competencias"
        accent={accent}
      >
        <fieldset disabled={structuralLocked} data-activity-required="competencyBlocks">
          <CompetencyDistributionField
            activityDraft={activityDraft}
            highlight={highlight('competencyBlocks')}
            onChangeDraft={onChangeDraft}
          />
        </fieldset>
      </CreationFormSection>

      <CreationFormSection
        icon={<FileText className="size-4" />}
        number={2}
        title="Actividad"
        accent={accent}
      >
        <div className="space-y-4">
          <label
            data-activity-required="name"
            className={cn('space-y-1.5 text-sm font-bold', highlight('name'))}
          >
            Nombre de la actividad <span className="text-destructive">*</span>
            <Input
              className="h-11"
              value={activityDraft.name}
              onChange={(event) => onChangeDraft({ ...activityDraft, name: event.target.value })}
              placeholder="Ej: Exposición oral sobre el cambio climático"
            />
          </label>
          <div data-activity-required="description" className={highlight('description')}>
            <StructuredActivityDescriptionEditor
              value={activityDraft.description}
              onChange={(description) => onChangeDraft({ ...activityDraft, description })}
            />
          </div>
          <label className="block space-y-1.5 text-sm font-bold">
            Tipo de actividad
            <Select
              disabled={structuralLocked}
              className="h-11"
              value={activityDraft.pedagogicalActivityType ?? ''}
              onChange={(event) =>
                onChangeDraft({
                  ...activityDraft,
                  pedagogicalActivityType: event.target.value,
                  autoDetectedPedagogicalActivityType: event.target.value === '',
                })
              }
            >
              <option value="">Detectar automáticamente</option>
              {Object.entries(pedagogicalActivityLabels)
                .filter(([id]) =>
                  availablePedagogicalActivityType(
                    id,
                    Boolean(firstSecondaryLanguage),
                    Boolean(secondSecondaryLanguage),
                  ),
                )
                .map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
            </Select>
          </label>
        </div>
      </CreationFormSection>

      <CreationFormSection
        icon={<Users className="size-4" />}
        number={3}
        title="Modalidad"
        accent={accent}
      >
        <fieldset
          disabled={structuralLocked}
          data-activity-required="activityType"
          className={cn('grid gap-3 sm:grid-cols-2', highlight('activityType'))}
        >
          {(
            [
              {
                id: 'individual',
                title: 'Individual',
                detail: 'Cada estudiante realiza la actividad de forma individual.',
              },
              {
                id: 'group',
                title: 'Grupal',
                detail: 'La actividad se realiza en grupos de estudiantes.',
              },
            ] as const
          ).map((option) => (
            <button
              key={option.id}
              type="button"
              className={cn(
                'relative flex min-h-24 items-center gap-4 rounded-xl border p-4 text-left transition',
                activityDraft.activityType === option.id
                  ? cn(accent.card, accent.text, 'shadow-sm')
                  : 'border-border bg-card hover:border-primary/50',
              )}
              onClick={() => onChangeDraft({ ...activityDraft, activityType: option.id })}
            >
              <span
                className={cn(
                  'grid size-11 shrink-0 place-items-center rounded-full',
                  activityDraft.activityType === option.id
                    ? cn(accent.progress, 'text-white')
                    : 'bg-muted text-muted-foreground',
                )}
              >
                <Users className="size-5" />
              </span>
              <span>
                <span className="block font-black">{option.title}</span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  {option.detail}
                </span>
              </span>
              {activityDraft.activityType === option.id ? (
                <CheckCircle2 className="absolute right-3 top-3 size-5" />
              ) : null}
            </button>
          ))}
        </fieldset>

        {activityDraft.activityType === 'group' ? (
          <div className="mt-4 rounded-xl border border-border bg-muted/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-black">Equipos de esta asignatura</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Reutiliza los equipos existentes sin volver a organizar estudiantes.
                </p>
              </div>
              <span className="text-xs font-bold text-primary">
                {(activityDraft.teamIds ?? []).length} seleccionados
              </span>
            </div>
            {teams.length ? (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {teams.map((team) => {
                  const selected = (activityDraft.teamIds ?? []).includes(team.id)
                  return (
                    <label
                      key={team.id}
                      className={cn(
                        'flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3 transition',
                        selected
                          ? cn(accent.card, accent.text)
                          : 'border-border bg-card hover:border-primary/40',
                      )}
                    >
                      <input
                        disabled={structuralLocked}
                        type="checkbox"
                        checked={selected}
                        onChange={() =>
                          onChangeDraft({
                            ...activityDraft,
                            teamIds: selected
                              ? (activityDraft.teamIds ?? []).filter((id) => id !== team.id)
                              : [...(activityDraft.teamIds ?? []), team.id],
                          })
                        }
                        className="size-4 rounded accent-primary"
                      />
                      <span
                        className="grid size-8 place-items-center rounded-full text-xs font-black text-white"
                        style={{ backgroundColor: team.color }}
                      >
                        {team.name.charAt(0)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-black">{team.name}</span>
                        <span className="block text-[10px] text-muted-foreground">
                          {team.members.length} integrantes ·{' '}
                          {team.teamType === 'permanent' ? 'Permanente' : 'Temporal'}
                        </span>
                      </span>
                    </label>
                  )
                })}
              </div>
            ) : (
              <p className="mt-3 rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                No hay equipos activos en esta asignatura. Créelos desde la pestaña Equipos.
              </p>
            )}
          </div>
        ) : null}
      </CreationFormSection>

      <CreationFormSection
        icon={<Target className="size-4" />}
        number={4}
        title="Evaluación"
        accent={accent}
      >
        <div className="grid gap-3 md:grid-cols-2">
          <label
            data-activity-required="evaluationTechnique"
            className={cn('space-y-1.5 text-sm font-bold', highlight('evaluationTechnique'))}
          >
            Técnica de evaluación <span className="text-destructive">*</span>
            <Select
              className="h-11"
              value={activityDraft.evaluationTechnique}
              onChange={(event) =>
                onChangeDraft({
                  ...activityDraft,
                  evaluationTechnique: event.target.value,
                  autoSelectedEvaluationTechnique: event.target.value === '',
                })
              }
            >
              <option value="">Seleccionar automáticamente</option>
              {evaluationTechniqueOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </label>
          <label
            data-activity-required="instrumentType"
            className={cn('space-y-1.5 text-sm font-bold', highlight('instrumentType'))}
          >
            Tipo de instrumento
            <Select
              disabled={structuralLocked}
              className="h-11"
              value={activityDraft.instrumentType}
              onChange={(event) => onInstrumentTypeChange?.(event.target.value)}
            >
              <option value="">Seleccionar automáticamente</option>
              <option value="rubrica">Rúbrica</option>
              <option value="lista-cotejo">Lista de cotejo</option>
              <option value="escala">Escala estimativa</option>
              <option value="lista-ponderada">Lista ponderada</option>
            </Select>
          </label>
          <label
            data-activity-required="maxScore"
            className={cn('space-y-1.5 text-sm font-bold', highlight('maxScore'))}
          >
            Valor en puntos <span className="text-destructive">*</span>
            <div className="relative">
              <Input
                disabled={structuralLocked}
                aria-invalid={requiredFieldError.startsWith('Indica el valor')}
                className="h-11 pr-12 font-black"
                type="text"
                inputMode="decimal"
                value={activityDraft.maxScore}
                onChange={(event) => onScoreChange(event.target.value)}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground">
                pts
              </span>
            </div>
            {requiredFieldError.startsWith('Indica el valor') ? (
              <span className="text-xs text-destructive">{requiredFieldError}</span>
            ) : null}
          </label>
        </div>
      </CreationFormSection>

      <CreationFormSection
        icon={<Box className="size-4" />}
        number={5}
        title="Recursos"
        optional
        accent={accent}
      >
        <ResourcePicker
          resources={activityDraft.resources}
          onChange={(resources) => onChangeDraft({ ...activityDraft, resources })}
        />
      </CreationFormSection>
    </div>
  )
}

export function CreationFormSection({
  accent,
  children,
  icon,
  number,
  optional = false,
  title,
}: {
  accent: (typeof blockAccents)[number]
  children: ReactNode
  icon: ReactNode
  number: number
  optional?: boolean
  title: string
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-black text-foreground">
        <span className={cn('grid size-7 place-items-center rounded-lg', accent.card, accent.text)}>
          {icon}
        </span>
        <span>
          {number}. {title}
        </span>
        {optional ? (
          <span className="text-xs font-medium text-muted-foreground">(Opcional)</span>
        ) : null}
      </div>
      {children}
    </section>
  )
}
