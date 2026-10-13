import { describe, expect, it } from 'vitest'
import type { InstrumentRecommendation } from '@aula/shared'
import { alignRecommendationWithFields, editableFallbackRecommendation, preparationFingerprint, recommendationToFields } from './instrumentPreparation'

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
    expect(fields[`${type}:criterion:0`]).toBe('Procedimiento')
    if (type === 'rubrica') expect(fields['rubrica:descriptor:0:4']).toBe('Realiza todos los pasos.')
    if (type === 'rubrica') expect([4, 3, 2, 1].map(level => Number(fields[`rubrica:level-points:${level}`]))).toEqual([3, 2, 1, 0])
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
  it('ofrece una plantilla editable contextual de guía turística durante un fallo', () => {
    const fallback = editableFallbackRecommendation({ activityTitle: 'Conoce mi comunidad', description: 'Crear una guía turística con portada, tres lugares, imágenes y cierre.', maxScore: 17.35, instrumentType: 'rubrica', participationMode: 'INDIVIDUAL' })
    expect(fallback.criteria.map(item => item.title)).toEqual(expect.arrayContaining(['Información de los lugares', 'Estructura de la guía']))
    expect(fallback.totalScoreUnits).toBe(1735)
    expect(JSON.stringify(fallback.criteria)).toContain('imágenes solicitadas')
    expect(fallback.internalTrace.mappingStatus).toBe('FALLBACK')
  })
  it('distingue los descriptores del informe y propone criterios distintos al regenerar', () => {
    const input = { activityTitle: 'Informe de lectura de un cuento', description: 'Elaborarán un informe de lectura con resumen, personajes, valores y conclusión.',
      activityType: 'READING_REPORT_WRITING', maxScore: 20, instrumentType: 'rubrica' as const, participationMode: 'INDIVIDUAL' as const }
    const first = editableFallbackRecommendation(input)
    const second = editableFallbackRecommendation({ ...input, variation: 1 })
    expect(first.criteria[0].descriptors[0].text).toContain('Resume las ideas principales')
    expect(first.criteria[0].descriptors[0].text).not.toContain('Lo evidencia de forma completa')
    expect(first.criteria[0].descriptors[0].text).not.toBe(first.criteria[1].descriptors[0].text)
    expect(second.criteria[0].title).toBe('Identificación de la obra')
    expect(second.criteria.map(item => item.title)).not.toEqual(first.criteria.map(item => item.title))
    expect(second.totalScoreUnits).toBe(2000)
  })
  it('mantiene la comparación de informes en los cuatro formatos de recuperación', () => {
    for (const maxScore of [20, 17.35]) for (const instrumentType of ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const) {
      const fallback = editableFallbackRecommendation({ activityTitle: 'Informe de lectura',
        description: 'Compararán dos informes e identificarán diferencias en su estructura.',
        activityType: 'READING_REPORT_COMPARISON', maxScore, instrumentType, participationMode: 'GROUP' })
      expect(fallback.activityType).toBe('READING_REPORT_COMPARISON')
      expect(fallback.criteria.map(item => item.title)).toContain('Comparación de estructura')
      expect(fallback.totalScoreUnits).toBe(Math.round(maxScore * 100))
    }
  })
  it('la plantilla de análisis no exige producir una guía ni recursos ausentes', () => {
    const fallback = editableFallbackRecommendation({ activityTitle: 'La guía turística', description: 'Leer una guía turística e identificar su estructura.', maxScore: 20, instrumentType: 'lista-cotejo', participationMode: 'INDIVIDUAL' })
    expect(fallback.criteria.map(item => item.title)).toContain('Identificación de la estructura')
    expect(JSON.stringify(fallback.criteria)).not.toMatch(/crear|elaborar|mapa/i)
  })
  it('precarga una plantilla contextual para un afiche cuando falla el servicio', () => {
    const fallback = editableFallbackRecommendation({ activityTitle: 'Cuidemos el agua', description: 'Elaborarán un afiche con recomendaciones e imágenes para ahorrar agua.', maxScore: 17.35, instrumentType: 'rubrica', participationMode: 'INDIVIDUAL' })
    expect(fallback.criteria.map(item => item.title)).toContain('Mensaje sobre el cuidado y ahorro del agua')
    expect(fallback.totalScoreUnits).toBe(1735)
    expect(JSON.stringify(fallback.criteria)).toContain('imágenes solicitadas')
  })
  it('la plantilla de análisis de afiche interpreta sin exigir creación', () => {
    const fallback = editableFallbackRecommendation({ activityTitle: 'Mensajes que convencen', description: 'Analizarán un afiche de prevención e identificarán su propósito y destinatarios.', maxScore: 20, instrumentType: 'lista-cotejo', participationMode: 'INDIVIDUAL' })
    expect(fallback.criteria.map(item => item.title)).toContain('Interpretación del mensaje')
    expect(JSON.stringify(fallback.criteria)).not.toMatch(/elabora|crear otro afiche/i)
  })
  it('precarga el cuento detectivesco y conserva el informe como producto distinto', () => {
    const story = editableFallbackRecommendation({ activityTitle: 'Misterio', description: 'Escribirán un cuento detectivesco con pistas y desenlace.', maxScore: 17.35, instrumentType: 'rubrica', participationMode: 'INDIVIDUAL' })
    expect(story.criteria.map(item => item.title)).toContain('Misterio, pistas y resolución')
    const report = editableFallbackRecommendation({ activityTitle: 'Informe', description: 'Redactarán un informe de lectura sobre un cuento detectivesco.', maxScore: 20, instrumentType: 'lista-cotejo', participationMode: 'INDIVIDUAL' })
    expect(report.criteria.map(item => item.title)).toContain('Estructura del informe')
  })
  it('precarga un caligrama en verso libre sin exigir rima', () => {
    const fallback = editableFallbackRecommendation({ activityTitle: 'Árbol', description: 'Escribirán un poema y distribuirán sus versos formando la silueta de un árbol; pueden usar verso libre.', maxScore: 20, instrumentType: 'escala', participationMode: 'INDIVIDUAL' })
    expect(fallback.criteria.map(item => item.title)).toContain('Tema y figura')
    expect(JSON.stringify(fallback.criteria)).toContain('sin exigir rima')
  })
})


describe('alternativa local de La noticia en 2.º de secundaria', () => {
  it.each([
    ['NEWS_WRITING', 'Redactarán una noticia sobre educación.', 'Información esencial de la noticia'],
    ['NEWS_ANALYSIS', 'Leerán y analizarán una noticia sobre inmigración.', 'Intención comunicativa de la noticia'],
    ['NEWS_COMPARISON', 'Compararán dos noticias sobre un hecho.', 'Hecho y propósito de ambas noticias'],
    ['NEWSCAST', 'Presentarán oralmente una noticia sobre educación.', 'Contenido de la noticia presentada'],
    ['DEBATE', 'Debatirán el hecho de una noticia con evidencias.', 'Comprensión del hecho noticioso'],
    ['REPORT', 'Elaborarán un informe escrito sobre una noticia.', 'Propósito del informe sobre la noticia'],
  ])('conserva %s contextualizado en cuatro formatos', (activityType, description, firstCriterion) => {
    for (const instrumentType of ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const) {
      const proposal = editableFallbackRecommendation({ activityTitle: 'La noticia', description, activityType,
        secondaryLanguageGrade: 2, maxScore: 17.35, instrumentType, participationMode: 'INDIVIDUAL' })
      expect(proposal.criteria[0].title).toBe(firstCriterion)
      expect(proposal.totalScoreUnits).toBe(1735)
      expect(proposal.criteria.reduce((sum, item) => sum + item.maxScoreUnits, 0)).toBe(1735)
      expect(proposal.instrumentType).toBe(instrumentType)
    }
  })
})

describe('informe de lectura de la actividad real', () => {
  it.each(['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const)('redactar después de leer prepara %s para producción escrita', instrumentType => {
    const result = editableFallbackRecommendation({ activityTitle: 'Un cuento en pocas palabras',
      description: 'Los estudiantes leerán un cuento y redactarán un informe de lectura con introducción, resumen de las ideas principales, análisis de los personajes y conclusión personal.',
      maxScore: 20, instrumentType, participationMode: 'INDIVIDUAL' })
    expect(result.criteria.map(item => item.title)).toContain('Resumen del texto')
    expect(result.criteria.map(item => item.title)).toContain('Análisis de los personajes')
    expect(result.criteria.map(item => item.title)).toContain('Conclusión personal')
    expect(JSON.stringify(result.criteria)).not.toMatch(/sociocultural|dicción|volumen|informe que lee/)
    expect(result.totalScoreUnits).toBe(2000)
    expect(alignRecommendationWithFields(result, recommendationToFields(result, 'Un cuento en pocas palabras'), 20)?.totalScoreUnits).toBe(2000)
  })
})

describe('reconciliación de todos los campos editables', () => {
  it('adapts existing recommendation proportions without replacing them by level order', () => {
    const original = proposal('rubrica')
    original.levels[1].proportion = 0.9
    const result = alignRecommendationWithFields(original, recommendationToFields(original, 'Experiment'), 10.25)
    expect(result?.levels[1].proportion).toBe(0.9)
  })
  it('conserva etiquetas y proporciones de nivel personalizadas', () => {
    const original = proposal('rubrica')
    const fields = recommendationToFields(original, 'Experimento')
    fields['rubrica:level-name:3'] = 'Con autonomía'
    fields['rubrica:level-points:4'] = '10'
    fields['rubrica:level-points:3'] = '9'
    fields['rubrica:level-points:2'] = '2'
    fields['rubrica:level-points:1'] = '0'
    const result = alignRecommendationWithFields(original, fields, 10.25)
    expect(result?.levels[1]).toMatchObject({ label: 'Con autonomía', proportion: 0.9 })
    expect(result?.criteria[0].descriptors[1].scoreUnits).toBe(653)
  })
  it('usa el indicador ponderado final y elimina su atribución anterior', () => {
    const original = proposal('lista-ponderada')
    original.criteria[0].sourceType = 'CURRICULUM_DERIVED'
    const fields = recommendationToFields(original, 'Experimento')
    fields['lista-ponderada:indicator:0'] = 'Indicador de la docente'
    const result = alignRecommendationWithFields(original, fields, 10.25)
    expect(result?.criteria[0].description).toBe('Indicador de la docente')
    expect(result?.criteria[0].sourceType).toBe('ACTIVITY_TEMPLATE')
  })
  it('conserva la identidad al mover filas', () => {
    const original = proposal('lista-cotejo')
    const fields = recommendationToFields(original, 'Experimento')
    for (const kind of ['criterion', 'description', 'points', 'criterion-id']) {
      const a = fields[`lista-cotejo:${kind}:0`]
      fields[`lista-cotejo:${kind}:0`] = fields[`lista-cotejo:${kind}:1`]
      fields[`lista-cotejo:${kind}:1`] = a
    }
    expect(alignRecommendationWithFields(original, fields, 10.25)?.criteria.map(item => item.id)).toEqual(['two', 'one'])
  })
  it('acepta asignaciones cero por reparto de un total pequeño', () => {
    const original = proposal('lista-cotejo')
    const fields = recommendationToFields(original, 'Experimento')
    fields['lista-cotejo:points:0'] = '0.01'
    fields['lista-cotejo:points:1'] = '0'
    expect(alignRecommendationWithFields(original, fields, 0.01)?.totalScoreUnits).toBe(1)
  })
  it('adapta las cinco etiquetas y proporciones de una escala', () => {
    const original = proposal('escala')
    original.levels = Array.from({length: 5}, (_, index) => ({id: `L${5-index}`, label: `Nivel ${5-index}`, proportion: (5-index)/5}))
    const fields = recommendationToFields(original, 'Experimento')
    fields['escala:level-name:5'] = 'Siempre'
    fields['escala:level-points:4'] = '4.5'
    const result = alignRecommendationWithFields(original, fields, 10.25)
    expect(result?.levels).toHaveLength(5)
    expect(result?.levels[0].label).toBe('Siempre')
    expect(result?.levels[1].proportion).toBe(0.9)
    expect(result?.criteria[0].descriptors).toHaveLength(5)
  })
})
