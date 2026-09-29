import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'
import { evaluationCatalogV1 } from './catalog-v1'
import { academicContext, resolveScope, type AcademicContext, type ScopeCandidate } from './curriculum-context'
import { recommend, distributeScore, detectActivityType, similarToken, rankCurriculum, assertValidRecommendation, type RankedElement } from './recommendation-engine'

const root = resolve(process.cwd(), '../..')
const cases = JSON.parse(readFileSync(resolve(root, 'data/evaluation-instruments/cases-v1.json'), 'utf8')) as { case: string; level: 'PRIMARY' | 'SECONDARY'; grade: number; code: string; subject: string; exit?: string; activityTitle: string; description?: string; maxScore: number; expectedInstrument: string }[]
const rows = ['primary', 'secondary'].flatMap(level => readFileSync(resolve(root, `data/curriculum/${level}-2023.jsonl`), 'utf8').trim().split('\n').map(line => JSON.parse(line)))
const scopes = rows.filter(r => r.kind === 'scope')
const elements: RankedElement[] = rows.filter(r => r.kind === 'element').map(r => ({ elementId: r.id, scopeId: scopes.find(s => s.stableKey === r.scopeKey).id,
  versionId: r.versionId, type: r.type, text: r.originalText, normalizedText: r.normalizedText,
  sources: [{ documentId: r.source.documentId, pdfPage: r.source.pdfPage, printedPage: r.source.printedPage }] }))
function run(fixture = cases[1], options = {}) {
  const context: AcademicContext = { level: fixture.level, grade: fixture.grade, cycle: fixture.grade <= 3 ? 1 : 2, subjectCode: fixture.code, subjectName: fixture.subject, optativeExitName: fixture.exit ?? null, modalityCode: 'academic' }
  const resolution = resolveScope(context, scopes.filter(s => s.level === fixture.level))
  const result = recommend({ ...fixture, participationMode: 'INDIVIDUAL', ...options }, context, resolution.scope, elements, resolution.status, 'DRAFT')
  return { context, resolution, result }
}
describe('Recomendador con currículo literal completo', () => {
  for (const fixture of cases) it(`caso real ${fixture.case}: contexto, instrumento y trazabilidad`, () => {
    const { result, resolution } = run(fixture)
    expect(resolution.status).toBe('RESOLVED')
    expect(result.instrumentType).toBe(fixture.expectedInstrument)
    expect(result.criteria.length).toBeGreaterThanOrEqual(3)
    expect(result.criteria.length).toBeLessThanOrEqual(fixture.case === 'A' ? 4 : 6)
    expect(result.criteria.reduce((sum, c) => sum + c.maxScoreUnits, 0)).toBe(fixture.maxScore * 100)
    for (const reference of result.selectedCurriculumElements) {
      expect(reference.scopeId).toBe(resolution.scope!.id)
      expect(reference.sources[0].pdfPage).toBeGreaterThan(0)
      expect(elements.find(e => e.elementId === reference.elementId)?.text).toBe(reference.text)
    }
    for (const criterion of result.criteria) {
      if (criterion.sourceType === 'ACTIVITY_TEMPLATE') expect(criterion.sourceReferences).toEqual([])
      if (criterion.sourceType === 'CURRICULUM_DERIVED') expect(criterion.description).toBe(criterion.sourceReferences[0].text)
    }
  })
  it('B: cinco criterios, cuatro niveles y 20 puntos', () => {
    const { result } = run()
    expect(result.criteria).toHaveLength(5)
    expect(result.levels).toHaveLength(4)
    // Circulatory content exists in other grades, not this exact 5th-grade scope.
    expect(result.confidence).toBe('LOW')
    expect(result.selectedCurriculumElements).toEqual([])
    expect(result.criteria.map(c => c.templateId)).toEqual(expect.arrayContaining(['science-content', 'science-accuracy', 'organization', 'communication']))
  })
  it('C/D/E/F/G: dimensiones disciplinares pertinentes', () => {
    const expected = { C: ['math-procedure', 'math-reasoning', 'math-accuracy', 'math-interpretation'], D: ['science-procedure', 'science-safety', 'science-data', 'science-interpretation', 'science-conclusion'], E: ['language-content', 'language-structure', 'language-coherence', 'language-argument', 'language-correctness'], F: ['art-technique', 'art-creativity', 'art-composition', 'art-materials'], G: ['language-expression', 'language-structure'] }
    for (const [key, ids] of Object.entries(expected)) expect(run(cases.find(c => c.case === key)!).result.criteria.map(c => c.templateId)).toEqual(expect.arrayContaining(ids))
  })
  it('aislamiento: inyectar todo el currículo no incorpora otro grado o salida', () => {
    for (const fixture of cases) {
      const { result, resolution } = run(fixture)
      const allowed = new Set(elements.filter(e => e.scopeId === resolution.scope!.id).map(e => e.elementId))
      expect(result.internalTrace.ranking.every(r => allowed.has(r.elementId))).toBe(true)
      expect(result.selectedCurriculumElements.every(e => e.scopeId === resolution.scope!.id)).toBe(true)
    }
    expect(run(cases[6]).resolution.scope!.optativeExitName).toBe('Humanidades y Lenguas Modernas')
    expect(run({ ...cases[6], code: 'OPT-HCS-LEN-4', exit: 'Humanidades y Ciencias Sociales' }).resolution.scope!.id).not.toBe(run(cases[6]).resolution.scope!.id)
  })
  it('no resuelve homónimos sin salida ni usando mapping revisado para ocultar ambigüedad', () => {
    const { context, resolution } = run(cases[6])
    const ambiguous = resolveScope({ ...context, subjectCode: 'CUSTOM-1', optativeExitName: null }, scopes, [resolution.scope!.id])
    expect(ambiguous.status).toBe('AMBIGUOUS'); expect(ambiguous.scope).toBeNull()
  })
  it('rechaza contradicciones de código, modalidad y salida', () => {
    const { context } = run(cases[6])
    expect(resolveScope({ ...context, grade: 5 }, scopes).status).toBe('CONFLICT')
    expect(resolveScope({ ...context, optativeExitName: 'Ciencias y Tecnología' }, scopes).status).toBe('CONFLICT')
    expect(resolveScope({ ...context, modalityCode: 'arts' }, scopes).status).toBe('UNSUPPORTED_MODALITY')
    expect(resolveScope({ ...context, modalityCode: null }, scopes).status).toBe('INCOMPLETE_CONTEXT')
  })
  it('normaliza secuencias locales/globales; rechaza ciclos incompatibles y niveles textuales', () => {
    const grade = { sequence: 11, academicLevel: { id: 'secondary', code: 'secundario' }, academicCycle: { levelId: 'secondary', code: 'secundario_segundo_ciclo' }, defaultModality: null }
    expect(academicContext(grade, { code: 'NAT-QUI', name: 'Ciencias' }, null)?.grade).toBe(5)
    expect(academicContext({ ...grade, sequence: 5 }, { code: 'NAT-QUI', name: 'Ciencias' }, null)?.grade).toBe(5)
    expect(academicContext({ ...grade, sequence: 2 }, { code: 'NAT-QUI', name: 'Ciencias' }, null)).toBeNull()
    expect(academicContext({ ...grade, academicLevel: null }, { code: 'NAT-QUI', name: 'Ciencias' }, null)).toBeNull()
  })
  it('fallback sin referencias inventadas; participación grupal no agrega actitudes', () => {
    const { result } = run(cases[1], { activityTitle: 'Exposición sobre zzzqqq', participationMode: 'GROUP' })
    expect(result.confidence).toBe('LOW'); expect(result.selectedCurriculumElements).toEqual([])
    expect(result.criteria.every(c => c.sourceType !== 'CURRICULUM_DERIVED' && !c.sourceReferences.length)).toBe(true)
    expect(result.evidenceTypes).not.toContain('ATTITUDE')
  })
  it('tolera tildes/caso/plurales, selección explícita y escalas configurables', () => {
    expect(run(cases[1], { activityTitle: 'EXPOSICION sobre el SISTEMA CIRCULATORIO' }).result).toEqual(run().result)
    expect(run(cases[1], { pedagogicalActivityType: 'OBSERVATION' }).result.activityType).toBe('OBSERVATION')
    expect(run(cases[1], { levelCount: 5 }).result.levels.map(l => l.label)).toEqual(evaluationCatalogV1.descriptorPatterns.scales[5])
    expect(() => run(cases[1], { pedagogicalActivityType: 'INVALID' })).toThrow()
  })
  it('tolera erratas acotadas sin modificar el título original', () => {
    for (const [left, right] of [['sitema', 'sistema'], ['respiracoin', 'respiracion'], ['ecositema', 'ecosistema'], ['fraciones', 'fracciones'], ['experimeto', 'experimento']]) expect(similarToken(left, right)).toBe(true)
    expect(similarToken('sitema', 'poema')).toBe(false)
    expect(detectActivityType('Experimeto de laboratorio', '').id).toBe('EXPERIMENT')
    expect(detectActivityType('Experimeto sobre plantas', '').id).toBe('EXPERIMENT')
    const typo = run(cases[1], { activityTitle: 'Exposición sobre el sitema circulatorio' }).result
    expect(typo.confidence).toBe('LOW')
    expect(typo.selectedCurriculumElements).toEqual([])
  })
  it('prioriza la evidencia nombrada en el título frente a menciones de la descripción', () => {
    expect(detectActivityType('Informe científico sobre reacciones químicas', 'Describir los datos del experimento').id).toBe('REPORT')
    expect(detectActivityType('Investigación sobre terremotos', 'Preparar una exposición final').id).toBe('RESEARCH')
    expect(detectActivityType('Actividad', 'Resolver problemas con fracciones').id).toBe('PROBLEM_SOLVING')
  })
  it('reconoce familias representativas y erratas acotadas sin reinterpretar otros títulos', () => {
    const examples = [
      ['Exposición oral', 'EXPOSITION'], ['Debate del tema', 'DEBATE'], ['Experimento de densidad', 'EXPERIMENT'],
      ['Práctica de laboratorio', 'LAB_PRACTICE'], ['Ensayo literario', 'ESSAY'], ['Informe científico', 'REPORT'],
      ['Investigación histórica', 'RESEARCH'], ['Proyecto escolar', 'PROJECT'],
      ['Resolución de problemas', 'PROBLEM_SOLVING'], ['Producción escrita', 'WRITTEN_PRODUCTION'],
      ['Pintura cultural', 'ARTISTIC_PRODUCTION'], ['Observación de plantas', 'OBSERVATION'],
      ['Cuestionario de lectura', 'QUIZ_TEST'], ['Actividad sin marcador pedagógico', 'OTHER'],
      ['Deabte sobre ciudadanía', 'DEBATE'], ['Experimeto de densidad', 'EXPERIMENT'],
    ] as const
    for (const [title, expected] of examples) expect(detectActivityType(title, '').id, title).toBe(expected)
  })
  it('solo selecciona referencias explícitas del scope vigente; conserva la elección de instrumento', () => {
    const { context, resolution } = run(cases[2])
    const within = elements.find(element => element.scopeId === resolution.scope!.id)!
    const result = recommend({ activityTitle: 'Actividad', maxScore: 18.75, participationMode: 'GROUP',
      selectedCurriculumElementIds: [within.elementId], preferredInstrumentType: 'escala' }, context, resolution.scope, elements, resolution.status, 'DRAFT')
    expect(result.instrumentType).toBe('escala')
    expect(result.participationMode).toBe('GROUP')
    expect(result.selectedCurriculumElements.map(element => element.elementId)).toEqual([within.elementId])
    expect(result.criteria.reduce((total, criterion) => total + criterion.maxScoreUnits, 0)).toBe(1875)
    const foreign = elements.find(element => element.scopeId !== resolution.scope!.id)!
    expect(() => recommend({ activityTitle: 'Actividad', maxScore: 20, participationMode: 'INDIVIDUAL',
      selectedCurriculumElementIds: [foreign.elementId] }, context, resolution.scope, elements, resolution.status, 'DRAFT')).toThrow()
    expect(rankCurriculum('fraciones', '', 'EXERCISE_SET', undefined, resolution.scope, elements).every(item => item.element.scopeId === resolution.scope!.id)).toBe(true)
  })
  it('combina título y descripción; una descripción específica rescata un título genérico sin cruzar scope', () => {
    const fixture = cases[2]
    const { resolution } = run(fixture)
    const local: RankedElement = { elementId: 'local', scopeId: resolution.scope!.id, versionId: resolution.scope!.versionId,
      type: 'CONCEPT', text: 'Fracciones equivalentes', normalizedText: 'fracciones equivalentes', sources: [] }
    const foreign = { ...local, elementId: 'foreign', scopeId: 'otro-scope' }
    const ranked = rankCurriculum('Actividad', 'Resolver fraciones equivalentes', 'PROBLEM_SOLVING', undefined, resolution.scope, [foreign, local])
    expect(ranked.map(item => item.element.elementId)).toEqual(['local'])
    expect(ranked[0].topicCoverage).toBeGreaterThan(0)
    const unrelated = rankCurriculum('Actividad', 'Tema desconocido', 'PROBLEM_SOLVING', undefined, resolution.scope, [foreign, local])
    expect(unrelated).toEqual([])
  })
  it('reparto entero exacto para 10.000 combinaciones', () => {
    for (let units = 1; units <= 10000; units++) expect(distributeScore(units / 100, [5, 5, 4, 3, 3]).reduce((a, b) => a + b, 0)).toBe(units)
    expect(distributeScore(20, [5, 4, 4, 4, 3])).toEqual([500, 400, 400, 400, 300])
    expect(distributeScore(18.5, [5, 4, 4, 4, 3]).every(units => units % 50 === 0)).toBe(true)
    expect(distributeScore(5, [5, 4, 4, 4, 3]).every(units => units > 0)).toBe(true)
    for (const value of [NaN, Infinity, -1, 0, 1.001]) expect(() => distributeScore(value, [1, 2])).toThrow()
  })
  it('prepara una rúbrica contextualizada para una exposición de biodiversidad aun con descripción mínima', () => {
    const context: AcademicContext = { level: 'SECONDARY', cycle: 1, grade: 1, subjectCode: 'NAT-BIO', subjectName: 'Ciencias de la Naturaleza', optativeExitName: null, modalityCode: 'academic' }
    const result = recommend({ activityTitle: 'Exposición sobre la biodiversidad', description: '', maxScore: 20, participationMode: 'INDIVIDUAL' }, context, null, [], 'UNMAPPED', null)
    expect(result.instrumentType).toBe('rubrica')
    expect(result.criteria.length).toBeGreaterThanOrEqual(4)
    expect(result.criteria.every(criterion => criterion.title.trim() && criterion.description.trim())).toBe(true)
    expect(result.criteria.some(criterion => /biodiversidad/i.test(`${criterion.title} ${criterion.description}`))).toBe(true)
    expect(result.criteria.every(criterion => criterion.descriptors.length === 4 && criterion.descriptors.every(descriptor => descriptor.text.trim()))).toBe(true)
    expect(result.criteria.reduce((total, criterion) => total + criterion.maxScoreUnits, 0)).toBe(2000)
    expect(result.confidence).toBe('LOW')
    expect(result.selectedCurriculumElements).toEqual([])
  })
  it.each([
    ['Exposición sobre la biodiversidad', 'Ciencias de la Naturaleza', 'NAT', 'EXPOSITION', 'rubrica', /biodiversidad/i],
    ['Experimento sobre densidad', 'Ciencias de la Naturaleza', 'NAT', 'EXPERIMENT', 'rubrica', /densidad/i],
    ['Resolución de problemas con fracciones', 'Matemática', 'MAT', 'PROBLEM_SOLVING', 'lista-ponderada', /fracciones/i],
    ['Producción de un cuento corto', 'Lengua Española', 'LEN', 'WRITTEN_PRODUCTION', 'rubrica', /cuento corto/i],
    ['Pintura sobre identidad cultural', 'Educación Artística', 'ART', 'ARTISTIC_PRODUCTION', 'rubrica', /identidad cultural/i],
    ['Investigación sobre las migraciones', 'Ciencias Sociales', 'SOC', 'RESEARCH', 'rubrica', /migraciones/i],
  ])('genera contenido disciplinar válido para %s', (activityTitle, subjectName, subjectCode, activityType, instrumentType, topic) => {
    const context: AcademicContext = { level: 'SECONDARY', cycle: 1, grade: 2, subjectCode, subjectName, optativeExitName: null, modalityCode: 'academic' }
    const result = recommend({ activityTitle, description: '', maxScore: 20, participationMode: 'INDIVIDUAL' }, context, null, [], 'UNMAPPED', null)
    expect(result.activityType).toBe(activityType)
    expect(result.instrumentType).toBe(instrumentType)
    expect(result.criteria.length).toBeGreaterThanOrEqual(4)
    expect(JSON.stringify(result.criteria)).toMatch(topic)
    expect(result.criteria.every(item => item.title.trim() && item.description.trim())).toBe(true)
    expect(result.criteria.reduce((sum, item) => sum + item.maxScoreUnits, 0)).toBe(2000)
    expect(result.selectedCurriculumElements).toEqual([])
  })
  it('rechaza internamente recomendaciones incompletas antes de responder', () => {
    const context: AcademicContext = { level: 'SECONDARY', cycle: 1, grade: 2, subjectCode: 'NAT', subjectName: 'Ciencias de la Naturaleza', optativeExitName: null, modalityCode: 'academic' }
    const result = recommend({ activityTitle: 'Exposición sobre biodiversidad', maxScore: 20, participationMode: 'INDIVIDUAL' }, context, null, [], 'UNMAPPED', null)
    const broken = structuredClone(result)
    broken.criteria[0].descriptors[0].text = ''
    expect(() => assertValidRecommendation(broken)).toThrow('descriptor')
  })
  it('contextualiza una exposición de volcanes sin atribuir currículo no verificado', () => {
    const context: AcademicContext = { level: 'SECONDARY', cycle: 1, grade: 1, subjectCode: 'NAT-TIE', subjectName: 'Ciencias de la Tierra y el Universo', optativeExitName: null, modalityCode: 'academic' }
    const result = recommend({ activityTitle: 'Exposición sobre los volcanes', description: 'Los estudiantes realizarán una exposición sobre los volcanes en la que explicarán cómo se forman, identificarán sus partes principales y describirán sus características. Utilizarán imágenes o recursos visuales para apoyar sus explicaciones y emplearán vocabulario científico adecuado.', maxScore: 20, participationMode: 'INDIVIDUAL' }, context, null, [], 'UNMAPPED', null)
    expect(result.instrumentType).toBe('rubrica')
    expect(result.criteria).toHaveLength(5)
    expect(result.criteria.map(criterion => criterion.title)).toEqual(expect.arrayContaining([expect.stringMatching(/forman los volcanes/), expect.stringMatching(/partes principales/), expect.stringMatching(/Precisión científica/), expect.stringMatching(/recursos de apoyo/)]))
    expect(result.criteria[0].descriptors[0].text).toMatch(/cómo se forman los volcanes/)
    expect(result.criteria.every(criterion => criterion.sourceType !== 'CURRICULUM_DERIVED' && criterion.sourceReferences.length === 0)).toBe(true)
    expect(result.criteria.reduce((total, criterion) => total + criterion.maxScoreUnits, 0)).toBe(2000)
    expect(result.criteria.every(criterion => criterion.maxScoreUnits % 100 === 0)).toBe(true)
  })
  it('extrae aspectos concretos de una descripción de volcanes sin fuente curricular falsa', () => {
    const context: AcademicContext = { level: 'SECONDARY', cycle: 1, grade: 1, subjectCode: 'NAT-TU', subjectName: 'Ciencias de la Tierra y el Universo', optativeExitName: null, modalityCode: 'academic' }
    const description = 'Los estudiantes realizarán una exposición individual en la que explicarán qué son los volcanes, cómo se forman, cuáles son sus principales partes, los diferentes tipos de erupciones y los riesgos que representan para las poblaciones cercanas. Podrán utilizar imágenes, esquemas o modelos como apoyo.'
    const result = recommend({ activityTitle: 'Exposición sobre los volcanes', description, maxScore: 20, participationMode: 'INDIVIDUAL' }, context, null, [], 'UNMAPPED', null)
    expect(result.criteria.map(criterion => criterion.title)).toEqual(expect.arrayContaining([expect.stringMatching(/forman los volcanes/), expect.stringMatching(/partes de los volcanes/), expect.stringMatching(/Precisión científica/)]))
    expect(result.criteria.filter(criterion => criterion.templateId === 'science-content')).toHaveLength(2)
    expect(result.criteria.every(criterion => criterion.sourceType !== 'CURRICULUM_DERIVED' && criterion.sourceReferences.length === 0)).toBe(true)
    expect(result.criteria.every(criterion => criterion.descriptors.every(descriptor => descriptor.text.length <= 240))).toBe(true)
  })
  it('contextualiza intención artística y contexto social sin mezclar ámbitos', () => {
    const art = run({ ...cases[5], activityTitle: 'Pintura sobre identidad cultural', description: 'Crear una pintura con símbolos de identidad cultural y explicar la composición.' }).result
    expect(art.criteria.some(criterion => /identidad cultural/.test(criterion.description))).toBe(true)
    expect(art.criteria.some(criterion => /Composición de la pintura/.test(criterion.title))).toBe(true)
    const socialContext: AcademicContext = { level: 'SECONDARY', cycle: 1, grade: 1, subjectCode: 'SOC', subjectName: 'Ciencias Sociales', optativeExitName: null, modalityCode: 'academic' }
    const social = recommend({ activityTitle: 'Investigación sobre migraciones', description: 'Comparar causas y consecuencias de las migraciones con fuentes.', maxScore: 20, participationMode: 'INDIVIDUAL' }, socialContext, null, [], 'UNMAPPED', null)
    expect(social.criteria.some(criterion => /migraciones/.test(criterion.description))).toBe(true)
    expect(social.criteria.every(criterion => !criterion.sourceReferences.length)).toBe(true)
  })
  it('no adjunta una fuente temática a una frase tomada del docente', () => {
    const { context, resolution } = run(cases[1])
    const within = elements.find(element => element.scopeId === resolution.scope!.id)!
    const result = recommend({ activityTitle: 'Exposición sobre el sistema respiratorio',
      description: 'Explicarán cómo se forman los órganos y describirán sus partes principales.',
      maxScore: 20, participationMode: 'INDIVIDUAL', selectedCurriculumElementIds: [within.elementId] },
    context, resolution.scope, elements, resolution.status, 'DRAFT')
    expect(result.selectedCurriculumElements).toHaveLength(1)
    expect(result.criteria.filter(criterion => criterion.templateId === 'science-content').every(criterion => criterion.sourceType === 'CONTEXTUALIZED' && criterion.sourceReferences.length === 0)).toBe(true)
  })
  it('el tema de materia no hereda volcán y conserva observación y registro', () => {
    const fixture = { ...cases[1], activityTitle: 'Cambios de estado de la materia', description: 'Los estudiantes observarán situaciones cotidianas en las que la materia cambia de estado, como el derretimiento del hielo o la evaporación del agua. Luego identificarán si ocurre fusión, evaporación, condensación o solidificación, registrarán sus observaciones en una tabla y explicarán con sus propias palabras qué provoca cada cambio.' }
    const result = run(fixture).result
    expect(JSON.stringify(result.criteria).toLowerCase()).not.toContain('volcán')
    expect(JSON.stringify(result.criteria).toLowerCase()).toContain('fusión')
    expect(result.activityType).toBe('OBSERVATION')
    expect(result.criteria.map(criterion => criterion.templateId)).toContain('science-data')
    expect(result.criteria.filter(criterion => criterion.templateId === 'science-content')).toHaveLength(2)
    expect(result.criteria.some(criterion => criterion.title.includes('Explicación de qué provoca cada cambio'))).toBe(true)
  })
  it('distingue problemas con fracciones y producción de un cuento', () => {
    const math = run(cases[2]).result
    expect(math.criteria.map(criterion => criterion.templateId)).toEqual(expect.arrayContaining(['math-procedure', 'math-reasoning', 'math-accuracy']))
    expect(math.criteria.some(criterion => criterion.description.includes('fracciones'))).toBe(true)
    const story = run({ ...cases[4], activityTitle: 'Producción de un cuento corto', description: 'Escribir un cuento corto con desarrollo coherente y vocabulario adecuado.' }).result
    expect(story.criteria.map(criterion => criterion.title)).toContain('Estructura narrativa del cuento')
    expect(story.criteria.some(criterion => criterion.description.includes('cuento corto'))).toBe(true)
    expect(JSON.stringify(story.criteria)).not.toMatch(/volcan|científic/)
  })
  it('catálogo global: IDs únicos, tipos existentes y referencias coherentes', () => {
    for (const entries of [evaluationCatalogV1.activityTypes, evaluationCatalogV1.criterionTemplates, evaluationCatalogV1.recommendationRules]) expect(new Set(entries.map(e => e.id)).size).toBe(entries.length)
    expect(evaluationCatalogV1.activityTypes).toHaveLength(20)
    for (const rule of evaluationCatalogV1.recommendationRules) expect(evaluationCatalogV1.instrumentTemplates.map(t => t.id)).toContain(rule.instrument)
  })
})
