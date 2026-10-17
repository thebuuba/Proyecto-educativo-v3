import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { parseEnv } from 'node:util'
import { createRequire } from 'node:module'
import { developmentEnvironment, developmentProjectRef } from '../cloudflare-development-environment.mjs'
Object.assign(process.env, developmentEnvironment(parseEnv(readFileSync('.dev.vars.local', 'utf8'))))
const require = createRequire(new URL('../../apps/backend/package.json', import.meta.url))
const { prisma } = require('@aula/database')
const file = '.wrangler/french-source/presentation-regression-http-progress.json'
const progress = JSON.parse(readFileSync(file, 'utf8'))
const context = JSON.parse(readFileSync('.wrangler/french-source/grade-1-context.json', 'utf8'))
assert.equal(context.project, developmentProjectRef)
assert.equal(progress.grade, 1)
try {
  for (const write of progress.writes.filter(w => !w.verified)) {
    // The API uses creationId as activity id. Never retry a write of uncertain outcome blindly.
    const row = await prisma.evaluationActivity.findUnique({ where: { id: write.creationId }, select: { id: true, schoolId: true, sectionSubjectId: true } })
    assert.equal(row, null, 'A row exists: reconcile its instrument through SQL and HTTP instead of creating another')
    const sameName = await prisma.evaluationActivity.count({ where: { schoolId: context.schoolId, sectionSubjectId: context.sectionSubjectId, name: write.name } })
    assert.equal(sameName, 0, 'A row with the planned QA name exists; inspect it before retrying')
    write.confirmedAbsent = { at: new Date().toISOString(), evidence: 'READ_ONLY_SQL_ID_AND_SCOPED_NAME_ABSENT', priorFailure: 'HTTP_500_TRANSACTION_EXPIRED' }
    console.log(JSON.stringify({ project: developmentProjectRef, type: write.type, creationId: write.creationId, result: 'NOT_COMMITTED_REUSE_SAME_CREATION_ID' }))
  }
  writeFileSync(file, JSON.stringify(progress, null, 2) + '\n')
} finally { await prisma.$disconnect() }
