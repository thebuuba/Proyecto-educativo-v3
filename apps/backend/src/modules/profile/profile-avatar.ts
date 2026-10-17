import { BadRequestException, Injectable, Logger, NotFoundException, ServiceUnavailableException } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { prisma } from '@aula/database'
import type { AuthenticatedUser } from '../auth/types/authenticated-user'

export const AVATAR_LIMIT = 2 * 1024 * 1024
const BUCKET = 'profile-avatars'
export const MANAGED_AVATAR = /^\/api\/v1\/profile\/avatar\?v=[a-f0-9-]{36}$/
type ImageFile = { buffer: Buffer; mimetype: string }
export function avatarContentType(file?: ImageFile) {
  const bytes = file?.buffer
  if (!bytes?.length || bytes.length > AVATAR_LIMIT) throw new BadRequestException('Selecciona una imagen de hasta 2 MB.')
  const matches: Record<string, boolean> = {
    'image/png': bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])),
    'image/jpeg': bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255,
    'image/webp': bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP',
  }
  if (!matches[file!.mimetype]) throw new BadRequestException('Solo se admiten imágenes PNG, JPEG o WebP con contenido válido.')
  return file!.mimetype
}
function storage() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, ''), key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new ServiceUnavailableException('El almacenamiento de fotos no está configurado.')
  return { url, headers: { authorization: `Bearer ${key}`, apikey: key } }
}
function owns(userId: string, path: string) { return path.startsWith(`${userId}/`) && !path.includes('..') && /^[a-zA-Z0-9/-]+$/.test(path) }

/** Best effort after commit: a failed cleanup must never roll back the saved profile. */
export async function cleanProfileAvatar(userId: string, path: string | null | undefined) {
  if (!path || !owns(userId, path)) return
  try {
    const config = storage()
    const response = await fetch(`${config.url}/storage/v1/object/${BUCKET}`, {
      method: 'DELETE', headers: { ...config.headers, 'content-type': 'application/json' },
      body: JSON.stringify({ prefixes: [path] }), signal: AbortSignal.timeout(10000), redirect: 'error',
    })
    if (!response.ok) throw new Error('Storage cleanup failed')
  } catch { Logger.warn('No se pudo limpiar una foto de perfil sustituida.', 'ProfileAvatar') }
}

@Injectable()
export class ProfileAvatar {
  async upload(user: AuthenticatedUser, file?: ImageFile): Promise<void> {
    const contentType = avatarContentType(file), config = storage()
    const version = randomUUID(), path = `${user.id}/${version}`
    let uploaded = false
    let previous: string | null | undefined
    try {
      await prisma.$transaction(async db => {
        await db.$queryRaw`SELECT id FROM public.app_users WHERE id = ${user.id}::uuid AND school_id = ${user.schoolId}::uuid FOR UPDATE`
        const account = await db.appUser.findFirst({ where: { id: user.id, schoolId: user.schoolId }, include: { profileSettings: true } })
        if (!account) throw new NotFoundException('No se encontró tu perfil.')
        previous = account.profileSettings?.avatarPath
        const response = await fetch(`${config.url}/storage/v1/object/${BUCKET}/${path}`, {
          method: 'POST', headers: { ...config.headers, 'content-type': contentType, 'x-upsert': 'false' },
          body: new Uint8Array(file!.buffer), signal: AbortSignal.timeout(10000), redirect: 'error',
        })
        if (!response.ok) throw new ServiceUnavailableException('No se pudo guardar la foto. Inténtalo de nuevo.')
        uploaded = true
        await db.appUser.update({ where: { id: user.id, schoolId: user.schoolId }, data: { avatarUrl: `/api/v1/profile/avatar?v=${version}` } })
        await db.userProfileSettings.upsert({ where: { userId: user.id }, create: { userId: user.id, avatarPath: path }, update: { avatarPath: path } })
      }, { timeout: 20000 })
    } catch (error) {
      if (uploaded) await cleanProfileAvatar(user.id, path)
      throw error
    }
    await cleanProfileAvatar(user.id, previous)
  }

  async remove(user: AuthenticatedUser): Promise<void> {
    let previous: string | null | undefined
    await prisma.$transaction(async db => {
      await db.$queryRaw`SELECT id FROM public.app_users WHERE id = ${user.id}::uuid AND school_id = ${user.schoolId}::uuid FOR UPDATE`
      const account = await db.appUser.findFirst({ where: { id: user.id, schoolId: user.schoolId }, include: { profileSettings: true } })
      if (!account) throw new NotFoundException('No se encontró tu perfil.')
      previous = account.profileSettings?.avatarPath
      await db.appUser.update({ where: { id: user.id, schoolId: user.schoolId }, data: { avatarUrl: null } })
      await db.userProfileSettings.upsert({ where: { userId: user.id }, create: { userId: user.id }, update: { avatarPath: null } })
    })
    await cleanProfileAvatar(user.id, previous)
  }

  async read(user: AuthenticatedUser): Promise<{ bytes: Uint8Array; contentType: string }> {
    const account = await prisma.appUser.findFirst({ where: { id: user.id, schoolId: user.schoolId }, select: { profileSettings: { select: { avatarPath: true } } } })
    const path = account?.profileSettings?.avatarPath
    if (!path || !owns(user.id, path)) throw new NotFoundException('No tienes una foto guardada.')
    const config = storage()
    const response = await fetch(`${config.url}/storage/v1/object/authenticated/${BUCKET}/${path}`, {
      headers: config.headers, signal: AbortSignal.timeout(10000), redirect: 'error',
    })
    if (!response.ok) throw new ServiceUnavailableException('No se pudo cargar la foto.')
    const contentType = response.headers.get('content-type')?.split(';')[0] ?? ''
    const buffer = Buffer.from(await response.arrayBuffer())
    avatarContentType({ buffer, mimetype: contentType })
    return { bytes: new Uint8Array(buffer), contentType }
  }
}
