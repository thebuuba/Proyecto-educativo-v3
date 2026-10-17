import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync, rmdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { assertStagingEnvironment, stagingMigrationUrl, STAGING_PROJECT_REF } from './check-staging-environment.mjs'

const env = () => ({APP_URL:'https://aula-base-staging.prroyectoeducativo00.workers.dev', VITE_SUPABASE_URL:`https://${STAGING_PROJECT_REF}.supabase.co`,
  SUPABASE_DB_URL:`postgresql://postgres:SYNTHETIC-ONLY@db.${STAGING_PROJECT_REF}.supabase.co:5432/postgres`})

test('acepta solo el proyecto Development y el Worker de staging conocidos', () => {
  assert.equal(assertStagingEnvironment(env()).projectRef,STAGING_PROJECT_REF)
  assert.equal(assertStagingEnvironment({...env(),SUPABASE_DB_URL:`postgresql://postgres.${STAGING_PROJECT_REF}:SYNTHETIC-ONLY@aws-0-us-east-1.pooler.supabase.com:5432/postgres`}).projectRef,STAGING_PROJECT_REF)
})

test('usa el Session pooler IPv4 verificado sin cambiar contraseña, proyecto ni parámetros TLS', () => {
  const source = {...env(), SUPABASE_DB_URL:`postgresql://postgres:p%40ss%3Aword@db.${STAGING_PROJECT_REF}.supabase.co:5432/postgres?sslmode=require`}
  const target = new URL(stagingMigrationUrl(source))
  assert.equal(target.hostname, 'aws-0-us-east-1.pooler.supabase.com')
  assert.equal(target.username, `postgres.${STAGING_PROJECT_REF}`)
  assert.equal(target.password, 'p%40ss%3Aword')
  assert.equal(target.port, '5432')
  assert.equal(target.pathname, '/postgres')
  assert.equal(target.searchParams.get('sslmode'), 'require')
  assert.equal(stagingMigrationUrl({...env(), SUPABASE_DB_URL:target.href}), target.href)
  assert.match(source.SUPABASE_DB_URL, /@db\./)
})

test('no convierte una conexión de producción o un rol de ejecución en una credencial válida', () => {
  for (const url of ['postgresql://postgres:dummy@db.vqrptqffeezqacwtmlqq.supabase.co/postgres',
    `postgresql://app_backend:dummy@db.${STAGING_PROJECT_REF}.supabase.co/postgres`]) {
    assert.throws(() => stagingMigrationUrl({...env(), SUPABASE_DB_URL:url}))
  }
})

test('prepara la conexión solo en Actions y registra la máscara antes de usarla en otros pasos', () => {
  const directory = mkdtempSync(join(tmpdir(), 'staging-env-test-'))
  const file = join(directory, 'environment')
  try {
    const command = new URL('./check-staging-environment.mjs', import.meta.url)
    const run = extra => spawnSync(process.execPath, [fileURLToPath(command), '--github-env'],
      {env:{...process.env,...env(),GITHUB_ACTIONS:'false',GITHUB_ENV:file,...extra},encoding:'utf8'})
    const local = run({})
    assert.equal(local.status, 1)
    assert.equal(local.stdout.includes('SYNTHETIC-ONLY'), false)
    const actions = run({GITHUB_ACTIONS:'true'})
    assert.equal(actions.status, 0, actions.stderr)
    assert.equal(readFileSync(file,'utf8'), `SUPABASE_DB_URL=${stagingMigrationUrl(env())}\n`)
    assert.match(actions.stdout, /::add-mask::postgresql:/)
    assert.equal(actions.stdout.includes(env().SUPABASE_DB_URL), false)
  } finally { rmSync(file, {force:true}); rmdirSync(directory) }
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
