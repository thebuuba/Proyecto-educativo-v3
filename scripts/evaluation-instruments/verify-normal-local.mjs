import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'

const base = 'http://localhost:5173/api/v1'
const account = JSON.parse(readFileSync('.dev-qa-account.local', 'utf8'))
const context = JSON.parse(readFileSync('.dev-qa-context.local', 'utf8'))
const health = await fetch(base + '/health').then(response => response.json())
assert.equal(health.data.development.supabaseOrigin, 'http://127.0.0.1:54321')
const login = await fetch(base + '/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(account) })
assert.equal(login.status, 201, 'Login normal local falló.')
const cookie = login.headers.getSetCookie().find(value => value.startsWith('aulabase_session='))?.split(';')[0]
assert(cookie, 'No se recibió cookie de sesión real.')
const request = async (path, input) => {
  const response = await fetch(base + path, { method: 'POST', headers: { cookie, 'Content-Type': 'application/json' }, body: JSON.stringify(input) })
  assert.equal(response.status, 200, `${path}: ${response.status}`)
  return (await response.json()).data
}
const results = []
const fixtures = JSON.parse(readFileSync('data/evaluation-instruments/science-regressions.json', 'utf8'))
for (const fixture of fixtures) for (const neutral of [false, true]) {
  const sectionSubjectId = context.assignments.find(row => row.grade === fixture.grade && row.code === fixture.code).id
  const activityTitle = neutral ? 'Actividad de aprendizaje' : fixture.activityTitle
  const input = { sectionSubjectId, activityTitle, description: fixture.description }
  const interpretation = await request('/evaluation-instruments/interpret', input)
  assert.equal(interpretation.curriculumVersionId, context.versionId)
  assert.equal(interpretation.activityType, fixture.expectedType)
  for (const maxScore of [20, 17.35]) for (const preferredInstrumentType of ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada']) {
    const proposal = await request('/evaluation-instruments/recommend', { ...input, curriculumVersionId: interpretation.curriculumVersionId,
      participationMode: 'INDIVIDUAL', pedagogicalActivityType: interpretation.activityType, maxScore, preferredInstrumentType })
    assert.equal(proposal.catalogVersion, 'evaluation-2026.10')
    assert.equal(proposal.instrumentType, preferredInstrumentType)
    assert.equal(proposal.totalScoreUnits, Math.round(maxScore * 100))
    assert(proposal.criteria.every(row => row.templateId.startsWith(`science-${fixture.id}-`)), 'Se recibieron criterios ajenos al módulo.')
    results.push({ fixture: fixture.id, neutral, maxScore, interpretation, proposal })
  }
}
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/entorno-normal-local.json', JSON.stringify({ health: health.data, authentication: 'PASSWORD_LOGIN_REAL', proxy: base, results }, null, 2) + '\n')
console.log(`${results.length} instrumentos específicos comprobados mediante frontend 5173 → backend 3000 → Supabase local. Sin alternativa 503 ni sesión sintética.`)
