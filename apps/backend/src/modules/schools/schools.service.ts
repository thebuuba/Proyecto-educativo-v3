import { Injectable } from '@nestjs/common'
import { prisma } from '@aula/database'

@Injectable()
export class SchoolsService {
  async search(q: string, limit = 50, lat?: number, lng?: number) {
    const hasLocation = lat != null && lng != null
    const distanceExpr = hasLocation
      ? `(6371 * acos(cos(radians(${lat})) * cos(radians(lat)) * cos(radians(lng) - radians(${lng})) + sin(radians(${lat})) * sin(radians(lat))))`
      : null

    const selectCols = hasLocation
      ? `id, name, slug, sector, district, niveles, tandas, modalidades, lat, lng, ${distanceExpr} AS distance`
      : `id, name, slug, sector, district, niveles, tandas, modalidades`
    const orderClause = hasLocation ? `distance` : `name`

    const schools = await prisma.$queryRawUnsafe<any[]>(
      `SELECT ${selectCols}
       FROM schools
       WHERE status = 'active'
         AND (name ILIKE $1 OR district ILIKE $1 OR (name || ' ' || COALESCE(district, '')) ILIKE $1)
         ${hasLocation ? `AND lat IS NOT NULL AND lng IS NOT NULL` : ''}
       ORDER BY ${orderClause}
       LIMIT $2`,
      `%${q}%`,
      limit,
    )

    if (!hasLocation) return schools

    const remaining = limit - schools.length
    if (remaining <= 0) return schools

    const fallback = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, name, slug, sector, district, niveles, tandas, modalidades, NULL AS lat, NULL AS lng, NULL AS distance
       FROM schools
       WHERE status = 'active'
         AND (lat IS NULL OR lng IS NULL)
         AND (name ILIKE $1 OR district ILIKE $1 OR (name || ' ' || COALESCE(district, '')) ILIKE $1)
       ORDER BY name
       LIMIT $2`,
      `%${q}%`,
      remaining,
    )

    return [...schools, ...fallback]
  }
}
