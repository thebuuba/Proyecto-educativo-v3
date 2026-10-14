import { describe, expect, it } from 'vitest'
import { validateSync } from 'class-validator'
import { InterpretActivityDto, RecommendInstrumentDto } from './recommend-instrument.dto'

describe('contextual activity types at the HTTP validation boundary', () => {
  for (const Dto of [InterpretActivityDto, RecommendInstrumentDto]) {
    const contextual = { evaluationTechnique: 'debate', evidenceInstructions: 'Sustentar argumentos', resources: ['Texto'],
      evaluationPriorities: ['Argumentación'], organizationMode: 'GROUP', planningMoment: 'desarrollo', participationMode: 'INDIVIDUAL' }
    const request = () => Object.assign(new Dto(), { sectionSubjectId: 'b61b4262-46a7-4c40-8772-4c7b4c0d0834',
      activityTitle: 'Actividad', ...(Dto === RecommendInstrumentDto ? { maxScore: 20 } : {}), ...contextual })
    it(`${Dto.name} preserves contextual fields through the whitelist`, () => {
      expect(validateSync(request(), { whitelist: true, forbidNonWhitelisted: true })).toEqual([])
    })
    it.each([
      ['evaluationTechnique', 'a'.repeat(101)], ['evidenceInstructions', 'a'.repeat(2001)],
      ['resources', Array(21).fill('Texto')], ['resources', ['a'.repeat(151)]], ['resources', [2]],
      ['evaluationPriorities', Array(13).fill('Idea')], ['evaluationPriorities', ['a'.repeat(301)]], ['evaluationPriorities', [false]],
      ['organizationMode', 'PAIRS'], ['planningMoment', 'otro'],
    ])(`${Dto.name} rejects invalid %s context`, (property, value) => {
      expect(validateSync(Object.assign(request(), { [property]: value })).some(error => error.property === property)).toBe(true)
    })
    it(`${Dto.name} accepts the editor's 10000 characters and rejects longer text`, () => {
      const dto = Object.assign(new Dto(), {sectionSubjectId:'b61b4262-46a7-4c40-8772-4c7b4c0d0834',
        activityTitle:'Actividad',description:'a'.repeat(10000),
        ...(Dto===RecommendInstrumentDto?{participationMode:'INDIVIDUAL',maxScore:20}:{}),
      })
      expect(validateSync(dto)).toEqual([])
      dto.description+='a'
      expect(validateSync(dto).some(error=>error.property==='description')).toBe(true)
    })
    it.each(['ANALYSIS', 'COMPARISON', 'REPORT', 'ORAL_PRESENTATION'])(`${Dto.name} accepts %s selected by the teacher`, activity => {
      const dto = Object.assign(new Dto(), { sectionSubjectId: 'b61b4262-46a7-4c40-8772-4c7b4c0d0834',
        activityTitle: 'Actividad', pedagogicalActivityType: activity,
        ...(Dto === RecommendInstrumentDto ? { participationMode: 'INDIVIDUAL', maxScore: 17.35 } : {}),
      })
      expect(validateSync(dto, { whitelist: true, forbidNonWhitelisted: true })).toEqual([])
    })
    it(`${Dto.name} rejects invented activity types`, () => {
      const dto = Object.assign(new Dto(), { pedagogicalActivityType: 'INVENTED_TYPE' })
      expect(validateSync(dto).some(error => error.property === 'pedagogicalActivityType')).toBe(true)
    })
  }
})
