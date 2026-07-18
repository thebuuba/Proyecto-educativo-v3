import { handleAsNodeRequest } from 'cloudflare:node'
import { env } from 'cloudflare:workers'
import { runWithPrismaClient } from './packages/database/dist/index.js'
import { createApplication } from './apps/backend/dist/bootstrap.js'

let initialization: Promise<void> | undefined

type WorkerEnv = {
  HYPERDRIVE?: { connectionString: string }
  FRONTEND_URL?: string
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

  const app = await createApplication()
  await app.listen(3000)
}

export default {
  async fetch(request: Request) {
    const workerEnv = env as unknown as WorkerEnv
    try {
      await (initialization ??= initialize(workerEnv))
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
