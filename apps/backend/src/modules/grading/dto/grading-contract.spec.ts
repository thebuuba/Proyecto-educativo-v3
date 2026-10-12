import { validate } from 'class-validator'
import { describe, expect, it } from 'vitest'
import { SaveGradeDto } from './save-grade.dto'
import { SaveActivityDto } from '../../activities/dto/save-activity.dto'

describe('grading HTTP point and date contracts', () => {
  it('accepts an explicit empty date to clear an existing activity date', async () => {
    expect(await validate(Object.assign(new SaveActivityDto(), {
      sectionSubjectId: 'ss', academicPeriodId: 'p', competencyBlockId: 'b1', name: 'Actividad', maxScore: 20, date: '',
    }))).toEqual([])
  })

  it.each([0, 150.01, 200, 10000])('accepts score %s with a 10000-point maximum', async score => {
    expect(await validate(Object.assign(new SaveGradeDto(), { score, maxScore: 10000 }))).toEqual([])
  })

  it.each([1.001, -0.01, 10000.01])('rejects score %s', async score => {
    expect(await validate(Object.assign(new SaveGradeDto(), { score }))).not.toEqual([])
  })

  it.each(['2026-10-12T00:00:00.000Z', '12/10/2026'])('rejects a date outside YYYY-MM-DD: %s', async date => {
    const errors = await validate(Object.assign(new SaveActivityDto(), {
      sectionSubjectId: 'ss', academicPeriodId: 'p', competencyBlockId: 'b1', name: 'Actividad', maxScore: 20, date,
    }))
    expect(errors.map(error => error.property)).toContain('date')
  })
})
