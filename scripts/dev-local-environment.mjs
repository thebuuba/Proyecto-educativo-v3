import assert from 'node:assert/strict'

export function localEnvironment(status, jwtSecret) {
  for (const [key, port] of [['DB_URL', '54332'], ['API_URL', '54321']]) {
    const url = new URL(status[key])
    assert(['127.0.0.1', 'localhost'].includes(url.hostname) && url.port === port,
      'Sólo se permite Supabase local confirmado en 54321/54332.')
  }
  assert(status.ANON_KEY && status.SERVICE_ROLE_KEY && jwtSecret, 'Faltan claves locales.')
  return {
    DATABASE_URL: status.DB_URL, SUPABASE_URL: status.API_URL,
    SUPABASE_ANON_KEY: status.ANON_KEY, SUPABASE_SERVICE_ROLE_KEY: status.SERVICE_ROLE_KEY,
    VITE_SUPABASE_URL: status.API_URL, VITE_SUPABASE_ANON_KEY: status.ANON_KEY,
    JWT_SECRET: jwtSecret, NODE_ENV: 'development', PORT: '3000',
    FRONTEND_URL: 'http://localhost:5173', VITE_API_PROXY_TARGET: 'http://127.0.0.1:3000',
  }
}
