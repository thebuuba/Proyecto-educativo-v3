import { describe, expect, it } from 'vitest'

import { getSmartSuggestion } from './dashboardService'

const completeSetup = {
  courseCount: 1,
  studentCount: 1,
  activeEnrollments: 1,
  scheduleEntryCount: 1,
  attendanceCount: 1,
  planningCount: 1,
}

describe('getSmartSuggestion', () => {
  it('prioritizes missing setup and then low weekly attendance', () => {
    expect(getSmartSuggestion({ ...completeSetup, courseCount: 0 }, null)?.path).toBe('/cursos')
    expect(getSmartSuggestion(completeSetup, {
      average: 72,
      trendPercent: -8,
      activityCount: 10,
      days: [],
    })?.title).toContain('72 %')
  })
})
