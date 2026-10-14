import { describe, expect, it } from 'vitest'
import { evaluationCatalogCurrent, evaluationCatalogForVersion } from './catalog-current'

describe('generic product criteria release', () => {
  it('resolves the original releases without deriving them from later template revisions', () => {
    const original = evaluationCatalogForVersion('evaluation-2026.1')!
    const second = evaluationCatalogForVersion('evaluation-2026.2')!
    expect(original.version).toBe('evaluation-2026.1')
    expect(second.version).toBe('evaluation-2026.2')
    expect(original.criterionTemplates.some(item => item.id === 'oral-mastery')).toBe(false)
    expect(second.criterionTemplates.some(item => item.id === 'oral-mastery')).toBe(true)
    expect(second.criterionTemplates.length).toBe(original.criterionTemplates.length + 9)
  })

  it('resolves the historical release independently and adds the recovered product criteria only to the new release', () => {
    const previous = evaluationCatalogForVersion('evaluation-2026.46')!
    const current = evaluationCatalogForVersion('evaluation-2026.47')!
    expect(current).toBe(evaluationCatalogCurrent)
    expect(previous).not.toBe(current)
    for (const id of ['oral-mastery', 'oral-resources', 'oral-responses', 'debate-evidence', 'debate-response',
      'concept-hierarchy', 'concept-relations', 'project-product', 'project-process']) {
      expect(previous.criterionTemplates.some(item => item.id === id)).toBe(false)
      expect(current.criterionTemplates.filter(item => item.id === id)).toHaveLength(1)
    }
    expect(current.activityTypes.find(item => item.id === 'PROJECT')?.triggers).toContain('modelo')
    expect(previous.activityTypes.find(item => item.id === 'PROJECT')?.triggers).not.toContain('modelo')
  })
})
