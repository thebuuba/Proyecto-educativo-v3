import { beforeEach, describe, expect, it, vi } from 'vitest'
const db = vi.hoisted(() => ({ appUser: { findFirst: vi.fn(), update: vi.fn() }, userProfileSettings: { upsert: vi.fn() }, $queryRaw: vi.fn(), $transaction: vi.fn() }))
vi.mock('@aula/database', () => ({ prisma: db }))
import { ProfileAvatar, avatarContentType } from './profile-avatar'
const user = { id: 'user', schoolId: 'school', email: 'ana@example.com', roles: ['teacher'] }
const png = Buffer.from([137,80,78,71,13,10,26,10,0])
describe('private profile avatars', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('SUPABASE_URL', 'https://storage.example.test')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'test-only')
    db.$transaction.mockImplementation(async fn => fn(db))
    db.appUser.findFirst.mockResolvedValue({ avatarUrl: null, profileSettings: { avatarPath: 'user/old' } })
    db.appUser.update.mockResolvedValue({})
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 200 })))
  })
  it('rejects missing, oversized, SVG and mismatched bytes', () => {
    for (const [buffer, mimetype] of [[png, 'image/jpeg'], [Buffer.from('<svg/>'), 'image/svg+xml'], [Buffer.alloc(0), 'image/png'], [Buffer.alloc(2097153), 'image/png']] as const) {
      expect(() => avatarContentType({ buffer, mimetype })).toThrow()
    }
    expect(avatarContentType({ buffer: png, mimetype: 'image/png' })).toBe('image/png')
  })
  it('uploads into the current owner and commits before removing the old file', async () => {
    await new ProfileAvatar().upload(user, { buffer: png, mimetype: 'image/png' })
    expect(db.$queryRaw).toHaveBeenCalled()
    expect(db.appUser.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'user', schoolId: 'school' }, data: { avatarUrl: expect.stringMatching(/^\/api\/v1\/profile\/avatar\?v=/) } }))
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(vi.mocked(fetch).mock.calls[1][1]?.method).toBe('DELETE')
  })
  it('preserves the old photo on storage error', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('{}', { status: 503 }))
    await expect(new ProfileAvatar().upload(user, { buffer: png, mimetype: 'image/png' })).rejects.toThrow()
    expect(db.appUser.update).not.toHaveBeenCalled()
  })
  it('cleans only the new object when persistence fails', async () => {
    db.appUser.update.mockRejectedValueOnce(new Error('db unavailable'))
    await expect(new ProfileAvatar().upload(user, { buffer: png, mimetype: 'image/png' })).rejects.toThrow('db unavailable')
    const deletion = vi.mocked(fetch).mock.calls.find(c => c[1]?.method === 'DELETE')
    expect(String(deletion?.[1]?.body)).toContain('user/')
    expect(String(deletion?.[1]?.body)).not.toContain('user/old')
  })
  it('refuses to read or remove a path belonging to someone else', async () => {
    db.appUser.findFirst.mockResolvedValue({ profileSettings: { avatarPath: 'other/file' } })
    await expect(new ProfileAvatar().read(user)).rejects.toThrow()
    await new ProfileAvatar().remove(user)
    expect(fetch).not.toHaveBeenCalled()
  })
})
