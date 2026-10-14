import 'reflect-metadata'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { EvaluationInstrumentsService } from './evaluation-instruments.service'
import { RecommendInstrumentDto } from './recommend-instrument.dto'
import { evaluationCatalogCurrent } from './catalog-current'
import { seedEvaluationCatalog } from './catalog-operations'
import grammar from '../../../../../data/evaluation-instruments/english-grade-one-grammar-contracts.json'

const mocks = vi.hoisted(() => ({
  sectionSubject: { findFirst: vi.fn() }, evaluationCatalogRelease: { findUnique: vi.fn(), create: vi.fn() },
  curriculumVersion: { findUnique: vi.fn(), findFirst: vi.fn() }, curriculumScope: { findMany: vi.fn() },
  curriculumSubjectMapping: { findMany: vi.fn() }, curriculumElement: { findMany: vi.fn() },
}))
vi.mock('@aula/database', () => ({ prisma: mocks }))
const user = { id: 'teacher-user', schoolId: 'school', email: 'test@example.invalid', roles: ['teacher'] }
const input = { sectionSubjectId: 'cc32a9cf-8ca2-452e-b7e9-9b786ae1d475', activityTitle: 'Exposición sobre el sistema circulatorio', participationMode: 'INDIVIDUAL' as const, maxScore: 20, curriculumVersionId: '37843eac-3f65-55ab-8a7e-e4fd95715380' }
const scope = { id: 'scope', versionId: input.curriculumVersionId, grade: 5, cycle: 2, areaName: 'Ciencias de la Naturaleza', subjectName: 'Ciencias de la Naturaleza', optativeExitName: null, modalityName: null }
function assignment() {
  const active = { schoolId: user.schoolId, status: 'ACTIVE' }
  return { ...active, gradeId: 'grade', subjectId: 'subject',
    grade: { ...active, sequence: 5, academicLevel: { id: 'primary', code: 'primario' }, academicCycle: { code: 'primario_segundo_ciclo', levelId: 'primary' }, defaultModality: null },
    subject: { ...active, code: 'PRI-NAT', name: 'Ciencias de la Naturaleza' }, section: { ...active, gradeId: 'grade' }, schoolYear: active, curriculumContext: null }
}
beforeEach(() => {
  vi.resetAllMocks()
  mocks.sectionSubject.findFirst.mockResolvedValue(assignment())
  mocks.evaluationCatalogRelease.findUnique.mockResolvedValue({ payload: evaluationCatalogCurrent })
  mocks.curriculumVersion.findUnique.mockResolvedValue({ id: input.curriculumVersionId, level: 'PRIMARY', status: 'DRAFT' })
  mocks.curriculumVersion.findFirst.mockResolvedValue(null)
  mocks.curriculumScope.findMany.mockResolvedValue([scope])
  mocks.curriculumSubjectMapping.findMany.mockResolvedValue([])
  mocks.curriculumElement.findMany.mockResolvedValue([])
})
describe('API service security and version policy', () => {
  it('devuelve400 explicativo cuando no caben todos los requisitos, sin una propuesta truncada',async()=>{
    const row=assignment()
    row.grade.sequence=1
    row.grade.academicLevel.code='secundario'
    row.grade.academicCycle.code='secundario_primer_ciclo'
    row.subject.code='ING'
    row.subject.name='Inglés'
    mocks.sectionSubject.findFirst.mockResolvedValue(row)
    const request={...input,curriculumVersionId:undefined,description:`Leerán un texto en inglés e identificarán ${grammar.map(f=>f.term).join(', ')}.`}
    await expect(new EvaluationInstrumentsService().recommend(user,request)).rejects.toMatchObject({status:400,message:expect.stringContaining('31 criterios')})
  })
  it('en producción no selecciona DRAFT implícitamente para interpretar ni recomendar',async()=>{
    const previous=process.env.NODE_ENV
    process.env.NODE_ENV='production'
    mocks.curriculumVersion.findFirst.mockImplementation(async({where})=>where.status==='DRAFT' ? {id:input.curriculumVersionId,level:'PRIMARY',status:'DRAFT'} : null)
    try {
      const service=new EvaluationInstrumentsService()
      const interpretation=await service.interpret(user,{sectionSubjectId:input.sectionSubjectId,activityTitle:'Actividad'})
      const result=await service.recommend(user,{...input,curriculumVersionId:undefined})
      expect(interpretation.curriculumVersionId).toBeNull()
      expect(result.curriculumVersionId).toBeNull()
      expect(mocks.curriculumVersion.findFirst.mock.calls.every(([arg])=>arg.where.status==='PUBLISHED')).toBe(true)
    } finally {
      if(previous === undefined) delete process.env.NODE_ENV
      else process.env.NODE_ENV=previous
    }
  })
  it('filtra escuela y docente asignado antes de leer currículo', async () => {
    await new EvaluationInstrumentsService().recommend(user, input)
    expect(mocks.sectionSubject.findFirst.mock.calls[0][0].where).toEqual({ id: input.sectionSubjectId, schoolId: user.schoolId, status: 'ACTIVE', teacher: { userId: user.id, schoolId: user.schoolId, status: 'ACTIVE' } })
    expect(mocks.curriculumElement.findMany.mock.calls[0][0].where).toEqual({ scopeId: scope.id, versionId: input.curriculumVersionId })
  })
  it('no revela asignaciones de otro docente/escuela', async () => {
    mocks.sectionSubject.findFirst.mockResolvedValue(null)
    await expect(new EvaluationInstrumentsService().recommend(user, input)).rejects.toThrow('Asignatura no disponible')
    expect(mocks.curriculumVersion.findUnique).not.toHaveBeenCalled()
  })
  it('roles no docentes rechazados incluso llamando al servicio directamente', async () => {
    await expect(new EvaluationInstrumentsService().recommend({ ...user, roles: ['parent'] }, input)).rejects.toThrow('Rol no autorizado')
    expect(mocks.sectionSubject.findFirst).not.toHaveBeenCalled()
  })
  it('administrador limitado a su escuela', async () => {
    await new EvaluationInstrumentsService().recommend({ ...user, roles: ['admin'] }, input)
    expect(mocks.sectionSubject.findFirst.mock.calls[0][0].where).toEqual({ id: input.sectionSubjectId, schoolId: user.schoolId, status: 'ACTIVE' })
  })
  it.each(['subject', 'section', 'grade', 'schoolYear'] as const)('rechaza relación %s de otra escuela o inactiva', async key => {
    const row = assignment(); row[key].schoolId = 'other'
    mocks.sectionSubject.findFirst.mockResolvedValue(row)
    await expect(new EvaluationInstrumentsService().recommend(user, input)).rejects.toThrow('Contexto académico inconsistente')
  })
  it('rechaza ámbito arbitrario aun perteneciendo a la misma versión', async () => {
    await expect(new EvaluationInstrumentsService().recommend(user, { ...input, curriculumScopeId: 'other-grade' })).rejects.toThrow('ámbito solicitado')
    expect(mocks.curriculumElement.findMany).not.toHaveBeenCalled()
  })
  it('DRAFT solo explícito; sin publicación entrega fallback', async () => {
    const result = await new EvaluationInstrumentsService().recommend(user, { ...input, curriculumVersionId: undefined })
    expect(result.curriculumScopeId).toBeNull()
    expect(result.internalTrace.mappingStatus).toBe('NO_PUBLISHED_VERSION')
    expect(mocks.curriculumVersion.findFirst.mock.calls[0][0].where.status).toBe('PUBLISHED')
  })
  it.each(['VALIDATION_FAILED', 'VALIDATED'])('rechaza versión %s', async status => {
    mocks.curriculumVersion.findUnique.mockResolvedValue({ id: input.curriculumVersionId, level: 'PRIMARY', status })
    await expect(new EvaluationInstrumentsService().recommend(user, input)).rejects.toThrow('Versión curricular incompatible')
  })
  it('rechaza versión de otro nivel', async () => {
    mocks.curriculumVersion.findUnique.mockResolvedValue({ id: input.curriculumVersionId, level: 'SECONDARY', status: 'DRAFT' })
    await expect(new EvaluationInstrumentsService().recommend(user, input)).rejects.toThrow('Versión curricular incompatible')
  })
  it('mapping desactualizado no vence al grado real', async () => {
    mocks.curriculumSubjectMapping.findMany.mockResolvedValue([{ scopeId: 'wrong-scope' }])
    const result = await new EvaluationInstrumentsService().recommend(user, input)
    expect(result.internalTrace.mappingStatus).toBe('CONFLICT')
    expect(result.selectedCurriculumElements).toEqual([])
  })
  it('interpreta sin crear instrumento ni inventar una coincidencia curricular', async () => {
    const result = await new EvaluationInstrumentsService().interpret(user, { sectionSubjectId: input.sectionSubjectId,
      activityTitle: 'Exposición sobre el sistema respiratorio', curriculumVersionId: input.curriculumVersionId })
    expect(result.suggestedActivityType).toBe('EXPOSITION')
    expect(result.suggestedEvaluationTechnique).toBe('exposicion')
    expect(result.suggestedInstrumentType).toBe('rubrica')
    expect(result.curriculumMatch).toBe('NONE')
    expect(result.curriculumCandidates).toEqual([])
    expect(mocks.sectionSubject.findFirst).toHaveBeenCalledTimes(1)
  })
  it('interpretar y recomendar resuelven el mismo DRAFT local sin depender del orden de respuesta', async () => {
    mocks.curriculumVersion.findFirst.mockImplementation(async ({ where }) => where.status === 'DRAFT'
      ? { id: input.curriculumVersionId, level: 'PRIMARY', status: 'DRAFT' } : null)
    const interpretation = await new EvaluationInstrumentsService().interpret(user, { sectionSubjectId: input.sectionSubjectId,
      activityTitle: 'Actividad de ciencias' })
    expect(interpretation.curriculumVersionId).toBe(input.curriculumVersionId)
    const recommendation = await new EvaluationInstrumentsService().recommend(user, { ...input, curriculumVersionId: undefined })
    expect(recommendation.curriculumVersionId).toBe(interpretation.curriculumVersionId)
    expect(recommendation.curriculumScopeId).toBe(interpretation.curriculumScopeId)
  })
  it('rechaza una selección explícita fuera del contexto autorizado', async () => {
    await expect(new EvaluationInstrumentsService().recommend(user, { ...input,
      selectedCurriculumElementIds: ['f514ddf8-5fc0-5e85-a3d9-7ab344fea577'] })).rejects.toThrow('ajeno al ámbito')
  })
  it('catálogo ausente o alterado no se usa silenciosamente', async () => {
    mocks.evaluationCatalogRelease.findUnique.mockResolvedValue(null)
    await expect(new EvaluationInstrumentsService().recommend(user, input)).rejects.toThrow('Falta instalar')
    mocks.evaluationCatalogRelease.findUnique.mockResolvedValue({ payload: {} })
    await expect(new EvaluationInstrumentsService().recommend(user, input)).rejects.toThrow('difiere del seed')
  })
  it('convierte una tabla de catálogo ausente en 503 explícito', async () => {
    mocks.evaluationCatalogRelease.findUnique.mockRejectedValue(Object.assign(new Error('relation does not exist'), { code: 'P2021' }))
    await expect(new EvaluationInstrumentsService().recommend(user, input)).rejects.toMatchObject({ status: 503 })
  })
  it('seed idempotente; no sobrescribe release diferente', async () => {
    expect(await seedEvaluationCatalog(mocks as never)).toBe('UNCHANGED')
    expect(mocks.evaluationCatalogRelease.create).not.toHaveBeenCalled()
    mocks.evaluationCatalogRelease.findUnique.mockResolvedValue({ payload: {} })
    await expect(seedEvaluationCatalog(mocks as never)).rejects.toThrow('versión nueva')
  })
  it('tolera dos instaladores concurrentes sólo si el contenido coincide', async () => {
    mocks.evaluationCatalogRelease.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce({ payload: evaluationCatalogCurrent })
    mocks.evaluationCatalogRelease.create.mockRejectedValue(Object.assign(new Error('unique'), { code: 'P2002' }))
    await expect(seedEvaluationCatalog(mocks as never)).resolves.toBe('UNCHANGED')
  })
  it('valida DTO: contexto inyectado, límites, puntuaciones y tipos', async () => {
    expect(await validate(plainToInstance(RecommendInstrumentDto, input))).toEqual([])
    expect(await validate(plainToInstance(RecommendInstrumentDto, { ...input,
      selectedCurriculumElementIds: ['a62cbe26-6954-54f5-ba4b-ea8ba3b13bb9'] }))).toEqual([])
    for (const invalid of [{ maxScore: -1 }, { maxScore: 20.001 }, { maxScore: Infinity }, { participationMode: 'Individual' }, { pedagogicalActivityType: 'FAKE' }, { levelCount: 6 }, { curriculumScopeId: 'not-uuid' }, { activityTitle: '' }]) {
      expect((await validate(plainToInstance(RecommendInstrumentDto, { ...input, ...invalid }))).length).toBeGreaterThan(0)
    }
    expect((await validate(plainToInstance(RecommendInstrumentDto, { ...input, schoolId: 'attacker' }), { whitelist: true, forbidNonWhitelisted: true })).length).toBeGreaterThan(0)
  })
})
