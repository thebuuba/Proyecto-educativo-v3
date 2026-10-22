import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync, existsSync} from 'node:fs'
import {createHash} from 'node:crypto'

const target = 'data/evaluation-instruments/technical-mf057-five-contracts.json'
const fixture = () => {
  assert(existsSync(target), 'Faltan las consignas esperadas MF057')
  return JSON.parse(readFileSync(target, 'utf8'))
}
const matrix = () => JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/technical-ifc006-mf057-5-matriz.json', 'utf8'))

test('MF057 conserva quinto técnico y separa instrumentos locales de pruebas remotas pendientes', () => {
  const f = fixture(), m = matrix(), records = new Map(m.officialRecords.map(r => [r.id, r]))
  assert.equal(f.subjectCode, 'MF_057_3'); assert.equal(f.programCode, 'IFC006_3')
  assert.equal(f.grade, 5); assert.equal(f.cycle, 2); assert.equal(f.modalityCode, 'technical_professional')
  assert.equal(f.status, 'IMPLEMENTED_REVIEWED_PENDING_RUNTIME_QA')
  assert.equal(new Set(f.cases.map(c => c.id)).size, f.cases.length)
  for (const c of f.cases) {
    assert(c.description.trim(), c.id); assert(c.topics.length, c.id); assert(c.sourceRecordIds.length, c.id)
    assert.equal(new Set(c.topics).size, c.topics.length, c.id)
    for (const id of c.sourceRecordIds) {
      assert(records.has(id), id)
      assert(!['ATTITUDE', 'TEACHING_STRATEGY'].includes(records.get(id).type), id)
    }
  }
  assert.equal(m.implementation.provider, 'packages/shared/src/secondary-technical.ts'); assert.equal(m.adaptations.length, 115)
  const review = JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/technical-mf057-5-revision.json', 'utf8'))
  assert.equal(m.implementation.httpDb, review.httpDb); assert.equal(m.implementation.browser, review.browser)
})

test('cada CE y procedimiento MF057 tiene una consigna explícita sin usar actitudes como relleno', () => {
  const f = fixture(), m = matrix(), refs = new Set(f.cases.flatMap(c => c.sourceRecordIds))
  assert.deepEqual(m.officialRecords.filter(r => ['EVALUATION_CRITERION', 'PROCEDURE'].includes(r.type) && !refs.has(r.id)).map(r => r.id), [])
  for (const id of ['dba-definition', 'database-analysis', 'database-modification', 'roles-creation', 'backup-description', 'backup-alert-creation', 'backup-restoration', 'disk-layout', 'monitoring', 'updates-need', 'updates-environment', 'updates-testing', 'production-case-analysis', 'maintenance-plan', 'server-communication', 'server-response', 'point-in-time-recovery']) {
    assert(f.cases.some(c => c.id === id), id)
  }
})

test('MF057 separa permisos, métodos, arreglos y operaciones alternativas de acciones acumulativas', () => {
  const f = fixture(), byId = new Map(f.cases.map(c => [c.id, c]))
  for (const id of ['access-odbc', 'access-jdbc', 'user-select', 'user-insert', 'user-drop', 'admin-grant', 'admin-revoke', 'system-create-role', 'system-drop-user', 'raid-zero', 'raid-one', 'raid-five', 'raid-ten-distinction', 'independent-actions', 'alternative-backup', 'conjunction-backup', 'negated-restoration', 'negated-roles', 'optional-resource', 'weighted-components']) assert(byId.has(id), id)
  assert.equal(byId.get('alternative-backup').alternative, true)
  assert.equal(byId.get('score-pending').maxScore, null)
  assert.equal(byId.get('user-select').topics.length, 1)
  assert.equal(byId.get('access-odbc').topics.length, 1)
  assert(f.negativeDescriptions.length >= 3)
  assert(f.limits.some(s => s.includes('ficticios')))
  assert(f.limits.some(s => s.includes('RAID10') && s.includes('RAID0+1')))
  assert(f.limits.some(s => s.includes('producción')))
})

test('la documentación general MF057 no arrastra el método de acceso no solicitado', () => {
  const f = fixture()
  assert.deepEqual(f.cases.find(c => c.id === 'database-documentation').sourceRecordIds, ['ifc006-mf057-CE5.2.3'])
  assert.deepEqual(f.cases.find(c => c.id === 'access-documentation').sourceRecordIds, ['ifc006-mf057-p-access-documentation'])
})

test('la revisión MF057 identifica cada consigna leída y sus instrumentos locales revisados', () => {
  const path = 'docs/curriculum/cobertura-secundaria/technical-mf057-5-contratos-esperados.json'
  assert(existsSync(path), 'Falta la revisión de contratos MF057')
  const p = JSON.parse(readFileSync(path, 'utf8')), f = fixture()
  assert.equal(p.fixtureSha256, createHash('sha256').update(JSON.stringify(f)).digest('hex'))
  assert.equal(p.cases, 136); assert.equal(p.expectedTopicGroups, 115)
  assert.equal(p.sourceEvaluationCriteriaReferenced, 30); assert.equal(p.sourceProceduresReferenced, 59)
  assert.deepEqual(p.casesReviewed.map(c => c.id), f.cases.map(c => c.id))
  for (const [index, c] of f.cases.entries()) {
    assert.equal(p.casesReviewed[index].descriptionSha256, createHash('sha256').update(c.description).digest('hex'), c.id)
    assert.deepEqual(p.casesReviewed[index].sourceRecordIds, c.sourceRecordIds)
  }
  assert.equal(p.provider, 'packages/shared/src/secondary-technical.ts'); assert.equal(p.fullInstrumentsReviewed, 544); assert.equal(p.remoteWrites, false)
})
