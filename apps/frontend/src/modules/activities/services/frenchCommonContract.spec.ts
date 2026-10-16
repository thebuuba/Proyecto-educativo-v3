import { describe, expect, it } from 'vitest'
import { editableFallbackRecommendation, recommendationToFields } from './instrumentPreparation'
import { scoreInstrumentFields } from './instrumentScoring'
import { appendInstrumentCriterion, completeInstrumentCriterion, nextCatalogCriterion } from './instrumentCriterionAddition'
import { activityDefaultSuggestions } from '../utils/activityDefaultSuggestions'
import { recommend } from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import grade2 from '../../../../../../data/evaluation-instruments/french-grade-2-contracts.json'
import grade3 from '../../../../../../data/evaluation-instruments/french-grade-3-contracts.json'
import grade4 from '../../../../../../data/evaluation-instruments/french-grade-4-contracts.json'
import grade5 from '../../../../../../data/evaluation-instruments/french-grade-5-contracts.json'
import grade6 from '../../../../../../data/evaluation-instruments/french-grade-6-contracts.json'

const grades = [{ grade: 2, fixtures: grade2 }, { grade: 3, fixtures: grade3 }, { grade: 4, fixtures: grade4 }, { grade: 5, fixtures: grade5 }, { grade: 6, fixtures: grade6 }]
const formats = ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const
for (const { grade, fixtures } of grades) describe(`Francés ${grade}.º: paridad y editor`, () => {
  const context = { level: 'SECONDARY' as const, grade, cycle: grade <= 3 ? 1 : 2, modalityCode: 'academic', subjectCode: 'FRA', subjectName: 'Francés', optativeExitName: null }
  for (const f of fixtures) for (const format of formats) for (const total of [20, 17.35]) it(`${f.id}: ${format}, ${total}`, () => {
    const input = { activityTitle: 'Actividad', description: f.description, maxScore: total, participationMode: 'INDIVIDUAL' as const }
    const local = editableFallbackRecommendation({ ...input, instrumentType: format, academicContext: context })
    const server = recommend({ ...input, preferredInstrumentType: format }, context, null, [], 'UNMAPPED', null)
    const content = (p: typeof local) => ({ type: p.activityType, format: p.instrumentType, levels: p.levels, criteria: p.criteria.map(({ id: _id, sourceType: _source, sourceReferences: _refs, ...c }) => c) })
    expect(content(local)).toEqual(content(server))
    expect(activityDefaultSuggestions('Neutral', f.description, context)?.activityType).toBe(f.activity)
  })
  for (const format of formats) it(`edición y candidatos ${format}`, () => {
    const p = editableFallbackRecommendation({ activityTitle: 'Actividad', description: fixtures[2].description, maxScore: 20, participationMode: 'INDIVIDUAL', instrumentType: format, academicContext: context })
    let fields = scoreInstrumentFields(recommendationToFields(p, 'Actividad'), format, null, p)
    expect(fields[`${format}:meta:scorePending`]).toBe('true'); expect(fields[`${format}:points:0`]).toBe('')
    fields[`${format}:criterion:0`] = 'Texto manual'; fields[`${format}:description:0`] = ''
    fields = completeInstrumentCriterion(fields, format, 0, p.criteria[0])
    expect(fields[`${format}:criterion:0`]).toBe('Texto manual'); expect(fields[`${format}:description:0`]).toBe(p.criteria[0].description)
    const count = p.criteria.length
    const missing = { ...fields, [`${format}:meta:criteriaCount`]: String(count - 1) }
    for (const key of Object.keys(missing)) if (key.endsWith(`:${count - 1}`) || key.includes(`:descriptor:${count - 1}:`)) delete missing[key]
    const candidate = nextCatalogCriterion(p.criteria, missing, format, p.criteria.slice(0, -1))
    expect(candidate?.templateId).toBe(p.criteria.at(-1)?.templateId)
    const added = appendInstrumentCriterion(missing, format, 17.35, { ...p, criteria: p.criteria.slice(0, -1) }, candidate)
    expect(added.fields[`${format}:criterion:0`]).toBe('Texto manual')
    expect(nextCatalogCriterion(p.criteria, added.fields, format, added.recommendation?.criteria)).toBeNull()
    expect(() => appendInstrumentCriterion({ ...fields, [`${format}:meta:criteriaCount`]: '20' }, format, 20, p, p.criteria[0])).toThrow(RangeError)
  })
})
