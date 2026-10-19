import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { evaluationCatalogCurrent, evaluationCatalogForVersion } from './catalog-current'

describe('generic product criteria release', () => {
  it.each([
    ['evaluation-2026.46','main','00d4a2d9d0586159392675cb1f59d35ff21411a3b644d384bbced1cb159d8ac0'],
    ['evaluation-2026.47','main','ed791831aee8eb8772dbb6f745eb356b566491651713b8661f864cc50edb2181'],
    ['evaluation-2026.47',undefined,'55b55e591d2a67bc3760296c0a3f510dc7e452b5126997b222052a7f55405a30'],
    ['evaluation-2026.92',undefined,'b586b25b89b54e21dff71f1c234d714b729c4dc3d49ce9890cd843d7ba1b82c7'],
  ] as const)('preserves the complete pre-merge payload of %s (%s)', (version,lineage,expected) => {
    const payload = evaluationCatalogForVersion(version,lineage)
    const canonical = JSON.stringify(payload,(_,value) => value && typeof value === 'object' && !Array.isArray(value)
      ? Object.fromEntries(Object.entries(value).sort(([a],[b])=>a.localeCompare(b))) : value)
    expect(createHash('sha256').update(canonical).digest('hex')).toBe(expected)
  })
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
    const current = evaluationCatalogForVersion('evaluation-2026.93')!
    expect(current).not.toBe(evaluationCatalogCurrent)
    expect(current.version).toBe('evaluation-2026.93')
    expect(previous).not.toBe(current)
    for (const id of ['oral-mastery', 'oral-resources', 'oral-responses', 'debate-evidence', 'debate-response',
      'concept-hierarchy', 'concept-relations', 'project-product', 'project-process']) {
      expect(previous.criterionTemplates.some(item => item.id === id)).toBe(false)
      expect(current.criterionTemplates.filter(item => item.id === id)).toHaveLength(1)
    }
    expect(current.activityTypes.find(item => item.id === 'PROJECT')?.triggers).toContain('modelo')
    expect(previous.activityTypes.find(item => item.id === 'PROJECT')?.triggers).not.toContain('modelo')
  })

  it('preserves both historical lineages and the frozen92 release while combining all common modules', () => {
    const legacy = evaluationCatalogForVersion('evaluation-2026.47', 'main')!
    const curricular = evaluationCatalogForVersion('evaluation-2026.47')!
    const previous = evaluationCatalogForVersion('evaluation-2026.92')!
    expect(legacy.version).toBe(curricular.version)
    expect(legacy.criterionTemplates.some(item => item.id === 'oral-mastery')).toBe(true)
    expect(curricular.criterionTemplates.some(item => item.id === 'oral-mastery')).toBe(false)
    expect(previous.version).toBe('evaluation-2026.92')
    expect(previous.criterionTemplates.some(item => item.id === 'oral-mastery')).toBe(false)
    expect(evaluationCatalogCurrent.version).toBe('evaluation-2026.119')
    expect(evaluationCatalogCurrent.scienceCommonModules.map(module => module.grade)).toEqual([1,2,3,4,5,6])
    expect(evaluationCatalogCurrent.mathCommonModules.map(module => module.grade)).toEqual([1,2,3,4,5,6])
    expect(evaluationCatalogCurrent.frenchModules.map(module => module.grade)).toEqual([1,2,3,4,5,6])
    expect(new Set(evaluationCatalogCurrent.criterionTemplates.map(item => item.id)).size).toBe(evaluationCatalogCurrent.criterionTemplates.length)
  })
})
