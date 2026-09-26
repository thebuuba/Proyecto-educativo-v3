import { BadRequestException, ConflictException, Injectable } from '@nestjs/common'
import { Prisma, prisma } from '@aula/database'
import { createHash } from 'node:crypto'
import { CreateSchoolDto } from './dto/create-school.dto'

const INSTITUTION_WORDS = new Set(['colegio', 'escuela', 'liceo', 'centro', 'educativo', 'educativa', 'politecnico', 'instituto'])
const SEARCH_STOP_WORDS = new Set(['de', 'del', 'la', 'las', 'los', 'el', 'y', 'en'])
const TEXT_SCORE = { exact: 1000, phrasePrefix: 950, tokenPrefix: 850, allTokens: 700 } as const
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
  const tokens = query.split(' ').filter((token) => token.length > 1 && !INSTITUTION_WORDS.has(token) && !SEARCH_STOP_WORDS.has(token))
  return tokens.length ? tokens : query.split(' ').filter(Boolean)
}

@Injectable()
export class SchoolsService {
  async create(dto: CreateSchoolDto) {
    const name = dto.name.trim().replace(/\s+/g, ' ')
    const district = dto.district.trim().replace(/\s+/g, ' ')
    const normalizeIdentity = (value: string) => normalizeSchoolSearchQuery(value).replace(/-/g, ' ').replace(/\s+/g, ' ').trim()
    const normalizedName = normalizeIdentity(name)
    const normalizedDistrict = normalizeIdentity(district)
    if (normalizedName.length < 3 || normalizedDistrict.length < 3) throw new BadRequestException('Escribe el nombre y la ubicación del centro.')
    const centerCode = dto.centerCode?.trim().toUpperCase() || null
    return prisma.$transaction(async tx => {
      // Serializa las altas del directorio para evitar duplicados entre solicitudes simultáneas.
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext('schools:register'))::text`
      const duplicates = await tx.$queryRaw<Array<{ id: string }>>(Prisma.sql`
        SELECT id FROM schools
        WHERE (${centerCode}::text IS NOT NULL AND UPPER(TRIM(center_code)) = ${centerCode})
          OR (
            TRIM(REGEXP_REPLACE(TRANSLATE(LOWER(name), 'áéíóúüñ', 'aeiouun'), '[^a-z0-9]+', ' ', 'g')) = ${normalizedName}
            AND TRIM(REGEXP_REPLACE(TRANSLATE(LOWER(COALESCE(district, '')), 'áéíóúüñ', 'aeiouun'), '[^a-z0-9]+', ' ', 'g')) = ${normalizedDistrict}
          )
        ORDER BY created_at ASC LIMIT 1
      `)
      if (duplicates.length) {
        const school = await tx.school.findUniqueOrThrow({ where: { id: duplicates[0].id } })
        if (school.status !== 'ACTIVE') throw new ConflictException('Este centro ya existe, pero no está activo. Contacta con soporte.')
        return { school, created: false }
      }
      const identity = createHash('sha256').update(JSON.stringify([normalizedName, normalizedDistrict])).digest('hex')
      const school = await tx.school.create({ data: {
        name, district, centerCode, sector: dto.sector, slug: `centro-${identity}`,
        // La oferta y las coordenadas del centro no se infieren de los datos del docente.
        niveles: [], tandas: [], modalidades: [], officialExportsEnabled: false,
      } })
      return { school, created: true }
    }, { timeout: 20_000 })
  }

  async search(q = '', limit = 50, lat?: number, lng?: number) {
    const normalizedQuery = normalizeSchoolSearchQuery(q)
    const tokens = meaningfulSchoolSearchTokens(normalizedQuery)
    const hasLocation = lat != null && lng != null
    if (!tokens.length && !hasLocation) return []

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
    const tokenMatchCount = tokens.length
      ? Prisma.sql`(${Prisma.join(tokenMatches.map((match) => Prisma.sql`CASE WHEN ${match} THEN 1 ELSE 0 END`), ' + ')})`
      : Prisma.sql`0`
    const matches = tokens.length
      ? Prisma.sql`(${Prisma.join(tokenMatches, ' OR ')})`
      : Prisma.sql`s.lat IS NOT NULL AND s.lng IS NOT NULL`
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
          ${tokenMatchCount} AS matched_tokens,
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
          AND (${matches})
      ), ranked AS (
        SELECT candidates.*,
          ${tokens.length ? Prisma.sql`
            CASE
              WHEN normalized_name = ${normalizedQuery} THEN ${TEXT_SCORE.exact}
              WHEN normalized_name LIKE ${`${normalizedQuery}%`}
                OR normalized_name LIKE ${`% ${normalizedQuery}%`} THEN ${TEXT_SCORE.phrasePrefix}
              WHEN ${Prisma.join(tokenPrefixMatches, ' AND ')} THEN ${TEXT_SCORE.tokenPrefix}
              WHEN matched_tokens = ${tokens.length} THEN ${TEXT_SCORE.allTokens}
              ELSE matched_tokens::double precision / ${tokens.length} * 100
            END
          ` : Prisma.sql`0`}::double precision AS "textScore"
        FROM candidates
      )
      SELECT
        id, name, slug, sector, "centerCode", district,
        "regionalCode", "regionalName", "districtCode", "districtName",
        niveles, tandas, modalidades, lat, lng, distance,
        "schoolYearName", "schoolYearStartDate", "schoolYearEndDate", "textScore"
      FROM ranked
      ORDER BY ("textScore" + CASE WHEN distance IS NOT NULL
        THEN ${MAX_LOCATION_SCORE} / (1 + distance / ${LOCATION_DECAY_KM}) ELSE 0 END) DESC,
        distance ASC NULLS LAST, name ASC, id ASC
      LIMIT ${limit}
    `)
  }
}
