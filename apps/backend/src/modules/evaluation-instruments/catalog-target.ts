export function assertEvaluationCatalogTarget(expected: string, environment: NodeJS.ProcessEnv = process.env) {
  if (!expected.trim()) throw new Error('Falta identificar explícitamente el entorno de destino.')
  const supabaseUrl = new URL(environment.SUPABASE_URL ?? 'http://missing')
  if (supabaseUrl.hostname !== `${expected}.supabase.co`) {
    throw new Error(`El destino configurado no corresponde al proyecto esperado ${expected}; no se realizaron cambios.`)
  }
  const databaseUrl = new URL(environment.DATABASE_URL ?? 'http://missing')
  const directHostMatches = databaseUrl.hostname === `db.${expected}.supabase.co`
  const poolerUserMatches = databaseUrl.username === `postgres.${expected}` || databaseUrl.username.endsWith(`.${expected}`)
  if (!directHostMatches && !poolerUserMatches) {
    throw new Error(`DATABASE_URL no identifica el proyecto esperado ${expected}; no se realizaron cambios.`)
  }
}
