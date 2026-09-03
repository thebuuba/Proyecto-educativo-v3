import { describe, expect, it } from 'vitest'

import { appRoutes, navigationRoutes } from './appRoutes'

describe('navegación curricular', () => {
  it('mantiene la ruta antigua sin mostrar Matriz curricular en el panel lateral', () => {
    expect(appRoutes.find((route) => route.path === '/matriz')?.showInSidebar).toBe(false)
    expect(navigationRoutes.some((route) => route.path === '/matriz')).toBe(false)
    expect(navigationRoutes.some((route) => route.path === '/planificaciones')).toBe(true)
  })
})
