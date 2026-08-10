import { describe, expect, it } from 'vitest'

import { getSubjectPalette } from './subjectPalette'

describe('getSubjectPalette', () => {
  it('mantiene el color aunque cambien mayúsculas o acentos', () => {
    expect(getSubjectPalette('Matemática')).toEqual(getSubjectPalette('MATEMATICA'))
    expect(getSubjectPalette('Educación Física')).toEqual(getSubjectPalette('educacion fisica'))
  })

  it('distingue materias con familias visuales diferentes', () => {
    expect(getSubjectPalette('Lengua Española').color).not.toBe(getSubjectPalette('Ciencias Sociales').color)
  })
})
