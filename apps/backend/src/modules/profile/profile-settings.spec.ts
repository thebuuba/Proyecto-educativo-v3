import { beforeEach, describe, expect, it, vi } from 'vitest'

const db = vi.hoisted(() => ({
  appUser: { findFirst: vi.fn(), update: vi.fn() },
  userProfileSettings: { upsert: vi.fn() },
  sectionSubject: { count: vi.fn() },
  $transaction: vi.fn(),
}))
vi.mock('@aula/database', () => ({ prisma: db }))
import { ProfileService } from './profile.service'

const user = { id: 'user', schoolId: 'school', email: 'ana@example.com', roles: ['teacher'] }
const record = () => ({ id: 'user', fullName: 'Ana Pérez', email: user.email, phone: null,
  avatarUrl: null, createdAt: new Date('2026-01-01T00:00:00Z'), school: { name: 'Escuela' },
  teacher: { id: 'teacher', employeeCode: 'DOC-1', status: 'ACTIVE' }, student: null, profileSettings: null })

describe('real profile settings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    db.appUser.findFirst.mockResolvedValue(record())
    db.sectionSubject.count.mockResolvedValue(3)
    db.$transaction.mockImplementation(async (fn) => fn(db))
  })

  it('reads only the current user and school and leaves unknown metrics unavailable', async () => {
    const result = await new ProfileService().getSettings(user)
    expect(db.appUser.findFirst).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'user', schoolId: 'school' } }))
    expect(result.fullName).toBe('Ana Pérez')
    expect(result.preferences).toMatchObject({ publicName: null, birthDate: null, language: 'es', timezone: 'UTC', interests: [] })
    expect(result.stats.map(s => s.value)).toEqual([3, null, null])
    expect(db.sectionSubject.count).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ schoolId: 'school', teacherId: 'teacher' }) }))
    expect(result.academicIdentifier).toEqual({ label: 'Código docente', value: 'DOC-1' })
    expect(db.userProfileSettings.upsert).not.toHaveBeenCalled()
  })

  it('does not invent a matriculation or courses for a user without academic links', async () => {
    db.appUser.findFirst.mockResolvedValue({ ...record(), teacher: null })
    const result = await new ProfileService().getSettings({ ...user, roles: ['admin'] })
    expect(result.academicIdentifier).toBeNull()
    expect(result.stats.map(s => s.value)).toEqual([null, null, null])
  })

  it('can complete the profile using only fields still available in the form', async () => {
    db.appUser.findFirst.mockResolvedValue({ ...record(), phone: '8095551234', avatarUrl: '/api/v1/profile/avatar?v=test',
      profileSettings: { publicName: 'ana', bio: 'Docente', birthDate: new Date('1999-04-18'), country: 'DO',
        city: 'Santo Domingo', educationLevel: 'university', interests: [] } })
    expect((await new ProfileService().getSettings(user)).completeness).toBe(100)
  })

  it('ignores retired interests when calculating completeness', async () => {
    db.appUser.findFirst.mockResolvedValue({ ...record(), profileSettings: { interests: ['Python'] } })
    expect((await new ProfileService().getSettings(user)).completeness).toBe(11)
  })

  it('saves only allowed fields transactionally and preserves civil dates', async () => {
    await new ProfileService().updateSettings(user, { fullName: ' Ana ', preferences: { birthDate: '1999-04-18', bio: null }, roles: ['admin'], userId: 'other' } as never)
    expect(db.$transaction).toHaveBeenCalled()
    expect(db.appUser.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'user', schoolId: 'school' }, data: { fullName: 'Ana' } }))
    expect(db.userProfileSettings.upsert).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: 'user' }, update: { birthDate: new Date('1999-04-18T00:00:00.000Z'), bio: null } }))
  })

  it('rejects another school or deleted user', async () => {
    db.appUser.findFirst.mockResolvedValue(null)
    await expect(new ProfileService().getSettings(user)).rejects.toThrow()
  })
})
