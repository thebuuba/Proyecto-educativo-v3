import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { recommend, detectActivityType } from './recommendation-engine'
import { resolveScope, type AcademicContext } from './curriculum-context'

const root = resolve(process.cwd(), '../..')
const cases = JSON.parse(readFileSync(resolve(root, 'data/evaluation-instruments/science-regressions.json'), 'utf8'))
const rows = readFileSync(resolve(root, 'data/curriculum/secondary-2023.jsonl'), 'utf8').trim().split('\n').map(line => JSON.parse(line))
const scopes = rows.filter(row => row.kind === 'scope')
const elements = rows.filter(row => row.kind === 'element').map(row => ({ elementId: row.id, scopeId: scopes.find(scope => scope.stableKey === row.scopeKey).id,
  versionId: row.versionId, type: row.type, text: row.originalText, normalizedText: row.normalizedText,
  sources: [{ documentId: row.source.documentId, pdfPage: row.source.pdfPage, printedPage: row.source.printedPage }] }))
describe('Consignas científicas, ámbito real y cuatro instrumentos', () => {
  it('mantiene una producción artística real aun con título neutral', () => {
    expect(detectActivityType('Actividad','Los estudiantes elaborarán un dibujo de un paisaje usando color y composición para expresar su creatividad.').id).toBe('ARTISTIC_PRODUCTION')
  })
  for (const fixture of cases) for (const format of ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const) for (const maxScore of [20, 17.35]) for (const neutral of [false, true]) {
    it(`${fixture.id} ${format} ${maxScore} título neutral=${neutral}`, () => {
      const context: AcademicContext = { level: 'SECONDARY', cycle: fixture.grade <= 3 ? 1 : 2, grade: fixture.grade, subjectCode: fixture.code, subjectName: fixture.name, modalityCode: 'academic', optativeExitName: null }
      const resolution = resolveScope(context, scopes)
      expect(resolution.status).toBe('RESOLVED')
      const result = recommend({ ...fixture, activityTitle: neutral ? 'Actividad de aprendizaje' : fixture.activityTitle, maxScore, participationMode: 'INDIVIDUAL', preferredInstrumentType: format }, context, resolution.scope, elements, resolution.status, 'DRAFT')
      expect(result.activityType).toBe(fixture.expectedType)
      expect(result.criteria).toHaveLength(5)
      expect(result.criteria.every(c => c.templateId.startsWith(`science-${fixture.id}-`))).toBe(true)
      expect(result.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
      expect(JSON.stringify(result.criteria)).not.toContain('Explica con precisión el contenido trabajado')
    })
  }
})
