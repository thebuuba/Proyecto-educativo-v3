import { describe, expect, it } from 'vitest'

import {
  findCurriculumSubject,
  getCurriculumForGrade,
  secondaryGradeFromName,
  secondaryCurriculumSubjects,
  secondaryGrades,
} from './secondaryCurriculumCatalog'

describe('catálogo curricular de secundaria', () => {
  it('mantiene los seis grados en orden y dentro de su ciclo', () => {
    expect(secondaryGrades.map((item) => item.grade)).toEqual([1, 2, 3, 4, 5, 6])
    expect(secondaryGrades.map((item) => item.cycle)).toEqual([
      'Primer ciclo', 'Primer ciclo', 'Primer ciclo',
      'Segundo ciclo', 'Segundo ciclo', 'Segundo ciclo',
    ])
  })

  it('ofrece nueve mallas comunes por grado y las optativas solo en segundo ciclo', () => {
    expect(getCurriculumForGrade(1)).toHaveLength(9)
    expect(getCurriculumForGrade(3)).toHaveLength(9)
    expect(getCurriculumForGrade(4)).toHaveLength(15)
    expect(getCurriculumForGrade(6)).toHaveLength(15)
    expect(getCurriculumForGrade(3).some((item) => item.track)).toBe(false)
    expect(getCurriculumForGrade(4).filter((item) => item.track)).toHaveLength(6)
  })

  it('conserva rangos de páginas válidos para las 72 mallas por grado', () => {
    const entries = secondaryGrades.flatMap(({ grade }) =>
      getCurriculumForGrade(grade).map((subject) => subject.pages[grade]!),
    )

    expect(entries).toHaveLength(72)
    expect(entries.every(({ start, end }) => start > 0 && end >= start && end <= 385)).toBe(true)
    expect(secondaryCurriculumSubjects[0]?.pages[1]).toEqual({ start: 24, end: 27 })
  })

  it('relaciona los nombres usados por Cursos con su malla oficial', () => {
    expect(secondaryGradeFromName('4.º de Secundaria')).toBe(4)
    expect(findCurriculumSubject(4, 'Educación Física')?.id).toBe('educacion-fisica')
    expect(findCurriculumSubject(5, 'Ciencias de la Naturaleza: Química')?.id).toBe('ciencias-naturaleza')
    expect(findCurriculumSubject(6, 'Salida Optativa', 'optativa-ciencias-tecnologia')?.id).toBe('optativa-ciencias-tecnologia')
  })
})
