import { describe, expect, it } from 'vitest'

import { defaultAcademicStructure } from './academicAssignmentCatalog'

describe('catálogo de asignaciones académicas', () => {
  it('usa las seis asignaturas optativas oficiales y códigos únicos en cada grado del segundo ciclo', () => {
    const secondary = defaultAcademicStructure.find((level) => level.code === 'secondary')
    const secondCycle = secondary?.cycles.find((cycle) => cycle.code === 'secondary-second-cycle')

    for (const grade of secondCycle?.grades ?? []) {
      const optatives = grade.subjects?.filter((subject) => subject.code.startsWith('OPT-')) ?? []
      expect(optatives).toHaveLength(6)
      expect(new Set(optatives.map((subject) => subject.code)).size).toBe(6)
      expect(optatives.every((subject) => !subject.name.startsWith('Salida Optativa:'))).toBe(true)
    }
    const allCodes = secondCycle?.grades.flatMap((grade) =>
      grade.subjects?.filter((subject) => subject.code.startsWith('OPT-')).map((subject) => subject.code) ?? [],
    ) ?? []
    expect(new Set(allCodes).size).toBe(18)
    expect(secondCycle?.grades[0]?.subjects?.slice(0, 5).map((subject) => subject.name)).toEqual([
      'Lengua Española',
      'Apreciación y Producción Literarias',
      'Apreciación y Producción Literaria',
      'Lenguas Extranjeras: Inglés',
      'Manejo de la Información en Inglés',
    ])
  })
})
