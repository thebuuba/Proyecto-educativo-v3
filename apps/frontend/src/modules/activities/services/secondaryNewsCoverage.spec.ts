import { describe, expect, it } from 'vitest'
import { editableFallbackRecommendation } from './instrumentPreparation'
import { recommend } from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'

const context = { level: 'SECONDARY' as const, cycle: 1, grade: 2, subjectCode: 'LEN', subjectName: 'Lengua Española', modalityCode: 'academic', optativeExitName: null }
const tasks = [
  ['NEWS_WRITING', 'Redacta una noticia sobre el ambiente.'],
  ['NEWS_ANALYSIS', 'Analiza una noticia sobre educación.'],
  ['NEWS_COMPARISON', 'Compara dos noticias sobre educación.'],
  ['NEWSCAST', 'Presenta una noticia en un noticiero.'],
  ['REPORT', 'Redacta un informe sobre una noticia.'],
  ['DEBATE', 'Debate sobre una noticia.'],
] as const
describe('shared authored news evidence for secondary grade two', () => {
  it('accepts reading supports without imposing unrequested questions in the newscast', () => {
    const remote = recommend({ activityTitle: 'Actividad', description: 'Presenta una noticia en un noticiero.',
      participationMode: 'GROUP', maxScore: 20, preferredInstrumentType: 'rubrica' }, context, null, [], 'NO_MAPPING', null)
    expect(JSON.stringify(remote.criteria)).not.toMatch(/depende de la lectura|responde preguntas|preguntas simples/i)
  })
  for (const instrumentType of ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const) {
    it.each(tasks)(`${instrumentType} keeps online and editable content and decimal weights equal: %s`, (activityType, description) => {
      const input = { activityTitle: 'Actividad', activityType, description, instrumentType, participationMode: 'INDIVIDUAL' as const, maxScore: 17.35, secondaryLanguageGrade: 2 as const }
      const fallback = editableFallbackRecommendation(input)
      const remote = recommend({ ...input, pedagogicalActivityType: activityType, preferredInstrumentType: instrumentType }, context, null, [], 'NO_MAPPING', null)
      expect(fallback.criteria.map(row => [row.templateId, row.title, row.description, row.maxScoreUnits, row.descriptors.map(level => level.text)]))
        .toEqual(remote.criteria.map(row => [row.templateId, row.title, row.description, row.maxScoreUnits, row.descriptors.map(level => level.text)]))
    })
  }
  it.each(tasks)('keeps five observable levels rather than repeating the objective: %s', (activityType, description) => {
    const remote = recommend({ activityTitle: 'Actividad', description, pedagogicalActivityType: activityType,
      participationMode: 'INDIVIDUAL', maxScore: 20, levelCount: 5, preferredInstrumentType: 'rubrica' }, context, null, [], 'NO_MAPPING', null)
    for (const criterion of remote.criteria) {
      expect(criterion.descriptors).toHaveLength(5)
      expect(criterion.descriptors[1].text).not.toContain(criterion.description.replace(/\.$/, ''))
      expect(new Set(criterion.descriptors.map(level => level.text)).size).toBe(5)
    }
  })
})
