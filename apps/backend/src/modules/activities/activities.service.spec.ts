import { describe, expect, it, vi } from 'vitest'
import { ActivitiesService } from './activities.service'

describe('ActivitiesService', () => {
  it('owns the activity use cases exposed by the activities module', async () => {
    const grading = {
      getActivities: vi.fn().mockResolvedValue([]),
      getActivityCenter: vi.fn().mockResolvedValue({ activities: [] }),
      saveActivity: vi.fn().mockResolvedValue({ id: 'activity-1' }),
      linkActivityToPlanning: vi.fn(),
      deleteActivity: vi.fn(),
    }
    const service = new ActivitiesService(grading as never)

    await service.findAll('school-1', { sectionSubjectId: 'ss-1' })
    await service.getCenter('school-1', 'user-1', ['teacher'])
    const saved = await service.save('school-1', 'user-1', { name: 'Actividad' } as never, ['teacher'])
    await service.remove('school-1', 'activity-1')

    expect(grading.getActivities).toHaveBeenCalledWith('school-1', { sectionSubjectId: 'ss-1' })
    expect(grading.getActivityCenter).toHaveBeenCalledWith('school-1', 'user-1', ['teacher'])
    expect(saved).toEqual({ id: 'activity-1' })
    expect(grading.deleteActivity).toHaveBeenCalledWith('school-1', 'activity-1')
  })
})
