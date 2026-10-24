import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { parseEnv } from 'node:util'
import { developmentEnvironment, developmentProjectRef } from './cloudflare-development-environment.mjs'

let values
try {
  values = parseEnv(readFileSync('.dev.vars.local', 'utf8'))
} catch (error) {
  if (error.code === 'ENOENT') {
    throw new Error(
      'Falta .dev.vars.local; configura las credenciales exclusivas de AulaBase Development siguiendo .dev.vars.example',
    )
  }
  throw error
}

const env = developmentEnvironment(values, process.env)
console.log(`Desarrollo local: AulaBase Development (${developmentProjectRef}); PostgreSQL, Auth, Storage y Vite verificados.`)
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

const dev = runPnpm(['exec', 'wrangler', 'dev', '--local', '--env-file', '.dev.vars.local',
  ...(process.env.AULABASE_DEV_TIMING === 'true' ? ['--var', 'AULABASE_DEV_TIMING:true'] : []),
])
if (dev.error) throw dev.error
process.exit(dev.status ?? 1)
