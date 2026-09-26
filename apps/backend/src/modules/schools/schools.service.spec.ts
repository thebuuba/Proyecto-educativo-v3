import { beforeEach, describe, expect, it, vi } from 'vitest'

const queryRaw = vi.hoisted(() => vi.fn())

vi.mock('@aula/database', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@aula/database')>()),
  prisma: { $queryRaw: queryRaw },
}))

import { normalizeSchoolSearchQuery, SchoolsService } from './schools.service'

describe('SchoolsService', () => {
  beforeEach(() => queryRaw.mockReset())

  it('normalizes accents, case, punctuation, and repeated spaces', () => {
    expect(normalizeSchoolSearchQuery('  COLEGIO Católico,  Cardenal  Beras ')).toBe('colegio catolico cardenal beras')
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
})
