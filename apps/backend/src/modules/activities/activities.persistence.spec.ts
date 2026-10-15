import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ActivitiesController } from './activities.controller'
import { ActivitiesService } from './activities.service'
import { GradingService } from '../grading/grading.service'
import { GradingController } from '../grading/grading.controller'
import type { SaveActivityDto } from './dto/save-activity.dto'
import { recommend } from '../evaluation-instruments/recommendation-engine'

// Only the database boundary is replaced; controllers, permissions and persistence execute normally.
const db = vi.hoisted(() => ({ prisma: {} as any, state: {} as any, failTeams: false, transactions: 0 }))
vi.mock('@aula/database', () => ({ prisma: db.prisma, Prisma: { DbNull: null } }))

const user = { id: 'user-1', schoolId: 'school-1', roles: ['teacher'] } as any
const dto: SaveActivityDto = { sectionSubjectId: 'ss-1', academicPeriodId: 'period-1',
  competencyBlockId: 'b1', name: 'Proyecto', maxScore: 20, instrumentType: 'lista-cotejo',
  instrumentCriteria: { 'lista-cotejo:criterion:0': 'Explica', 'lista-cotejo:points:0': '20' } }
const creationId = '8fcb31dd-0a54-4d68-a8db-9fe2a2e69cf'
const planningId = '8fcb31dd-0a54-4d68-a8db-09fe2a2e69ca'

function matches(row: any, where: any): boolean {
  return Object.entries(where ?? {}).every(([key, value]: [string, any]) => {
    if (value === undefined) return true
    if (key === 'sectionSubject') return matches(db.state.subjects.find((s: any) => s.id === row.sectionSubjectId), value)
    if (key === 'academicPeriod') return matches(db.state.periods.find((p: any) => p.id === row.academicPeriodId), value)
    if (!row) return false
    if (value && typeof value === 'object') {
      if ('in' in value) return value.in.includes(row[key])
      if ('notIn' in value) return !value.notIn.includes(row[key])
      if ('not' in value) return row[key] !== value.not
      return matches(row[key], value)
    }
    return row[key] === value
  })
}

function activity(row: any) {
  if (!row) return null
  return { ...row, instrument: db.state.instruments.find((i: any) => i.id === row.instrumentId),
    instrumentSnapshot: db.state.snapshots.find((s: any) => s.id === row.instrumentSnapshotId), _count: { gradesRecords: db.state.grades.filter((g: any) => g.evaluationActivityId === row.id).length },
    groups: db.state.groups.filter((g: any) => g.activityId === row.id && g.status === 'ACTIVE') }
}

beforeEach(() => {
  db.failTeams = false; db.transactions = 0
  db.state = { subjects: [{ id: 'ss-1', schoolId: 'school-1', schoolYearId: 'year-1', status: 'ACTIVE',
    schoolYear: { schoolId: 'school-1', status: 'ACTIVE', name: '2026' }, teacherId: 'teacher-1',
    subject: { name: 'Matemática', code: 'MAT' }, section: { name: 'A' }, grade: { name: '1', sequence: 1 },
    teacher: { userId: 'user-1', schoolId: 'school-1', status: 'ACTIVE' } }],
  periods: [{ id: 'period-1', schoolId: 'school-1', schoolYearId: 'year-1', status: 'ACTIVE',
    schoolYear: { schoolId: 'school-1', status: 'ACTIVE' } }],
  teachers: [{ id: 'teacher-1', userId: 'user-1', schoolId: 'school-1', status: 'ACTIVE' }],
  activities: [], instruments: [], groups: [], members: [], grades: [], teams: [], planning: [], snapshots: [], preferences: [], sources: [] }
  const table = (key: string, decorate = (r: any) => r) => ({
    delete: async ({ where }: any) => { const row = db.state[key].find((r: any) => matches(r, where)); db.state[key] = db.state[key].filter((r: any) => r !== row); return row },
    findFirst: async ({ where }: any) => decorate(db.state[key].find((r: any) => matches(r, where))) ?? null,
    findUnique: async ({ where }: any) => decorate(db.state[key].find((r: any) => matches(r, where))) ?? null,
    findMany: async ({ where }: any) => db.state[key].filter((r: any) => matches(r, where)).map(decorate),
    count: async ({ where }: any) => db.state[key].filter((r: any) => matches(r, where)).length,
    create: async ({ data }: any) => {
      if (data.id && db.state[key].some((r: any) => r.id === data.id)) throw Object.assign(new Error('duplicate'), { code: 'P2002' })
      const row = { id: `${key}-${db.state[key].length + 1}`, status: 'ACTIVE', ...data }
      db.state[key].push(row); return decorate(row)
    },
    update: async ({ where, data }: any) => {
      const row = db.state[key].find((r: any) => matches(r, where)); Object.assign(row, Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined))); return decorate(row)
    },
    updateMany: async ({ where, data }: any) => {
      if (key === 'groups' && db.failTeams) throw new Error('team write failed')
      db.state[key].filter((r: any) => matches(r, where)).forEach((r: any) => Object.assign(r, data)); return { count: 0 }
    },
    upsert: async ({ where, create, update }: any) => {
      const row = db.state[key].find((r: any) => matches(r, where.groupId_enrollmentId))
      if (row) Object.assign(row, update); else db.state[key].push({ status: 'ACTIVE', ...create })
    },
  })
  Object.assign(db.prisma, { sectionSubject: table('subjects'), academicPeriod: table('periods'), teacher: table('teachers'),
    $queryRaw: async () => [],
    evaluationInstrumentSnapshot: table('snapshots'), evaluationSnapshotSource: table('sources'), teacherInstrumentPreference: table('preferences'),
    evaluationActivity: table('activities', activity), evaluationInstrument: table('instruments'),
    evaluationActivityGroup: table('groups'), evaluationActivityGroupMember: table('members'),
    gradesRecord: table('grades', row => row ? structuredClone(row) : null), courseTeam: table('teams'), planningEntry: table('planning'), enrollment: { groupBy: async () => [], findMany: async () => [] }, schoolYear: { findFirst: async () => null },
    $transaction: async (callback: any) => {
      db.transactions++
      const before = structuredClone(db.state)
      try { return await callback(db.prisma) } catch (error) { db.state = before; throw error }
    } })
})

describe('activity mutation context after waiting for the row lock', () => {
  function destination() {
    db.state.subjects.push({ ...db.state.subjects[0], id: 'ss-target' })
    db.state.periods.push({ ...db.state.periods[0], id: 'period-target' })
  }

  it.each(['assignment', 'planning-context', 'deleted'] as const)('rejects a stale planning link after %s changes', async change => {
    existing()
    destination()
    db.state.planning.push({ id: planningId, schoolId: 'school-1', sectionSubjectId: 'ss-1', academicPeriodId: 'period-1' })
    const move = () => {
      if (change === 'deleted') db.state.activities[0].status = 'INACTIVE'
      else {
        db.state.activities[0].sectionSubjectId = 'ss-target'
        db.state.activities[0].academicPeriodId = 'period-target'
        db.state.subjects[1].teacherId = 'teacher-other'
      }
    }
    let locked = false
    const readActivity = db.prisma.evaluationActivity.findFirst
    db.prisma.evaluationActivity.findFirst = async (args: any) => {
      const row = await readActivity(args)
      // Without a lock the other request commits between the read and authorization.
      if (!locked) move()
      return row
    }
    db.prisma.$queryRaw = async () => { move(); locked = true; return [] }
    const caller = change === 'planning-context' ? { ...user, roles: ['admin'] } : user
    const expected = change === 'assignment' ? 'Asignatura no disponible' : change === 'deleted' ? 'not found' : 'does not match activity context'
    await expect(controller().linkPlanning(caller, 'activity-1', { planningEntryId: planningId })).rejects.toThrow(expected)
    expect(db.state.activities[0].planningEntryId).toBeUndefined()
  })

  it.each(['assignment', 'subject-status', 'period-status', 'profile'] as const)('rejects a locked edit after destination %s changes', async change => {
    existing()
    destination()
    db.prisma.$queryRaw = async () => {
      if (change === 'assignment') db.state.subjects[1].teacherId = 'teacher-other'
      if (change === 'subject-status') db.state.subjects[1].status = 'INACTIVE'
      if (change === 'period-status') db.state.periods[1].status = 'INACTIVE'
      if (change === 'profile') db.state.subjects[1].grade = { academicLevel: { code: 'primario' } }
      return []
    }
    const request = { ...dto, id: 'activity-1', sectionSubjectId: 'ss-target', academicPeriodId: 'period-target',
      ...(change === 'profile' ? { competencyBlockId: 'b4' } : {}) }
    await expect(controller().save(user, request)).rejects.toThrow()
    expect(db.state.activities[0].sectionSubjectId).toBe('ss-1')
    expect(db.state.instruments).toEqual([])
  })

  it('persists the school year resolved from the fresh destination context', async () => {
    existing()
    destination()
    db.prisma.$queryRaw = async () => {
      db.state.subjects[1].schoolYearId = 'year-2'
      db.state.periods[1].schoolYearId = 'year-2'
      return []
    }
    await controller().save(user, { ...dto, id: 'activity-1', sectionSubjectId: 'ss-target', academicPeriodId: 'period-target' })
    expect(db.state.activities[0].schoolYearId).toBe('year-2')
  })
})

function controller() { return new ActivitiesController(new ActivitiesService(new GradingService())) }

describe('estrategia principal persistida', () => {
  it('permite cambiar estrategia de una actividad calificada sin tocar notas ni definición',async()=>{
    const saved=await controller().save(user,dto)
    db.state.grades.push({id:'grade-1',schoolId:user.schoolId,evaluationActivityId:saved.id,score:17})
    const instruments=structuredClone(db.state.instruments),grades=structuredClone(db.state.grades)
    const updated=await controller().save(user,{...dto,id:saved.id,instrumentId:saved.instrumentId,teachingStrategyId:'CASE_STUDY',teachingStrategyOrigin:'MANUAL'})
    expect(updated.teachingStrategyId).toBe('CASE_STUDY')
    expect(db.state.instruments).toEqual(instruments)
    expect(db.state.grades).toEqual(grades)
  })
  it('guarda origen manual y conserva instrumento al editar solo estrategia y al reintentar', async () => {
    const input = {...dto, creationId, teachingStrategyId:'CASE_STUDY', teachingStrategyOrigin:'MANUAL' as const}
    const saved = await controller().save(user,input)
    expect(saved).toMatchObject({teachingStrategyId:'CASE_STUDY',teachingStrategyOrigin:'MANUAL'})
    expect((await controller().save(user,input)).id).toBe(saved.id)
    const before=structuredClone(db.state.instruments)
    const edited=await controller().save(user,{...dto,id:saved.id,instrumentId:saved.instrumentId,teachingStrategyId:'DEBATE',teachingStrategyOrigin:'MANUAL'})
    expect(edited).toMatchObject({teachingStrategyId:'DEBATE',teachingStrategyOrigin:'MANUAL',instrumentId:saved.instrumentId})
    expect(db.state.instruments).toEqual(before)
    const omitted=await controller().save(user,{...dto,id:saved.id,instrumentId:saved.instrumentId})
    expect(omitted.teachingStrategyId).toBe('DEBATE')
  })
  it('histórico ausente sigue desconocido; no infiere retroactivamente',async()=>{
    const saved=await controller().save(user,{...dto,description:'Debaten posturas con argumentos.'})
    expect(saved).toMatchObject({teachingStrategyId:null,teachingStrategyOrigin:'UNKNOWN'})
  })
  it.each([
    {teachingStrategyId:'inventada',teachingStrategyOrigin:'MANUAL'},
    {teachingStrategyId:'DEBATE',teachingStrategyOrigin:'MALFORMADO'},
    {teachingStrategyId:null,teachingStrategyOrigin:'MANUAL'},
  ])('rechaza valor inválido sin escrituras: %j',async selection=>{
    await expect(controller().save(user,{...dto,...selection} as SaveActivityDto)).rejects.toMatchObject({status:400})
    expect(db.state.activities).toHaveLength(0)
    expect(db.state.instruments).toHaveLength(0)
  })
  it('rechaza técnica fuera del ámbito verificado',async()=>{
    db.state.subjects[0].grade.academicLevel={code:'primario'}
    await expect(controller().save(user,{...dto,teachingStrategyId:'FORUM',teachingStrategyOrigin:'MANUAL'})).rejects.toMatchObject({status:400})
  })
})
function existing(overrides = {}) {
  db.state.activities.push({ id: 'activity-1', schoolId: 'school-1', schoolYearId: 'year-1', sectionSubjectId: 'ss-1',
    academicPeriodId: 'period-1', competencyBlockId: 'b1', competencyBlockWeights: { b1: 1 }, status: 'ACTIVE', createdBy: 'user-1', name: 'Proyecto', maxScore: 20, ...overrides })
}

describe('instrument validation and graded metadata', () => {
  function currentGrade() {
    const evidence = { instrumentType: 'lista-cotejo', selections: [0], criterionScores: [20], applicableMaximums: [20], completedAt: '2026-10-12T00:00:00Z' }
    db.state.grades.push({ id: 'grade-1', schoolId: 'school-1', sectionSubjectId: 'ss-1', academicPeriodId: 'period-1', enrollmentId: 'enrollment-1', evaluationActivityId: 'activity-1', instrumentResult: evidence, score: 20, maxScore: 20, status: 'DRAFT' })
    existing({ instrumentId: 'instrument-1' })
    db.state.instruments.push({ id: 'instrument-1', type: dto.instrumentType, criteria: dto.instrumentCriteria })
    return evidence
  }

  it('validates the evidence committed while gradeId waits for its activity lock', async () => {
    currentGrade()
    db.prisma.$queryRaw = async (parts: TemplateStringsArray) => {
      if (parts.join('').includes('evaluation_activities')) Object.assign(db.state.grades[0], { score: 0,
        instrumentResult: { instrumentType: 'lista-cotejo', selections: [1], criterionScores: [0], completedAt: '2026-10-12T01:00:00Z' } })
      return []
    }
    await expect(new GradingService().saveGrade('school-1', { gradeId: 'grade-1', score: 20 }, user.id, user.roles)).rejects.toMatchObject({ status: 400 })
  })

  it('rejects a concurrently attached activity instead of overwriting a standalone grade', async () => {
    currentGrade()
    db.state.grades[0].evaluationActivityId = null
    db.state.grades[0].instrumentResult = null
    db.prisma.$queryRaw = async (parts: TemplateStringsArray) => {
      if (parts.join('').includes('grades_records')) db.state.grades[0].evaluationActivityId = 'activity-1'
      return []
    }
    await expect(new GradingService().saveGrade('school-1', { gradeId: 'grade-1', score: 20 }, user.id, user.roles)).rejects.toMatchObject({ status: 409 })
  })

  it.each(['same', 'different', 'null'] as const)('upsert preserves omitted evidence or clears explicit null: %s', async mode => {
    const evidence = currentGrade()
    db.prisma.enrollment.findFirst = async () => ({ id: 'enrollment-1', sectionId: 'section-1', schoolYearId: 'year-1' })
    db.state.subjects[0].sectionId = 'section-1'
    db.prisma.$queryRaw = async (parts: TemplateStringsArray, ...values: unknown[]) => {
      if (!parts.join('').includes('insert into public.grades_records')) return []
      Object.assign(db.state.grades[0], { score: values[6], maxScore: values[7], instrumentResult: JSON.parse(String(values[11])) })
      return [db.state.grades[0]]
    }
    const request = { enrollmentId: 'enrollment-1', sectionSubjectId: 'ss-1', academicPeriodId: 'period-1', evaluationActivityId: 'activity-1', score: mode === 'different' ? 10 : 20,
      ...(mode === 'null' ? { instrumentResult: null } : {}) }
    const result = new GradingService().saveGrade('school-1', request, user.id, user.roles)
    if (mode === 'different') await expect(result).rejects.toMatchObject({ status: 400 })
    else expect((await result).instrumentResult).toEqual(mode === 'null' ? null : evidence)
  })

  it.each(['omitted', 'empty', 'invalid', 'invalid-id'] as const)('validates planning link and preserves moment: %s', async mode => {
    existing({ planningMoment: 'cierre' })
    const request = { planningEntryId: mode === 'invalid-id' ? 'bad-id' : null,
      ...(mode === 'empty' ? { planningMoment: '' } : mode === 'invalid' ? { planningMoment: 'MALFORMADO' } : {}) }
    const saved = controller().linkPlanning(user, 'activity-1', request)
    if (mode === 'invalid' || mode === 'invalid-id') await expect(saved).rejects.toMatchObject({ status: 400 })
    else expect((await saved).planningMoment).toBe(mode === 'empty' ? '' : 'cierre')
  })

  function prepared(count = 2): SaveActivityDto {
    const snapshot = recommend({ activityTitle: 'Proyecto', participationMode: 'INDIVIDUAL', maxScore: 20 }, null, null, [], 'NO_PUBLISHED_VERSION', null)
    snapshot.instrumentType = 'lista-cotejo'
    snapshot.levels = [{ id: 'L2', label: 'Sí', proportion: 1 }, { id: 'L1', label: 'No', proportion: 0 }]
    snapshot.criteria = Array.from({ length: count }, (_, index) => ({ id: `c${index}`, title: `C${index}`, description: `D${index}`,
      maxScore: 20 / count, maxScoreUnits: 2000 / count, sourceType: 'ACTIVITY_TEMPLATE', sourceReferences: [], templateId: 'teacher',
      descriptors: [{ levelId: 'L2', text: `D${index}`, scoreUnits: 2000 / count }, { levelId: 'L1', text: `D${index}`, scoreUnits: 0 }] }))
    const fields: Record<string, string> = { 'lista-cotejo:meta:criteriaCount': String(count) }
    snapshot.criteria.forEach((criterion, index) => {
      fields[`lista-cotejo:criterion-id:${index}`] = criterion.id
      fields[`lista-cotejo:criterion:${index}`] = criterion.title
      fields[`lista-cotejo:description:${index}`] = criterion.description
      fields[`lista-cotejo:points:${index}`] = String(criterion.maxScore)
    })
    return { ...dto, instrumentSnapshot: snapshot, instrumentCriteria: fields, pedagogicalActivityType: snapshot.activityType }
  }

  it('appends an immutable linked snapshot for pending structural edits', async () => {
    const request = prepared()
    const original = await controller().save(user, request)
    const oldPayload = structuredClone(db.state.snapshots[0].payload)
    const next = structuredClone(request)
    next.instrumentCriteria!['lista-cotejo:criterion:0'] = 'Editado'
    next.instrumentSnapshot!.criteria[0].title = 'Editado'
    const saved = await controller().save(user, { ...next, id: original.id, instrumentId: original.instrumentId })
    expect(saved.instrumentSnapshotVersion).toBe(2)
    expect(db.state.snapshots[1].previousSnapshotId).toBe(original.instrumentSnapshotId)
    expect(db.state.snapshots[0].payload).toEqual(oldPayload)
    expect(db.state.activities).toHaveLength(1)
    expect((await controller().save(user, { ...next, id: original.id, instrumentId: saved.instrumentId, name: 'Renombrado' })).instrumentSnapshotId).toBe(saved.instrumentSnapshotId)
    expect(db.state.snapshots).toHaveLength(2)
  })

  it('revalidates canonical snapshot data on creation retries', async () => {
    const request = { ...prepared(), creationId }
    await controller().save(user, request)
    request.instrumentSnapshot!.levels[0].proportion = 0.5
    db.state.snapshots[0].payload.levels[0].proportion = 0.5
    await expect(controller().save(user, request)).rejects.toMatchObject({ status: 400 })
  })

  it('preserves omitted competence distribution on a graded metadata edit', async () => {
    const original = await controller().save(user, { ...dto, competencyBlockWeights: { b1: 0.5, b2: 0.5 } })
    db.state.grades.push({ schoolId: 'school-1', evaluationActivityId: original.id, score: 12 })
    const saved = await controller().save(user, { ...dto, id: original.id, name: 'Editado' })
    expect(saved.competencyBlockWeights).toEqual({ b1: 0.5, b2: 0.5 })
  })

  it('allows 20 criteria in versioned instruments', async () => {
    expect((await controller().save(user, prepared(20))).instrumentSnapshotVersion).toBe(1)
  })

  it('allows versioned graded metadata but rejects changed scoring evidence', async () => {
    const request = prepared()
    const original = await controller().save(user, request)
    db.state.grades.push({ schoolId: 'school-1', evaluationActivityId: original.id, score: 12 })
    const saved = await controller().save(user, { ...dto, id: original.id, name: 'Editado', instrumentType: undefined, instrumentCriteria: undefined })
    expect(saved.instrumentSnapshotId).toBe(original.instrumentSnapshotId)
    expect(saved.instrumentSnapshotVersion).toBe(1)
    expect(db.state.snapshots).toHaveLength(1)
    const changed = structuredClone(request)
    changed.instrumentSnapshot!.criteria[0].title = 'Cambió'
    changed.instrumentCriteria!['lista-cotejo:criterion:0'] = 'Cambió'
    await expect(controller().save(user, { ...changed, id: original.id, instrumentId: original.instrumentId })).rejects.toThrow('calificaciones')
    expect(db.state.snapshots).toHaveLength(1)
  })

  it.each(['levels', 'ratio', 'descriptor', 'source', 'indicator', 'scope', 'scope-id'] as const)('rejects inconsistent or malformed snapshot %s with 400', async change => {
    const request = prepared()
    if (change === 'levels') request.instrumentSnapshot!.levels = null as never
    if (change === 'ratio') request.instrumentSnapshot!.levels[0].proportion = 0.5
    if (change === 'descriptor') request.instrumentSnapshot!.criteria[0].descriptors[0].scoreUnits = 123
    if (change === 'source') request.instrumentSnapshot!.criteria[0].sourceReferences = [null as never]
    if (change === 'indicator') request.instrumentSnapshot!.criteria[0].description = 'Falso'
    if (change === 'scope') request.instrumentSnapshot!.curriculumScopeId = {} as never
    if (change === 'scope-id') { request.instrumentSnapshot!.curriculumScopeId = 'invalid'; request.instrumentSnapshot!.curriculumVersionId = 'invalid' }
    await expect(controller().save(user, request)).rejects.toMatchObject({ status: 400 })
    expect(db.state.snapshots).toHaveLength(0)
  })

  it.each([
    { instrumentCriteria: {} }, { instrumentType: 'inventado' },
    { instrumentCriteria: { ...dto.instrumentCriteria, 'lista-cotejo:points:0': '19' } },
    { activityType: 'otro' }, { planningMoment: 'otro' }, { source: 'otro' },
    { date: '2026-02-30' }, { date: '2026-10-12T00:00:00.000Z' },
    { maxScore: 10001 }, { maxScore: 1.001 },
  ])('rejects invalid manual data %j', async change => {
    await expect(controller().save(user, { ...dto, ...change } as any)).rejects.toThrow()
    expect(db.state.activities).toHaveLength(0)
  })

  it('rejects unordered rubric levels', async () => {
    await expect(controller().save(user, { ...dto, instrumentType: 'rubrica', instrumentCriteria: {
      'rubrica:criterion:0': 'Criterio', 'rubrica:points:0': '20', 'rubrica:meta:levelCount': '2',
      'rubrica:level-name:2': 'Alto', 'rubrica:level-name:1': 'Bajo', 'rubrica:level-points:2': '1', 'rubrica:level-points:1': '2',
      'rubrica:descriptor:0:2': 'Completo', 'rubrica:descriptor:0:1': 'Parcial',
    } })).rejects.toThrow()
  })

  it('allows 20 complete manual criteria', async () => {
    const fields: Record<string, string> = { 'lista-cotejo:meta:criteriaCount': '20' }
    for (let i = 0; i < 20; i++) { fields[`lista-cotejo:criterion:${i}`] = `C${i}`; fields[`lista-cotejo:points:${i}`] = '1' }
    expect((await controller().save(user, { ...dto, instrumentCriteria: fields })).instrumentCriteria).toEqual(fields)
  })

  it('preserves omitted optional metadata and evidence when editing', async () => {
    const original = await controller().save(user, { ...dto, evidenceInstructions: 'Foto', source: 'planning', planningMoment: 'inicio', description: 'Original' })
    const saved = await controller().save(user, { ...dto, id: original.id, name: 'Editado' })
    expect(saved).toMatchObject({ evidenceInstructions: 'Foto', source: 'planning', planningMoment: 'inicio', description: 'Original' })
  })

  it('preserves omitted activity dates, saves valid dates and clears an explicit empty date', async () => {
    const original = await controller().save(user, { ...dto, date: '2026-10-12' })
    expect((await controller().save(user, { ...dto, id: original.id, name: 'Editado' })).date).toBe('2026-10-12')
    expect((await controller().save(user, { ...dto, id: original.id, date: '2026-10-13' })).date).toBe('2026-10-13')
    expect((await controller().save(user, { ...dto, id: original.id, date: '' })).date).toBeUndefined()
    expect(db.state.activities[0].activityDate).toBeNull()
  })

  it('allows metadata edits after grading without copying evidence', async () => {
    const original = await controller().save(user, dto)
    db.state.grades.push({ schoolId: 'school-1', evaluationActivityId: original.id, score: 12 })
    const saved = await controller().save(user, { ...dto, id: original.id, name: 'Editado', instrumentType: undefined, instrumentCriteria: undefined })
    expect(saved.name).toBe('Editado'); expect(saved.instrumentId).toBe(original.instrumentId)
    expect(saved.evaluatedCount).toBe(1); expect(db.state.instruments).toHaveLength(1)
  })

  it('rechecks an activity after taking its lock when grading', async () => {
    existing({ competencyBlockId: 'b1' })
    db.state.grades.push({ id: 'grade-1', schoolId: 'school-1', sectionSubjectId: 'ss-1', academicPeriodId: 'period-1', evaluationActivityId: 'activity-1', score: 12, maxScore: 20, status: 'DRAFT' })
    db.prisma.$queryRaw = async () => { db.state.activities[0].status = 'INACTIVE'; return [] }
    await expect(new GradingService().saveGrade('school-1', { gradeId: 'grade-1', score: 15 }, user.id, user.roles)).rejects.toThrow('not found')
    expect(db.state.grades[0].score).toBe(12)
  })

  it.each(['maximum', 'assignment'])('rechecks %s after the grading lock', async change => {
    existing()
    db.state.grades.push({ id: 'grade-1', schoolId: 'school-1', sectionSubjectId: 'ss-1', academicPeriodId: 'period-1', evaluationActivityId: 'activity-1', score: 12, maxScore: 20, status: 'DRAFT' })
    db.prisma.$queryRaw = async () => {
      if (change === 'maximum') db.state.activities[0].maxScore = 10
      else db.state.teachers[0].status = 'INACTIVE'
      return []
    }
    await expect(new GradingService().saveGrade('school-1', { gradeId: 'grade-1', score: 15 }, user.id, user.roles)).rejects.toThrow()
    expect(db.state.grades[0].score).toBe(12)
  })

  it.each([-0.01, 10000.01, 1.001, NaN, Infinity])('rejects invalid direct grade points %s', async score => {
    await expect(new GradingService().saveGrade('school-1', { score }, user.id, user.roles)).rejects.toMatchObject({ status: 400 })
  })

  it.each([150, 200])('allows %i point activity grades with cents', async maximum => {
    const original = await controller().save(user, { ...dto, maxScore: maximum, instrumentCriteria: { ...dto.instrumentCriteria, 'lista-cotejo:points:0': String(maximum) } })
    db.state.grades.push({ id: 'grade-1', schoolId: 'school-1', sectionSubjectId: 'ss-1', academicPeriodId: 'period-1', evaluationActivityId: original.id, score: 12, maxScore: maximum, status: 'DRAFT' })
    expect((await new GradingService().saveGrade('school-1', { gradeId: 'grade-1', score: maximum - 0.01 }, user.id, user.roles)).score).toBe(maximum - 0.01)
    expect((await new GradingService().saveGrade('school-1', { gradeId: 'grade-1', score: maximum,
      instrumentResult: { instrumentType: 'lista-cotejo', selections: [0], criterionScores: [maximum], completedAt: '2026-10-12T00:00:00Z' },
    }, user.id, user.roles)).score).toBe(maximum)
    await expect(new GradingService().saveGrade('school-1', { gradeId: 'grade-1', score: maximum + 0.01 }, user.id, user.roles)).rejects.toThrow('superar')
  })

  it('checks canonical selections, type and effective maxima for No aplica', async () => {
    const fields = { 'lista-cotejo:criterion:0': 'A', 'lista-cotejo:points:0': '10', 'lista-cotejo:criterion:1': 'B', 'lista-cotejo:points:1': '10', 'lista-cotejo:meta:noApply': 'true' }
    const original = await controller().save(user, { ...dto, instrumentCriteria: fields })
    db.state.grades.push({ id: 'grade-1', schoolId: 'school-1', sectionSubjectId: 'ss-1', academicPeriodId: 'period-1', evaluationActivityId: original.id, score: 0, maxScore: 20, status: 'DRAFT' })
    const result = { instrumentType: 'lista-cotejo', selections: [0, -1], criterionScores: [20, 0], applicableMaximums: [20, 0], completedAt: '2026-10-12T00:00:00Z' }
    const service = new GradingService()
    expect((await service.saveGrade('school-1', { gradeId: 'grade-1', score: 20, instrumentResult: result }, user.id, user.roles)).score).toBe(20)
    for (const invalid of [{ ...result, instrumentType: 'rubrica' }, { ...result, criterionScores: [10, 10] }, { ...result, applicableMaximums: [10, 10] }, { ...result, selections: [-1, -1] }]) {
      await expect(service.saveGrade('school-1', { gradeId: 'grade-1', score: 20, instrumentResult: invalid }, user.id, user.roles)).rejects.toThrow()
    }
  })

  it('uses known historical numeric fields even when labels or descriptors are missing', async () => {
    existing({ instrumentId: 'legacy' })
    db.state.instruments.push({ id: 'legacy', type: 'rubrica', criteria: {
      'rubrica:criterion:0': 'A', 'rubrica:points:0': '20', 'rubrica:meta:levelCount': '2',
      'rubrica:level-points:2': '1', 'rubrica:level-points:1': '0.5',
    } })
    db.state.grades.push({ id: 'grade-1', schoolId: 'school-1', sectionSubjectId: 'ss-1', academicPeriodId: 'period-1', evaluationActivityId: 'activity-1', score: 0, maxScore: 20, status: 'DRAFT' })
    const result = { instrumentType: 'rubrica', selections: [1], criterionScores: [15], completedAt: '2026-10-12T00:00:00Z' }
    await expect(new GradingService().saveGrade('school-1', { gradeId: 'grade-1', score: 15, instrumentResult: result }, user.id, user.roles)).rejects.toMatchObject({ status: 400 })
    expect((await new GradingService().saveGrade('school-1', { gradeId: 'grade-1', score: 10, instrumentResult: { ...result, criterionScores: [10] } }, user.id, user.roles)).score).toBe(10)
  })

  it.each([null, 'other-activity'])('rejects moving existing grade evidence to %s', async evaluationActivityId => {
    const original = await controller().save(user, dto)
    db.state.grades.push({ id: 'grade-1', schoolId: 'school-1', sectionSubjectId: 'ss-1', academicPeriodId: 'period-1', evaluationActivityId: original.id, score: 20, maxScore: 20, status: 'DRAFT' })
    await expect(new GradingService().saveGrade('school-1', { gradeId: 'grade-1', score: 20, evaluationActivityId }, user.id, user.roles)).rejects.toMatchObject({ status: 400 })
    expect(db.state.grades[0].evaluationActivityId).toBe(original.id)
  })

  it.each([true, false])('preserves evidence when activity ID is same or omitted (%s)', async explicit => {
    const original = await controller().save(user, dto)
    const evidence = { instrumentType: 'lista-cotejo', selections: [0], criterionScores: [20], applicableMaximums: [20], completedAt: '2026-10-12T00:00:00Z' }
    db.state.grades.push({ id: 'grade-1', schoolId: 'school-1', sectionSubjectId: 'ss-1', academicPeriodId: 'period-1', evaluationActivityId: original.id, instrumentResult: evidence, score: 20, maxScore: 20, status: 'DRAFT' })
    const saved = await new GradingService().saveGrade('school-1', { gradeId: 'grade-1', score: 20, ...(explicit ? { evaluationActivityId: original.id } : {}) }, user.id, user.roles)
    expect(saved.instrumentResult).toEqual(evidence)
    expect(saved.evaluationActivityId).toBe(original.id)
  })
})

describe('HTTP activity permissions', () => {
  it.each(['workspace', 'annual', 'students', 'save-grade', 'delete-grade'] as const)('checks grading assignment for %s', async operation => {
    db.state.subjects[0].teacherId = 'teacher-other'
    db.state.subjects[0].teacher.userId = 'other-user'
    db.state.grades.push({ id: 'grade-1', schoolId: 'school-1', sectionSubjectId: 'ss-1', academicPeriodId: 'period-1', score: 0, status: 'DRAFT' })
    const service = new GradingService()
    const api = new GradingController(service)
    const request = operation === 'workspace' ? api.getWorkspace(user, 'ss-1', 'period-1', 'false')
      : operation === 'annual' ? api.getAnnualWorkspace(user, 'ss-1')
      : operation === 'students' ? api.getStudents(user, 'ss-1', 'period-1')
      : operation === 'save-grade' ? api.saveGrade(user, { gradeId: 'grade-1', score: 1 })
      : api.deleteGrade(user, 'grade-1')
    await expect(request).rejects.toThrow('Asignatura no disponible')
  })

  it('scopes grading options and student grade reads to the assigned teacher', async () => {
    db.state.subjects.push({ ...db.state.subjects[0], id: 'ss-other', teacherId: 'other', teacher: { userId: 'other-user', schoolId: 'school-1', status: 'ACTIVE' } })
    db.state.grades.push({ id: 'grade-1', schoolId: 'school-1', sectionSubjectId: 'ss-other', academicPeriodId: 'period-1', enrollmentId: 'enrollment-1', score: 10, status: 'DRAFT' })
    db.prisma.enrollment.findMany = async () => [{ id: 'enrollment-1' }]
    const api = new GradingController(new GradingService())
    expect((await api.getSectionSubjects(user)).map(subject => subject.id)).toEqual(['ss-1'])
    expect(await api.findByStudent(user, 'student-1')).toEqual([])
    expect(await api.findAll(user)).toEqual([])
    expect(await api.findByStudent({ ...user, roles: ['admin'] }, 'student-1')).toHaveLength(1)
  })

  it.each(['save', 'update', 'delete', 'link', 'list'] as const)('denies an unassigned teacher: %s', async operation => {
    db.state.subjects[0].teacherId = 'teacher-other'
    db.state.subjects[0].teacher.userId = 'other-user'
    existing()
    const api = controller()
    const request = operation === 'save' ? api.save(user, dto) : operation === 'update' ? api.save(user, { ...dto, id: 'activity-1' })
      : operation === 'delete' ? api.remove(user, 'activity-1') : operation === 'link' ? api.linkPlanning(user, 'activity-1', { planningEntryId: null })
      : api.findAll(user, 'ss-1', 'period-1')
    await expect(request).rejects.toThrow('Asignatura no disponible')
    expect(db.state.activities).toHaveLength(1)
    expect(db.state.activities[0].status).toBe('ACTIVE')
    expect(db.state.instruments).toHaveLength(0)
  })

  it('scopes an unfiltered teacher listing to active assigned subjects', async () => {
    existing()
    db.state.subjects.push({ ...db.state.subjects[0], id: 'ss-other', teacherId: 'other', teacher: { userId: 'other-user', status: 'ACTIVE' } })
    existing({ id: 'activity-other', sectionSubjectId: 'ss-other' })
    expect((await controller().findAll(user)).map((r: any) => r.id)).toEqual(['activity-1'])
  })

  it.each(['student', 'guardian', ''])('denies unauthorized role %s even for reading', async role => {
    await expect(controller().findAll({ ...user, roles: role ? [role] : [] })).rejects.toThrow('rol')
  })

  it('retains school-wide administrative access', async () => {
    existing()
    expect(await controller().findAll({ ...user, roles: ['admin', 'teacher'] })).toHaveLength(1)
  })

  it('denies missing identity when teacher roles are supplied for the center', async () => {
    await expect(new GradingService().getActivityCenter('school-1', undefined, ['teacher'])).rejects.toThrow('rol')
  })

  it('excludes inactive school years from center options and activities', async () => {
    existing()
    db.state.subjects[0].schoolYear.status = 'INACTIVE'
    db.state.periods[0].schoolYear.status = 'INACTIVE'
    const center = await controller().getCenter(user)
    expect(center.activities).toEqual([])
    expect(center.sectionSubjects).toEqual([])
    expect(center.academicPeriods).toEqual([])
  })

  it.each(['subject', 'period', 'year'])('rejects inactive academic context: %s', async context => {
    if (context === 'subject') db.state.subjects[0].status = 'INACTIVE'
    if (context === 'period') db.state.periods[0].status = 'INACTIVE'
    if (context === 'year') db.state.subjects[0].schoolYear.status = 'INACTIVE'
    await expect(controller().save(user, dto)).rejects.toThrow()
    expect(db.state.activities).toHaveLength(0)
  })

  it('checks the old assignment before moving an activity into an authorized subject', async () => {
    db.state.subjects.push({ ...db.state.subjects[0], id: 'ss-other', teacherId: 'other', teacher: { userId: 'other-user', status: 'ACTIVE' } })
    existing({ sectionSubjectId: 'ss-other' })
    await expect(controller().save(user, { ...dto, id: 'activity-1' })).rejects.toThrow('Asignatura no disponible')
    expect(db.state.activities[0].sectionSubjectId).toBe('ss-other')
  })
})

describe('atomic manual persistence and creation retries', () => {
  it('rolls back instrument and activity when team synchronization fails', async () => {
    db.failTeams = true
    await expect(controller().save(user, dto)).rejects.toThrow('team write failed')
    expect(db.state.activities).toEqual([])
    expect(db.state.instruments).toEqual([])
    expect(db.transactions).toBe(1)
  })

  it('rolls back edits and cloned instruments when team synchronization fails', async () => {
    db.state.instruments.push({ id: 'original', schoolId: 'school-1', status: 'ACTIVE', type: 'lista-cotejo', criteria: dto.instrumentCriteria, maxScore: 20 })
    existing({ instrumentId: 'original' })
    db.failTeams = true
    await expect(controller().save(user, { ...dto, id: 'activity-1', name: 'Edited', instrumentId: 'original', maxScore: 30, instrumentCriteria: { ...dto.instrumentCriteria, 'lista-cotejo:points:0': '30' } })).rejects.toThrow('team write failed')
    expect(db.state.activities[0].name).toBe('Proyecto')
    expect(db.state.instruments).toHaveLength(1)
    expect(db.state.instruments[0].criteria).toEqual(dto.instrumentCriteria)
  })

  it('clones a reused instrument even when its only previous activity is inactive', async () => {
    db.state.instruments.push({ id: 'original', schoolId: 'school-1', status: 'ACTIVE', type: 'lista-cotejo', criteria: dto.instrumentCriteria, maxScore: 20 })
    existing({ instrumentId: 'original', status: 'INACTIVE' })
    const saved = await controller().save(user, { ...dto, instrumentId: 'original' })
    expect(saved.instrumentId).not.toBe('original')
    expect(db.state.instruments[0].criteria).toEqual(dto.instrumentCriteria)
    expect(db.state.instruments).toHaveLength(2)
  })

  it('persists team members in the same transaction', async () => {
    db.state.teams.push({ id: 'team-1', schoolId: 'school-1', sectionSubjectId: 'ss-1', status: 'ACTIVE', name: 'A', members: [{ enrollmentId: 'student-1' }] })
    const saved = await controller().save(user, { ...dto, activityType: 'group', teamIds: ['team-1'] })
    expect(saved.teamIds).toEqual(['team-1'])
    expect(db.state.members[0].enrollmentId).toBe('student-1')
    expect(db.transactions).toBe(1)
  })

  it('returns the same authorized creation without adding instruments or activities', async () => {
    const request = { ...dto, creationId }
    const first = await controller().save(user, request)
    const second = await controller().save(user, request)
    expect(first.id).toBe(creationId)
    expect(second).toEqual(first)
    expect(db.state.activities).toHaveLength(1)
    expect(db.state.instruments).toHaveLength(1)
  })

  it('allows an identical retry when cloning an existing instrument without new editor fields', async () => {
    db.state.instruments.push({ id: 'original', schoolId: 'school-1', status: 'ACTIVE', name: 'Lista', type: 'lista-cotejo', criteria: dto.instrumentCriteria, maxScore: 20 })
    const request = { ...dto, creationId, instrumentId: 'original', instrumentType: undefined, instrumentCriteria: undefined }
    const first = await controller().save(user, request)
    expect(await controller().save(user, request)).toEqual(first)
    expect(db.state.instruments).toHaveLength(2)
  })

  it('returns the winning creation after a concurrent primary-key conflict rolls back the losing instrument', async () => {
    const request = { ...dto, creationId }
    const first = await controller().save(user, request)
    const lookup = db.prisma.evaluationActivity.findUnique
    let missOnce = true
    db.prisma.evaluationActivity.findUnique = async (args: any) => {
      if (missOnce) { missOnce = false; return null }
      return lookup(args)
    }
    expect(await controller().save(user, request)).toEqual(first)
    expect(db.state.activities).toHaveLength(1)
    expect(db.state.instruments).toHaveLength(1)
  })

  it.each(['owner', 'school', 'subject', 'inactive', 'content'] as const)('rejects creation ID collision for %s', async collision => {
    await controller().save(user, { ...dto, creationId })
    const row = db.state.activities[0]
    if (collision === 'owner') row.createdBy = 'other-user'
    if (collision === 'school') row.schoolId = 'other-school'
    if (collision === 'subject') row.sectionSubjectId = 'other-subject'
    if (collision === 'inactive') row.status = 'INACTIVE'
    const request = { ...dto, creationId, ...(collision === 'content' ? { name: 'Changed after uncertain save' } : {}) }
    await expect(controller().save(user, request)).rejects.toThrow()
    expect(db.state.activities).toHaveLength(1)
    expect(db.state.instruments).toHaveLength(1)
  })

  it('rechecks assignment on a retry after access was removed', async () => {
    await controller().save(user, { ...dto, creationId })
    db.state.teachers[0].status = 'INACTIVE'
    await expect(controller().save(user, { ...dto, creationId })).rejects.toThrow('Asignatura no disponible')
  })

  it('preserves recorded grades on deletion and structural editing', async () => {
    existing()
    db.state.grades.push({ schoolId: 'school-1', evaluationActivityId: 'activity-1', score: 12 })
    await expect(controller().remove(user, 'activity-1')).rejects.toThrow('calificaciones')
    await expect(controller().save(user, { ...dto, id: 'activity-1', maxScore: 30 })).rejects.toThrow('calificaciones')
    expect(db.state.grades[0].score).toBe(12)
    expect(db.state.activities[0].maxScore).toBe(20)
  })

  it('rechecks grades inside the deletion transaction before deactivating an activity', async () => {
    existing()
    const transaction = db.prisma.$transaction
    db.prisma.$transaction = async (callback: any) => {
      db.state.grades.push({ schoolId: 'school-1', evaluationActivityId: 'activity-1', score: 17 })
      return transaction(callback)
    }
    await expect(controller().remove(user, 'activity-1')).rejects.toThrow('calificaciones')
    expect(db.state.activities[0].status).toBe('ACTIVE')
    expect(db.state.grades[0].score).toBe(17)
  })
})
