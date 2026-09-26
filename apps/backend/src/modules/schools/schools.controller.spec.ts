import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ValidationPipe } from '@nestjs/common'
import { SchoolsController } from './schools.controller'
import { SchoolsService } from './schools.service'
import { CreateSchoolDto } from './dto/create-school.dto'

const verifyUser = vi.hoisted(() => vi.fn())
vi.mock('../auth/supabase-user', () => ({ getSupabaseUserFromToken: verifyUser }))

describe('school registration', () => {
  const create = vi.fn()
  const controller = new SchoolsController({ create } as unknown as SchoolsService)
  const dto = { name: 'Colegio Nuevo', district: 'La Vega', sector: 'private' as const }
  beforeEach(() => { vi.clearAllMocks(); verifyUser.mockResolvedValue({ id: 'confirmed-user' }) })

  it('requires a verified session even before the teacher profile exists', async () => {
    await expect(controller.create(undefined, dto)).rejects.toThrow('Inicia sesión')
    expect(create).not.toHaveBeenCalled()
    verifyUser.mockRejectedValueOnce(new Error('Invalid Supabase session'))
    await expect(controller.create('Bearer expired-token', dto)).rejects.toThrow('Invalid Supabase session')
    expect(create).not.toHaveBeenCalled()
    create.mockResolvedValue({ school: { id: 'school' }, created: true })
    await expect(controller.create('Bearer valid-token', dto)).resolves.toHaveProperty('created', true)
    expect(verifyUser).toHaveBeenLastCalledWith('valid-token')
  })

  it('validates names, location, sector and rejects injected permissions', async () => {
    const pipe = new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })
    const metadata = { type: 'body' as const, metatype: CreateSchoolDto }
    await expect(pipe.transform({ ...dto, name: '   ' }, metadata)).rejects.toThrow()
    await expect(pipe.transform({ ...dto, district: '' }, metadata)).rejects.toThrow()
    await expect(pipe.transform({ ...dto, sector: 'unknown' }, metadata)).rejects.toThrow()
    await expect(pipe.transform({ ...dto, status: 'ACTIVE', userRole: 'admin' }, metadata)).rejects.toThrow()
    await expect(pipe.transform({ ...dto, centerCode: '' }, metadata)).resolves.toHaveProperty('centerCode', undefined)
  })
})
