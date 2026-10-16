import assert from 'node:assert/strict'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { parseEnv } from 'node:util'
import { developmentEnvironment, developmentProjectRef as project } from '../cloudflare-development-environment.mjs'
const env = developmentEnvironment(parseEnv(readFileSync('.dev.vars.local', 'utf8')))
Object.assign(process.env, env)
const base = 'http://localhost:8787', dist = 'apps/frontend/dist'
const digest = bytes => createHash('sha256').update(bytes).digest('hex')
const read = async (url, options = {}) => {
  for (let attempt = 0; attempt < 3; attempt++) {
    try { return await fetch(url, { ...options, signal: AbortSignal.timeout(20000) }) }
    catch { if (attempt === 2) throw Error('Runtime read failed after three bounded attempts: ' + new URL(url).pathname) }
  }
}
const request = async path => {
  const response = await read(base + path, { cache: 'no-store' })
  assert.equal(response.status, 200, path); return response
}
const health = await request('/api/v1/health')
assert(health.headers.get('content-security-policy').includes(project))
const entry = html => html.match(/<script[^>]*src="([^"]+)"/)[1]
const localEntry = entry(readFileSync(dist + '/index.html', 'utf8'))
assert.equal(entry(await (await request('/login')).text()), localEntry)
const relevant = readdirSync(dist + '/assets').filter(name => name.endsWith('.js') && /frances-comunicacion-1|fra-1-|Estrategia de ense/.test(readFileSync(dist + '/assets/' + name, 'utf8')))
const assets = []
for (const path of [...new Set([localEntry, ...relevant.map(name => '/assets/' + name), '/sw.js'])]) {
  const response = await request(path), bytes = Buffer.from(await response.arrayBuffer())
  assert.equal(digest(bytes), digest(readFileSync(dist + path)), path + ' differs from build')
  if (path === localEntry) { assert(bytes.includes(project)); assert(!bytes.includes('vqrptqffeezqacwtmlqq')); assert(!bytes.includes(env.SUPABASE_SERVICE_ROLE_KEY)) }
  assets.push({ path, sha256: digest(bytes), cacheControl: response.headers.get('cache-control') })
}
const auth = await read(env.SUPABASE_URL + '/auth/v1/health', { headers: { apikey: env.SUPABASE_ANON_KEY } }); assert.equal(auth.status, 200)
const storage = await read(env.SUPABASE_URL + '/storage/v1/bucket', { headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: 'Bearer ' + env.SUPABASE_SERVICE_ROLE_KEY } }); assert.equal(storage.status, 200)
const require = createRequire(new URL('../../apps/backend/package.json', import.meta.url)), { prisma } = require('@aula/database')
try {
  const [sql] = await prisma.$queryRawUnsafe('select current_user::text as role, (select rolbypassrls from pg_roles where rolname=current_user) as bypass')
  assert.equal(sql.role, 'app_backend_local'); assert.equal(sql.bypass, false)
  const report = { project, base, postgres: { project, role: sql.role, bypassRls: false }, auth: { project, status: auth.status }, storage: { project, status: storage.status }, frontend: { project, entry: localEntry, matchesBuild: true }, assets, browserCacheAndRegistration: 'NOT_INSPECTED_BY_HTTP' }
  writeFileSync('.wrangler/french-source/runtime.json', JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify(report))
} finally { await prisma.$disconnect() }
