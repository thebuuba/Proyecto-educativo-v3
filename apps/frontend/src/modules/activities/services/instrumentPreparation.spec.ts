import { describe, expect, it } from 'vitest'
import type { InstrumentRecommendation } from '@aula/shared'
import { alignRecommendationWithFields, buildEditableInstrumentTemplate, preparationFingerprint, recommendationToFields } from './instrumentPreparation'

function proposal(type: InstrumentRecommendation['instrumentType']): InstrumentRecommendation {
  return {
    kind: 'RECOMMENDATION', catalogVersion: 'evaluation-2026.1', instrumentType: type, confidence: 'LOW',
    activityType: 'EXPERIMENT', evidenceTypes: ['PERFORMANCE'], participationMode: 'INDIVIDUAL',
    curriculumVersionId: null, curriculumScopeId: null, selectedCurriculumElements: [],
    criteria: [{ id: 'one', templateId: 'a', title: 'Procedimiento', description: 'Realiza los pasos.', maxScore: 7.25,
      maxScoreUnits: 725, sourceType: 'ACTIVITY_TEMPLATE', sourceReferences: [],
      descriptors: [{ levelId: 'L4', text: 'Realiza todos los pasos.', scoreUnits: 725 }, { levelId: 'L3', text: 'Realiza la mayoría de los pasos.', scoreUnits: 483 },
        { levelId: 'L2', text: 'Realiza algunos pasos.', scoreUnits: 242 }, { levelId: 'L1', text: 'Requiere acompañamiento.', scoreUnits: 0 }] },
    { id: 'two', templateId: 'b', title: 'Comunicación', description: 'Comunica los resultados.', maxScore: 3,
      maxScoreUnits: 300, sourceType: 'ACTIVITY_TEMPLATE', sourceReferences: [], descriptors: [{ levelId: 'L4', text: 'Comunica todos los resultados.', scoreUnits: 300 },
        { levelId: 'L3', text: 'Comunica la mayoría de los resultados.', scoreUnits: 200 }, { levelId: 'L2', text: 'Comunica algunos resultados.', scoreUnits: 100 },
        { levelId: 'L1', text: 'Requiere acompañamiento.', scoreUnits: 0 }] }],
    levels: [{ id: 'L4', label: 'Excelente', proportion: 1 }, { id: 'L3', label: 'Bien', proportion: 2 / 3 },
      { id: 'L2', label: 'En proceso', proportion: 1 / 3 }, { id: 'L1', label: 'Inicio', proportion: 0 }],
    totalScore: 10.25, totalScoreUnits: 1025, scoreUnit: 0.01,
    internalTrace: { mappingStatus: 'NO_PUBLISHED_VERSION', reasons: [], ruleId: 'x', activityTypeOrigin: 'DETECTED',
      ranking: [], curriculumStatus: null, lowCurriculumConfidence: true, consideredTypes: [] },
  }
}

describe('adaptación del instrumento preparado', () => {
  for (const type of ['rubrica', 'escala', 'lista-cotejo', 'lista-ponderada'] as const) it(`conserva ${type} y el total exacto`, () => {
    const original = proposal(type)
    const fields = recommendationToFields(original, 'Mi experimento')
    expect(fields[`${type}:meta:criteriaCount`]).toBe('2')
    expect(fields[`${type}:criterion-id:0`]).toBe('one')
    expect(fields[`${type}:criterion:0`]).toBe(type === 'rubrica' ? 'Procedimiento' : 'Realiza los pasos.')
    if (type === 'rubrica') expect(fields['rubrica:descriptor:0:4']).toBe('Realiza todos los pasos.')
    if (type === 'rubrica') expect([4, 3, 2, 1].map(level => Number(fields[`rubrica:level-points:${level}`]))).toEqual([1, 2 / 3, 1 / 3, 0])
    if (type === 'escala') expect(fields['escala:descriptor:0:4']).toBe('Realiza todos los pasos.')
    if (type === 'lista-ponderada') expect(Number(fields['lista-ponderada:weight:0']) + Number(fields['lista-ponderada:weight:1'])).toBe(100)
    const aligned = alignRecommendationWithFields(original, fields, 10.25)
    expect(aligned?.totalScoreUnits).toBe(1025)
    expect(aligned?.criteria).toHaveLength(2)
  })
  it('no guarda un valor cambiado sin actualizar puntos', () => {
    const original = proposal('rubrica')
    expect(alignRecommendationWithFields(original, recommendationToFields(original, 'Mi experimento'), 20)).toBeNull()
  })
  it('una edición manual queda reflejada en el snapshot y no se atribuye al currículo', () => {
    const original = proposal('rubrica')
    const fields = recommendationToFields(original, 'Mi experimento')
    fields['rubrica:criterion:0'] = 'Mi criterio observado'
    const aligned = alignRecommendationWithFields(original, fields, 10.25)
    expect(aligned?.criteria[0].title).toBe('Mi criterio observado')
    expect(aligned?.criteria[0].sourceType).toBe('ACTIVITY_TEMPLATE')
  })
  it('una lista ponderada mantiene exactamente las centésimas con pesos fraccionarios', () => {
    const original = proposal('lista-ponderada')
    const fields = recommendationToFields(original, 'Mi experimento')
    fields['lista-ponderada:weight:0'] = '33.33'
    fields['lista-ponderada:weight:1'] = '66.67'
    expect(alignRecommendationWithFields(original, fields, 10.25)?.totalScoreUnits).toBe(1025)
  })
  it('detecta cambios de título y descripción sin alterar el texto del docente', () => {
    const input = { name: 'Experimeto', description: 'Descripción', maxScore: '10.25', activityType: 'individual', instrumentType: 'rubrica' }
    expect(preparationFingerprint(input)).not.toBe(preparationFingerprint({ ...input, name: 'Experimento' }))
    expect(input.name).toBe('Experimeto')
  })
  it('crea una plantilla editable específica para la exposición de células y conserva el puntaje', () => {
    const template = buildEditableInstrumentTemplate({ activityTitle: 'Exposición sobre las células',
      description: 'Los estudiantes exponen sobre las células, sus partes y su importancia', participationMode: 'INDIVIDUAL', maxScore: 17.35 })
    expect(template.internalTrace.mappingStatus).toBe('EDITABLE_TEMPLATE')
    expect(template.criteria.map(criterion => criterion.title)).toEqual([
      'Comprensión del concepto de célula', 'Partes principales y sus funciones', 'Importancia de las células',
      'Dominio del tema y precisión científica', 'Organización de la exposición', 'Claridad de la comunicación oral',
    ])
    expect(template.criteria.reduce((sum, criterion) => sum + criterion.maxScoreUnits, 0)).toBe(1735)
    expect(template.selectedCurriculumElements).toEqual([])
    expect(template.criteria.some(criterion => criterion.templateId === 'optional-visual-resources')).toBe(false)
    const withVisuals = buildEditableInstrumentTemplate({ activityTitle: 'Exposición sobre las células', participationMode: 'INDIVIDUAL', maxScore: 17.35 }, true)
    expect(withVisuals.criteria.at(-1)?.title).toBe('Uso de recursos visuales')
    expect(withVisuals.totalScoreUnits).toBe(1735)
  })
})
