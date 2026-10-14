import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ReadOnlyInstrument } from './ReadOnlyInstrument'

describe('visor del instrumento: evidencia legible', () => {
  const fields = { 'lista-cotejo:meta:criterionCount': '1', 'lista-cotejo:meta:pointsMode': 'individual',
    'lista-cotejo:criterion:0': 'Identifica las ideas principales.', 'lista-cotejo:description:0': 'Identifica las ideas principales.', 'lista-cotejo:points:0': '20' }
  it('muestra una sola vez un indicador cuyo título y descripción coinciden', () => {
    render(<ReadOnlyInstrument type="lista-cotejo" fields={fields} maxScore={20} />)
    expect(within(screen.getAllByRole('row')[1]).getAllByText('Identifica las ideas principales.')).toHaveLength(1)
  })
  it('conserva una descripción que añade evidencia distinta al título', () => {
    render(<ReadOnlyInstrument type="lista-cotejo" fields={{ ...fields, 'lista-cotejo:description:0': 'Señala las ideas mediante fragmentos del texto.' }} maxScore={20} />)
    expect(screen.getByText('Señala las ideas mediante fragmentos del texto.')).toBeInTheDocument()
  })
})
