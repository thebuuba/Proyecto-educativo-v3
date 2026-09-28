import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { randomUUID } from 'node:crypto'

const url = new URL(process.env.DATABASE_URL ?? 'http://missing')
assert(['localhost', '127.0.0.1'].includes(url.hostname) && url.port === '54332', 'Solo se permite PostgreSQL local 127.0.0.1:54332')
const require = createRequire(new URL('../../packages/database/package.json', import.meta.url))
const { Client } = require('pg')
const client = new Client({ connectionString: url.toString() })
await client.connect()
const schoolId = randomUUID()
const instrumentId = randomUUID()
const snapshotId = randomUUID()
const tables = ['evaluation_instrument_snapshots', 'evaluation_snapshot_sources', 'teacher_instrument_preferences']
try {
  for (const table of tables) {
    const { rows: [state] } = await client.query('SELECT relrowsecurity, oid FROM pg_class WHERE oid = $1::regclass', [`public.${table}`])
    assert.equal(state.relrowsecurity, true)
    assert.equal((await client.query('SELECT has_table_privilege($1,$2,$3) AS allowed', ['app_backend', `public.${table}`, 'SELECT'])).rows[0].allowed, true)
    for (const role of ['anon', 'authenticated']) {
      for (const action of ['SELECT', 'INSERT', 'UPDATE', 'DELETE']) {
        assert.equal((await client.query('SELECT has_table_privilege($1,$2,$3) AS allowed', [role, `public.${table}`, action])).rows[0].allowed, false)
      }
    }
  }
  await client.query('BEGIN')
  await client.query('INSERT INTO public.schools(id,name,slug) VALUES($1,$2,$3)', [schoolId, 'Fixture Fase C', `phase-c-${schoolId}`])
  await client.query('INSERT INTO public.evaluation_instruments(id,school_id,name,type,criteria,max_score) VALUES($1,$2,$3,$4,$5,$6)',
    [instrumentId, schoolId, 'Rúbrica temporal', 'rubrica', '{}', 20])
  await client.query('INSERT INTO public.evaluation_instrument_snapshots(id,school_id,instrument_id,payload,catalog_version) VALUES($1,$2,$3,$4,$5)',
    [snapshotId, schoolId, instrumentId, JSON.stringify({ criteria: [], totalScoreUnits: 2000 }), 'evaluation-2026.1'])
  assert.equal((await client.query('SELECT count(*)::int AS n FROM public.evaluation_instrument_snapshots WHERE id=$1', [snapshotId])).rows[0].n, 1)
  await client.query('SAVEPOINT invalid_reference')
  try {
    await client.query('INSERT INTO public.evaluation_snapshot_sources(snapshot_id,element_id,version_id) VALUES($1,$2,$3)',
      [snapshotId, randomUUID(), randomUUID()])
    throw new Error('La FK de referencias no rechazó un elemento ajeno')
  } catch (error) {
    assert.equal(error.code, '23503')
    await client.query('ROLLBACK TO SAVEPOINT invalid_reference')
  }
  await client.query('SET LOCAL ROLE app_backend')
  assert.equal((await client.query('SELECT count(*)::int AS n FROM public.evaluation_instrument_snapshots WHERE id=$1', [snapshotId])).rows[0].n, 1)
  assert.equal((await client.query('SELECT has_table_privilege(current_user,$1,$2) AS allowed', ['public.evaluation_instrument_snapshots', 'UPDATE'])).rows[0].allowed, false)
  await client.query('RESET ROLE')
  await client.query('ROLLBACK')
  assert.equal((await client.query('SELECT count(*)::int AS n FROM public.evaluation_instrument_snapshots WHERE id=$1', [snapshotId])).rows[0].n, 0)
  assert.equal((await client.query('SELECT count(*)::int AS n FROM public.schools WHERE id=$1', [schoolId])).rows[0].n, 0)
  console.log('Fase C local: RLS, roles, FKs, snapshot, inmutabilidad backend y rollback PASS; fixtures 0.')
} finally {
  await client.query('ROLLBACK').catch(() => {})
  await client.end()
}
