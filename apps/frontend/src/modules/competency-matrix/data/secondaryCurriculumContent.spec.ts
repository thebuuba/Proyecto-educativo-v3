import { describe, expect, it } from 'vitest'

import { secondaryGrades } from './secondaryCurriculumCatalog'
import {
  curriculumFieldsAreEmpty,
  curriculumFieldsMatch,
  getSecondaryCurriculumContent,
  secondaryCurriculumContent,
} from './secondaryCurriculumContent'

describe('contenido oficial de las mallas de secundaria', () => {
  it('incluye las 72 combinaciones de curso y malla sin campos curriculares vacíos', () => {
    expect(secondaryCurriculumContent).toHaveLength(72)
    expect(new Set(secondaryCurriculumContent.map((item) => item.key)).size).toBe(72)

    for (const item of secondaryCurriculumContent) {
      expect(item.fundamentalCompetencies).toHaveLength(7)
      expect(item.specificCompetence.trim()).not.toBe('')
      expect(item.contentConceptual.trim()).not.toBe('')
      expect(item.contentProcedural.trim()).not.toBe('')
      expect(item.contentAttitudinal.trim()).not.toBe('')
      expect(item.achievementIndicator.trim()).not.toBe('')
    }

    for (const { grade } of secondaryGrades) {
      expect(secondaryCurriculumContent.filter((item) => item.grade === grade)).toHaveLength(grade < 4 ? 9 : 15)
    }
  })

  it('recupera los datos propios de cada curso y asignatura', () => {
    const firstSpanish = getSecondaryCurriculumContent(1, 'lengua-espanola')
    const fourthBiology = getSecondaryCurriculumContent(4, 'ciencias-naturaleza')

    expect(firstSpanish?.sourcePages).toEqual({ start: 69, end: 75 })
    expect(firstSpanish?.contentConceptual).toContain('La noticia')
    expect(fourthBiology?.sourcePages).toEqual({ start: 312, end: 315 })
    expect(fourthBiology?.contentConceptual).toContain('Genética')
  })

  it('solo permite reemplazar automáticamente campos vacíos o todavía oficiales', () => {
    const curriculum = getSecondaryCurriculumContent(1, 'matematica')!
    const emptyFields = {
      specificCompetence: '', contentConceptual: '', contentProcedural: '',
      contentAttitudinal: '', achievementIndicator: '',
    }
    const officialFields = {
      specificCompetence: curriculum.specificCompetence,
      contentConceptual: curriculum.contentConceptual,
      contentProcedural: curriculum.contentProcedural,
      contentAttitudinal: curriculum.contentAttitudinal,
      achievementIndicator: curriculum.achievementIndicator,
    }

    expect(curriculumFieldsAreEmpty(emptyFields)).toBe(true)
    expect(curriculumFieldsMatch(officialFields, curriculum)).toBe(true)
    expect(curriculumFieldsMatch({ ...officialFields, specificCompetence: 'Edición docente' }, curriculum)).toBe(false)
  })
})
