/**
 * @description Carga el secreto JWT desde variables de entorno con fallback para desarrollo.
 */

import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

/**
 * Lee el archivo .env desde la raíz del proyecto y carga las variables en process.env
 * si aún no están definidas.
 */
function loadEnvFile() {
  const envPath = resolve(__dirname, '../../.env')
  if (!existsSync(envPath)) return
  const content = readFileSync(envPath, 'utf-8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const value = trimmed.slice(eqIdx + 1).trim()
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

/**
 * Retorna el secreto JWT.
 * En producción (RAILWAY_ENVIRONMENT) lanza error si no está definido.
 * En desarrollo usa 'aula-base-dev-secret' como fallback.
 */
export function getJwtSecret(): string {
  loadEnvFile()
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET
  if (process.env.RAILWAY_ENVIRONMENT) {
    throw new Error('JWT_SECRET is required in production')
  }
  return 'aula-base-dev-secret'
}
