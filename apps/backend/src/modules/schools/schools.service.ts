import { Injectable } from '@nestjs/common'
import { prisma } from '@aula/database'

@Injectable()
export class SchoolsService {
  async search(q: string, limit = 50) {
    const schools = await prisma.school.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { district: { contains: q, mode: 'insensitive' } },
        ],
        status: 'ACTIVE',
      },
      select: { id: true, name: true, slug: true, sector: true, district: true, niveles: true, tandas: true, modalidades: true },
      take: limit,
      orderBy: { name: 'asc' },
    })
    return schools
  }
}
