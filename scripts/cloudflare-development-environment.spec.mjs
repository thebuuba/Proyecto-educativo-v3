import assert from 'node:assert/strict'
import {test} from 'node:test'
import {developmentEnvironment, developmentProjectRef} from './cloudflare-development-environment.mjs'

const key = (ref, role) => `test.${Buffer.from(JSON.stringify({ref, role})).toString('base64url')}.signature`
function configuration(ref = 'eolgunypmtgrsyrjzcld') {
  return {
    DATABASE_URL: `postgresql://app_backend_local.${ref}:example@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require`,
    FRONTEND_URL: 'http://localhost:8787',
    JWT_SECRET: 'example-development-session-secret-32-characters',
    SUPABASE_URL: `https://${ref}.supabase.co`,
    VITE_SUPABASE_URL: `https://${ref}.supabase.co`,
    SUPABASE_ANON_KEY: key(ref, 'anon'),
    VITE_SUPABASE_ANON_KEY: key(ref, 'anon'),
    SUPABASE_SERVICE_ROLE_KEY: key(ref, 'service_role'),
  }
}

test('accepts Development and overrides inherited production variables', () => {
  const values = configuration()
  const result = developmentEnvironment(values, configuration('vqrptqffeezqacwtmlqq'))
  assert.equal(developmentProjectRef, 'eolgunypmtgrsyrjzcld')
  for (const [name, value] of Object.entries(values)) assert.equal(result[name], value)
  assert.equal(result.CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE, values.DATABASE_URL)
})

test('rejects production even when every production setting agrees', () => {
  assert.throws(() => developmentEnvironment(configuration('vqrptqffeezqacwtmlqq')), /Development/)
})

test('rejects mixed database, Auth, frontend and Storage credentials', () => {
  const wrong = configuration('vqrptqffeezqacwtmlqq')
  for (const field of ['DATABASE_URL', 'SUPABASE_URL', 'VITE_SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'VITE_SUPABASE_ANON_KEY']) {
    assert.throws(() => developmentEnvironment({...configuration(), [field]: wrong[field]}), /Development|misma clave/)
  }
})

test('rejects an admin connection and missing values rather than falling back to the parent', () => {
  const values = configuration()
  assert.throws(() => developmentEnvironment({...values, DATABASE_URL: values.DATABASE_URL.replace('app_backend_local.', 'postgres.')}), /app_backend/)
  const {SUPABASE_SERVICE_ROLE_KEY, ...incomplete} = values
  assert.throws(() => developmentEnvironment(incomplete, values), /SUPABASE_SERVICE_ROLE_KEY/)
})

test('does not include a malformed connection string in the error', () => {
  assert.throws(() => developmentEnvironment({...configuration(), DATABASE_URL: 'private-connection-value'}), error => {
    assert.match(error.message, /DATABASE_URL/)
    assert(!String(error).includes('private-connection-value'))
    assert(!('input' in error))
    return true
  })
})
