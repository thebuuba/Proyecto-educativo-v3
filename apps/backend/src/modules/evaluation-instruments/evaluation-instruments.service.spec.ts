import 'reflect-metadata'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { EvaluationInstrumentsService } from './evaluation-instruments.service'
import { RecommendInstrumentDto } from './recommend-instrument.dto'
import { evaluationCatalogV1 } from './catalog-v1'
import { seedEvaluationCatalog } from './catalog-operations'

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
  mocks.evaluationCatalogRelease.findUnique.mockResolvedValue({ payload: evaluationCatalogV1 })
  mocks.curriculumVersion.findUnique.mockResolvedValue({ id: input.curriculumVersionId, level: 'PRIMARY', status: 'DRAFT' })
  mocks.curriculumVersion.findFirst.mockResolvedValue(null)
  mocks.curriculumScope.findMany.mockResolvedValue([scope])
  mocks.curriculumSubjectMapping.findMany.mockResolvedValue([])
  mocks.curriculumElement.findMany.mockResolvedValue([])
})
describe('API service security and version policy', () => {
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
  it('catálogo ausente o alterado no se usa silenciosamente', async () => {
    mocks.evaluationCatalogRelease.findUnique.mockResolvedValue(null)
    await expect(new EvaluationInstrumentsService().recommend(user, input)).rejects.toThrow('Falta instalar')
    mocks.evaluationCatalogRelease.findUnique.mockResolvedValue({ payload: {} })
    await expect(new EvaluationInstrumentsService().recommend(user, input)).rejects.toThrow('difiere del seed')
  })
  it('seed idempotente; no sobrescribe release diferente', async () => {
    expect(await seedEvaluationCatalog(mocks as never)).toBe('UNCHANGED')
    expect(mocks.evaluationCatalogRelease.create).not.toHaveBeenCalled()
    mocks.evaluationCatalogRelease.findUnique.mockResolvedValue({ payload: {} })
    await expect(seedEvaluationCatalog(mocks as never)).rejects.toThrow('versión nueva')
  })
  it('valida DTO: contexto inyectado, límites, puntuaciones y tipos', async () => {
    expect(await validate(plainToInstance(RecommendInstrumentDto, input))).toEqual([])
    for (const invalid of [{ maxScore: -1 }, { maxScore: 20.001 }, { maxScore: Infinity }, { participationMode: 'Individual' }, { pedagogicalActivityType: 'FAKE' }, { levelCount: 6 }, { curriculumScopeId: 'not-uuid' }, { activityTitle: '' }]) {
      expect((await validate(plainToInstance(RecommendInstrumentDto, { ...input, ...invalid }))).length).toBeGreaterThan(0)
    }
    expect((await validate(plainToInstance(RecommendInstrumentDto, { ...input, schoolId: 'attacker' }), { whitelist: true, forbidNonWhitelisted: true })).length).toBeGreaterThan(0)
  })
})
