import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { LegacySubscriptionRedirect } from './App'

function Destination() {
  const { search } = useLocation()
  return <p data-testid="destination">{search}</p>
}

describe('redirección de la suscripción antigua', () => {
  it('lleva /cuenta/suscripcion a la categoría de suscripción conservando los parámetros', () => {
    render(
      <MemoryRouter initialEntries={['/cuenta/suscripcion?origen=vencido']}>
        <Routes>
          <Route path="/cuenta/suscripcion" element={<LegacySubscriptionRedirect />} />
          <Route path="/configuracion" element={<Destination />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByTestId('destination')).toHaveTextContent('tab=suscripcion')
    expect(screen.getByTestId('destination')).toHaveTextContent('origen=vencido')
  })
})
