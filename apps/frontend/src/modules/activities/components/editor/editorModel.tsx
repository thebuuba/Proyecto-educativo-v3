import { activityDescriptionText } from '@/modules/activities/components/editor/editorPresentation'
import {
  alignRecommendationWithFields,
  preparationFingerprint,
} from '@/modules/activities/services/instrumentPreparation'
import {
  scoreInstrumentFields,
  scoreRecommendation,
} from '@/modules/activities/services/instrumentScoring'
import type { Activity, ActivityCreatorOrigin } from '@/modules/activities/types'
import {
  activityDraftProgress,
  validateActivityDraft,
} from '@/modules/activities/utils/activityDraftStorage'
import {
  activityCompetencyWeights,
  competencyBlocks,
  type CompetencyBlockId,
} from '@/modules/grading/utils/competencyGrades'
import { type InstrumentRecommendation } from '@aula/shared'

export type ActivityDraft = {
  creationId?: string
  evidenceInstructions?: string
  planningId?: string
  creatorOrigin?: ActivityCreatorOrigin
  source?: Activity['source']
  futurePlanningLink?: string
  futureInstrumentLink?: string
  draftId?: string
  updatedAt?: string
  name: string
  maxScore: string
  competencyBlockId: string
  competencyBlockWeights: Record<string, number>
  date: string
  description: string
  studentRole: string
  teacherRole: string
  instrumentType: string
  instrumentId?: string
  evaluationTechnique: string
  autoSelectedEvaluationTechnique?: boolean
  instrumentCompleted: boolean
  instrumentFields: Record<string, string>
  pedagogicalActivityType?: string
  autoDetectedPedagogicalActivityType?: boolean
  autoSelectedInstrumentType?: boolean
  selectedCurriculumElementIds?: string[]
  preparedRecommendation?: InstrumentRecommendation
  preparedFingerprint?: string
  preparedManuallyEdited?: boolean
  manualInstrumentBlank?: boolean
  instrumentGeneration?: number
  resources: string[]
  planningMoment: string
  observations: string
  activityType: '' | 'individual' | 'group'
  teamIds: string[]
}

export type ActivityDraftsByBlock = Partial<Record<CompetencyBlockId, ActivityDraft[]>>

export type ActivityCompletionTarget =
  | 'competencyBlocks'
  | 'name'
  | 'maxScore'
  | 'evaluationTechnique'
  | 'activityType'
  | 'instrumentType'
  | 'instrumentBody'
  | 'description'

export type ActivityCompletionIssue = {
  detail: string
  target: ActivityCompletionTarget
  title: string
}

export type ActivityDraftMeta = {
  block: (typeof competencyBlocks)[number]
  blockId: CompetencyBlockId
  completion: number
  draft: ActivityDraft
  missingSummary: string
  pendingIssues: ActivityCompletionIssue[]
  updatedAt: string
}

export const emptyActivityDraft: ActivityDraft = {
  name: '',
  maxScore: '',
  competencyBlockId: competencyBlocks[0].id,
  competencyBlockWeights: { [competencyBlocks[0].id]: 1 },
  date: '',
  description: '',
  studentRole: '',
  teacherRole: '',
  instrumentType: '',
  evaluationTechnique: '',
  instrumentCompleted: false,
  instrumentFields: {},
  pedagogicalActivityType: '',
  resources: [],
  planningMoment: '',
  observations: '',
  activityType: '',
  teamIds: [],
}

export function createDraftId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `draft-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function buildActivityDraftMetas(drafts: ActivityDraftsByBlock): ActivityDraftMeta[] {
  return competencyBlocks.flatMap((block) =>
    (drafts[block.id] ?? []).map((draft) => buildActivityDraftMeta(draft, block.id)),
  )
}

export function buildActivityDraftMeta(
  draft: ActivityDraft,
  blockId: CompetencyBlockId,
): ActivityDraftMeta {
  const block = competencyBlocks.find((item) => item.id === blockId) ?? competencyBlocks[0]
  const pendingIssues = validateActivityCompletion(draft)
  const { completion } = activityDraftProgress(draft)

  return {
    block,
    blockId,
    completion,
    draft,
    missingSummary: draftMissingSummary(pendingIssues),
    pendingIssues,
    updatedAt: draft.updatedAt ?? new Date().toISOString(),
  }
}

export function draftMissingSummary(issues: ActivityCompletionIssue[]) {
  if (issues.length === 0) return 'Lista para guardar como actividad'
  const instrumentIssue = issues.some(
    (issue) => issue.target === 'instrumentBody' || issue.target === 'instrumentType',
  )
  const descriptionIssue = issues.some((issue) => issue.target === 'description')
  if (instrumentIssue && descriptionIssue) return 'Faltan descripcion e instrumento'
  if (instrumentIssue) return 'Falta completar el instrumento'
  if (descriptionIssue) return 'Falta descripcion de la actividad'
  return `Faltan ${issues.length} campos por completar`
}

export function sortDraftMetas(a: ActivityDraftMeta, b: ActivityDraftMeta, sortBy: string) {
  if (sortBy === 'updated-asc')
    return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
  if (sortBy === 'name-asc')
    return (a.draft.name || 'Actividad sin nombre').localeCompare(
      b.draft.name || 'Actividad sin nombre',
    )
  if (sortBy === 'completion-desc') return b.completion - a.completion
  if (sortBy === 'completion-asc') return a.completion - b.completion
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
}

export function formatDraftDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  const today = new Date()
  const sameDay = date.toDateString() === today.toDateString()
  const time = date.toLocaleTimeString('es-DO', { hour: 'numeric', minute: '2-digit' })
  if (sameDay) return `Hoy, ${time}`
  return date.toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function validateActivityCompletion(draft: ActivityDraft): ActivityCompletionIssue[] {
  return validateActivityDraft(draft)
}

export function newActivityDraft(blockId: CompetencyBlockId): ActivityDraft {
  return {
    ...emptyActivityDraft,
    draftId: createDraftId(),
    creationId: crypto.randomUUID(),
    competencyBlockId: blockId,
    competencyBlockWeights: { [blockId]: 1 },
    updatedAt: new Date().toISOString(),
  }
}

export function normalizeStoredActivityDrafts(value: unknown): ActivityDraftsByBlock {
  if (!value || typeof value !== 'object') return {}
  const source = value as Record<string, unknown>
  const normalized: ActivityDraftsByBlock = {}

  competencyBlocks.forEach((block) => {
    const raw = source[block.id]
    if (!raw) return
    const drafts = Array.isArray(raw) ? raw : [raw]
    const validDrafts = drafts
      .filter((item): item is Partial<ActivityDraft> => Boolean(item && typeof item === 'object'))
      .map((draft) => {
        const restored = {
          ...emptyActivityDraft,
          ...draft,
          draftId: typeof draft.draftId === 'string' ? draft.draftId : createDraftId(),
          competencyBlockId: block.id,
          competencyBlockWeights:
            draft.competencyBlockWeights && typeof draft.competencyBlockWeights === 'object'
              ? draft.competencyBlockWeights
              : { [block.id]: 1 },
          instrumentCompleted: Boolean(draft.instrumentCompleted),
          instrumentFields:
            draft.instrumentFields &&
            typeof draft.instrumentFields === 'object' &&
            !Array.isArray(draft.instrumentFields)
              ? (draft.instrumentFields as Record<string, string>)
              : {},
          resources: Array.isArray(draft.resources)
            ? draft.resources.filter((resource): resource is string => typeof resource === 'string')
            : [],
          updatedAt:
            typeof draft.updatedAt === 'string' ? draft.updatedAt : new Date().toISOString(),
        } as ActivityDraft
        const oldFingerprint = JSON.stringify([
          restored.name,
          restored.description,
          restored.maxScore,
          restored.pedagogicalActivityType,
          restored.activityType,
          restored.instrumentType,
          restored.selectedCurriculumElementIds ?? [],
        ])
        if (restored.preparedFingerprint === oldFingerprint)
          restored.preparedFingerprint = preparationFingerprint(restored)
        if (!restored.maxScore && restored.instrumentType) {
          restored.instrumentFields = scoreInstrumentFields(
            restored.instrumentFields,
            restored.instrumentType,
            null,
            restored.preparedRecommendation,
          )
          if (restored.preparedRecommendation)
            restored.preparedRecommendation = scoreRecommendation(
              restored.preparedRecommendation,
              restored.instrumentFields,
              null,
            )
        }
        return restored
      })
      .filter(isMeaningfulActivityDraft)

    if (validDrafts.length > 0) {
      normalized[block.id] = validDrafts
    }
  })

  return normalized
}

export function isMeaningfulActivityDraft(draft: ActivityDraft) {
  return Boolean(
    draft.name.trim() ||
    draft.date ||
    activityDescriptionText(draft.description).trim() ||
    draft.instrumentType ||
    draft.instrumentCompleted ||
    Object.values(draft.instrumentFields).some((value) => value.trim()) ||
    draft.resources.length > 0 ||
    draft.evaluationTechnique ||
    draft.maxScore !== emptyActivityDraft.maxScore ||
    draft.activityType !== emptyActivityDraft.activityType ||
    draft.planningMoment !== emptyActivityDraft.planningMoment,
  )
}

export function activityToDraft(activity: Activity, duplicate = false): ActivityDraft {
  const draft: ActivityDraft = {
    ...newActivityDraft(activity.competencyBlockId as CompetencyBlockId),
    name: duplicate ? activity.name + ' copia' : activity.name,
    maxScore: String(activity.maxScore),
    competencyBlockWeights: activityCompetencyWeights(activity),
    date: activity.date ?? '',
    description: activity.description ?? '',
    studentRole: activity.studentRole ?? '',
    teacherRole: activity.teacherRole ?? '',
    instrumentType: activity.instrumentType ?? '',
    instrumentId: duplicate ? undefined : activity.instrumentId,
    evaluationTechnique: activity.evaluationTechnique ?? '',
    pedagogicalActivityType: activity.pedagogicalActivityType ?? '',
    instrumentCompleted: Boolean(activity.instrumentType),
    instrumentFields: { ...activity.instrumentCriteria },
    preparedRecommendation: activity.instrumentSnapshot,
    preparedManuallyEdited: true,
    resources: activity.resources ?? [],
    planningMoment: activity.planningMoment ?? '',
    observations: activity.observations ?? '',
    activityType: activity.activityType ?? 'individual',
    teamIds: activity.teamIds ?? [],
    evidenceInstructions: activity.evidenceInstructions,
    planningId: activity.planningId,
    source: activity.source,
    futurePlanningLink: activity.futurePlanningLink,
    futureInstrumentLink: activity.futureInstrumentLink,
  }
  draft.preparedFingerprint = preparationFingerprint(draft)
  return draft
}

export function draftToActivity(
  draft: ActivityDraft,
  original?: Activity,
): Omit<Activity, 'id'> & { creationId?: string } {
  const locked = Boolean(original?.evaluatedCount)
  if (!locked && validateActivityCompletion(draft).length)
    throw new Error('Completa los campos indicados antes de guardar.')
  const score = Number(draft.maxScore)
  let snapshot = draft.preparedRecommendation
    ? alignRecommendationWithFields(draft.preparedRecommendation, draft.instrumentFields, score)
    : undefined
  // Keeping an instrument changes the activity metadata, not its criteria or identity.
  // The persisted proposal and activity must still agree on the explicit selection.
  if (!locked && snapshot && draft.preparedManuallyEdited && draft.pedagogicalActivityType)
    snapshot = {...snapshot, activityType: draft.pedagogicalActivityType}
  if (!locked && draft.preparedRecommendation && !snapshot)
    throw new Error('Revisa la definición del instrumento antes de guardar.')
  const metadata = {
    name: draft.name.trim(),
    date: original ? original.date : draft.date,
    description: draft.description.trim(),
    studentRole: original ? original.studentRole : draft.studentRole.trim(),
    teacherRole: original ? original.teacherRole : draft.teacherRole.trim(),
    evaluationTechnique: draft.evaluationTechnique,
    observations: original ? original.observations : draft.observations.trim(),
    resources: draft.resources,
    planningMoment: original ? original.planningMoment : draft.planningMoment as Activity['planningMoment'],
    evidenceInstructions: original ? original.evidenceInstructions : draft.evidenceInstructions,
    planningId: draft.planningId,
    source: draft.source,
    futurePlanningLink: draft.futurePlanningLink,
    futureInstrumentLink: draft.futureInstrumentLink,
  }
  if (locked && original) return { ...original, ...metadata }
  return {
    ...metadata,
    creationId: draft.creationId,
    maxScore: score,
    competencyBlockId: draft.competencyBlockId,
    competencyBlockWeights: draft.competencyBlockWeights,
    instrumentType: draft.instrumentType,
    instrumentId: draft.instrumentId,
    instrumentCriteria: draft.instrumentFields,
    pedagogicalActivityType: draft.pedagogicalActivityType || snapshot?.activityType,
    instrumentSnapshot:
      snapshot?.catalogVersion === 'editable-fallback-v1' ? undefined : (snapshot ?? undefined),
    activityType: draft.activityType as Activity['activityType'],
    teamIds: draft.activityType === 'group' ? draft.teamIds : [],
  }
}
