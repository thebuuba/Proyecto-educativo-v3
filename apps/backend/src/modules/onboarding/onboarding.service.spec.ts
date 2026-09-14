import { beforeEach, describe, expect, it, vi } from 'vitest'
import { OnboardingService } from './onboarding.service'

const mocks = vi.hoisted(() => ({
  progress: {
    findMany: vi.fn(),
    upsert: vi.fn(),
  },
}))

vi.mock('@aula/database', () => ({
  prisma: { onboardingTourProgress: mocks.progress },
}))

describe('OnboardingService', () => {
  const user = { id: 'user-1', schoolId: 'school-1', email: 'user@example.com', roles: ['teacher'] }

  beforeEach(() => vi.clearAllMocks())

  it('lists progress scoped to the authenticated user and school', async () => {
    mocks.progress.findMany.mockResolvedValue([])

    await new OnboardingService().list(user)

    expect(mocks.progress.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1', schoolId: 'school-1' },
      orderBy: { updatedAt: 'desc' },
    })
  })

  it('upserts progress without accepting identity from the request body', async () => {
    mocks.progress.upsert.mockResolvedValue({ tourKey: 'teacher-basics', version: 1 })

    await new OnboardingService().save(user, 'teacher-basics', {
      version: 1,
      status: 'IN_PROGRESS',
      lastStep: 2,
    })

    expect(mocks.progress.upsert).toHaveBeenCalledWith({
      where: {
        userId_schoolId_tourKey: { userId: 'user-1', schoolId: 'school-1', tourKey: 'teacher-basics' },
      },
      create: {
        userId: 'user-1', schoolId: 'school-1', tourKey: 'teacher-basics', version: 1,
        status: 'IN_PROGRESS', lastStep: 2,
      },
      update: { version: 1, status: 'IN_PROGRESS', lastStep: 2 },
    })
  })
})
