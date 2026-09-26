import { BadRequestException, ConflictException, Injectable } from '@nestjs/common'
import { Prisma, prisma } from '@aula/database'
import { createHash } from 'node:crypto'
import { CreateSchoolDto } from './dto/create-school.dto'

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
    const tokens = meaningfulTokens(normalizedQuery)
    const hasLocation = lat != null && lng != null
    if (!tokens.length && !hasLocation) return []

    const searchableText = Prisma.sql`
      REGEXP_REPLACE(
        TRANSLATE(LOWER(COALESCE(s.name, '') || ' ' || COALESCE(s.district, '') || ' ' || COALESCE(s.center_code, '')), 'áéíóúüñ', 'aeiouun'),
        '[^a-z0-9]+', ' ', 'g'
      )
    `
    const searchableName = Prisma.sql`
      REGEXP_REPLACE(
        TRANSLATE(LOWER(COALESCE(s.name, '')), 'áéíóúüñ', 'aeiouun'),
        '[^a-z0-9]+', ' ', 'g'
      )
    `
    const tokenMatches = tokens.map((token) => Prisma.sql`${searchableText} LIKE ${`%${token}%`}`)
    const textScore = tokens.length ? Prisma.sql`
      CASE WHEN ${searchableName} LIKE ${`%${normalizedQuery}%`} THEN 2 ELSE 0 END
      + ((${Prisma.join(tokenMatches.map((match) => Prisma.sql`CASE WHEN ${match} THEN 1 ELSE 0 END`), ' + ')})::float / ${tokens.length})
    ` : Prisma.sql`0`
    const matches = tokens.length
      ? Prisma.sql`(${Prisma.join(tokenMatches, ' OR ')})`
      : Prisma.sql`s.lat IS NOT NULL AND s.lng IS NOT NULL`
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
        s.regional_code AS "regionalCode", s.regional_name AS "regionalName",
        s.district_code AS "districtCode", s.district_name AS "districtName",
        s.niveles, s.tandas, s.modalidades, s.lat, s.lng,
        ${distance} AS distance,
        sy.name AS "schoolYearName",
        sy.start_date AS "schoolYearStartDate",
        sy.end_date AS "schoolYearEndDate",
        (${textScore}) AS "textScore"
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
      ORDER BY "textScore" DESC, distance ASC NULLS LAST, s.name ASC, s.id ASC
      LIMIT ${limit}
    `)
  }
}
