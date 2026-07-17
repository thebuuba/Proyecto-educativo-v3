import { spawnSync } from 'node:child_process'
import { chmodSync, writeFileSync } from 'node:fs'
import { loadEnvFile } from 'node:process'

try {
  loadEnvFile('apps/backend/.env')
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}

const status = spawnSync('pnpm', ['exec', 'supabase', 'status', '-o', 'json'], {
  encoding: 'utf8',
})
if (status.status !== 0) {
  process.stderr.write(status.stderr)
  process.exit(status.status ?? 1)
}

const values = JSON.parse(status.stdout)
const required = ['API_URL', 'DB_URL', 'ANON_KEY', 'SERVICE_ROLE_KEY', 'JWT_SECRET']
for (const name of required) {
  if (typeof values[name] !== 'string' || values[name].length === 0) {
    throw new Error(`Supabase local no devolvió ${name}`)
  }
}

const localEnv = {
  DATABASE_URL: values.DB_URL,
  FRONTEND_URL: 'http://localhost:8787',
  JWT_SECRET: values.JWT_SECRET,
  SUPABASE_ANON_KEY: values.ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: values.SERVICE_ROLE_KEY,
  SUPABASE_URL: values.API_URL,
  VITE_SUPABASE_ANON_KEY: values.ANON_KEY,
  VITE_SUPABASE_URL: values.API_URL,
}
for (const name of ['OPENAI_API_KEY', 'OPENAI_MODEL']) {
  if (process.env[name]) localEnv[name] = process.env[name]
}

const envFile = '.dev.vars.local'
writeFileSync(
  envFile,
  `${Object.entries(localEnv).map(([name, value]) => `${name}=${JSON.stringify(value)}`).join('\n')}\n`,
  { mode: 0o600 },
)
chmodSync(envFile, 0o600)

const env = {
  ...process.env,
  ...localEnv,
  CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE: values.DB_URL,
}
const build = spawnSync('pnpm', ['build'], { env, stdio: 'inherit' })
if (build.status !== 0) process.exit(build.status ?? 1)

const dev = spawnSync(
  'pnpm',
  ['exec', 'wrangler', 'dev', '--local', '--env-file', envFile],
  { env, stdio: 'inherit' },
)
process.exit(dev.status ?? 1)
