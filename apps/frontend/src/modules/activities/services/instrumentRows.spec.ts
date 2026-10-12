import { describe, expect, it } from 'vitest'
import {
  duplicateInstrumentRow,
  shiftInstrumentRows,
  swapInstrumentRows,
} from '../components/editor/instrumentEditorShared'

const fields = {
  'rubrica:criterion-id:0': 'a',
  'rubrica:criterion-id:1': 'b',
  'rubrica:criterion:0': 'A',
  'rubrica:criterion:1': 'B',
  'rubrica:description:0': 'Descripción A',
  'rubrica:description:1': 'Descripción B',
  'rubrica:descriptor:0:1': 'Descriptor A',
  'rubrica:descriptor:1:1': 'Descriptor B',
  'rubrica:meta:scoreWeights': '[2,7]',
}
describe('instrument row identity', () => {
  it('preserves historical point proportions when remembered weights are absent', () => {
    const historical = { ...fields, 'rubrica:points:0': '3', 'rubrica:points:1': '7' }
    delete (historical as Record<string, string>)['rubrica:meta:scoreWeights']
    const result = swapInstrumentRows(historical, 'rubrica', 0, 1, ['criterion'])
    expect(JSON.parse(result['rubrica:meta:scoreWeights'])).toEqual([7, 3])
  })
  it('duplicates all row content with a fresh identity and its relative weight', () => {
    const result = duplicateInstrumentRow(fields, 'rubrica', 0)
    expect(result['rubrica:criterion-id:2']).not.toBe('a')
    expect(result['rubrica:criterion-id:2']).toMatch(/^[0-9a-f-]{36}$/)
    expect(result['rubrica:description:2']).toBe('Descripción A')
    expect(result['rubrica:descriptor:2:1']).toBe('Descriptor A')
    expect(JSON.parse(result['rubrica:meta:scoreWeights'])).toEqual([2, 7, 2])
  })
  it('moves identity, description, descriptors and remembered weights with the row', () => {
    const result = swapInstrumentRows(fields, 'rubrica', 0, 1, ['criterion'])
    expect(result['rubrica:criterion-id:0']).toBe('b')
    expect(result['rubrica:description:0']).toBe('Descripción B')
    expect(result['rubrica:descriptor:0:1']).toBe('Descriptor B')
    expect(JSON.parse(result['rubrica:meta:scoreWeights'])).toEqual([7, 2])
  })
  it('removes a whole row without retaining another row’s provenance or weights', () => {
    const result = shiftInstrumentRows(fields, 'rubrica', 0, 2, ['criterion'])
    expect(result['rubrica:criterion-id:0']).toBe('b')
    expect(result['rubrica:descriptor:0:1']).toBe('Descriptor B')
    expect(result['rubrica:criterion-id:1']).toBeUndefined()
    expect(JSON.parse(result['rubrica:meta:scoreWeights'])).toEqual([7])
  })
})
