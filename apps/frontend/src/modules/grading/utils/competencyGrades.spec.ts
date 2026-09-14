import { describe, expect, it } from 'vitest'

import type { GradeRecordRow, GradingActivity } from '@/modules/grading/types'
import {
  activityRecordName,
  blockTotal,
  buildCompactGradeRows,
  defaultGradeCalculationConfig,
  effectivePeriodScore,
  finalBlockAverage,
  finalSubjectScore,
  plainActivityText,
  scoreForActivity,
  scoreNeedsPersistence,
  sortStudentsForGrades,
  validateScore,
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

  it('calcula el promedio sólo con estudiantes evaluados y conserva el cero explícito', () => {
    const rows = buildCompactGradeRows([
      { enrollmentId: 'enrollment-1', studentId: 'student-1', studentCode: '1', listNumber: 2, firstName: 'Ana', lastName: 'Pérez' },
      { enrollmentId: 'enrollment-2', studentId: 'student-2', studentCode: '2', listNumber: 1, firstName: 'Luis', lastName: 'Gómez' },
      { enrollmentId: 'enrollment-3', studentId: 'student-3', studentCode: '3', listNumber: 3, firstName: 'María', lastName: 'Santos' },
    ], [{ ...activity, maxScore: 20 }], [
      grade({ score: 18, maxScore: 20 }),
      grade({ id: 'grade-2', enrollmentId: 'enrollment-2', score: 0, maxScore: 20 }),
    ])

    expect(rows.map((row) => row.average)).toEqual([90, 0, null])
    expect(sortStudentsForGrades(rows.map((row) => ({ ...row, studentId: row.enrollmentId, studentCode: '' }))).map((row) => row.enrollmentId)).toEqual([
      'enrollment-2', 'enrollment-1', 'enrollment-3',
    ])
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

  it('acepta cero y rechaza valores fuera del máximo', () => {
    expect(validateScore(0, 20)).toBeNull()
    expect(validateScore(21, 20)).toContain('20')
    expect(validateScore(-1, 20)).toContain('negativos')
  })

  it('limpia el Markdown básico de las descripciones', () => {
    expect(plainActivityText('## **Propósito**\nResolver el reto')).toBe('Propósito\nResolver el reto')
  })
})
