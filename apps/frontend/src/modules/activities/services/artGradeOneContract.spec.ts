import { describe, expect, it } from 'vitest'
import { validateInstrumentDefinition } from '@aula/shared'
import contracts from '../../../../../../data/evaluation-instruments/art-grade-one-contracts.json'
import { recommend } from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import { editableFallbackRecommendation, recommendationToFields } from './instrumentPreparation'
import { scoreInstrumentFields } from './instrumentScoring'
import { activityDefaultSuggestions } from '../utils/activityDefaultSuggestions'

const context = {
  level: 'SECONDARY' as const,
  grade: 1,
  cycle: 1,
  subjectCode: 'ART',
  subjectName: 'Educación Artística',
  modalityCode: null,
  optativeExitName: null,
}
const content = (proposal: ReturnType<typeof editableFallbackRecommendation>) => ({
  activity: proposal.activityType,
  type: proposal.instrumentType,
  levels: proposal.levels,
  criteria: proposal.criteria.map(
    ({ id, sourceReferences, sourceType, ...criterion }) => criterion,
  ),
})

describe('Artística primero: paridad, puntos pendientes y selecciones', () => {
  for (const task of contracts.cases)
    for (const instrumentType of ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const)
      for (const maxScore of [20, 17.35]) {
        it(`${task.id}/${instrumentType}/${maxScore}`, () => {
          const input = {
            activityTitle: 'Un título antiguo sobre células',
            description: task.description,
            maxScore,
            participationMode: 'INDIVIDUAL' as const,
          }
          const local = editableFallbackRecommendation({
            ...input,
            instrumentType,
            academicContext: context,
          })
          const remote = recommend(
            { ...input, preferredInstrumentType: instrumentType },
            context,
            null,
            [],
            'UNMAPPED',
            null,
          )
          expect(
            local.criteria.every((criterion) => criterion.templateId.startsWith('art-1-')),
          ).toBe(true)
          expect(content(local)).toEqual(content(remote))
          const pending = scoreInstrumentFields(
            recommendationToFields(local, input.activityTitle),
            instrumentType,
            null,
            local,
          )
          expect(pending[`${instrumentType}:meta:scorePending`]).toBe('true')
          expect(pending[`${instrumentType}:points:0`]).toBe('')
          const fields = scoreInstrumentFields(pending, instrumentType, maxScore, local)
          expect(validateInstrumentDefinition(instrumentType, fields, maxScore)).toEqual([])
          expect(
            activityDefaultSuggestions(input.activityTitle, task.description, context)
              ?.activityType,
          ).toBe(local.activityType)
          if ('preferred' in task)
            expect(
              activityDefaultSuggestions(input.activityTitle, task.description, context)
                ?.instrument,
            ).toBe(task.preferred)
        })
      }
  it('no extiende el proveedor a otros grados, primaria, asignaturas u optativas', () => {
    for (const other of [
      { ...context, grade: 2 },
      { ...context, level: 'PRIMARY' as const },
      { ...context, subjectCode: 'LEN' },
      { ...context, optativeExitName: 'Artes Visuales' },
    ]) {
      const proposal = editableFallbackRecommendation({
        activityTitle: 'Dibujo',
        description: contracts.cases[0].description,
        instrumentType: 'rubrica',
        maxScore: 20,
        participationMode: 'INDIVIDUAL',
        academicContext: other,
      })
      expect(proposal.criteria.some((criterion) => criterion.templateId.startsWith('art-1-'))).toBe(
        false,
      )
    }
  })
})
