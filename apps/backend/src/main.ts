/**
 * @description Punto de entrada del backend NestJS. Configura y arranca el servidor HTTP.
 */

import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'
import { AppModule } from './app.module'

/**
 * Crea la aplicación NestJS, configura prefijo global, helmet, CORS y ValidationPipe,
 * y se pone a la escucha en el puerto definido en la variable de entorno PORT (por defecto 3000).
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api/v1')
  app.use(helmet())
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
  })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
