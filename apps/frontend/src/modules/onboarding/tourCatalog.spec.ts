import { describe, expect, it } from 'vitest'
import { getToursForRoles } from './tourCatalog'

const emptySetup = { courseCount: 0, studentCount: 0, activeEnrollments: 0, scheduleEntryCount: 0, attendanceCount: 0, planningCount: 0 }

describe('tour catalog', () => {
  it('offers setup and administration guidance to management roles', () => {
    expect(getToursForRoles(['admin'], emptySetup).map((tour) => tour.key)).toEqual(
      expect.arrayContaining(['general-navigation', 'management-setup']),
    )
  })

  it('offers teaching workflows without administration to teachers', () => {
    const keys = getToursForRoles(['teacher'], emptySetup).map((tour) => tour.key)
    expect(keys).toContain('teacher-workflow')
    expect(keys).not.toContain('management-setup')
  })

  it('gives viewers a read-only orientation', () => {
    expect(getToursForRoles(['viewer'], emptySetup).map((tour) => tour.key)).toEqual(['general-navigation'])
  })

  it('removes management setup when every real action is complete', () => {
    const complete = { courseCount: 1, studentCount: 1, activeEnrollments: 1, scheduleEntryCount: 1, attendanceCount: 1, planningCount: 1 }
    expect(getToursForRoles(['director'], complete).some((tour) => tour.key === 'management-setup')).toBe(false)
  })
})
