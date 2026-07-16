import { httpServerHandler } from 'cloudflare:node'
import { env } from 'cloudflare:workers'
import { createApplication } from './apps/backend/dist/bootstrap.js'

const hyperdrive = (env as unknown as {
  HYPERDRIVE?: { connectionString: string }
}).HYPERDRIVE

if (hyperdrive) {
  process.env.DATABASE_URL = hyperdrive.connectionString
  process.env.CLOUDFLARE_WORKER_PRODUCTION = 'true'
}

const app = await createApplication()
await app.listen(3000)

export default httpServerHandler({ port: 3000 })
