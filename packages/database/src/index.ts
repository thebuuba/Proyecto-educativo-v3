/**
 * @fileoverview Cliente singleton de Prisma para toda la aplicación.
 * En desarrollo reutiliza la instancia almacenada en `globalThis` para evitar
 * múltiples conexiones durante recargas en caliente (hot reload).
 */

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }
const DEFAULT_CONNECTION_LIMIT = '3'

function databaseUrlWithConnectionLimit(url?: string) {
  if (!url) return url

  try {
    const parsedUrl = new URL(url)
    if (!parsedUrl.searchParams.has('connection_limit')) {
      parsedUrl.searchParams.set('connection_limit', DEFAULT_CONNECTION_LIMIT)
    }
    if (!parsedUrl.searchParams.has('pool_timeout')) {
      parsedUrl.searchParams.set('pool_timeout', '20')
    }
    return parsedUrl.toString()
  } catch {
    return url
  }
}

/**
 * @description Instancia singleton de PrismaClient. En producción se crea una
 * nueva instancia; en desarrollo se reutiliza la almacenada en `globalThis`
 * para prevenir conexiones duplicadas por hot-reload.
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: process.env.DATABASE_URL
    ? { db: { url: databaseUrlWithConnectionLimit(process.env.DATABASE_URL) } }
    : undefined,
  log: ['error', 'warn'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export * from '@prisma/client'
