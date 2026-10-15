import { pathToFileURL } from 'node:url'
import { appendFileSync } from 'node:fs'

export const STAGING_PROJECT_REF = 'eolgunypmtgrsyrjzcld'
const STAGING_APP_ORIGIN = 'https://aula-base-staging.prroyectoeducativo00.workers.dev'

export function assertStagingEnvironment(env = process.env) {
  let app, api, db
  try { app = new URL(env.APP_URL); api = new URL(env.VITE_SUPABASE_URL); db = new URL(env.SUPABASE_DB_URL) }
  catch { throw new Error('Faltan URLs válidas para comprobar el destino de staging.') }
  if (app.origin !== STAGING_APP_ORIGIN || app.username || app.password || app.pathname !== '/' || app.search || app.hash) {
    throw new Error('APP_URL debe apuntar exclusivamente al Worker de staging.')
  }
  if (api.origin !== `https://${STAGING_PROJECT_REF}.supabase.co` || api.username || api.password || api.pathname !== '/' || api.search || api.hash) {
    throw new Error('El frontend de staging debe usar Supabase Development.')
  }
  const direct = db.hostname === `db.${STAGING_PROJECT_REF}.supabase.co` && decodeURIComponent(db.username) === 'postgres'
  const pooled = db.hostname.endsWith('.pooler.supabase.com') && decodeURIComponent(db.username) === `postgres.${STAGING_PROJECT_REF}`
  if (!['postgres:', 'postgresql:'].includes(db.protocol) || (!direct && !pooled) || db.pathname !== '/postgres') {
    throw new Error('Las migraciones de staging requieren la conexión administrativa de Development.')
  }
  return { projectRef: STAGING_PROJECT_REF, appOrigin: STAGING_APP_ORIGIN }
}

export function stagingMigrationUrl(env = process.env) {
  assertStagingEnvironment(env)
  const db = new URL(env.SUPABASE_DB_URL)
  // Session pooler verified against Development; GitHub-hosted runners cannot use its direct IPv6 endpoint.
  db.hostname = 'aws-0-us-east-1.pooler.supabase.com'
  db.username = `postgres.${STAGING_PROJECT_REF}`
  db.port = '5432'
  return db.href
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    console.log(`Destino de staging verificado: ${assertStagingEnvironment().projectRef}.`)
    if (process.argv.includes('--github-env')) {
      if (process.env.GITHUB_ACTIONS !== 'true' || !process.env.GITHUB_ENV) throw new Error('La preparación de conexión requiere GitHub Actions.')
      const connection = stagingMigrationUrl()
      // Register the transformed credential with the runner before subsequent step env logs can display it.
      console.log(`::add-mask::${connection}`)
      appendFileSync(process.env.GITHUB_ENV, `SUPABASE_DB_URL=${connection}\n`)
      console.log('Conexión de migraciones preparada mediante Session pooler de Development.')
    }
  }
  catch (error) { console.error(error.message); process.exitCode = 1 }
}
