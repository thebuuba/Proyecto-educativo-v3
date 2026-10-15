import test from 'node:test'
import assert from 'node:assert/strict'
import { assertStagingEnvironment, STAGING_PROJECT_REF } from './check-staging-environment.mjs'

const env = () => ({APP_URL:'https://aula-base-staging.prroyectoeducativo00.workers.dev', VITE_SUPABASE_URL:`https://${STAGING_PROJECT_REF}.supabase.co`,
  SUPABASE_DB_URL:`postgresql://postgres:SYNTHETIC-ONLY@db.${STAGING_PROJECT_REF}.supabase.co:5432/postgres`})

test('acepta solo el proyecto Development y el Worker de staging conocidos', () => {
  assert.equal(assertStagingEnvironment(env()).projectRef,STAGING_PROJECT_REF)
  assert.equal(assertStagingEnvironment({...env(),SUPABASE_DB_URL:`postgresql://postgres.${STAGING_PROJECT_REF}:SYNTHETIC-ONLY@aws-0-us-east-1.pooler.supabase.com:5432/postgres`}).projectRef,STAGING_PROJECT_REF)
})

test('rechaza producción, destinos mezclados y URLs engañosas sin imprimir credenciales', () => {
  for (const patch of [
    {APP_URL:'https://aula-base.prroyectoeducativo00.workers.dev'},
    {VITE_SUPABASE_URL:'https://vqrptqffeezqacwtmlqq.supabase.co'},
    {SUPABASE_DB_URL:'postgresql://postgres:SYNTHETIC-ONLY@db.vqrptqffeezqacwtmlqq.supabase.co:5432/postgres'},
    {SUPABASE_DB_URL:`postgresql://postgres.${STAGING_PROJECT_REF}:SYNTHETIC-ONLY@evil.invalid/postgres`},
    {SUPABASE_DB_URL:`postgresql://app_backend:SYNTHETIC-ONLY@db.${STAGING_PROJECT_REF}.supabase.co/postgres`},
    {SUPABASE_DB_URL:`postgresql://postgres:SYNTHETIC-ONLY@db.${STAGING_PROJECT_REF}.supabase.co/other`},
    {SUPABASE_DB_URL:'bad-secret-SYNTHETIC-ONLY'},
    {VITE_SUPABASE_URL:`https://user:pass@${STAGING_PROJECT_REF}.supabase.co`},
  ]) {
    assert.throws(()=>assertStagingEnvironment({...env(),...patch}), error=>!error.message.includes('SYNTHETIC-ONLY'))
  }
})
