// Real Cloudflare Workers (workerd) acceptance for the Paddle webhook intake.
//
// Boots the repository `worker.ts` through the existing `wrangler dev` in local
// mode against the disposable isolated PostgreSQL test database, then verifies
// that the webhook signature is validated over the exact original bytes.
//
// Safety guarantees:
// - Never reads DATABASE_URL, .dev.vars, the production Hyperdrive id, Paddle or
//   Supabase. Only the loopback disposable database is used.
// - Requires BILLING_WORKFLOW_DATABASE_URL (127.0.0.1:55439/aulabase_billing_test_*),
//   the value printed by `test-billing-database.mjs --keep`.
// - Spawns and kills only its own wrangler child tree. Temporary files live in
//   the git-ignored `.opencode/` directory and are removed on exit.
// - Does not build anything: the caller must have a completed backend build.
//
// Integration (coordinator): this script is meant to be spawned by
// `scripts/test-billing-database.mjs` under a new `--worker` flag, after the
// migrations are applied and before the disposable database is dropped, with
// BILLING_WORKFLOW_DATABASE_URL set to that isolated database. Standalone use:
//   node scripts/test-billing-database.mjs --keep   # prints BILLING_ACCEPTANCE_DATABASE
//   $env:BILLING_WORKFLOW_DATABASE_URL='<that value>'; node scripts/test-billing-worker.mjs
import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { createHmac, randomUUID } from 'node:crypto'
import { createWriteStream, existsSync } from 'node:fs'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import net from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const requireFromRoot = createRequire(new URL('../package.json', import.meta.url))
const requireFromDatabase = createRequire(new URL('../packages/database/package.json', import.meta.url))
const { Client } = requireFromDatabase('pg')

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const toPosix = (value) => value.split(path.sep).join('/')

/** Resolve the already-installed wrangler bin. wrangler@4 does not export `./bin/*`. */
function resolveWranglerBin() {
  try {
    return requireFromRoot.resolve('wrangler/bin/wrangler.js')
  } catch {
    const manifest = requireFromRoot.resolve('wrangler/package.json')
    return path.join(path.dirname(manifest), 'bin', 'wrangler.js')
  }
}

async function readTail(file, lines) {
  try {
    const content = await readFile(file, 'utf8')
    return content
      .split(/\r?\n/)
      // Never echo the bindings table or any synthetic value placeholder.
      .filter((line) => line.trim() && !/Environment Variable\s+local/.test(line))
      .slice(-lines)
      .join('\n') || '(empty log)'
  } catch {
    return '(no log)'
  }
}

/** Kill only our own process tree; never touch unrelated processes or services. */
async function stopChild(child) {
  if (!child || child.exitCode !== null || child.signalCode) return
  const pid = child.pid
  assert(Number.isInteger(pid) && pid > 0, 'Refusing to stop an unvalidated process id.')
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/PID', String(pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' })
  } else {
    try { process.kill(pid, 'SIGTERM') } catch { /* already gone */ }
  }
  await delay(1500)
  if (child.exitCode === null && process.platform !== 'win32') {
    try { child.kill('SIGKILL') } catch { /* already gone */ }
  }
}

// ---------------------------------------------------------------------------
// Inputs and preconditions
// ---------------------------------------------------------------------------

for (const relative of [
  'worker.ts',
  'apps/backend/dist/bootstrap.js',
  'apps/backend/dist/modules/billing/billing-events.service.js',
  'apps/frontend/dist',
]) {
  assert(existsSync(path.join(root, relative)), `Missing ${relative}; a completed build is required (this script never builds).`)
}

const workflowDatabaseUrl = process.env.BILLING_WORKFLOW_DATABASE_URL
assert(workflowDatabaseUrl, 'BILLING_WORKFLOW_DATABASE_URL is required; run test-billing-database --keep and pass its BILLING_ACCEPTANCE_DATABASE value.')
const database = new URL(workflowDatabaseUrl)
assert(['127.0.0.1', 'localhost', '[::1]'].includes(database.hostname), `Only a loopback billing test database is permitted (got ${database.hostname}).`)
assert(database.port === '55439', 'Use the isolated billing test port 55439.')
assert(/^\/aulabase_billing_test_[a-f0-9]+$/.test(database.pathname), 'Only the disposable aulabase_billing_test_* database is allowed.')

// The worker only ever sees the app_backend role, never the admin credentials.
// Miniflare demands a password in the connection string; the disposable test
// server uses trust authentication, so this synthetic placeholder is ignored.
const hyperdrive = new URL(database.toString())
hyperdrive.username = 'app_backend'
if (!hyperdrive.password) hyperdrive.password = 'synthetic-local-placeholder'

const wranglerSource = await readFile(path.join(root, 'wrangler.jsonc'), 'utf8')
const compatibilityDate = /"compatibility_date"\s*:\s*"([^"]+)"/.exec(wranglerSource)?.[1]
assert(compatibilityDate, 'compatibility_date not found in wrangler.jsonc.')

// ---------------------------------------------------------------------------
// Temporary, ignored worker configuration (never wrangler.jsonc, never .dev.vars)
// ---------------------------------------------------------------------------

const tempDir = path.join(root, '.opencode')
const configPath = path.join(tempDir, 'billing-worker-test.jsonc')
const envPath = path.join(tempDir, 'billing-worker-test.env')
const logPath = path.join(tempDir, 'billing-worker-test.log')
const stateDir = path.join(tempDir, 'billing-worker-test-state')
await mkdir(tempDir, { recursive: true })

// Synthetic values only. Fixed local placeholders, never real credentials.
const WEBHOOK_SECRET = 'SYNTHETIC-PADDLE-SANDBOX-WEBHOOK-SECRET'
const syntheticVars = {
  FRONTEND_URL: 'http://127.0.0.1:4321',
  AUTH_DEVICE_TRUST_ENABLED: 'false',
  JWT_SECRET: 'SYNTHETIC-LOCAL-JWT-SECRET-ONLY',
  SUPABASE_URL: 'http://127.0.0.1:54321',
  SUPABASE_ANON_KEY: 'SYNTHETIC-LOCAL-ONLY',
  SUPABASE_SERVICE_ROLE_KEY: 'SYNTHETIC-LOCAL-ONLY',
  BILLING_ENABLED: 'true',
  BILLING_EVENTS_ENABLED: 'true',
  BILLING_CHECKOUT_ENABLED: 'false',
  BILLING_ENFORCE_ACCESS: 'false',
  BILLING_ENVIRONMENT: 'sandbox',
  PADDLE_SANDBOX_WEBHOOK_SECRET: WEBHOOK_SECRET,
  PADDLE_SANDBOX_API_KEY: 'pdl_sdbx_apikey_SYNTHETIC-ONLY',
}

// Last-resort redaction so a diagnostics dump can never echo a value placeholder.
const sensitiveValues = [hyperdrive.password, WEBHOOK_SECRET, syntheticVars.PADDLE_SANDBOX_API_KEY].filter(Boolean)
const redact = (text) => sensitiveValues.reduce((result, value) => result.split(value).join('[redacted]'), text)

const optionalNestModule = toPosix(path.join(root, 'cloudflare/optional-nest-module.ts'))
const workerConfig = {
  name: 'aulabase-billing-worker-test',
  main: toPosix(path.join(root, 'worker.ts')),
  compatibility_date: compatibilityDate,
  compatibility_flags: ['nodejs_compat'],
  assets: {
    directory: toPosix(path.join(root, 'apps/frontend/dist')),
    binding: 'ASSETS',
    not_found_handling: 'single-page-application',
    run_worker_first: ['/api/*'],
  },
  alias: {
    '@nestjs/microservices': optionalNestModule,
    '@nestjs/microservices/microservices-module': optionalNestModule,
    '@nestjs/websockets/socket-module': optionalNestModule,
    'class-transformer/storage': toPosix(path.join(root, 'apps/backend/node_modules/class-transformer/cjs/storage.js')),
  },
  // Dummy id: local dev uses localConnectionString and never contacts Hyperdrive.
  hyperdrive: [{ binding: 'HYPERDRIVE', id: '0'.repeat(32), localConnectionString: hyperdrive.toString() }],
  observability: { enabled: false },
  vars: syntheticVars,
}
await writeFile(configPath, `${JSON.stringify(workerConfig, null, 2)}\n`, 'utf8')
// Empty env file: prevents wrangler from ever loading a real .dev.vars/.env file.
await writeFile(envPath, '', 'utf8')

// ---------------------------------------------------------------------------
// Boot the local worker on a random free port
// ---------------------------------------------------------------------------

const port = await new Promise((resolve, reject) => {
  const probe = net.createServer()
  probe.once('error', reject)
  probe.listen(0, '127.0.0.1', () => {
    const address = probe.address()
    probe.close(() => resolve(address.port))
  })
})
const base = `http://127.0.0.1:${port}`

let child
let logStream
let db
try {
  logStream = createWriteStream(logPath, { flags: 'w' })
  child = spawn(
    process.execPath,
    [resolveWranglerBin(), 'dev', '--config', configPath, '--env-file', envPath, '--local',
      '--ip', '127.0.0.1', '--port', String(port), '--persist-to', stateDir],
    {
      cwd: root,
      windowsHide: true,
      env: { ...process.env, WRANGLER_SEND_METRICS: 'false', CI: 'true', NO_COLOR: '1' },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  )
  child.stdout.pipe(logStream)
  child.stderr.pipe(logStream)
  child.on('error', (error) => logStream.write(`spawn error: ${error.message}\n`))

  const deadline = Date.now() + 60_000
  let healthy = false
  while (Date.now() < deadline) {
    if (child.exitCode !== null) break
    try {
      const response = await fetch(`${base}/api/v1/health`)
      if (response.ok) { healthy = true; break }
    } catch { /* server not ready yet */ }
    await delay(1000)
  }
  if (!healthy) {
    const tail = redact(await readTail(logPath, 25))
    throw new Error(`Local worker did not become healthy within 60s. Last log lines:\n${tail}`)
  }
  console.log('PASS: workerd worker boots and reaches /api/v1/health against the isolated database.')

  // -------------------------------------------------------------------------
  // Webhook signature is verified over the exact original bytes
  // -------------------------------------------------------------------------

  db = new Client({ connectionString: database.toString() })
  await db.connect()

  const eventId = `evt_${randomUUID()}`
  const payload = { event_id: eventId, event_type: 'unknown.worker_test', occurred_at: new Date().toISOString(), data: {} }
  // Pretty-printed on purpose: the signature must cover spaces and newlines exactly.
  const rawBody = Buffer.from(JSON.stringify(payload, null, 2), 'utf8')
  const sign = (body, timestamp) =>
    `ts=${timestamp};h1=${createHmac('sha256', WEBHOOK_SECRET).update(`${timestamp}:`).update(body).digest('hex')}`
  const postWebhook = (body, signature) => fetch(`${base}/api/v1/billing/webhooks/paddle`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'paddle-signature': signature },
    body,
  })
  // First request warms the Prisma client inside workerd; a cold start can outlast
  // the 5s signature tolerance, so a valid delivery is retried with a fresh ts.
  const deliverSigned = async (body) => {
    let response
    for (let attempt = 0; attempt < 4; attempt += 1) {
      response = await postWebhook(body, sign(body, Math.floor(Date.now() / 1000)))
      if (response.status === 201) return response
      await delay(500)
    }
    return response
  }

  const accepted = await deliverSigned(rawBody)
  const acceptedBody = await accepted.text()
  assert.equal(accepted.status, 201, `A correctly signed unknown event must be acknowledged: ${acceptedBody}`)
  assert.equal(JSON.parse(acceptedBody).data.status, 'ignored')

  const repeated = await deliverSigned(rawBody)
  const repeatedBody = await repeated.text()
  assert.equal(repeated.status, 201, `Repeated delivery must be acknowledged: ${repeatedBody}`)
  assert.equal(JSON.parse(repeatedBody).data.status, 'duplicate')

  const stored = await db.query('select status::text as status from public.billing_events where provider_event_id = $1', [eventId])
  assert.equal(stored.rowCount, 1, 'The event must be persisted exactly once.')
  assert.equal(stored.rows[0].status, 'ignored')
  console.log('PASS: signed unknown webhook returns 201/ignored, deduplicates, and persists exactly one row.')

  // Same signature, different whitespace: the bytes changed, so the signature must fail.
  const tampered = Buffer.concat([rawBody, Buffer.from(' ', 'utf8')])
  assert.equal((await postWebhook(tampered, sign(rawBody, Math.floor(Date.now() / 1000)))).status, 400)

  const forged = await postWebhook(rawBody, `ts=${Math.floor(Date.now() / 1000)};h1=${'0'.repeat(64)}`)
  assert.equal(forged.status, 400)

  const after = await db.query('select count(*)::int as n from public.billing_events where provider_event_id = $1', [eventId])
  assert.equal(after.rows[0].n, 1, 'Rejected deliveries must not persist anything.')
  console.log('PASS: whitespace change with the original signature and forged signatures are rejected with 400.')

  // Billing is protected: an anonymous request is rejected before any commercial read.
  assert.equal((await fetch(`${base}/api/v1/billing`)).status, 401)
  console.log('PASS: GET /api/v1/billing is rejected without a session (no commercial tables touched).')
} finally {
  if (db) await db.end().catch(() => {})
  await stopChild(child)
  if (logStream) await new Promise((resolve) => logStream.end(resolve))
  await rm(stateDir, { recursive: true, force: true }).catch(() => {})
  await rm(configPath, { force: true }).catch(() => {})
  await rm(envPath, { force: true }).catch(() => {})
}
