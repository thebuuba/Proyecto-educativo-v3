import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as service from '@/modules/schedule/services/scheduleService'
import { createLiveScheduleSource } from './live-schedule-source'
vi.mock('@/modules/schedule/services/scheduleService', () => ({ getScheduleWorkspace: vi.fn(), getSectionSubjects: vi.fn(), createScheduleEntry: vi.fn(), updateScheduleEntry: vi.fn(), deleteScheduleEntry: vi.fn(), saveScheduleStructure: vi.fn(), deleteScheduleStructure: vi.fn() }))
const workspace = { currentSchoolYear: null, entries: [{ id: 'placed' }], pendingEntries: [{ id: 'pending' }], timeSlots: [], sections: [{ id: 'section', name: 'A', gradeName: '1', academicLevelName: 'Primary' }], teachers: [], subjects: [] }
beforeEach(() => { vi.resetAllMocks(); vi.mocked(service.getScheduleWorkspace).mockResolvedValue(workspace as never); vi.mocked(service.getSectionSubjects).mockResolvedValue([{ id: 'ss', subjectName: 'Math', appearanceColor: 'blue', teacherName: 'T' }]) })
describe('live schedule source', () => {
  it('shares the workspace request for assignables and includes pending assignments', async () => {
    const source = createLiveScheduleSource()
    const [result, options] = await Promise.all([source.getWorkspace(), source.getAssignableClasses()])
    expect(service.getScheduleWorkspace).toHaveBeenCalledTimes(1)
    expect(result.entries).toEqual([{ id: 'placed' }, { id: 'pending', needsPlacement: true }])
    expect(options).toEqual([{ sectionSubjectId: 'ss', sectionId: 'section', subjectName: 'Math', appearanceColor: 'blue', sectionName: 'A', gradeName: '1', academicLevelName: 'Primary' }])
    vi.mocked(service.getScheduleWorkspace).mockResolvedValue({ ...workspace, sections: [] } as never)
    await source.getWorkspace()
    expect(await source.getAssignableClasses()).toEqual([])
  })
  it('strips unsupported update DTO fields while keeping sectionId', async () => {
    await createLiveScheduleSource().updateEntry('entry', { schoolYearId: 'year', academicPeriodId: 'period', sectionId: 'section', timeSlotId: 'slot', dayOfWeek: 2 })
    expect(service.updateScheduleEntry).toHaveBeenCalledWith('entry', { sectionId: 'section', timeSlotId: 'slot', dayOfWeek: 2 })
  })
  it('isolates source instances and retries a failed workspace lookup', async () => {
    const source = createLiveScheduleSource()
    vi.mocked(service.getScheduleWorkspace).mockRejectedValueOnce(new Error('Offline'))
    await expect(source.getAssignableClasses()).rejects.toThrow('Offline')
    await source.getAssignableClasses()
    await createLiveScheduleSource().getAssignableClasses()
    expect(service.getScheduleWorkspace).toHaveBeenCalledTimes(3)
  })
})
