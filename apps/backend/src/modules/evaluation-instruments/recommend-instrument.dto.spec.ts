import { describe, expect, it } from 'vitest'
import { validateSync } from 'class-validator'
import { InterpretActivityDto, RecommendInstrumentDto } from './recommend-instrument.dto'

describe('contextual activity types at the HTTP validation boundary', () => {
  for (const Dto of [InterpretActivityDto, RecommendInstrumentDto]) {
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
