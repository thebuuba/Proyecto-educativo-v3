import test from 'node:test'
import assert from 'node:assert/strict'
import { localEnvironment } from './dev-local-environment.mjs'

const status = { DB_URL: 'postgresql://postgres:local@127.0.0.1:54332/postgres', API_URL: 'http://127.0.0.1:54321', ANON_KEY: 'public-test', SERVICE_ROLE_KEY: 'private-test' }
test('todos los clientes utilizan el mismo entorno local confirmado', () => {
  const env = localEnvironment(status, 'local-jwt-test')
  assert.equal(env.SUPABASE_URL, env.VITE_SUPABASE_URL)
  assert.equal(env.SUPABASE_ANON_KEY, env.VITE_SUPABASE_ANON_KEY)
  assert.equal(env.VITE_API_PROXY_TARGET, 'http://127.0.0.1:3000')
  assert.equal(env.DATABASE_URL, status.DB_URL)
  assert.equal(env.NODE_ENV, 'development')
  assert.equal(env.PORT, '3000')
})
test('rechaza destinos remotos, puertos distintos y claves ausentes antes de arrancar', () => {
  for (const patch of [
    { DB_URL: 'postgresql://postgres:secret@db.example.com:54332/postgres' },
    { API_URL: 'https://example.supabase.co' },
    { API_URL: 'http://localhost:8000' },
    { DB_URL: 'postgresql://postgres:local@127.0.0.1:5432/postgres' },
    { SERVICE_ROLE_KEY: '' }, { ANON_KEY: '' },
  ]) assert.throws(() => localEnvironment({ ...status, ...patch }, 'test'))
})
