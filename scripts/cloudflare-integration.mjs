import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { loadEnvFile } from 'node:process'

try {
  loadEnvFile('.dev.vars.local')
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}

const appUrl = process.argv[2]?.replace(/\/$/, '')
const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '')
const anonKey = process.env.SUPABASE_ANON_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!appUrl || !supabaseUrl || !anonKey || !serviceKey) {
  throw new Error(
    'Uso: carga SUPABASE_URL, SUPABASE_ANON_KEY y SUPABASE_SERVICE_ROLE_KEY; luego ejecuta el comando con la URL objetivo',
  )
}

const runId = randomUUID()
const password = `SmokeA1!${runId}`
const accounts = [1, 2].map((number) => ({
  email: `cloudflare-smoke-${runId}-${number}@example.com`,
  schoolName: `Cloudflare smoke ${runId} ${number}`,
  fullName: `Smoke User ${number}`,
  password,
}))
const created = []
const objectPaths = []

async function jsonRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(90_000),
  })
  const body = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(`${options.method ?? 'GET'} ${url}: ${response.status} ${JSON.stringify(body)}`)
  }
  return { response, body: body?.data ?? body }
}

function supabaseHeaders(key, token = key) {
  return {
    apikey: key,
    Authorization: `Bearer ${token}`,
  }
}

async function deleteRest(table, filter) {
  await fetch(`${supabaseUrl}/rest/v1/${table}?${filter}`, {
    method: 'DELETE',
    headers: supabaseHeaders(serviceKey),
    signal: AbortSignal.timeout(30_000),
  })
}

try {
  for (const account of accounts) {
    const registration = await jsonRequest(`${appUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(account),
    })
    const cookie = registration.response.headers.get('set-cookie')
    assert.match(cookie ?? '', /aulabase_session=.*HttpOnly/i)
    assert.match(cookie ?? '', /Secure/i)
    assert.match(cookie ?? '', /SameSite=Lax/i)

    const appUser = registration.body.appUser
    assert.ok(appUser?.id)
    assert.ok(appUser?.authUserId)
    assert.ok(appUser?.schoolId)
    created.push(appUser)

    const signIn = await jsonRequest(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { apikey: anonKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: account.email, password: account.password }),
    })
    assert.ok(signIn.body.access_token)
    account.accessToken = signIn.body.access_token
    account.authUserId = signIn.body.user.id
  }

  const login = await jsonRequest(`${appUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: accounts[0].email, password }),
  })
  const sessionCookie = login.response.headers.get('set-cookie')?.split(';', 1)[0]
  assert.ok(sessionCookie)

  const profile = await jsonRequest(`${appUrl}/api/v1/auth/profile`, {
    headers: { Cookie: sessionCookie },
  })
  assert.equal(profile.body.id, created[0].id)

  for (let index = 0; index < accounts.length; index += 1) {
    const account = accounts[index]
    const rows = await jsonRequest(
      `${supabaseUrl}/rest/v1/app_users?select=id,school_id&order=id`,
      { headers: supabaseHeaders(anonKey, account.accessToken) },
    )
    assert.deepEqual(rows.body, [{ id: created[index].id, school_id: created[index].schoolId }])
  }

  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
    'base64',
  )
  const objectPath = `${accounts[0].authUserId}/cloudflare-smoke.png`
  objectPaths.push(objectPath)
  const objectUrl = `${supabaseUrl}/storage/v1/object/activity-description-images/${objectPath}`
  const storageHeaders = {
    ...supabaseHeaders(anonKey, accounts[0].accessToken),
    'Content-Type': 'image/png',
    'x-upsert': 'true',
  }

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const upload = await fetch(objectUrl, {
      method: 'POST',
      headers: storageHeaders,
      body: png,
      signal: AbortSignal.timeout(30_000),
    })
    assert.ok(upload.ok, `Storage upload/upsert failed with ${upload.status}: ${await upload.text()}`)
  }

  const publicObject = await fetch(
    `${supabaseUrl}/storage/v1/object/public/activity-description-images/${objectPath}`,
    { signal: AbortSignal.timeout(30_000) },
  )
  assert.equal(publicObject.status, 200)

  const remove = await fetch(objectUrl, {
    method: 'DELETE',
    headers: supabaseHeaders(anonKey, accounts[0].accessToken),
    signal: AbortSignal.timeout(30_000),
  })
  assert.ok(remove.ok, `Storage delete failed with ${remove.status}`)
  objectPaths.length = 0

  const logout = await jsonRequest(`${appUrl}/api/v1/auth/logout`, {
    method: 'POST',
    headers: { Cookie: sessionCookie },
  })
  assert.equal(logout.body.success, true)

  console.log(`Integración correcta: Auth, cookie, Hyperdrive, RLS y Storage en ${appUrl}`)
} finally {
  for (const objectPath of objectPaths) {
    await fetch(`${supabaseUrl}/storage/v1/object/activity-description-images/${objectPath}`, {
      method: 'DELETE',
      headers: supabaseHeaders(serviceKey),
      signal: AbortSignal.timeout(30_000),
    }).catch(() => {})
  }
  for (const appUser of created) {
    await deleteRest('user_roles', `user_id=eq.${appUser.id}`).catch(() => {})
    await deleteRest('app_users', `id=eq.${appUser.id}`).catch(() => {})
    await deleteRest('schools', `id=eq.${appUser.schoolId}`).catch(() => {})
    await fetch(`${supabaseUrl}/auth/v1/admin/users/${appUser.authUserId}`, {
      method: 'DELETE',
      headers: supabaseHeaders(serviceKey),
      signal: AbortSignal.timeout(30_000),
    }).catch(() => {})
  }
}
