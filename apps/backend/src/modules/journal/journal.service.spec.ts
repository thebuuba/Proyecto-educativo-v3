import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  deleteEntry: vi.fn(),
  findEntry: vi.fn(),
}))

vi.mock('@aula/database', () => ({
  prisma: {
    teacherJournalEntry: {
      delete: mocks.deleteEntry,
      findFirst: mocks.findEntry,
    },
  },
}))

import { JournalService } from './journal.service'

describe('JournalService', () => {
  beforeEach(() => {
    mocks.deleteEntry.mockReset().mockResolvedValue({})
    mocks.findEntry.mockReset().mockResolvedValue({ id: 'entry-1', status: 'ACTIVE' })
  })

  it('elimina permanentemente una observación activa que pertenece al docente', async () => {
    const service = new JournalService()

    await expect(service.remove('school-1', 'user-1', 'entry-1')).resolves.toEqual({ id: 'entry-1' })
    expect(mocks.findEntry).toHaveBeenCalledWith({ where: { id: 'entry-1', schoolId: 'school-1', createdById: 'user-1' } })
    expect(mocks.deleteEntry).toHaveBeenCalledWith({ where: { id: 'entry-1' } })
  })
})
