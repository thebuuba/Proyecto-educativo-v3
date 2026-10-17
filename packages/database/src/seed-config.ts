type Environment = Record<string, string | undefined>
export type SeedConfiguration = { email: string; password: string; fullName: string; schoolName: string; schoolSlug: string; supabaseUrl: string; serviceKey: string }

function required(env: Environment, key: string) {
  const value = env[key]?.trim()
  if (!value || /^(replace[-_]|change-me|PROJECT_REF|PASSWORD$)/i.test(value)) throw new Error(`Configura ${key} explícitamente antes de inicializar un administrador.`)
  return value
}

/** El administrador de prueba nunca se crea en un proyecto remoto, aunque NODE_ENV no esté definido. */
export function seedConfiguration(env: Environment = process.env): SeedConfiguration | null {
  if (env.SEED_BOOTSTRAP_ADMIN !== 'true') return null
  if (env.NODE_ENV === 'production' || env.CLOUDFLARE_WORKER_PRODUCTION === 'true') throw new Error('El seed de administrador está deshabilitado en producción.')
  const supabaseUrl = required(env, 'SUPABASE_URL').replace(/\/$/, '')
  const authUrl = new URL(supabaseUrl), databaseUrl = new URL(required(env, 'DATABASE_URL'))
  const loopback = new Set(['localhost', '127.0.0.1', '[::1]'])
  if (!['http:', 'https:'].includes(authUrl.protocol) || !['postgresql:', 'postgres:'].includes(databaseUrl.protocol)
    || !loopback.has(authUrl.hostname) || !loopback.has(databaseUrl.hostname)) {
    throw new Error('El seed de administrador solo permite Supabase y PostgreSQL locales.')
  }
  const email = required(env, 'SEED_ADMIN_EMAIL').toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('SEED_ADMIN_EMAIL no es válido.')
  const schoolSlug = required(env, 'SEED_SCHOOL_SLUG')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(schoolSlug)) throw new Error('SEED_SCHOOL_SLUG no es válido.')
  required(env, 'SEED_ADMIN_PASSWORD')
  const password = env.SEED_ADMIN_PASSWORD!
  if (password.length < 12) throw new Error('SEED_ADMIN_PASSWORD debe tener al menos 12 caracteres.')
  return { email, password, schoolSlug, fullName: required(env, 'SEED_ADMIN_NAME'), schoolName: required(env, 'SEED_SCHOOL_NAME'), supabaseUrl, serviceKey: required(env, 'SUPABASE_SERVICE_ROLE_KEY') }
}

/** Una repetición solo es válida para el administrador ya vinculado al mismo centro e identidad. */
export function assertExistingSeedIdentity(user: { schoolId: string; authUserId: string; status: string } | null, schoolId: string | undefined, authUserId: string | null, hasActiveAdminRole: boolean) {
  if (!user || !schoolId || !authUserId || user.schoolId !== schoolId || user.authUserId !== authUserId || user.status !== 'ACTIVE' || !hasActiveAdminRole) {
    throw new Error('La identidad ya existe. El seed no promueve usuarios ni los reasigna a otro centro.')
  }
}
