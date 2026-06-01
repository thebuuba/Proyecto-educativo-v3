import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

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

export function getJwtSecret(): string {
  loadEnvFile()
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET
  if (process.env.RAILWAY_ENVIRONMENT) {
    throw new Error('JWT_SECRET is required in production')
  }
  return 'aula-base-dev-secret'
}
