import { describe, expect, it } from 'vitest'
import { detectSecondaryLanguageActivity, findSecondaryLanguageTopic, validateInstrumentDefinition } from '@aula/shared'
import { editableFallbackRecommendation, recommendationToFields } from './instrumentPreparation'
import { scoreInstrumentFields } from './instrumentScoring'

const tasks = [
  'Analiza la guía turística e identifica cómo orienta al visitante.',
  'Escribe un artículo expositivo sobre el ahorro de agua con organización problema-solución.',
  'Redacta un informe de lectura sobre el cuento leído y resume sus ideas.',
  'Analiza el cuento de amor y amistad e identifica el conflicto entre sus personajes.',
  'Recita una décima espinela respetando su ritmo.',
]
const context = { level: 'SECONDARY' as const, grade: 2, subjectCode: 'LEN' }

describe('grade two editable offline coverage', () => {
  for (const format of ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const) {
    it.each(tasks)(`${format} retains contextual content with pending and immediate decimal scoring: %s`, description => {
      const topic = findSecondaryLanguageTopic('Actividad', description, context)!
      const proposal = editableFallbackRecommendation({ activityTitle: 'Actividad', description, maxScore: 20, instrumentType: format, participationMode: 'INDIVIDUAL', secondaryLanguageGrade: 2, activityType: detectSecondaryLanguageActivity('Actividad', description, context)! })
      expect(proposal.internalTrace.reasons).toContain(`module=lengua-secundaria-2-${topic.id}`)
      expect(proposal.criteria.every(row => row.templateId.startsWith('len-2-'))).toBe(true)
      const initial = recommendationToFields(proposal, 'Actividad')
      const pending = scoreInstrumentFields(initial, format, null, proposal)
      expect(pending[`${format}:meta:scorePending`]).toBe('true')
      const scored = scoreInstrumentFields(pending, format, 17.35, proposal)
      expect(validateInstrumentDefinition(format, scored, 17.35)).toEqual([])
      const criteriaKeys = Object.keys(initial).filter(key => key.includes(':criterion:') || key.includes(':description:') || key.includes(':descriptor:'))
      for (const key of criteriaKeys) expect(scored[key]).toBe(initial[key])
    })
  }
})
