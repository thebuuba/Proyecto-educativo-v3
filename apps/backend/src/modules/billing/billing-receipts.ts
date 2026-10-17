import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, ServiceUnavailableException } from '@nestjs/common'
import { prisma } from '@aula/database'
import { randomUUID } from 'node:crypto'
import type { AuthenticatedUser } from '../auth/types/authenticated-user'
import { audit, billingAccount, requireBilling, requireCommercialAdmin, withBillingOwner } from './billing-store'

export const RECEIPT_LIMIT = 10485760
const BUCKET = 'billing-receipts'

export function receiptContentType(bytes: Buffer, declared: string): string {
  if (!bytes.length || bytes.length > RECEIPT_LIMIT) throw new BadRequestException('El comprobante debe pesar entre 1 byte y 10 MB.')
  const matches: Record<string, boolean> = {
    'application/pdf': bytes.subarray(0, 5).toString('ascii') === '%PDF-',
    'image/png': bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])),
    'image/jpeg': bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255,
    'image/webp': bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP',
  }
  if (!matches[declared]) throw new BadRequestException('Solo se admiten PDF, PNG, JPEG o WebP cuyo contenido coincida con el tipo declarado.')
  return declared
}

function storage() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, ''), key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new ServiceUnavailableException('El almacenamiento privado no está configurado.')
  return { url, headers: { authorization: `Bearer ${key}`, apikey: key } }
}

@Injectable()
export class BillingReceipts {
  private readonly logger = new Logger(BillingReceipts.name)

  private async removeObject(config: ReturnType<typeof storage>, path: string) {
    try {
      const response = await fetch(`${config.url}/storage/v1/object/${BUCKET}`, {
        method: 'DELETE', headers: { ...config.headers, 'content-type': 'application/json' },
        body: JSON.stringify({ prefixes: [path] }), signal: AbortSignal.timeout(10000), redirect: 'error',
      })
      if (!response.ok) throw new Error('Storage cleanup failed')
    } catch {
      // Retain the successful database result (or original transaction error).
      this.logger.warn('No se pudo limpiar un comprobante privado; revisar almacenamiento y auditoría comercial.')
    }
  }

  async upload(user: AuthenticatedUser, transferId: string, file?: { buffer: Buffer; mimetype: string }) {
    requireBilling()
    if (!file?.buffer) throw new BadRequestException('Selecciona un comprobante.')
    const contentType = receiptContentType(file.buffer, file.mimetype)
    const config = storage()
    let uploadedPath: string | undefined
    let previousPath: string | undefined
    try {
    const result = await withBillingOwner(user.id, async (db, now) => {
      const account = await billingAccount(user.id, db)
      const transfer = await db.billingTransferRequest.findFirst({ where: { id: transferId, accountId: account.id } })
      if (!transfer) throw new NotFoundException('Solicitud no encontrada.')
      if (!['PENDING', 'UNDER_REVIEW'].includes(transfer.status)) throw new ConflictException('La solicitud ya no admite comprobantes.')
      const path = `${account.id}/${transfer.id}/${randomUUID()}`
      const uploaded = await fetch(`${config.url}/storage/v1/object/${BUCKET}/${path}`, {
        method: 'POST', headers: { ...config.headers, 'content-type': contentType, 'x-upsert': 'false' },
        body: new Uint8Array(file.buffer), signal: AbortSignal.timeout(10000), redirect: 'error',
      })
      if (!uploaded.ok) throw new ServiceUnavailableException('No se pudo guardar el comprobante privado.')
      uploadedPath = path
      if (transfer.receiptPath?.startsWith(`${account.id}/${transfer.id}/`) && !transfer.receiptPath.includes('..')) previousPath = transfer.receiptPath
      await db.billingTransferRequest.update({ where: { id: transfer.id }, data: {
        receiptPath: path, receiptMime: contentType, receiptSizeBytes: BigInt(file.buffer.length), reportedAt: now,
      } })
      await audit(db, { accountId: account.id, actorUserId: user.id, action: 'receipt_uploaded', entityType: 'transfer', entityId: transfer.id,
        metadata: { path, previousPath: transfer.receiptPath, contentType, size: file.buffer.length } })
      return { stored: true, transferId: transfer.id, status: transfer.status.toLowerCase(), coverageGranted: false }
    })
    // Wait for the entire owner transaction to commit before removing the old object.
    if (previousPath) await this.removeObject(config, previousPath)
    return result
    } catch (error) {
      if (uploadedPath) await this.removeObject(config, uploadedPath)
      throw error
    }
  }

  async download(user: AuthenticatedUser, transferId: string) {
    requireBilling()
    const transfer = await prisma.billingTransferRequest.findUnique({ where: { id: transferId }, include: { account: { select: { userId: true } } } })
    if (!transfer?.receiptPath) throw new NotFoundException('Comprobante no disponible.')
    if (transfer.account.userId !== user.id) await requireCommercialAdmin(user.id)
    if (!transfer.receiptPath.startsWith(`${transfer.accountId}/${transfer.id}/`) || transfer.receiptPath.includes('..')) {
      throw new ServiceUnavailableException('La ruta del comprobante requiere revisión.')
    }
    const config = storage()
    const response = await fetch(`${config.url}/storage/v1/object/sign/${BUCKET}/${transfer.receiptPath}`, {
      method: 'POST', headers: { ...config.headers, 'content-type': 'application/json' }, body: JSON.stringify({ expiresIn: 60 }),
      signal: AbortSignal.timeout(10000), redirect: 'error',
    })
    if (!response.ok) throw new ServiceUnavailableException('No se pudo obtener acceso temporal al comprobante.')
    const result = await response.json() as { signedURL?: string }
    if (!result.signedURL?.startsWith('/object/sign/')) throw new ServiceUnavailableException('Respuesta de almacenamiento no válida.')
    return { url: `${config.url}/storage/v1${result.signedURL}`, expiresIn: 60 }
  }
}
