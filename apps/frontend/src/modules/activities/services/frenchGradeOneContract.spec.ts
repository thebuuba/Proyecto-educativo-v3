import { describe, expect, it } from 'vitest'
import { resolveCommonFrenchTask, detectTeachingStrategy } from '@aula/shared'
import { editableFallbackRecommendation, recommendationToFields } from './instrumentPreparation'
import { scoreInstrumentFields } from './instrumentScoring'
import { appendInstrumentCriterion, completeInstrumentCriterion, nextCatalogCriterion } from './instrumentCriterionAddition'
import { activityDefaultSuggestions } from '../utils/activityDefaultSuggestions'
import { recommend } from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import fixtures from '../../../../../../data/evaluation-instruments/french-grade-1-contracts.json'

const context = { level: 'SECONDARY' as const, grade: 1, cycle: 1, modalityCode: 'academic', subjectCode: 'FRA', subjectName: 'Francés', optativeExitName: null }
const formats = ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const
describe('Francés 1.º: conexión local, servidor y mecánicas existentes', () => {
  for (const f of fixtures) for (const format of formats) for (const total of [20, 17.35]) it(`${f.id}: paridad ${format} ${total}`, () => {
    const input = { activityTitle: 'Actividad', description: f.description, maxScore: total, participationMode: 'INDIVIDUAL' as const }
    const local = editableFallbackRecommendation({ ...input, instrumentType: format, academicContext: context })
    const server = recommend({ ...input, preferredInstrumentType: format }, context, null, [], 'UNMAPPED', null)
    const content = (p: typeof local) => ({ type: p.activityType, format: p.instrumentType, levels: p.levels, criteria: p.criteria.map(({ id: _id, sourceType: _source, sourceReferences: _refs, ...c }) => c) })
    expect(content(local)).toEqual(content(server))
    expect(activityDefaultSuggestions('Título neutral', f.description, context)?.activityType).toBe(f.activity)
  })
  for (const format of formats) it(`preserva puntaje pendiente, edición, completar, añadir y agotamiento en ${format}`, () => {
    const p = editableFallbackRecommendation({ activityTitle: 'Actividad', description: fixtures[2].description, maxScore: 20, participationMode: 'INDIVIDUAL', instrumentType: format, academicContext: context })
    const fields = scoreInstrumentFields(recommendationToFields(p, 'Actividad'), format, null, p)
    expect(fields[`${format}:meta:scorePending`]).toBe('true')
    expect(fields[`${format}:points:0`]).toBe('')
    fields[`${format}:criterion:0`] = 'Mi redacción manual'
    fields[`${format}:description:0`] = ''
    const completed = completeInstrumentCriterion(fields, format, 0, p.criteria[0])
    expect(completed[`${format}:criterion:0`]).toBe('Mi redacción manual')
    expect(completed[`${format}:description:0`]).toBe(p.criteria[0].description)
    const count = p.criteria.length
    const missing = { ...completed, [`${format}:meta:criteriaCount`]: String(count - 1) }
    for (const key of Object.keys(missing)) if (key.endsWith(`:${count - 1}`) || key.includes(`:descriptor:${count - 1}:`)) delete missing[key]
    const candidate = nextCatalogCriterion(p.criteria, missing, format, p.criteria.slice(0, -1))
    expect(candidate?.templateId).toBe(p.criteria.at(-1)?.templateId)
    const added = appendInstrumentCriterion(missing, format, 17.35, { ...p, criteria: p.criteria.slice(0, -1) }, candidate)
    expect(added.fields[`${format}:criterion:0`]).toBe('Mi redacción manual')
    expect(nextCatalogCriterion(p.criteria, added.fields, format, added.recommendation?.criteria)).toBeNull()
    expect(() => appendInstrumentCriterion({ ...added.fields, [`${format}:meta:criteriaCount`]: '20' }, format, 20, p, p.criteria[0])).toThrow(RangeError)
  })
  it('no convierte ejemplos franceses, nombres ni un título incompatible en instrucciones', () => {
    expect(resolveCommonFrenchTask('Describe la rutina', 'Exemple: «Paul présente sa famille».', context)).toBeNull()
    expect(resolveCommonFrenchTask('Présentez votre routine', 'Recursos: un diálogo sobre la rutina.', context)).toBeNull()
  })
  it('reconoce simulación explícita en francés y deja pendiente la estrategia ambigua', () => {
    expect(detectTeachingStrategy({ ...context, description: 'Par deux, simulez une rencontre: échangez les rôles pour vous présenter et répondre.' }).id).toBe('SIMULATION')
    expect(detectTeachingStrategy({ ...context, description: 'Présentez oralement votre routine quotidienne.' }).id).toBeNull()
    expect(detectTeachingStrategy({ ...context, description: 'Ne simulez pas de rencontre avec des rôles. Écrivez votre présentation.' }).id).toBeNull()
  })
  it('la escala expresa frecuencia cuando se solicita en francés', () => {
    const description = fixtures[0].description + ' Observez la régularité des échanges.'
    const local = editableFallbackRecommendation({activityTitle:'Actividad', description, instrumentType:'escala', maxScore:20, participationMode:'INDIVIDUAL', academicContext:context})
    expect(local.levels[0].label).toBe('Siempre')
  })
})
