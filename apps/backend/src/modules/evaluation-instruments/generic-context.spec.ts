import { describe, expect, it } from 'vitest'
import { recommend, detectActivityType } from './recommendation-engine'
import { evaluationCatalogCurrent, evaluationCatalogForVersion } from './catalog-current'

const base = { activityTitle: 'Actividad', participationMode: 'INDIVIDUAL' as const, maxScore: 20 }
const generate = (input: Parameters<typeof recommend>[0]) => recommend(input, null, null, [], 'UNMAPPED', null)

describe('recovered generic context without replacing authored detectors', () => {
  it.each([['debate', 'DEBATE'], ['mapa-conceptual', 'CONCEPT_MAP'], ['prueba-escrita', 'QUIZ_TEST']])('falls back to the selected technique %s when the task is unspecified', (evaluationTechnique, type) => {
    expect(generate({ ...base, evaluationTechnique }).activityType).toBe(type)
  })
  it('keeps the explicit evidence action ahead of an unrelated selected technique', () => {
    expect(generate({ ...base, description: 'Elaborarán un informe sobre la práctica motriz.', evaluationTechnique: 'debate' }).activityType).toBe('REPORT')
  })
  it('uses evidence instructions and requested priorities to include questions in an oral product', () => {
    const result = generate({ ...base, activityTitle: 'Exposición sobre diversidad', evidenceInstructions: 'Responder preguntas',
      resources: ['Diapositivas'], evaluationPriorities: ['Uso de recursos de apoyo'] })
    expect(result.criteria.map(item => item.templateId)).toEqual(expect.arrayContaining(['oral-mastery', 'oral-resources', 'oral-responses']))
    expect(result.criteria.reduce((sum, item) => sum + item.maxScoreUnits, 0)).toBe(2000)
  })
  it('provides concept hierarchy and meaningful links for concept maps', () => {
    const result = generate({ ...base, activityTitle: 'Mapa conceptual de diversidad' })
    expect(result.criteria.map(item => item.templateId)).toEqual(expect.arrayContaining(['concept-hierarchy', 'concept-relations']))
  })
  it.each([
    ['Exposición sobre diversidad', 'EXPOSITION'],
    ['Ensayo sobre diversidad', 'ESSAY'],
    ['Informe sobre diversidad', 'REPORT'],
  ])('keeps map and debate criteria out of %s', (activityTitle, activityType) => {
    const result = generate({ ...base, activityTitle })
    expect(result.activityType).toBe(activityType)
    expect(result.criteria.filter(item => /^(?:concept|debate)-/.test(item.templateId))).toEqual([])
  })
  it('assesses debate argumentation, replies, turns and individual evidence within group organization', () => {
    const result = generate({ ...base, activityTitle: 'Debate sobre diversidad', organizationMode: 'GROUP' })
    expect(result.criteria.map(item => item.title)).toEqual(expect.arrayContaining(['Argumentación con razones y evidencias',
      'Respuesta a los argumentos del otro equipo', 'Escucha y respeto de los turnos', 'Aporte individual']))
    expect(result.participationMode).toBe('INDIVIDUAL')
    expect(new Set(result.criteria.map(item => item.id)).size).toBe(result.criteria.length)
    expect(result.criteria.every(item => item.sourceReferences.length === 0)).toBe(true)
  })
  it('retains the historical detector and templates for snapshot release 46', () => {
    const previous = evaluationCatalogForVersion('evaluation-2026.46')!
    expect(detectActivityType('Exposición', '', previous).id).toBe('EXPOSITION')
    expect(previous.criterionTemplates.some(item => item.id === 'oral-mastery')).toBe(false)
    expect(evaluationCatalogCurrent.criterionTemplates.some(item => item.id === 'oral-mastery')).toBe(true)
  })
  it('keeps a supporting news resource from selecting the authored news provider', () => {
    const context = { level: 'SECONDARY' as const, cycle: 1, grade: 2, subjectCode: 'LEN', subjectName: 'Lengua Española',
      modalityCode: 'academic', optativeExitName: null }
    const request = { ...base, activityTitle: 'Investigación sobre diversidad', description: 'Elaborarán un informe con resultados y conclusiones de su investigación.' }
    const original = recommend(request, context, null, [], 'UNMAPPED', null)
    const extended = recommend({ ...request, resources: ['Noticias de prensa'] }, context, null, [], 'UNMAPPED', null)
    expect(original.criteria.every(criterion => criterion.templateId.startsWith('task-report-'))).toBe(true)
    expect(extended.criteria.map(criterion => criterion.templateId)).toEqual(original.criteria.map(criterion => criterion.templateId))
  })
})
