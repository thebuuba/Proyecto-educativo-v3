import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createElement } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { appRoutes, navigationRoutes } from './appRoutes'

describe('navegación curricular', () => {
  it('mantiene la ruta antigua sin mostrar Matriz curricular en el panel lateral', () => {
    expect(appRoutes.find((route) => route.path === '/matriz')?.showInSidebar).toBe(false)
    expect(navigationRoutes.some((route) => route.path === '/matriz')).toBe(false)
    expect(navigationRoutes.some((route) => route.path === '/planificaciones')).toBe(true)
  })
})

describe('matrícula dentro de Cursos', () => {
  it('redirige el acceso global antiguo a Cursos sin mostrarlo en la navegación', async () => {
    const legacyRoute = appRoutes.find((route) => route.path === '/estudiantes')!
    expect(navigationRoutes.some((route) => route.path === '/estudiantes')).toBe(false)
    render(createElement(MemoryRouter, { initialEntries: ['/estudiantes'] },
      createElement(Routes, null,
        createElement(Route, { path: '/estudiantes', element: createElement(legacyRoute.component) }),
        createElement(Route, { path: '/cursos', element: createElement('h1', null, 'Cursos disponibles') }),
      ),
    ))
    expect(await screen.findByRole('heading', { name: 'Cursos disponibles' })).toBeInTheDocument()
  })
})
