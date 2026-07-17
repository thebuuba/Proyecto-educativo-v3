import { handleAsNodeRequest } from 'cloudflare:node'
import { env } from 'cloudflare:workers'
import { createApplication } from './apps/backend/dist/bootstrap.js'

let initialization: Promise<void> | undefined

async function initialize() {
  const workerEnv = env as unknown as {
    HYPERDRIVE?: { connectionString: string }
    FRONTEND_URL?: string
  }
  const hyperdrive = workerEnv.HYPERDRIVE

  if (hyperdrive) {
    process.env.DATABASE_URL = hyperdrive.connectionString
    process.env.CLOUDFLARE_WORKER_PRODUCTION = 'true'
  }
  if (workerEnv.FRONTEND_URL) {
    process.env.FRONTEND_URL = workerEnv.FRONTEND_URL
  }

  const app = await createApplication()
  await app.listen(3000)
}

export default {
  async fetch(request: Request) {
    try {
      await (initialization ??= initialize())
    } catch (error) {
      initialization = undefined
      console.error('Worker initialization failed', error)
      return Response.json(
        { error: 'Service temporarily unavailable' },
        { status: 503, headers: { 'Cache-Control': 'no-store' } },
      )
    }
    return handleAsNodeRequest(3000, request)
  },
}
