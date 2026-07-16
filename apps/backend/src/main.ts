/**
 * @description Punto de entrada del backend NestJS para el runtime tradicional de Node.js.
 */

import { createApplication } from './bootstrap'

/**
 * Arranca la aplicación en el puerto definido por PORT (3000 por defecto).
 */
async function bootstrap() {
  const app = await createApplication()
  await app.listen(process.env.PORT ?? 3000)
}

void bootstrap()
