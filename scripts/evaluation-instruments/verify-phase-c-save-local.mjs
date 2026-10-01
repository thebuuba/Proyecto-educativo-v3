import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { createRequire } from 'node:module'

const url = new URL(process.env.DATABASE_URL ?? 'http://missing')
assert(['localhost', '127.0.0.1'].includes(url.hostname) && url.port === '54332', 'Solo se permite la base local del proyecto')
const require = createRequire(new URL('../../apps/backend/package.json', import.meta.url))
const { prisma } = require('@aula/database')
const { GradingService } = require('./dist/modules/grading/grading.service.js')
const { recommend } = require('./dist/modules/evaluation-instruments/recommendation-engine.js')
const { EvaluationInstrumentsService } = require('./dist/modules/evaluation-instruments/evaluation-instruments.service.js')
const schoolId = randomUUID()
const authId = randomUUID()
let userId
let activityId
let instrumentId
let snapshotId
const savedIds = { activities: [], instruments: [], snapshots: [] }
function fieldsFor(proposal) {
  const fields = { [`${proposal.instrumentType}:meta:criteriaCount`]: String(proposal.criteria.length) }
  if (['rubrica', 'escala'].includes(proposal.instrumentType)) {
    fields[`${proposal.instrumentType}:meta:levelCount`] = String(proposal.levels.length)
    proposal.levels.forEach((level, index) => {
      const number = proposal.levels.length - index
      fields[`${proposal.instrumentType}:level-name:${number}`] = level.label
      fields[`${proposal.instrumentType}:level-points:${number}`] = String(number - 1)
    })
  }
  if (proposal.instrumentType === 'lista-cotejo') fields['lista-cotejo:meta:pointsMode'] = 'individual'
  proposal.criteria.forEach((criterion, index) => {
    fields[`${proposal.instrumentType}:criterion:${index}`] = criterion.title
    fields[`${proposal.instrumentType}:points:${index}`] = String(criterion.maxScore)
    fields[`${proposal.instrumentType}:description:${index}`] = criterion.description
    if (proposal.instrumentType === 'lista-ponderada') {
      fields[`lista-ponderada:indicator:${index}`] = criterion.description
      fields[`lista-ponderada:weight:${index}`] = String(Math.round(criterion.maxScoreUnits / proposal.totalScoreUnits * 10000) / 100)
    }
    criterion.descriptors.forEach((descriptor, levelIndex) => {
      fields[`rubrica:descriptor:${index}:${proposal.levels.length - levelIndex}`] = descriptor.text
    })
  })
  if (proposal.instrumentType === 'lista-ponderada') {
    const total = proposal.criteria.reduce((sum, _, index) => sum + Number(fields[`lista-ponderada:weight:${index}`]), 0)
    const last = proposal.criteria.length - 1
    fields[`lista-ponderada:weight:${last}`] = String(Number(fields[`lista-ponderada:weight:${last}`]) + 100 - total)
  }
  return fields
}
try {
  const level = await prisma.drAcademicLevel.findUniqueOrThrow({ where: { code: 'primario' } })
  const cycle = await prisma.drAcademicCycle.findUniqueOrThrow({ where: { code: 'primario_segundo_ciclo' } })
  const modality = await prisma.drModality.findUniqueOrThrow({ where: { code: 'academic' } })
  await prisma.school.create({ data: { id: schoolId, name: 'Fixture temporal C', slug: `phase-c-${schoolId}` } })
  await prisma.$executeRaw`INSERT INTO auth.users(id,email) VALUES (${authId}::uuid, ${`${schoolId}@example.invalid`})`
  const user = await prisma.appUser.create({ data: { schoolId, authUserId: authId, fullName: 'Docente C', email: `${schoolId}@example.invalid` } })
  userId = user.id
  const teacher = await prisma.teacher.create({ data: { userId, schoolId, employeeCode: `phase-c-${schoolId.slice(0, 8)}`, firstName: 'Docente', lastName: 'Temporal' } })
  const year = await prisma.schoolYear.create({ data: { schoolId, name: '2026-2027', startDate: new Date('2026-08-01'), endDate: new Date('2027-06-30') } })
  const period = await prisma.academicPeriod.create({ data: { schoolId, schoolYearId: year.id, name: 'P1', sequence: 1, startDate: new Date('2026-08-01'), endDate: new Date('2026-10-31') } })
  const grade = await prisma.grade.create({ data: { schoolId, name: 'Quinto', sequence: 5, academicLevelId: level.id, academicCycleId: cycle.id, defaultModalityId: modality.id } })
  const section = await prisma.section.create({ data: { schoolId, gradeId: grade.id, name: 'A' } })
  const subject = await prisma.subject.create({ data: { schoolId, code: 'PRI-NAT', name: 'Ciencias de la Naturaleza' } })
  const assignment = await prisma.sectionSubject.create({ data: { schoolId, schoolYearId: year.id, gradeId: grade.id, sectionId: section.id, subjectId: subject.id, teacherId: teacher.id } })
  const proposal = recommend({ activityTitle: 'Exposición sobre el sistema respiratorio', description: 'Explicar el funcionamiento observado',
    participationMode: 'INDIVIDUAL', maxScore: 20 }, null, null, [], 'NO_PUBLISHED_VERSION', null)
  assert.equal(proposal.confidence, 'LOW')
  const fields = fieldsFor(proposal)
  const activity = await new GradingService().saveActivity(schoolId, userId, { sectionSubjectId: assignment.id,
    academicPeriodId: period.id, competencyBlockId: 'b4', competencyBlockWeights: { b4: 1 },
    name: 'Exposición sobre el sistema respiratorio', description: 'Explicar el funcionamiento observado',
    maxScore: 20, activityType: 'individual', planningMoment: 'desarrollo', evaluationTechnique: 'exposicion',
    resources: ['Cartel'], instrumentType: proposal.instrumentType, instrumentCriteria: fields,
    pedagogicalActivityType: proposal.activityType, instrumentSnapshot: proposal }, ['teacher'])
  activityId = activity.id; instrumentId = activity.instrumentId; snapshotId = activity.instrumentSnapshotId
  savedIds.activities.push(activityId); savedIds.instruments.push(instrumentId); savedIds.snapshots.push(snapshotId)
  assert(activityId && instrumentId && snapshotId)
  assert.equal(activity.instrumentSnapshot.totalScoreUnits, 2000)
  assert.equal(activity.resources[0], 'Cartel')
  assert.equal(activity.competencyBlockWeights.b4, 1)
  assert.equal(activity.planningMoment, 'desarrollo')
  assert.equal(activity.activityType, 'individual')
  const [saved, preference] = await Promise.all([
    prisma.evaluationActivity.findUniqueOrThrow({ where: { id: activityId }, include: { instrumentSnapshot: true } }),
    prisma.teacherInstrumentPreference.findFirstOrThrow({ where: { schoolId, teacherId: userId } }),
  ])
  assert.equal(saved.instrumentId, instrumentId)
  assert.equal(saved.instrumentSnapshotId, snapshotId)
  assert.equal(saved.instrumentSnapshot.payload.totalScoreUnits, 2000)
  assert.equal(preference.acceptedInstrumentId, instrumentId)
  const version = await prisma.curriculumVersion.findUniqueOrThrow({ where: { code: 'MINERD_PRIMARIA_2023' } })
  const scope = await prisma.curriculumScope.findFirstOrThrow({ where: { versionId: version.id, grade: 5, cycle: 2,
    subjectName: { contains: 'Ciencias de la Naturaleza', mode: 'insensitive' } } })
  const element = await prisma.curriculumElement.findFirstOrThrow({ where: { scopeId: scope.id, elementType: 'CONCEPT' } })
  const cited = await new EvaluationInstrumentsService().recommend({ id: userId, schoolId, roles: ['teacher'], email: user.email }, {
    sectionSubjectId: assignment.id, activityTitle: 'Presentación de ciencias', participationMode: 'INDIVIDUAL', maxScore: 20,
    curriculumVersionId: version.id, preferredInstrumentType: 'rubrica', selectedCurriculumElementIds: [element.id],
  })
  assert.equal(cited.selectedCurriculumElements[0].elementId, element.id)
  const citedActivity = await new GradingService().saveActivity(schoolId, userId, { sectionSubjectId: assignment.id,
    academicPeriodId: period.id, competencyBlockId: 'b4', name: 'Presentación de ciencias', maxScore: 20,
    activityType: 'individual', instrumentType: cited.instrumentType, instrumentCriteria: fieldsFor(cited),
    pedagogicalActivityType: cited.activityType, instrumentSnapshot: cited }, ['teacher'])
  savedIds.activities.push(citedActivity.id); savedIds.instruments.push(citedActivity.instrumentId); savedIds.snapshots.push(citedActivity.instrumentSnapshotId)
  assert.equal(await prisma.evaluationSnapshotSource.count({ where: { snapshotId: citedActivity.instrumentSnapshotId, elementId: element.id } }), 1)
  assert.notEqual(citedActivity.instrumentId, instrumentId)
  for (const instrumentType of ['lista-cotejo', 'escala', 'lista-ponderada']) {
    const generated = recommend({ activityTitle: `Actividad ${instrumentType}`, participationMode: instrumentType === 'escala' ? 'GROUP' : 'INDIVIDUAL',
      preferredInstrumentType: instrumentType, maxScore: 20 }, null, null, [], 'NO_PUBLISHED_VERSION', null)
    const created = await new GradingService().saveActivity(schoolId, userId, { sectionSubjectId: assignment.id,
      academicPeriodId: period.id, competencyBlockId: 'b4', name: `Actividad ${instrumentType}`, maxScore: 20,
      activityType: instrumentType === 'escala' ? 'group' : 'individual', instrumentType, instrumentCriteria: fieldsFor(generated),
      pedagogicalActivityType: generated.activityType, instrumentSnapshot: generated }, ['teacher'])
    savedIds.activities.push(created.id); savedIds.instruments.push(created.instrumentId); savedIds.snapshots.push(created.instrumentSnapshotId)
    assert.equal(created.instrumentType, instrumentType)
    if (instrumentType === 'escala') assert.equal(created.activityType, 'group')
  }
  await assert.rejects(new GradingService().saveActivity(schoolId, userId, { id: activityId,
    sectionSubjectId: assignment.id, academicPeriodId: period.id, competencyBlockId: 'b4',
    name: 'Título cambiado', maxScore: 20 }), /versionado/)
  console.log('Fase C guardado local: cuatro tipos de instrumento, cinco instrumentos exclusivos, referencia literal, snapshots, preferencia, puntos, recursos, competencia, momento, modalidades y bloqueo PASS.')
} finally {
  // Solo la escuela temporal de esta ejecución; no afecta datos preexistentes.
  await prisma.$transaction(async tx => {
    await tx.teacherInstrumentPreference.deleteMany({ where: { schoolId } })
    if (savedIds.activities.length) await tx.evaluationActivity.deleteMany({ where: { id: { in: savedIds.activities }, schoolId } })
    if (savedIds.snapshots.length) await tx.evaluationSnapshotSource.deleteMany({ where: { snapshotId: { in: savedIds.snapshots } } })
    if (savedIds.snapshots.length) await tx.evaluationInstrumentSnapshot.deleteMany({ where: { id: { in: savedIds.snapshots }, schoolId } })
    if (savedIds.instruments.length) await tx.evaluationInstrument.deleteMany({ where: { id: { in: savedIds.instruments }, schoolId } })
    await tx.sectionSubject.deleteMany({ where: { schoolId } })
    await tx.subject.deleteMany({ where: { schoolId } })
    await tx.section.deleteMany({ where: { schoolId } })
    await tx.grade.deleteMany({ where: { schoolId } })
    await tx.teacher.deleteMany({ where: { schoolId } })
    if (userId) await tx.appUser.deleteMany({ where: { id: userId, schoolId } })
    await tx.$executeRaw`DELETE FROM auth.users WHERE id=${authId}::uuid AND email=${`${schoolId}@example.invalid`}`
    await tx.academicPeriod.deleteMany({ where: { schoolId } })
    await tx.schoolYear.deleteMany({ where: { schoolId } })
    await tx.school.deleteMany({ where: { id: schoolId, slug: `phase-c-${schoolId}` } })
  })
  await prisma.$disconnect()
}
