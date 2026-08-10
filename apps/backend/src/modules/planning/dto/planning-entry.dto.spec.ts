import 'reflect-metadata'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { describe, expect, it } from 'vitest'

import { CreatePlanningEntryDto } from './create-planning-entry.dto'
import { UpdatePlanningEntryDto } from './update-planning-entry.dto'

const activities = {
  inicio: 'Recuperación de saberes previos.',
  desarrollo: 'Construcción guiada del aprendizaje.',
  cierre: 'Síntesis y evaluación formativa.',
}

describe('planning entry DTO activities', () => {
  it('accepts the structured activities object when creating an entry', async () => {
    const dto = plainToInstance(CreatePlanningEntryDto, {
      sectionSubjectId: 'section-subject-1',
      academicPeriodId: 'period-1',
      title: 'La noticia',
      activities,
    })

    expect(await validate(dto)).toEqual([])
  })

  it('accepts the structured activities object when updating an entry', async () => {
    const dto = plainToInstance(UpdatePlanningEntryDto, { activities })

    expect(await validate(dto)).toEqual([])
  })

  it('rejects the obsolete string representation', async () => {
    const dto = plainToInstance(CreatePlanningEntryDto, {
      sectionSubjectId: 'section-subject-1',
      academicPeriodId: 'period-1',
      title: 'La noticia',
      activities: 'Inicio, desarrollo y cierre',
    })

    const errors = await validate(dto)
    expect(errors.some((error) => error.property === 'activities')).toBe(true)
  })
})
