/**
 * @fileoverview Cliente Prisma compartido por el servidor Node y limitado a
 * cada petición cuando la aplicación se ejecuta en Cloudflare Workers.
 */

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { AsyncLocalStorage } from 'node:async_hooks'
import {timedDevelopmentPool,type DatabaseTiming} from './development-timing.js'

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

function createPrismaClient(databaseUrl = process.env.DATABASE_URL,observe?:DatabaseTiming) {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required')
  }

  const config={
    connectionString: databaseUrlForPg(databaseUrl),
    max: DEFAULT_CONNECTION_LIMIT,
    connectionTimeoutMillis: 20_000,
  }
  const adapter = observe ? new PrismaPg(timedDevelopmentPool(config,observe),{disposeExternalPool:true}) : new PrismaPg(config)

  const client=new PrismaClient({ adapter, log: ['error', 'warn'] })
  if(!observe)return client
  return client.$extends({query:{$allOperations:async({model,operation,args,query})=>{
    const start=performance.now()
    try{const result=await query(args);observe(`db.${model??'raw'}.${operation}`,start,performance.now(),false,Array.isArray(result)?result.length:undefined);return result}
    catch(error){observe(`db.${model??'raw'}.${operation}`,start,performance.now(),true);throw error}
  }}}) as unknown as PrismaClient
}

function currentPrisma() {
  const scoped = requestPrisma.getStore()
  if (scoped) return scoped
  return (globalForPrisma.prisma ??= createPrismaClient())
}

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = currentPrisma()
    const value = Reflect.get(client, property)
    return typeof value === 'function' ? value.bind(client) : value
  },
})

export async function runWithPrismaClient<T>(databaseUrl: string, operation: () => Promise<T>,observe?:DatabaseTiming) {
  const started=performance.now()
  const client = createPrismaClient(databaseUrl,observe)
  observe?.('db.client.create',started,performance.now(),false)
  try {
    return await requestPrisma.run(client, operation)
  } finally {
    const disconnectStarted=performance.now();let failed=false
    try{await client.$disconnect()}catch(error){failed=true;throw error}finally{observe?.('db.disconnect',disconnectStarted,performance.now(),failed)}
  }
}

export * from '@prisma/client'
