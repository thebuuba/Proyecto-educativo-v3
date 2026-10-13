import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { createRequire } from 'node:module'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { localEnvironment } from './dev-local-environment.mjs'

const cli = process.env.npm_execpath
assert(cli, 'Ejecutar mediante pnpm dev:local:seed.')
const status = spawnSync(process.execPath, [cli, 'exec', 'supabase', 'status', '--output', 'json'], { encoding: 'utf8' })
assert.equal(status.status, 0, 'Supabase local debe estar iniciado.')
const local = JSON.parse(status.stdout)
Object.assign(process.env, localEnvironment(local, 'seed-local-only'))
const require = createRequire(new URL('../apps/backend/package.json', import.meta.url))
const { prisma } = require('@aula/database')
const { synchronizeCurriculumMappings } = require('./dist/modules/evaluation-instruments/catalog-operations.js')
const file = '.dev-qa-account.local'
const account = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8'))
  : { email: 'docente.secundaria@example.invalid', password: randomBytes(24).toString('base64url') }
assert.equal(account.email, 'docente.secundaria@example.invalid')
try {
  const slug = 'qa-secundaria-local'
  const previous = await prisma.school.findUnique({ where: { slug } })
  assert(!previous || previous.name === 'Centro ficticio QA Secundaria', 'Identidad de centro inesperada.')
  const school = previous ?? await prisma.school.create({ data: { slug, name: 'Centro ficticio QA Secundaria' } })
  let user = await prisma.appUser.findUnique({ where: { email: account.email } })
  assert(!user || user.schoolId === school.id, 'La identidad QA pertenece a otro centro.')
  if (!user) {
    const response = await fetch(`${local.API_URL}/auth/v1/admin/users`, {
      method: 'POST', headers: { apikey: local.SERVICE_ROLE_KEY, Authorization: `Bearer ${local.SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...account, email_confirm: true }),
    })
    assert(response.ok, `No se pudo crear Auth local: ${response.status}`)
    const identity = await response.json()
    user = await prisma.appUser.create({ data: { authUserId: identity.id, email: account.email, schoolId: school.id, fullName: 'Docente ficticio de Secundaria' } })
    writeFileSync(file, JSON.stringify(account, null, 2) + '\n', { mode: 0o600 })
  }
  const role = await prisma.role.findUniqueOrThrow({ where: { key: 'teacher' } })
  await prisma.userRole.upsert({ where: { userId_roleId: { userId: user.id, roleId: role.id } }, create: { userId: user.id, roleId: role.id, schoolId: school.id }, update: {} })
  const teacher = await prisma.teacher.findFirst({ where: { userId: user.id, schoolId: school.id } })
    ?? await prisma.teacher.create({ data: { userId: user.id, schoolId: school.id, employeeCode: 'QA-SEC-LOCAL', firstName: 'Docente', lastName: 'Ficticio' } })
  const year = await prisma.schoolYear.upsert({ where: { schoolId_name: { schoolId: school.id, name: 'QA 2026-2027' } }, update: {},
    create: { schoolId: school.id, name: 'QA 2026-2027', startDate: new Date('2026-08-01'), endDate: new Date('2027-07-31'), isCurrent: true } })
  const period = await prisma.academicPeriod.findFirst({ where: { schoolId: school.id, schoolYearId: year.id } })
    ?? await prisma.academicPeriod.create({ data: { schoolId: school.id, schoolYearId: year.id, name: 'QA P1', sequence: 1, startDate: year.startDate, endDate: year.endDate } })
  const records = readFileSync('data/curriculum/secondary-2023.jsonl', 'utf8').trim().split('\n').map(line => JSON.parse(line))
  const scopes = records.filter(row => row.kind === 'scope' && row.grade)
  const subjects = [['LEN', 'Lengua Española'], ['MAT', 'Matemática'], ['SOC', 'Ciencias Sociales'], ['ING', 'Lenguas extranjeras: Inglés'], ['FRA', 'Lenguas extranjeras: Francés'], ['ART', 'Educación Artística'], ['EFI', 'Educación Física'], ['FHR', 'Formación Integral Humana y Religiosa']]
  const science = ['NAT-TU', 'NAT-VIDA', 'NAT-FISICAS', 'NAT-BIO', 'NAT-QUI', 'NAT-FIS']
  const assignments = []
  for (let sequence = 1; sequence <= 6; sequence++) {
    const level = await prisma.drAcademicLevel.findUniqueOrThrow({ where: { code: 'secundario' } })
    const cycle = await prisma.drAcademicCycle.findUniqueOrThrow({ where: { code: sequence <= 3 ? 'secundario_primer_ciclo' : 'secundario_segundo_ciclo' } })
    const modality = await prisma.drModality.findUniqueOrThrow({ where: { code: 'academic' } })
    const grade = await prisma.grade.findFirst({ where: { schoolId: school.id, sequence } })
      ?? await prisma.grade.create({ data: { schoolId: school.id, name: `${sequence}.º secundaria QA`, sequence, level: 'Secundario', academicLevelId: level.id, academicCycleId: cycle.id, defaultModalityId: modality.id } })
    const section = await prisma.section.findFirst({ where: { schoolId: school.id, gradeId: grade.id } })
      ?? await prisma.section.create({ data: { schoolId: school.id, gradeId: grade.id, name: 'QA' } })
    for (const [code, name] of [...subjects, [science[sequence - 1], 'Ciencias de la Naturaleza']]) {
      const subject = await prisma.subject.findFirst({ where: { schoolId: school.id, code } })
        ?? await prisma.subject.create({ data: { schoolId: school.id, code, name } })
      const assignment = await prisma.sectionSubject.findFirst({ where: { schoolId: school.id, schoolYearId: year.id, sectionId: section.id, subjectId: subject.id } })
        ?? await prisma.sectionSubject.create({ data: { schoolId: school.id, schoolYearId: year.id, gradeId: grade.id, sectionId: section.id, subjectId: subject.id, teacherId: teacher.id } })
      assignments.push({ grade: sequence, code, id: assignment.id })
    }
  }
  const mappings = await synchronizeCurriculumMappings(prisma, school.id, [records[0].id])
  assert.equal(assignments.length, 54)
  assert(mappings.every(row => row.scopeId), 'Faltan ámbitos curriculares para asignaturas comunes QA.')
  assert.equal(scopes.length, 72, 'Inventario de ámbitos por grado inesperado.')
  writeFileSync('.dev-qa-context.local', JSON.stringify({ schoolId: school.id, periodId: period.id, versionId: records[0].id, assignments }, null, 2) + '\n')
  console.log('54 asignaciones comunes QA listas. Credenciales locales en .dev-qa-account.local; contexto en .dev-qa-context.local. No se han copiado datos remotos. Optativas pendientes de incorporar a este centro.')
} finally { await prisma.$disconnect() }
