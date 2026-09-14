import { describe, expect, it } from 'vitest'

import { getNextSetupTourStep } from './setupTour'

const emptyProgress = {
  courseCount: 0,
  studentCount: 0,
  activeEnrollments: 0,
  scheduleEntryCount: 0,
  attendanceCount: 0,
  planningCount: 0,
}

describe('getNextSetupTourStep', () => {
  it('starts by guiding a new account to courses', () => {
    expect(getNextSetupTourStep(emptyProgress)).toMatchObject({ id: 'courses', path: '/cursos' })
  })

  it('skips completed actions and resumes at the next pending step', () => {
    expect(getNextSetupTourStep({ ...emptyProgress, courseCount: 1, activeEnrollments: 12 })).toMatchObject({ id: 'schedule', path: '/horario' })
  })

  it('returns null after the setup is complete', () => {
    expect(getNextSetupTourStep({ ...emptyProgress, courseCount: 1, activeEnrollments: 12, scheduleEntryCount: 5, attendanceCount: 1, planningCount: 1 })).toBeNull()
  })
})
