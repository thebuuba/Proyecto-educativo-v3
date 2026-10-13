/**
 * @description Crea y configura la aplicación NestJS para Node.js y Cloudflare Workers.
 */

import { ValidationPipe, type INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { prisma } from '@aula/database'
import { loadEnvFile } from 'node:process'
import helmet from 'helmet'
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor'
import { isAllowedOrigin } from './config/cors-origins'
import { backendEnvFilePaths } from './config/env-file-paths'

function loadEnvironment() {
  for (const envFilePath of backendEnvFilePaths) {
    try {
      loadEnvFile(envFilePath)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
    }
  }
}

export async function createApplication(): Promise<INestApplication> {
  loadEnvironment()
  const { AppModule } = await import('./app.module.js')
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api/v1')
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'", process.env.SUPABASE_URL ?? ''],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    xFrameOptions: { action: 'deny' },
  }))
  const isProduction = process.env.NODE_ENV === 'production'
    || process.env.CLOUDFLARE_WORKER_PRODUCTION === 'true'
  if (!isProduction) {
    app.enableCors({
      origin: (
        origin: string | undefined,
        callback: (error: Error | null, allow?: boolean) => void,
      ) => {
        const allowed = !origin || isAllowedOrigin(origin, {
          frontendUrl: process.env.FRONTEND_URL,
        })
        callback(null, allowed)
      },
      credentials: true,
    })
  }
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  app.useGlobalInterceptors(new AuditLogInterceptor())
  app.getHttpAdapter().get('/api/v1/health', async (_request, response) => {
    await prisma.$queryRaw`select 1`
    const development = !isProduction && process.env.AULABASE_DEV_COMMIT
      ? { commit: process.env.AULABASE_DEV_COMMIT, dirty: process.env.AULABASE_DEV_DIRTY === 'true',
          startedAt: process.env.AULABASE_DEV_STARTED_AT, supabaseOrigin: new URL(process.env.SUPABASE_URL!).origin,
          catalogVersion: (await import('./modules/evaluation-instruments/catalog-current.js')).evaluationCatalogCurrent.version }
      : undefined
    response.json({ data: { status: 'ok', ...(development ? { development } : {}) } })
  })

  return app
}
