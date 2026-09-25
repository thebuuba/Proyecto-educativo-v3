import { describe, expect, it } from 'vitest'

import { getSubjectPalette } from './subjectPalette'

describe('getSubjectPalette', () => {
  it('mantiene el color aunque cambien mayúsculas o acentos', () => {
    expect(getSubjectPalette('Matemática')).toEqual(getSubjectPalette('MATEMATICA'))
    expect(getSubjectPalette('Educación Física')).toEqual(getSubjectPalette('educacion fisica'))
  })

  it('distingue materias con familias visuales diferentes', () => {
    expect(getSubjectPalette('Lengua Española').color).not.toBe(getSubjectPalette('Ciencias Sociales').color)
    expect(getSubjectPalette('Lenguas Extranjeras: Inglés').color).not.toBe(getSubjectPalette('Lenguas Extranjeras: Francés').color)
    expect(getSubjectPalette('Salida Optativa: Ciencias y Tecnología').color).not.toBe(getSubjectPalette('Salida Optativa: Matemática y Tecnología').color)
    expect(getSubjectPalette('Salida Optativa: Humanidades y Lenguas').color).not.toBe(getSubjectPalette('Salida Optativa: Ciencias y Tecnología').color)
  })

  it('deriva la rama suave del color personalizado de una materia', () => {
    const palette = getSubjectPalette('Matemática', '#123456')
    expect(palette.color).toBe('#123456')
    expect(palette.soft).toContain('#123456')
  })
})
