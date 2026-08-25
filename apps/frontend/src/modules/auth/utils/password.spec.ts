import { describe, expect, it } from 'vitest'

import { isValidPassword } from './password'

describe('isValidPassword', () => {
  it('exige longitud, mayúscula, minúscula y número', () => {
    expect(isValidPassword('Clave123')).toBe(true)
    expect(isValidPassword('clave123')).toBe(false)
    expect(isValidPassword('CLAVE123')).toBe(false)
    expect(isValidPassword('ClaveSegura')).toBe(false)
    expect(isValidPassword('Cla1')).toBe(false)
  })
})
