import { describe, expect, it } from 'vitest'

import { getSubjectPalette } from './subjectPalette'

describe('getSubjectPalette', () => {
  it('respeta la identidad de asignatura dentro de la paleta oficial', () => {
    expect(getSubjectPalette('Matemática', '#10B981').color).toBe('#10B981')
    expect(getSubjectPalette('Matemática', '#8B5CF6')).toEqual(getSubjectPalette('Matemática'))
  })

  it('mantiene el color aunque cambien mayúsculas o acentos', () => {
    expect(getSubjectPalette('Matemática')).toEqual(getSubjectPalette('MATEMATICA'))
    expect(getSubjectPalette('Educación Física')).toEqual(getSubjectPalette('educacion fisica'))
  })

  it('distingue materias con familias visuales diferentes', () => {
    expect(getSubjectPalette('Lengua Española').color).not.toBe(getSubjectPalette('Ciencias Sociales').color)
  })
})
