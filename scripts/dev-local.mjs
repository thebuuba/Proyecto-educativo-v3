import { spawn, spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { localEnvironment } from './dev-local-environment.mjs'

const cli = process.env.npm_execpath
if (!cli) throw new Error('Ejecutar mediante pnpm dev:local.')
const status = spawnSync(process.execPath, [cli, 'exec', 'supabase', 'status', '--output', 'json'], { encoding: 'utf8' })
if (status.status !== 0) throw new Error('Inicia Supabase local con pnpm supabase:local.')
const secretFile = '.dev-session.local'
if (!existsSync(secretFile)) writeFileSync(secretFile, randomBytes(48).toString('hex'), { mode: 0o600 })
const commit = spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' })
if (commit.status !== 0) throw new Error('No se pudo identificar el commit local.')
const env = { ...process.env, ...localEnvironment(JSON.parse(status.stdout), readFileSync(secretFile, 'utf8').trim()),
  AULABASE_DEV_COMMIT: commit.stdout.trim(), AULABASE_DEV_STARTED_AT: new Date().toISOString(),
  AULABASE_DEV_DIRTY: String(Boolean(spawnSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).stdout.trim())) }
for (const args of [['--filter', '@aula/shared', 'build'], ['--filter', 'backend', 'build']]) {
  const build = spawnSync(process.execPath, [cli, ...args], { env, stdio: 'inherit' })
  if (build.status !== 0) process.exit(build.status ?? 1)
}
const install = spawnSync(process.execPath, ['scripts/evaluation-instruments/catalog-local.mjs'], { env, stdio: 'inherit' })
if (install.status !== 0) process.exit(install.status ?? 1)
const children = [
  spawn(process.execPath, ['apps/backend/dist/main.js'], { env, stdio: 'inherit' }),
  spawn(process.execPath, [fileURLToPath(new URL('../apps/frontend/node_modules/vite/bin/vite.js', import.meta.url)), '--port', '5173', '--strictPort'], { env, cwd: 'apps/frontend', stdio: 'inherit' }),
]
let stopping = false
function stop(code = 0) {
  if (stopping) return
  stopping = true
  for (const child of children) child.kill()
  process.exitCode = code
}
for (const child of children) {
  child.on('error', () => stop(1))
  child.on('exit', code => stop(code ?? 1))
}
process.on('SIGINT', () => stop())
process.on('SIGTERM', () => stop())
