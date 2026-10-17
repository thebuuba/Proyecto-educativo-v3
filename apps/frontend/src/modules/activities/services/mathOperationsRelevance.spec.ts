import { describe, expect, it } from 'vitest'
import { recommend } from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import { editableFallbackRecommendation } from './instrumentPreparation'
import fixtures from '../../../../../../data/evaluation-instruments/math-operations-relevance.json'
const context = {
  level: 'SECONDARY' as const,
  grade: 1,
  cycle: 1,
  modalityCode: 'academic',
  subjectCode: 'MAT',
  subjectName: 'Matemática',
  optativeExitName: null,
}
const content = (p: ReturnType<typeof recommend>) => ({
  type: p.instrumentType,
  activity: p.activityType,
  levels: p.levels,
  criteria: p.criteria.map(({ id, sourceType, sourceReferences, ...c }) => c),
})
describe('Operaciones aritméticas: pertinencia y propósito', () => {
  for (const f of fixtures) {
    const input = {
      activityTitle: f.title,
      description: f.description,
      maxScore: 17.35,
      participationMode: 'INDIVIDUAL' as const,
    }
    it(`${f.id}: recomendación fundamentada`, () => {
      expect(recommend(input, context, null, [], 'UNMAPPED', null).instrumentType).toBe(f.format)
    })
    for (const format of ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const)
      it(`${f.id}/${format}: contenido íntegro y paridad`, () => {
        const server = recommend(
          { ...input, preferredInstrumentType: format },
          context,
          null,
          [],
          'UNMAPPED',
          null,
        )
        const local = editableFallbackRecommendation({
          ...input,
          instrumentType: format,
          academicContext: context,
        })
        expect(content(local)).toEqual(content(server))
        expect(server.instrumentType).toBe(format)
        const text = JSON.stringify(server.criteria)
        for (const operation of ['multiplic', 'resta', 'divisi'])
          expect(text).toMatch(new RegExp(operation))
        if (f.id !== 'temperature')
          expect(text).not.toMatch(
            /temperatura|termómetro|escala del term|unidades|problema|datos e incógnitas/i,
          )
        else expect(text).toMatch(/temperatura/i)
        if (['explain', 'methods'].includes(f.id))
          expect(server.criteria.some((c) => /-explanation/.test(c.templateId))).toBe(true)
        expect(server.criteria.reduce((s, c) => s + c.maxScoreUnits, 0)).toBe(1735)
        expect(new Set(server.criteria.map((c) => c.templateId)).size).toBe(server.criteria.length)
      })
  }
  it('el título antiguo de temperatura no contamina la descripción vigente', () => {
    const build = (f: (typeof fixtures)[number]) =>
      recommend(
        {
          activityTitle: f.title,
          description: f.description,
          maxScore: 20,
          participationMode: 'INDIVIDUAL',
        },
        context,
        null,
        [],
        'UNMAPPED',
        null,
      )
    expect(content(build(fixtures.find((f) => f.id === 'old-temperature-title')!))).toEqual(
      content(build(fixtures[0])),
    )
  })
})
