import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  const tx = {
    scheduleJourney: {
      findMany: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    scheduleEntry: { findFirst: vi.fn() },
    timeSlot: {
      findMany: vi.fn(),
      update: vi.fn(),
      createMany: vi.fn(),
      deleteMany: vi.fn(),
    },
  }
  return {
    tx,
    transaction: vi.fn(async (operation: (client: typeof tx) => Promise<unknown>) => operation(tx)),
  }
})

vi.mock('@aula/database', () => ({
  prisma: { $transaction: mocks.transaction },
}))

import { ScheduleService } from './schedule.service'

const schoolId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
const journeyId = '11111111-1111-4111-8111-111111111111'
const slotId = '22222222-2222-4222-8222-222222222222'
const dto = {
  journeys: [
    {
      id: journeyId,
      name: 'Matutina',
      kind: 'MORNING',
      startTime: '07:30',
      endTime: '12:00',
      sequence: 1,
    },
  ],
  blocks: [
    {
      name: 'Clase 1',
      startTime: '07:30',
      endTime: '08:10',
      sequence: 1,
      dayOfWeek: 1,
      blockType: 'CLASS',
      journeyKey: journeyId,
    },
  ],
}

describe('ScheduleService.saveStructure', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.tx.scheduleJourney.findMany.mockResolvedValue([{ id: journeyId }])
    mocks.tx.scheduleJourney.update.mockResolvedValue({ id: journeyId })
    mocks.tx.timeSlot.findMany.mockResolvedValue([
      {
        id: slotId,
        journeyId,
        dayOfWeek: 1,
        sequence: 1,
        name: 'Clase 1',
      },
    ])
    mocks.tx.timeSlot.update.mockResolvedValue({ id: slotId })
    mocks.tx.scheduleEntry.findFirst.mockResolvedValue(null)
  })

  it('reutiliza el bloque natural al reintentar sin ids y no crea duplicados', async () => {
    const service = new ScheduleService()
    await expect(service.saveStructure(schoolId, dto)).resolves.toEqual({ saved: true })

    expect(mocks.tx.timeSlot.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: slotId } }),
    )
    expect(mocks.tx.timeSlot.createMany).not.toHaveBeenCalled()
    expect(mocks.tx.timeSlot.deleteMany).not.toHaveBeenCalled()
  })
})
