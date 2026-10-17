import { describe, expect, it } from 'vitest'
import { adaptLanguageScale } from '@aula/shared'
import { editableFallbackRecommendation, recommendationToFields } from './instrumentPreparation'
import { fillAuthoredLevelDescriptors } from './instrumentCriterionAddition'

describe('progresión persistida de la escala', () => {
  it.each(['grado', 'frecuencia'])('reconstruye cinco niveles sin cambiar los descriptores visibles de %s', mode => {
    const proposal = editableFallbackRecommendation({ activityTitle: 'Rutina', description: 'Presentarán oralmente su rutina diaria en inglés.', academicContext: { level: 'SECONDARY', grade: 1, subjectCode: 'ING' }, instrumentType: 'escala', participationMode: 'INDIVIDUAL', maxScore: 20 })
    const scale = adaptLanguageScale(proposal, mode === 'frecuencia' ? 'Observa la frecuencia de las respuestas.' : 'Valora el grado de cumplimiento.')
    const fields = recommendationToFields(scale, 'Rutina')
    fields['escala:meta:levelCount'] = '5'
    for (let level = 1; level <= 5; level++) fields[`escala:descriptor:0:${level}`] = ''
    const filled = fillAuthoredLevelDescriptors(fields, 'escala')
    expect(filled['escala:descriptor:0:5']).toBe(scale.criteria[0].descriptors[0].text)
    expect(filled['escala:descriptor:0:1']).toBe(scale.criteria[0].descriptors.at(-1)!.text)
    expect(scale.criteria[0].progressionLevels).toContain(filled['escala:descriptor:0:3'])
  })
})
