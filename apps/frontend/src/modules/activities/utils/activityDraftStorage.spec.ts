import { describe, expect, it } from 'vitest'

import { deleteActivityDraft, readActivityDrafts } from './activityDraftStorage'

describe('activityDraftStorage', () => {
  it('conserva borradores existentes y permite borrar formatos heredados', () => {
    const storage = window.localStorage
    storage.clear()
    const storageKey = 'grading-activity-drafts:1ro A · Ciencias:P1'
    storage.setItem(storageKey, JSON.stringify({
      b1: { draftId: 'legacy', name: 'Actividad heredada', maxScore: '20', updatedAt: '2026-09-10T12:00:00.000Z' },
      b2: [{ draftId: 'current', name: 'Actividad actual', maxScore: '25', updatedAt: '2026-09-11T12:00:00.000Z' }],
    }))

    const drafts = readActivityDrafts(storage)
    expect(drafts.map((draft) => draft.draft.name)).toEqual(['Actividad actual', 'Actividad heredada'])

    deleteActivityDraft(drafts.find((draft) => draft.draft.draftId === 'legacy')!, storage)
    expect(readActivityDrafts(storage).map((draft) => draft.draft.name)).toEqual(['Actividad actual'])
  })
})
