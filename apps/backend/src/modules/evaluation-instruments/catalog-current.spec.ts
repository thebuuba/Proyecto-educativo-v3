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
    expect(evaluationCatalogCurrent.version).toBe('evaluation-2026.146')
    const frozen138=evaluationCatalogForVersion('evaluation-2026.138')!
    expect(frozen138.version).toBe('evaluation-2026.138')
    expect(frozen138.optativeScienceModules).toBeUndefined()
    const {version:currentVersion,optativeScienceModules,technicalModules,...currentWithoutScience}=evaluationCatalogCurrent
    expect(technicalModules).toHaveLength(5)
    expect(technicalModules[0]).toMatchObject({moduleCode:'MF_053_3',programCode:'IFC006_3',grade:4,cycle:2,modalityCode:'technical_professional'})
    expect(technicalModules[1]).toMatchObject({moduleCode:'MF_002_3',programCode:'IFC007_3',programCodes:['IFC006_3','IFC007_3'],grade:4,cycle:2,modalityCode:'technical_professional'})
    expect(technicalModules[2]).toMatchObject({moduleCode:'MF_054_3',programCode:'IFC006_3',grade:5,cycle:2,modalityCode:'technical_professional'})
    expect(technicalModules[3]).toMatchObject({moduleCode:'MF_056_3',programCode:'IFC006_3',grade:4,cycle:2,modalityCode:'technical_professional'})
    expect(technicalModules[4]).toMatchObject({moduleCode:'MF_059_3',programCode:'IFC006_3',grade:4,cycle:2,modalityCode:'technical_professional'})
    const frozen145=evaluationCatalogForVersion('evaluation-2026.145')!
    expect(frozen145.technicalModules).toEqual(technicalModules.slice(0,4))
    const frozen144=evaluationCatalogForVersion('evaluation-2026.144')!
    expect(frozen144.version).toBe('evaluation-2026.144')
    expect(frozen144.technicalModules).toEqual(technicalModules.slice(0,3))
    const frozen143=evaluationCatalogForVersion('evaluation-2026.143')!
    expect(frozen143.version).toBe('evaluation-2026.143')
    expect(frozen143.technicalModules).toEqual(technicalModules.slice(0,2))
    const {version:version143,technicalModules:technical143,...rest143}=frozen143
    expect(version143).not.toBe(currentVersion)
    expect(technical143).toHaveLength(2)
    expect(JSON.parse(JSON.stringify({...currentWithoutScience,optativeScienceModules}))).toEqual(JSON.parse(JSON.stringify(rest143)))
    const frozen142=evaluationCatalogForVersion('evaluation-2026.142')!
    expect(frozen142.technicalModules).toEqual(technicalModules.slice(0,1))
    const {version:version142,technicalModules:technical142,...rest142}=frozen142
    expect(version142).toBe('evaluation-2026.142')
    expect(technical142).toHaveLength(1)
    expect(JSON.parse(JSON.stringify({...currentWithoutScience,optativeScienceModules}))).toEqual(JSON.parse(JSON.stringify(rest142)))
    const frozen141=evaluationCatalogForVersion('evaluation-2026.141')!
    expect(frozen141.technicalModules).toBeUndefined()
    const {version:version141,...rest141}=frozen141
    expect(version141).toBe('evaluation-2026.141')
    expect(JSON.parse(JSON.stringify({...currentWithoutScience,optativeScienceModules}))).toEqual(JSON.parse(JSON.stringify(rest141)))
    const {version:previousVersion,...previousWithoutVersion}=frozen138
    expect(currentVersion).not.toBe(previousVersion)
    expect(optativeScienceModules.map(m=>m.subjectCode)).toEqual(['OPT-CT-4','OPT-CT-5','OPT-CT-6'])
    const frozen140=evaluationCatalogForVersion('evaluation-2026.140')!
    expect(frozen140.version).toBe('evaluation-2026.140')
    expect(frozen140.optativeScienceModules!.map(m=>m.subjectCode)).toEqual(['OPT-CT-4','OPT-CT-5'])
    expect(optativeScienceModules.slice(0,2)).toEqual(frozen140.optativeScienceModules)
    const {version:version140,optativeScienceModules:science140,...rest140}=frozen140
    expect(version140).not.toBe(currentVersion)
    expect(science140).toHaveLength(2)
    expect(JSON.parse(JSON.stringify(currentWithoutScience))).toEqual(JSON.parse(JSON.stringify(rest140)))
    const frozen139=evaluationCatalogForVersion('evaluation-2026.139')!
    expect(frozen139.optativeScienceModules!.map(m=>m.subjectCode)).toEqual(['OPT-CT-4'])
    expect(optativeScienceModules[0]).toEqual(frozen139.optativeScienceModules![0])
    const {version:version139,optativeScienceModules:science139,...rest139}=frozen139
    expect(version139).toBe('evaluation-2026.139')
    expect(science139).toHaveLength(1)
    expect(JSON.parse(JSON.stringify(currentWithoutScience))).toEqual(JSON.parse(JSON.stringify(rest139)))
    expect(JSON.parse(JSON.stringify(currentWithoutScience))).toEqual(JSON.parse(JSON.stringify(previousWithoutVersion)))
    expect(evaluationCatalogCurrent.optativeMathModules.map(m=>m.subjectCode)).toEqual(['OPT-MT-4','OPT-MT-5','OPT-MT-6'])
    const frozen137=evaluationCatalogForVersion('evaluation-2026.137')!
    expect(frozen137.optativeMathModules!.map(m=>m.subjectCode)).toEqual(['OPT-MT-4','OPT-MT-5'])
    expect(evaluationCatalogCurrent.optativeMathModules.slice(0,2)).toEqual(frozen137.optativeMathModules)
    const frozen136=evaluationCatalogForVersion('evaluation-2026.136')!
    expect(frozen136.optativeMathModules!.map(m=>m.subjectCode)).toEqual(['OPT-MT-4'])
    expect(evaluationCatalogCurrent.optativeMathModules[0]).toEqual(frozen136.optativeMathModules![0])
    const frozen135=evaluationCatalogForVersion('evaluation-2026.135')!
    expect(frozen135.optativeMathModules).toBeUndefined()
    expect(evaluationCatalogCurrent.optativeSocialModules).toEqual(frozen135.optativeSocialModules)
    const frozen133=evaluationCatalogForVersion('evaluation-2026.133')!
    expect(frozen133.optativeSocialModules!.map(m=>m.subjectCode)).toEqual(['OPT-HCS-SOC-4'])
    expect(evaluationCatalogCurrent.optativeSocialModules[0]).toEqual(frozen133.optativeSocialModules![0])
    expect(evaluationCatalogCurrent.optativeSocialModules.map(m=>m.subjectCode)).toEqual(['OPT-HCS-SOC-4','OPT-HCS-SOC-5','OPT-HCS-SOC-6'])
    const frozen134=evaluationCatalogForVersion('evaluation-2026.134')!
    expect(frozen134.optativeSocialModules!.map(m=>m.subjectCode)).toEqual(['OPT-HCS-SOC-4','OPT-HCS-SOC-5'])
    expect(evaluationCatalogCurrent.optativeSocialModules.slice(0,2)).toEqual(frozen134.optativeSocialModules)
    const frozen126=evaluationCatalogForVersion('evaluation-2026.126')
    expect(frozen126.optativeEnglishModules).toBeUndefined()
    expect(evaluationCatalogCurrent.optativeLanguageModules.slice(0,3)).toEqual(frozen126.optativeLanguageModules)
    const frozen129=evaluationCatalogForVersion('evaluation-2026.129')!
    expect(frozen129.optativeLanguageModules).toHaveLength(3)
    expect(evaluationCatalogCurrent.optativeLanguageModules.map(m=>m.subjectCode)).toEqual(['OPT-HLM-LEN-4','OPT-HLM-LEN-5','OPT-HLM-LEN-6','OPT-HCS-LEN-4','OPT-HCS-LEN-5','OPT-HCS-LEN-6'])
    const frozen131=evaluationCatalogForVersion('evaluation-2026.131')!
    expect(evaluationCatalogCurrent.optativeLanguageModules.slice(0,5)).toEqual(frozen131.optativeLanguageModules)
    const frozen130=evaluationCatalogForVersion('evaluation-2026.130')!
    expect(evaluationCatalogCurrent.optativeLanguageModules.slice(0,4)).toEqual(frozen130.optativeLanguageModules)
    expect(evaluationCatalogCurrent.optativeEnglishModules.map(m=>m.subjectCode)).toEqual(['OPT-HLM-ING-4','OPT-HLM-ING-5','OPT-HLM-ING-6'])
    const frozen128=evaluationCatalogForVersion('evaluation-2026.128')!
    expect(frozen128.optativeEnglishModules!.map(m=>m.subjectCode)).toEqual(['OPT-HLM-ING-4','OPT-HLM-ING-5'])
    expect(evaluationCatalogCurrent.optativeEnglishModules.slice(0,2)).toEqual(frozen128.optativeEnglishModules)
    const frozen127=evaluationCatalogForVersion('evaluation-2026.127')!
    expect(frozen127.optativeEnglishModules!.map(m=>m.subjectCode)).toEqual(['OPT-HLM-ING-4'])
    expect(evaluationCatalogCurrent.optativeEnglishModules[0]).toEqual(frozen127.optativeEnglishModules![0])
    expect(evaluationCatalogCurrent.scienceCommonModules.map(module => module.grade)).toEqual([1,2,3,4,5,6])
    expect(evaluationCatalogCurrent.mathCommonModules.map(module => module.grade)).toEqual([1,2,3,4,5,6])
    expect(evaluationCatalogCurrent.frenchModules.map(module => module.grade)).toEqual([1,2,3,4,5,6])
    expect(new Set(evaluationCatalogCurrent.criterionTemplates.map(item => item.id)).size).toBe(evaluationCatalogCurrent.criterionTemplates.length)
  })
})
