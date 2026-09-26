import { beforeEach, describe, expect, it, vi } from 'vitest'

const queryRaw = vi.hoisted(() => vi.fn())
const transaction = vi.hoisted(() => vi.fn())

vi.mock('@aula/database', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@aula/database')>()),
  prisma: { $queryRaw: queryRaw, $transaction: transaction },
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

  it('searches geolocated centers by distance without requiring a name', async () => {
    queryRaw.mockResolvedValue([{ id: 'near', distance: 1 }])
    await expect(new SchoolsService().search('', 50, 19.22, -70.53)).resolves.toHaveLength(1)
    const query = queryRaw.mock.calls[0][0]
    expect(query.sql).toContain('s.lat IS NOT NULL AND s.lng IS NOT NULL')
    expect(query.sql).toContain('distance ASC NULLS LAST')
    expect(query.sql).not.toContain('LIKE')
  })

  it('does not list all centers without either a name or a complete location', async () => {
    await expect(new SchoolsService().search()).resolves.toEqual([])
    await expect(new SchoolsService().search('', 50, 19.22)).resolves.toEqual([])
    expect(queryRaw).not.toHaveBeenCalled()
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

describe('SchoolsService.create', () => {
  const dto = { name: 'Colegio Nuevo', sector: 'private' as const, district: 'La Vega, Centro', centerCode: '12345' }
  const tx = { $queryRaw: vi.fn(), school: { create: vi.fn(), findUniqueOrThrow: vi.fn() } }
  beforeEach(() => {
    vi.clearAllMocks()
    tx.$queryRaw.mockReset().mockResolvedValue([])
    transaction.mockImplementation(operation => operation(tx))
  })

  it('stores a shared school without inventing coordinates or academic offerings', async () => {
    tx.school.create.mockResolvedValue({ id: 'new', ...dto })
    const result = await new SchoolsService().create(dto)
    expect(result.created).toBe(true)
    expect(tx.school.create).toHaveBeenCalledWith({ data: expect.objectContaining({
      ...dto, niveles: [], tandas: [], modalidades: [], officialExportsEnabled: false,
      slug: expect.stringMatching(/^centro-[a-f0-9]{64}$/),
    }) })
    expect(tx.school.create.mock.calls[0][0].data).not.toHaveProperty('lat')
    expect(tx.$queryRaw.mock.calls[0][0].join('')).toContain('pg_advisory_xact_lock')
  })

  it('reuses an existing school without overwriting its data', async () => {
    tx.$queryRaw.mockResolvedValueOnce([]).mockResolvedValueOnce([{ id: 'existing' }])
    tx.school.findUniqueOrThrow.mockResolvedValue({ id: 'existing', name: 'Nombre oficial', status: 'ACTIVE' })
    await expect(new SchoolsService().create(dto)).resolves.toEqual({
      created: false, school: { id: 'existing', name: 'Nombre oficial', status: 'ACTIVE' },
    })
    expect(tx.school.create).not.toHaveBeenCalled()
    const query = tx.$queryRaw.mock.calls[1][0]
    expect(query.values).toContain('12345')
    expect(query.values).toContain('colegio nuevo')
    expect(query.values).toContain('la vega centro')
  })

  it('does not reactivate a disabled school', async () => {
    tx.$queryRaw.mockResolvedValueOnce([]).mockResolvedValueOnce([{ id: 'existing' }])
    tx.school.findUniqueOrThrow.mockResolvedValue({ id: 'existing', status: 'ARCHIVED' })
    await expect(new SchoolsService().create(dto)).rejects.toThrow('no está activo')
    expect(tx.school.create).not.toHaveBeenCalled()
  })

  it('rejects meaningless names before touching the database', async () => {
    await expect(new SchoolsService().create({ ...dto, name: '---' })).rejects.toThrow('nombre')
    expect(transaction).not.toHaveBeenCalled()
  })
})
