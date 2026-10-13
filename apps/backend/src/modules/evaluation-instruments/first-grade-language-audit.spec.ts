import { describe, expect, it } from 'vitest'
import { detectActivityType, recommend } from './recommendation-engine'
import { detectSecondaryLanguageActivity } from '@aula/shared'
import type { AcademicContext } from './curriculum-context'

const context: AcademicContext = { level: 'SECONDARY', cycle: 1, grade: 1, subjectCode: 'LEN', subjectName: 'Lengua Española', modalityCode: 'academic', optativeExitName: null }
describe('re-audit of existing first grade language modules', () => {
  it('does not choose a genre mentioned only as a resource', () => {
    expect(detectSecondaryLanguageActivity('Actividad', 'Analiza las diferencias entre las expresiones. Recursos: un caligrama.', context)).toBeNull()
  })
  it('keeps the generic classifier on the action rather than a resource task', () => {
    expect(detectActivityType('Actividad', 'Compara resultados. Recursos: redactar un texto.', undefined, false).id).toBe('COMPARISON')
  })
  it('does not require images because they are listed as resources', () => {
    const result = recommend({ activityTitle: 'Guía turística', description: 'Elabora una guía turística. Recursos: mapas e imágenes.',
      participationMode: 'INDIVIDUAL', maxScore: 20 }, context, null, [], 'NO_MAPPING', null)
    expect(result.criteria.map(row => row.description).join(' ')).not.toMatch(/imágenes solicitadas|recursos gráficos solicitados/i)
  })
  it('does not assess personal confidence in a newscast', () => {
    const result = recommend({ activityTitle: 'Noticiero', description: 'Presenta una noticia en un noticiero.',
      participationMode: 'GROUP', maxScore: 20 }, context, null, [], 'NO_MAPPING', null)
    expect(result.criteria.map(row => row.description).join(' ')).not.toContain('con seguridad')
  })
  it.each([
    ['NEWS_ANALYSIS', 'Presentarán un noticiero con noticias de la comunidad.', 'Identificación de sus partes'],
    ['NEWS_COMPARISON', 'Leerán y analizarán una noticia de la comunidad.', 'Comparación de la información'],
    ['NEWS_WRITING', 'Analizarán una noticia y presentarán un noticiero.', 'Titular, entrada y cuerpo'],
  ])('keeps criteria for the teacher-selected %s', (activity, description, criterion) => {
    const result = recommend({ activityTitle: 'La noticia', description, pedagogicalActivityType: activity,
      participationMode: 'INDIVIDUAL', maxScore: 20 }, context, null, [], 'NO_MAPPING', null)
    expect(result.activityType).toBe(activity)
    expect(result.criteria.map(row => row.title)).toContain(criterion)
  })
})
