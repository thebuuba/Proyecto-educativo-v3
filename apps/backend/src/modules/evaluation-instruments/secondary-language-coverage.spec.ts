import { describe, expect, it } from 'vitest'
import { detectSecondaryLanguageActivity, firstSecondaryLanguageTechnique, editableSecondaryTopicRecommendation, findSecondaryLanguageTopic } from '@aula/shared'
import { recommend, assertValidRecommendation } from './recommendation-engine'
import type { AcademicContext } from './curriculum-context'

const context: AcademicContext = { level: 'SECONDARY', cycle: 1, grade: 2, subjectCode: 'LEN', subjectName: 'Lengua Española', modalityCode: 'academic', optativeExitName: null }
const cases = [
  ['La guía turística', 'Analiza la guía turística e identifica cómo orienta al visitante.', 'TOURIST_GUIDE_ANALYSIS', /guía|visitante|lugares/i],
  ['Actividad', 'Escribe un artículo expositivo sobre el ahorro de agua con organización problema-solución.', 'WRITTEN_PRODUCTION', /problema.*solución|artículo expositivo/i],
  ['Actividad', 'Redacta un informe de lectura sobre el cuento leído y resume sus ideas.', 'REPORT', /resum|informe de lectura/i],
  ['Actividad', 'Analiza el cuento de amor y amistad e identifica el conflicto entre sus personajes.', 'ANALYSIS', /personajes|conflicto/i],
  ['Actividad', 'Recita una décima espinela respetando su ritmo.', 'ORAL_PRESENTATION', /décima|octosílabo|rima/i],
] as const

describe('secondary language grade two contextual coverage', () => {
  it.each([
    ['Elabora una guía turística.', 'TOURIST_GUIDE_CREATION'],
    ['Compara dos guías turísticas.', 'TOURIST_GUIDE_COMPARISON'],
    ['Presenta una guía turística.', 'TOURIST_GUIDE_ANALYSIS'],
    ['Presenta oralmente una guía turística.', 'TOURIST_GUIDE_PRESENTATION'],
    ['Analiza un artículo expositivo.', 'ANALYSIS'],
    ['Compara artículos expositivos.', 'COMPARISON'],
    ['Expone un artículo expositivo.', 'ORAL_PRESENTATION'],
    ['Analiza un informe de lectura.', 'READING_REPORT_ANALYSIS'],
    ['Compara informes de lectura.', 'READING_REPORT_COMPARISON'],
    ['Presenta un informe de lectura.', 'READING_REPORT_ANALYSIS'],
    ['Presenta oralmente un informe de lectura.', 'READING_REPORT_PRESENTATION'],
    ['Escribe un cuento de amor y amistad.', 'WRITTEN_PRODUCTION'],
    ['Compara cuentos de amor y amistad.', 'COMPARISON'],
    ['Narra oralmente un cuento de amor y amistad.', 'ORAL_PRESENTATION'],
    ['Compone una décima espinela.', 'WRITTEN_PRODUCTION'],
    ['Analiza una décima espinela.', 'ANALYSIS'],
    ['Compara décimas espinelas.', 'COMPARISON'],
    ['Informe sobre un cuento de amor y amistad.', 'REPORT'],
  ])('recognizes short requested actions: %s', (description, activity) => {
    expect(detectSecondaryLanguageActivity('Actividad', description, context)).toBe(activity)
  })
  it.each(cases)('recognizes the requested product for %s', (title, description, activity) => {
    expect(detectSecondaryLanguageActivity(title, description, context)).toBe(activity)
  })
  for (const format of ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const) {
    it.each(cases)(`${format} has relevant observable content and exact decimal totals for %s`, (title, description, activity, content) => {
      const result = recommend({ activityTitle: title, description, participationMode: 'INDIVIDUAL', maxScore: 17.35, preferredInstrumentType: format }, context, null, [], 'NO_MAPPING', null)
      expect(result.activityType).toBe(activity)
      expect(result.instrumentType).toBe(format)
      expect(result.criteria.map(criterion => criterion.description).join(' ')).toMatch(content)
      expect(result.internalTrace.reasons).toEqual(expect.arrayContaining([expect.stringMatching(/^module=lengua-secundaria-2-/)]))
      expect(result.criteria.reduce((sum, criterion) => sum + criterion.maxScoreUnits, 0)).toBe(1735)
      expect(new Set(result.criteria.map(criterion => criterion.templateId)).size).toBe(result.criteria.length)
      if (format === 'rubrica' || format === 'escala') {
        for (const criterion of result.criteria) expect(new Set(criterion.descriptors.map(descriptor => descriptor.text)).size).toBe(result.levels.length)
      }
      assertValidRecommendation(result)
    })
  }
  it('treats researching as preparation for the oral product', () => {
    expect(detectSecondaryLanguageActivity('Investigación', 'Investiga la guía turística para presentar una exposición sobre los lugares descritos.', context)).toBe('TOURIST_GUIDE_PRESENTATION')
  })
  it('keeps reading analysis separate from creating a story', () => {
    const result = recommend({ activityTitle: 'Cuento de amor y amistad', description: 'Analiza el conflicto y las acciones de los personajes.', participationMode: 'INDIVIDUAL', maxScore: 20 }, context, null, [], 'NO_MAPPING', null)
    expect(result.activityType).toBe('ANALYSIS')
    expect(result.criteria.map(criterion => criterion.description).join(' ')).not.toMatch(/crea|escribe un cuento|redacta un cuento/i)
  })
  it('does not activate topics from another grade or subject', () => {
    expect(detectSecondaryLanguageActivity('Actividad', 'Recita una décima espinela.', { ...context, grade: 1 })).toBeNull()
    expect(detectSecondaryLanguageActivity('Actividad', 'Escribe un artículo expositivo.', { ...context, subjectCode: 'SOC' })).toBeNull()
  })
  it('preserves an explicit teacher type over inferred oral production', () => {
    const result = recommend({ activityTitle: 'Artículo expositivo', description: 'Investiga para exponer la relación problema-solución.', pedagogicalActivityType: 'REPORT', participationMode: 'GROUP', maxScore: 20 }, context, null, [], 'NO_MAPPING', null)
    expect(result.activityType).toBe('REPORT')
    expect(result.internalTrace.activityTypeOrigin).toBe('EXPLICIT')
  })
  it('suggests a real evidence technique for generic analysis and oral presentation', () => {
    expect(firstSecondaryLanguageTechnique('ANALYSIS')).toBe('analisis-producciones')
    expect(firstSecondaryLanguageTechnique('COMPARISON')).toBe('analisis-producciones')
    expect(firstSecondaryLanguageTechnique('ORAL_PRESENTATION')).toBe('presentacion')
  })
  it('does not classify a resource as the requested product', () => {
    expect(detectSecondaryLanguageActivity('Crear artículo expositivo', 'Analiza el artículo expositivo. Recursos: una guía redactada.', context)).toBe('ANALYSIS')
  })
  it('does not require every topic dimension when the teacher requests only structure analysis', () => {
    const result = recommend({ activityTitle: 'Guía turística', description: 'Identifica la estructura de la guía turística.', participationMode: 'INDIVIDUAL', maxScore: 20 }, context, null, [], 'NO_MAPPING', null)
    expect(result.criteria.some(criterion => criterion.templateId.endsWith('-organization'))).toBe(true)
    expect(result.criteria.some(criterion => criterion.templateId.endsWith('-places'))).toBe(false)
  })
  it('does not turn listed resources into mandatory graphics', () => {
    const result = recommend({ activityTitle: 'Guía turística', description: 'Analiza la guía turística. Recursos: mapas e imágenes.', participationMode: 'INDIVIDUAL', maxScore: 20 }, context, null, [], 'NO_MAPPING', null)
    expect(result.criteria.some(criterion => criterion.templateId.endsWith('-graphics'))).toBe(false)
  })
  it('uses the same exact relative allocation online and offline', () => {
    const input = { activityTitle: 'Guía turística', description: 'Elabora una guía turística.', participationMode: 'INDIVIDUAL' as const, maxScore: 20, instrumentType: 'rubrica' as const }
    const topic = findSecondaryLanguageTopic(input.activityTitle, input.description, context)!
    const local = editableSecondaryTopicRecommendation(topic, input)
    const remote = recommend({ ...input, preferredInstrumentType: input.instrumentType }, context, null, [], 'NO_MAPPING', null)
    expect(remote.criteria.map(criterion => criterion.maxScoreUnits)).toEqual([471, 588, 471, 470])
    expect(remote.criteria.map(criterion => criterion.maxScoreUnits)).toEqual(local.criteria.map(criterion => criterion.maxScoreUnits))
  })
  it('assesses recitation instead of imposing a written analysis of metre', () => {
    const result = recommend({ activityTitle: 'Actividad', description: 'Recita una décima espinela respetando el ritmo.', participationMode: 'INDIVIDUAL', maxScore: 20 }, context, null, [], 'NO_MAPPING', null)
    expect(result.criteria.map(row => row.description).join(' ')).not.toMatch(/explica el cómputo|organiza.*diez versos|identifica.*rima/i)
    expect(result.criteria.map(row => row.description).join(' ')).toMatch(/recit|entonación|ritmo/i)
  })
  it('assesses a narrated story without demanding literary analysis', () => {
    const result = recommend({ activityTitle: 'Actividad', description: 'Narra oralmente un cuento de amor y amistad.', participationMode: 'INDIVIDUAL', maxScore: 20 }, context, null, [], 'NO_MAPPING', null)
    expect(result.criteria.map(row => row.description).join(' ')).not.toMatch(/sustenta.*motivaciones|interpreta.*recursos|explica.*ambiente/i)
    expect(result.criteria.map(row => row.description).join(' ')).toMatch(/narra|narración/i)
  })
})
