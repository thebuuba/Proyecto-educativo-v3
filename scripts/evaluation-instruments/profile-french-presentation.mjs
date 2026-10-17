import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { parseEnv } from 'node:util'
import { createRequire } from 'node:module'
import { performance } from 'node:perf_hooks'
import { developmentEnvironment, developmentProjectRef } from '../cloudflare-development-environment.mjs'

// Read-only diagnostics. Never log credentials, query arguments, cookies or personal records.
Object.assign(process.env, developmentEnvironment(parseEnv(readFileSync('.dev.vars.local', 'utf8'))))
const require = createRequire(new URL('../../apps/backend/package.json', import.meta.url))
require('reflect-metadata')
const { prisma } = require('@aula/database')
const { EvaluationInstrumentsService } = require('../../apps/backend/dist/modules/evaluation-instruments/evaluation-instruments.service.js')
const engine = require('../../apps/backend/dist/modules/evaluation-instruments/recommendation-engine.js')
const { evaluationCatalogCurrent } = require('../../apps/backend/dist/modules/evaluation-instruments/catalog-current.js')
const { detectTeachingStrategy } = require('../../apps/backend/node_modules/@aula/shared')
const context = JSON.parse(readFileSync('.wrangler/french-source/grade-1-context.json', 'utf8'))
assert.equal(context.project, developmentProjectRef)
const qa = JSON.parse(readFileSync('.development-qa-account.local', 'utf8'))
const { title, description } = JSON.parse(readFileSync('data/evaluation-instruments/french-presentation-case.json', 'utf8'))
const phase = process.argv[2] ?? 'before'
assert(['before', 'after'].includes(phase))
const measured = [], calls = []
let cookie
const http = async (path, input) => {
  const start = performance.now()
  const response = await fetch('http://localhost:8787/api/v1' + path, { method: input ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json', ...(cookie ? { cookie } : {}) }, ...(input ? { body: JSON.stringify(input) } : {}), signal: AbortSignal.timeout(60000) })
  const body = await response.json()
  measured.push({ mode: 'HTTP_TOTAL_INCLUDES_NETWORK_AUTH_DB_CPU', path, ms: Math.round(performance.now() - start), status: response.status })
  assert(response.ok, `${path}: HTTP ${response.status}`)
  return { data: body.data, response }
}
try {
  const login = await http('/auth/login', { email: qa.email, password: qa.password })
  cookie = login.response.headers.getSetCookie().find(v => v.startsWith('aulabase_session='))?.split(';')[0]
  assert(cookie)
  const user = await prisma.appUser.findUniqueOrThrow({ where: { id: context.userId }, include: { userRoles: { include: { role: true } } } })
  assert.equal(user.schoolId, context.schoolId)
  const principal = { id: user.id, schoolId: user.schoolId, email: user.email, roles: user.userRoles.filter(r => r.schoolId === user.schoolId && r.status === 'ACTIVE' && r.role.status === 'ACTIVE').map(r => r.role.key) }
  // Instrument existing Prisma methods only in this standalone process; SQL/data are never printed.
  const wrap = (object, method, stage) => {
    const original = object[method].bind(object)
    object[method] = async (...args) => { const start = performance.now(); try { return await original(...args) } finally { calls.push({ stage, ms: Math.round(performance.now() - start) }) } }
  }
  wrap(globalThis.prisma, '$queryRaw', 'catalog-jsonb-validation')
  const compose = engine.recommend
  engine.recommend = (...args) => { const start = performance.now(); try { return compose(...args) } finally { calls.push({ stage: 'composition-cpu', ms: Math.round(performance.now() - start) }) } }
  for (const [model, method, stage] of [['sectionSubject', 'findFirst', 'authorized-context'], ['curriculumVersion', 'findFirst', 'version-first'], ['curriculumVersion', 'findMany', 'version-compatible'], ['curriculumScope', 'findMany', 'scopes'], ['curriculumSubjectMapping', 'findMany', 'mappings'], ['curriculumElement', 'findMany', 'elements-and-source-spans']]) wrap(prisma[model], method, stage)
  const service = new EvaluationInstrumentsService()
  const input = { sectionSubjectId: context.sectionSubjectId, activityTitle: title, description, competencyBlock: 'b1', participationMode: 'GROUP', maxScore: 20 }
  const instruments = []
  for (let pass = 0; pass < 2; pass++) {
    for (const action of ['interpret', 'recommend']) {
      const start = performance.now(), first = calls.length
      const result = await service[action](principal, input)
      measured.push({ mode: 'DIRECT_SERVICE_DB_ROUNDTRIPS_INCLUDED', pass, action, ms: Math.round(performance.now() - start), stages: calls.slice(first) })
      if (action === 'recommend') instruments.push(result)
      await http('/evaluation-instruments/' + action, action === 'interpret' ? { sectionSubjectId: input.sectionSubjectId, activityTitle: title, description, competencyBlock: 'b1' } : input)
    }
  }
  const report = { phase, project: developmentProjectRef, catalog: evaluationCatalogCurrent.version, title, description, strategy: detectTeachingStrategy({ title, description, level: 'SECONDARY', grade: 1, subjectCode: 'FRA' }), measured, instruments, browser: 'NOT_MEASURED', note: 'HTTP totals and direct-service runs have different conditions. DB durations include pool/network/SQL/serialization; they are not pure SQL times. No subtraction between runs.' }
  writeFileSync(`.wrangler/french-source/presentation-${phase}.json`, JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify({ phase, project: report.project, catalog: report.catalog, strategy: report.strategy.id, measured }))
} finally { await prisma.$disconnect() }
