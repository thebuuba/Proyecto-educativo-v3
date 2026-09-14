import { Injectable } from '@nestjs/common'
import { prisma } from '@aula/database'
import type { AuthenticatedUser } from '../auth/types/authenticated-user'
import type { SaveTourProgressDto } from './dto/save-tour-progress.dto'

@Injectable()
export class OnboardingService {
  list(user: AuthenticatedUser) {
    return prisma.onboardingTourProgress.findMany({
      where: { userId: user.id, schoolId: user.schoolId },
      orderBy: { updatedAt: 'desc' },
    })
  }

  save(user: AuthenticatedUser, tourKey: string, dto: SaveTourProgressDto) {
    const progress = { version: dto.version, status: dto.status, lastStep: dto.lastStep }
    return prisma.onboardingTourProgress.upsert({
      where: { userId_schoolId_tourKey: { userId: user.id, schoolId: user.schoolId, tourKey } },
      create: { userId: user.id, schoolId: user.schoolId, tourKey, ...progress },
      update: progress,
    })
  }
}
