import { describe, expect, it } from 'vitest'
import { ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { RolesGuard } from '../../common/guards/roles.guard'
import { ScheduleController } from './schedule.controller'

describe('ScheduleController authorization', () => {
  const mutations = [
    'saveStructure',
    'deleteStructure',
    'createTimeSlot',
    'updateTimeSlot',
    'deleteTimeSlot',
    'createEntry',
    'updateEntry',
    'deleteEntry',
  ] as const
  const guard = new RolesGuard(new Reflector())

  function canMutate(method: typeof mutations[number], roles: string[]) {
    return guard.canActivate({
      getHandler: () => ScheduleController.prototype[method],
      getClass: () => ScheduleController,
      switchToHttp: () => ({ getRequest: () => ({ user: { roles } }) }),
    } as ExecutionContext)
  }

  it.each(mutations)('allows a newly onboarded teacher to use %s', (method) => {
    expect(canMutate(method, ['teacher'])).toBe(true)
  })

  it.each(mutations)('keeps school administrators authorized for %s', (method) => {
    for (const role of ['admin', 'director', 'coordinator']) {
      expect(canMutate(method, [role])).toBe(true)
    }
  })

  it.each(mutations)('rejects unauthorized roles for %s', (method) => {
    for (const roles of [[], ['student'], ['parent']]) {
      expect(canMutate(method, roles)).toBe(false)
    }
  })
})
