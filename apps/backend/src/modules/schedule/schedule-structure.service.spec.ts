import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  const tx = {
    scheduleJourney: {
      findMany: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    scheduleEntry: { findFirst: vi.fn(), updateMany: vi.fn(), deleteMany: vi.fn() },
    timeSlot: {
      findMany: vi.fn(),
      update: vi.fn(),
      createMany: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
      deleteMany: vi.fn(),
    },
  }
  return {
    tx,
    transaction: vi.fn(async (operation: (client: typeof tx) => Promise<unknown>) => operation(tx)),
  }
})

vi.mock('@aula/database', () => ({
  prisma: { $transaction: mocks.transaction, timeSlot: mocks.tx.timeSlot },
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
        name: 'Clase 1', status: 'ACTIVE', blockType: 'CLASS',
      },
    ])
    mocks.tx.timeSlot.update.mockResolvedValue({ id: slotId })
    mocks.tx.scheduleEntry.findFirst.mockResolvedValue(null)
  })

  it('reutiliza solamente el bloque con id explicito y no crea duplicados', async () => {
    const service = new ScheduleService()
    await expect(service.saveStructure({ schoolId, ownerUserId: 'user-1' }, { ...dto, blocks: [{ ...dto.blocks[0], id: slotId }] })).resolves.toEqual({ saved: true })

    expect(mocks.tx.timeSlot.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: slotId, schoolId, ownerUserId: 'user-1' } }),
    )
    expect(mocks.tx.timeSlot.createMany).not.toHaveBeenCalled()
    expect(mocks.tx.timeSlot.deleteMany).not.toHaveBeenCalled()
  })

  it('elimina primero las asignaciones y después la estructura completa', async () => {
    mocks.tx.scheduleEntry.deleteMany.mockResolvedValue({ count: 4 })
    mocks.tx.timeSlot.deleteMany.mockResolvedValue({ count: 6 })
    mocks.tx.scheduleJourney.deleteMany.mockResolvedValue({ count: 1 })

    const service = new ScheduleService()
    await expect(service.deleteStructure({ schoolId, ownerUserId: 'user-1' })).resolves.toEqual({
      deleted: { assignments: 4, blocks: 6, journeys: 1 },
    })

    expect(mocks.tx.scheduleEntry.deleteMany).toHaveBeenCalledWith({ where: { schoolId, timeSlot: { ownerUserId: 'user-1' } } })
    expect(mocks.tx.timeSlot.deleteMany).toHaveBeenCalledWith({ where: { schoolId, ownerUserId: 'user-1' } })
    expect(mocks.tx.scheduleJourney.deleteMany).toHaveBeenCalledWith({ where: { schoolId, ownerUserId: 'user-1' } })
    expect(mocks.tx.scheduleEntry.deleteMany.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.tx.timeSlot.deleteMany.mock.invocationCallOrder[0],
    )
    expect(mocks.tx.timeSlot.deleteMany.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.tx.scheduleJourney.deleteMany.mock.invocationCallOrder[0],
    )
  })

  it('crea el primer horario de una cuenta nueva con su propietario', async () => {
    mocks.tx.scheduleJourney.findMany.mockResolvedValue([])
    mocks.tx.scheduleJourney.create.mockResolvedValue({ id: journeyId })
    mocks.tx.timeSlot.findMany.mockResolvedValue([])
    await expect(new ScheduleService().saveStructure({ schoolId, ownerUserId: 'new-teacher' }, dto))
      .resolves.toEqual({ saved: true })
    expect(mocks.tx.scheduleJourney.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ schoolId, ownerUserId: 'new-teacher' }),
    })
    expect(mocks.tx.timeSlot.createMany).toHaveBeenCalledWith({
      data: [expect.objectContaining({ schoolId, ownerUserId: 'new-teacher', journeyId })],
    })
    expect(mocks.tx.timeSlot.deleteMany).not.toHaveBeenCalled()
  })
})


describe('ScheduleService pending placement', () => {
  const scope = { schoolId, ownerUserId: 'user-1' }
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.tx.scheduleJourney.findMany.mockResolvedValue([{ id: journeyId, status: 'ACTIVE' }])
    mocks.tx.scheduleJourney.update.mockResolvedValue({ id: journeyId })
    mocks.tx.timeSlot.findMany.mockResolvedValue([{ id: slotId, journeyId, dayOfWeek: 1, sequence: 1, blockType: 'CLASS', status: 'ACTIVE', startTime: '07:30', endTime: '08:10' }])
    mocks.tx.scheduleEntry.findFirst.mockResolvedValue({ id: 'entry-1', timeSlotId: slotId })
  })

  it('preserves occupied removed periods as inactive history and marks their classes pending', async () => {
    await expect(new ScheduleService().saveStructure(scope, { ...dto, blocks: [] })).resolves.toEqual({ saved: true })
    expect(mocks.tx.timeSlot.update).toHaveBeenCalledWith({ where: { id: slotId, ...scope }, data: { status: 'INACTIVE' } })
    expect(mocks.tx.scheduleEntry.updateMany).toHaveBeenCalledWith({ where: { schoolId, timeSlot: { ownerUserId: 'user-1' }, timeSlotId: { in: [slotId] } }, data: { needsPlacement: true } })
    expect(mocks.tx.scheduleEntry.deleteMany).not.toHaveBeenCalled()
    expect(mocks.tx.timeSlot.deleteMany).not.toHaveBeenCalled()
  })

  it('archives removed journeys without deleting their referenced periods', async () => {
    await expect(new ScheduleService().saveStructure(scope, { journeys: [], blocks: [] })).resolves.toEqual({ saved: true })
    expect(mocks.tx.scheduleJourney.update).toHaveBeenCalledWith({ where: { id: journeyId, ...scope }, data: { status: 'INACTIVE' } })
    expect(mocks.tx.scheduleJourney.delete).not.toHaveBeenCalled()
  })

  it.each([{ blockType: 'BREAK' }, { dayOfWeek: 2 }])('preserves original hours when an occupied period changes identity: %o', async (change) => {
    await new ScheduleService().saveStructure(scope, { ...dto, blocks: [{ ...dto.blocks[0], id: slotId, ...change, startTime: '08:00', endTime: '08:40' }] })
    expect(mocks.tx.timeSlot.update).toHaveBeenCalledWith({ where: { id: slotId, ...scope }, data: { status: 'INACTIVE' } })
    expect(mocks.tx.timeSlot.createMany).toHaveBeenCalledWith({ data: [expect.objectContaining(change)] })
  })
})


it('preserves historical class hours when the block CRUD converts it to a break', async () => {
  vi.clearAllMocks()
  const original = { id: slotId, schoolId, ownerUserId: 'user-1', journeyId: null, dayOfWeek: 1, blockType: 'CLASS', status: 'ACTIVE', name: 'Clase 1', startTime: new Date('1970-01-01T07:30:00Z'), endTime: new Date('1970-01-01T08:10:00Z'), sequence: 1, blockSource: 'MANUAL', sourceKey: null }
  mocks.tx.timeSlot.findFirst.mockResolvedValue(original)
  mocks.tx.timeSlot.create.mockImplementation(async ({ data }) => ({ ...data, id: 'new-break' }))
  const result = await new ScheduleService().updateTimeSlot({ schoolId, ownerUserId: 'user-1' }, slotId, { blockType: 'BREAK', startTime: '08:00' })
  expect(result.id).toBe('new-break')
  expect(mocks.tx.timeSlot.update).toHaveBeenCalledWith({ where: { id: slotId, schoolId, ownerUserId: 'user-1' }, data: { status: 'INACTIVE' } })
  expect(mocks.tx.scheduleEntry.updateMany).toHaveBeenCalledWith(expect.objectContaining({ data: { needsPlacement: true } }))
})


it('creates a new period without an id instead of inheriting the removed period assignments by sequence', async () => {
  vi.clearAllMocks()
  mocks.tx.scheduleJourney.findMany.mockResolvedValue([{ id: journeyId }])
  mocks.tx.scheduleJourney.update.mockResolvedValue({ id: journeyId })
  mocks.tx.timeSlot.findMany.mockResolvedValue([{ id: slotId, journeyId, dayOfWeek: 1, sequence: 1, status: 'ACTIVE', blockType: 'CLASS' }])
  await new ScheduleService().saveStructure({ schoolId, ownerUserId: 'user-1' }, dto)
  expect(mocks.tx.timeSlot.createMany).toHaveBeenCalledWith({ data: [expect.objectContaining({ sequence: 1, blockType: 'CLASS' })] })
  expect(mocks.tx.timeSlot.update).toHaveBeenCalledWith({ where: { id: slotId, schoolId, ownerUserId: 'user-1' }, data: { status: 'INACTIVE' } })
  expect(mocks.tx.scheduleEntry.updateMany).toHaveBeenCalledWith(expect.objectContaining({ data: { needsPlacement: true } }))
})
