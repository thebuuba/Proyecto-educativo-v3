import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { catalogFingerprint } from './catalog-fingerprint'

const sha = (value: string) => createHash('sha256').update(value).digest('hex')
describe('huella del catálogo con representación JSONB de PostgreSQL', () => {
  it('ordena claves por bytes UTF-8, no por inserción, longitud UTF-16 ni locale', () => {
    const expected = '{"b": 1, "aa": 2, "zz": 3, "á": 4, "€": 5, "😀": 6}'
    expect(catalogFingerprint({ '😀': 6, '€': 5, 'á': 4, zz: 3, aa: 2, b: 1 })).toBe(sha(expected))
  })
  it('conserva orden de arrays, escapes, nulos, booleanos y contenedores vacíos', () => {
    const expected = String.raw`{"a": [2, 1, null, true, false, {}, [], {"z": "línea\n\t\"\\"}], "b": -7}`
    expect(catalogFingerprint({ b: -7, a: [2, 1, null, true, false, {}, [], { z: 'línea\n\t"\\' }] })).toBe(sha(expected))
  })
  it('normaliza los opcionales igual que el payload JSON enviado por el instalador', () => {
    expect(catalogFingerprint({ keep: 1, omit: undefined })).toBe(catalogFingerprint({ keep: 1 }))
  })
  it('detecta cambios de contenido y de orden de evidencias', () => {
    expect(catalogFingerprint({ criteria: ['a', 'b'] })).not.toBe(catalogFingerprint({ criteria: ['b', 'a'] }))
    expect(catalogFingerprint({ criteria: ['a', 'b'] })).not.toBe(catalogFingerprint({ criteria: ['a', 'c'] }))
  })
  it.each([0.1, 1e21, Number.MAX_SAFE_INTEGER + 1])('rechaza números fuera del contrato entero del catálogo: %s', number => {
    expect(() => catalogFingerprint({ weight: number })).toThrow('entero seguro')
  })
})
