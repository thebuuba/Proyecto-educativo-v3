// Integration checks are deliberately restricted to the project's loopback DB.
// Never loads .env files. Supply DATABASE_URL explicitly in the caller process.
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve, join } from 'node:path'
import { tmpdir } from 'node:os'
import { spawnSync } from 'node:child_process'

const root = resolve('.'),
  directory = resolve(process.argv[2] || 'data/curriculum')
const url = new URL(process.env.DATABASE_URL || 'missing:')
assert(
  ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname),
  'Solo se permite PostgreSQL local',
)
assert.equal(url.port, '54332', 'Usar exclusivamente la base local del proyecto')
const require = createRequire(resolve('packages/database/package.json'))
const { Client } = require('pg')
const tsx = join(dirname(require.resolve('tsx/package.json')), 'dist/cli.mjs')
const db = new Client({ connectionString: url.toString() })
await db.connect()
const evidence = {
  generatedAt: new Date().toISOString(),
  target: { host: url.hostname, port: url.port, database: url.pathname.slice(1) },
  migrationSha256: createHash('sha256')
    .update(readFileSync('supabase/migrations/20260927202613_curricular_catalog.sql'))
    .digest('hex'),
  imports: [],
  queries: [],
  checks: [],
}
const tables = [
  'curriculum_versions',
  'curriculum_documents',
  'curriculum_scopes',
  'curriculum_elements',
  'curriculum_element_relations',
  'curriculum_source_spans',
  'curriculum_subject_mappings',
]
const runImport = (dataset, coverage) =>
  spawnSync(
    process.execPath,
    [tsx, resolve('packages/database/src/import-curriculum.ts'), dataset, coverage],
    {
      cwd: root,
      env: { ...process.env, DATABASE_URL: url.toString() },
      encoding: 'utf8',
      timeout: 120000,
    },
  )
const counts = async () => {
  const result = {}
  for (const name of tables) {
    result[name] = Number((await db.query(`select count(*) from public.${name}`)).rows[0].count)
  }
  return result
}
const rejectSql = async (sql, params, code) => {
  await db.query('savepoint rejection')
  let failure
  try {
    await db.query(sql, params)
  } catch (e) {
    failure = e
  }
  await db.query('rollback to savepoint rejection')
  assert(failure, `Debe rechazar: ${sql}`)
  if (code) assert.equal(failure.code, code)
  return failure.code
}
try {
  evidence.server = (await db.query('select version()')).rows[0].version
  evidence.catalog = (
    await db.query(
      `select c.relname,c.relrowsecurity,
    has_table_privilege('app_backend',c.oid,'SELECT,INSERT,UPDATE,DELETE') backend_crud,
    (select count(*)::int from pg_policy p where p.polrelid=c.oid) policies,
    (select count(*)::int from pg_constraint k where k.conrelid=c.oid and k.contype='f') foreign_keys,
    (select count(*)::int from pg_index i where i.indrelid=c.oid) indexes,
    (select count(*)::int from pg_trigger t where t.tgrelid=c.oid and not t.tgisinternal) triggers
    from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname=any($1::text[]) order by c.relname`,
      [tables],
    )
  ).rows
  assert.equal(evidence.catalog.length, 7)
  assert(
    evidence.catalog.every(
      (t) => t.relrowsecurity && t.backend_crud && t.policies === 1 && t.indexes > 0,
    ),
  )
  assert(
    evidence.catalog
      .filter((t) => t.relname !== 'curriculum_subject_mappings')
      .every((t) => t.triggers === 1),
  )
  for (const prefix of ['primary-2023', 'secondary-2023']) {
    const dataset = join(directory, `${prefix}.jsonl`),
      coverage = join(directory, `${prefix}.coverage.json`)
    const rows = readFileSync(dataset, 'utf8').trim().split('\n').map(JSON.parse),
      version = rows.find((r) => r.kind === 'version')
    const before = await counts(),
      first = runImport(dataset, coverage)
    assert.equal(first.status, 0, first.stderr)
    const once = await counts(),
      second = runImport(dataset, coverage)
    assert.equal(second.status, 0, second.stderr)
    const twice = await counts()
    assert.deepEqual(twice, once)
    const actual = (
      await db.query(
        `select v.code,v.status,
      (select count(*)::int from curriculum_documents where version_id=v.id) documents,
      (select count(*)::int from curriculum_scopes where version_id=v.id) scopes,
      (select count(*)::int from curriculum_elements where version_id=v.id) elements,
      (select count(*)::int from curriculum_element_relations where version_id=v.id) relations,
      (select count(*)::int from curriculum_source_spans where version_id=v.id) spans
      from curriculum_versions v where code=$1`,
        [version.code],
      )
    ).rows[0]
    for (const [field, kind] of [
      ['documents', 'document'],
      ['scopes', 'scope'],
      ['elements', 'element'],
      ['relations', 'relation'],
      ['spans', 'element'],
    ])
      assert.equal(actual[field], rows.filter((r) => r.kind === kind).length)
    assert.equal(actual.status, 'DRAFT')
    const temporary = mkdtempSync(join(tmpdir(), 'aulabase-curriculum-check-'))
    const changed = structuredClone(rows)
    changed.find((r) => r.kind === 'document').sha256 = 'a'.repeat(64)
    const changedCoverage = JSON.parse(readFileSync(coverage, 'utf8'))
    changedCoverage.document.sha256 = 'a'.repeat(64)
    writeFileSync(
      join(temporary, 'changed.jsonl'),
      changed.map((r) => JSON.stringify(r)).join('\n') + '\n',
    )
    writeFileSync(join(temporary, 'changed.coverage.json'), JSON.stringify(changedCoverage))
    const different = runImport(
      join(temporary, 'changed.jsonl'),
      join(temporary, 'changed.coverage.json'),
    )
    assert.notEqual(different.status, 0)
    assert.match(different.stderr, /otro PDF o dataset/u)
    assert.deepEqual(await counts(), twice)
    evidence.imports.push({
      prefix,
      before,
      first: first.stdout.trim(),
      once,
      second: second.stdout.trim(),
      twice,
      actual,
      datasetSha256: createHash('sha256').update(readFileSync(dataset)).digest('hex'),
      changedHashRejected: true,
      temporary,
    })
  }
  const contexts = [
    ['PRIMARY', 5, 'Ciencias de la Naturaleza', null],
    ['PRIMARY', 1, 'Lengua Española', null],
    ['SECONDARY', 2, 'Matemática', null],
    ['SECONDARY', 4, 'Apreciación y Producción Literarias', 'Humanidades y Lenguas Modernas'],
    ['SECONDARY', 4, 'Apreciación y Producción Literarias', 'Humanidades y Ciencias Sociales'],
    ['SECONDARY', 5, 'Química y Computación', 'Ciencias y Tecnología'],
    ['SECONDARY', 6, 'Física y Computación', 'Ciencias y Tecnología'],
  ]
  for (const context of contexts) {
    const result = (
      await db.query(
        `select v.level,s.cycle,s.grade,s.area_name,s.subject_name,s.optative_exit_name,e.element_type,count(*)::int count
      from curriculum_elements e join curriculum_scopes s on s.id=e.scope_id join curriculum_versions v on v.id=s.version_id
      where v.level=$1 and s.grade=$2 and s.subject_name=$3 and s.optative_exit_name is not distinct from $4
      group by 1,2,3,4,5,6,7 order by 7`,
        context,
      )
    ).rows
    assert(result.length >= 6)
    assert(
      result.every(
        (r) =>
          r.level === context[0] &&
          r.grade === context[1] &&
          r.subject_name === context[2] &&
          r.optative_exit_name === context[3],
      ),
    )
    evidence.queries.push({ context, result })
  }
  await db.query('begin')
  await db.query('set local role app_backend')
  assert.equal(
    Number((await db.query('select count(*) from curriculum_versions')).rows[0].count),
    2,
  )
  evidence.checks.push({ check: 'app_backend SELECT', passed: true })
  evidence.checks.push({
    check: 'FK de ámbito inexistente',
    sqlstate: await rejectSql(
      `insert into curriculum_elements(id,version_id,scope_id,stable_key,element_type,original_text,normalized_text,source_order) select gen_random_uuid(),id,gen_random_uuid(),'invalid-test','CONCEPT','prueba','prueba',0 from curriculum_versions limit 1`,
      [],
      '23503',
    ),
  })
  evidence.checks.push({
    check: 'DRAFT no puede publicarse directamente',
    sqlstate: await rejectSql(
      "update curriculum_versions set status='PUBLISHED',validated_at=now(),published_at=now()",
      [],
      'P0001',
    ),
  })
  const testId = (
    await db.query(
      "insert into curriculum_versions(code,level,edition_year) values ('LOCAL_ROLLBACK_ONLY','PRIMARY',2023) returning id",
    )
  ).rows[0].id
  await db.query(
    "update curriculum_versions set status='VALIDATED',validated_at=now() where id=$1",
    [testId],
  )
  await db.query(
    "update curriculum_versions set status='PUBLISHED',published_at=now() where id=$1",
    [testId],
  )
  evidence.checks.push({
    check: 'Inmutabilidad de versión sintética (ROLLBACK)',
    sqlstate: await rejectSql('delete from curriculum_versions where id=$1', [testId], 'P0001'),
  })
  evidence.checks.push({
    check: 'Inmutabilidad de contenido sintético (ROLLBACK)',
    sqlstate: await rejectSql(
      "insert into curriculum_scopes(version_id,stable_key) values ($1,'test')",
      [testId],
      'P0001',
    ),
  })
  await db.query('rollback')
  for (const role of ['anon', 'authenticated']) {
    await db.query('begin')
    await db.query(`set local role ${role}`)
    for (const table of tables) {
      await db.query('savepoint permission')
      try {
        const result = await db.query(`select * from public.${table}`)
        assert.equal(result.rowCount, 0)
      } catch (error) {
        assert.equal(error.code, '42501')
      }
      await db.query('rollback to savepoint permission')
    }
    await rejectSql(
      "insert into curriculum_versions(code,level,edition_year) values ('DENIED_TEST','PRIMARY',2023)",
      [],
      '42501',
    )
    const updates = await db.query("update curriculum_versions set code='DENIED_TEST'")
    assert.equal(updates.rowCount, 0)
    const deletes = await db.query('delete from curriculum_versions')
    assert.equal(deletes.rowCount, 0)
    await db.query('rollback')
    evidence.checks.push({
      check: `RLS ${role}: lectura 7 tablas; escritura versiones denegada`,
      passed: true,
    })
  }
  evidence.finalVersions = (
    await db.query('select code,status from curriculum_versions order by code')
  ).rows
  assert(evidence.finalVersions.every((v) => v.status === 'DRAFT'))
  evidence.passed = true
  writeFileSync(join(directory, 'local-db-check.json'), JSON.stringify(evidence, null, 2) + '\n')
  console.log(
    JSON.stringify({
      passed: true,
      imports: evidence.imports.map((i) => i.actual),
      queries: evidence.queries.length,
      checks: evidence.checks,
    }),
  )
} finally {
  await db.end()
}
