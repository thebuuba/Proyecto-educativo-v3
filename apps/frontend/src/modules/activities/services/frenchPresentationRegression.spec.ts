import { describe, expect, it } from 'vitest'
import { editableFallbackRecommendation, recommendationToFields } from './instrumentPreparation'
import { scoreInstrumentFields } from './instrumentScoring'
import { recommend } from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'

const description = 'En parejas, los estudiantes se saludarán en francés y realizarán un diálogo breve para preguntar y responder su nombre, edad y lugar de residencia. Luego intercambiarán los roles.'
const context = { level: 'SECONDARY' as const, grade: 1, cycle: 1, modalityCode: 'academic', subjectCode: 'FRA', subjectName: 'Francés', optativeExitName: null }
describe('presentación francesa real: paridad y puntuación', () => {
  for (const format of ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const) for (const total of [20, 17.35]) it(`${format}: misma evidencia local/servicio, pendiente y total exacto ${total}`, () => {
    const input = { activityTitle: 'Nos presentamos en francés', description, maxScore: total, participationMode: 'GROUP' as const }
    const local = editableFallbackRecommendation({ ...input, instrumentType: format, academicContext: context })
    const server = recommend({ ...input, preferredInstrumentType: format }, context, null, [], 'UNMAPPED', null)
    const content = (p: typeof local) => ({ activity: p.activityType, type: p.instrumentType, levels: p.levels, criteria: p.criteria.map(({ id, sourceReferences, sourceType, ...row }) => row) })
    expect(content(local)).toEqual(content(server))
    expect(local.criteria.map(c => c.description).join(' ')).toMatch(/residencia/)
    expect(local.criteria.some(c => c.templateId === 'fra-1-questions')).toBe(format !== 'lista-cotejo')
    expect(local.criteria.some(c => c.templateId === 'fra-1-roles')).toBe(true)
    const fields = recommendationToFields(local, input.activityTitle)
    const pending = scoreInstrumentFields(fields, format, null, local)
    expect(pending[`${format}:meta:scorePending`]).toBe('true')
    expect(pending[`${format}:points:0`]).toBe('')
    const scored = scoreInstrumentFields(pending, format, total, local)
    expect(local.criteria.reduce((sum, _, index) => sum + Math.round(Number(scored[`${format}:points:${index}`]) * 100), 0)).toBe(Math.round(total * 100))
    if (format === 'lista-ponderada') expect(local.criteria.reduce((sum, _, index) => sum + Math.round(Number(scored[`${format}:weight:${index}`]) * 100), 0)).toBe(10000)
  })
})
