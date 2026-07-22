import 'reflect-metadata'

import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { describe, expect, it } from 'vitest'

import { CreatePlanningEntryDto } from './create-planning-entry.dto'
import { UpdatePlanningEntryDto } from './update-planning-entry.dto'

const curriculumFields = {
  specificCompetence: 'a'.repeat(2_200),
  achievementIndicator: 'a'.repeat(4_600),
  contentConceptual: 'a'.repeat(7_700),
  contentProcedural: 'a'.repeat(8_600),
  contentAttitudinal: 'a'.repeat(3_600),
  activities: { inicio: 'Explorar', desarrollo: 'Practicar', cierre: 'Evaluar' },
}

describe('DTO de planificación', () => {
  it.each([
    [CreatePlanningEntryDto, { sectionSubjectId: 'section', academicPeriodId: 'period', title: 'Unidad' }],
    [UpdatePlanningEntryDto, {}],
  ])('acepta la malla oficial completa y actividades estructuradas', async (Dto, required) => {
    const errors = await validate(plainToInstance(Dto, { ...required, ...curriculumFields }))

    expect(errors).toEqual([])
  })
})
