import { validateInstrumentDefinition } from '@aula/shared'
import type { CompetencyBlockId } from '@/modules/grading/utils/competencyGrades'

export const activityDraftStoragePrefix = 'grading-activity-drafts:v2:'
export type ActivityDraftContext = {
  schoolId: string
  userId: string
  schoolYearId: string
  sectionSubjectId: string
  academicPeriodId: string
}
export type ActivityDraftScope = Pick<ActivityDraftContext, 'schoolId' | 'userId'> & Partial<ActivityDraftContext>
export type ActivityDraftStorageResult = { ok: true } | { ok: false; error: string }
export type StoredActivityDraft = {
  draftId?: string
  creationId?: string
  updatedAt?: string
  name?: string
  maxScore?: string
  competencyBlockId?: string
  competencyBlockWeights?: Record<string, number>
  date?: string
  description?: string
  instrumentType?: string
  instrumentFields?: Record<string, string>
  evaluationTechnique?: string
  instrumentCompleted?: boolean
  planningMoment?: string
  activityType?: string
}
export type ActivityDraftsByBlock<T extends StoredActivityDraft = StoredActivityDraft> = Partial<Record<CompetencyBlockId, T[]>>
export type ActivityDraftLabels = { courseTitle: string; periodShortName: string }
export type StoredActivityDraftSummary = ActivityDraftLabels & {
  storageKey: string
  context: ActivityDraftContext
  blockId: CompetencyBlockId
  draft: StoredActivityDraft
  completion: number
}
const contextFields = ['schoolId', 'userId', 'schoolYearId', 'sectionSubjectId', 'academicPeriodId'] as const
const blocks = ['b1', 'b2', 'b3', 'b4'] as const
const isContext = (value: unknown): value is ActivityDraftContext => Boolean(value && typeof value === 'object' && contextFields.every(field => typeof (value as ActivityDraftContext)[field] === 'string' && (value as ActivityDraftContext)[field].trim()))
function isStoredDraft(value: unknown): value is StoredActivityDraft {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const draft = value as Record<string, unknown>
  const strings = ['draftId', 'creationId', 'updatedAt', 'name', 'maxScore', 'competencyBlockId', 'date', 'description', 'instrumentType', 'evaluationTechnique', 'planningMoment', 'activityType']
  if (strings.some(field => draft[field] !== undefined && typeof draft[field] !== 'string')) return false
  if (draft.instrumentCompleted !== undefined && typeof draft.instrumentCompleted !== 'boolean') return false
  for (const [field, type] of [['instrumentFields', 'string'], ['competencyBlockWeights', 'number']]) {
    const fields = draft[field]
    if (fields !== undefined && (!fields || typeof fields !== 'object' || Array.isArray(fields) || Object.values(fields).some(item => typeof item !== type))) return false
  }
  return true
}

export function activityDraftStorageKey(context: ActivityDraftContext): string {
  if (!isContext(context)) throw new Error('Falta el contexto de cuenta o académico del borrador.')
  return `${activityDraftStoragePrefix}${JSON.stringify(contextFields.map(field => context[field]))}`
}

function readEnvelope(key: string, storage: Storage) {
  const value = JSON.parse(storage.getItem(key) ?? 'null')
  if (!value || !isContext(value.context) || activityDraftStorageKey(value.context) !== key || !value.drafts || typeof value.drafts !== 'object' || Array.isArray(value.drafts)) return null
  return {
    ...value,
    courseTitle: typeof value.courseTitle === 'string' ? value.courseTitle : '',
    periodShortName: typeof value.periodShortName === 'string' ? value.periodShortName : '',
  } as { context: ActivityDraftContext; courseTitle: string; periodShortName: string; drafts: ActivityDraftsByBlock }
}

/** No account scope means no disclosure; display-name legacy entries remain untouched. */
export function readActivityDrafts(scope?: ActivityDraftScope | null, storage: Storage = window.localStorage): StoredActivityDraftSummary[] {
  if (!scope?.schoolId || !scope.userId) return []
  const summaries: StoredActivityDraftSummary[] = []
  for (let index = 0; index < storage.length; index++) {
    const storageKey = storage.key(index)
    if (!storageKey?.startsWith(activityDraftStoragePrefix)) continue
    const raw = storage.getItem(storageKey)
    try {
      const envelope = raw ? readEnvelope(storageKey, storage) : null
      if (!envelope || contextFields.some(field => scope[field] !== undefined && envelope.context[field] !== scope[field])) continue
      for (const blockId of blocks) {
        const drafts = envelope.drafts[blockId]
        if (!Array.isArray(drafts)) continue
        for (const draft of drafts) {
          if (!isStoredDraft(draft)) continue
          summaries.push({ storageKey, context: envelope.context, courseTitle: envelope.courseTitle ?? '', periodShortName: envelope.periodShortName ?? '', blockId, draft, completion: activityDraftProgress(draft).completion })
        }
      }
    } catch {
      // Malformed entries are retained; valid siblings remain readable.
    }
  }
  return summaries.sort((first, second) => (second.draft.updatedAt ?? '').localeCompare(first.draft.updatedAt ?? ''))
}

export function readActivityDraftsForContext<T extends StoredActivityDraft = StoredActivityDraft>(context: ActivityDraftContext, storage: Storage = window.localStorage): ActivityDraftsByBlock<T> {
  const key = activityDraftStorageKey(context)
  const envelope = readEnvelope(key, storage)
  const drafts: ActivityDraftsByBlock<T> = {}
  for (const blockId of blocks) {
    const items = envelope?.drafts[blockId]
    if (Array.isArray(items)) drafts[blockId] = items.filter(isStoredDraft) as T[]
  }
  return drafts
}

export function writeActivityDrafts<T extends StoredActivityDraft>(context: ActivityDraftContext, drafts: ActivityDraftsByBlock<T>, labels: ActivityDraftLabels, storage?: Storage): ActivityDraftStorageResult {
  try {
    (storage ?? window.localStorage).setItem(activityDraftStorageKey(context), JSON.stringify({ context, ...labels, drafts }))
    return { ok: true }
  } catch (reason) {
    return { ok: false, error: reason instanceof Error ? reason.message : 'No se pudo guardar el borrador en este dispositivo.' }
  }
}

export function deleteActivityDraft(summary: StoredActivityDraftSummary, storage?: Storage): ActivityDraftStorageResult {
  try {
    const target = storage ?? window.localStorage
    if (!summary.draft.draftId || activityDraftStorageKey(summary.context) !== summary.storageKey) throw new Error('El contexto del borrador no es válido.')
    const envelope = readEnvelope(summary.storageKey, target)
    if (!envelope) throw new Error('No se pudo leer el borrador. Se conservó el contenido almacenado.')
    const drafts = envelope.drafts
    const current = drafts[summary.blockId]
    if (!Array.isArray(current)) throw new Error('No se pudo identificar el borrador.')
    const remaining = current.filter(draft => !isStoredDraft(draft) || draft.draftId !== summary.draft.draftId)
    if (remaining.length) drafts[summary.blockId] = remaining
    else delete drafts[summary.blockId]
    if (Object.keys(drafts).length) target.setItem(summary.storageKey, JSON.stringify({ ...envelope, drafts }))
    else target.removeItem(summary.storageKey)
    return { ok: true }
  } catch (reason) {
    return { ok: false, error: reason instanceof Error ? reason.message : 'No se pudo eliminar el borrador.' }
  }
}

export type ActivityDraftCompletionTarget = 'competencyBlocks' | 'name' | 'maxScore' | 'evaluationTechnique' | 'activityType' | 'instrumentType' | 'instrumentBody' | 'description'
export type ActivityDraftCompletionIssue = { target: ActivityDraftCompletionTarget; title: string; detail: string }

export function validateActivityDraft(draft: StoredActivityDraft): ActivityDraftCompletionIssue[] {
  const issues: ActivityDraftCompletionIssue[] = []
  const add = (target: ActivityDraftCompletionTarget, title: string, detail: string) => issues.push({ target, title, detail })
  const weights = Object.values(draft.competencyBlockWeights ?? {})
  const validWeights = weights.length > 0 && weights.every(weight => Number.isFinite(weight) && weight > 0 && weight <= 1)
    && Boolean(draft.competencyBlockId && draft.competencyBlockId in (draft.competencyBlockWeights ?? {}))
    && (!weights.some(weight => weight !== 1) || Math.abs(weights.reduce((sum, weight) => sum + weight, 0) - 1) < 0.001)
  if (!validWeights) add('competencyBlocks', 'Competencias evaluadas', 'Selecciona al menos un bloque y distribuye el 100 % si ponderas.')
  if (!draft.name?.trim()) add('name', 'Nombre de la actividad', 'Escribe un nombre para la actividad.')
  const score = Number(draft.maxScore)
  if (!Number.isFinite(score) || score < 0.01 || score > 10000 || Math.abs(score * 100 - Math.round(score * 100)) > 1e-7) add('maxScore', 'Valor de la actividad', 'Indica entre 0.01 y 10 000 puntos, con hasta dos decimales.')
  if (!draft.evaluationTechnique?.trim()) add('evaluationTechnique', 'Técnica de evaluación', 'Selecciona una técnica de evaluación.')
  if (!['individual', 'group'].includes(draft.activityType ?? '')) add('activityType', 'Tipo de actividad', 'Indica si la actividad es grupal o individual.')
  if (!draft.instrumentType) add('instrumentType', 'Instrumento de evaluación', 'Selecciona un instrumento.')
  else {
    const instrumentIssues = validateInstrumentDefinition(draft.instrumentType, draft.instrumentFields ?? {}, score)
    if (!draft.instrumentCompleted || instrumentIssues.length) add('instrumentBody', 'Instrumento incompleto', instrumentIssues[0] ?? 'Completa el instrumento de evaluación.')
  }
  const description = typeof DOMParser === 'undefined' ? (draft.description ?? '').replace(/<[^>]*>/g, ' ') : new DOMParser().parseFromString(draft.description ?? '', 'text/html').body.textContent ?? ''
  if (!description.trim()) add('description', 'Descripción de la actividad', 'Describe lo que harán los estudiantes y la evidencia que entregarán.')
  return issues
}

export function activityDraftProgress(draft: StoredActivityDraft) {
  const issues = validateActivityDraft(draft)
  return { completion: Math.round((7 - issues.length) / 7 * 100), issues }
}
