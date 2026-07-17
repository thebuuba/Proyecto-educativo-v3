import assert from 'node:assert/strict'

const baseUrl = process.argv[2]?.replace(/\/$/, '')
if (!baseUrl) throw new Error('Uso: pnpm cloudflare:smoke https://dominio')

async function request(path) {
  const response = await fetch(`${baseUrl}${path}`, {
    redirect: 'error',
    signal: AbortSignal.timeout(30_000),
  })
  return response
}

const home = await request('/')
assert.equal(home.status, 200, 'La SPA no responde 200')
assert.match(
  await home.text(),
  /<title>Aula Base<\/title>/,
  'La respuesta no es la SPA de Aula Base',
)

for (const header of ['content-security-policy', 'permissions-policy', 'x-content-type-options']) {
  assert.ok(home.headers.get(header), `Falta la cabecera ${header}`)
}

const deepLink = await request('/cursos')
assert.equal(deepLink.status, 200, 'Una ruta profunda de la SPA no responde 200')

const health = await request('/api/v1/health')
assert.equal(health.status, 200, 'El health check no responde 200')
assert.deepEqual(await health.json(), { data: { status: 'ok' } })

const protectedRoute = await request('/api/v1/auth/profile')
assert.equal(protectedRoute.status, 401, 'Una ruta protegida permite acceso anónimo')

console.log(`Smoke test correcto: ${baseUrl}`)
