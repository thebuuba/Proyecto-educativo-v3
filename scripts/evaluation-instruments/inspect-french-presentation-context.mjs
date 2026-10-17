import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { parseEnv } from 'node:util'
import { createRequire } from 'node:module'
import { developmentEnvironment, developmentProjectRef } from '../cloudflare-development-environment.mjs'
Object.assign(process.env, developmentEnvironment(parseEnv(readFileSync('.dev.vars.local', 'utf8'))))
const require = createRequire(new URL('../../apps/backend/package.json', import.meta.url))
const { prisma } = require('@aula/database')
const email = process.argv[2]
assert(email && email.includes('@'), 'Provide the exact account confirmed by the user; never infer it')
try {
  const user = await prisma.appUser.findUniqueOrThrow({ where: { email }, select: { id: true, schoolId: true, status: true, userRoles: { where: { status: 'ACTIVE' }, select: { schoolId: true, role: { select: { key: true, status: true } } } } } })
  const roles = user.userRoles.filter(r => r.schoolId === user.schoolId && r.role.status === 'ACTIVE').map(r => r.role.key)
  const manager = roles.some(r => ['admin', 'director', 'coordinator'].includes(r))
  const rows = await prisma.sectionSubject.findMany({ where: { schoolId: user.schoolId, status: 'ACTIVE', subject: { code: 'FRA' }, ...(manager ? {} : { teacher: { userId: user.id, schoolId: user.schoolId, status: 'ACTIVE' } }) }, select: { id: true, grade: { select: { sequence: true, status: true, academicLevel: { select: { code: true } }, academicCycle: { select: { code: true } } } }, subject: { select: { code: true, status: true } }, section: { select: { status: true } }, schoolYear: { select: { status: true } } } })
  const qa = JSON.parse(readFileSync('.wrangler/french-source/grade-1-context.json', 'utf8'))
  assert.equal(qa.project, developmentProjectRef)
  const report = { project: developmentProjectRef, personal: { active: user.status === 'ACTIVE', roles, frenchContexts: rows.map(r => ({ grade: r.grade.sequence, level: r.grade.academicLevel?.code, cycle: r.grade.academicCycle?.code, subject: r.subject.code, active: [r.grade, r.subject, r.section, r.schoolYear].every(x => x.status === 'ACTIVE') })) }, qa: { grade: qa.grade, subject: qa.subjectCode }, sameSchool: qa.schoolId === user.schoolId, browserPersonalSession: 'NOT_ACCESSED', mode: 'READ_ONLY' }
  writeFileSync('.wrangler/french-source/presentation-account-context.json', JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify(report))
} finally { await prisma.$disconnect() }
