import { handleAsNodeRequest } from 'cloudflare:node'
import { env } from 'cloudflare:workers'
import { runWithPrismaClient } from './packages/database/dist/index.js'
import { createApplication } from './apps/backend/dist/bootstrap.js'
import { initializeWithRetry } from './cloudflare/workerInitialization'
import { BillingMaintenance } from './apps/backend/dist/modules/billing/billing-maintenance.js'

let initialization: Promise<void> | undefined
let application: Awaited<ReturnType<typeof createApplication>> | undefined

type WorkerEnv = {
  HYPERDRIVE?: { connectionString: string }
  FRONTEND_URL?: string
  AUTH_DEVICE_TRUST_ENABLED?: string
  BILLING_ENABLED?: string
  BILLING_CHECKOUT_ENABLED?: string
  BILLING_EVENTS_ENABLED?: string
  BILLING_ENFORCE_ACCESS?: string
  BILLING_ENVIRONMENT?: string
  BILLING_TRIAL_DAYS?: string
  BILLING_GRACE_DAYS?: string
  BILLING_BANK_INSTRUCTIONS?: string
  BILLING_BANK_ACCOUNT_ID?: string
  BILLING_SUPPORT_EMAIL?: string
  BILLING_TERMS_VERSION?: string
  PADDLE_SANDBOX_API_KEY?: string
  PADDLE_SANDBOX_WEBHOOK_SECRET?: string
  BILLING_MAINTENANCE_ACTOR_ID?: string
}

async function initialize(workerEnv: WorkerEnv) {
  const hyperdrive = workerEnv.HYPERDRIVE

  if (hyperdrive) {
    process.env.DATABASE_URL = hyperdrive.connectionString
    process.env.CLOUDFLARE_WORKER_PRODUCTION = 'true'
  }
  if (workerEnv.FRONTEND_URL) {
    process.env.FRONTEND_URL = workerEnv.FRONTEND_URL
  }
  process.env.AUTH_DEVICE_TRUST_ENABLED = workerEnv.AUTH_DEVICE_TRUST_ENABLED ?? 'false'
  for (const name of [
    'BILLING_ENABLED', 'BILLING_CHECKOUT_ENABLED', 'BILLING_EVENTS_ENABLED',
    'BILLING_ENFORCE_ACCESS', 'BILLING_ENVIRONMENT', 'BILLING_TRIAL_DAYS',
    'BILLING_GRACE_DAYS', 'BILLING_BANK_INSTRUCTIONS', 'BILLING_BANK_ACCOUNT_ID',
    'BILLING_SUPPORT_EMAIL', 'BILLING_TERMS_VERSION',
    'PADDLE_SANDBOX_API_KEY', 'PADDLE_SANDBOX_WEBHOOK_SECRET',
    'BILLING_MAINTENANCE_ACTOR_ID',
  ] as const) {
    if (workerEnv[name] !== undefined) process.env[name] = workerEnv[name]
  }

  const app = await createApplication()
  await app.listen(3000)
  application = app
}

export default {
  async scheduled() {
    // No cron is enabled in wrangler.jsonc. Provision a sandbox schedule only after review.
    const workerEnv = env as unknown as WorkerEnv
    if (!workerEnv.BILLING_MAINTENANCE_ACTOR_ID) return
    await (initialization ??= initializeWithRetry(() => initialize(workerEnv)))
    const run = () => application!.get(BillingMaintenance).scheduled()
    if (workerEnv.HYPERDRIVE) await runWithPrismaClient(workerEnv.HYPERDRIVE.connectionString, run)
    else await run()
  },
  async fetch(request: Request) {
    const workerEnv = env as unknown as WorkerEnv
    try {
      await (initialization ??= initializeWithRetry(() => initialize(workerEnv)))
    } catch (error) {
      initialization = undefined
      console.error('Worker initialization failed', error)
      return Response.json(
        { error: 'Service temporarily unavailable' },
        { status: 503, headers: { 'Cache-Control': 'no-store' } },
      )
    }
    const handle = () => handleAsNodeRequest(3000, request)
    return workerEnv.HYPERDRIVE
      ? runWithPrismaClient(workerEnv.HYPERDRIVE.connectionString, handle)
      : handle()
  },
}
