import { beforeEach, describe, expect, it, vi } from 'vitest'

const update = vi.hoisted(() => vi.fn())
vi.mock('@aula/database', () => ({ prisma: { appUser: { update } } }))
import { ProfileService } from './profile.service'

describe('ProfileService.updateProfile', () => {
  beforeEach(() => vi.clearAllMocks())

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
