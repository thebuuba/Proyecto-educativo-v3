/**
 * @fileoverview Cliente singleton de Prisma para toda la aplicación.
 * En desarrollo reutiliza la instancia almacenada en `globalThis` para evitar
 * múltiples conexiones durante recargas en caliente (hot reload).
 */

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }
const DEFAULT_CONNECTION_LIMIT = 3

function databaseUrlForPg(url: string) {
  const parsedUrl = new URL(url)
  parsedUrl.searchParams.delete('connection_limit')
  parsedUrl.searchParams.delete('pool_timeout')
  parsedUrl.searchParams.delete('pgbouncer')
  return parsedUrl.toString()
}

function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required')
  }

  const adapter = new PrismaPg({
    connectionString: databaseUrlForPg(process.env.DATABASE_URL),
    max: DEFAULT_CONNECTION_LIMIT,
    connectionTimeoutMillis: 20_000,
  })

  return new PrismaClient({ adapter, log: ['error', 'warn'] })
}

/**
 * @description Instancia singleton de PrismaClient. En producción se crea una
 * nueva instancia; en desarrollo se reutiliza la almacenada en `globalThis`
 * para prevenir conexiones duplicadas por hot-reload.
 */
export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export * from '@prisma/client'
