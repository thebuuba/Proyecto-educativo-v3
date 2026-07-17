import { describe, expect, it } from 'vitest'

import { getRequestedCompetencyBlockId } from '@/modules/grading/utils/competencyGrades'

describe('acceso contextual al creador de actividades', () => {
  it.each(['b1', 'b2', 'b3', 'b4'] as const)('conserva el bloque %s recibido en la URL', (blockId) => {
    const searchParams = new URLSearchParams({ competencyBlockId: blockId })

    expect(getRequestedCompetencyBlockId(searchParams)).toBe(blockId)
  })

  it('descarta identificadores de bloque desconocidos', () => {
    expect(getRequestedCompetencyBlockId(new URLSearchParams({ competencyBlockId: 'b8' }))).toBeUndefined()
  })
})
