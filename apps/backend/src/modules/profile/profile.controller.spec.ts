import 'reflect-metadata'
import { ValidationPipe } from '@nestjs/common'
import { describe, expect, it, vi } from 'vitest'
import { ProfileController } from './profile.controller'
import { ProfileService } from './profile.service'
import { UpdateProfileDto } from './dto/update-profile.dto'

describe('authenticated profile updates', () => {
  it('uses the current teacher ID without requiring an administration role', async () => {
    const updateProfile = vi.fn().mockResolvedValue({ id: 'teacher', fullName: 'Ana' })
    const controller = new ProfileController({ updateProfile } as unknown as ProfileService)
    const body = { fullName: 'Ana', phone: null, avatarUrl: null }
    await expect(controller.updateProfile({ id: 'teacher', email: 'ana@example.com', schoolId: 'school', roles: ['teacher'] }, body)).resolves.toHaveProperty('id', 'teacher')
    expect(updateProfile).toHaveBeenCalledWith('teacher', body)
    expect(Reflect.getMetadata('roles', ProfileController)).toBeUndefined()
    expect(Reflect.getMetadata('roles', ProfileController.prototype.updateProfile)).toBeUndefined()
  })

  it('validates personal fields and rejects injected account or permission fields', async () => {
    const pipe = new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })
    const metadata = { type: 'body' as const, metatype: UpdateProfileDto }
    await expect(pipe.transform({ fullName: ' Ana ', phone: null, avatarUrl: null }, metadata)).resolves.toHaveProperty('fullName', 'Ana')
    for (const invalid of [{ fullName: '   ' }, { fullName: null }, { phone: 42 }, { avatarUrl: 'javascript:alert(1)' }, { email: 'new@example.com' }, { status: 'ARCHIVED' }, { roles: ['admin'] }, { id: 'other' }]) {
      await expect(pipe.transform(invalid, metadata)).rejects.toThrow()
    }
  })
})
