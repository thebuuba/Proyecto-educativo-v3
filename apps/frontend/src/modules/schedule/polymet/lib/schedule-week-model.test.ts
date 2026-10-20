import { describe, expect, it } from 'vitest'
import { buildWeekModel, computeNow, findOverlap } from './schedule-week-model'
import type { ScheduleEntry, ScheduleWorkspace, TimeSlot } from './schedule-types'

const slot: TimeSlot = { id: 'slot', name: 'P1', startTime: '08:00', endTime: '09:00', dayOfWeek: 1, blockType: 'CLASS', journeyId: null, status: 'ACTIVE', sequence: 1 }
const entry: ScheduleEntry = { id: 'entry', schoolYearId: 'year', academicPeriodId: null, sectionSubjectId: 'ss', sectionId: 'section', timeSlotId: 'slot', dayOfWeek: 1, room: null, status: 'ACTIVE', subjectName: 'Math', teacherName: 'T', gradeName: '1', academicLevelName: 'Primary', sectionName: 'A', timeSlotName: 'P1', startTime: '08:00', endTime: '09:00' }
const workspace = (entries: ScheduleEntry[], timeSlots = [slot]): ScheduleWorkspace => ({ currentSchoolYear: null, entries, timeSlots, sections: [], teachers: [], subjects: [] })

describe('live week model', () => {
  it('keeps pending entries only in review without occupying the former period', () => {
    const pending = { ...entry, needsPlacement: true }
    const model = buildWeekModel({ ...workspace([pending]), integrityIssues: [{ code: 'NEEDS_PLACEMENT', entryIds: [entry.id], affectedClasses: 1, gradeName: '1', sectionName: 'A', subjectName: 'Math', message: 'Relocate' }] })
    expect(model.totals).toMatchObject({ classes: 0, freePeriods: 1, review: 1, teachingMinutes: 0 })
    expect(model.review[0].entries).toEqual([pending])
    expect(model.review[0]).toMatchObject({ kind: 'orphan', cellKey: null })
    expect(computeNow(model, new Date(2026, 9, 19, 8, 30)).type).toBe('none')
    expect(findOverlap([pending], model.days[0].cells[0])).toBeNull()
  })
  it('excludes inactive and archived entries and slots ignoring status case', () => {
    const model = buildWeekModel(workspace([{ ...entry, status: 'inactive' }, { ...entry, id: 'archived', status: 'archived' }], [slot, { ...slot, id: 'inactive-slot', status: 'inactive' }, { ...slot, id: 'archived-slot', status: 'archived' }]))
    expect(model.days[0].cells).toHaveLength(1)
    expect(model.totals).toMatchObject({ classes: 0, freePeriods: 1, review: 0 })
  })
  it('reviews an orphan exactly once when server reports NEEDS_PLACEMENT', () => {
    const orphan = { ...entry, timeSlotId: 'deleted' }
    const model = buildWeekModel({ ...workspace([orphan]), integrityIssues: [{ code: 'NEEDS_PLACEMENT', entryIds: [entry.id], affectedClasses: 1, gradeName: '1', sectionName: 'A', subjectName: 'Math', message: 'Relocate' }] })
    expect(model.review).toHaveLength(1)
    expect(model.review[0].entries).toEqual([orphan])
  })
})
