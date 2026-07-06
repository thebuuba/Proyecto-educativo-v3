import { Injectable } from '@nestjs/common'
import { Prisma, prisma } from '@aula/database'

@Injectable()
export class SchoolsService {
  async search(q: string, limit = 50, lat?: number, lng?: number) {
    const hasLocation = lat != null && lng != null

    if (!hasLocation) {
      const searchTerm = `%${q}%`
      return prisma.$queryRaw<any[]>(Prisma.sql`
        SELECT id, name, slug, sector, district, niveles, tandas, modalidades
        FROM schools
        WHERE status = 'active'
          AND (name ILIKE ${searchTerm} OR district ILIKE ${searchTerm} OR (name || ' ' || COALESCE(district, '')) ILIKE ${searchTerm})
        ORDER BY name
        LIMIT ${limit}
      `)
    }

    const searchTerm = `%${q}%`
    const schools = await prisma.$queryRaw<any[]>(Prisma.sql`
      SELECT id, name, slug, sector, district, niveles, tandas, modalidades, lat, lng,
        (
          6371 * acos(
            cos(radians(${lat})) * cos(radians(lat)) * cos(radians(lng) - radians(${lng})) +
            sin(radians(${lat})) * sin(radians(lat))
          )
        ) AS distance
      FROM schools
      WHERE status = 'active'
        AND lat IS NOT NULL
        AND lng IS NOT NULL
        AND (name ILIKE ${searchTerm} OR district ILIKE ${searchTerm} OR (name || ' ' || COALESCE(district, '')) ILIKE ${searchTerm})
      ORDER BY distance
      LIMIT ${limit}
    `)

    const remaining = limit - schools.length
    if (remaining <= 0) return schools

    const fallback = await prisma.$queryRaw<any[]>(Prisma.sql`
      SELECT id, name, slug, sector, district, niveles, tandas, modalidades, NULL AS lat, NULL AS lng, NULL AS distance
      FROM schools
      WHERE status = 'active'
        AND (lat IS NULL OR lng IS NULL)
        AND (name ILIKE ${searchTerm} OR district ILIKE ${searchTerm} OR (name || ' ' || COALESCE(district, '')) ILIKE ${searchTerm})
      ORDER BY name
      LIMIT ${remaining}
    `)

    return [...schools, ...fallback]
  }
}
