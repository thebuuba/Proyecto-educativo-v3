import { beforeEach, describe, expect, it, vi } from 'vitest'

const update = vi.hoisted(() => vi.fn())
const extra = vi.hoisted(() => ({ findFirst: vi.fn(), upsert: vi.fn(), $queryRaw: vi.fn(), $transaction: vi.fn() }))
vi.mock('@aula/database', () => ({ prisma: { appUser: { update, findFirst: extra.findFirst }, userProfileSettings: { upsert: extra.upsert }, $queryRaw: extra.$queryRaw, $transaction: extra.$transaction } }))
import { ProfileService } from './profile.service'

describe('ProfileService.updateProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    extra.findFirst.mockResolvedValue({ avatarUrl: null, profileSettings: null })
    extra.$transaction.mockImplementation(async fn => fn({ appUser: { update, findFirst: extra.findFirst }, userProfileSettings: { upsert: extra.upsert }, $queryRaw: extra.$queryRaw }))
  })

  it('preserves an existing managed avatar and rejects a forged managed route', async () => {
    const avatarUrl = '/api/v1/profile/avatar?v=00000000-0000-0000-0000-000000000001'
    extra.findFirst.mockResolvedValue({ avatarUrl, profileSettings: { avatarPath: 'teacher/old' } })
    await expect(new ProfileService().updateProfile('teacher', { avatarUrl })).resolves.toBeUndefined()
    await expect(new ProfileService().updateProfile('teacher', { avatarUrl: '/api/v1/profile/avatar?v=00000000-0000-0000-0000-000000000002' })).rejects.toThrow()
  })

  it('persists only personal fields for the authenticated ID', async () => {
    update.mockResolvedValue({ id: 'teacher', fullName: 'Ana Pérez', phone: '123', avatarUrl: null })
    const result = await new ProfileService().updateProfile('teacher', {
      fullName: ' Ana Pérez ', phone: '123', avatarUrl: null,
      email: 'other@example.com', status: 'ARCHIVED', roles: ['admin'], id: 'other',
    } as never)
    expect(result.fullName).toBe('Ana Pérez')
    expect(update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'teacher' }, data: { fullName: 'Ana Pérez', phone: '123', avatarUrl: null },
    }))
  })

  it('preserves omitted fields and allows clearing nullable personal fields', async () => {
    update.mockResolvedValue({ id: 'teacher', phone: null })
    await new ProfileService().updateProfile('teacher', { phone: null })
    expect(update.mock.calls[0][0].data).toEqual({ phone: null })
  })

  it('rejects whitespace names before writing', async () => {
    await expect(new ProfileService().updateProfile('teacher', { fullName: '   ' })).rejects.toThrow()
    expect(update).not.toHaveBeenCalled()
  })
})
