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

const cacheBust = `smoke=${Date.now()}`
const freshHtmlCache = /(?:no-store|max-age=0)/

async function waitForDeployment(path) {
  let response
  for (let attempt = 1; attempt <= 12; attempt += 1) {
    response = await request(`${path}?${cacheBust}-${attempt}`)
    if (response.status === 200 && freshHtmlCache.test(response.headers.get('cache-control') ?? '')) {
      return response
    }
    await new Promise((resolve) => setTimeout(resolve, 5_000))
  }
  return response
}

const home = await waitForDeployment('/')
assert.equal(home.status, 200, 'La SPA no responde 200')
assert.match(
  home.headers.get('cache-control') ?? '',
  freshHtmlCache,
  'La navegación principal permite conservar HTML obsoleto en caché',
)
const homeHtml = await home.text()
assert.match(
  homeHtml,
  /<title>Aula Base<\/title>/,
  'La respuesta no es la SPA de Aula Base',
)

for (const header of ['content-security-policy', 'permissions-policy', 'x-content-type-options']) {
  assert.ok(home.headers.get(header), `Falta la cabecera ${header}`)
}

const deepLink = await request(`/cursos?${cacheBust}`)
assert.equal(deepLink.status, 200, 'Una ruta profunda de la SPA no responde 200')
assert.match(
  deepLink.headers.get('cache-control') ?? '',
  freshHtmlCache,
  'Las rutas de la SPA permiten conservar HTML obsoleto en caché',
)

const assetPath = homeHtml.match(/(?:src|href)="(\/assets\/[^"]+)"/)?.[1]
assert.ok(assetPath, 'La SPA no referencia un recurso versionado')
const asset = await request(assetPath)
assert.equal(asset.status, 200, 'Un recurso versionado no responde 200')
assert.match(
  asset.headers.get('cache-control') ?? '',
  /immutable/,
  'Los recursos versionados no conservan la política de caché inmutable',
)

const health = await request('/api/v1/health')
assert.equal(health.status, 200, 'El health check no responde 200')
assert.deepEqual(await health.json(), { data: { status: 'ok' } })

const protectedRoute = await request('/api/v1/auth/profile')
assert.equal(protectedRoute.status, 401, 'Una ruta protegida permite acceso anónimo')

console.log(`Smoke test correcto: ${baseUrl}`)
