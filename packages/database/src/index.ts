/**
 * @fileoverview Cliente Prisma compartido por el servidor Node y limitado a
 * cada petición cuando la aplicación se ejecuta en Cloudflare Workers.
 */

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { AsyncLocalStorage } from 'node:async_hooks'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }
const requestPrisma = new AsyncLocalStorage<PrismaClient>()
const DEFAULT_CONNECTION_LIMIT = 3

export function databaseUrlForPg(url: string) {
  const parsedUrl = new URL(url)
  parsedUrl.searchParams.delete('connection_limit')
  parsedUrl.searchParams.delete('pool_timeout')
  parsedUrl.searchParams.delete('pgbouncer')
  if (parsedUrl.searchParams.get('sslmode') === 'require' && !parsedUrl.searchParams.has('uselibpqcompat')) {
    parsedUrl.searchParams.set('uselibpqcompat', 'true')
  }
  return parsedUrl.toString()
}

function createPrismaClient(databaseUrl = process.env.DATABASE_URL) {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required')
  }

  const adapter = new PrismaPg({
    connectionString: databaseUrlForPg(databaseUrl),
    max: DEFAULT_CONNECTION_LIMIT,
    connectionTimeoutMillis: 20_000,
  })

  return new PrismaClient({ adapter, log: ['error', 'warn'] })
}

function currentPrisma() {
  const scoped = requestPrisma.getStore()
  if (scoped) return scoped
  return (globalForPrisma.prisma ??= createPrismaClient())
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = currentPrisma()
    const value = Reflect.get(client, property)
    return typeof value === 'function' ? value.bind(client) : value
  },
})

export async function runWithPrismaClient<T>(databaseUrl: string, operation: () => Promise<T>) {
  const client = createPrismaClient(databaseUrl)
  try {
    return await requestPrisma.run(client, operation)
  } finally {
    await client.$disconnect()
  }
}

export * from '@prisma/client'
