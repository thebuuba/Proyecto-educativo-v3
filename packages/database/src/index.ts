/**
 * @fileoverview Cliente singleton de Prisma para toda la aplicación.
 * En desarrollo reutiliza la instancia almacenada en `globalThis` para evitar
 * múltiples conexiones durante recargas en caliente (hot reload).
 */

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

/**
 * @description Instancia singleton de PrismaClient. En producción se crea una
 * nueva instancia; en desarrollo se reutiliza la almacenada en `globalThis`
 * para prevenir conexiones duplicadas por hot-reload.
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error', 'warn'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export * from '@prisma/client'
