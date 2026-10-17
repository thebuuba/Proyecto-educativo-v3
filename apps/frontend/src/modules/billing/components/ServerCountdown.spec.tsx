import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ServerCountdown } from '@/modules/billing/components/ServerCountdown'

describe('ServerCountdown', () => {
  it('calcula el tiempo restante a partir de serverNow, no del reloj del equipo', () => {
    render(
      <ServerCountdown target="2026-10-15T15:00:00.000Z" serverNow="2026-10-15T12:00:00.000Z" />,
    )
    expect(screen.getByText(/3 h/)).toBeInTheDocument()
  })

  it('muestra el texto alternativo cuando falta la fecha', () => {
    render(<ServerCountdown target={null} serverNow="2026-10-15T12:00:00.000Z" fallback="Sin fecha" />)
    expect(screen.getByText('Sin fecha')).toBeInTheDocument()
  })
})
