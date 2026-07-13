import { describe, expect, it } from 'vitest'

import type { GradeRecordRow, GradingActivity } from '@/modules/grading/types'
import {
  activityRecordName,
  blockTotal,
  defaultGradeCalculationConfig,
  effectivePeriodScore,
  finalBlockAverage,
  finalSubjectScore,
  plainActivityText,
  scoreForActivity,
  scoreNeedsPersistence,
} from './competencyGrades'

const activity: GradingActivity = {
  id: 'activity-1',
  name: 'Presentación final',
  competencyBlockId: 'b1',
  maxScore: 40,
}

function grade(overrides: Partial<GradeRecordRow> = {}): GradeRecordRow {
  return {
    id: 'grade-1',
    enrollmentId: 'enrollment-1',
    score: 32,
    maxScore: 40,
    weight: 1,
    assessmentName: activityRecordName(activity),
    status: 'draft',
    evaluationActivityId: activity.id,
    ...overrides,
  }
}

describe('cálculos del libro de calificaciones', () => {
  it('encuentra registros por relación directa o por el nombre heredado', () => {
    expect(scoreForActivity([grade()], 'enrollment-1', activity.id)?.score).toBe(32)
    expect(scoreForActivity([
      grade({ evaluationActivityId: null }),
    ], 'enrollment-1', activity.id)?.score).toBe(32)
  })

  it('calcula el total del bloque y aplica recuperación sin alterar la nota ordinaria', () => {
    const secondActivity = { ...activity, id: 'activity-2', name: 'Ensayo', maxScore: 60 }
    const records = [
      grade(),
      grade({ id: 'grade-2', score: 50, maxScore: 60, assessmentName: activityRecordName(secondActivity), evaluationActivityId: secondActivity.id }),
    ]
    const total = blockTotal({
      activities: [activity, secondActivity],
      blockId: 'b1',
      enrollmentId: 'enrollment-1',
      records,
    })

    expect(total).toBe(82)
    expect(effectivePeriodScore(total, 90)).toBe(90)
    expect(effectivePeriodScore(total, 70, { ...defaultGradeCalculationConfig, recoveryRule: 'replace-if-higher' })).toBe(82)
  })

  it('promedia competencias y redondea la calificación final', () => {
    expect(finalBlockAverage([80, 90, null, 70])).toBe(80)
    expect(finalSubjectScore([80, 90, 85, 75])).toBe(83)
  })
})

describe('persistencia y presentación de celdas', () => {
  it('evita peticiones cuando el valor no cambió', () => {
    expect(scoreNeedsPersistence(undefined, null)).toBe(false)
    expect(scoreNeedsPersistence(85, 85)).toBe(false)
    expect(scoreNeedsPersistence(85, 86)).toBe(true)
    expect(scoreNeedsPersistence(85, null)).toBe(true)
  })

  it('limpia el Markdown básico de las descripciones', () => {
    expect(plainActivityText('## **Propósito**\nResolver el reto')).toBe('Propósito\nResolver el reto')
  })
})
