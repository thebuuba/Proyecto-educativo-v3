import { describe, expect, it } from 'vitest'
import { ROLES_KEY } from '../../common/decorators/roles.decorator'
import { ScheduleController } from './schedule.controller'

describe('ScheduleController authorization', () => {
  it.each([
    'saveStructure',
    'deleteStructure',
    'updateTimeSlot',
    'createEntry',
    'updateEntry',
    'deleteEntry',
  ] as const)('reserves %s for school administrators', (method) => {
    expect(Reflect.getMetadata(ROLES_KEY, ScheduleController.prototype[method])).toEqual([
      'admin', 'director', 'coordinator',
    ])
  })
})
