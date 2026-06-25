import { beforeEach, describe, expect, it, vi } from 'vitest'
import { StudentsService } from './students.service'

const mocks = vi.hoisted(() => ({
  prisma: {
    student: { findFirst: vi.fn() },
    studentGuardian: { findMany: vi.fn() },
    guardianNotification: { createMany: vi.fn() },
  },
}))

vi.mock('@aula/database', () => ({
  prisma: mocks.prisma,
  Prisma: { PrismaClientKnownRequestError: class {} },
}))

describe('StudentsService.notifyGuardians', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.prisma.student.findFirst.mockResolvedValue({ id: 'student-1' })
    mocks.prisma.studentGuardian.findMany.mockResolvedValue([
      { guardianId: 'guardian-1' },
      { guardianId: 'guardian-2' },
    ])
    mocks.prisma.guardianNotification.createMany.mockResolvedValue({ count: 2 })
  })

  it('persists one guardian notification per guardian link', async () => {
    const result = await new StudentsService().notifyGuardians('school-1', 'student-1', 'user-1', {
      subject: 'Aviso',
      message: 'Mensaje',
    })

    expect(mocks.prisma.guardianNotification.createMany).toHaveBeenCalledWith({
      data: [
        {
          schoolId: 'school-1',
          studentId: 'student-1',
          guardianId: 'guardian-1',
          createdBy: 'user-1',
          subject: 'Aviso',
          message: 'Mensaje',
          status: 'queued',
        },
        {
          schoolId: 'school-1',
          studentId: 'student-1',
          guardianId: 'guardian-2',
          createdBy: 'user-1',
          subject: 'Aviso',
          message: 'Mensaje',
          status: 'queued',
        },
      ],
    })
    expect(result.notified).toBe(2)
  })
})
