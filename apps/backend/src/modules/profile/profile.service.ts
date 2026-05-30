import { Injectable } from '@nestjs/common'
import { prisma } from '@aula/database'

@Injectable()
export class ProfileService {
  getProfile(userId: string) {
    return prisma.appUser.findUnique({
      where: { id: userId },
      select: { id: true, email: true, fullName: true, avatarUrl: true, phone: true },
    })
  }
}
