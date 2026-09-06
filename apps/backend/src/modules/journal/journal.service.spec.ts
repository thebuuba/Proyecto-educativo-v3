import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  deleteEntry: vi.fn(),
  findEntry: vi.fn(),
  updateEntry: vi.fn(),
  countStudents: vi.fn(),
}))

vi.mock('@aula/database', () => ({
  prisma: {
    teacherJournalEntry: {
      delete: mocks.deleteEntry,
      findFirst: mocks.findEntry,
      update: mocks.updateEntry,
    },
    student: { count: mocks.countStudents },
  },
}))

import { JournalService } from './journal.service'

describe('JournalService', () => {
  beforeEach(() => {
    mocks.deleteEntry.mockReset().mockResolvedValue({})
    mocks.findEntry.mockReset().mockResolvedValue({ id: 'entry-1', status: 'ACTIVE' })
    mocks.updateEntry.mockReset().mockResolvedValue({ id: 'entry-1' })
    mocks.countStudents.mockReset().mockResolvedValue(1)
  })

  it('elimina permanentemente una observación activa que pertenece al docente', async () => {
    const service = new JournalService()

    await expect(service.remove('school-1', 'user-1', 'entry-1')).resolves.toEqual({ id: 'entry-1' })
    expect(mocks.findEntry).toHaveBeenCalledWith({ where: { id: 'entry-1', schoolId: 'school-1', createdById: 'user-1' } })
    expect(mocks.deleteEntry).toHaveBeenCalledWith({ where: { id: 'entry-1' } })
  })

  it('reemplaza los estudiantes relacionados dentro de la actualización atómica', async () => {
    const service = new JournalService()
    const studentId = '11111111-1111-4111-8111-111111111111'

    await service.update('school-1', 'user-1', 'entry-1', {
      entryType: 'student_observation',
      content: 'Observación actualizada',
      occurredAt: '2026-09-06T12:00:00.000Z',
      studentIds: [studentId],
      tags: ['Conducta'],
      requiresFollowUp: false,
    })

    expect(mocks.updateEntry).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'entry-1' },
      data: expect.objectContaining({
        students: {
          deleteMany: {},
          create: [{ schoolId: 'school-1', studentId }],
        },
      }),
    }))
  })
})
