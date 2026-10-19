import 'reflect-metadata'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { EvaluationInstrumentsService } from './evaluation-instruments.service'
import { RecommendInstrumentDto } from './recommend-instrument.dto'
import { evaluationCatalogCurrent } from './catalog-current'
import { diagnoseEvaluationCatalog, seedEvaluationCatalog } from './catalog-operations'
import grammar from '../../../../../data/evaluation-instruments/english-grade-one-grammar-contracts.json'
import fhrOne from '../../../../../data/evaluation-instruments/fhr-grade-one-contracts.json'
import fhrTwo from '../../../../../data/evaluation-instruments/fhr-grade-two-contracts.json'
import fhrThree from '../../../../../data/evaluation-instruments/fhr-grade-three-contracts.json'

const mocks = vi.hoisted(() => ({
  $queryRaw: vi.fn(),
  sectionSubject: { findFirst: vi.fn() }, evaluationCatalogRelease: { findUnique: vi.fn(), create: vi.fn() },
  curriculumVersion: { findUnique: vi.fn(), findFirst: vi.fn(), findMany: vi.fn() }, curriculumScope: { findMany: vi.fn() },
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
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('External AI calls disabled in tests')))
  mocks.$queryRaw.mockResolvedValue([{ identical: true }])
  mocks.sectionSubject.findFirst.mockResolvedValue(assignment())
  mocks.evaluationCatalogRelease.findUnique.mockResolvedValue({ payload: evaluationCatalogCurrent })
  mocks.curriculumVersion.findUnique.mockResolvedValue({ id: input.curriculumVersionId, level: 'PRIMARY', status: 'DRAFT' })
  mocks.curriculumVersion.findFirst.mockResolvedValue(null)
  mocks.curriculumVersion.findMany.mockResolvedValue([])
  mocks.curriculumScope.findMany.mockResolvedValue([scope])
  mocks.curriculumSubjectMapping.findMany.mockResolvedValue([])
  mocks.curriculumElement.findMany.mockResolvedValue([])
})
afterEach(() => { vi.unstubAllGlobals() })
describe('API service security and version policy', () => {
  it('diagnoses and seeds the new release without replacing installed historical releases', async () => {
    mocks.evaluationCatalogRelease.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(null)
    mocks.evaluationCatalogRelease.create.mockResolvedValue({})
    expect(await diagnoseEvaluationCatalog(mocks as never)).toEqual({ version: evaluationCatalogCurrent.version, status: 'MISSING' })
    expect(await seedEvaluationCatalog(mocks as never)).toBe('CREATED')
    expect(mocks.evaluationCatalogRelease.create.mock.calls[0][0].data.version).toBe(evaluationCatalogCurrent.version)
  })
  it('interprets an unspecified task using the selected technique while keeping an explicit evidence action dominant', async () => {
    const service = new EvaluationInstrumentsService()
    const result = await service.interpret(user, { sectionSubjectId: input.sectionSubjectId, activityTitle: 'Actividad', evaluationTechnique: 'debate' })
    expect(result.suggestedActivityType).toBe('DEBATE')
    expect(result.suggestedEvaluationTechnique).toBe('debate')
    const detected = await service.interpret(user, { sectionSubjectId: input.sectionSubjectId, activityTitle: 'Actividad',
      description: 'Elaborarán un informe sobre la práctica motriz.', evaluationTechnique: 'debate' })
    expect(detected.suggestedActivityType).toBe('REPORT')
  })
  it('consulta ámbito y mappings independientes en paralelo después de autorizar y validar el catálogo', async () => {
    let finish!: (value: typeof scope[]) => void
    mocks.curriculumScope.findMany.mockImplementation(() => new Promise(resolve => { finish = resolve }))
    const result = new EvaluationInstrumentsService().recommend(user, input)
    try {
      await vi.waitFor(() => expect(mocks.curriculumSubjectMapping.findMany).toHaveBeenCalled(), { timeout: 150 })
    } finally { finish([scope]) }
    await result
    expect(mocks.sectionSubject.findFirst.mock.invocationCallOrder[0]).toBeLessThan(mocks.$queryRaw.mock.invocationCallOrder[0])
    expect(mocks.$queryRaw.mock.invocationCallOrder[0]).toBeLessThan(mocks.curriculumScope.findMany.mock.invocationCallOrder[0])
  })
  const frenchSource = { id: 'french-version', level: 'SECONDARY', status: 'PUBLISHED', importMetadata: { subjectCodes: ['FRA'], commonOnly: true } }
  const secondary = (code: string) => {
    const row = assignment()
    row.grade.sequence = 3; row.grade.academicLevel.code = 'secundario'; row.grade.academicCycle.code = 'secundario_primer_ciclo'
    row.subject.code = code; row.subject.name = code === 'FRA' ? 'Francés' : code === 'ING' ? 'Inglés' : 'Lengua Española'
    return row
  }
  for(const [grade,fixture]of [[1,fhrOne],[2,fhrTwo],[3,fhrThree]] as const)for(const task of fixture.cases)it(`interpreta y recomienda FHR ${grade} con el mismo propósito: ${task.id}`,async()=>{
    const row=secondary('FHR');row.grade.sequence=grade;row.subject.name='Formación Integral Humana y Religiosa'
    mocks.sectionSubject.findFirst.mockResolvedValue(row)
    const service=new EvaluationInstrumentsService(),request={sectionSubjectId:input.sectionSubjectId,activityTitle:'Título antiguo sobre células',description:task.description}
    const interpreted=await service.interpret(user,request)
    const proposal=await service.recommend(user,{...request,maxScore:17.35,participationMode:'INDIVIDUAL'})
    expect(interpreted.suggestedActivityType).toBe(task.activityType)
    expect(interpreted.suggestedActivityType).toBe(proposal.activityType)
    expect(interpreted.suggestedInstrumentType).toBe(proposal.instrumentType)
    if(task.activityType==='PORTFOLIO')expect(interpreted.suggestedEvaluationTechnique).toBe('portafolio')
    if(task.id==='dialogue-frequency')expect(interpreted.suggestedEvaluationTechnique).toBe('observacion-sistematica')
  })
  it('conserva la fuente literal pero excluye recursos y rasgos personales de los referentes evaluables',async()=>{
    const row=secondary('SOC');row.grade.sequence=1;row.subject.name='Ciencias Sociales'
    const socialScope={...scope,id:'social-scope',versionId:'social-version',grade:1,cycle:1,areaName:'Ciencias Sociales',subjectName:'Ciencias Sociales'}
    mocks.sectionSubject.findFirst.mockResolvedValue(row)
    mocks.curriculumVersion.findFirst.mockResolvedValue({id:'social-version',level:'SECONDARY',status:'PUBLISHED',importMetadata:{subjectCodes:['SOC'],grades:[1],commonOnly:true,excludedAssessmentElementIds:['personal-disposition']}})
    mocks.curriculumScope.findMany.mockResolvedValue([socialScope])
    mocks.curriculumElement.findMany.mockResolvedValue([
      {id:'personal-disposition',versionId:'social-version',scopeId:socialScope.id,elementType:'PROCEDURE',originalText:'Demostración de interés por observar el espacio geográfico',normalizedText:'demostracion interes observar espacio geografico',sourceSpans:[]},
      {id:'source-reliability',versionId:'social-version',scopeId:socialScope.id,elementType:'PROCEDURE',originalText:'Identificación de fuentes confiables para el estudio geográfico',normalizedText:'identificacion fuentes confiables estudio geografico',sourceSpans:[]},
    ])
    const service=new EvaluationInstrumentsService(),request={...input,curriculumVersionId:undefined,activityTitle:'Actividad',description:'Identifica las fuentes confiables para el estudio geográfico.'}
    const interpreted=await service.interpret(user,request)
    expect(interpreted.curriculumCandidates.some(c=>c.elementId==='personal-disposition')).toBe(false)
    await expect(service.recommend(user,{...request,selectedCurriculumElementIds:['personal-disposition']})).rejects.toThrow('Elemento curricular ajeno al ámbito autorizado')
    expect(mocks.curriculumElement.findMany).toHaveBeenCalled()
  })
  for (const code of ['ING', 'LEN']) it(`una fuente exclusiva de Francés no cambia el contexto curricular de ${code}`, async () => {
    mocks.sectionSubject.findFirst.mockResolvedValue(secondary(code))
    mocks.curriculumVersion.findFirst.mockResolvedValue(frenchSource)
    mocks.curriculumVersion.findMany.mockResolvedValue([frenchSource])
    const result = await new EvaluationInstrumentsService().recommend(user, { ...input, curriculumVersionId: undefined })
    expect(result.curriculumVersionId).toBeNull()
  })
  it('interpreta la acción científica indicada en la evidencia dedicada sin depender del título', async () => {
    const row=secondary('NAT-FIS')
    row.grade.sequence=6;row.grade.academicCycle.code='secundario_segundo_ciclo';row.subject.name='Ciencias de la Naturaleza: Física'
    mocks.sectionSubject.findFirst.mockResolvedValue(row)
    const result=await new EvaluationInstrumentsService().interpret(user,{sectionSubjectId:input.sectionSubjectId,activityTitle:'Actividad',description:'Usa la información proporcionada.',evidenceInstructions:'Calcula la corriente mediante la ley de Ohm con los datos proporcionados.'})
    expect(result.suggestedActivityType).toBe('EXERCISE_SET')
  })
  it('mantiene una versión global anterior compatible con Inglés', async () => {
    mocks.sectionSubject.findFirst.mockResolvedValue(secondary('ING'))
    mocks.curriculumVersion.findFirst.mockResolvedValue(frenchSource)
    mocks.curriculumVersion.findMany.mockResolvedValue([frenchSource, { id: 'global-version', level: 'SECONDARY', status: 'PUBLISHED' }])
    const result = await new EvaluationInstrumentsService().recommend(user, { ...input, curriculumVersionId: undefined })
    expect(result.curriculumVersionId).toBe('global-version')
  })
  it('selecciona la fuente francesa para Francés común', async () => {
    mocks.sectionSubject.findFirst.mockResolvedValue(secondary('FRA'))
    mocks.curriculumVersion.findFirst.mockResolvedValue(frenchSource)
    const result = await new EvaluationInstrumentsService().recommend(user, { ...input, curriculumVersionId: undefined })
    expect(result.curriculumVersionId).toBe('french-version')
  })
  it('rechaza forzar una fuente francesa en otra asignatura', async () => {
    mocks.sectionSubject.findFirst.mockResolvedValue(secondary('ING'))
    mocks.curriculumVersion.findUnique.mockResolvedValue(frenchSource)
    await expect(new EvaluationInstrumentsService().recommend(user, input)).rejects.toThrow('Versión curricular incompatible')
  })
  it('no selecciona la fuente común para una salida optativa', async () => {
    mocks.sectionSubject.findFirst.mockResolvedValue({ ...secondary('FRA'), curriculumContext: { optativeExitName: 'Humanidades' } })
    mocks.curriculumVersion.findFirst.mockResolvedValue(frenchSource)
    mocks.curriculumVersion.findMany.mockResolvedValue([frenchSource])
    const result = await new EvaluationInstrumentsService().recommend(user, { ...input, curriculumVersionId: undefined })
    expect(result.curriculumVersionId).toBeNull()
  })
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
    mocks.$queryRaw.mockResolvedValue([])
    await expect(new EvaluationInstrumentsService().recommend(user, input)).rejects.toThrow('Falta instalar')
    mocks.$queryRaw.mockResolvedValue([{ identical: false }])
    await expect(new EvaluationInstrumentsService().recommend(user, input)).rejects.toThrow('difiere del seed')
  })
  it('convierte una tabla de catálogo ausente en 503 explícito', async () => {
    mocks.$queryRaw.mockRejectedValue(Object.assign(new Error('relation does not exist'), { code: 'P2010', meta: { code: '42P01' } }))
    await expect(new EvaluationInstrumentsService().recommend(user, input)).rejects.toMatchObject({ status: 503 })
  })
  it('compara todo el payload mediante parámetros sin descargarlo por petición', async () => {
    await new EvaluationInstrumentsService().recommend(user, input)
    expect(mocks.evaluationCatalogRelease.findUnique).not.toHaveBeenCalled()
    const [query, payload, version] = mocks.$queryRaw.mock.calls[0]
    expect(query.join('?')).toContain('payload = ?::jsonb')
    expect(JSON.parse(payload)).toEqual(evaluationCatalogCurrent)
    expect(version).toBe(evaluationCatalogCurrent.version)
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

describe('bounded AI wording refinement', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    vi.stubEnv('NODE_ENV', 'test')
    vi.stubEnv('DEEPSEEK_API_KEY', 'placeholder-test-key')
  })
  afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs() })

  async function baseline() { return new EvaluationInstrumentsService().recommend(user, input) }
  async function refineWith(payload: unknown) {
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => ({ choices: [{ message: { content: JSON.stringify(payload) } }] }) } as Response)
    vi.stubEnv('NODE_ENV', 'production')
    return new EvaluationInstrumentsService().recommend(user, input)
  }
  const wording = (result: Awaited<ReturnType<typeof baseline>>) => ({ criteria: result.criteria.map(criterion => ({
    id: criterion.id, title: 'Criterio revisado', description: 'Evidencia revisada y observable.',
    descriptors: criterion.descriptors.map(() => 'Desempeño revisado.'), maxScoreUnits: 99999,
    sourceType: 'CURRICULUM_DERIVED', sourceReferences: [{ elementId: 'invented' }],
  })) })

  it('copies only wording and preserves scores, IDs, sources and descriptor metadata', async () => {
    const original = await baseline()
    const refined = await refineWith(wording(original))
    expect(refined.criteria.map(criterion => criterion.title)).toEqual(original.criteria.map(() => 'Criterio revisado'))
    for (const [index, criterion] of refined.criteria.entries()) {
      expect({ ...criterion, title: original.criteria[index].title, description: original.criteria[index].description,
        descriptors: criterion.descriptors.map((descriptor, i) => ({ ...descriptor, text: original.criteria[index].descriptors[i].text })) }).toEqual(original.criteria[index])
    }
    expect(refined.totalScoreUnits).toBe(2000)
  })
  it.each(['duplicate', 'unknown', 'wrong-title-type', 'blank-description', 'wrong-descriptor-type', 'descriptor-count'])(
    'keeps the deterministic result for an incompatible %s response', async failure => {
      const original = await baseline()
      const payload = wording(original)
      if (failure === 'duplicate') payload.criteria[1].id = payload.criteria[0].id
      if (failure === 'unknown') payload.criteria[0].id = 'invented'
      if (failure === 'wrong-title-type') Object.assign(payload.criteria[0], { title: 42 })
      if (failure === 'blank-description') payload.criteria[0].description = '  '
      if (failure === 'wrong-descriptor-type') Object.assign(payload.criteria[0], { descriptors: [null, null, null, null] })
      if (failure === 'descriptor-count') payload.criteria[0].descriptors.pop()
      expect(await refineWith(payload)).toEqual(original)
    })
  it.each(['http', 'timeout', 'malformed-json'])('keeps the deterministic result when the API fails with %s', async failure => {
    const original = await baseline()
    if (failure === 'http') vi.mocked(fetch).mockResolvedValue({ ok: false, status: 503 } as Response)
    if (failure === 'timeout') vi.mocked(fetch).mockRejectedValue(new Error('Timeout'))
    if (failure === 'malformed-json') vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => ({ choices: [{ message: { content: '{' } }] }) } as Response)
    vi.stubEnv('NODE_ENV', 'production')
    expect(await new EvaluationInstrumentsService().recommend(user, input)).toEqual(original)
  })
  it.each(['curriculum-derived', 'authored-without-progression', 'progression'])('preserves %s criteria while refining generic wording', async protection => {
    const original = await baseline()
    if (protection === 'curriculum-derived') original.criteria[0].sourceType = 'CURRICULUM_DERIVED'
    if (protection === 'authored-without-progression') original.criteria[0].templateId = 'authored-without-progression'
    if (protection === 'progression') original.criteria[0].progressionLevels = ['Completo', 'Principal', 'Parcial', 'Escaso', 'Sin evidencia']
    const payload = wording(original); payload.criteria.shift()
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => ({ choices: [{ message: { content: JSON.stringify(payload) } }] }) } as Response)
    vi.stubEnv('NODE_ENV', 'production')
    const refiner = new EvaluationInstrumentsService() as unknown as { refineWithAi?: (result: typeof original, request: typeof input, context: null) => Promise<typeof original> }
    const result = await (refiner.refineWithAi?.(original, input, null) ?? original)
    expect(result.criteria[0]).toEqual(original.criteria[0])
    expect(result.criteria.slice(1).every(criterion => criterion.title === 'Criterio revisado')).toBe(true)
  })
  it('validates additional candidate pools without enforcing final instrument capacity', async () => {
    const original = await baseline()
    original.criteria = Array.from({ length: 21 }, (_, index) => ({ ...original.criteria[0], id: `candidate-${index}`, maxScore: 1, maxScoreUnits: 100 }))
    original.totalScore = 21; original.totalScoreUnits = 2100
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => ({ choices: [{ message: { content: JSON.stringify(wording(original)) } }] }) } as Response)
    vi.stubEnv('NODE_ENV', 'production')
    const request = { ...input, maxScore: 21, includeAdditionalCandidates: true }
    const refiner = new EvaluationInstrumentsService() as unknown as { refineWithAi?: (result: typeof original, requestInput: typeof request, context: null) => Promise<typeof original> }
    const result = await (refiner.refineWithAi?.(original, request, null) ?? original)
    expect(result.criteria).toHaveLength(21)
    expect(result.criteria.every(criterion => criterion.title === 'Criterio revisado')).toBe(true)
  })
})
