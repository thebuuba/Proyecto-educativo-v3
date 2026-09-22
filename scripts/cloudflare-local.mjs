import { spawnSync } from 'node:child_process'
import { loadEnvFile } from 'node:process'

try {
  loadEnvFile('.dev.vars.local')
} catch (error) {
  if (error.code === 'ENOENT') {
    throw new Error(
      'Falta .dev.vars.local; inicia Supabase local y copia .dev.vars.example con sus credenciales',
    )
  }
  throw error
}

const required = [
  'DATABASE_URL',
  'FRONTEND_URL',
  'JWT_SECRET',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_SUPABASE_URL',
]
for (const name of required) {
  if (!process.env[name]) {
    throw new Error(`Falta ${name} en .dev.vars.local`)
  }
}

const env = {
  ...process.env,
  CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE: process.env.DATABASE_URL,
}
const pnpmEntry = process.env.npm_execpath
if (!pnpmEntry) {
  throw new Error('Ejecuta este script mediante pnpm cloudflare:dev')
}

function runPnpm(args) {
  return spawnSync(process.execPath, [pnpmEntry, ...args], { env, stdio: 'inherit' })
}

const build = runPnpm(['build'])
if (build.error) throw build.error
if (build.status !== 0) process.exit(build.status ?? 1)

const dev = runPnpm(['exec', 'wrangler', 'dev', '--local', '--env-file', '.dev.vars.local'])
if (dev.error) throw dev.error
process.exit(dev.status ?? 1)
