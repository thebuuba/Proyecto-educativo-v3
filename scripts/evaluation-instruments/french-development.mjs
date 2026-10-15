import assert from 'node:assert/strict'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { parseEnv } from 'node:util'
import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'
import { developmentEnvironment, developmentProjectRef } from '../cloudflare-development-environment.mjs'

// Credentials remain in ignored local files; no environment, cookies or login responses are logged.
Object.assign(process.env, developmentEnvironment(parseEnv(readFileSync('.dev.vars.local', 'utf8'))))
const require = createRequire(new URL('../../apps/backend/package.json', import.meta.url))
const { prisma } = require('@aula/database')
const { evaluationCatalogCurrent, evaluationCatalogForVersion } = require('../../apps/backend/dist/modules/evaluation-instruments/catalog-current.js')
const { seedEvaluationCatalog } = require('../../apps/backend/dist/modules/evaluation-instruments/catalog-operations.js')
const { canonicalJson } = require('../../apps/backend/dist/modules/evaluation-instruments/evaluation-instruments.service.js')
const qa = JSON.parse(readFileSync('.development-qa-context.local', 'utf8'))
assert.equal(qa.project, developmentProjectRef)
assert.equal(qa.schoolId, 'bc96bc29-98f2-4e80-84d9-506126e20a4c')
const gradeNumber = Number(process.argv[3] ?? 1)
assert(evaluationCatalogCurrent.frenchModules?.some(module => module.grade === gradeNumber), 'Grade not connected in this build')
const output = '.wrangler/french-source'
mkdirSync(output, { recursive: true })
const hash = value => createHash('sha256').update(canonicalJson(value)).digest('hex')
try {
  const school = await prisma.school.findUniqueOrThrow({ where: { id: qa.schoolId } })
  assert.match(school.name, /ficticio QA Development/)
  const user = await prisma.appUser.findUniqueOrThrow({ where: { id: qa.userId } })
  assert.equal(user.schoolId, qa.schoolId)
  if (process.argv[2] === 'install') {
    const before = await prisma.evaluationCatalogRelease.findMany({ select: { version: true, payload: true } })
    for (const release of before) {
      const source = evaluationCatalogForVersion(release.version)
      if (release.version === 'evaluation-2026.69') assert.equal(hash(source), hash(release.payload), 'Historical .69 differs from installed payload')
    }
    const first = await seedEvaluationCatalog(prisma)
    const second = await seedEvaluationCatalog(prisma)
    assert.equal(second, 'UNCHANGED')
    const after = await prisma.evaluationCatalogRelease.findMany({ select: { version: true, payload: true } })
    for (const release of before) assert.equal(hash(after.find(r => r.version === release.version)?.payload), hash(release.payload), 'Historical release changed')
    const result = { project: developmentProjectRef, catalog: evaluationCatalogCurrent.version, first, second, preservedReleases: before.length }
    writeFileSync(`${output}/grade-${gradeNumber}-catalog.json`, JSON.stringify(result, null, 2) + '\n')
    console.log(JSON.stringify(result))
  } else if (process.argv[2] === 'context') {
    const schoolId = qa.schoolId
    const level = await prisma.drAcademicLevel.findUniqueOrThrow({ where: { code: 'secundario' } })
    const cycle = await prisma.drAcademicCycle.findUniqueOrThrow({ where: { code: gradeNumber <= 3 ? 'secundario_primer_ciclo' : 'secundario_segundo_ciclo' } })
    const modality = await prisma.drModality.findUniqueOrThrow({ where: { code: 'academic' } })
    const name = `${gradeNumber}.º secundaria QA Francés Development`
    const grade = await prisma.grade.findFirst({ where: { schoolId, name } }) ?? await prisma.grade.create({ data: { schoolId, name, sequence: gradeNumber, level: 'Secundario', academicLevelId: level.id, academicCycleId: cycle.id, defaultModalityId: modality.id } })
    assert.equal(grade.sequence, gradeNumber)
    const section = await prisma.section.findFirst({ where: { schoolId, gradeId: grade.id, name: 'QA Francés' } }) ?? await prisma.section.create({ data: { schoolId, gradeId: grade.id, name: 'QA Francés' } })
    const subject = await prisma.subject.findFirst({ where: { schoolId, code: 'FRA' } }) ?? await prisma.subject.create({ data: { schoolId, code: 'FRA', name: 'Francés' } })
    const assignment = await prisma.sectionSubject.findFirst({ where: { schoolId, schoolYearId: qa.schoolYearId, sectionId: section.id, subjectId: subject.id } }) ?? await prisma.sectionSubject.create({ data: { schoolId, schoolYearId: qa.schoolYearId, gradeId: grade.id, sectionId: section.id, subjectId: subject.id } })
    const context = { ...qa, grade: gradeNumber, subjectCode: 'FRA', gradeId: grade.id, sectionId: section.id, subjectId: subject.id, sectionSubjectId: assignment.id }
    writeFileSync(`${output}/grade-${gradeNumber}-context.json`, JSON.stringify(context, null, 2) + '\n')
    console.log(JSON.stringify({ project: developmentProjectRef, schoolId, grade: gradeNumber, subject: 'FRA', sectionSubjectId: assignment.id }))
  } else throw Error('Specify install or context; no other operation is permitted.')
} finally { await prisma.$disconnect() }
