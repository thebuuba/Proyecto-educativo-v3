import { beforeEach, describe, expect, it, vi } from 'vitest'

const queryRaw = vi.hoisted(() => vi.fn())

vi.mock('@aula/database', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@aula/database')>()),
  prisma: { $queryRaw: queryRaw },
}))

import {
  meaningfulSchoolSearchTokens,
  normalizeSchoolSearchQuery,
  schoolSearchCombinedScore,
  SchoolsService,
} from './schools.service'

describe('SchoolsService', () => {
  beforeEach(() => queryRaw.mockReset())

  it('normalizes accents, case, punctuation, and repeated spaces', () => {
    expect(normalizeSchoolSearchQuery('  COLEGIO Católico,  Cardenal  Beras ')).toBe('colegio catolico cardenal beras')
  })

  it('treats institutional and connector words as low-weight search terms', () => {
    expect(meaningfulSchoolSearchTokens(normalizeSchoolSearchQuery('Centro Educativo Eugenio María de Hostos')))
      .toEqual(['eugenio', 'maria', 'hostos'])
  })

  it('ranks equivalent name matches by distance without letting a weak match win', () => {
    const query = 'Eugenio Maria de Hostos'
    const near = schoolSearchCombinedScore('Colegio Eugenio María de Hostos', query, 3)
    const far = schoolSearchCombinedScore('Colegio Eugenio María de Hostos', query, 90)
    const weak = schoolSearchCombinedScore('Eugenio Santos', query, 1)

    expect(near).toBeGreaterThan(far)
    expect(near).toBeGreaterThan(weak)
  })

  it('handles prefix searches without accents or case differences', () => {
    expect(schoolSearchCombinedScore('Eugenio María de Hostos', 'EUGE', 3)).toBeGreaterThan(0)
    expect(schoolSearchCombinedScore('Eugenio María de Hostos', 'euge', 3))
      .toBe(schoolSearchCombinedScore('EUGENIO MARIA DE HOSTOS', 'EUGE', 3))
  })

  it('searches from the first typed character', async () => {
    queryRaw.mockResolvedValue([{ id: 'school-1', name: 'Centro Duarte' }])

    await expect(new SchoolsService().search('C')).resolves.toHaveLength(1)
    expect(meaningfulSchoolSearchTokens('c')).toEqual(['c'])
    expect(queryRaw).toHaveBeenCalledOnce()
  })

  it('keeps centers with the same name as separate results by id', async () => {
    const rows = [
      { id: 'school-sosua', name: 'Centro Duarte', district: 'Sosúa' },
      { id: 'school-puerto-plata', name: 'Centro Duarte', district: 'Puerto Plata' },
    ]
    queryRaw.mockResolvedValue(rows)

    const result = await new SchoolsService().search('Centro Duarte')

    expect(result).toEqual(rows)
    expect(new Set(result.map((school) => school.id)).size).toBe(2)
  })

  it('searches with extra institutional words without requiring them as significant tokens', async () => {
    queryRaw.mockResolvedValue([{ id: 'school-1', name: 'Católico X' }])
    await expect(new SchoolsService().search('Colegio Catolico X')).resolves.toHaveLength(1)
    expect(queryRaw).toHaveBeenCalledOnce()
  })

  it('works without coordinates and does not filter out centers without location', async () => {
    queryRaw.mockResolvedValue([{ id: 'school-without-coordinates', name: 'Escuela Central' }])
    await expect(new SchoolsService().search('Escuela Central')).resolves.toEqual([
      { id: 'school-without-coordinates', name: 'Escuela Central' },
    ])
  })

  it('accepts coordinates as a ranking signal without selecting a center', async () => {
    const rows = [
      { id: 'near', name: 'Centro Duarte', distance: 2.4 },
      { id: 'far', name: 'Centro Duarte', distance: 22 },
    ]
    queryRaw.mockResolvedValue(rows)
    const result = await new SchoolsService().search('Centro Duarte', 50, 19.5, -70.7)
    expect(result).toEqual(rows)
    expect(result).toHaveLength(2)
  })

  it('applies the final limit only after textual and geographic ranking', async () => {
    queryRaw.mockResolvedValue([])
    await new SchoolsService().search('EUGE', 10, 19.22, -70.53)

    const query = queryRaw.mock.calls[0][0]
    const sql = query.strings.join('?').replace(/\s+/g, ' ')
    expect(sql).toContain('WITH candidates AS')
    expect(sql).toContain('ranked AS')
    expect(sql.lastIndexOf('LIMIT')).toBeGreaterThan(sql.indexOf('ORDER BY ("textScore"'))
  })
})
