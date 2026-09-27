import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'
import { evaluationCatalogV1 } from './catalog-v1'
import { academicContext, resolveScope, type AcademicContext, type ScopeCandidate } from './curriculum-context'
import { recommend, distributeScore, type RankedElement } from './recommendation-engine'

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
      expect(criterion.sourceType === 'ACTIVITY_TEMPLATE').toBe(criterion.sourceReferences.length === 0)
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
    expect(result.criteria.every(c => c.sourceType === 'ACTIVITY_TEMPLATE' && !c.sourceReferences.length)).toBe(true)
    expect(result.evidenceTypes).not.toContain('ATTITUDE')
  })
  it('tolera tildes/caso/plurales, selección explícita y escalas configurables', () => {
    expect(run(cases[1], { activityTitle: 'EXPOSICION sobre el SISTEMA CIRCULATORIO' }).result).toEqual(run().result)
    expect(run(cases[1], { pedagogicalActivityType: 'OBSERVATION' }).result.activityType).toBe('OBSERVATION')
    expect(run(cases[1], { levelCount: 5 }).result.levels.map(l => l.label)).toEqual(evaluationCatalogV1.descriptorPatterns.scales[5])
    expect(() => run(cases[1], { pedagogicalActivityType: 'INVALID' })).toThrow()
  })
  it('reparto entero exacto para 10.000 combinaciones', () => {
    for (let units = 1; units <= 10000; units++) expect(distributeScore(units / 100, [5, 5, 4, 3, 3]).reduce((a, b) => a + b, 0)).toBe(units)
    for (const value of [NaN, Infinity, -1, 0, 1.001]) expect(() => distributeScore(value, [1, 2])).toThrow()
  })
  it('catálogo global: IDs únicos, tipos existentes y referencias coherentes', () => {
    for (const entries of [evaluationCatalogV1.activityTypes, evaluationCatalogV1.criterionTemplates, evaluationCatalogV1.recommendationRules]) expect(new Set(entries.map(e => e.id)).size).toBe(entries.length)
    expect(evaluationCatalogV1.activityTypes).toHaveLength(20)
    for (const rule of evaluationCatalogV1.recommendationRules) expect(evaluationCatalogV1.instrumentTemplates.map(t => t.id)).toContain(rule.instrument)
  })
})
