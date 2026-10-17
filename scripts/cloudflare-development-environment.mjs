import assert from 'node:assert/strict'

export const developmentProjectRef = 'eolgunypmtgrsyrjzcld'

export function developmentEnvironment(values, parent = {}) {
  for (const name of ['DATABASE_URL', 'FRONTEND_URL', 'JWT_SECRET', 'SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']) {
    assert(values[name], `Falta ${name} en .dev.vars.local; no se heredan credenciales de otro entorno.`)
  }
  const origin = `https://${developmentProjectRef}.supabase.co`
  for (const name of ['SUPABASE_URL', 'VITE_SUPABASE_URL']) {
    assert(values[name].replace(/\/$/, '') === origin, `${name} debe apuntar exclusivamente a AulaBase Development.`)
  }
  let database
  try { database = new URL(values.DATABASE_URL) } catch {
    throw new Error('DATABASE_URL debe ser una conexión válida de AulaBase Development.')
  }
  const username = decodeURIComponent(database.username)
  const pooled = database.hostname.endsWith('.pooler.supabase.com')
  const role = pooled ? username.replace(`.${developmentProjectRef}`, '') : username
  assert(['app_backend', 'app_backend_local'].includes(role), 'Development requiere app_backend o app_backend_local; no un rol administrador.')
  assert(['postgres:', 'postgresql:'].includes(database.protocol) && database.pathname === '/postgres' && (
    pooled ? username === `${role}.${developmentProjectRef}` : database.hostname === `db.${developmentProjectRef}.supabase.co`
  ), 'DATABASE_URL debe apuntar exclusivamente a AulaBase Development.')
  for (const [name, role] of [['SUPABASE_ANON_KEY', 'anon'], ['VITE_SUPABASE_ANON_KEY', 'anon'], ['SUPABASE_SERVICE_ROLE_KEY', 'service_role']]) {
    let claims
    try { claims = JSON.parse(Buffer.from(values[name].split('.')[1], 'base64url')) } catch { /* Report only the variable name. */ }
    assert(claims?.ref === developmentProjectRef && claims?.role === role, `${name} debe pertenecer a AulaBase Development con el rol correcto.`)
  }
  assert(values.VITE_SUPABASE_ANON_KEY === values.SUPABASE_ANON_KEY, 'Frontend y servidor deben utilizar la misma clave pública de Development.')
  assert(['http://localhost:8787', 'http://127.0.0.1:8787'].includes(values.FRONTEND_URL), 'FRONTEND_URL debe ser el Worker local en el puerto 8787.')
  return {...parent, ...values, CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE: values.DATABASE_URL}
}
