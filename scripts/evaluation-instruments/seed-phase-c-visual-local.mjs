import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { createRequire } from 'node:module'

const databaseUrl = new URL(process.env.DATABASE_URL ?? 'http://missing')
assert(['localhost', '127.0.0.1'].includes(databaseUrl.hostname) && databaseUrl.port === '54332', 'Solo se permite PostgreSQL local 127.0.0.1:54332')
const email = process.env.PHASE_C_VISUAL_EMAIL?.trim().toLowerCase()
assert(email && email.includes('@'), 'PHASE_C_VISUAL_EMAIL es obligatorio')
const require = createRequire(new URL('../../apps/backend/package.json', import.meta.url))
const { prisma } = require('@aula/database')
const slug = 'phase-c-visual-qa'

try {
  const existing = await prisma.school.findUnique({ where: { slug } })
  assert(!existing || existing.name === 'Curso local de prueba Fase C', 'El identificador del centro de prueba pertenece a otro centro')
  const existingUser = await prisma.appUser.findUnique({ where: { email } })
  assert(!existingUser || existingUser.schoolId === existing?.id, 'El usuario ya pertenece a otro centro local')
  const [level, cycle, modality, adminRole] = await Promise.all([
    prisma.drAcademicLevel.findUniqueOrThrow({ where: { code: 'primario' } }),
    prisma.drAcademicCycle.findUniqueOrThrow({ where: { code: 'primario_segundo_ciclo' } }),
    prisma.drModality.findUniqueOrThrow({ where: { code: 'academic' } }),
    prisma.role.findUniqueOrThrow({ where: { key: 'admin' } }),
  ])
  if (!existing) await prisma.$transaction(async tx => {
    const authId = randomUUID()
    const schoolId = randomUUID()
    await tx.school.create({ data: { id: schoolId, name: 'Curso local de prueba Fase C', slug } })
    await tx.$executeRaw`INSERT INTO auth.users(id,email) VALUES (${authId}::uuid, ${email})`
    const user = await tx.appUser.create({ data: { schoolId, authUserId: authId, fullName: 'Docente de prueba Fase C', email } })
    await tx.userRole.create({ data: { userId: user.id, roleId: adminRole.id, schoolId } })
    const teacher = await tx.teacher.create({ data: { userId: user.id, schoolId, employeeCode: 'PHASE-C-VISUAL', firstName: 'Docente', lastName: 'Prueba' } })
    const year = await tx.schoolYear.create({ data: { schoolId, name: '2026-2027', startDate: new Date('2026-08-01'), endDate: new Date('2027-06-30'), isCurrent: true } })
    await tx.academicPeriod.create({ data: { schoolId, schoolYearId: year.id, name: 'P1', sequence: 1, startDate: new Date('2026-08-01'), endDate: new Date('2026-10-31') } })
    const grade = await tx.grade.create({ data: { schoolId, name: 'Quinto', sequence: 5, academicLevelId: level.id, academicCycleId: cycle.id, defaultModalityId: modality.id } })
    const section = await tx.section.create({ data: { schoolId, gradeId: grade.id, name: 'A' } })
    const subject = await tx.subject.create({ data: { schoolId, code: 'PRI-NAT', name: 'Ciencias de la Naturaleza' } })
    await tx.sectionSubject.create({ data: { schoolId, schoolYearId: year.id, gradeId: grade.id, sectionId: section.id, subjectId: subject.id, teacherId: teacher.id } })
  })
  const school = await prisma.school.findUniqueOrThrow({ where: { slug } })
  const studentCode = 'PHASE-C-VISUAL-STUDENT'
  const student = await prisma.student.findFirst({ where: { schoolId: school.id, studentCode } })
  if (!student) {
    const [year, grade, section] = await Promise.all([
      prisma.schoolYear.findFirstOrThrow({ where: { schoolId: school.id, name: '2026-2027' } }),
      prisma.grade.findFirstOrThrow({ where: { schoolId: school.id, name: 'Quinto' } }),
      prisma.section.findFirstOrThrow({ where: { schoolId: school.id, name: 'A' } }),
    ])
    await prisma.$transaction(async tx => {
      const created = await tx.student.create({ data: { schoolId: school.id, studentCode, firstName: 'Estudiante', lastName: 'Prueba', birthDate: new Date('2015-01-01') } })
      await tx.enrollment.create({ data: { schoolId: school.id, studentId: created.id, schoolYearId: year.id, gradeId: grade.id, sectionId: section.id, listNumber: 1 } })
    })
  }
  console.log('Centro, docente, asignatura y estudiante sintéticos listos en PostgreSQL local para revisión visual de Fase C.')
} finally {
  await prisma.$disconnect()
}
