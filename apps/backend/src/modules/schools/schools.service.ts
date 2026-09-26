import { Injectable } from '@nestjs/common'
import { Prisma, prisma } from '@aula/database'

const INSTITUTION_WORDS = new Set(['colegio', 'escuela', 'liceo', 'centro', 'educativo', 'educativa', 'politecnico', 'instituto'])

export function normalizeSchoolSearchQuery(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function meaningfulTokens(query: string) {
  const tokens = query.split(' ').filter((token) => token.length > 1 && !INSTITUTION_WORDS.has(token))
  return tokens.length ? tokens : query.split(' ').filter((token) => token.length > 1)
}

@Injectable()
export class SchoolsService {
  async search(q: string, limit = 50, lat?: number, lng?: number) {
    const normalizedQuery = normalizeSchoolSearchQuery(q)
    const tokens = meaningfulTokens(normalizedQuery)
    if (!tokens.length) return []

    const searchableText = Prisma.sql`
      REGEXP_REPLACE(
        TRANSLATE(LOWER(COALESCE(s.name, '') || ' ' || COALESCE(s.district, '') || ' ' || COALESCE(s.center_code, '')), 'áéíóúüñ', 'aeiouun'),
        '[^a-z0-9]+', ' ', 'g'
      )
    `
    const tokenMatches = tokens.map((token) => Prisma.sql`${searchableText} LIKE ${`%${token}%`}`)
    const tokenScore = Prisma.join(tokenMatches.map((match) => Prisma.sql`CASE WHEN ${match} THEN 1 ELSE 0 END`), ' + ')
    const hasLocation = lat != null && lng != null
    const distance = hasLocation
      ? Prisma.sql`CASE WHEN s.lat IS NOT NULL AND s.lng IS NOT NULL THEN
          6371 * ACOS(LEAST(1, GREATEST(-1,
            COS(RADIANS(${lat})) * COS(RADIANS(s.lat)) * COS(RADIANS(s.lng) - RADIANS(${lng})) +
            SIN(RADIANS(${lat})) * SIN(RADIANS(s.lat))
          )))
        END`
      : Prisma.sql`NULL::double precision`

    return prisma.$queryRaw<any[]>(Prisma.sql`
      SELECT
        s.id, s.name, s.slug, s.sector, s.center_code AS "centerCode", s.district,
        s.niveles, s.tandas, s.modalidades, s.lat, s.lng,
        ${distance} AS distance,
        sy.name AS "schoolYearName",
        sy.start_date AS "schoolYearStartDate",
        sy.end_date AS "schoolYearEndDate",
        (extensions.similarity(${searchableText}, ${normalizedQuery}) + ((${tokenScore})::float / ${tokens.length})) AS "textScore"
      FROM schools s
      LEFT JOIN LATERAL (
        SELECT name, start_date, end_date
        FROM school_years
        WHERE school_id = s.id AND is_current = true AND status = 'active'
        ORDER BY start_date DESC
        LIMIT 1
      ) sy ON true
      WHERE s.status = 'active'
        AND (
          ${Prisma.join(tokenMatches, ' OR ')}
          OR extensions.similarity(${searchableText}, ${normalizedQuery}) >= 0.18
        )
      ORDER BY "textScore" DESC, distance ASC NULLS LAST, s.name ASC, s.id ASC
      LIMIT ${limit}
    `)
  }
}
