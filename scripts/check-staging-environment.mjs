import { pathToFileURL } from 'node:url'

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

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { console.log(`Destino de staging verificado: ${assertStagingEnvironment().projectRef}.`) }
  catch (error) { console.error(error.message); process.exitCode = 1 }
}
