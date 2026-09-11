import { BadRequestException, ConflictException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common'
import { prisma } from '@aula/database'
import { randomUUID } from 'crypto'
import { AuthenticatedUser } from '../auth/types/authenticated-user'

const BUCKET = 'subject-resources'
export const RESOURCE_UPLOAD_LIMIT_BYTES = 25 * 1024 * 1024
export const SUBJECT_STORAGE_LIMIT_BYTES = 500 * 1024 * 1024
const ALLOWED = new Set(['application/pdf','image/jpeg','image/png','image/webp','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/plain'])
const resources = (prisma as any).subjectResource

function storageConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '')
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new ServiceUnavailableException('El almacenamiento de recursos no está configurado')
  return { url, key }
}
function cleanTitle(value: unknown) {
  const title = String(value ?? '').trim()
  if (!title || title.length > 160) throw new BadRequestException('El título debe tener entre 1 y 160 caracteres')
  return title
}
export function validateResourceUrl(value: unknown) {
  let url: URL
  try { url = new URL(String(value)) } catch { throw new BadRequestException('Enlace no válido') }
  if (!['http:', 'https:'].includes(url.protocol)) throw new BadRequestException('El enlace debe usar HTTP o HTTPS')
  return url.toString()
}
function mapResource(row: any) { return { ...row, sizeBytes: Number(row.sizeBytes), linkedActivities: row._count?.activities ?? 0, _count: undefined } }

@Injectable()
export class ResourcesService {
  private async subject(user: AuthenticatedUser, id: string) {
    const subject = await prisma.sectionSubject.findFirst({ where: { id, schoolId: user.schoolId, status: 'ACTIVE' }, select: { id: true } })
    if (!subject) throw new NotFoundException('Asignatura no encontrada')
  }
  private async owned(user: AuthenticatedUser, id: string) {
    const resource = await resources.findFirst({ where: { id, schoolId: user.schoolId }, include: { _count: { select: { activities: true } } } })
    if (!resource) throw new NotFoundException('Recurso no encontrado')
    return resource
  }
  async list(user: AuthenticatedUser, sectionSubjectId: string, filters: any) {
    await this.subject(user, sectionSubjectId)
    const status = filters.status === 'archived' ? 'ARCHIVED' : 'ACTIVE'
    const rows = await resources.findMany({ where: { schoolId: user.schoolId, sectionSubjectId, status, ...(filters.kind && filters.kind !== 'ALL' ? { kind: filters.kind } : {}), ...(filters.q ? { OR: [{ title: { contains: filters.q, mode: 'insensitive' } }, { description: { contains: filters.q, mode: 'insensitive' } }] } : {}) }, include: { _count: { select: { activities: true } } }, orderBy: { createdAt: 'desc' }, take: 100 })
    const usage = await resources.aggregate({ where: { schoolId: user.schoolId, sectionSubjectId, status: { in: ['ACTIVE', 'ARCHIVED'] } }, _sum: { sizeBytes: true } })
    return { items: rows.map(mapResource), usageBytes: Number(usage._sum.sizeBytes ?? 0), limitBytes: SUBJECT_STORAGE_LIMIT_BYTES }
  }
  async createLink(user: AuthenticatedUser, body: any) {
    await this.subject(user, body.sectionSubjectId)
    const url = validateResourceUrl(body.url)
    return mapResource(await resources.create({ data: { schoolId: user.schoolId, sectionSubjectId: body.sectionSubjectId, createdBy: user.id, kind: body.kind === 'EVIDENCE' ? 'EVIDENCE' : 'LINK', title: cleanTitle(body.title), description: String(body.description ?? '').slice(0, 1000), externalUrl: url, category: String(body.category ?? 'ENLACE').slice(0, 40) } }))
  }
  async upload(user: AuthenticatedUser, body: any, file?: { buffer: Buffer; size: number; mimetype: string; originalname: string }) {
    await this.subject(user, body.sectionSubjectId)
    if (!file || !file.buffer) throw new BadRequestException('Selecciona un archivo')
    if (file.size > RESOURCE_UPLOAD_LIMIT_BYTES || !ALLOWED.has(file.mimetype)) throw new BadRequestException('Tipo de archivo no permitido o superior a 25 MB')
    const usage = await resources.aggregate({ where: { schoolId: user.schoolId, sectionSubjectId: body.sectionSubjectId, status: { in: ['ACTIVE', 'ARCHIVED'] } }, _sum: { sizeBytes: true } })
    if (Number(usage._sum.sizeBytes ?? 0) + file.size > SUBJECT_STORAGE_LIMIT_BYTES) throw new ConflictException('Esta asignatura alcanzó su límite de almacenamiento de 500 MB')
    const extension = file.originalname.includes('.') ? `.${file.originalname.split('.').pop()!.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8)}` : ''
    const path = `${user.schoolId}/${body.sectionSubjectId}/${randomUUID()}${extension}`
    const { url, key } = storageConfig()
    const upload = await fetch(`${url}/storage/v1/object/${BUCKET}/${path}`, { method: 'POST', headers: { authorization: `Bearer ${key}`, apikey: key, 'content-type': file.mimetype, 'x-upsert': 'false' }, body: new Uint8Array(file.buffer) })
    if (!upload.ok) throw new ServiceUnavailableException('No se pudo guardar el archivo')
    try {
      return mapResource(await resources.create({ data: { schoolId: user.schoolId, sectionSubjectId: body.sectionSubjectId, createdBy: user.id, kind: body.kind === 'EVIDENCE' ? 'EVIDENCE' : 'FILE', title: cleanTitle(body.title || file.originalname), description: String(body.description ?? '').slice(0, 1000), originalName: file.originalname.slice(0, 255), objectPath: path, mimeType: file.mimetype, sizeBytes: file.size, category: String(body.category ?? 'ARCHIVO').slice(0, 40) } }))
    } catch (error) { await this.deleteObject(path); throw error }
  }
  async open(user: AuthenticatedUser, id: string) {
    const item = await this.owned(user, id)
    if (item.externalUrl) return item.externalUrl
    if (!item.objectPath) throw new NotFoundException('Archivo no disponible')
    const { url, key } = storageConfig()
    const response = await fetch(`${url}/storage/v1/object/sign/${BUCKET}/${item.objectPath}`, { method: 'POST', headers: { authorization: `Bearer ${key}`, apikey: key, 'content-type': 'application/json' }, body: JSON.stringify({ expiresIn: 300 }) })
    if (!response.ok) throw new ServiceUnavailableException('No se pudo abrir el archivo')
    const signed: any = await response.json(); return `${url}/storage/v1${signed.signedURL}`
  }
  async setArchived(user: AuthenticatedUser, id: string, archived: boolean) { await this.owned(user, id); return mapResource(await resources.update({ where: { id }, data: { status: archived ? 'ARCHIVED' : 'ACTIVE' } })) }
  async remove(user: AuthenticatedUser, id: string) { const item = await this.owned(user, id); if (item._count.activities) throw new ConflictException('Desvincula este recurso de sus actividades antes de eliminarlo'); if (item.objectPath) await this.deleteObject(item.objectPath); await resources.delete({ where: { id } }); return { deleted: true } }
  private async deleteObject(path: string) { const { url, key } = storageConfig(); await fetch(`${url}/storage/v1/object/${BUCKET}/${path}`, { method: 'DELETE', headers: { authorization: `Bearer ${key}`, apikey: key } }) }
}
