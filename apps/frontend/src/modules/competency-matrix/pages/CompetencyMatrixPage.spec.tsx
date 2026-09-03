import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { CompetencyMatrixPage } from './CompetencyMatrixPage'

describe('CompetencyMatrixPage', () => {
  it('abre una selección secundaria mediante parámetros y muestra sus datos reales', () => {
    render(
      <MemoryRouter initialEntries={['/planificaciones?tab=curriculo&level=secondary&cycle=first&grade=2&subjectId=ciencias-naturaleza']}>
        <CompetencyMatrixPage embedded />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Ciencias de la Vida' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Competencias específicas' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Indicadores de logro' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Usar en planificación/ })).toHaveAttribute('href', expect.stringContaining('action=nueva'))
  })

  it('permite cambiar a Primaria sin mezclar el catálogo de Secundaria', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><CompetencyMatrixPage embedded /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: 'Primaria' }))

    expect(screen.getByText('No encontramos información curricular para esta selección.')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Lengua Española' })).not.toBeInTheDocument()
  })

  it('busca dentro de competencias, contenidos e indicadores', () => {
    render(
      <MemoryRouter initialEntries={['/planificaciones?tab=curriculo&level=secondary&cycle=second&grade=4&q=Genética']}>
        <CompetencyMatrixPage embedded />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Biología' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Educación Física/ })).not.toBeInTheDocument()
  })
})
