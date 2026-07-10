/**
 * @description Punto de entrada del backend NestJS. Configura y arranca el servidor HTTP.
 */

import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor'
import { isAllowedOrigin } from './config/cors-origins'

/**
 * Crea la aplicación NestJS, configura prefijo global, helmet, CORS y ValidationPipe,
 * y se pone a la escucha en el puerto definido en la variable de entorno PORT (por defecto 3000).
 */
async function bootstrap() {
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
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => {
      const allowed = !origin || isAllowedOrigin(origin, {
        frontendUrl: process.env.FRONTEND_URL,
        vercelProjectSlug: process.env.VERCEL_PROJECT_SLUG,
        vercelTeamSlug: process.env.VERCEL_TEAM_SLUG,
      })
      callback(null, allowed)
    },
    credentials: true,
  })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  app.useGlobalInterceptors(new AuditLogInterceptor())

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
