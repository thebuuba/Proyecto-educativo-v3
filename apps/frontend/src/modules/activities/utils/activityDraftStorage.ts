import type { CompetencyBlockId } from '@/modules/grading/utils/competencyGrades'

export const activityDraftStoragePrefix = 'grading-activity-drafts:'

export type StoredActivityDraft = {
  draftId?: string
  updatedAt?: string
  name?: string
  maxScore?: string
  date?: string
  description?: string
  instrumentType?: string
  evaluationTechnique?: string
  instrumentCompleted?: boolean
  planningMoment?: string
  activityType?: string
}

export type StoredActivityDraftSummary = {
  storageKey: string
  courseTitle: string
  periodShortName: string
  blockId: CompetencyBlockId
  draft: StoredActivityDraft
  completion: number
}

export function readActivityDrafts(storage: Storage = window.localStorage): StoredActivityDraftSummary[] {
  const summaries: StoredActivityDraftSummary[] = []
  for (let index = 0; index < storage.length; index += 1) {
    const storageKey = storage.key(index)
    if (!storageKey?.startsWith(activityDraftStoragePrefix)) continue
    const context = storageKey.slice(activityDraftStoragePrefix.length)
    const separator = context.lastIndexOf(':')
    if (separator < 0) continue
    try {
      const stored = JSON.parse(storage.getItem(storageKey) ?? '{}') as Record<string, unknown>
      Object.entries(stored).forEach(([blockId, value]) => {
        if (!['b1', 'b2', 'b3', 'b4'].includes(blockId)) return
        const drafts = Array.isArray(value) ? value : [value]
        drafts.forEach((draft) => {
          if (!draft || typeof draft !== 'object') return
          const typedDraft = draft as StoredActivityDraft
          summaries.push({
            storageKey,
            courseTitle: context.slice(0, separator),
            periodShortName: context.slice(separator + 1),
            blockId: blockId as CompetencyBlockId,
            draft: typedDraft,
            completion: activityDraftCompletion(typedDraft),
          })
        })
      })
    } catch {
      // Ignore malformed legacy entries without affecting valid drafts.
    }
  }
  return summaries.sort((first, second) => (second.draft.updatedAt ?? '').localeCompare(first.draft.updatedAt ?? ''))
}

export function deleteActivityDraft(summary: StoredActivityDraftSummary, storage: Storage = window.localStorage) {
  try {
    const stored = JSON.parse(storage.getItem(summary.storageKey) ?? '{}') as Record<string, StoredActivityDraft | StoredActivityDraft[]>
    const current = stored[summary.blockId]
    const remaining = (Array.isArray(current) ? current : current ? [current] : []).filter((draft) => draft.draftId !== summary.draft.draftId)
    if (remaining.length) stored[summary.blockId] = remaining
    else delete stored[summary.blockId]
    if (Object.keys(stored).length) storage.setItem(summary.storageKey, JSON.stringify(stored))
    else storage.removeItem(summary.storageKey)
  } catch {
    // A malformed entry is left untouched so another valid draft cannot be lost.
  }
}

function activityDraftCompletion(draft: StoredActivityDraft) {
  const fields = [
    draft.name?.trim(),
    Number(draft.maxScore) > 0,
    draft.date,
    draft.description?.trim(),
    draft.evaluationTechnique,
    draft.activityType,
    draft.planningMoment,
    draft.instrumentType,
    draft.instrumentCompleted,
  ]
  return Math.round(fields.filter(Boolean).length / fields.length * 100)
}
