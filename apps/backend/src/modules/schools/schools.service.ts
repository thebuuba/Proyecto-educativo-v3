import { Injectable } from '@nestjs/common'
import { prisma } from '@aula/database'

@Injectable()
export class SchoolsService {
  async search(q: string, limit = 50) {
    type SchoolRow = {
      id: string; name: string; slug: string; sector: string
      district: string | null; niveles: string[]; tandas: string[]; modalidades: string[]
    }
    const schools = await prisma.$queryRawUnsafe<SchoolRow[]>(
      `SELECT id, name, slug, sector, district, niveles, tandas, modalidades
       FROM schools
       WHERE status = 'active'
         AND (name ILIKE $1 OR district ILIKE $1 OR (name || ' ' || COALESCE(district, '')) ILIKE $1)
       ORDER BY name
       LIMIT $2`,
      `%${q}%`,
      limit,
    )
    return schools
  }
}
