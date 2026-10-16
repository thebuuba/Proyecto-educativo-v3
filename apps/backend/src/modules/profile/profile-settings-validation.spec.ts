import 'reflect-metadata'
import { ValidationPipe } from '@nestjs/common'
import { describe, expect, it } from 'vitest'
import { UpdateProfileSettingsDto } from './dto/update-profile-settings.dto'

const pipe = new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })
const parse = (value: unknown) => pipe.transform(value, { type: 'body', metatype: UpdateProfileSettingsDto })
describe('profile settings validation', () => {
  it('accepts clearing optional values and valid civil dates', async () => {
    await expect(parse({ fullName: ' Ana ', preferences: { bio: null, birthDate: '1999-04-18', timezone: 'America/La_Paz', country: 'do' } })).resolves.toMatchObject({ fullName: 'Ana', preferences: { birthDate: '1999-04-18' } })
  })
  it.each([
    { fullName: '  ' }, { fullName: null }, { userId: 'other' }, { roles: ['admin'] }, { email: 'other@example.com' },
    { preferences: null }, { preferences: { avatarPath: 'other/file' } }, { preferences: { birthDate: '2026-02-30' } },
    { preferences: { birthDate: '2999-01-01' } }, { preferences: { timezone: 'Invalid/Zone' } },
    { preferences: { language: 'en' } }, { preferences: { bio: 'x'.repeat(241) } },
    { preferences: { interests: Array(6).fill('Python') } }, { preferences: { interests: ['Python', 'Python'] } },
    { preferences: { interests: ['Inventado'] } }, { preferences: { country: 'invalid' } },
  ])('rejects invalid values %j', async value => { await expect(parse(value)).rejects.toThrow() })
})
