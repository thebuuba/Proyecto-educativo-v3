import { beforeEach, describe, expect, it, vi } from 'vitest'

import { activityDraftProgress, activityDraftStorageKey, deleteActivityDraft, readActivityDrafts, readActivityDraftsForContext, validateActivityDraft, writeActivityDrafts } from './activityDraftStorage'

const context = { schoolId: 'school1', userId: 'user1', schoolYearId: 'year1', sectionSubjectId: 'ss1', academicPeriodId: 'period1' }
const key = 'grading-activity-drafts:v2:["school1","user1","year1","ss1","period1"]'

describe('activityDraftStorage', () => {
  beforeEach(() => window.localStorage.clear())

  it('retains legacy entries without exposing them to the signed-in account', () => {
    const storage = window.localStorage
    storage.clear()
    const storageKey = 'grading-activity-drafts:1ro A · Ciencias:P1'
    storage.setItem(storageKey, JSON.stringify({
      b1: { draftId: 'legacy', name: 'Actividad heredada', maxScore: '20', updatedAt: '2026-09-10T12:00:00.000Z' },
      b2: [{ draftId: 'current', name: 'Actividad actual', maxScore: '25', updatedAt: '2026-09-11T12:00:00.000Z' }],
    }))

    expect(readActivityDrafts(context, storage)).toEqual([])
    expect(JSON.parse(storage.getItem(storageKey)!)).toHaveProperty('b1.draftId', 'legacy')
  })

  it('reads only ID-scoped drafts for the current account, year, subject and period', () => {
    window.localStorage.setItem(key, JSON.stringify({ context, courseTitle: 'Same title', periodShortName: 'P1', drafts: { b1: [{ draftId: 'mine', name: 'Mine' }] } }))
    expect(readActivityDrafts(context).map(summary => summary.draft.name)).toEqual(['Mine'])
    for (const field of ['schoolId', 'userId', 'schoolYearId', 'sectionSubjectId', 'academicPeriodId']) {
      expect(readActivityDrafts({ ...context, [field]: 'another' })).toEqual([])
    }
    expect(readActivityDrafts()).toEqual([])
  })

  it('deletes only the selected draft while preserving sibling fields and drafts', () => {
    window.localStorage.setItem(key, JSON.stringify({ context, courseTitle: 'Ciencias', periodShortName: 'P1', drafts: { b1: [{ draftId: 'remove', name: 'Remove' }, { draftId: 'keep', name: 'Keep', extra: { untouched: true } }] } }))
    const selected = readActivityDrafts(context).find(summary => summary.draft.draftId === 'remove')!
    deleteActivityDraft(selected)
    expect(readActivityDrafts(context).map(summary => summary.draft.name)).toEqual(['Keep'])
    expect(JSON.parse(window.localStorage.getItem(key)!)).toHaveProperty('drafts.b1.0.extra.untouched', true)
  })

  it('persists all editor fields and a stable creation UUID without relying on course labels', () => {
    const draft = { draftId: 'draft1', creationId: '036a5163-c7f9-4d9c-bc31-470e25c54eb4', name: 'Actividad', studentRole: 'Investigar', preparedRecommendation: { untouched: true } }
    expect(writeActivityDrafts(context, { b1: [draft] }, { courseTitle: 'Ciencias', periodShortName: 'P1' })).toEqual({ ok: true })
    expect(activityDraftStorageKey(context)).toBe(key)
    expect(readActivityDraftsForContext(context)).toEqual({ b1: [draft] })
  })

  it('reports denied writes and deletion failures while retaining existing drafts', () => {
    writeActivityDrafts(context, { b1: [{ draftId: 'keep', name: 'Conservar' }] }, { courseTitle: 'Ciencias', periodShortName: 'P1' })
    const summary = readActivityDrafts(context)[0]
    const failedStorage = { setItem: () => { throw new Error('Sin espacio') } } as unknown as Storage
    expect(writeActivityDrafts(context, {}, { courseTitle: '', periodShortName: '' }, failedStorage)).toEqual({ ok: false, error: 'Sin espacio' })
    const denied = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new Error('Acceso denegado') })
    expect(deleteActivityDraft(summary)).toEqual({ ok: false, error: 'Acceso denegado' })
    denied.mockRestore()
    expect(readActivityDrafts(context)[0].draft.name).toBe('Conservar')
    expect(writeActivityDrafts({ ...context, userId: '' }, {}, { courseTitle: '', periodShortName: '' }).ok).toBe(false)
  })

  it('rejects mismatched envelope context and retains corrupt entries', () => {
    const raw = JSON.stringify({ context: { ...context, userId: 'another' }, drafts: { b1: [{ name: 'Other account' }] } })
    window.localStorage.setItem(key, raw)
    expect(readActivityDrafts(context)).toEqual([])
    expect(readActivityDraftsForContext(context)).toEqual({})
    expect(window.localStorage.getItem(key)).toBe(raw)
  })

  it('ignores one malformed draft without hiding its valid siblings', () => {
    window.localStorage.setItem(key, JSON.stringify({ context, drafts: { b1: [{ draftId: 'bad', name: 123 }, { draftId: 'valid', name: 'Visible' }] } }))
    expect(readActivityDrafts(context).map(summary => summary.draft.name)).toEqual(['Visible'])
    expect(readActivityDraftsForContext(context)).toEqual({ b1: [{ draftId: 'valid', name: 'Visible' }] })
  })

  it('deletes a valid draft despite null and malformed siblings while preserving every other row', () => {
    window.localStorage.setItem(key, JSON.stringify({ context, drafts: { b1: [null, { draftId: 'bad', name: 123 }, { draftId: 'remove', name: 'Visible' }, { draftId: 'keep', name: 'Sibling' }] } }))
    const selected = readActivityDrafts(context).find(summary => summary.draft.draftId === 'remove')!
    expect(deleteActivityDraft(selected)).toEqual({ ok: true })
    expect(JSON.parse(window.localStorage.getItem(key)!)).toHaveProperty('drafts.b1', [null, { draftId: 'bad', name: 123 }, { draftId: 'keep', name: 'Sibling' }])
    expect(readActivityDrafts(context).map(summary => summary.draft.name)).toEqual(['Sibling'])
  })

  it('normalizes malformed display labels without hiding drafts or changing their IDs', () => {
    window.localStorage.setItem(key, JSON.stringify({ context, courseTitle: { bad: true }, periodShortName: ['invalid'], drafts: { b1: [{ draftId: 'valid', name: 'Visible' }] } }))
    expect(readActivityDrafts(context)[0]).toMatchObject({ context, courseTitle: '', periodShortName: '', draft: { draftId: 'valid', name: 'Visible' } })
  })

  const ready = {
    name: 'Actividad', maxScore: '0.01', competencyBlockId: 'b1', competencyBlockWeights: { b1: 1 }, description: '<p>Observar</p>',
    evaluationTechnique: 'Observación', activityType: 'individual', instrumentType: 'lista-cotejo', instrumentCompleted: true,
    instrumentFields: { 'lista-cotejo:meta:criteriaCount': '1', 'lista-cotejo:criterion:0': 'Observa', 'lista-cotejo:points:0': '0.01' },
  }

  it('uses seven required areas while keeping date and planning moment optional', () => {
    expect(activityDraftProgress(ready)).toEqual({ completion: 100, issues: [] })
    expect(activityDraftProgress({ ...ready, description: '<p>&nbsp;</p>' }).completion).toBe(86)
    expect(activityDraftProgress({ ...ready, date: '2026-10-12', planningMoment: 'inicio' }).completion).toBe(100)
  })

  it('requires actual valid instrument fields even when a stale completed flag is true', () => {
    const issues = validateActivityDraft({ ...ready, instrumentFields: { ...ready.instrumentFields, 'lista-cotejo:criterion:0': '' } })
    expect(issues.map(issue => issue.target)).toEqual(['instrumentBody'])
    expect(activityDraftProgress({ ...ready, instrumentFields: { ...ready.instrumentFields, 'lista-cotejo:meta:scorePending': 'true' } }).completion).toBe(86)
    expect(activityDraftProgress({ ...ready, maxScore: '0.001' }).completion).toBe(71)
  })
})
