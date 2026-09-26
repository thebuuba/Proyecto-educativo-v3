import { Injectable } from '@nestjs/common'
import { Prisma, prisma } from '@aula/database'

const INSTITUTION_WORDS = new Set(['colegio', 'escuela', 'liceo', 'centro', 'educativo', 'educativa', 'politecnico', 'instituto'])
const SEARCH_STOP_WORDS = new Set(['de', 'del', 'la', 'las', 'los', 'el', 'y', 'en'])
const TEXT_SCORE = { exact: 1000, phrasePrefix: 950, tokenPrefix: 850, contains: 700 } as const
const MAX_LOCATION_SCORE = 50
const LOCATION_DECAY_KM = 25

export function normalizeSchoolSearchQuery(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function meaningfulSchoolSearchTokens(query: string) {
  const tokens = query
    .split(' ')
    .filter((token) => token.length > 1 && !INSTITUTION_WORDS.has(token) && !SEARCH_STOP_WORDS.has(token))
  return tokens.length ? tokens : query.split(' ').filter((token) => token.length > 1)
}

export function schoolSearchCombinedScore(name: string, query: string, distance?: number | null) {
  const normalizedName = normalizeSchoolSearchQuery(name)
  const normalizedQuery = normalizeSchoolSearchQuery(query)
  const tokens = meaningfulSchoolSearchTokens(normalizedQuery)
  if (!tokens.length || !tokens.every((token) => normalizedName.includes(token))) return 0

  const startsAtWord = (value: string) => normalizedName.startsWith(value) || normalizedName.includes(` ${value}`)
  const textScore = normalizedName === normalizedQuery
    ? TEXT_SCORE.exact
    : startsAtWord(normalizedQuery)
      ? TEXT_SCORE.phrasePrefix
      : tokens.every(startsAtWord)
        ? TEXT_SCORE.tokenPrefix
        : TEXT_SCORE.contains
  const locationScore = distance != null && Number.isFinite(distance) && distance >= 0
    ? MAX_LOCATION_SCORE / (1 + distance / LOCATION_DECAY_KM)
    : 0
  return textScore + locationScore
}

@Injectable()
export class SchoolsService {
  async search(q: string, limit = 50, lat?: number, lng?: number) {
    const normalizedQuery = normalizeSchoolSearchQuery(q)
    const tokens = meaningfulSchoolSearchTokens(normalizedQuery)
    if (!tokens.length) return []

    const searchableText = Prisma.sql`
      REGEXP_REPLACE(
        TRANSLATE(LOWER(COALESCE(s.name, '') || ' ' || COALESCE(s.district, '') || ' ' || COALESCE(s.center_code, '')), 'áéíóúüñ', 'aeiouun'),
        '[^a-z0-9]+', ' ', 'g'
      )
    `
    const searchableName = Prisma.sql`
      TRIM(REGEXP_REPLACE(
        TRANSLATE(LOWER(COALESCE(s.name, '')), 'áéíóúüñ', 'aeiouun'),
        '[^a-z0-9]+', ' ', 'g'
      ))
    `
    const tokenMatches = tokens.map((token) => Prisma.sql`${searchableText} LIKE ${`%${token}%`}`)
    const tokenPrefixMatches = tokens.map((token) => Prisma.sql`
      (normalized_name LIKE ${`${token}%`} OR normalized_name LIKE ${`% ${token}%`})
    `)
    const hasLocation = lat != null && lng != null
    const distance = hasLocation
      ? Prisma.sql`CASE WHEN s.lat BETWEEN -90 AND 90 AND s.lng BETWEEN -180 AND 180 THEN
          6371 * ACOS(LEAST(1, GREATEST(-1,
            COS(RADIANS(${lat})) * COS(RADIANS(s.lat)) * COS(RADIANS(s.lng) - RADIANS(${lng})) +
            SIN(RADIANS(${lat})) * SIN(RADIANS(s.lat))
          )))
        END`
      : Prisma.sql`NULL::double precision`

    return prisma.$queryRaw<any[]>(Prisma.sql`
      WITH candidates AS (
        SELECT
          s.id, s.name, s.slug, s.sector, s.center_code AS "centerCode", s.district,
          s.regional_code AS "regionalCode", s.regional_name AS "regionalName",
          s.district_code AS "districtCode", s.district_name AS "districtName",
          s.niveles, s.tandas, s.modalidades, s.lat, s.lng,
          ${searchableName} AS normalized_name,
          ${distance} AS distance,
          sy.name AS "schoolYearName",
          sy.start_date AS "schoolYearStartDate",
          sy.end_date AS "schoolYearEndDate"
        FROM schools s
        LEFT JOIN LATERAL (
          SELECT name, start_date, end_date
          FROM school_years
          WHERE school_id = s.id AND is_current = true AND status = 'active'
          ORDER BY start_date DESC
          LIMIT 1
        ) sy ON true
        WHERE s.status = 'active'
          AND (${Prisma.join(tokenMatches, ' AND ')})
      ), ranked AS (
        SELECT candidates.*,
          CASE
            WHEN normalized_name = ${normalizedQuery} THEN ${TEXT_SCORE.exact}
            WHEN normalized_name LIKE ${`${normalizedQuery}%`}
              OR normalized_name LIKE ${`% ${normalizedQuery}%`} THEN ${TEXT_SCORE.phrasePrefix}
            WHEN ${Prisma.join(tokenPrefixMatches, ' AND ')} THEN ${TEXT_SCORE.tokenPrefix}
            ELSE ${TEXT_SCORE.contains}
          END::double precision AS "textScore"
        FROM candidates
      )
      SELECT
        id, name, slug, sector, "centerCode", district,
        "regionalCode", "regionalName", "districtCode", "districtName",
        niveles, tandas, modalidades, lat, lng, distance,
        "schoolYearName", "schoolYearStartDate", "schoolYearEndDate", "textScore"
      FROM ranked
      ORDER BY
        ("textScore" + CASE WHEN distance IS NOT NULL THEN ${MAX_LOCATION_SCORE} / (1 + distance / ${LOCATION_DECAY_KM}) ELSE 0 END) DESC,
        distance ASC NULLS LAST,
        name ASC,
        id ASC
      LIMIT ${limit}
    `)
  }
}
