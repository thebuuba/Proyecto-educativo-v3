import { describe, expect, it } from 'vitest'
import { recommend } from './recommendation-engine'
import cases from '../../../../../data/evaluation-instruments/math-operations-relevance.json'
const context = {
  level: 'SECONDARY' as const,
  grade: 1,
  cycle: 1,
  modalityCode: 'academic',
  subjectCode: 'MAT',
  subjectName: 'Matemática',
  optativeExitName: null,
}
describe('Operaciones: descripción actual y propósito de evaluación', () => {
  for (const f of cases) {
    const input = {
      activityTitle: f.title,
      description: f.description,
      maxScore: 20,
      participationMode: 'INDIVIDUAL' as const,
    }
    it(`${f.id}: formato fundamentado`, () =>
      expect(recommend(input, context, null, [], 'UNMAPPED', null).instrumentType).toBe(f.format))
    for (const type of ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const)
      for (const total of [20, 17.35])
        it(`${f.id}/${type}/${total}`, () => {
          const proposal = recommend(
            { ...input, maxScore: total, preferredInstrumentType: type },
            context,
            null,
            [],
            'UNMAPPED',
            null,
          )
          const text = JSON.stringify(proposal.criteria)
          for (const operation of ['multiplic', 'resta', 'divisi'])
            expect(text).toMatch(new RegExp(operation))
          if (f.id !== 'temperature')
            expect(text).not.toMatch(/temperatura|termómetro|unidades|problema/i)
          else expect(text).not.toMatch(/termómetro|escala del/i)
          if (f.id === 'observed') expect(text).toMatch(/autónom|apoyo/i)
          if (f.id === 'methods') expect(text).toMatch(/Justifica los métodos/)
          expect(proposal.instrumentType).toBe(type)
          expect(proposal.criteria.reduce((sum, c) => sum + c.maxScoreUnits, 0)).toBe(
            Math.round(total * 100),
          )
        })
  }
  it('conserva la lectura de un termómetro cuando la consigna la pide', () => {
    const p = recommend(
      {
        activityTitle: 'Lectura',
        description: 'Lee la temperatura señalada en la escala del termómetro.',
        maxScore: 20,
        participationMode: 'INDIVIDUAL',
        preferredInstrumentType: 'rubrica',
      },
      context,
      null,
      [],
      'UNMAPPED',
      null,
    )
    expect(JSON.stringify(p.criteria)).toMatch(/termómetro/)
  })
})
